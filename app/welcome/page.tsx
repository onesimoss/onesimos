/**
 * @file app/welcome/page.tsx
 * @description Vibrant Parent Welcome Page shown immediately after signup or Google login.
 *
 * @module app/welcome/page
 * @fonts Logo (wordmark) + Achiko (headings) + Switzer (body/UI)
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function toTitleCase(str: string): string {
  if (!str) return "Parent";
  return str
    .toLowerCase()
    .split(/[\s._-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function WelcomePage(): JSX.Element {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-switzer">
        <p className="font-bold text-gray-500 text-sm animate-pulse font-switzer">
          Preparing your welcome...
        </p>
      </main>
    );
  }

  const rawName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Parent";
  const parentName = toTitleCase(rawName);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FDFBF7] via-amber-50/30 to-sky-50/40 font-switzer py-12 px-6 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-sm text-center font-switzer relative overflow-hidden">
        
        {/* Confetti / Celebration Header */}
        <div className="text-6xl mb-4 animate-bounce">🎉</div>

        <span className="font-logo text-3xl text-amber-900 block mb-2">
          Onesimos
        </span>

        <h1 className="font-achiko text-3xl md:text-4xl text-amber-950 mb-3">
          Welcome, {parentName}!
        </h1>

        <p className="text-sm text-gray-600 mb-8 max-w-md mx-auto leading-relaxed font-switzer">
          Your parent account is ready! Onesimos helps your child build reading fluency and 80 percent comprehension through playful, listening adventures.
        </p>

        {/* 3-Step Orientation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left font-switzer">
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
            <span className="text-2xl block mb-1">👨‍👩‍👧</span>
            <h3 className="font-bold text-xs text-amber-950 font-switzer">1. Set Up Reader</h3>
            <p className="text-[11px] text-gray-600 mt-0.5 font-switzer leading-tight">
              Create a profile with your child&apos;s age and favorite themes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200">
            <span className="text-2xl block mb-1">🎙️</span>
            <h3 className="font-bold text-xs text-sky-950 font-switzer">2. Read Out Loud</h3>
            <p className="text-[11px] text-gray-600 mt-0.5 font-switzer leading-tight">
              Onesimos listens gently and catches stumbled words.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
            <span className="text-2xl block mb-1">📈</span>
            <h3 className="font-bold text-xs text-emerald-950 font-switzer">3. Track Growth</h3>
            <p className="text-[11px] text-gray-600 mt-0.5 font-switzer leading-tight">
              Review words-per-minute and quiz scores on your report card.
            </p>
          </div>
        </div>

        {/* Main CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 font-switzer">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-xs transition-all active:scale-95 font-switzer text-center"
          >
            Set Up Your Reader Profile →
          </Link>
          <Link
            href="/parent"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm font-switzer text-center"
          >
            Go to Parent Dashboard
          </Link>
        </div>

      </div>
    </main>
  );
}