"use client";

import React from "react";
import { KeywordAnalysis } from "@/types/resume";
import { Check, AlertCircle, Lightbulb, ShieldAlert, CheckCircle2 } from "lucide-react";

interface KeywordCoverageProps {
  keywordAnalysis: KeywordAnalysis;
}

export const KeywordCoverage: React.FC<KeywordCoverageProps> = ({ keywordAnalysis }) => {
  const {
    matched_keywords,
    missing_keywords,
    supported_requirements,
    unsupported_requirements,
    recommendations,
  } = keywordAnalysis;

  return (
    <div className="space-y-6">
      {/* 2-Column Keywords: Matched vs Missing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matched Keywords */}
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Check className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-sm font-bold text-white">Matched Keywords ({matched_keywords.length})</h4>
            </div>
            <span className="text-[10px] uppercase font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Verified in Resume
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            These target terms were found in your original resume and highlighted in the tailored version:
          </p>

          <div className="flex flex-wrap gap-1.5">
            {matched_keywords.length > 0 ? (
              matched_keywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                >
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>{kw}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No direct keyword overlap identified.</span>
            )}
          </div>
        </div>

        {/* Missing / Suggested Keywords */}
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-sm font-bold text-white">Missing Keywords ({missing_keywords.length})</h4>
            </div>
            <span className="text-[10px] uppercase font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
              Suggestions Only
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            Required by the JD but not found in your resume. <strong className="text-amber-300">Only add if you have real experience</strong>:
          </p>

          <div className="flex flex-wrap gap-1.5">
            {missing_keywords.length > 0 ? (
              missing_keywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30"
                >
                  <span>{kw}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-emerald-400">Great job! All primary JD keywords are covered.</span>
            )}
          </div>
        </div>
      </div>

      {/* Requirements Evidence Breakdown */}
      {(supported_requirements.length > 0 || unsupported_requirements.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              Supported Requirements
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {supported_requirements.map((req, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center">
              <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />
              Unsubstantiated Requirements
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {unsupported_requirements.length > 0 ? (
                unsupported_requirements.map((req, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{req}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 italic">No significant unevidenced requirements found.</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Actionable Recommendations */}
      {recommendations.length > 0 && (
        <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Strategic Recommendations to Bridge Gaps
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-indigo-400 font-bold">{i + 1}.</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
