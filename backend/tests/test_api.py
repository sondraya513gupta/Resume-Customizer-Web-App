import io
from unittest.mock import patch, AsyncMock
import pytest
from fastapi.testclient import TestClient
from app.main import app
from tests.test_parser import create_sample_pdf
from tests.test_export import get_mock_resume

client = TestClient(app)


def test_health_check_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "ResumeCraft" in data["app_name"]
    assert "model_configured" in data
    assert "api_key_configured" in data


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Welcome" in data["message"]


def test_customize_endpoint_validation_errors():
    # Missing job description
    pdf_bytes = create_sample_pdf("Sample resume text with sufficient length to pass initial check.")
    response = client.post(
        "/api/customize",
        files={"file": ("resume.pdf", pdf_bytes, "application/pdf")},
        data={"job_description": "short"}
    )
    assert response.status_code == 400
    assert "Job description is too short" in response.json()["detail"]


@patch("app.services.gemini_service.GeminiResumeService.customize_resume")
def test_customize_endpoint_success(mock_customize):
    mock_resume = get_mock_resume()
    mock_customize.return_value = mock_resume

    pdf_content = (
        "Jane Doe\n"
        "jane@example.com | 555-0100\n"
        "Senior Software Engineer with 5 years building scalable web services in Python and React."
    )
    pdf_bytes = create_sample_pdf(pdf_content)

    valid_jd = (
        "We are looking for a Senior Full Stack Engineer with strong experience in FastAPI, "
        "Next.js, TypeScript, and cloud-native architecture. The candidate will design scalable APIs "
        "and collaborate with cross-functional product teams to deliver world-class software."
    )

    response = client.post(
        "/api/customize",
        files={"file": ("jane_resume.pdf", pdf_bytes, "application/pdf")},
        data={"job_description": valid_jd, "generate_cover_letter": "true"}
    )

    assert response.status_code == 200
    res_data = response.json()
    assert res_data["success"] is True
    assert res_data["resume"]["candidate_name"] == "Jane Doe"
    assert res_data["meta"]["model_used"] is not None
    assert "extracted_text_preview" in res_data


def test_export_pdf_endpoint():
    mock_resume = get_mock_resume()
    response = client.post("/api/export/pdf", json=mock_resume.model_dump())
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert response.content.startswith(b"%PDF-")


def test_export_docx_endpoint():
    mock_resume = get_mock_resume()
    response = client.post("/api/export/docx", json=mock_resume.model_dump())
    assert response.status_code == 200
    assert response.content.startswith(b"PK\x03\x04")


def test_export_cover_letter_endpoint():
    mock_resume = get_mock_resume()
    response = client.post("/api/export/cover-letter", json=mock_resume.model_dump())
    assert response.status_code == 200
    assert response.content.startswith(b"%PDF-")
