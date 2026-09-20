/**
 * @file app/school-proposal/page.tsx
 * @description Printable 1-Page B2B School Proposal & 30-Day Measurement Protocol.
 * Designed for private primary school proprietors in Abuja, Lagos, and global diaspora.
 * Includes @media print utilities for clean 1-page PDF export.
 *
 * @module app/school-proposal/page
 * @fonts Logo (wordmark) + Achiko (headings) + Switzer (body/UI)
 */

"use client";

import Link from "next/link";

export default function SchoolProposalPage(): JSX.Element {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-gray-900 font-switzer py-8 px-6 print:bg-white print:p-0">
      
      {/* Top Controls Bar (Hidden during print) */}
      <div className="max-w-3xl mx-auto flex items-center justify-between mb-6 print:hidden">
        <Link
          href="/"
          className="text-xs font-bold text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-full border border-gray-200 font-switzer transition-all shadow-2xs"
        >
          ← Back to Website
        </Link>
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") window.print();
          }}
          className="text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 px-5 py-2 rounded-full font-switzer transition-all shadow-xs"
        >
          🖨️ Print / Save PDF Leaflet
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-sm print:border-none print:shadow-none print:p-0">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-amber-200 pb-6 mb-6">
          <div>
            <span className="font-logo text-3xl md:text-4xl text-amber-900 block leading-tight">
              Onesimos
            </span>
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider font-switzer mt-1">
              Institutional Literacy Pilot Proposal · 30-Day Protocol
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs font-switzer">
              Example Mirror Ltd
            </span>
            <p className="text-[11px] text-gray-500 font-switzer mt-1">
              Abuja · Lagos · Diaspora
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
          <h1 className="font-achiko text-2xl text-amber-950 mb-1">
            Grade-Level Reading Gains in 30 Days — Zero Teacher Burden
          </h1>
          <p className="text-xs text-amber-900 font-switzer leading-relaxed">
            Onesimos is an interactive literacy engine designed for primary students (Nursery 2 to Primary 3). By capturing stumbled words in real time and weaving them into personalized chapters, Onesimos elevates reading accuracy and comprehension to the 80% threshold without adding grading work for classroom teachers.
          </p>
        </div>

        {/* 3 Core School Benefits */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-left">
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
            <span className="text-lg">⏱️</span>
            <h2 className="font-bold text-xs text-gray-900 mt-1 font-switzer">
              Zero Teacher Prep
            </h2>
            <p className="text-[11px] text-gray-600 mt-0.5 font-switzer leading-normal">
              Automated voice evaluation runs independently on school tablets.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
            <span className="text-lg">📈</span>
            <h2 className="font-bold text-xs text-gray-900 mt-1 font-switzer">
              Measurable Gains
            </h2>
            <p className="text-[11px] text-gray-600 mt-0.5 font-switzer leading-normal">
              Day 1 vs Day 30 report tracking Words-Per-Minute (WPM) & quiz accuracy.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
            <span className="text-lg">🇳🇬</span>
            <h2 className="font-bold text-xs text-gray-900 mt-1 font-switzer">
              Cultural Relevance
            </h2>
            <p className="text-[11px] text-gray-600 mt-0.5 font-switzer leading-normal">
              Stories feature local names, heritage, and 25 core character virtues.
            </p>
          </div>
        </div>

        {/* Standardized 30-Day Measurement Protocol */}
        <div className="mb-6">
          <h2 className="font-achiko text-lg text-amber-950 mb-2 border-b border-gray-100 pb-1">
            Standardized 30-Day Evaluation Protocol
          </h2>
          <div className="space-y-2 text-xs font-switzer text-gray-700">
            <div className="flex items-start gap-2">
              <span className="font-black text-amber-800 shrink-0">Step 1:</span>
              <p>
                <strong>Day 1 Baseline Assessment:</strong> Each student completes a 3-minute read-aloud diagnostic. Onesimos calculates baseline Words-Per-Minute (WPM) and initial comprehension score.
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-black text-amber-800 shrink-0">Step 2:</span>
              <p>
                <strong>20-Minute Daily Guided Reading:</strong> Students complete 1 living chapter or phonics sound drill per day during scheduled tablet sessions or morning reading hour.
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-black text-amber-800 shrink-0">Step 3:</span>
              <p>
                <strong>Day 30 Progress Benchmark:</strong> Onesimos generates an executive summary report for the headmaster displaying % accuracy improvement, WPM growth, and vocabulary mastery.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing & Commercial Structure */}
        <div className="mb-6 p-4 rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50/50 flex items-center justify-between">
          <div>
            <h3 className="font-achiko text-xl text-amber-950">
              Classroom Term License
            </h3>
            <p className="text-xs text-amber-900 font-switzer">
              Covers 1 entire classroom (Up to 30 students) for a full school term
            </p>
          </div>
          <div className="text-right">
            <span className="font-switzer font-black text-2xl text-amber-900 block leading-none">
              ₦30,000
            </span>
            <span className="text-[10px] text-amber-800 font-bold uppercase font-switzer">
              Per Class / Term
            </span>
          </div>
        </div>

        {/* Contact & Pilot Signup Box */}
        <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 font-switzer">
          <div>
            <p className="text-xs font-bold text-gray-900 font-switzer">
              To Schedule an On-Site School Demo or 30-Day Pilot:
            </p>
            <p className="text-xs text-amber-900 font-bold font-switzer">
              Email: crux@onesimos.app · schools@onesimos.app
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="inline-block px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs font-switzer">
              Example Mirror Ltd · Abuja
            </span>
          </div>
        </div>

      </div>
    </main>
  );
}