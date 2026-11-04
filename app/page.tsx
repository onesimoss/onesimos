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

        <div className="absolute top-[18%] left-[8%] z-20 pointer-events-none b-f1 block" style={{ opacity: 0.85 }}>
          <svg width="38" height="38" viewBox="0 0 40 40">
            <ellipse className="b-left" cx="14" cy="20" rx="10" ry="7" fill="#FACC15" />
            <ellipse className="b-right" cx="26" cy="20" rx="10" ry="7" fill="#FACC15" />
            <circle cx="20" cy="20" r="2" fill="#1a1a2e" />
          </svg>
        </div>
        <div className="absolute top-[12%] right-[15%] z-20 pointer-events-none b-f2 block" style={{ opacity: 0.7 }}>
          <svg width="30" height="30" viewBox="0 0 40 40">
            <ellipse className="b-left" cx="14" cy="20" rx="10" ry="7" fill="#A78BFA" />
            <ellipse className="b-right" cx="26" cy="20" rx="10" ry="7" fill="#A78BFA" />
            <circle cx="20" cy="20" r="2" fill="#1a1a2e" />
          </svg>
        </div>
        <div className="absolute top-[55%] left-[5%] z-20 pointer-events-none b-f3 block" style={{ opacity: 0.75 }}>
          <svg width="34" height="34" viewBox="0 0 40 40">
            <ellipse className="b-left" cx="14" cy="20" rx="10" ry="7" fill="#34D399" />
            <ellipse className="b-right" cx="26" cy="20" rx="10" ry="7" fill="#34D399" />
            <circle cx="20" cy="20" r="2" fill="#1a1a2e" />
          </svg>
        </div>
        <div className="absolute top-[40%] right-[8%] z-20 pointer-events-none b-f1 block" style={{ opacity: 0.65 }}>
          <svg width="28" height="28" viewBox="0 0 40 40">
            <ellipse className="b-left" cx="14" cy="20" rx="10" ry="7" fill="#FB923C" />
            <ellipse className="b-right" cx="26" cy="20" rx="10" ry="7" fill="#FB923C" />
            <circle cx="20" cy="20" r="2" fill="#1a1a2e" />
          </svg>
        </div>
        <div className="absolute top-[70%] left-[45%] z-20 pointer-events-none b-f2 block" style={{ opacity: 0.6 }}>
          <svg width="32" height="32" viewBox="0 0 40 40">
            <ellipse className="b-left" cx="14" cy="20" rx="10" ry="7" fill="#F472B6" />
            <ellipse className="b-right" cx="26" cy="20" rx="10" ry="7" fill="#F472B6" />
            <circle cx="20" cy="20" r="2" fill="#1a1a2e" />
          </svg>
        </div>
        <div className="absolute bottom-[18%] right-[12%] z-20 pointer-events-none b-f3 block" style={{ opacity: 0.7 }}>
          <svg width="30" height="30" viewBox="0 0 40 40">
            <ellipse className="b-left" cx="14" cy="20" rx="10" ry="7" fill="#60A5FA" />
            <ellipse className="b-right" cx="26" cy="20" rx="10" ry="7" fill="#60A5FA" />
            <circle cx="20" cy="20" r="2" fill="#1a1a2e" />
          </svg>
        </div>
        <div className="absolute bottom-[10%] right-[22%] z-20 pointer-events-none b-f1 block" style={{ opacity: 0.75 }}>
          <svg width="26" height="26" viewBox="0 0 40 40">
            <ellipse className="b-left" cx="14" cy="20" rx="10" ry="7" fill="#FACC15" />
            <ellipse className="b-right" cx="26" cy="20" rx="10" ry="7" fill="#F472B6" />
            <circle cx="20" cy="20" r="2" fill="#1a1a2e" />
          </svg>
        </div>

        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <img src="/hero-bg-desktop.jpg" alt="Onesimos Desktop Hero" className="hidden md:block w-full h-full object-cover object-center" />
          <img src="/hero-bg-mobile.jpg" alt="Onesimos Mobile Hero" className="block md:hidden w-full h-full object-cover object-center" />
        </div>

        <header className="fixed top-5 inset-x-0 z-40 w-full px-6 md:px-8 pointer-events-none">
          <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between">
            
            <Link href="/" className="flex items-center gap-2.5 pointer-events-auto">
              <img
                src="/logo.png"
                alt="Onesimos"
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="font-[family-name:var(--font-achiko)] text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                Onesimos
              </span>
            </Link>

            {/* Sample-matched pill: fixed height, perfect vertical center, firmly seated chips */}
            <nav className="hidden md:flex items-center h-11 p-1 rounded-full bg-black/25 backdrop-blur-xl border border-white/10 shadow-xl pointer-events-auto">
              <a href="#features" className="flex items-center justify-center h-full px-5 rounded-full text-[13px] font-semibold leading-none text-white transition-colors hover:bg-[#FACC15] hover:text-[#0B1B3A]">Features</a>
              <a href="#curriculum" className="flex items-center justify-center h-full px-5 rounded-full text-[13px] font-semibold leading-none text-white transition-colors hover:bg-[#FACC15] hover:text-[#0B1B3A]">Curriculum</a>
              <a href="#pricing" className="flex items-center justify-center h-full px-5 rounded-full text-[13px] font-semibold leading-none text-white transition-colors hover:bg-[#FACC15] hover:text-[#0B1B3A]">Pricing</a>
              <a href="#about" className="flex items-center justify-center h-full px-5 rounded-full text-[13px] font-semibold leading-none text-white transition-colors hover:bg-[#FACC15] hover:text-[#0B1B3A]">About us</a>
            </nav>

            <div className="hidden md:flex items-center gap-2 pointer-events-auto">
              <Link href="/login" className="text-sm font-bold text-white hover:text-[#FACC15] transition-colors px-3 py-2">
                Log in
              </Link>
              <Link href="/signup" className="rounded-full bg-[#FACC15] px-5 py-2.5 text-sm font-bold text-[#0B1B3A] hover:bg-white transition-all shadow-md hover:scale-105 active:scale-95">
                Get Started
              </Link>
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/25 backdrop-blur-md md:hidden text-white hover:bg-black/40 pointer-events-auto border border-white/10"
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

                        {menuOpen && (
          <div className="fixed inset-0 z-[100] md:hidden pointer-events-auto flex items-center justify-center p-5">
            {/* Backdrop — tap to dismiss */}
            <div className="absolute inset-0 bg-[#0B1B3A]/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />

            {/* CARD — locked size, nothing inside can stretch it */}
            <div className="relative w-full max-w-[340px] h-[420px] bg-white rounded-[28px] shadow-2xl overflow-hidden flex">
              
              {/* Red X — tucked inside, top right */}
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="absolute top-4 right-4 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md active:scale-95"
                aria-label="Close menu"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* LEFT: nav + CTAs */}
              <div className="relative z-10 flex w-[52%] flex-col justify-between px-6 pt-14 pb-6">
                <nav className="flex flex-col gap-5">
                  <a href="#features" onClick={() => setMenuOpen(false)} className="text-[1.25rem] font-extrabold leading-tight text-[#0B1B3A]">Features</a>
                  <a href="#curriculum" onClick={() => setMenuOpen(false)} className="text-[1.25rem] font-extrabold leading-tight text-[#0B1B3A]">Curriculum</a>
                  <a href="#pricing" onClick={() => setMenuOpen(false)} className="text-[1.25rem] font-extrabold leading-tight text-[#0B1B3A]">Pricing</a>
                  <a href="#about" onClick={() => setMenuOpen(false)} className="text-[1.25rem] font-extrabold leading-tight text-[#0B1B3A]">About us</a>
                </nav>

                <div className="flex flex-col gap-2.5 w-full">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#0B1B3A] text-sm font-bold text-white shadow-sm active:scale-95 transition-transform"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#FACC15] text-sm font-bold text-[#0B1B3A] shadow-sm active:scale-95 transition-transform"
                  >
                    Get Started
                  </Link>
                </div>
              </div>

              {/* RIGHT: contained character column */}
              <div className="relative w-[48%] flex items-end justify-center bg-gradient-to-br from-[#F8F7FF] to-[#EDE9FE] border-l border-gray-100">
                <img
                  src="/menu-character.png"
                  alt=""
                  className="h-[78%] w-auto max-w-[95%] object-contain object-bottom pointer-events-none select-none"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            </div>
          </div>
        )}

        <main className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-28 md:pt-32 pb-6 md:pb-12 flex-grow grid grid-cols-1 md:grid-cols-12 items-center gap-8">
          
          <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-center items-start text-white max-w-full md:max-w-none">
            
            <div className="h-[200px] sm:h-[220px] lg:h-[260px] flex items-end sm:items-center pb-2 sm:pb-0 mt-2">
              <h1
                className={`font-[family-name:var(--font-switzer)] text-[2.7rem] sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight whitespace-pre-line transition-opacity duration-300 ${
                  fade ? "opacity-100" : "opacity-0"
                }`}
              >
                {phrases[phraseIndex]}
              </h1>
            </div>

            <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed max-w-[340px] font-normal drop-shadow-sm">
              Personalized learning chapters and real-time speech evaluation designed to build independent confidence in young readers.
            </p>

            <div className="mt-16 md:mt-8 flex w-full md:w-auto flex-nowrap items-center justify-center md:justify-start gap-3 md:gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-[#FACC15] px-5 py-3 text-[13px] md:px-7 md:py-3.5 md:text-sm font-bold text-[#0B1B3A] transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-xl"
              >
                Get Started
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full bg-black/25 backdrop-blur-md border border-white/10 px-5 py-3 text-[13px] md:px-7 md:py-3.5 md:text-sm font-semibold text-white transition-colors hover:bg-black/40 shadow-lg"
              >
                Learn More
              </a>
            </div>

          </div>

          <div className="hidden md:block md:col-span-6 lg:col-span-6 relative h-full z-20">
            
            <button
              onClick={() => setCoppaOpen(true)}
              className="group absolute top-10 right-4 lg:right-8 z-30 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 focus:outline-none"
              title="Click for COPPA & Child Safety Specs"
            >
              <div className="relative w-28 h-28 flex items-center justify-center">
                
                <div
                  className="absolute inset-0 rounded-full bg-black shadow-2xl"
                  style={{
                    maskImage: "radial-gradient(circle, transparent 26px, black 27px)",
                    WebkitMaskImage: "radial-gradient(circle, transparent 26px, black 27px)"
                  }}
                />

                <svg className="absolute w-full h-full animate-[spin_12s_linear_infinite] pointer-events-none" viewBox="0 0 100 100">
                  <defs>
                    <path id="circlePath" d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" fill="none" />
                  </defs>
                  <text className="fill-white" style={{ fontSize: "8.5px", fontWeight: 500, letterSpacing: "2.5px" }}>
                    <textPath href="#circlePath" startOffset="0%">
                      COPPA SAFE  •  DESIGNED FOR AGES 3 TO 9  •  
                    </textPath>
                  </text>
                </svg>

                <div className="absolute w-[42px] h-[42px] rounded-full bg-white text-[#0B1B3A] flex items-center justify-center shadow-md group-hover:bg-[#FACC15] transition-colors duration-300 z-10">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover:rotate-90">
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

        <button onClick={() => setCoppaOpen(true)} className="md:hidden absolute top-[140px] right-4 z-30 flex items-center justify-center active:scale-95" title="COPPA">
<div className="relative w-20 h-20 flex items-center justify-center">
<div className="absolute inset-0 rounded-full bg-black shadow-2xl" style={{ maskImage: "radial-gradient(circle, transparent 18px, black 19px)", WebkitMaskImage: "radial-gradient(circle, transparent 18px, black 19px)" }} />
<svg className="absolute w-full h-full animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100"><defs><path id="circlePathMobile" d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" fill="none" /></defs><text className="fill-white" style={{ fontSize: "8.5px", fontWeight: 500, letterSpacing: "2.5px" }}><textPath href="#circlePathMobile">COPPA SAFE  •  DESIGNED FOR AGES 3 TO 9  •  </textPath></text></svg>
<div className="absolute w-[30px] h-[30px] rounded-full bg-white text-[#0B1B3A] flex items-center justify-center shadow-md"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg></div>
</div>
</button>
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