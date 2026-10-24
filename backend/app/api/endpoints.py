import io
import time
import json
import logging
from typing import Optional, List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from fastapi.responses import StreamingResponse

from app.core.config import settings
from app.schemas.resume import (
    HealthResponse,
    CustomizeResponse,
    CustomizedResume,
)
from app.services.parser import DocumentParserService, DocumentParserError
from app.services.gemini_service import GeminiResumeService
from app.services.export_service import ExportService

logger = logging.getLogger("resumecraft.api")
router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint providing backend status and configuration verification."""
    gemini_service = GeminiResumeService()
    return HealthResponse(
        status="ok",
        app_name=settings.APP_NAME,
        version="1.0.0",
        environment=settings.ENVIRONMENT,
        model_configured=settings.GEMINI_MODEL,
        api_key_configured=gemini_service.is_configured()
    )


@router.post("/api/customize", response_model=CustomizeResponse, tags=["Resume Customization"])
async def customize_resume(
    file: UploadFile = File(..., description="Resume in PDF or DOCX format"),
    job_description: str = Form(..., description="Target job description"),
    sections: Optional[str] = Form(None, description="Comma-separated or JSON list of sections to customize"),
    generate_cover_letter: bool = Form(False, description="Whether to also generate a matching cover letter")
):
    """
    Accepts resume file and job description, extracts text, calls Gemini AI to customize,
    and returns structured resume, keyword analysis, and match score.
    """
    start_time = time.time()

    # 1. Validate Job Description
    clean_jd = job_description.strip() if job_description else ""
    if len(clean_jd) < settings.MIN_JD_CHARS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Job description is too short ({len(clean_jd)} characters). Please provide at least {settings.MIN_JD_CHARS} characters."
        )
    if len(clean_jd) > settings.MAX_JD_CHARS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Job description exceeds maximum limit of {settings.MAX_JD_CHARS} characters."
        )

    # 2. Read and Validate Uploaded File
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided in upload."
        )

    try:
        content = await file.read()
    except Exception as e:
        logger.error("Failed to read uploaded file: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to read the uploaded file."
        )

    # 3. Extract and Parse Resume Text
    try:
        extracted_text, parse_meta = DocumentParserService.parse_document(
            filename=file.filename,
            content=content,
            max_file_size_bytes=settings.max_file_size_bytes
        )
    except DocumentParserError as dpe:
        logger.warning("Document parse error: %s", dpe.message)
        raise HTTPException(status_code=dpe.status_code, detail=dpe.message)
    except Exception as exc:
        logger.error("Unexpected error during parsing: %s", str(exc))
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to process document: {str(exc)}"
        )

    # 4. Parse sections filter if provided
    selected_sections = ["Summary", "Skills", "Experience", "Projects"]
    if sections:
        try:
            if sections.startswith("["):
                selected_sections = json.loads(sections)
            else:
                selected_sections = [s.strip() for s in sections.split(",") if s.strip()]
        except Exception:
            pass

    # 5. Invoke Gemini Service
    gemini_service = GeminiResumeService()
    tailored_resume = await gemini_service.customize_resume(
        resume_text=extracted_text,
        job_description=clean_jd,
        sections_to_customize=selected_sections,
        generate_cover_letter=generate_cover_letter
    )

    elapsed_ms = int((time.time() - start_time) * 1000)

    # Preview of extracted text for UI transparency
    text_preview = extracted_text[:300].strip() + ("..." if len(extracted_text) > 300 else "")

    return CustomizeResponse(
        success=True,
        resume=tailored_resume,
        extracted_text_preview=text_preview,
        meta={
            "filename": file.filename,
            "file_size_bytes": len(content),
            "model_used": settings.GEMINI_MODEL,
            "processing_time_ms": elapsed_ms,
            "parse_meta": parse_meta
        }
    )


@router.post("/api/export/pdf", tags=["Export"])
async def export_resume_pdf(resume: CustomizedResume):
    """Generates and streams a downloadable ATS-friendly PDF resume."""
    try:
        pdf_bytes = ExportService.generate_pdf(resume)
        safe_name = "".join(c for c in resume.candidate_name if c.isalnum() or c in (" ", "-", "_")).strip() or "Customized"
        filename = f"{safe_name.replace(' ', '_')}_Resume.pdf"

        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )
    except Exception as e:
        logger.error("PDF generation failed: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate PDF document: {str(e)}"
        )


@router.post("/api/export/docx", tags=["Export"])
async def export_resume_docx(resume: CustomizedResume):
    """Generates and streams a downloadable DOCX resume."""
    try:
        docx_bytes = ExportService.generate_docx(resume)
        safe_name = "".join(c for c in resume.candidate_name if c.isalnum() or c in (" ", "-", "_")).strip() or "Customized"
        filename = f"{safe_name.replace(' ', '_')}_Resume.docx"

        return StreamingResponse(
            io.BytesIO(docx_bytes),
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )
    except Exception as e:
        logger.error("DOCX generation failed: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate DOCX document: {str(e)}"
        )


@router.post("/api/export/cover-letter", tags=["Export"])
async def export_cover_letter(resume: CustomizedResume):
    """Generates and streams a downloadable PDF cover letter."""
    if not resume.cover_letter:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No cover letter available in the provided resume data."
        )
    try:
        pdf_bytes = ExportService.generate_cover_letter_pdf(resume)
        safe_name = "".join(c for c in resume.candidate_name if c.isalnum() or c in (" ", "-", "_")).strip() or "Candidate"
        filename = f"{safe_name.replace(' ', '_')}_Cover_Letter.pdf"

        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )
    except Exception as e:
        logger.error("Cover letter PDF generation failed: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate cover letter PDF: {str(e)}"
        )
