"use client";

import React, { useState } from "react";
import { CustomizedResume } from "@/types/resume";
import { GitCompare, ArrowRight, Check, Eye } from "lucide-react";

interface DiffViewProps {
  resume: CustomizedResume;
}

export const DiffView: React.FC<DiffViewProps> = ({ resume }) => {
  const [activeTab, setActiveTab] = useState<"experience" | "summary">("experience");

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("experience")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "experience"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span>Experience Bullets ({resume.experience.length} Roles)</span>
        </button>

        {resume.original_summary && (
          <button
            onClick={() => setActiveTab("summary")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === "summary"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Professional Summary</span>
          </button>
        )}
      </div>

      {/* Summary Diff */}
      {activeTab === "summary" && resume.original_summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-0.5 rounded bg-slate-800 mb-3 inline-block">
              Original Summary
            </span>
            <p className="text-xs text-slate-400 leading-relaxed italic">
              &quot;{resume.original_summary}&quot;
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/30">
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 mb-3 inline-block">
              Tailored Summary (Target Aligned)
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              &quot;{resume.tailored_summary}&quot;
            </p>
          </div>
        </div>
      )}

      {/* Experience Bullets Diff */}
      {activeTab === "experience" && (
        <div className="space-y-6">
          {resume.experience.map((exp, roleIdx) => (
            <div key={roleIdx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                  <p className="text-xs text-blue-400">{exp.company} {exp.location ? `• ${exp.location}` : ""}</p>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {exp.start_date || ""} - {exp.end_date || "Present"}
                </span>
              </div>

              {/* Side-by-side or stacked diff */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Original */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 mb-2 block">
                    Original Bullets ({exp.original_bullets.length})
                  </span>
                  {exp.original_bullets.length > 0 ? (
                    <ul className="space-y-2 text-xs text-slate-400">
                      {exp.original_bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start space-x-2">
                          <span className="text-slate-600 mt-0.5">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-600 italic">No original bullets captured.</p>
                  )}
                </div>

                {/* Tailored */}
                <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20">
                  <span className="text-[10px] uppercase font-semibold text-emerald-400 mb-2 block flex items-center">
                    <Check className="w-3 h-3 mr-1" />
                    Tailored Impact Bullets ({exp.tailored_bullets.length})
                  </span>
                  <ul className="space-y-2 text-xs text-slate-200">
                    {exp.tailored_bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start space-x-2">
                        <span className="text-blue-400 font-bold mt-0.5">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
