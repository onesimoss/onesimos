"use client";

import React, { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-switzer)] text-[#0B1B3A]">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#0B1B3A]/5 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F97316]">
              <span className="font-[family-name:var(--font-achiko)] text-base font-bold text-white">O</span>
            </div>
            <span className="font-[family-name:var(--font-achiko)] text-xl font-bold tracking-tight">Onesimos</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#features" className="hover:text-[#F97316]">Features</a>
            <a href="#curriculum" className="hover:text-[#F97316]">Curriculum</a>
            <a href="#pricing" className="hover:text-[#F97316]">Pricing</a>
            <Link href="/login" className="rounded-full border border-[#0B1B3A] px-5 py-2 hover:bg-[#0B1B3A] hover:text-white transition-colors">Log in</Link>
            <Link href="/signup" className="rounded-full bg-[#F97316] px-5 py-2 text-white hover:bg-[#EA580C] transition-colors">Try for free</Link>
          </nav>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-[#0B1B3A]/5 bg-white px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3 text-sm font-medium">
              <a href="#features" onClick={() => setMenuOpen(false)} className="py-2">Features</a>
              <a href="#curriculum" onClick={() => setMenuOpen(false)} className="py-2">Curriculum</a>
              <a href="#pricing" onClick={() => setMenuOpen(false)} className="py-2">Pricing</a>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-full border border-[#0B1B3A] px-5 py-2.5 text-center">Log in</Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)} className="rounded-full bg-[#F97316] px-5 py-2.5 text-center text-white">Try for free</Link>
            </div>
          </div>
        )}
      </header>

      <main className="pt-16 md:pt-20">
        {/* Hero and sections go here next from your design photos */}
        <section className="mx-auto flex min-h-[50vh] max-w-6xl flex-col items-center justify-center px-4 py-20 text-center">
          <h1 className="font-[family-name:var(--font-achiko)] text-4xl font-bold tracking-tight md:text-6xl">
            Onesimos
          </h1>
          <p className="mt-4 max-w-lg text-base text-[#0B1B3A]/70 md:text-lg">
            Personalized learning chapters and real-time speech evaluation for ages 3 to 12.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className="rounded-full bg-[#F97316] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#EA580C]">
              Try for free
            </Link>
            <Link href="/login" className="rounded-full border border-[#0B1B3A] px-8 py-3.5 text-sm font-semibold hover:bg-[#0B1B3A] hover:text-white transition-colors">
              Log in
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
