"use client";

import React from "react";
import { Sliders, ShieldCheck, Mail, CheckSquare, Square } from "lucide-react";

interface CustomizationOptionsProps {
  selectedSections: string[];
  onToggleSection: (section: string) => void;
  generateCoverLetter: boolean;
  onToggleCoverLetter: (value: boolean) => void;
}

const AVAILABLE_SECTIONS = [
  { id: "Summary", label: "Professional Summary", description: "Targeted to role mission" },
  { id: "Skills", label: "Skills & Keywords", description: "Prioritized for JD relevance" },
  { id: "Experience", label: "Experience Bullets", description: "Rephrased for impact (no fake facts)" },
  { id: "Projects", label: "Projects & Highlights", description: "Emphasize relevant tech stack" },
];

export const CustomizationOptions: React.FC<CustomizationOptionsProps> = ({
  selectedSections,
  onToggleSection,
  generateCoverLetter,
  onToggleCoverLetter,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          <h4 className="text-sm font-semibold text-white">Customization Options</h4>
        </div>
        <span className="text-[11px] text-slate-400">Bonus Controls</span>
      </div>

      {/* Section selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
        {AVAILABLE_SECTIONS.map((sec) => {
          const isSelected = selectedSections.includes(sec.id);
          return (
            <div
              key={sec.id}
              onClick={() => onToggleSection(sec.id)}
              className={`flex items-start space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition select-none ${
                isSelected
                  ? "bg-blue-500/10 border-blue-500/30 text-white"
                  : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="mt-0.5 text-blue-400">
                {isSelected ? <CheckSquare className="w-4 h-4 text-blue-400" /> : <Square className="w-4 h-4 text-slate-600" />}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-200">{sec.label}</p>
                <p className="text-[10px] text-slate-400">{sec.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cover Letter toggle */}
      <div
        onClick={() => onToggleCoverLetter(!generateCoverLetter)}
        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition select-none mb-4 ${
          generateCoverLetter
            ? "bg-indigo-500/10 border-indigo-500/30 text-white"
            : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-200">Generate Tailored Cover Letter</p>
            <p className="text-[11px] text-slate-400">Craft a custom matching 3-paragraph letter from source resume</p>
          </div>
        </div>
        <div
          className={`w-10 h-6 flex items-center rounded-full p-1 duration-200 ease-in-out ${
            generateCoverLetter ? "bg-indigo-600 justify-end" : "bg-slate-800 justify-start"
          }`}
        >
          <div className="bg-white w-4 h-4 rounded-full shadow-md transform" />
        </div>
      </div>

      {/* Anti-Hallucination Guardrail Notice */}
      <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-300">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed text-slate-300">
          <strong className="text-emerald-400">Anti-Hallucination Engine:</strong> The AI will never invent employers, degrees, dates, or skills. Missing requirements are strictly surfaced as suggestions in the keyword gap analysis.
        </p>
      </div>
    </div>
  );
};
