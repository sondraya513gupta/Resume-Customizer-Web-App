"use client";

import React, { useState } from "react";
import { CustomizedResume } from "@/types/resume";
import { Mail, Copy, Check, Download, Loader2 } from "lucide-react";
import { downloadCoverLetterPdf } from "@/lib/api";

interface CoverLetterTabProps {
  resume: CustomizedResume;
}

export const CoverLetterTab: React.FC<CoverLetterTabProps> = ({ resume }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!resume.cover_letter) {
    return (
      <div className="text-center p-12 rounded-3xl bg-slate-900/60 border border-slate-800">
        <Mail className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h4 className="text-sm font-bold text-white mb-1">No Cover Letter Requested</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          To generate a tailored cover letter along with your resume, ensure the &quot;Generate Tailored Cover Letter&quot; toggle is enabled in options.
        </p>
      </div>
    );
  }

  const handleCopy = async () => {
    if (!resume.cover_letter) return;
    try {
      await navigator.clipboard.writeText(resume.cover_letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadCoverLetterPdf(resume);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to download cover letter PDF.");
    } finally {
      setDownloading(false);
    }
  };

  const paragraphs = resume.cover_letter.split("\n\n").filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
        <span className="text-xs font-semibold text-slate-300">
          Tailored Cover Letter
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 disabled:opacity-50 transition"
          >
            {downloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Download Letter PDF</span>
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Letter Sheet */}
      <div className="bg-white text-slate-900 rounded-2xl shadow-xl p-8 sm:p-12 max-w-3xl mx-auto border border-slate-200 font-sans leading-relaxed">
        <div className="border-b border-slate-300 pb-4 mb-6">
          <h2 className="text-xl font-bold uppercase tracking-wide text-slate-950">
            {resume.candidate_name}
          </h2>
          <div className="text-xs text-slate-600 mt-1">
            {[resume.contact_info.email, resume.contact_info.phone, resume.contact_info.location].filter(Boolean).join("  •  ")}
          </div>
        </div>

        <div className="space-y-4 text-[13.5px] text-slate-800 leading-relaxed">
          {paragraphs.map((p, idx) => (
            <p key={idx} className="text-justify whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
