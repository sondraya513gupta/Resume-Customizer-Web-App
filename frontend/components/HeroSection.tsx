"use client";

import React from "react";
import { Sparkles, FileUp, FileCheck2, DownloadCloud, ShieldCheck, Zap } from "lucide-react";

interface HeroSectionProps {
  onLoadSample: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onLoadSample }) => {
  return (
    <div className="relative pt-6 pb-8 md:pt-10 md:pb-12 text-center max-w-5xl mx-auto px-4">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Pill Badge */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
        <Sparkles className="w-3.5 h-3.5 animate-spin text-blue-400" />
        <span>Powered by Google Gemini 1.5 & ReportLab ATS Engine</span>
      </div>

      {/* Headline */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 leading-tight">
        Tailor Your Resume to Any Job <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
          With 100% Factual Integrity
        </span>
      </h1>

      {/* Subhead */}
      <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed">
        Align your real qualifications with target job requirements, rephrase experience bullets for maximum ATS impact, and discover missing keywords — with <span className="text-slate-200 font-medium">zero hallucinations or invented facts</span>.
      </p>

      {/* One-Click Demo Button */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <button
          onClick={onLoadSample}
          type="button"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition duration-150 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>Load Sample Full-Stack Resume & JD</span>
        </button>
        <div className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Strict Anti-Hallucination Guardrails</span>
        </div>
      </div>

      {/* 3-Step Workflow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
            <FileUp className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Step 1</span>
          <h3 className="text-base font-semibold text-white mt-1 mb-1">Upload Resume</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Upload your verified PDF or Word (.docx) document. Verified text is extracted securely on the backend.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
            <FileCheck2 className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Step 2</span>
          <h3 className="text-base font-semibold text-white mt-1 mb-1">Paste Job Description</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Paste the target role description. Gemini identifies critical skills, requirements, and responsibilities.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3">
            <DownloadCloud className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Step 3</span>
          <h3 className="text-base font-semibold text-white mt-1 mb-1">Tailor & Download</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Review your tailored resume, inspect before-and-after diffs, analyze missing keywords, and download ATS-ready PDF/DOCX.
          </p>
        </div>
      </div>
    </div>
  );
};
