"use client";

import React, { useState } from "react";
import Link from "next/link";

type AgeKey = "3-5" | "6-8" | "9-12";

const AGES: Record<AgeKey, { title: string; desc: string; color: string }> = {
  "3-5": {
    title: "Foundation Seekers",
    desc: "Interactive visual storytelling and sound-letter association to build early phonemic awareness.",
    color: "bg-[#F472B6]",
  },
  "6-8": {
    title: "Word Explorers",
    desc: "Sentence structure and comprehension through personalized adventure chapters.",
    color: "bg-[#A3E635]",
  },
  "9-12": {
    title: "Master Readers",
    desc: "Advanced vocabulary and real-time speech recognition evaluation for complex narrative reading.",
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
  },
  {
    number: "02",
    title: "Real-Time Speech Evaluation",
    description: "Our browser-native speech recognition engine listens as your child reads aloud and provides instant pronunciation feedback.",
    tags: ["Speech recognition", "Instant feedback"],
    bg: "bg-[#7DD3FC]",
    text: "text-[#0B1B3A]",
  },
  {
    number: "03",
    title: "100% Parent PIN Protection",
    description: "Zero ads, zero social tracking, and every administrative setting locked safely behind your personal Parent PIN.",
    tags: ["No ads", "Parent PIN locked"],
    bg: "bg-[#F472B6]",
    text: "text-[#0B1B3A]",
  },
  {
    number: "04",
    title: "Curriculum Designed for Ages 3 to 12",
    description: "Structured pathways that take early learners from letter sounds all the way to fluent chapter reading.",
    tags: ["Ages 3-12", "Progress tracking"],
    bg: "bg-[#A78BFA]",
    text: "text-[#0B1B3A]",
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
    a: "The School Plan includes a centralized educator dashboard, student roster management, and bulk seat assignments for classrooms.",
  },
];

function Logo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect width="40" height="40" rx="12" fill="#F97316" />
      <path d="M12 28V12H16L24 22V12H28V28H24L16 18V28H12Z" fill="white" />
    </svg>
  );
}

