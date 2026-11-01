"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

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
    <div className="min-h-[100dvh] flex flex-col bg-[#F5F2FC] font-[family-name:var(--font-switzer)] text-[#0B1B3A] overflow-x-hidden w-full m-0 p-0">
      
      {/* Top Header / Nav */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-[#F5F2FC]/90 backdrop-blur-md border-b border-[#0B1B3A]/5">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-achiko)] text-2xl font-bold tracking-tight text-[#0B1B3A]">
              Onesimos<span className="text-[#8B5CF6]">.</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[#0B1B3A]/80 md:flex">
            <a href="#about" className="hover:text-[#8B5CF6] transition-colors">About Us</a>
            <a href="#features" className="hover:text-[#8B5CF6] transition-colors">Features</a>
            <a href="#curriculum" className="hover:text-[#8B5CF6] transition-colors">Curriculum</a>
            <a href="#pricing" className="hover:text-[#8B5CF6] transition-colors">Pricing</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="px-5 py-2.5 text-sm font-semibold text-[#0B1B3A] hover:text-[#8B5CF6] transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="rounded-full bg-[#8B5CF6] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#7C3AED] transition-all shadow-md shadow-purple-200">
              Get Started
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

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t border-[#0B1B3A]/5 bg-[#F5F2FC] px-6 py-6 md:hidden shadow-lg absolute w-full left-0">
            <div className="flex flex-col gap-4 text-base font-medium text-[#0B1B3A]">
              <a href="#about" onClick={() => setMenuOpen(false)} className="py-1">About Us</a>
              <a href="#features" onClick={() => setMenuOpen(false)} className="py-1">Features</a>
              <a href="#curriculum" onClick={() => setMenuOpen(false)} className="py-1">Curriculum</a>
              <a href="#pricing" onClick={() => setMenuOpen(false)} className="py-1">Pricing</a>
              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#0B1B3A]/10">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-full border border-[#0B1B3A]/20 px-4 py-2.5 text-center text-sm font-semibold">Log in</Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)} className="rounded-full bg-[#8B5CF6] px-4 py-2.5 text-center text-sm font-semibold text-white">Get Started</Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Hero Container */}
      <main className="flex-grow w-full relative">
        <section className="mx-auto max-w-7xl px-4 pt-8 pb-12 md:px-8 md:pt-12 md:pb-16 relative overflow-hidden">
          
          {/* Floating Space Doodles */}
          <div className="absolute top-12 left-[12%] hidden lg:block opacity-60 pointer-events-none">
            {/* UFO */}
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0B1B3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="12" rx="8" ry="3"/>
              <path d="M9 11a3 3 0 0 1 6 0"/>
              <path d="M8 14l-2 4M16 14l2 4M12 15v4"/>
            </svg>
          </div>

          <div className="absolute top-20 right-[10%] hidden lg:block opacity-60 pointer-events-none">
            {/* Saturn Planet */}
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#0B1B3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="6"/>
              <path d="M4.5 15.5c4-1 11-6 15-7M4.5 8.5c4 1 11 6 15 7"/>
            </svg>
          </div>

          <div className="absolute bottom-24 left-[8%] hidden lg:block opacity-60 pointer-events-none">
            {/* Meteor */}
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0B1B3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="18" r="3"/>
              <path d="M9 15l10-10M12 18l7-7M6 12l7-7"/>
            </svg>
          </div>

          <div className="absolute bottom-32 right-[6%] hidden lg:block opacity-60 pointer-events-none">
            {/* Moon */}
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#0B1B3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </div>

          {/* Title and Sub-tag */}
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
            <h1 className="font-[family-name:var(--font-achiko)] text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#0B1B3A] leading-[1.1]">
              Better Future For Your Kids
            </h1>

            <div className="mt-5 inline-flex items-center rounded-full bg-white px-5 py-2 border border-[#0B1B3A]/10 shadow-xs">
              <span className="text-sm font-medium text-[#0B1B3A]/80">
                Let the child be the director, and the author of their own reading journey
              </span>
            </div>

            <div className="mt-8">
              <Link
                href="/signup"
                className="inline-flex items-center gap-3 rounded-full bg-[#8B5CF6] px-8 py-4 text-base font-semibold text-white transition-all hover:bg-[#7C3AED] hover:scale-105 active:scale-95 shadow-lg shadow-purple-200"
              >
                <span>Get Started</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>

          {/* Hero Grid: Left Circle Image, Center Description & Stats, Right Circle Image */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
            
            {/* Left Kid Image */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#FF6B4A] transform -rotate-3 shadow-md" />
                <div className="relative w-[90%] h-[90%] rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600"
                    alt="Young learner reading"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>

            {/* Center Info and Stats */}
            <div className="lg:col-span-4 flex flex-col items-center text-center px-2">
              <div className="flex items-start gap-3 text-left max-w-sm">
                <div className="w-6 h-0.5 bg-[#FF6B4A] mt-2.5 shrink-0" />
                <p className="text-sm leading-relaxed text-[#0B1B3A]/80 font-medium">
                  We personalized learning chapters and real-time speech evaluation throughout the child reading journey!
                </p>
              </div>

              {/* Stats Block 1 */}
              <div className="mt-8 flex items-center gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-[#0B1B3A]/5 shadow-sm w-full max-w-xs">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div className="text-left">
                  <div className="font-[family-name:var(--font-achiko)] text-2xl font-bold text-[#0B1B3A]">1,000+</div>
                  <div className="text-xs text-[#0B1B3A]/70 font-medium">Total active children taking reading chapters</div>
                </div>
              </div>

              {/* Stats Block 2 */}
              <div className="mt-4 flex items-center gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-[#0B1B3A]/5 shadow-sm w-full max-w-xs">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <div className="text-left">
                  <div className="font-[family-name:var(--font-achiko)] text-2xl font-bold text-[#0B1B3A]">100%</div>
                  <div className="text-xs text-[#0B1B3A]/70 font-medium">Real-time speech evaluation precision</div>
                </div>
              </div>
            </div>

            {/* Right Kid Image */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#FFC72C] transform rotate-3 shadow-md" />
                <div className="relative w-[90%] h-[90%] rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600"
                    alt="Child with books"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Bottom Inset Dark Navy Card Section */}
        <section className="mx-auto max-w-7xl px-4 py-6 md:px-8" id="features">
          <div className="bg-[#0B1B3A] text-white rounded-[32px] p-6 md:p-12 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-4">
                <h2 className="font-[family-name:var(--font-achiko)] text-3xl md:text-4xl font-bold">
                  Learning Features
                </h2>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">
                  Our chapters and tools are designed to develop your children into confident readers.
                </p>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Feature 1 */}
                <div
                  onClick={() => setActiveTab(0)}
                  className={`cursor-pointer rounded-2xl p-6 transition-all ${
                    activeTab === 0
                      ? "bg-[#8B5CF6] text-white shadow-lg scale-[1.02]"
                      : "bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  <div className="text-3xl mb-4">💡</div>
                  <h3 className="font-[family-name:var(--font-achiko)] text-lg font-bold">Creative Chapters</h3>
                  <p className="mt-2 text-xs opacity-80">Personalized stories synthesized for ages 3 to 12.</p>
                  <div className="mt-4 text-xs font-semibold flex items-center gap-1">
                    <span>Learn more</span>
                    <span>+</span>
                  </div>
                </div>

                {/* Feature 2 */}
                <div
                  onClick={() => setActiveTab(1)}
                  className={`cursor-pointer rounded-2xl p-6 transition-all ${
                    activeTab === 1
                      ? "bg-[#8B5CF6] text-white shadow-lg scale-[1.02]"
                      : "bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  <div className="text-3xl mb-4">🎙️</div>
                  <h3 className="font-[family-name:var(--font-achiko)] text-lg font-bold">Speech Evaluation</h3>
                  <p className="mt-2 text-xs opacity-80">Real-time voice recognition and reading feedback.</p>
                  <div className="mt-4 text-xs font-semibold flex items-center gap-1">
                    <span>Learn more</span>
                    <span>+</span>
                  </div>
                </div>

                {/* Feature 3 */}
                <div
                  onClick={() => setActiveTab(2)}
                  className={`cursor-pointer rounded-2xl p-6 transition-all ${
                    activeTab === 2
                      ? "bg-[#8B5CF6] text-white shadow-lg scale-[1.02]"
                      : "bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  <div className="text-3xl mb-4">🛡️</div>
                  <h3 className="font-[family-name:var(--font-achiko)] text-lg font-bold">Parent Protection</h3>
                  <p className="mt-2 text-xs opacity-80">100% Parent PIN protection for safe sessions.</p>
                  <div className="mt-4 text-xs font-semibold flex items-center gap-1">
                    <span>Learn more</span>
                    <span>+</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
