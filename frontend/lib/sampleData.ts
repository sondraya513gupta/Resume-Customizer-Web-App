/**
 * Sample resume and job description data for quick 1-click evaluation.
 */

export const SAMPLE_JOB_DESCRIPTION = `Senior Full-Stack Developer (Next.js & Python / FastAPI)
Company: Innovista Labs / ThePrepLab
Location: San Francisco, CA / Remote

About the Role:
We are seeking an exceptional Senior Full-Stack Developer to lead the architecture and development of our next-generation AI-powered career enablement platform. You will be responsible for building high-performance web applications, designing resilient backend microservices, and integrating cutting-edge LLM models.

Key Responsibilities:
• Build responsive, accessible, and high-performance frontend interfaces using Next.js (App Router), React, TypeScript, and Tailwind CSS.
• Design, implement, and maintain scalable RESTful APIs with Python and FastAPI.
• Integrate LLM APIs (Google Gemini, OpenAI) using robust prompt engineering, structured JSON outputs, and guardrails against hallucination.
• Optimize document extraction pipelines for high-throughput PDF and DOCX processing.
• Ensure high code quality through automated testing (Jest, Pytest), CI/CD pipelines, and cloud deployments (Docker, Render, Vercel).
• Collaborate with product managers and UI/UX designers to translate requirements into intuitive user experiences.

Qualifications & Requirements:
• 4+ years of professional full-stack web development experience.
• Strong proficiency in TypeScript, React, and modern Next.js features (Server Components, App Router).
• Solid experience building backend services in Python (FastAPI or Flask) with Pydantic validation.
• Practical hands-on experience integrating LLM APIs and prompt engineering.
• Familiarity with document manipulation libraries (PyMuPDF, pdfplumber, python-docx).
• Experience with cloud deployments, Docker containerization, and CORS security.
• BS or MS degree in Computer Science or equivalent practical experience.`;

export function createSampleResumePdfFile(): File {
  const sampleResumeText = `ALEX MORGAN
alex.morgan@email.com | (555) 345-6789 | San Francisco, CA | linkedin.com/in/alexmorgan | github.com/alexmorgan

PROFESSIONAL SUMMARY
Versatile Full-Stack Engineer with 5+ years of experience designing and deploying scalable web applications and distributed APIs. Specialized in TypeScript, React, Python, and cloud services with a strong focus on clean code and reliable system performance.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, SQL, HTML5, CSS3
Frameworks & Libraries: React, Next.js, FastAPI, Node.js, Express, Tailwind CSS
Databases & Cloud: PostgreSQL, Redis, MongoDB, AWS (S3, ECS), Docker
Tools & Testing: Git, GitHub Actions, Pytest, Jest, REST APIs

PROFESSIONAL EXPERIENCE
Senior Software Engineer | CloudScale Systems (2022 - Present) | San Francisco, CA
- Spearheaded the redesign of the core customer analytics dashboard using Next.js and TypeScript, reducing initial page load latency by 42%.
- Architected high-throughput REST APIs in Python FastAPI with Pydantic request validation, serving over 1.5 million requests daily with 99.95% uptime.
- Integrated AI-driven document summarization features using LLM APIs, implementing strict structured output parsing and retry mechanisms.
- Established automated end-to-end testing with Pytest and GitHub Actions, boosting test coverage across backend services from 62% to 88%.

Full-Stack Developer | DataPulse Tech (2019 - 2022) | Austin, TX
- Developed modern web interfaces with React, Redux, and Tailwind CSS for real-time data monitoring.
- Built asynchronous backend pipelines using Python and Celery to process large datasets and generate automated PDF reports.
- Optimized PostgreSQL database queries and indexing strategies, decreasing complex reporting query execution times by 35%.

EDUCATION
University of California, Berkeley
Bachelor of Science in Computer Science | Graduated May 2019

PROJECTS
CareerCraft AI: Open-source developer tool for automated portfolio generation built with Next.js, FastAPI, and Docker.`;

  // Build a valid minimal standard PDF with the text stream
  const escapedText = sampleResumeText
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

  const lines = escapedText.split("\n");
  let y = 740;
  let textStream = "BT\n/F1 9 Tf\n";
  lines.forEach((line) => {
    if (line.trim().length === 0) {
      y -= 12;
      return;
    }
    const cleanLine = line.replace(/[^\x20-\x7E]/g, " ");
    textStream += `1 0 0 1 50 ${y} Tm (${cleanLine}) Tj\n`;
    y -= 13;
    if (y < 40) y = 740; // wrap page
  });
  textStream += "ET";

  const streamLength = textStream.length;

  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page
   /Parent 2 0 R
   /MediaBox [0 0 612 792]
   /Resources << /Font << /F1 4 0 R >> >>
   /Contents 5 0 R
>>
endobj
4 0 obj
<< /Type /Font
   /Subtype /Type1
   /BaseFont /Helvetica
>>
endobj
5 0 obj
<< /Length ${streamLength} >>
stream
${textStream}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000248 00000 n 
0000000325 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${400 + streamLength}
%%EOF`;

  const blob = new Blob([pdfContent], { type: "application/pdf" });
  return new File([blob], "Alex_Morgan_Senior_FullStack_Resume.pdf", {
    type: "application/pdf",
  });
}
