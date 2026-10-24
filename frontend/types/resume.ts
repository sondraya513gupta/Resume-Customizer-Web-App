export interface TailoredExperienceItem {
  company: string;
  role: string;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  original_bullets: string[];
  tailored_bullets: string[];
}

export interface TailoredEducationItem {
  institution: string;
  degree: string;
  field_of_study?: string | null;
  graduation_date?: string | null;
  gpa_or_honors?: string | null;
}

export interface TailoredProjectItem {
  name: string;
  description: string;
  technologies: string[];
  link_or_repo?: string | null;
}

export interface SkillsCategory {
  category: string;
  skills: string[];
}

export interface KeywordAnalysis {
  matched_keywords: string[];
  missing_keywords: string[];
  supported_requirements: string[];
  unsupported_requirements: string[];
  recommendations: string[];
}

export interface MatchScoreBreakdown {
  overall_score: number;
  keyword_match_score: number;
  skills_alignment_score: number;
  experience_fit_score: number;
  methodology: string;
}

export interface CustomizedResume {
  candidate_name: string;
  contact_info: {
    email?: string | null;
    phone?: string | null;
    linkedin?: string | null;
    github?: string | null;
    location?: string | null;
  };
  tailored_summary: string;
  original_summary?: string | null;
  skills: SkillsCategory[];
  experience: TailoredExperienceItem[];
  education: TailoredEducationItem[];
  projects: TailoredProjectItem[];
  certifications?: string[];
  keyword_analysis: KeywordAnalysis;
  match_analysis: MatchScoreBreakdown;
  cover_letter?: string | null;
  customized_sections?: string[];
}

export interface CustomizeResponse {
  success: boolean;
  resume: CustomizedResume;
  extracted_text_preview: string;
  meta: {
    filename: string;
    file_size_bytes: number;
    model_used: string;
    processing_time_ms: number;
    parse_meta?: Record<string, unknown>;
  };
}

export interface HealthResponse {
  status: string;
  app_name: string;
  version: string;
  environment: string;
  model_configured: string;
  api_key_configured: boolean;
}
