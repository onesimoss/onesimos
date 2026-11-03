"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

const butterflyStyles = `
  @keyframes b-wing-left { 0%, 100% { transform: scaleX(1) rotate(0deg); } 50% { transform: scaleX(0.2) rotate(15deg); } }
  @keyframes b-wing-right { 0%, 100% { transform: scaleX(1) rotate(0deg); } 50% { transform: scaleX(0.2) rotate(-15deg); } }
  @keyframes b-flight-1 { 0%, 100% { transform: translate(0px, 0px); } 50% { transform: translate(60px, -40px) rotate(8deg); } }
  @keyframes b-flight-2 { 0%, 100% { transform: translate(0px, 0px); } 50% { transform: translate(-50px, 35px) rotate(-10deg); } }
  @keyframes b-flight-3 { 0%, 100% { transform: translate(0px, 0px); } 50% { transform: translate(45px, 25px) rotate(12deg); } }
  .b-left { animation: b-wing-left 0.35s infinite ease-in-out; transform-origin: right center; }
  .b-right { animation: b-wing-right 0.35s infinite ease-in-out; transform-origin: left center; }
  .b-f1 { animation: b-flight-1 12s infinite ease-in-out; }
  .b-f2 { animation: b-flight-2 15s infinite ease-in-out; }
  .b-f3 { animation: b-flight-3 10s infinite ease-in-out; }
`;

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [coppaOpen, setCoppaOpen] = useState(false);

  const phrases = [
    "Make reading\nsomething kids\ntruly own.",
    "Say it out loud.\nWe listen and\ncheer you on.",
    "Personalized\nstories, made\njust for you."
  ];

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
      
      <style dangerouslySetInnerHTML={{ __html: butterflyStyles }} />

      <div className="relative w-full min-h-[100dvh] lg:h-[100dvh] flex flex-col justify-between overflow-visible bg-[#522DB8]">
        
        {/* <div className="seasonal-snow-layer pointer-events-none absolute inset-0 z-30" /> */}

        <div className="hidden md:block absolute top-28 left-12 z-20 pointer-events-none b-f1">
          <div className="flex items-center drop-shadow-md">
            <svg width="14" height="18" viewBox="0 0 14 18" className="b-left"><path d="M14 9C8 2 1 0 1 5C1 8 6 9 14 9Z" fill="#FACC15" /><path d="M14 9C8 13 2 15 2 17C2 18 6 17 14 9Z" fill="#F472B6" /></svg>
            <svg width="14" height="18" viewBox="0 0 14 18" className="b-right"><path d="M0 9C6 2 13 0 13 5C13 8 8 9 0 9Z" fill="#FACC15" /><path d="M0 9C6 13 12 15 12 17C12 18 8 17 0 9Z" fill="#F472B6" /></svg>
          </div>
        </div>
        <div className="hidden md:block absolute top-36 right-20 z-20 pointer-events-none b-f2">
          <div className="flex items-center drop-shadow-md">
            <svg width="12" height="16" viewBox="0 0 14 18" className="b-left"><path d="M14 9C8 2 1 0 1 5C1 8 6 9 14 9Z" fill="#60A5FA" /><path d="M14 9C8 13 2 15 2 17C2 18 6 17 14 9Z" fill="#FACC15" /></svg>
            <svg width="12" height="16" viewBox="0 0 14 18" className="b-right"><path d="M0 9C6 2 13 0 13 5C13 8 8 9 0 9Z" fill="#60A5FA" /><path d="M0 9C6 13 12 15 12 17C12 18 8 17 0 9Z" fill="#FACC15" /></svg>
          </div>
        </div>
        <div className="hidden md:block absolute bottom-24 left-1/3 z-20 pointer-events-none b-f3">
          <div className="flex items-center drop-shadow-md">
            <svg width="13" height="17" viewBox="0 0 14 18" className="b-left"><path d="M14 9C8 2 1 0 1 5C1 8 6 9 14 9Z" fill="#F472B6" /><path d="M14 9C8 13 2 15 2 17C2 18 6 17 14 9Z" fill="#A78BFA" /></svg>
            <svg width="13" height="17" viewBox="0 0 14 18" className="b-right"><path d="M0 9C6 2 13 0 13 5C13 8 8 9 0 9Z" fill="#F472B6" /><path d="M0 9C6 13 12 15 12 17C12 18 8 17 0 9Z" fill="#A78BFA" /></svg>
          </div>
        </div>
        <div className="hidden md:block absolute bottom-16 right-1/4 z-20 pointer-events-none b-f1">
          <div className="flex items-center drop-shadow-md">
            <svg width="11" height="15" viewBox="0 0 14 18" className="b-left"><path d="M14 9C8 2 1 0 1 5C1 8 6 9 14 9Z" fill="#34D399" /><path d="M14 9C8 13 2 15 2 17C2 18 6 17 14 9Z" fill="#FACC15" /></svg>
            <svg width="11" height="15" viewBox="0 0 14 18" className="b-right"><path d="M0 9C6 2 13 0 13 5C13 8 8 9 0 9Z" fill="#34D399" /><path d="M0 9C6 13 12 15 12 17C12 18 8 17 0 9Z" fill="#FACC15" /></svg>
          </div>
        </div>

        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <img
            src="/hero-bg-desktop.jpg"
            alt="Onesimos Desktop Hero"
            className="hidden md:block w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2560";
            }}
          />
          <img
            src="/hero-bg-mobile.jpg"
            alt="Onesimos Mobile Hero"
            className="block md:hidden w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1080";
            }}
          />
        </div>

        <header className="fixed top-4 inset-x-0 z-40 w-full px-4 md:px-8 pointer-events-none">
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between rounded-full bg-white/15 backdrop-blur-xl border border-white/25 px-5 py-2 shadow-2xl pointer-events-auto">
            
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Onesimos"
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="font-[family-name:var(--font-achiko)] text-xl font-bold tracking-tight text-white drop-shadow-sm">
                Onesimos
              </span>
            </Link>

            <nav className="hidden items-center gap-7 text-xs sm:text-sm font-semibold text-white/90 md:flex">
              <a href="#features" className="hover:text-[#FACC15] transition-colors py-1">Features</a>
              <a href="#curriculum" className="hover:text-[#FACC15] transition-colors py-1">Curriculum</a>
              <a href="#pricing" className="hover:text-[#FACC15] transition-colors py-1">Pricing</a>
              <a href="#about" className="hover:text-[#FACC15] transition-colors py-1">About us</a>
            </nav>

            <div className="hidden items-center gap-4 md:flex">
              <Link href="/login" className="text-xs sm:text-sm font-bold text-white hover:text-[#FACC15] transition-colors px-2 py-1">
                Log in
              </Link>
              <Link href="/signup" className="rounded-full bg-[#FACC15] px-5 py-2 text-xs sm:text-sm font-bold text-[#0B1B3A] hover:bg-white transition-all shadow-md hover:scale-105 active:scale-95">
                Get Started
              </Link>
            </div>

            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 md:hidden text-white hover:bg-white/20"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>

          {menuOpen && (
            <div className="mx-auto mt-2 max-w-sm rounded-3xl border border-white/20 bg-[#0B1B3A]/95 p-6 shadow-2xl backdrop-blur-2xl md:hidden pointer-events-auto">
              <div className="flex flex-col gap-3 text-sm font-medium text-white">
                <a href="#features" onClick={() => setMenuOpen(false)} className="py-1.5 hover:text-[#FACC15]">Features</a>
                <a href="#curriculum" onClick={() => setMenuOpen(false)} className="py-1.5 hover:text-[#FACC15]">Curriculum</a>
                <a href="#pricing" onClick={() => setMenuOpen(false)} className="py-1.5 hover:text-[#FACC15]">Pricing</a>
                <a href="#about" onClick={() => setMenuOpen(false)} className="py-1.5 hover:text-[#FACC15]">About us</a>
                <div className="grid grid-cols-2 gap-3 mt-2 pt-3 border-t border-white/15">
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-full border border-white/30 px-4 py-2 text-center text-xs font-semibold">Log in</Link>
                  <Link href="/signup" onClick={() => setMenuOpen(false)} className="rounded-full bg-[#FACC15] px-4 py-2 text-center text-xs font-bold text-[#0B1B3A]">Get Started</Link>
                </div>
              </div>
            </div>
          )}
        </header>

        <main className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-24 md:pt-28 pb-6 md:pb-12 flex-grow grid grid-cols-1 md:grid-cols-12 items-center gap-8">
          
          <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-center items-start text-white max-w-[85%] md:max-w-none">
            
            <div className="h-[180px] sm:h-[220px] lg:h-[260px] flex items-center mt-2">
              <h1
                className={`font-[family-name:var(--font-switzer)] text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight whitespace-pre-line transition-opacity duration-300 ${
                  fade ? "opacity-100" : "opacity-0"
                }`}
              >
                {phrases[phraseIndex]}
              </h1>
            </div>

            <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed max-w-[340px] font-normal drop-shadow-sm">
              Personalized learning chapters and real-time speech evaluation designed to build independent confidence in young readers.
            </p>

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

          <div className="hidden md:block md:col-span-6 lg:col-span-6 relative h-full z-20">
            
            <button
              onClick={() => setCoppaOpen(true)}
              className="group absolute top-2 right-12 lg:right-24 z-30 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 focus:outline-none"
              title="Click for COPPA & Child Safety Specs"
            >
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100">
                  <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                  <text className="text-[9.5px] font-extrabold uppercase fill-[#FACC15] tracking-widest">
                    <textPath href="#circlePath" startOffset="0%">
                      DESIGNED FOR AGES 3 TO 9 • COPPA SAFE • 
                    </textPath>
                  </text>
                </svg>
                <div className="absolute w-12 h-12 rounded-full bg-white text-[#0B1B3A] flex items-center justify-center shadow-lg border-2 border-[#FACC15] group-hover:bg-[#FACC15] transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="translate-x-[0.5px] -translate-y-[0.5px]">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
              </div>
            </button>

            <img
              src="/hero-characters.png"
              alt="Family Reading On Sofa"
              className="absolute bottom-0 right-6 lg:right-16 w-[560px] lg:w-[720px] xl:w-[800px] max-w-none object-contain pointer-events-none drop-shadow-2xl translate-y-[14%]"
            />
          </div>

        </main>

        <div className="block md:hidden relative z-20 w-full flex justify-center pointer-events-none mt-2">
          <img
            src="/hero-characters.png"
            alt="Onesimos Family Learning"
            className="w-[90%] max-w-[400px] h-auto object-contain drop-shadow-2xl -translate-x-3 translate-y-[10%]"
          />
        </div>

      </div>

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
            <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#0B1B3A]/5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-4xl mb-5">🎙️</div>
                <h3 className="font-[family-name:var(--font-switzer)] text-2xl font-bold text-[#0B1B3A]">
                  Speech Evaluation
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#0B1B3A]/70">
                  Real-time voice recognition that listens as your child reads aloud and provides encouraging feedback.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#0B1B3A]/5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-4xl mb-5">📖</div>
                <h3 className="font-[family-name:var(--font-switzer)] text-2xl font-bold text-[#0B1B3A]">
                  Adaptive Chapters
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#0B1B3A]/70">
                  Personalized story chapters that dynamically adapt to your childs reading level and vocabulary.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#0B1B3A]/5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-4xl mb-5">🛡️</div>
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

      {coppaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1B3A]/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 md:p-8 text-[#0B1B3A] shadow-2xl border border-gray-100">
            <button
              onClick={() => setCoppaOpen(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
            >
              ✕
            </button>
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="font-[family-name:var(--font-switzer)] font-extrabold text-2xl text-[#0B1B3A]">
              100% COPPA Compliant
            </h3>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
              Ages 3 to 9 • Parent Protected
            </p>
            <div className="mt-4 space-y-3 text-sm text-[#0B1B3A]/80 leading-relaxed">
              <p>• <strong>Zero Ads & Zero Tracking</strong>: Onesimos is entirely ad-free and built to strictly protect young learners data privacy.</p>
              <p>• <strong>Parent PIN Barrier</strong>: Sensitive account controls and settings require a mandatory 4-digit Parent PIN.</p>
              <p>• <strong>Safe Speech AI</strong>: Real-time voice processing is encrypted on-device and never saved or shared with 3rd parties.</p>
            </div>
            <button
              onClick={() => setCoppaOpen(false)}
              className="mt-6 w-full rounded-full bg-[#522DB8] py-3 text-sm font-bold text-white hover:bg-[#0B1B3A] transition-colors shadow-md"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}