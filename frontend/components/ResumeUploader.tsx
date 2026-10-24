"use client";

import React, { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Upload, FileText, CheckCircle2, X, RefreshCw, AlertTriangle } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface ResumeUploaderProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  maxSizeMb?: number;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  file,
  onFileSelect,
  maxSizeMb = 5,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);

    // 1. Check size limit
    const maxBytes = maxSizeMb * 1024 * 1024;
    if (selectedFile.size > maxBytes) {
      setError(`File size (${formatBytes(selectedFile.size)}) exceeds the ${maxSizeMb} MB limit.`);
      return;
    }

    if (selectedFile.size === 0) {
      setError("The selected file is empty (0 bytes). Please upload a valid document.");
      return;
    }

    // 2. Check extension
    const nameLower = selectedFile.name.toLowerCase();
    const isPdf = nameLower.endsWith(".pdf");
    const isDocx = nameLower.endsWith(".docx");

    if (!isPdf && !isDocx) {
      if (nameLower.endsWith(".doc")) {
        setError("Legacy .doc format is not supported. Please convert your file to .docx or .pdf.");
      } else {
        setError("Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx).");
      }
      return;
    }

    onFileSelect(selectedFile);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReplace = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileInputChange}
        className="hidden"
        id="resume-file-input"
      />

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 group ${
            isDragging
              ? "border-blue-400 bg-blue-500/10 scale-[0.99]"
              : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60"
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Upload className="w-6 h-6 text-blue-400" />
          </div>

          <h4 className="text-base font-semibold text-white mb-1">
            {isDragging ? "Drop your resume here" : "Upload your resume"}
          </h4>
          <p className="text-xs text-slate-400 mb-4 text-center">
            Drag and drop your file here, or <span className="text-blue-400 font-medium">browse files</span>
          </p>

          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
            <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300">
              PDF (.pdf)
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300">
              DOCX (.docx)
            </span>
            <span>• Max {maxSizeMb} MB</span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex-shrink-0 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-white truncate">{file.name}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                <span>{formatBytes(file.size)}</span>
                <span>•</span>
                <span className="uppercase font-mono text-[10px] text-blue-300 bg-blue-500/10 px-1.5 py-0.2 rounded">
                  {file.name.split(".").pop()}
                </span>
                <span>•</span>
                <span className="text-emerald-400">Ready to parse</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
            <button
              onClick={handleReplace}
              type="button"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title="Replace file"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleRemove}
              type="button"
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-start space-x-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
