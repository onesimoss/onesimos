"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const hideAddressBar = () => {
      if (window.scrollY === 0) {
        window.scrollTo(0, 1);
      }
    };
    window.addEventListener("load", hideAddressBar);
    return () => window.removeEventListener("load", hideAddressBar);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#FAF6EF] font-[family-name:var(--font-switzer)] text-[#0B1B3A] overflow-x-hidden w-full m-0 p-0">
      
      {/* Navigation Header */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-[#FAF6EF]/90 backdrop-blur-md border-b border-[#0B1B3A]/5">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0D3B2E] text-white font-[family-name:var(--font-achiko)] text-xl font-bold">
              O
            </div>
            <span className="font-[family-name:var(--font-achiko)] text-2xl font-bold tracking-tight text-[#0B1B3A]">
              Onesimos
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[#0B1B3A]/80 md:flex">
            <a href="#features" className="hover:text-[#0D3B2E] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#0D3B2E] transition-colors">How it works</a>
            <a href="#curriculum" className="hover:text-[#0D3B2E] transition-colors">Curriculum</a>
            <a href="#pricing" className="hover:text-[#0D3B2E] transition-colors">Pricing</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="px-5 py-2.5 text-sm font-semibold text-[#0B1B3A] hover:text-[#0D3B2E] transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="rounded-full bg-[#0D3B2E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0D3B2E]/90 transition-all shadow-sm">
              Start free trial
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg md:hidden text-[#0B1B3A]"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {menuOpen && (
          <div className="border-t border-[#0B1B3A]/5 bg-[#FAF6EF] px-6 py-6 md:hidden shadow-lg absolute w-full left-0">
            <div className="flex flex-col gap-4 text-base font-medium text-[#0B1B3A]">
              <a href="#features" onClick={() => setMenuOpen(false)} className="py-1">Features</a>
              <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="py-1">How it works</a>
              <a href="#curriculum" onClick={() => setMenuOpen(false)} className="py-1">Curriculum</a>
              <a href="#pricing" onClick={() => setMenuOpen(false)} className="py-1">Pricing</a>
              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#0B1B3A]/10">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-full border border-[#0B1B3A]/20 px-4 py-2.5 text-center text-sm font-semibold">Log in</Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)} className="rounded-full bg-[#0D3B2E] px-4 py-2.5 text-center text-sm font-semibold text-white">Start free trial</Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Hero Section */}
      <main className="flex-grow w-full">
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            
            {/* Left Content Column */}
            <div className="flex flex-col items-start lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0B1B3A]/10 bg-white/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#0B1B3A]/80 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-[#F97316]"></span>
                Ages 3 to 12 • Real-time Speech Evaluation
              </div>

              <h1 className="mt-6 font-[family-name:var(--font-achiko)] text-4xl font-bold leading-[1.1] text-[#0B1B3A] sm:text-5xl lg:text-6xl">
                Where curious kids <br />
                <span className="font-serif italic font-normal text-[#0D3B2E]">grow confident</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#0B1B3A]/75 sm:text-lg">
                A joyful, screen-smart learning world where reading, phonics, and curiosity click into place, one story at a time, at exactly your childs pace.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-[#0D3B2E] px-8 py-4 text-base font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md text-center"
                >
                  Start free trial
                </Link>
                
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[#0B1B3A]/15 bg-white px-7 py-4 text-base font-semibold text-[#0B1B3A] transition-colors hover:bg-gray-50 text-center"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F97316] text-white">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  See how it works
                </a>
              </div>

              {/* Social Proof */}
              <div className="mt-10 flex items-center gap-4 pt-2">
                <div className="flex -space-x-2.5">
                  <img className="inline-block h-9 w-9 rounded-full ring-2 ring-[#FAF6EF] object-cover" src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=120" alt="Learner" />
                  <img className="inline-block h-9 w-9 rounded-full ring-2 ring-[#FAF6EF] object-cover" src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=120" alt="Learner" />
                  <img className="inline-block h-9 w-9 rounded-full ring-2 ring-[#FAF6EF] object-cover" src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=120" alt="Learner" />
                  <img className="inline-block h-9 w-9 rounded-full ring-2 ring-[#FAF6EF] object-cover" src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=120" alt="Learner" />
                </div>
                <div className="text-xs sm:text-sm text-[#0B1B3A]/80 font-medium">
                  <span className="font-bold text-[#0B1B3A]">1,000+ families</span>
                  <br />learning together this month
                </div>
              </div>
            </div>

            {/* Right Collage Column */}
            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto lg:max-w-none">
                
                {/* Top-Left Card */}
                <div className="aspect-square rounded-3xl bg-[#E85D3F] p-2.5 sm:p-3 overflow-hidden shadow-sm flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600"
                    alt="Child learning"
                    className="h-full w-full rounded-2xl object-cover"
                  />
                </div>

                {/* Top-Right Card */}
                <div className="aspect-square rounded-3xl bg-[#2B6CB0] p-2.5 sm:p-3 overflow-hidden shadow-sm flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600"
                    alt="Child reading"
                    className="h-full w-full rounded-2xl object-cover"
                  />
                </div>

                {/* Bottom-Left Card */}
                <div className="aspect-square rounded-3xl bg-[#805AD5] p-2.5 sm:p-3 overflow-hidden shadow-sm flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600"
                    alt="Child engaged"
                    className="h-full w-full rounded-2xl object-cover"
                  />
                </div>

                {/* Bottom-Right Card */}
                <div className="aspect-square rounded-3xl bg-[#D69E2E] p-2.5 sm:p-3 overflow-hidden shadow-sm flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600"
                    alt="Child smiling with book"
                    className="h-full w-full rounded-2xl object-cover"
                  />
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* 3-Pillar White Strip */}
        <section className="w-full bg-white border-y border-[#0B1B3A]/5 py-8 px-4 md:px-8">
          <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start p-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FAF6EF] text-2xl">
                🎓
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-achiko)] text-lg font-bold text-[#0B1B3A]">Speech Evaluation</h3>
                <p className="text-xs sm:text-sm text-[#0B1B3A]/70">Real-time voice recognition feedback</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start p-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FAF6EF] text-2xl">
                📚
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-achiko)] text-lg font-bold text-[#0B1B3A]">Adaptive Stories</h3>
                <p className="text-xs sm:text-sm text-[#0B1B3A]/70">Personalized learning chapters</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start p-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FAF6EF] text-2xl">
                🛡️
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-achiko)] text-lg font-bold text-[#0B1B3A]">Parent Protection</h3>
                <p className="text-xs sm:text-sm text-[#0B1B3A]/70">100% Parent PIN protected safety</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Overview Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24" id="features">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F97316]">Learning Chapters</span>
              <h2 className="mt-2 font-[family-name:var(--font-achiko)] text-3xl sm:text-5xl font-bold text-[#0B1B3A]">
                Four chapters, one confident child
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-[#0B1B3A]/75">
              Every chapter blends short guided reading with real-time speech practice so screen time turns into real reading confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Phonics Foundation", age: "Ages 3-5", bg: "bg-[#E85D3F]/10", border: "border-[#E85D3F]/20", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400" },
              { title: "Sentence Fluency", age: "Ages 6-7", bg: "bg-[#2B6CB0]/10", border: "border-[#2B6CB0]/20", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400" },
              { title: "Vocabulary Builder", age: "Ages 8-9", bg: "bg-[#805AD5]/10", border: "border-[#805AD5]/20", img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=400" },
              { title: "Independent Reader", age: "Ages 10-12", bg: "bg-[#D69E2E]/10", border: "border-[#D69E2E]/20", img: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400" }
            ].map((chapter, i) => (
              <div key={i} className={`rounded-3xl p-5 border ${chapter.border} ${chapter.bg} flex flex-col justify-between`}>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                  <img src={chapter.img} alt={chapter.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0B1B3A]/60">{chapter.age}</span>
                  <h3 className="font-[family-name:var(--font-achiko)] text-xl font-bold text-[#0B1B3A] mt-1">{chapter.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
