"use client";

import React, { useState } from "react";
import { CustomizedResume } from "@/types/resume";
import { Download, FileText, Printer, Copy, Check, Loader2, Mail, Phone, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";
import { downloadResumePdf, downloadResumeDocx } from "@/lib/api";

interface ResumePreviewSheetProps {
  resume: CustomizedResume;
}

export const ResumePreviewSheet: React.FC<ResumePreviewSheetProps> = ({ resume }) => {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);
      await downloadResumePdf(resume);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to download PDF.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    try {
      setDownloadingDocx(true);
      await downloadResumeDocx(resume);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to download DOCX.");
    } finally {
      setDownloadingDocx(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = async () => {
    try {
      const parts: string[] = [];
      parts.push(resume.candidate_name.toUpperCase());
      const contactParts = Object.values(resume.contact_info).filter(Boolean);
      if (contactParts.length) parts.push(contactParts.join(" | "));
      parts.push("\n--- SUMMARY ---\n" + resume.tailored_summary);

      if (resume.skills.length) {
        parts.push("\n--- SKILLS ---");
        resume.skills.forEach((s) => parts.push(`${s.category}: ${s.skills.join(", ")}`));
      }

      if (resume.experience.length) {
        parts.push("\n--- EXPERIENCE ---");
        resume.experience.forEach((e) => {
          parts.push(`${e.role} — ${e.company} (${e.start_date || ""} - ${e.end_date || "Present"})`);
          e.tailored_bullets.forEach((b) => parts.push(`• ${b}`));
        });
      }

      if (resume.education.length) {
        parts.push("\n--- EDUCATION ---");
        resume.education.forEach((edu) => {
          parts.push(`${edu.degree}${edu.field_of_study ? " in " + edu.field_of_study : ""} — ${edu.institution} (${edu.graduation_date || ""})`);
        });
      }

      await navigator.clipboard.writeText(parts.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-300">Export Options:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* PDF Download Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 disabled:opacity-50 transition"
          >
            {downloadingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Download ATS PDF</span>
          </button>

          {/* Word Download Button */}
          <button
            onClick={handleDownloadDocx}
            disabled={downloadingDocx}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-50 transition"
          >
            {downloadingDocx ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-blue-400" />
            )}
            <span>Download DOCX</span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition"
            title="Print or Save via Browser"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Copy Plain Text */}
          <button
            onClick={handleCopyText}
            className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition"
            title="Copy all text to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Text"}</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Card (White Canvas with Crisp Typography) */}
      <div className="printable-resume bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-12 max-w-4xl mx-auto border border-slate-200 font-sans leading-normal">
        {/* Resume Header */}
        <div className="text-center pb-4 border-b border-slate-300 mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-slate-950 mb-2">
            {resume.candidate_name}
          </h1>

          {/* Contact Details */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
            {resume.contact_info.email && (
              <span className="flex items-center space-x-1">
                <Mail className="w-3 h-3 text-slate-500" />
                <span>{resume.contact_info.email}</span>
              </span>
            )}
            {resume.contact_info.phone && (
              <span className="flex items-center space-x-1">
                <Phone className="w-3 h-3 text-slate-500" />
                <span>{resume.contact_info.phone}</span>
              </span>
            )}
            {resume.contact_info.location && (
              <span className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>{resume.contact_info.location}</span>
              </span>
            )}
            {resume.contact_info.linkedin && (
              <span className="flex items-center space-x-1">
                <LinkedinIcon className="w-3.5 h-3.5 text-blue-700" />
                <span>{resume.contact_info.linkedin}</span>
              </span>
            )}
            {resume.contact_info.github && (
              <span className="flex items-center space-x-1">
                <GithubIcon className="w-3.5 h-3.5 text-slate-800" />
                <span>{resume.contact_info.github}</span>
              </span>
            )}
          </div>
        </div>

        {/* 1. Professional Summary */}
        {resume.tailored_summary && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Professional Summary
            </h2>
            <p className="text-[13px] text-slate-700 leading-relaxed text-justify">
              {resume.tailored_summary}
            </p>
          </div>
        )}

        {/* 2. Skills & Competencies */}
        {resume.skills && resume.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Skills & Competencies
            </h2>
            <div className="space-y-1 text-[13px] text-slate-800">
              {resume.skills.map((cat, i) => (
                <div key={i} className="flex flex-wrap items-baseline">
                  <span className="font-bold text-slate-950 mr-2 min-w-[120px]">{cat.category}:</span>
                  <span className="text-slate-700">{cat.skills.join(", ")}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Professional Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-3">
              Professional Experience
            </h2>
            <div className="space-y-5">
              {resume.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1">
                    <div>
                      <span className="font-bold text-[13.5px] text-slate-950">{exp.role}</span>
                      <span className="text-slate-600 font-medium"> — {exp.company}</span>
                      {exp.location && <span className="text-slate-500 text-xs italic"> ({exp.location})</span>}
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                      {exp.start_date || ""} - {exp.end_date || "Present"}
                    </span>
                  </div>

                  <ul className="list-disc list-outside pl-4 space-y-1 text-[12.5px] text-slate-700 leading-relaxed">
                    {(exp.tailored_bullets && exp.tailored_bullets.length > 0
                      ? exp.tailored_bullets
                      : exp.original_bullets
                    ).map((bullet, bIdx) => (
                      <li key={bIdx} className="pl-1">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Key Projects
            </h2>
            <div className="space-y-3">
              {resume.projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-[13px] text-slate-950">{proj.name}</span>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <span className="text-[11px] text-slate-500 italic">
                        [{proj.technologies.join(", ")}]
                      </span>
                    )}
                  </div>
                  <p className="text-[12.5px] text-slate-700 mt-0.5 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Education */}
        {resume.education && resume.education.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Education
            </h2>
            <div className="space-y-2">
              {resume.education.map((edu, i) => (
                <div key={i} className="flex flex-wrap items-baseline justify-between text-[13px]">
                  <div>
                    <span className="font-bold text-slate-950">{edu.degree}</span>
                    {edu.field_of_study && <span> in {edu.field_of_study}</span>}
                    <span className="text-slate-600"> — {edu.institution}</span>
                  </div>
                  <span className="text-xs text-slate-600 font-semibold">{edu.graduation_date || ""}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
