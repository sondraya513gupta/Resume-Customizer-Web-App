from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class TailoredExperienceItem(BaseModel):
    company: str = Field(description="Company or organization name")
    role: str = Field(description="Job title or role")
    location: Optional[str] = Field(default=None, description="Job location or Remote")
    start_date: Optional[str] = Field(default=None, description="Start date (Month Year)")
    end_date: Optional[str] = Field(default=None, description="End date (Month Year or Present)")
    original_bullets: List[str] = Field(default_factory=list, description="Original bullet points from resume")
    tailored_bullets: List[str] = Field(default_factory=list, description="Tailored, high-impact bullet points aligned with JD")


class TailoredEducationItem(BaseModel):
    institution: str = Field(description="University, college or educational institution")
    degree: str = Field(description="Degree or qualification")
    field_of_study: Optional[str] = Field(default=None, description="Major, field or department")
    graduation_date: Optional[str] = Field(default=None, description="Graduation date or expected")
    gpa_or_honors: Optional[str] = Field(default=None, description="GPA or honors if present in source resume")


class TailoredProjectItem(BaseModel):
    name: str = Field(description="Project title")
    description: str = Field(description="Impactful summary of project tailored to JD requirements")
    technologies: List[str] = Field(default_factory=list, description="Technologies and tools used")
    link_or_repo: Optional[str] = Field(default=None, description="Project URL or repository link if present")


class SkillsCategory(BaseModel):
    category: str = Field(description="Category name (e.g., Languages, Frameworks, Cloud, Databases)")
    skills: List[str] = Field(default_factory=list, description="Skills present in resume, prioritized for the JD")


class KeywordAnalysis(BaseModel):
    matched_keywords: List[str] = Field(default_factory=list, description="Keywords and requirements from JD present in resume")
    missing_keywords: List[str] = Field(default_factory=list, description="Keywords/skills requested by JD but NOT evidenced in source resume")
    supported_requirements: List[str] = Field(default_factory=list, description="JD requirements that are well evidenced")
    unsupported_requirements: List[str] = Field(default_factory=list, description="JD requirements with no evidence in the resume")
    recommendations: List[str] = Field(default_factory=list, description="Actionable recommendations to legitimately bridge gaps")


class MatchScoreBreakdown(BaseModel):
    overall_score: int = Field(ge=0, le=100, description="Heuristic overall match percentage")
    keyword_match_score: int = Field(ge=0, le=100, description="Keyword coverage percentage")
    skills_alignment_score: int = Field(ge=0, le=100, description="Skills alignment percentage")
    experience_fit_score: int = Field(ge=0, le=100, description="Experience & responsibility relevance percentage")
    methodology: str = Field(
        default="Heuristic weighted estimate (40% Keywords, 30% Skills, 30% Experience relevance). Not an official ATS score.",
        description="Explanation of score calculation"
    )


class CustomizedResume(BaseModel):
    candidate_name: str = Field(default="Candidate", description="Full name extracted from resume")
    contact_info: Dict[str, Optional[str]] = Field(
        default_factory=lambda: {"email": None, "phone": None, "linkedin": None, "github": None, "location": None},
        description="Contact information extracted from resume"
    )
    tailored_summary: str = Field(description="Customized professional summary targeted to the JD")
    original_summary: Optional[str] = Field(default=None, description="Original summary if extracted")
    skills: List[SkillsCategory] = Field(default_factory=list, description="Categorized relevant skills")
    experience: List[TailoredExperienceItem] = Field(default_factory=list, description="Experience section")
    education: List[TailoredEducationItem] = Field(default_factory=list, description="Education section")
    projects: List[TailoredProjectItem] = Field(default_factory=list, description="Projects section")
    certifications: List[str] = Field(default_factory=list, description="Certifications if present in resume")
    keyword_analysis: KeywordAnalysis = Field(default_factory=KeywordAnalysis, description="Keyword analysis")
    match_analysis: MatchScoreBreakdown = Field(default_factory=MatchScoreBreakdown, description="Match score breakdown")
    cover_letter: Optional[str] = Field(default=None, description="Optional tailored cover letter")
    customized_sections: List[str] = Field(default_factory=list, description="Sections customized by AI")


class CustomizeResponse(BaseModel):
    success: bool = True
    resume: CustomizedResume
    extracted_text_preview: str = Field(description="First 300 characters of extracted source text")
    meta: Dict[str, Any] = Field(default_factory=dict, description="Metadata including model, processing time, and file info")


class HealthResponse(BaseModel):
    status: str = "ok"
    app_name: str
    version: str
    environment: str
    model_configured: str
    api_key_configured: bool
