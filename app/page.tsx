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
    <div className="min-h-[100dvh] flex flex-col font-[family-name:var(--font-switzer)] overflow-x-hidden w-full m-0 p-0 bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      <style dangerouslySetInnerHTML={{ __html: butterflyStyles }} />

      <div className="relative w-full min-h-[100dvh] lg:h-[100dvh] flex flex-col justify-between overflow-visible bg-[#522DB8]">
        
        {/* <div className="seasonal-snow-layer pointer-events-none absolute inset-0 z-30" /> */}

        {/* 5 Live Vector Butterflies (Desktop Only for now) */}
        <div className="absolute top-[18%] left-[8%] z-20 pointer-events-none b-f1 hidden md:block" style={{ opacity: 0.85 }}>
          <svg width="38" height="38" viewBox="0 0 40 40">
            <ellipse className="b-left" cx="14" cy="20" rx="10" ry="7" fill="#FACC15" />
            <ellipse className="b-right" cx="26" cy="20" rx="10" ry="7" fill="#FACC15" />
            <circle cx="20" cy="20" r="2" fill="#1a1a2e" />
          </svg>
        </div>
        <div className="absolute top-[12%] right-[15%] z-20 pointer-events-none b-f2 hidden md:block" style={{ opacity: 0.7 }}>
          <svg width="30" height="30" viewBox="0 0 40 40">
            <ellipse className="b-left" cx="14" cy="20" rx="10" ry="7" fill="#A78BFA" />
            <ellipse className="b-right" cx="26" cy="20" rx="10" ry="7" fill="#A78BFA" />
            <circle cx="20" cy="20" r="2" fill="#1a1a2e" />
          </svg>
        </div>
        <div className="absolute top-[55%] left-[5%] z-20 pointer-events-none b-f3 hidden md:block" style={{ opacity: 0.75 }}>
          <svg width="34" height="34" viewBox="0 0 40 40">
            <ellipse className="b-left" cx="14" cy="20" rx="10" ry="7" fill="#34D399" />
            <ellipse className="b-right" cx="26" cy="20" rx="10" ry="7" fill="#34D399" />
            <circle cx="20" cy="20" r="2" fill="#1a1a2e" />
          </svg>
        </div>
        <div className="absolute top-[40%] right-[8%] z-20 pointer-events-none b-f1 hidden md:block" style={{ opacity: 0.65 }}>
          <svg width="28" height="28" viewBox="0 0 40 40">
            <ellipse className="b-left" cx="14" cy="20" rx="10" ry="7" fill="#FB923C" />
            <ellipse className="b-right" cx="26" cy="20" rx="10" ry="7" fill="#FB923C" />
            <circle cx="20" cy="20" r="2" fill="#1a1a2e" />
          </svg>
        </div>
        <div className="absolute top-[70%] left-[45%] z-20 pointer-events-none b-f2 hidden md:block" style={{ opacity: 0.6 }}>
          <svg width="32" height="32" viewBox="0 0 40 40">
            <ellipse className="b-left" cx="14" cy="20" rx="10" ry="7" fill="#F472B6" />
            <ellipse className="b-right" cx="26" cy="20" rx="10" ry="7" fill="#F472B6" />
            <circle cx="20" cy="20" r="2" fill="#1a1a2e" />
          </svg>
        </div>

        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <img src="/hero-bg-desktop.jpg" alt="Onesimos Desktop Hero" className="hidden md:block w-full h-full object-cover object-center" />
          <img src="/hero-bg-mobile.jpg" alt="Onesimos Mobile Hero" className="block md:hidden w-full h-full object-cover object-center" />
        </div>

        <header className="fixed top-5 inset-x-0 z-40 w-full px-6 md:px-12 pointer-events-none">
          <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between">
            
            {/* Left: Logo Area */}
            <Link href="/" className="flex items-center gap-2.5 pointer-events-auto">
              <img
                src="/logo.png"
                alt="Onesimos"
                className="h-9 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="font-[family-name:var(--font-achiko)] text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                Onesimos
              </span>
            </Link>

            {/* Center: Dark Frost Glass Petit Pill */}
            <nav className="hidden md:flex items-center gap-7 px-8 py-2.5 rounded-full bg-black/40 backdrop-blur-lg border border-white/5 shadow-xl pointer-events-auto text-sm font-semibold text-white/90">
              <a href="#features" className="hover:text-[#FACC15] transition-colors py-1">Features</a>
              <a href="#curriculum" className="hover:text-[#FACC15] transition-colors py-1">Curriculum</a>
              <a href="#pricing" className="hover:text-[#FACC15] transition-colors py-1">Pricing</a>
              <a href="#about" className="hover:text-[#FACC15] transition-colors py-1">About us</a>
            </nav>

            {/* Right: CTA Buttons */}
            <div className="hidden md:flex items-center gap-5 pointer-events-auto">
              <Link href="/login" className="text-sm font-bold text-white hover:text-[#FACC15] transition-colors px-2 py-1">
                Log in
              </Link>
              <Link href="/signup" className="rounded-full bg-[#FACC15] px-6 py-2.5 text-sm font-bold text-[#0B1B3A] hover:bg-white transition-all shadow-lg hover:scale-105 active:scale-95">
                Get Started
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md md:hidden text-white hover:bg-black/60 pointer-events-auto border border-white/10"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d={menuOpen ? "M18 6L6 18M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </header>

        {/* Full-Screen Mobile Menu Drawer */}
        {menuOpen && (
          <div className="fixed inset-0 top-20 z-50 bg-[#522DB8]/95 backdrop-blur-lg flex flex-col items-center gap-6 pt-10 md:hidden pointer-events-auto">
            <a href="#features" onClick={() => setMenuOpen(false)} className="text-lg font-semibold text-white hover:text-[#FACC15]">Features</a>
            <a href="#curriculum" onClick={() => setMenuOpen(false)} className="text-lg font-semibold text-white hover:text-[#FACC15]">Curriculum</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)} className="text-lg font-semibold text-white hover:text-[#FACC15]">Pricing</a>
            <a href="#about" onClick={() => setMenuOpen(false)} className="text-lg font-semibold text-white hover:text-[#FACC15]">About us</a>
            <Link href="/login" onClick={() => setMenuOpen(false)} className="text-lg font-bold text-white hover:text-[#FACC15] mt-4">Log in</Link>
            <Link href="/signup" onClick={() => setMenuOpen(false)} className="rounded-full bg-[#FACC15] px-8 py-3 text-base font-bold text-[#0B1B3A]">Get Started</Link>
          </div>
        )}

        <main className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-28 md:pt-32 pb-6 md:pb-12 flex-grow grid grid-cols-1 md:grid-cols-12 items-center gap-8">
          
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
                className="inline-flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-black/60 shadow-lg"
              >
                Learn More
              </a>
            </div>

          </div>

          <div className="hidden md:block md:col-span-6 lg:col-span-6 relative h-full z-20">
            
            {/* New Black COPPA Badge with Hover Flip Arrow */}
            <button
              onClick={() => setCoppaOpen(true)}
              className="group absolute top-2 right-12 lg:right-24 z-30 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 focus:outline-none"
              title="Click for COPPA & Child Safety Specs"
            >
              <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-black shadow-2xl">
                <svg className="w-full h-full animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100">
                  <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                  <text className="text-[9.5px] font-extrabold uppercase fill-white tracking-widest">
                    <textPath href="#circlePath" startOffset="0%">
                      DESIGNED FOR AGES 3 TO 9 • COPPA SAFE • 
                    </textPath>
                  </text>
                </svg>
                <div className="absolute w-12 h-12 rounded-full bg-white text-[#0B1B3A] flex items-center justify-center shadow-md group-hover:bg-[#FACC15] transition-colors duration-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover:rotate-90">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
              </div>
            </button>

            <img
              src="/hero-characters.png"
              alt="Family Reading On Sofa"
              className="absolute bottom-0 right-6 lg:right-16 w-[560px] lg:w-[720px] xl:w-[800px] max-w-none object-contain pointer-events-none drop-shadow-2xl translate-y-[18%]"
            />
          </div>

        </main>

        <div className="block md:hidden relative z-20 w-full flex justify-center pointer-events-none mt-2">
          <img
            src="/hero-characters.png"
            alt="Onesimos Family Learning"
            className="w-[90%] max-w-[400px] h-auto object-contain drop-shadow-2xl -translate-x-3 translate-y-[14%]"
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
            <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#0B1B3A]/5 shadow-sm flex flex-col justify-between">
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

            <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#0B1B3A]/5 shadow-sm flex flex-col justify-between">
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

            <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#0B1B3A]/5 shadow-sm flex flex-col justify-between">
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

      {/* Upgraded COPPA Modal */}
      {coppaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1B3A]/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl text-[#0B1B3A]">
            <button
              onClick={() => setCoppaOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-extrabold font-[family-name:var(--font-switzer)]">Child Safety First</h3>
                <p className="text-sm text-gray-500 font-medium">COPPA Compliant Platform</p>
              </div>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-gray-700">
              <p className="font-semibold text-[#0B1B3A]">
                Onesimos is designed for children ages 3 to 9 and fully complies with COPPA regulations.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                  <span>No personal data is collected from children without verified parental consent.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                  <span>All reading sessions are processed locally or under strict data minimization.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                  <span>Parents maintain full control over their childs account and data at all times.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                  <span>No third-party advertising or behavioral tracking is ever used.</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setCoppaOpen(false)}
                className="flex-1 rounded-full bg-emerald-600 text-white py-3 text-sm font-bold hover:bg-emerald-700 transition-colors shadow-md"
              >
                Got it
              </button>
              <Link
                href="/privacy"
                className="flex-1 rounded-full border-2 border-gray-200 py-3 text-sm font-bold text-center text-gray-700 hover:border-emerald-600 hover:text-emerald-600 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}