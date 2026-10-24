"use client";

import React from "react";
import { MatchScoreBreakdown } from "@/types/resume";
import { Target, Info, CheckCircle2, Award, Zap } from "lucide-react";

interface MatchScoreCardProps {
  matchAnalysis: MatchScoreBreakdown;
}

export const MatchScoreCard: React.FC<MatchScoreCardProps> = ({ matchAnalysis }) => {
  const { overall_score, keyword_match_score, skills_alignment_score, experience_fit_score, methodology } = matchAnalysis;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 60) return "text-blue-400 border-blue-500/30 bg-blue-500/10";
    return "text-amber-400 border-amber-500/30 bg-amber-500/10";
  };

  const getStrokeColor = (score: number) => {
    if (score >= 80) return "#34d399"; // emerald
    if (score >= 60) return "#60a5fa"; // blue
    return "#fbbf24"; // amber
  };

  const strokeDashoffset = 283 - (283 * overall_score) / 100;

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-white">ATS Alignment & Match Score</h3>
        </div>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
          Explainable Heuristic
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        {/* Radial Overall Score */}
        <div className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="text-slate-800"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke={getStrokeColor(overall_score)}
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-white">{overall_score}%</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Match</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-200 mt-2">Overall Fit</p>
        </div>

        {/* 3 Component Metrics */}
        <div className="md:col-span-3 space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium flex items-center">
                <Award className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                Keyword Coverage
              </span>
              <span className="font-mono text-slate-300 font-bold">{keyword_match_score}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                style={{ width: `${keyword_match_score}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium flex items-center">
                <Zap className="w-3.5 h-3.5 text-indigo-400 mr-1.5" />
                Core Skills Alignment
              </span>
              <span className="font-mono text-slate-300 font-bold">{skills_alignment_score}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-700"
                style={{ width: `${skills_alignment_score}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
                Experience & Responsibility Fit
              </span>
              <span className="font-mono text-slate-300 font-bold">{experience_fit_score}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-cyan-500 h-2 rounded-full transition-all duration-700"
                style={{ width: `${experience_fit_score}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Methodology notice */}
      <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start space-x-2 text-[11px] text-slate-400">
        <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">Methodology:</strong> {methodology} This estimate reflects heuristic keyword and experience density and does not constitute a guaranteed interview invitation.
        </p>
      </div>
    </div>
  );
};
