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
    <div className="min-h-[100dvh] flex flex-col bg-white font-[family-name:var(--font-switzer)] text-[#0B1B3A] overflow-x-hidden w-full m-0 p-0">
      
      {/* Floating Glass Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#0B1B3A]/10">
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
          <div className="border-t border-[#0B1B3A]/10 bg-white/95 backdrop-blur-xl px-6 py-6 md:hidden shadow-2xl absolute w-full left-0">
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
      <main className="flex-grow w-full">
        <section className="relative w-full pt-28 pb-12 md:pt-36 md:pb-20 px-4 md:px-8">
          
          {/* Headline & CTA */}
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/20 bg-[#8B5CF6]/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#8B5CF6] mb-4">
              <span className="h-2 w-2 rounded-full bg-[#8B5CF6]"></span>
              Ages 3 to 12 • Real-time Speech Evaluation
            </div>

            <h1 className="font-[family-name:var(--font-achiko)] text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#0B1B3A] leading-[1.1]">
              Make reading <br />
              something kids <span className="bg-[#F472B6] text-white px-4 py-1 rounded-[28px] inline-block -rotate-1">own</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base sm:text-lg md:text-xl text-[#0B1B3A]/75 leading-relaxed font-normal">
              Personalized learning chapters and real-time speech evaluation designed to build confidence in young readers.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#8B5CF6] px-8 py-4 text-base font-semibold text-white transition-all hover:bg-[#7C3AED] hover:scale-105 active:scale-95 shadow-lg shadow-purple-200"
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

          {/* Full-Bright Crisp Hero Photo Display */}
          <div className="max-w-6xl mx-auto rounded-[32px] overflow-hidden shadow-2xl border-4 border-[#0B1B3A]/5 bg-gray-100 aspect-[16/9] sm:aspect-[21/9]">
            <img
              src="/hero-kids-phone.jpg"
              alt="Kids using smart learning app on phone"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                // Fallback URL if local file is missing
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1600";
              }}
            />
          </div>

        </section>

        {/* Features Section */}
        <section className="mx-auto max-w-7xl px-4 py-12 md:px-8" id="features">
          <div className="bg-[#0B1B3A] text-white rounded-[32px] p-6 md:p-12 shadow-xl">
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
