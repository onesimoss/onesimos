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
    <div className="min-h-[100dvh] flex flex-col bg-[#0F0826] font-[family-name:var(--font-switzer)] text-white overflow-x-hidden w-full m-0 p-0">
      
      {/* Floating Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F0826]/60 backdrop-blur-lg border-b border-white/10 transition-all">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-achiko)] text-2xl font-bold tracking-tight text-white">
              Onesimos<span className="text-[#A78BFA]">.</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
            <a href="#about" className="hover:text-[#A78BFA] transition-colors">About Us</a>
            <a href="#features" className="hover:text-[#A78BFA] transition-colors">Features</a>
            <a href="#curriculum" className="hover:text-[#A78BFA] transition-colors">Curriculum</a>
            <a href="#pricing" className="hover:text-[#A78BFA] transition-colors">Pricing</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="px-5 py-2.5 text-sm font-semibold text-white hover:text-[#A78BFA] transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="rounded-full bg-[#8B5CF6] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#7C3AED] transition-all shadow-lg shadow-purple-900/40">
              Get Started
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg md:hidden text-white"
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
          <div className="border-t border-white/10 bg-[#0F0826]/95 backdrop-blur-xl px-6 py-6 md:hidden shadow-2xl absolute w-full left-0">
            <div className="flex flex-col gap-4 text-base font-medium text-white">
              <a href="#about" onClick={() => setMenuOpen(false)} className="py-1">About Us</a>
              <a href="#features" onClick={() => setMenuOpen(false)} className="py-1">Features</a>
              <a href="#curriculum" onClick={() => setMenuOpen(false)} className="py-1">Curriculum</a>
              <a href="#pricing" onClick={() => setMenuOpen(false)} className="py-1">Pricing</a>
              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/10">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-full border border-white/20 px-4 py-2.5 text-center text-sm font-semibold">Log in</Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)} className="rounded-full bg-[#8B5CF6] px-4 py-2.5 text-center text-sm font-semibold text-white">Get Started</Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section with Full Wrapped Image Background */}
      <main className="flex-grow w-full">
        <section className="relative min-h-[90dvh] md:min-h-screen w-full flex items-center justify-center pt-24 pb-16 px-4 md:px-8 overflow-hidden">
          
          {/* Background Image Wrapper */}
          <div className="absolute inset-0 z-0">
            <img
              src="/hero-kids-phone.jpg"
              alt="Kids using smart learning app"
              className="w-full h-full object-cover object-center brightness-75 contrast-110"
              onError={(e) => {
                // Fallback online copy if local image is not placed yet
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1600";
              }}
            />
            {/* Gradient Overlays for readable text & smooth contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0826] via-[#0F0826]/50 to-[#0F0826]/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F0826]/80 via-transparent to-[#0F0826]/80" />
          </div>

          {/* Hero Content Overlay */}
          <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
            
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs sm:text-sm font-medium text-white/90 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-[#A78BFA] animate-pulse"></span>
              Real-time speech evaluation for ages 3 to 12
            </div>

            <h1 className="mt-6 font-[family-name:var(--font-achiko)] text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] drop-shadow-md">
              Better Future For Your Kids
            </h1>

            <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-white/80 leading-relaxed font-normal">
              Let the child be the director, and the author of their own reading journey through personalized learning chapters.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#8B5CF6] px-8 py-4 text-base font-semibold text-white transition-all hover:bg-[#7C3AED] hover:scale-105 active:scale-95 shadow-xl shadow-purple-900/50"
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

            {/* Quick Stats Grid */}
            <div className="mt-12 grid grid-cols-2 gap-4 max-w-md w-full">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-center">
                <div className="font-[family-name:var(--font-achiko)] text-2xl md:text-3xl font-bold text-white">1,000+</div>
                <div className="text-xs text-white/70 font-medium mt-1">Active Young Readers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-center">
                <div className="font-[family-name:var(--font-achiko)] text-2xl md:text-3xl font-bold text-[#A78BFA]">100%</div>
                <div className="text-xs text-white/70 font-medium mt-1">Speech Recognition Feedback</div>
              </div>
            </div>

          </div>
        </section>

        {/* Bottom Inset Dark Card Section */}
        <section className="mx-auto max-w-7xl px-4 py-12 md:px-8" id="features">
          <div className="bg-[#18113C] border border-white/10 text-white rounded-[32px] p-6 md:p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-4">
                <h2 className="font-[family-name:var(--font-achiko)] text-3xl md:text-4xl font-bold text-white">
                  Learning Features
                </h2>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">
                  Our personalized learning chapters develop your children into confident readers.
                </p>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Feature 1 */}
                <div
                  onClick={() => setActiveTab(0)}
                  className={`cursor-pointer rounded-2xl p-6 transition-all border ${
                    activeTab === 0
                      ? "bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-lg scale-[1.02]"
                      : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
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
                  className={`cursor-pointer rounded-2xl p-6 transition-all border ${
                    activeTab === 1
                      ? "bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-lg scale-[1.02]"
                      : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
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
                  className={`cursor-pointer rounded-2xl p-6 transition-all border ${
                    activeTab === 2
                      ? "bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-lg scale-[1.02]"
                      : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
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
