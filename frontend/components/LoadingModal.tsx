"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, Loader2 } from "lucide-react";

interface LoadingModalProps {
  isOpen: boolean;
}

const STAGES = [
  { text: "Validating document format and magic bytes...", duration: 1500 },
  { text: "Extracting resume text via PyMuPDF engine...", duration: 2500 },
  { text: "Gemini 1.5 analyzing target role requirements...", duration: 4000 },
  { text: "Rephrasing experience bullets with Google X-Y-Z formula...", duration: 5000 },
  { text: "Calculating explainable ATS match score & keyword gaps...", duration: 6000 },
  { text: "Assembling verified, tailored resume output...", duration: 99999 },
];

export const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStageIndex(0);
      setProgress(10);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 92) return prev + Math.floor(Math.random() * 4) + 1;
        return prev;
      });
    }, 400);

    const timeouts = STAGES.map((stage, idx) => {
      return setTimeout(() => {
        setCurrentStageIndex(idx);
      }, stage.duration);
    });

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden text-center">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Spinner icon */}
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-xl shadow-blue-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mb-1">Tailoring Your Resume</h3>
        <p className="text-xs text-slate-400 mb-6">
          Analyzing role alignment with zero factual hallucinations...
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Steps list */}
        <div className="space-y-2 text-left bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
          {STAGES.slice(0, 4).map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div key={idx} className="flex items-center space-x-2.5 text-xs">
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-700 flex-shrink-0" />
                )}
                <span
                  className={
                    isCompleted
                      ? "text-slate-400 line-through"
                      : isCurrent
                      ? "text-white font-medium"
                      : "text-slate-600"
                  }
                >
                  {stage.text}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-500 mt-4">
          This usually takes 8–15 seconds depending on document length.
        </p>
      </div>
    </div>
  );
};
