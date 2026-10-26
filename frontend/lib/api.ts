import { CustomizeResponse, HealthResponse, CustomizedResume } from "@/types/resume";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function checkBackendHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      throw new ApiError(`Health check failed with status ${res.status}`, res.status);
    }
    return await res.json();
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      "Unable to connect to backend server. Please verify the Python backend is running on port 8000.",
      503
    );
  }
}

export async function customizeResume(
  file: File,
  jobDescription: string,
  sections: string[],
  generateCoverLetter: boolean
): Promise<CustomizeResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_description", jobDescription);
  formData.append("sections", JSON.stringify(sections));
  formData.append("generate_cover_letter", String(generateCoverLetter));

  try {
    const res = await fetch(`${API_BASE_URL}/api/customize`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      let errorMessage = `Request failed with status ${res.status}`;
      try {
        const errorData = await res.json();
        if (errorData.detail) {
          errorMessage = typeof errorData.detail === "string" 
            ? errorData.detail 
            : JSON.stringify(errorData.detail);
        }
      } catch {
        // Fallback to text status
      }
      throw new ApiError(errorMessage, res.status);
    }

    return await res.json();
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      "Failed to communicate with the ResumeCraft AI service. Please check your connection.",
      500
    );
  }
}

export async function downloadResumePdf(resume: CustomizedResume): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/export/pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resume),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "PDF generation failed" }));
      throw new ApiError(err.detail || "Failed to download PDF", res.status);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = resume.candidate_name.replace(/[^a-zA-Z0-9]/g, "_") || "Customized";
    a.download = `${safeName}_Tailored_Resume.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("Failed to download PDF resume.", 500);
  }
}

export async function downloadResumeDocx(resume: CustomizedResume): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/export/docx`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resume),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "DOCX generation failed" }));
      throw new ApiError(err.detail || "Failed to download DOCX", res.status);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = resume.candidate_name.replace(/[^a-zA-Z0-9]/g, "_") || "Customized";
    a.download = `${safeName}_Tailored_Resume.docx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("Failed to download DOCX resume.", 500);
  }
}

export async function downloadCoverLetterPdf(resume: CustomizedResume): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/export/cover-letter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resume),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Cover letter PDF generation failed" }));
      throw new ApiError(err.detail || "Failed to download Cover Letter", res.status);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = resume.candidate_name.replace(/[^a-zA-Z0-9]/g, "_") || "Candidate";
    a.download = `${safeName}_Cover_Letter.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("Failed to download cover letter.", 500);
  }
}
