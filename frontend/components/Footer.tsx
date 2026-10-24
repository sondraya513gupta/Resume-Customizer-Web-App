"use client";

import React from "react";
import { Sparkles, Shield, Cpu, Lock } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="no-print mt-20 border-t border-slate-800 bg-slate-950/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs text-slate-400">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-white">ResumeCraft AI</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                Production Release
              </span>
            </div>
            <p className="max-w-md text-slate-400 leading-relaxed">
              Engineered for the Full-Stack Developer hiring assignment at ThePrepLab / Innovista Labs.
              Combines Next.js App Router, FastAPI backend, Google Gemini 1.5, PyMuPDF, and ReportLab for ATS-ready resumes with 100% truthfulness.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-semibold text-white uppercase tracking-wider text-[11px]">Core Architectural Pillars</h5>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center space-x-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Hallucination Guarantee</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span>FastAPI Modular Service Layer</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Privacy: No Documents Stored</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-semibold text-white uppercase tracking-wider text-[11px]">Verified File Formats</h5>
            <p className="text-slate-400">
              Selectable-text PDF (.pdf) and Microsoft Word (.docx). Automatic detection of scanned or password-encrypted files with human-friendly guidance.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© 2026 ResumeCraft AI — ThePrepLab Assignment Submission</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Built with Next.js, FastAPI &amp; Gemini LLM</span>
            <Sparkles className="w-3 h-3 text-blue-400 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
