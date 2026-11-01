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
    <div className="min-h-[100dvh] flex flex-col bg-[#F4F5F7] font-[family-name:var(--font-switzer)] text-[#0B1B3A] overflow-x-hidden w-full m-0 p-0">
      
      {/* Edge-to-Edge Clean Hero Section */}
      <div className="relative min-h-[100dvh] w-full flex flex-col justify-between">
        
        {/* Floating Transparent Navigation Header */}
        <header className="absolute top-0 left-0 right-0 z-50 bg-transparent py-4 px-6 md:px-12">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="font-[family-name:var(--font-achiko)] text-2xl font-bold tracking-tight text-[#0B1B3A]">
                Onesimos
              </span>
            </Link>

            {/* Desktop Center Links */}
            <nav className="hidden items-center gap-8 text-sm font-medium text-[#0B1B3A]/80 md:flex">
              <a href="#features" className="hover:text-[#8B5CF6] transition-colors">Features</a>
              <a href="#curriculum" className="hover:text-[#8B5CF6] transition-colors">Curriculum</a>
              <a href="#pricing" className="hover:text-[#8B5CF6] transition-colors">Pricing</a>
              <a href="#about" className="hover:text-[#8B5CF6] transition-colors">About Us</a>
            </nav>

            {/* Desktop Right Action Pill */}
            <div className="hidden items-center gap-4 md:flex">
              <Link href="/login" className="text-sm font-semibold text-[#0B1B3A] hover:text-[#8B5CF6] transition-colors">
                Log in
              </Link>
              <Link href="/signup" className="rounded-full bg-[#8B5CF6] px-7 py-3 text-sm font-semibold text-white hover:bg-[#7C3AED] transition-all shadow-sm">
                Get Started
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
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

          {/* Mobile Drawer */}
          {menuOpen && (
            <div className="border-b border-[#0B1B3A]/10 bg-white px-6 py-6 md:hidden shadow-xl absolute w-full left-0 top-20 z-50">
              <div className="flex flex-col gap-4 text-base font-medium text-[#0B1B3A]">
                <a href="#features" onClick={() => setMenuOpen(false)} className="py-1">Features</a>
                <a href="#curriculum" onClick={() => setMenuOpen(false)} className="py-1">Curriculum</a>
                <a href="#pricing" onClick={() => setMenuOpen(false)} className="py-1">Pricing</a>
                <a href="#about" onClick={() => setMenuOpen(false)} className="py-1">About Us</a>
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#0B1B3A]/10">
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-full border border-[#0B1B3A]/20 px-4 py-2.5 text-center text-sm font-semibold">Log in</Link>
                  <Link href="/signup" onClick={() => setMenuOpen(false)} className="rounded-full bg-[#8B5CF6] px-4 py-2.5 text-center text-sm font-semibold text-white">Get Started</Link>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Hero Grid Container */}
        <main className="flex-grow w-full pt-20 md:pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[100dvh] items-stretch">
            
            {/* Left Column: Full height crisp cut-out hero image */}
            <div className="lg:col-span-5 relative min-h-[400px] lg:min-h-full flex items-end justify-start">
              <img
                src="/hero-kids-phone.jpg"
                alt="Children engaging with interactive reading app"
                className="w-full h-full object-cover object-left-bottom"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200";
                }}
              />
            </div>

            {/* Right Column: Clean Typography & Call to Action */}
            <div className="lg:col-span-7 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24">
              <div className="max-w-2xl">
                
                {/* Uppercase Tag */}
                <span className="text-xs font-bold uppercase tracking-widest text-[#0B1B3A]/50">
                  AGES 3 TO 12 • PERSONALIZED READING
                </span>

                {/* Main Heading */}
                <h1 className="mt-4 font-[family-name:var(--font-achiko)] text-4xl sm:text-6xl lg:text-7xl font-bold text-[#0B1B3A] leading-[1.08] tracking-tight">
                  Make reading <br />
                  something kids own.
                </h1>

                {/* Accent Subtitle */}
                <div className="mt-6">
                  <span className="font-[family-name:var(--font-achiko)] text-xl sm:text-2xl font-normal italic text-[#8B5CF6]">
                    Interactive Phonics & Real-Time Speech Evaluation
                  </span>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0B1B3A]/40 mt-1">
                    PERSONALIZED LEARNING PLATFORM
                  </p>
                </div>

                {/* Description Paragraph */}
                <p className="mt-6 text-base sm:text-lg text-[#0B1B3A]/70 leading-relaxed max-w-xl">
                  Onesimos creates a joyful learning environment where children develop independent reading confidence through adaptive stories and immediate voice feedback.
                </p>

                {/* Dual CTA Buttons */}
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-full bg-[#8B5CF6] px-8 py-4 text-base font-semibold text-white transition-all hover:bg-[#7C3AED] hover:scale-105 active:scale-95 shadow-md"
                  >
                    GET STARTED
                  </Link>

                  <a
                    href="#features"
                    className="inline-flex items-center justify-center rounded-full bg-white border border-[#0B1B3A]/15 px-8 py-4 text-base font-semibold text-[#0B1B3A] transition-colors hover:bg-gray-50 shadow-xs"
                  >
                    LEARN MORE
                  </a>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Clean Feature Overview Strip */}
      <section className="w-full bg-white border-t border-[#0B1B3A]/5 py-16 px-6 md:px-12" id="features">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-[family-name:var(--font-achiko)] text-3xl sm:text-4xl font-bold text-[#0B1B3A]">
              Designed for Confident Learners
            </h2>
            <p className="mt-3 text-base text-[#0B1B3A]/70">
              Four key pillars that empower children aged 3 to 12.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#F4F5F7] border border-[#0B1B3A]/5">
              <div className="text-3xl mb-4">🎙️</div>
              <h3 className="font-[family-name:var(--font-achiko)] text-xl font-bold text-[#0B1B3A]">Speech Evaluation</h3>
              <p className="mt-2 text-sm text-[#0B1B3A]/70 leading-relaxed">
                Real-time voice recognition that listens as your child reads aloud and provides instant encouragement.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F4F5F7] border border-[#0B1B3A]/5">
              <div className="text-3xl mb-4">📖</div>
              <h3 className="font-[family-name:var(--font-achiko)] text-xl font-bold text-[#0B1B3A]">Adaptive Chapters</h3>
              <p className="mt-2 text-sm text-[#0B1B3A]/70 leading-relaxed">
                Personalized story chapters that automatically adjust to your childs reading level and vocabulary.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F4F5F7] border border-[#0B1B3A]/5">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="font-[family-name:var(--font-achiko)] text-xl font-bold text-[#0B1B3A]">Parent PIN Protection</h3>
              <p className="mt-2 text-sm text-[#0B1B3A]/70 leading-relaxed">
                100% Parent PIN protected safety controls to keep learning sessions focused and secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Width White Footer */}
      <Footer />
    </div>
  );
}
