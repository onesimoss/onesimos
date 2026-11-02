"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const phrases = [
    "Make reading something kids own.",
    "Say it out loud. We're listening.",
    "Stories made just for you."
  ];

  // Rotate through phrases every 4 seconds with a smooth fade effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        setFade(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Mobile address bar hide helper
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
    <div className="min-h-[100dvh] flex flex-col font-[family-name:var(--font-switzer)] overflow-x-hidden w-full m-0 p-0 bg-white">
      
      {/* --- HERO SECTION --- */}
      <div className="relative w-full min-h-[100dvh] flex flex-col justify-between overflow-visible">
        
        {/* Responsive Background Swap */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          {/* Desktop Background */}
          <img
            src="/hero-bg-desktop.jpg"
            alt="Onesimos Desktop Hero"
            className="hidden md:block w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2560";
            }}
          />
          {/* Mobile Background */}
          <img
            src="/hero-bg-mobile.jpg"
            alt="Onesimos Mobile Hero"
            className="block md:hidden w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1080";
            }}
          />
        </div>

        {/* Floating Header */}
        <header className="relative z-30 w-full px-6 py-6 md:px-12">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Onesimos"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="font-[family-name:var(--font-achiko)] text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                Onesimos
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden items-center gap-8 text-sm font-medium text-white/90 md:flex">
              <a href="#features" className="hover:text-[#FACC15] transition-colors">Features</a>
              <a href="#curriculum" className="hover:text-[#FACC15] transition-colors">Curriculum</a>
              <a href="#pricing" className="hover:text-[#FACC15] transition-colors">Pricing</a>
              <a href="#about" className="hover:text-[#FACC15] transition-colors">About us</a>
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden items-center gap-4 md:flex">
              <Link href="/login" className="text-sm font-semibold text-white hover:text-[#FACC15] transition-colors">
                Log in
              </Link>
              <Link href="/signup" className="rounded-full bg-white px-7 py-3 text-sm font-bold text-[#0B1B3A] hover:bg-[#FACC15] transition-all shadow-md">
                Get Started
              </Link>
            </div>

            {/* Mobile Burger Button */}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg md:hidden text-white"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
              ) : (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>

          {/* Mobile Drawer */}
          {menuOpen && (
            <div className="border-b border-white/10 bg-[#0B1B3A]/95 backdrop-blur-xl px-6 py-6 md:hidden shadow-2xl absolute w-full left-0 top-20 z-50">
              <div className="flex flex-col gap-4 text-base font-medium text-white">
                <a href="#features" onClick={() => setMenuOpen(false)} className="py-1">Features</a>
                <a href="#curriculum" onClick={() => setMenuOpen(false)} className="py-1">Curriculum</a>
                <a href="#pricing" onClick={() => setMenuOpen(false)} className="py-1">Pricing</a>
                <a href="#about" onClick={() => setMenuOpen(false)} className="py-1">About us</a>
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/10">
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-full border border-white/30 px-4 py-2.5 text-center text-sm font-semibold">Log in</Link>
                  <Link href="/signup" onClick={() => setMenuOpen(false)} className="rounded-full bg-white px-4 py-2.5 text-center text-sm font-bold text-[#0B1B3A]">Get Started</Link>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Hero Body Content */}
        <main className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-8 md:pt-16 pb-32 flex-grow grid grid-cols-1 md:grid-cols-12 items-center gap-8">
          
          {/* Left Side: Live Dynamic Text Rotator */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col justify-center items-start text-white">
            
            <span className="inline-block rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white border border-white/30 shadow-sm">
              DESIGNED FOR AGES 3 TO 12
            </span>

            {/* Rotating Headline */}
            <div className="min-h-[140px] sm:min-h-[180px] md:min-h-[220px] flex items-center mt-4">
              <h1
                className={`font-[family-name:var(--font-achiko)] text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight transition-opacity duration-300 ${
                  fade ? "opacity-100" : "opacity-0"
                }`}
              >
                {phrases[phraseIndex]}
              </h1>
            </div>

            {/* Subcaption */}
            <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed max-w-lg font-normal drop-shadow-sm">
              Personalized learning chapters and real-time speech evaluation designed to build independent confidence in young readers.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-[#0B1B3A] transition-all hover:bg-[#FACC15] hover:scale-105 active:scale-95 shadow-xl"
              >
                Get Started
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/30 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white/20"
              >
                Learn More
              </a>
            </div>

          </div>

          {/* Right Side: Spacer for Desktop Layout */}
          <div className="hidden md:block md:col-span-6 lg:col-span-5 min-h-[300px]" />

        </main>

        {/* Overlapping 3D Characters Cutout */}
        <div className="absolute bottom-0 right-0 left-0 md:left-auto md:right-12 z-20 flex justify-center md:justify-end pointer-events-none translate-y-[25%] md:translate-y-[20%]">
          <img
            src="/hero-characters.png"
            alt="Onesimos Family Learning"
            className="w-[85%] max-w-[420px] sm:max-w-[520px] md:max-w-[620px] lg:max-w-[720px] h-auto object-contain drop-shadow-2xl"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = "0";
            }}
          />
        </div>

      </div>

      {/* --- WHITE FEATURE SECTION BELOW HERO --- */}
      <section className="w-full bg-white pt-36 md:pt-44 pb-20 px-6 md:px-12 text-[#0B1B3A] border-t border-gray-100" id="features">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-[family-name:var(--font-achiko)] text-3xl sm:text-5xl font-bold">
              Built for Young Learners
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#0B1B3A]/70 leading-relaxed">
              Three simple pillars that help your child read with joy and confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature Pillar 1 */}
            <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#0B1B3A]/5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-4xl mb-5">🎙️</div>
                <h3 className="font-[family-name:var(--font-achiko)] text-2xl font-bold text-[#0B1B3A]">
                  Speech Evaluation
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#0B1B3A]/70">
                  Real-time voice recognition that listens as your child reads aloud and provides encouraging feedback.
                </p>
              </div>
            </div>

            {/* Feature Pillar 2 */}
            <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#0B1B3A]/5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-4xl mb-5">📖</div>
                <h3 className="font-[family-name:var(--font-achiko)] text-2xl font-bold text-[#0B1B3A]">
                  Adaptive Chapters
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#0B1B3A]/70">
                  Personalized story chapters that dynamically adapt to your childs reading level and vocabulary.
                </p>
              </div>
            </div>

            {/* Feature Pillar 3 */}
            <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#0B1B3A]/5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-4xl mb-5">🛡️</div>
                <h3 className="font-[family-name:var(--font-achiko)] text-2xl font-bold text-[#0B1B3A]">
                  Parent Protection
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#0B1B3A]/70">
                  100% Parent PIN protection ensures a safe, uninterrupted learning environment for every session.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
}
