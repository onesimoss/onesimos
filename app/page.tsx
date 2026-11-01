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
    <div className="min-h-[100dvh] flex flex-col font-[family-name:var(--font-switzer)] overflow-x-hidden w-full m-0 p-0 bg-black">
      
      {/* 100% FULL SCREEN HERO - IMAGE COVERS ENTIRE VIEWPORT */}
      <div className="relative w-full min-h-[100dvh] flex flex-col justify-between overflow-hidden">
        
        {/* Full Page Image Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/hero-kids-phone.jpg"
            alt="Children using smart reading app"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1600";
            }}
          />
          {/* Subtle soft gradient overlay so text remains readable without obscuring the photo */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>

        {/* Floating Header directly over full screen photo */}
        <header className="relative z-20 w-full px-6 py-6 md:px-12">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-[family-name:var(--font-achiko)] text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                Onesimos
              </span>
            </Link>

            <nav className="hidden items-center gap-8 text-sm font-medium text-white/90 md:flex">
              <a href="#features" className="hover:text-[#F97316] transition-colors">Features</a>
              <a href="#curriculum" className="hover:text-[#F97316] transition-colors">Curriculum</a>
              <a href="#pricing" className="hover:text-[#F97316] transition-colors">Pricing</a>
              <a href="#about" className="hover:text-[#F97316] transition-colors">About Us</a>
            </nav>

            <div className="hidden items-center gap-4 md:flex">
              <Link href="/login" className="text-sm font-semibold text-white hover:text-[#F97316] transition-colors">
                Log in
              </Link>
              <Link href="/signup" className="rounded-full bg-[#F97316] px-7 py-3 text-sm font-semibold text-white hover:bg-[#EA580C] transition-all shadow-md">
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

          {/* Mobile Drawer Menu */}
          {menuOpen && (
            <div className="border-b border-white/10 bg-black/90 backdrop-blur-xl px-6 py-6 md:hidden shadow-xl absolute w-full left-0 top-20 z-50">
              <div className="flex flex-col gap-4 text-base font-medium text-white">
                <a href="#features" onClick={() => setMenuOpen(false)} className="py-1">Features</a>
                <a href="#curriculum" onClick={() => setMenuOpen(false)} className="py-1">Curriculum</a>
                <a href="#pricing" onClick={() => setMenuOpen(false)} className="py-1">Pricing</a>
                <a href="#about" onClick={() => setMenuOpen(false)} className="py-1">About Us</a>
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/10">
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-full border border-white/30 px-4 py-2.5 text-center text-sm font-semibold">Log in</Link>
                  <Link href="/signup" onClick={() => setMenuOpen(false)} className="rounded-full bg-[#F97316] px-4 py-2.5 text-center text-sm font-semibold text-white">Get Started</Link>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Clean Overlay Content */}
        <main className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-16 flex-grow flex items-center">
          <div className="max-w-2xl text-white">
            
            <span className="inline-block rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/90 border border-white/20">
              AGES 3 TO 12 • PERSONALIZED READING
            </span>

            <h1 className="mt-6 font-[family-name:var(--font-achiko)] text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight drop-shadow-md">
              Make reading <br />
              something kids <span className="bg-[#F472B6] text-white px-4 py-1 rounded-[28px] inline-block -rotate-1">own</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-white/90 leading-relaxed max-w-xl font-normal drop-shadow-sm">
              Personalized learning chapters and real-time speech evaluation designed to build independent confidence in young readers.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-[#F97316] px-8 py-4 text-base font-semibold text-white transition-all hover:bg-[#EA580C] hover:scale-105 active:scale-95 shadow-lg"
              >
                Get Started
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white/30"
              >
                Learn More
              </a>
            </div>

          </div>
        </main>

        {/* Bottom space filler for full height anchor */}
        <div className="relative z-10 pb-8" />
      </div>

      {/* Feature Strip Section */}
      <section className="w-full bg-white border-t border-black/5 py-16 px-6 md:px-12 text-[#0B1B3A]" id="features">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-[family-name:var(--font-achiko)] text-3xl sm:text-4xl font-bold">
              Designed for Confident Learners
            </h2>
            <p className="mt-3 text-base text-[#0B1B3A]/70">
              Key capabilities that empower children aged 3 to 12.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#F4F5F7] border border-black/5">
              <div className="text-3xl mb-4">🎙️</div>
              <h3 className="font-[family-name:var(--font-achiko)] text-xl font-bold">Speech Evaluation</h3>
              <p className="mt-2 text-sm text-[#0B1B3A]/70 leading-relaxed">
                Real-time voice recognition that listens as your child reads aloud and provides instant feedback.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F4F5F7] border border-black/5">
              <div className="text-3xl mb-4">📖</div>
              <h3 className="font-[family-name:var(--font-achiko)] text-xl font-bold">Adaptive Chapters</h3>
              <p className="mt-2 text-sm text-[#0B1B3A]/70 leading-relaxed">
                Personalized story chapters that automatically adjust to your childs reading level.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F4F5F7] border border-black/5">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="font-[family-name:var(--font-achiko)] text-xl font-bold">Parent PIN Protection</h3>
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
