@'
const fs = require('fs');
const path = require('path');

const pageCode = `"use client";

import React, { useState } from "react";
import Link from "next/link";

type AgeKey = "3-5" | "6-8" | "9-12";

const AGES: Record<AgeKey, { title: string; desc: string; color: string }> = {
  "3-5": {
    title: "Foundation Seekers",
    desc: "Interactive visual storytelling and sound-letter play to build early phonemic awareness.",
    color: "bg-[#F472B6]",
  },
  "6-8": {
    title: "Word Explorers",
    desc: "Sentence structure and reading comprehension through personalized living story chapters.",
    color: "bg-[#A3E635]",
  },
  "9-12": {
    title: "Master Readers",
    desc: "Advanced vocabulary and real-time speech recognition evaluation for confident narrative reading.",
    color: "bg-[#A78BFA]",
  },
};

const PROMISES = [
  {
    number: "01",
    title: "Personalized Learning Chapters",
    description: "Every story adapts to your child's reading level and interests, keeping them challenged without frustration.",
    tags: ["Adaptive stories", "Vocabulary scaling"],
    bg: "bg-[#A3E635]",
    text: "text-[#0B1B3A]",
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    mascot: "😊",
  },
  {
    number: "02",
    title: "Real-Time Speech Evaluation",
    description: "Our browser-native speech recognition engine listens as your child reads aloud and provides instant pronunciation feedback.",
    tags: ["Speech recognition", "Instant feedback"],
    bg: "bg-[#FACC15]",
    text: "text-[#0B1B3A]",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
    mascot: "📖",
  },
  {
    number: "03",
    title: "100% Parent PIN Protection",
    description: "Zero ads, zero social tracking, and every administrative setting locked safely behind your personal Parent PIN.",
    tags: ["No ads", "Parent PIN locked"],
    bg: "bg-[#7DD3FC]",
    text: "text-[#0B1B3A]",
    img: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    mascot: "🔒",
  },
  {
    number: "04",
    title: "Curriculum Designed for Ages 3 to 12",
    description: "Structured pathways that take early learners from letter sounds all the way to fluent chapter reading.",
    tags: ["Ages 3-12", "Progress tracking"],
    bg: "bg-[#A78BFA]",
    text: "text-[#0B1B3A]",
    img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
    mascot: "🎓",
  },
];

const STEPS = [
  { step: "01", title: "Create Profile", text: "Add your child's name and initial reading age level." },
  { step: "02", title: "Pick a Topic", text: "Choose themes your child loves, from space exploration to magic." },
  { step: "03", title: "Read Aloud", text: "Real-time speech evaluation listens and assists with tricky words." },
  { step: "04", title: "Track Progress", text: "Review reading speed, vocabulary growth, and unlocked badges." },
];

const FAQS = [
  {
    q: "How does the personalized story generator work?",
    a: "Our adaptive synthesis system creates original chapters formatted specifically for your child's age group, vocabulary level, and interests.",
  },
  {
    q: "Is speech evaluation included in all plans?",
    a: "Real-time speech evaluation is available across all tiers, with advanced voice diagnostics on Parent and School plans.",
  },
  {
    q: "How does the School Plan work for classrooms?",
    a: "The School Plan includes a centralized educator dashboard, student roster management, and bulk seat assignments for up to 30 students per classroom.",
  },
];

const HERO_KIDS = [
  { img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80", bg: "bg-[#FACC15]" },
  { img: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80", bg: "bg-[#F97316]" },
  { img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80", bg: "bg-[#F472B6]" },
  { img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=300&q=80", bg: "bg-[#A3E635]" },
  { img: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=300&q=80", bg: "bg-[#7DD3FC]" },
  { img: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=300&q=80", bg: "bg-[#A78BFA]" },
];

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-2xl bg-[#F97316] border-2 border-[#0B1B3A] shadow-[2px_2px_0px_0px_#0B1B3A] flex items-center justify-center text-white font-black text-2xl font-[family-name:var(--font-achiko)]">
        O
      </div>
      <span className="text-3xl font-black tracking-tighter text-[#0B1B3A] font-[family-name:var(--font-achiko)] uppercase">
        onesimos
      </span>
    </div>
  );
}

function CheckIcon({ dark = false }: { dark?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill={dark ? "#F97316" : "#A3E635"} />
      <path d="M6 10L9 13L14 7" stroke={dark ? "#FFFFFF" : "#0B1B3A"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// --- Floating Mascot SVG Characters ---

function YellowCircleMascot() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" className="w-16 h-16 md:w-24 md:h-24 filter drop-shadow-md">
      <circle cx="45" cy="45" r="42" fill="#FACC15" stroke="#0B1B3A" strokeWidth="4" />
      <circle cx="32" cy="38" r="4.5" fill="#0B1B3A" />
      <circle cx="58" cy="38" r="4.5" fill="#0B1B3A" />
      <path d="M34 52C34 52 39 58 45 58C51 58 56 52 56 52" stroke="#0B1B3A" strokeWidth="4" strokeLinecap="round" />
      <circle cx="26" cy="46" r="5" fill="#F97316" opacity="0.4" />
      <circle cx="64" cy="46" r="5" fill="#F97316" opacity="0.4" />
    </svg>
  );
}

function GreenSquareMascot() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" className="w-16 h-16 md:w-22 md:h-22 filter drop-shadow-md">
      <rect x="4" y="4" width="82" height="82" rx="26" fill="#A3E635" stroke="#0B1B3A" strokeWidth="4" />
      <circle cx="32" cy="40" r="4.5" fill="#0B1B3A" />
      <circle cx="58" cy="40" r="4.5" fill="#0B1B3A" />
      <path d="M36 54C36 54 41 60 45 60C49 60 54 54 54 54" stroke="#0B1B3A" strokeWidth="4" strokeLinecap="round" />
      <circle cx="24" cy="48" r="5" fill="#16A34A" opacity="0.3" />
      <circle cx="66" cy="48" r="5" fill="#16A34A" opacity="0.3" />
    </svg>
  );
}

function PinkArchMascot() {
  return (
    <svg width="80" height="100" viewBox="0 0 80 100" fill="none" className="w-16 h-20 md:w-20 md:h-24 filter drop-shadow-md">
      <path d="M4 40C4 20.1178 20.1178 4 40 4C59.8822 4 76 20.1178 76 40V84C76 90.6274 70.6274 96 64 96H16C9.37258 96 4 90.6274 4 84V40Z" fill="#F472B6" stroke="#0B1B3A" strokeWidth="4" />
      <circle cx="28" cy="40" r="4" fill="#0B1B3A" />
      <circle cx="52" cy="40" r="4" fill="#0B1B3A" />
      <path d="M32 52C32 52 36 56 40 56C44 56 48 52 48 52" stroke="#0B1B3A" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="20" cy="46" r="4" fill="#DB2777" opacity="0.3" />
      <circle cx="60" cy="46" r="4" fill="#DB2777" opacity="0.3" />
    </svg>
  );
}

function OrangeCircleMascot() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="w-12 h-12 md:w-16 md:h-16 filter drop-shadow-md">
      <circle cx="30" cy="30" r="27" fill="#F97316" stroke="#0B1B3A" strokeWidth="3.5" />
      <circle cx="20" cy="25" r="3" fill="#0B1B3A" />
      <circle cx="40" cy="25" r="3" fill="#0B1B3A" />
      <path d="M23 35C23 35 26 39 30 39C34 39 37 35 37 35" stroke="#0B1B3A" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function PurpleDomeMascot() {
  return (
    <svg width="110" height="70" viewBox="0 0 110 70" fill="none" className="w-20 h-14 md:w-28 md:h-18 filter drop-shadow-md">
      <path d="M4 52C4 25.4903 25.4903 4 52 4C78.5097 4 100 25.4903 100 52V56C100 61.5228 95.5228 66 90 66H14C8.47715 66 4 61.5228 4 56V52Z" fill="#A78BFA" stroke="#0B1B3A" strokeWidth="4" />
      <circle cx="38" cy="36" r="4" fill="#0B1B3A" />
      <circle cx="66" cy="36" r="4" fill="#0B1B3A" />
      <path d="M44 48C44 48 48 52 52 52C56 52 60 48 60 48" stroke="#0B1B3A" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#0B1B3A]/10 py-6">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center text-left font-bold text-xl text-[#0B1B3A] font-[family-name:var(--font-switzer)]">
        <span>{question}</span>
        <span className={"text-2xl transition-transform duration-300 " + (open ? "rotate-45" : "rotate-0")}>+</span>
      </button>
      {open && <p className="mt-4 text-[#0B1B3A]/70 leading-relaxed font-[family-name:var(--font-switzer)]">{answer}</p>}
    </div>
  );
}

export default function HomePage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [age, setAge] = useState<AgeKey>("3-5");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const active = AGES[age];
  const ageKeys = Object.keys(AGES) as AgeKey[];

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#0B1B3A] font-[family-name:var(--font-switzer)] selection:bg-[#F97316] selection:text-white">
      
      {/* Fixed Sticky Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FDF8F3]/90 backdrop-blur-md border-b border-[#0B1B3A]/10 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Logo />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 font-bold text-sm text-[#0B1B3A]">
            <a href="#promises" className="hover:text-[#F97316] transition-colors">Why Onesimos</a>
            <a href="#curriculum" className="hover:text-[#F97316] transition-colors">Curriculum</a>
            <a href="#pricing" className="hover:text-[#F97316] transition-colors">Tuition & Plans</a>
            <a href="#faq" className="hover:text-[#F97316] transition-colors">FAQ</a>
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-5 py-2.5 rounded-full font-bold text-sm bg-transparent text-[#0B1B3A] border-2 border-[#0B1B3A] hover:bg-[#0B1B3A] hover:text-white transition-all">
              Login
            </Link>
            <Link href="/login" className="px-6 py-2.5 rounded-full font-bold text-sm bg-[#F97316] text-white border-2 border-[#0B1B3A] shadow-[3px_3px_0px_0px_#0B1B3A] hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2">
              <span>Start Free</span>
              <span className="text-base">😊</span>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#0B1B3A] focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Slide-down Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FDF8F3] border-b-2 border-[#0B1B3A] px-6 pt-4 pb-8 space-y-4 shadow-xl">
            <a href="#promises" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-[#0B1B3A]">Why Onesimos</a>
            <a href="#curriculum" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-[#0B1B3A]">Curriculum</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-[#0B1B3A]">Tuition & Plans</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-[#0B1B3A]">FAQ</a>
            <div className="pt-4 flex flex-col gap-3">
              <Link href="/login" className="w-full text-center py-3 rounded-full font-bold text-sm border-2 border-[#0B1B3A]">Login</Link>
              <Link href="/login" className="w-full text-center py-3 rounded-full font-bold text-sm bg-[#F97316] text-white border-2 border-[#0B1B3A] shadow-[3px_3px_0px_0px_#0B1B3A]">Start Free Explorer 😊</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Container Padding for Fixed Sticky Header */}
      <div className="pt-24">

        {/* Hero Section */}
        <section className="px-4 pb-12 pt-4">
          <div className="max-w-7xl mx-auto bg-[#0B1B3A] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-20 relative overflow-hidden text-center min-h-[620px] flex flex-col items-center justify-between border-2 border-[#0B1B3A]">
            
            {/* Background SVG Grid Overlay Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Floating Character Mascots */}
            <div className="absolute top-10 left-6 md:top-14 md:left-14 animate-bounce" style={{ animationDuration: '4s' }}>
              <YellowCircleMascot />
            </div>
            <div className="absolute top-1/2 left-4 md:left-12 transform -translate-y-1/2 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
              <GreenSquareMascot />
            </div>
            <div className="absolute top-10 right-6 md:top-14 md:right-14 animate-bounce" style={{ animationDuration: '4.2s', animationDelay: '0.5s' }}>
              <PinkArchMascot />
            </div>
            <div className="absolute top-1/2 right-4 md:right-16 transform -translate-y-1/2 animate-bounce" style={{ animationDuration: '3.8s', animationDelay: '1.2s' }}>
              <OrangeCircleMascot />
            </div>
            <div className="absolute bottom-16 right-8 md:bottom-20 md:right-24 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '0.8s' }}>
              <PurpleDomeMascot />
            </div>

            {/* Top Pill Badge */}
            <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A3E635] text-[#0B1B3A] font-extrabold text-xs md:text-sm mb-6 border-2 border-[#0B1B3A] shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0B1B3A] animate-pulse" />
              Personalized reading for ages 3 to 12
            </div>

            {/* Wrenly Multi-Colored Headline */}
            <div className="max-w-4xl mx-auto relative z-10">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 leading-[1.08] tracking-tighter font-[family-name:var(--font-achiko)]">
                Where every child <span className="text-[#FACC15]">reads</span> their{" "}
                <span className="inline-block bg-[#F472B6] text-[#0B1B3A] px-3 md:px-5 py-0.5 rounded-2xl mx-1 font-black transform -rotate-1 border-2 border-[#0B1B3A]">
                  own
                </span>{" "}
                <span className="text-[#7DD3FC]">story,</span> <br className="hidden sm:inline" />
                every single <span className="text-[#A78BFA]">day.</span>
              </h1>

              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
                Onesimos creates personalized learning chapters that adapt to your child&apos;s pace, featuring real-time speech evaluation and 100% Parent PIN protection.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Link href="/login" className="px-8 py-4 bg-[#F97316] text-white rounded-full text-lg font-bold border-2 border-[#0B1B3A] shadow-[4px_4px_0px_0px_#FFFFFF] hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2">
                  <span>Start Free Explorer</span>
                  <span className="text-xl">😊</span>
                </Link>
                <a href="#promises" className="px-8 py-4 bg-white/10 text-white rounded-full text-lg font-bold border-2 border-white/20 hover:bg-white hover:text-[#0B1B3A] transition-all flex items-center gap-2">
                  <span>Explore Features</span>
                  <span>↗</span>
                </a>
              </div>

              {/* Trust Badges Bar */}
              <div className="flex flex-wrap justify-center items-center gap-6 text-white/80 text-xs md:text-sm font-semibold">
                <span className="flex items-center gap-2">✓ 100% Parent PIN Locked</span>
                <span className="flex items-center gap-2">🎓 Real-Time Speech Feedback</span>
                <span className="flex items-center gap-2">⏱️ Built for Ages 3 to 12</span>
              </div>
            </div>

            {/* 6 Arched Kid Photo Cards sitting at bottom of Hero */}
            <div className="relative z-10 w-full grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4 mt-12 pt-6 items-end">
              {HERO_KIDS.map((k, i) => (
                <div key={i} className={\`relative overflow-hidden rounded-t-[3rem] md:rounded-t-[4rem] aspect-[3/4] border-2 border-[#0B1B3A] shadow-md \${k.bg}\`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={k.img} alt="Child reading" className="w-full h-full object-cover mix-blend-multiply opacity-90 hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Yellow Running Ticker Banner */}
        <div className="bg-[#FACC15] border-y-2 border-[#0B1B3A] py-3 overflow-hidden whitespace-nowrap font-bold text-sm text-[#0B1B3A] tracking-wider uppercase">
          <div className="inline-flex gap-8 animate-marquee">
            <span>● Adaptive Story Synthesis</span>
            <span>● Real-Time Speech Recognition</span>
            <span>● 100% Parent PIN Protection</span>
            <span>● Zero Ads or Tracking</span>
            <span>● 25 Core Life Virtues</span>
            <span>● Built for Ages 3 to 12</span>
            <span>● Adaptive Story Synthesis</span>
            <span>● Real-Time Speech Recognition</span>
            <span>● 100% Parent PIN Protection</span>
          </div>
        </div>

        {/* 4 Promises Section */}
        <section id="promises" className="py-20 md:py-28 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* Left Sticky Content Column */}
            <div className="lg:sticky lg:top-28">
              <div className="inline-flex items-center gap-2 bg-white border-2 border-[#0B1B3A] text-sm font-extrabold text-[#0B1B3A] px-4 py-1.5 rounded-full mb-6 shadow-[2px_2px_0px_0px_#0B1B3A]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635]" />
                Why families choose Onesimos
              </div>
              <h2 className="text-4xl md:text-6xl font-black leading-tight text-[#0B1B3A] mb-6 font-[family-name:var(--font-achiko)]">
                Four promises, <br />
                <span className="text-[#F97316]">kept every day.</span>
              </h2>
              <p className="text-lg text-[#0B1B3A]/70 mb-8 max-w-md leading-relaxed font-medium">
                Building confident readers requires the right tools. Here are the guarantees we build into every story chapter and reading session.
              </p>
              <Link href="/login" className="inline-flex items-center gap-2 bg-[#F97316] text-white font-bold text-lg px-8 py-4 rounded-full shadow-[4px_4px_0px_0px_#0B1B3A] border-2 border-[#0B1B3A] hover:translate-y-0.5 hover:shadow-none transition-all">
                <span>Start Reading Now</span>
                <span>😊</span>
              </Link>
            </div>

            {/* Right Stacked Bento Promise Cards */}
            <div className="space-y-6">
              {PROMISES.map((item) => (
                <div key={item.number} className={\`\${item.bg} \${item.text} rounded-[2.5rem] p-8 md:p-10 border-2 border-[#0B1B3A] shadow-[6px_6px_0px_0px_#0B1B3A] relative overflow-hidden grid md:grid-cols-3 gap-6 items-center\`}>
                  <div className="md:col-span-2 relative z-10">
                    <div className="text-5xl md:text-6xl font-black opacity-20 mb-2 font-[family-name:var(--font-achiko)]">{item.number}</div>
                    <h3 className="text-2xl md:text-3xl font-black mb-3 leading-snug font-[family-name:var(--font-achiko)]">{item.title}</h3>
                    <p className="text-base opacity-90 mb-5 leading-relaxed font-medium">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="bg-white/80 border border-[#0B1B3A]/10 text-[#0B1B3A] text-xs font-bold px-3.5 py-1.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Window Image Card on Card Right */}
                  <div className="relative aspect-square rounded-[2rem] overflow-hidden border-2 border-[#0B1B3A] shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white/90 border border-[#0B1B3A] flex items-center justify-center text-lg">
                      {item.mascot}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Curriculum Age Group Tabs */}
        <section id="curriculum" className="bg-white py-24 border-y-2 border-[#0B1B3A]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black mb-4 font-[family-name:var(--font-achiko)]">Curriculum by age group</h2>
              <p className="text-lg text-[#0B1B3A]/60 font-medium">Select your child&apos;s age bracket to preview learning goals.</p>
            </div>
            
            <div className="flex justify-center mb-10 bg-[#FDF8F3] p-2 rounded-full border-2 border-[#0B1B3A] w-fit mx-auto shadow-[3px_3px_0px_0px_#0B1B3A]">
              {ageKeys.map((k) => (
                <button key={k} onClick={() => setAge(k)} className={\`px-6 md:px-8 py-3 rounded-full font-bold text-sm transition-all \${age === k ? "bg-[#0B1B3A] text-white shadow-sm" : "text-[#0B1B3A] hover:bg-[#0B1B3A]/5"}\`}>
                  Ages {k}
                </button>
              ))}
            </div>

            <div className={\`p-10 md:p-16 rounded-[2.5rem] border-2 border-[#0B1B3A] shadow-[8px_8px_0px_0px_#0B1B3A] transition-all duration-500 \${active.color}\`}>
              <h3 className="text-4xl md:text-6xl font-black mb-6 text-[#0B1B3A] font-[family-name:var(--font-achiko)]">{active.title}</h3>
              <p className="text-xl md:text-2xl font-semibold leading-relaxed mb-8 text-[#0B1B3A]">{active.desc}</p>
              <Link href="/login" className="inline-block px-8 py-4 bg-[#0B1B3A] text-white rounded-full font-bold text-base hover:scale-105 transition-transform border-2 border-[#0B1B3A]">
                Explore Age {age}
              </Link>
            </div>
          </div>
        </section>

        {/* 4 Steps Timeline */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-20 font-[family-name:var(--font-achiko)]">4 steps to reading success</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            <div className="hidden md:block absolute top-10 left-0 w-full h-1 bg-[#0B1B3A]/10" />
            {STEPS.map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center relative">
                <div className="w-20 h-20 rounded-full bg-[#F97316] text-white flex items-center justify-center text-2xl font-black border-4 border-[#0B1B3A] mb-6 shadow-md font-[family-name:var(--font-achiko)]">{s.step}</div>
                <h4 className="text-2xl font-bold mb-3 font-[family-name:var(--font-achiko)]">{s.title}</h4>
                <p className="text-[#0B1B3A]/60 leading-relaxed font-medium">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3 Real Paystack NGN Pricing Tiers: Free, Family Unlimited, School Classroom */}
        <section id="pricing" className="py-24 bg-[#FDF8F3] border-t-2 border-[#0B1B3A]">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-black mb-6 font-[family-name:var(--font-achiko)]">Simple, transparent plans</h2>
              
              {/* Billing Toggle Switcher */}
              <div className="flex items-center justify-center gap-4">
                <span className={\`font-bold text-sm \${billingCycle === "monthly" ? "text-[#0B1B3A]" : "text-[#0B1B3A]/40"}\`}>Monthly Billing</span>
                <button 
                  aria-label="Toggle billing interval" 
                  onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")} 
                  className="w-16 h-8 bg-[#0B1B3A] rounded-full relative p-1 transition-colors"
                >
                  <span className={\`block w-6 h-6 bg-[#A3E635] rounded-full border border-[#0B1B3A] transition-all \${billingCycle === "yearly" ? "translate-x-8" : "translate-x-0"}\`} />
                </button>
                <span className={\`font-bold text-sm \${billingCycle === "yearly" ? "text-[#0B1B3A]" : "text-[#0B1B3A]/40"}\`}>
                  Annual Billing <span className="bg-[#A3E635] text-[#0B1B3A] text-xs font-black px-2 py-0.5 rounded-full border border-[#0B1B3A]">Save 33%</span>
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
              
              {/* Plan 1: Starter Explorer (Free) */}
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border-2 border-[#0B1B3A] shadow-[8px_8px_0px_0px_#0B1B3A] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#0B1B3A]/60">Free Tier</span>
                  <h3 className="text-2xl font-black mb-2 font-[family-name:var(--font-achiko)]">Starter Explorer</h3>
                  <p className="text-sm text-[#0B1B3A]/60 mb-6">Perfect for trying out basic story chapters.</p>
                  <div className="text-5xl font-black mb-6 font-[family-name:var(--font-achiko)]">₦0 <span className="text-base text-[#0B1B3A]/40 font-normal">/ forever</span></div>
                  <ul className="space-y-4 mb-8">
                    {[
                      "1 Child Profile",
                      "5 stories per month",
                      "2 solo spelling practice rounds / day",
                      "Basic read-aloud pronunciation feedback",
                      "Standard academic report card"
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-3 font-medium text-sm"><CheckIcon /> {f}</li>
                    ))}
                  </ul>
                </div>
                <Link href="/login" className="block text-center py-4 rounded-full font-bold border-2 border-[#0B1B3A] hover:bg-[#0B1B3A] hover:text-white transition-all">
                  Get Started Free
                </Link>
              </div>

              {/* Plan 2: Family Unlimited (Most Popular) */}
              <div className="bg-[#0B1B3A] p-8 md:p-10 rounded-[2.5rem] border-2 border-[#0B1B3A] text-white shadow-[8px_8px_0px_0px_#F97316] relative flex flex-col justify-between md:-translate-y-3">
                <div className="absolute -top-4 right-8 bg-[#A3E635] text-[#0B1B3A] px-4 py-1 rounded-full font-black text-xs uppercase tracking-wider border-2 border-[#0B1B3A]">
                  Most Popular for Homes
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/60">Family Plan</span>
                  <h3 className="text-2xl font-black mb-2 text-white font-[family-name:var(--font-achiko)]">Family Unlimited</h3>
                  <p className="text-sm text-white/60 mb-6">Complete home reading experience for up to 4 children.</p>
                  <div className="text-5xl font-black mb-6 text-white font-[family-name:var(--font-achiko)]">
                    {billingCycle === "monthly" ? "₦5,000" : "₦39,999"}
                    <span className="text-base text-white/40 font-normal"> / {billingCycle === "monthly" ? "month" : "year"}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {[
                      "Up to 4 Child Profiles",
                      "Unlimited personalized story chapters",
                      "Full 25 Core Life Skills & Virtues curriculum",
                      "Real-time speech recognition evaluation",
                      "Individual Word Pockets & mastery walls",
                      "Comprehensive parent progress dashboard"
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-3 font-semibold text-sm text-white"><CheckIcon dark /> {f}</li>
                    ))}
                  </ul>
                </div>
                <Link href="/login" className="block text-center py-4 bg-[#F97316] text-white rounded-full font-bold shadow-[0_4px_0_0_#C2410C] border-2 border-[#0B1B3A] hover:translate-y-0.5 hover:shadow-none transition-all">
                  Subscribe Family Plan
                </Link>
              </div>

              {/* Plan 3: School Classroom */}
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border-2 border-[#0B1B3A] shadow-[8px_8px_0px_0px_#0B1B3A] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#0B1B3A]/60">Educator License</span>
                  <h3 className="text-2xl font-black mb-2 font-[family-name:var(--font-achiko)]">School Classroom</h3>
                  <p className="text-sm text-[#0B1B3A]/60 mb-6">Designed for teachers and school classrooms.</p>
                  <div className="text-5xl font-black mb-6 font-[family-name:var(--font-achiko)]">
                    {billingCycle === "monthly" ? "₦30,000" : "₦85,000"}
                    <span className="text-base text-[#0B1B3A]/40 font-normal"> / {billingCycle === "monthly" ? "term" : "year"}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {[
                      "Covers 1 Classroom (Up to 30 Students)",
                      "Teacher fluency leaderboard dashboard",
                      "Printable end-of-term report packages",
                      "Group phonics & spelling drills",
                      "Official Onesimos School Partner Badge"
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-3 font-medium text-sm"><CheckIcon /> {f}</li>
                    ))}
                  </ul>
                </div>
                <Link href="/login" className="block text-center py-4 rounded-full font-bold border-2 border-[#0B1B3A] bg-[#0B1B3A] text-white hover:bg-opacity-90 transition-all">
                  Get Classroom License
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-12 font-[family-name:var(--font-achiko)]">Frequently asked questions</h2>
          {FAQS.map((f) => (
            <AccordionItem key={f.q} question={f.q} answer={f.a} />
          ))}
        </section>

        {/* Footer */}
        <footer className="bg-[#0B1B3A] text-white py-16 px-6 border-t-2 border-[#0B1B3A]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo />
            <p className="text-white/50 text-sm">Personalized reading chapters and speech evaluation for ages 3 to 12.</p>
            <p className="text-white/40 text-sm">&copy; {new Date().getFullYear()} Onesimos Reading Inc. All rights reserved.</p>
          </div>
        </footer>

      </div>
    </div>
  );
}
`;

const targetPath = path.join(__dirname, '..', 'app', 'page.tsx');
fs.writeFileSync(targetPath, pageCode, 'utf8');
console.log('✅ SUCCESS: app/page.tsx generated with exact Wrenly visual design, Achiko/Switzer fonts, fixed navbar, and Paystack NGN pricing.');
"@ | Out-File -FilePath scripts/build-exact-wrenly-homepage.cjs -Encoding utf8