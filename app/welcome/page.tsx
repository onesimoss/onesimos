"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-darkBg flex flex-col justify-between p-6 sm:p-10">
      {/* Header */}
      <header className="flex items-center justify-between max-w-5xl w-full mx-auto">
        <Logo variant="spark" />
        <Link href="/login">
          <Button variant="ghost" size="sm" className="font-semibold">
            Log in
          </Button>
        </Link>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-4xl w-full mx-auto my-auto py-8 flex flex-col items-center text-center">
        {/* Behance Reference Stacked Cards Visual */}
        <div className="relative w-full max-w-md h-64 mb-8 flex items-center justify-center">
          {/* Back Card 1 - Pink */}
          <div className="absolute top-0 w-72 h-36 rounded-3xl bg-brand-pink border border-black/5 -rotate-6 shadow-sm flex items-center justify-center p-4">
            <span className="font-bold text-brand-navy text-sm">
              Instant Feedback
            </span>
          </div>
          {/* Back Card 2 - Lime */}
          <div className="absolute top-4 w-80 h-36 rounded-3xl bg-brand-lime border border-black/5 rotate-3 shadow-sm flex items-center justify-center p-4">
            <span className="font-bold text-brand-navy text-sm">
              Fun Games & Activities
            </span>
          </div>
          {/* Front Hero Card - Blue/Purple */}
          <div className="absolute top-8 w-full max-w-sm rounded-[32px] bg-white dark:bg-slate-800 border border-black/5 p-6 shadow-xl flex flex-col items-center text-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/20 text-brand-navy dark:text-brand-blue text-xs font-bold">
              <span>Personalized</span>
            </div>
            <h2 className="text-2xl font-black text-brand-navy dark:text-white tracking-tight">
              Personalized Learning
            </h2>
            <p className="text-xs text-brand-navy/70 dark:text-slate-300 leading-relaxed">
              Lessons adapt to your child's pace, focusing on what they need most.
            </p>
          </div>
        </div>

        {/* Title & Copy */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-brand-navy dark:text-white max-w-xl leading-tight mb-4">
          Every child learns differently, our job is to meet them where they are.
        </h1>
        <p className="text-base text-brand-navy/70 dark:text-slate-300 max-w-md mb-8">
          Personalized learning chapters, real-time speech evaluation, and adaptive story synthesis designed for early learners.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xs sm:max-w-sm">
          <Link href="/signup" className="w-full">
            <Button size="lg" className="w-full gap-2 text-base font-bold shadow-md">
              <span>Sign up</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login" className="w-full">
            <Button variant="outline" size="lg" className="w-full text-base font-bold">
              Log in
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-brand-navy/50 dark:text-slate-500 py-4">
        Onesimos Early Learning System. Safe, ad-free, and private for children.
      </footer>
    </div>
  );
}
