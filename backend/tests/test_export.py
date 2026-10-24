from app.schemas.resume import (
    CustomizedResume,
    SkillsCategory,
    TailoredExperienceItem,
    TailoredEducationItem,
    TailoredProjectItem,
    KeywordAnalysis,
    MatchScoreBreakdown
)
from app.services.export_service import ExportService


def get_mock_resume() -> CustomizedResume:
    return CustomizedResume(
        candidate_name="Jane Doe",
        contact_info={
            "email": "jane.doe@example.com",
            "phone": "+1 555-123-4567",
            "location": "New York, NY",
            "linkedin": "linkedin.com/in/janedoe",
            "github": "github.com/janedoe"
        },
        tailored_summary="Results-oriented Full Stack Engineer with proven expertise in building resilient cloud-native architectures.",
        skills=[
            SkillsCategory(category="Languages", skills=["TypeScript", "Python", "SQL"]),
            SkillsCategory(category="Frameworks", skills=["Next.js", "React", "FastAPI"])
        ],
        experience=[
            TailoredExperienceItem(
                company="TechCorp Solutions",
                role="Senior Full Stack Engineer",
                location="Remote",
                start_date="Jan 2022",
                end_date="Present",
                original_bullets=["Worked on backend APIs", "Built frontend with React"],
                tailored_bullets=[
                    "Architected high-throughput RESTful services in FastAPI, reducing average latency by 35%.",
                    "Developed responsive Next.js frontend features, improving mobile conversion rates by 22%."
                ]
            )
        ],
        education=[
            TailoredEducationItem(
                institution="Columbia University",
                degree="Bachelor of Science",
                field_of_study="Computer Science",
                graduation_date="May 2020"
            )
        ],
        projects=[
            TailoredProjectItem(
                name="CloudMetrics",
                description="Real-time observability platform processing 50k events/sec.",
                technologies=["FastAPI", "Next.js", "Redis"]
            )
        ],
        keyword_analysis=KeywordAnalysis(
            matched_keywords=["FastAPI", "React", "TypeScript", "Next.js"],
            missing_keywords=["Kubernetes"],
            supported_requirements=["Full stack development", "Cloud architecture"],
            unsupported_requirements=["Kubernetes cluster management"],
            recommendations=["Highlight containerization skills or complete a CKA tutorial."]
        ),
        match_analysis=MatchScoreBreakdown(
            overall_score=85,
            keyword_match_score=80,
            skills_alignment_score=90,
            experience_fit_score=85
        ),
        cover_letter="Dear Hiring Manager,\n\nI am thrilled to apply for the Full Stack Engineer role...",
        customized_sections=["Summary", "Skills", "Experience"]
    )


def test_pdf_export_generation():
    resume = get_mock_resume()
    pdf_bytes = ExportService.generate_pdf(resume)
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 1000
    assert pdf_bytes.startswith(b"%PDF-")


def test_docx_export_generation():
    resume = get_mock_resume()
    docx_bytes = ExportService.generate_docx(resume)
    assert isinstance(docx_bytes, bytes)
    assert len(docx_bytes) > 1000
    assert docx_bytes.startswith(b"PK\x03\x04")


def test_cover_letter_pdf_export():
    resume = get_mock_resume()
    cl_bytes = ExportService.generate_cover_letter_pdf(resume)
    assert isinstance(cl_bytes, bytes)
    assert len(cl_bytes) > 500
    assert cl_bytes.startswith(b"%PDF-")