function CheckIcon({ dark = false }: { dark?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill={dark ? "#F97316" : "#A3E635"} />
      <path d="M6 10L9 13L14 7" stroke={dark ? "#FFFFFF" : "#0B1B3A"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#0B1B3A]/10 py-6">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center text-left font-bold text-xl text-[#0B1B3A]">
        <span>{question}</span>
        <span className={"text-2xl transition-transform duration-300 " + (open ? "rotate-45" : "rotate-0")}>+</span>
      </button>
      {open && <p className="mt-4 text-[#0B1B3A]/70 leading-relaxed">{answer}</p>}
    </div>
  );
}

export default function HomePage() {
  const [yearly, setYearly] = useState(false);
  const [age, setAge] = useState<AgeKey>("3-5");
  const active = AGES[age];
  const ageKeys = Object.keys(AGES) as AgeKey[];

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#0B1B3A] font-sans selection:bg-[#F97316] selection:text-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-2xl font-black tracking-tighter">ONESIMOS</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium">
          <a href="#promises" className="hover:text-[#F97316] transition-colors">Why Onesimos</a>
          <a href="#curriculum" className="hover:text-[#F97316] transition-colors">Curriculum</a>
          <a href="#how-it-works" className="hover:text-[#F97316] transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-[#F97316] transition-colors">Pricing</a>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="px-5 py-2 rounded-full font-bold border-2 border-[#0B1B3A] hover:bg-[#0B1B3A] hover:text-white transition-all">Login</Link>
          <Link href="/login" className="px-5 py-2 rounded-full font-bold bg-[#F97316] text-white border-2 border-[#0B1B3A] shadow-[4px_4px_0px_0px_#0B1B3A] hover:translate-y-1 hover:shadow-none transition-all">Start Free</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 pb-20 pt-6">
        <div className="max-w-7xl mx-auto bg-[#0B1B3A] rounded-[2.5rem] p-10 md:p-24 relative overflow-hidden text-center">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 mb-6 text-sm font-medium backdrop-blur-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635]" />
              Personalized reading for ages 3 to 12
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
              Where every child <span className="text-[#A3E635]">reads</span> their <span className="text-[#F472B6]">own</span> <span className="text-[#7DD3FC]">story</span>.
            </h1>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              Onesimos creates personalized learning chapters that adapt to your child&apos;s pace, featuring real-time speech evaluation and 100% Parent PIN protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="px-10 py-5 bg-[#F97316] text-white rounded-full text-xl font-bold shadow-[0_8px_0_0_#C2410C] hover:translate-y-1 hover:shadow-[0_4px_0_0_#C2410C] transition-all">
                Try Free Explorer
              </Link>
              <a href="#promises" className="px-10 py-5 bg-white text-[#0B1B3A] rounded-full text-xl font-bold border-2 border-white hover:bg-transparent hover:text-white transition-all">
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Wrenly 4 Promises Layout */}
      <section id="promises" className="py-20 md:py-28 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Sticky Content */}
          <div className="lg:sticky lg:top-12">
            <div className="inline-flex items-center gap-2 bg-white border border-[#0B1B3A]/10 text-sm font-bold text-[#0B1B3A] px-4 py-1.5 rounded-full mb-6 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635]" />
              Why families choose Onesimos
            </div>
            <h2 className="text-4xl md:text-6xl font-black leading-tight text-[#0B1B3A] mb-6">
              Four promises, <br />
              <span className="text-[#F97316]">kept every day.</span>
            </h2>
            <p className="text-lg text-[#0B1B3A]/70 mb-8 max-w-md leading-relaxed">
              Building confident readers requires the right tools. Here are the guarantees we build into every story chapter and reading session.
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 bg-[#F97316] text-white font-bold px-8 py-4 rounded-full shadow-[4px_4px_0px_0px_#0B1B3A] border-2 border-[#0B1B3A] hover:translate-y-1 hover:shadow-none transition-all">
              Start Reading Now
            </Link>
          </div>

          {/* Right Stacked Cards */}
          <div className="space-y-6">
            {PROMISES.map((item) => (
              <div key={item.number} className={item.bg + " " + item.text + " rounded-[2.5rem] p-8 md:p-10 border-2 border-[#0B1B3A] shadow-[6px_6px_0px_0px_#0B1B3A] relative overflow-hidden"}>
                <div className="text-5xl md:text-6xl font-black opacity-25 mb-4">{item.number}</div>
                <h3 className="text-2xl md:text-3xl font-black mb-4 leading-snug">{item.title}</h3>
                <p className="text-base md:text-lg opacity-90 mb-6 leading-relaxed max-w-md">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="bg-white/80 border border-[#0B1B3A]/10 text-[#0B1B3A] text-sm font-bold px-4 py-1.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Age Tabs Curriculum */}
      <section id="curriculum" className="bg-white py-24 border-y-2 border-[#0B1B3A]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Curriculum by age group</h2>
            <p className="text-lg text-[#0B1B3A]/60">Select your child&apos;s age bracket to preview learning goals.</p>
          </div>
          <div className="flex justify-center mb-10 bg-[#FDF8F3] p-2 rounded-full border-2 border-[#0B1B3A] w-fit mx-auto">
            {ageKeys.map((k) => (
              <button key={k} onClick={() => setAge(k)} className={"px-6 md:px-8 py-3 rounded-full font-bold transition-all " + (age === k ? "bg-[#0B1B3A] text-white" : "text-[#0B1B3A] hover:bg-[#0B1B3A]/5")}>
                Ages {k}
              </button>
            ))}
          </div>
          <div className={"p-10 md:p-16 rounded-[2.5rem] border-2 border-[#0B1B3A] shadow-[8px_8px_0px_0px_#0B1B3A] transition-all duration-500 " + active.color}>
            <h3 className="text-4xl md:text-6xl font-black mb-6 text-[#0B1B3A]">{active.title}</h3>
            <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8 text-[#0B1B3A]">{active.desc}</p>
            <Link href="/login" className="inline-block px-8 py-4 bg-[#0B1B3A] text-white rounded-full font-bold hover:scale-105 transition-transform">
              Explore Age {age}
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Steps Timeline */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-20">4 steps to reading success</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          <div className="hidden md:block absolute top-10 left-0 w-full h-1 bg-[#0B1B3A]/10" />
          {STEPS.map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center relative">
              <div className="w-20 h-20 rounded-full bg-[#F97316] text-white flex items-center justify-center text-2xl font-black border-4 border-[#0B1B3A] mb-6 shadow-md">{s.step}</div>
              <h4 className="text-2xl font-bold mb-3">{s.title}</h4>
              <p className="text-[#0B1B3A]/60 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Tier Pricing Section: Free, Parent, School */}
      <section id="pricing" className="py-24 bg-[#FDF8F3] border-t-2 border-[#0B1B3A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-black mb-6">Simple, transparent plans</h2>
            <div className="flex items-center justify-center gap-4">
              <span className={"font-bold " + (yearly ? "text-[#0B1B3A]/40" : "text-[#0B1B3A]")}>Monthly</span>
              <button aria-label="Toggle billing" onClick={() => setYearly(!yearly)} className="w-16 h-8 bg-[#0B1B3A] rounded-full relative">
                <span className={"absolute top-1 w-6 h-6 bg-white rounded-full transition-all " + (yearly ? "left-9" : "left-1")} />
              </button>
              <span className={"font-bold " + (yearly ? "text-[#0B1B3A]" : "text-[#0B1B3A]/40")}>Yearly (Save 20%)</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {/* Free Tier */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border-2 border-[#0B1B3A] shadow-[8px_8px_0px_0px_#0B1B3A] flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Free Explorer</h3>
                <p className="text-sm text-[#0B1B3A]/60 mb-6">Perfect for trying out basic story synthesis.</p>
                <div className="text-5xl font-black mb-6">$0<span className="text-xl text-[#0B1B3A]/40 font-normal">/forever</span></div>
                <ul className="space-y-4 mb-8">
                  {["1 Child Profile", "Basic story synthesis", "Real-time speech evaluation", "Parent PIN protection"].map((f) => (
                    <li key={f} className="flex items-center gap-3 font-medium text-sm"><CheckIcon /> {f}</li>
                  ))}
                </ul>
              </div>
              <Link href="/login" className="block text-center py-4 rounded-full font-bold border-2 border-[#0B1B3A] hover:bg-[#0B1B3A] hover:text-white transition-all">
                Get Started Free
              </Link>
            </div>

            {/* Parent Tier */}
            <div className="bg-[#0B1B3A] p-8 md:p-10 rounded-[2.5rem] border-2 border-[#0B1B3A] text-white shadow-[8px_8px_0px_0px_#F97316] relative flex flex-col justify-between md:-translate-y-3">
              <div className="absolute -top-4 right-8 bg-[#A3E635] text-[#0B1B3A] px-4 py-1 rounded-full font-bold text-xs uppercase tracking-wider border border-[#0B1B3A]">
                Most Popular
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-white">Parent Pro</h3>
                <p className="text-sm text-white/60 mb-6">Complete home reading experience for families.</p>
                <div className="text-5xl font-black mb-6 text-white">
                  {yearly ? "$7.99" : "$9.99"}
                  <span className="text-xl text-white/40 font-normal">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {["Unlimited Child Profiles", "Unlimited personalized chapters", "Advanced speech feedback", "Comprehensive parent dashboard", "Priority support"].map((f) => (
                    <li key={f} className="flex items-center gap-3 font-medium text-sm text-white"><CheckIcon dark /> {f}</li>
                  ))}
                </ul>
              </div>
              <Link href="/login" className="block text-center py-4 bg-[#F97316] text-white rounded-full font-bold shadow-[0_4px_0_0_#C2410C] hover:translate-y-1 hover:shadow-none transition-all">
                Subscribe Parent Pro
              </Link>
            </div>

            {/* School Tier */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border-2 border-[#0B1B3A] shadow-[8px_8px_0px_0px_#0B1B3A] flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">School Plan</h3>
                <p className="text-sm text-[#0B1B3A]/60 mb-6">Designed for educators and classrooms.</p>
                <div className="text-5xl font-black mb-6">
                  {yearly ? "$49.99" : "$59.99"}
                  <span className="text-xl text-[#0B1B3A]/40 font-normal">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {["Full Classroom Rosters", "Bulk student seat licenses", "Teacher diagnostic dashboard", "Curriculum alignment reports", "Dedicated account manager"].map((f) => (
                    <li key={f} className="flex items-center gap-3 font-medium text-sm"><CheckIcon /> {f}</li>
                  ))}
                </ul>
              </div>
              <Link href="/login" className="block text-center py-4 rounded-full font-bold border-2 border-[#0B1B3A] bg-[#0B1B3A] text-white hover:bg-opacity-90 transition-all">
                Contact School Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-black text-center mb-12">Frequently asked questions</h2>
        {FAQS.map((f) => (
          <AccordionItem key={f.q} question={f.q} answer={f.a} />
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-[#0B1B3A] text-white py-16 px-6 border-t-2 border-[#0B1B3A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-2xl font-black tracking-tighter">ONESIMOS</span>
          </div>
          <p className="text-white/50 text-sm">Personalized reading chapters and speech evaluation for ages 3 to 12.</p>
          <p className="text-white/40 text-sm">&copy; {new Date().getFullYear()} Onesimos Reading Inc.</p>
        </div>
      </footer>
    </div>
  );
}
