import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "ResumeCraft AI — Intelligent Resume Customizer with 100% Factual Integrity",
  description:
    "Tailor your resume to any job description in seconds using Google Gemini AI. Align core skills, improve experience bullets with Google X-Y-Z formula, and export ATS-friendly PDF & DOCX resumes without fake facts.",
  keywords: [
    "Resume Customizer",
    "AI Resume Builder",
    "ATS Optimization",
    "FastAPI",
    "Next.js",
    "Gemini AI",
    "ThePrepLab Assignment",
  ],
  authors: [{ name: "Alex Morgan" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0b0f19] text-slate-100">{children}</body>
    </html>
  );
}
