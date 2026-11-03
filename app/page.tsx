"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const phrases = [
    "Make reading\nsomething kids\ntruly own.",
    "Say it out loud.\nWe listen and\ncheer you on.",
    "Personalized\nstories, made\njust for you."
  ];

  // Traffic light colors cycling in sync with text rotator
  const trafficLightBadges = [
    "bg-[#EF4444] text-white border-red-300/40 shadow-red-500/20",
    "bg-[#FACC15] text-[#0B1B3A] border-yellow-400/50 shadow-yellow-500/20",
    "bg-[#10B981] text-white border-emerald-300/40 shadow-emerald-500/20"
  ];

  // Rotate through phrases every 4 seconds with a smooth fade effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        setFade(true);
      }, 300);
    }, 7000);

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
      <div className="relative w-full min-h-[100dvh] lg:h-[100dvh] flex flex-col justify-between overflow-visible bg-[#522DB8]">
        
        {/* --- SEASONAL INTERACTION HOOK (SNOW EFFECT READY) --- */}
        {/* <div className="seasonal-snow-layer pointer-events-none absolute inset-0 z-30" /> */}

        {/* CSS Keyframes for Perching Butterflies */}
        <style>{`
          @keyframes flutter {
            0%, 100% { transform: scaleX(1) rotate(0deg); }
            50% { transform: scaleX(0.4) rotate(12deg); }
          }
          @keyframes fly-perch-1 {
            0%, 100% { transform: translate(0px, 0px); }
            35% { transform: translate(140px, -60px) rotate(-15deg); }
            70% { transform: translate(220px, 30px) rotate(10deg); }
          }
          @keyframes fly-perch-2 {
            0%, 100% { transform: translate(0px, 0px); }
            45% { transform: translate(-160px, 80px) rotate(20deg); }
          }
          .b-wing { animation: flutter 0.4s infinite ease-in-out; }
          .b-fly-1 { animation: fly-perch-1 18s infinite ease-in-out; }
          .b-fly-2 { animation: fly-perch-2 22s infinite ease-in-out; }
        `}</style>

        {/* Live Vector Butterflies Perched near Flowers */}
        <div className="hidden md:block absolute top-24 left-10 z-20 pointer-events-none b-fly-1">
          <svg width="26" height="26" viewBox="0 0 24 24" className="b-wing drop-shadow-md">
            <path d="M12 12C10 6 3 4 3 9C3 12 7 13 12 12Z" fill="#FACC15" />
            <path d="M12 12C14 6 21 4 21 9C21 12 17 13 12 12Z" fill="#FACC15" />
            <path d="M12 12C10 16 4 17 4 19C4 21 8 20 12 12Z" fill="#F472B6" />
            <path d="M12 12C14 16 20 17 20 19C20 21 16 20 12 12Z" fill="#F472B6" />
          </svg>
        </div>
        <div className="hidden md:block absolute top-28 right-16 z-20 pointer-events-none b-fly-2">
          <svg width="24" height="24" viewBox="0 0 24 24" className="b-wing drop-shadow-md" style={{ animationDelay: "0.2s" }}>
            <path d="M12 12C10 6 3 4 3 9C3 12 7 13 12 12Z" fill="#60A5FA" />
            <path d="M12 12C14 6 21 4 21 9C21 12 17 13 12 12Z" fill="#60A5FA" />
            <path d="M12 12C10 16 4 17 4 19C4 21 8 20 12 12Z" fill="#FACC15" />
            <path d="M12 12C14 16 20 17 20 19C20 21 16 20 12 12Z" fill="#FACC15" />
          </svg>
        </div>
        
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
        <header className="sticky top-0 z-40 w-full px-6 py-4 md:px-12 bg-[#522DB8]/85 backdrop-blur-xl border-b border-white/10 transition-all shadow-sm">
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
            <div className="hidden items-center gap-5 md:flex">
              <Link href="/login" className="text-sm font-bold text-white hover:text-[#FACC15] transition-colors py-2">
                Log in
              </Link>
              <Link href="/signup" className="rounded-full bg-[#FACC15] px-6 py-2.5 text-sm font-bold text-[#0B1B3A] hover:bg-white transition-all shadow-md">
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
        <main className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-6 md:pt-12 pb-6 md:pb-12 flex-grow grid grid-cols-1 md:grid-cols-12 items-center gap-8">
          
          {/* Left Side: Live Dynamic Text Rotator */}
          <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-center items-start text-white max-w-[85%] md:max-w-none">
            
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all duration-500 border shadow-sm ${trafficLightBadges[phraseIndex]}`}>
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full transition-opacity duration-300 ${phraseIndex === 0 ? "bg-white animate-pulse" : "bg-white/40"}`} />
                <span className={`w-2 h-2 rounded-full transition-opacity duration-300 ${phraseIndex === 1 ? "bg-[#0B1B3A] animate-pulse" : "bg-white/40"}`} />
                <span className={`w-2 h-2 rounded-full transition-opacity duration-300 ${phraseIndex === 2 ? "bg-white animate-pulse" : "bg-white/40"}`} />
              </span>
              DESIGNED FOR AGES 3 TO 12
            </span>

            {/* Rotating Headline */}
            <div className="h-[180px] sm:h-[220px] lg:h-[260px] flex items-center mt-4">
              <h1
                className={`font-[family-name:var(--font-switzer)] text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight whitespace-pre-line transition-opacity duration-300 ${
                  fade ? "opacity-100" : "opacity-0"
                }`}
              >
                {phrases[phraseIndex]}
              </h1>
            </div>

            {/* Subcaption */}
            <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed max-w-[340px] font-normal drop-shadow-sm">
              Personalized learning chapters and real-time speech evaluation designed to build independent confidence in young readers.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-[#FACC15] px-7 py-3.5 text-sm font-bold text-[#0B1B3A] transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-xl"
              >
                Get Started
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/25"
              >
                Learn More
              </a>
            </div>

          </div>

          {/* Right Side: Spacer for Desktop Layout */}
          <div className="hidden md:block md:col-span-6 lg:col-span-6 relative h-full z-20">
            <img
              src="/hero-characters.png"
              alt="Family Reading On Sofa"
              className="absolute bottom-0 right-6 lg:right-16 w-[560px] lg:w-[720px] xl:w-[800px] max-w-none object-contain pointer-events-none drop-shadow-2xl translate-y-[14%]"
            />
          </div>

        </main>

        {/* Overlapping 3D Characters Cutout */}
        <div className="block md:hidden relative z-20 w-full flex justify-center pointer-events-none mt-2"><img src="/hero-characters.png" alt="Onesimos Family Learning" className="w-[90%] max-w-[400px] h-auto object-contain drop-shadow-2xl -translate-x-3 translate-y-[10%]" /></div>

      </div>

      {/* --- WHITE FEATURE SECTION BELOW HERO --- */}
      <section className="w-full bg-white pt-14 md:pt-24 pb-20 px-6 md:px-12 text-[#0B1B3A] border-t border-gray-100" id="features">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-[family-name:var(--font-switzer)] text-3xl sm:text-5xl font-extrabold">
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
                <div className="text-4xl mb-5">???</div>
                <h3 className="font-[family-name:var(--font-switzer)] text-2xl font-bold text-[#0B1B3A]">
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
                <div className="text-4xl mb-5">??</div>
                <h3 className="font-[family-name:var(--font-switzer)] text-2xl font-bold text-[#0B1B3A]">
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
                <div className="text-4xl mb-5">???</div>
                <h3 className="font-[family-name:var(--font-switzer)] text-2xl font-bold text-[#0B1B3A]">
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
