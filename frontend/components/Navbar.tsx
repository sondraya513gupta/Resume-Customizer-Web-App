"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, AlertCircle, FileText, RefreshCw } from "lucide-react";
import { GithubIcon } from "./Icons";
import { checkBackendHealth } from "@/lib/api";
import { HealthResponse } from "@/types/resume";

interface NavbarProps {
  onReset?: () => void;
  hasResult?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, hasResult }) => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadHealth() {
      try {
        const res = await checkBackendHealth();
        if (isMounted) setHealth(res);
      } catch {
        if (isMounted) setHealth(null);
      } finally {
        if (isMounted) setChecking(false);
      }
    }
    loadHealth();
    const interval = setInterval(loadHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white">ResumeCraft</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Tailored Resumes with 100% Truthfulness</p>
          </div>
        </div>

        {/* Right Section: Backend Status Badge & Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Health Badge */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
            {checking ? (
              <span className="flex items-center text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-500 animate-ping mr-2" />
                Connecting API...
              </span>
            ) : health ? (
              <span className="flex items-center text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                Backend Live ({health.model_configured})
              </span>
            ) : (
              <span className="flex items-center text-amber-400">
                <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                Backend Offline (:8000)
              </span>
            )}
          </div>

          {hasResult && (
            <button
              onClick={onReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Start a new customization"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Customize Another</span>
            </button>
          )}

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition px-2.5 py-1.5 rounded-lg hover:bg-slate-900"
          >
            <GithubIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Repo</span>
          </a>
        </div>
      </div>
    </header>
  );
};
