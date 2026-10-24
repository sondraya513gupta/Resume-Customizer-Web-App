"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ResumeUploader } from "@/components/ResumeUploader";
import { JobDescriptionInput } from "@/components/JobDescriptionInput";
import { CustomizationOptions } from "@/components/CustomizationOptions";
import { LoadingModal } from "@/components/LoadingModal";
import { MatchScoreCard } from "@/components/MatchScoreCard";
import { KeywordCoverage } from "@/components/KeywordCoverage";
import { DiffView } from "@/components/DiffView";
import { ResumePreviewSheet } from "@/components/ResumePreviewSheet";
import { CoverLetterTab } from "@/components/CoverLetterTab";
import { Footer } from "@/components/Footer";
import { customizeResume } from "@/lib/api";
import { CustomizeResponse } from "@/types/resume";
import { SAMPLE_JOB_DESCRIPTION, createSampleResumePdfFile } from "@/lib/sampleData";
import { Sparkles, AlertCircle, FileText, GitCompare, Target, Mail, RefreshCw, Download } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "Summary",
    "Skills",
    "Experience",
    "Projects",
  ]);
  const [generateCoverLetter, setGenerateCoverLetter] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CustomizeResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "diff" | "keywords" | "cover_letter">("preview");

  const handleToggleSection = (section: string) => {
    setSelectedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handleLoadSample = () => {
    try {
      const sampleFile = createSampleResumePdfFile();
      setFile(sampleFile);
      setJobDescription(SAMPLE_JOB_DESCRIPTION);
      setError(null);
      // Smooth scroll down to interactive card
      const formEl = document.getElementById("customize-form");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth" });
      }
    } catch (e) {
      console.error("Failed to load sample:", e);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setActiveTab("preview");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!file) {
      setError("Please upload your resume file (PDF or DOCX).");
      return;
    }

    const cleanJd = jobDescription.trim();
    if (!cleanJd || cleanJd.length < 50) {
      setError("Please paste the job description (at least 50 characters required).");
      return;
    }

    if (selectedSections.length === 0) {
      setError("Please select at least one section to customize.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await customizeResume(
        file,
        cleanJd,
        selectedSections,
        generateCoverLetter
      );
      setResult(data);
      // Celebrate with confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Confetti optional
      }
      // Scroll to results top
      setTimeout(() => {
        const resEl = document.getElementById("results-section");
        if (resEl) resEl.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred during customization.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-blue-600 selection:text-white">
      <Navbar onReset={handleReset} hasResult={Boolean(result)} />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!result ? (
          <>
            {/* Landing Hero */}
            <HeroSection onLoadSample={handleLoadSample} />

            {/* Input Workspace */}
            <div id="customize-form" className="mt-8 max-w-5xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  {/* Left Column: Upload & Options */}
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Step 1</span>
                        <span className="text-[11px] text-slate-500">PDF or DOCX</span>
                      </div>
                      <ResumeUploader file={file} onFileSelect={setFile} maxSizeMb={5} />
                    </div>

                    <CustomizationOptions
                      selectedSections={selectedSections}
                      onToggleSection={handleToggleSection}
                      generateCoverLetter={generateCoverLetter}
                      onToggleCoverLetter={setGenerateCoverLetter}
                    />
                  </div>

                  {/* Right Column: Job Description Input & Action */}
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Step 2</span>
                        <span className="text-[11px] text-slate-500">Min 50 chars</span>
                      </div>
                      <JobDescriptionInput
                        value={jobDescription}
                        onChange={setJobDescription}
                        minChars={50}
                        maxChars={15000}
                      />
                    </div>

                    {/* Error Banner */}
                    {error && (
                      <div className="flex items-start space-x-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-semibold text-red-200">Processing Error</p>
                          <p>{error}</p>
                        </div>
                      </div>
                    )}

                    {/* Primary CTA Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-xl shadow-blue-500/25 transition duration-200 flex items-center justify-center space-x-2 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-200" />
                      <span>Generate Tailored Resume &amp; ATS Analysis</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </>
        ) : (
          /* Results View */
          <div id="results-section" className="space-y-8 animate-in fade-in duration-300">
            {/* Header / Summary Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/80 border border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-white">
                    {result.resume.candidate_name} — Tailored Resume
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Ready
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Engine: <span className="text-slate-300 font-mono">{result.meta.model_used}</span> • Processed in{" "}
                  <span className="text-slate-300 font-mono">{(result.meta.processing_time_ms / 1000).toFixed(1)}s</span> • Source:{" "}
                  <span className="text-slate-300 font-mono">{result.meta.filename}</span>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Customize Another</span>
                </button>
              </div>
            </div>

            {/* ATS Match Score Breakdown */}
            <MatchScoreCard matchAnalysis={result.resume.match_analysis} />

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === "preview"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Tailored Resume</span>
              </button>

              <button
                onClick={() => setActiveTab("diff")}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === "diff"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <GitCompare className="w-4 h-4" />
                <span>Before &amp; After Comparison</span>
              </button>

              <button
                onClick={() => setActiveTab("keywords")}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === "keywords"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Target className="w-4 h-4" />
                <span>Keyword &amp; Skill Coverage</span>
              </button>

              {result.resume.cover_letter && (
                <button
                  onClick={() => setActiveTab("cover_letter")}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "cover_letter"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                      : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Cover Letter</span>
                </button>
              )}
            </div>

            {/* Active Tab Views */}
            <div className="pt-2">
              {activeTab === "preview" && (
                <ResumePreviewSheet resume={result.resume} />
              )}

              {activeTab === "diff" && (
                <DiffView resume={result.resume} />
              )}

              {activeTab === "keywords" && (
                <KeywordCoverage keywordAnalysis={result.resume.keyword_analysis} />
              )}

              {activeTab === "cover_letter" && (
                <CoverLetterTab resume={result.resume} />
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <LoadingModal isOpen={isLoading} />
    </div>
  );
}
