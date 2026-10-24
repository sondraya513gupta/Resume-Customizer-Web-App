"use client";

import React from "react";
import { Briefcase, Check, AlertCircle, Clipboard, Trash2 } from "lucide-react";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  minChars?: number;
  maxChars?: number;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  value,
  onChange,
  minChars = 50,
  maxChars = 15000,
}) => {
  const charCount = value.length;
  const isTooShort = charCount > 0 && charCount < minChars;
  const isSatisfied = charCount >= minChars && charCount <= maxChars;
  const isTooLong = charCount > maxChars;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) onChange(text);
    } catch {
      // Clipboard access denied or unsupported
    }
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="job-description-textarea" className="flex items-center space-x-2 text-sm font-semibold text-white">
          <Briefcase className="w-4 h-4 text-indigo-400" />
          <span>Target Job Description</span>
        </label>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handlePaste}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Paste from clipboard"
          >
            <Clipboard className="w-3 h-3" />
            <span>Paste</span>
          </button>
          {charCount > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center space-x-1 px-2 py-1 rounded-md text-[11px] font-medium text-slate-400 hover:text-red-400 transition"
              title="Clear text"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <textarea
          id="job-description-textarea"
          rows={7}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the full job posting here (including role summary, key responsibilities, required skills, and qualification requirements)..."
          className={`w-full p-4 rounded-2xl text-sm bg-slate-900/60 border text-slate-200 placeholder-slate-500 focus:outline-none transition-all duration-150 resize-y min-h-[160px] ${
            isTooLong
              ? "border-red-500/50 focus:border-red-400 focus:ring-1 focus:ring-red-400"
              : isSatisfied
              ? "border-slate-800 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20"
              : "border-slate-800 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20"
          }`}
        />
      </div>

      {/* Footer info: Character count & validation hints */}
      <div className="flex items-center justify-between mt-2 text-xs">
        <div>
          {isTooShort && (
            <span className="flex items-center text-amber-400 space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Need at least {minChars - charCount} more characters</span>
            </span>
          )}
          {isSatisfied && (
            <span className="flex items-center text-emerald-400 space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span>Job description looks thorough & ready</span>
            </span>
          )}
          {isTooLong && (
            <span className="flex items-center text-red-400 space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Exceeds limit by {charCount - maxChars} characters</span>
            </span>
          )}
          {charCount === 0 && (
            <span className="text-slate-500">Provide the job posting to align keywords and bullets</span>
          )}
        </div>

        <div className={`font-mono text-[11px] ${isTooLong ? "text-red-400 font-bold" : "text-slate-500"}`}>
          {charCount.toLocaleString()} / {maxChars.toLocaleString()} chars
        </div>
      </div>
    </div>
  );
};
