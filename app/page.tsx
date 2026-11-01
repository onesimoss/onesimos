"use client";

import React, { useState } from "react";
import Link from "next/link";

type AgeKey = "3-5" | "6-8" | "9-12";

const AGES: Record<AgeKey, { title: string; desc: string; color: string }> = {
  "3-5": {
    title: "Foundation Seekers",
    desc: "Visual storytelling and sound and letter play that build early phonemic awareness.",
    color: "bg-[#F472B6]",
  },
  "6-8": {
    title: "Word Explorers",
    desc: "Sentence building and comprehension through personalized learning chapters.",
    color: "bg-[#A3E635]",
  },
  "9-12": {
    title: "Master Readers",
    desc: "Richer vocabulary and real-time speech recognition evaluation for confident narrative reading.",
    color: "bg-[#A78BFA]",
  },
};

const STEPS = [
  { step: "01", title: "Create a Profile", text: "Add your child and their reading level." },
  { step: "02", title: "Pick a Story", text: "Choose a theme they love, from space to magic." },
  { step: "03", title: "Read Aloud", text: "Real-time speech evaluation offers gentle guidance." },
  { step: "04", title: "Level Up", text: "Unlock new chapters as skills grow." },
];

const FAQS = [
  {
    q: "Is every story really personalized?",
    a: "Yes. Adaptive story synthesis shapes each chapter around your child's interests and reading level.",
  },
  {
    q: "How does speech evaluation work?",
    a: "As your child reads aloud, real-time speech recognition evaluation spots tricky words and offers gentle help.",
  },
  {
    q: "How is my child kept safe?",
    a: "There are no ads, and every parent area is protected by a Parent PIN.",
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

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="#A3E635" />
      <path d="M6 10L9 13L14 7" stroke="#0B1B3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Mascot({ color, shape, pos, delay }: { color: string; shape: "circle" | "square"; pos: string; delay: string }) {
  const radius = shape === "circle" ? "rounded-full" : "rounded-2xl";
  return (
    <div className={"absolute hidden md:block animate-bounce " + pos} style={{ animationDuration: "3s", animationDelay: delay }}>
      <div className={"w-20 h-20 flex flex-col items-center justify-center gap-1 border-4 border-white/90 shadow-lg " + radius + " " + color}>
        <div className="flex gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0B1B3A]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#0B1B3A]" />
        </div>
        <span className="w-5 h-2.5 rounded-b-full bg-[#0B1B3A]" />
      </div>
    </div>
  );
}

function FeatureCard({ title, description, color }: { title: string; description: string; color: string }) {
  return (
    <div className={"p-8 rounded-[2.5rem] border-2 border-[#0B1B3A] h-full " + color}>
      <h3 className="text-2xl font-bold text-[#0B1B3A] mb-4">{title}</h3>
      <p className="text-[#0B1B3A]/80 leading-relaxed">{description}</p>
    </div>
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
    <div className="min-h-screen bg-[#FDF8F3] text-[#0B1B3A] font-sans">
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-2xl font-black tracking-tighter">ONESIMOS</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium">
          <a href="#how-it-works" className="hover:text-[#F97316] transition-colors">How it works</a>
          <a href="#curriculum" className="hover:text-[#F97316] transition-colors">Curriculum</a>
          <a href="#pricing" className="hover:text-[#F97316] transition-colors">Pricing</a>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="px-5 py-2 rounded-full font-bold border-2 border-[#0B1B3A] hover:bg-[#0B1B3A] hover:text-white transition-all">Login</Link>
          <Link href="/login" className="px-5 py-2 rounded-full font-bold bg-[#F97316] text-white border-2 border-[#0B1B3A] shadow-[4px_4px_0px_0px_#0B1B3A] hover:translate-y-1 hover:shadow-none transition-all">Start Free</Link>
        </div>
      </nav>

      <section className="px-4 pb-20 pt-6">
        <div className="max-w-7xl mx-auto bg-[#0B1B3A] rounded-[2.5rem] p-10 md:p-24 relative overflow-hidden text-center">
          <Mascot color="bg-[#A3E635]" shape="circle" pos="top-10 left-10" delay="0s" />
          <Mascot color="bg-[#F472B6]" shape="square" pos="bottom-16 right-12" delay="1s" />
          <Mascot color="bg-[#7DD3FC]" shape="circle" pos="top-16 right-24" delay="0.5s" />
          <Mascot color="bg-[#A78BFA]" shape="square" pos="bottom-12 left-24" delay="1.5s" />
          <div className="max-w-4xl mx-auto relative">
            <div className="inline-block px-4 py-1 rounded-full bg-white/10 text-white border border-white/20 mb-6">
              Personalized reading for ages 3 to 12
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
              Where every child <span className="text-[#A3E635]">reads</span> their <span className="text-[#F472B6]">own</span> <span className="text-[#7DD3FC]">story</span>.
            </h1>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Onesimos creates personalized learning chapters that adapt to your child&apos;s pace, with real-time speech recognition evaluation and Parent PIN protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="px-10 py-5 bg-[#F97316] text-white rounded-full text-xl font-bold shadow-[0_8px_0_0_#C2410C] hover:translate-y-1 hover:shadow-[0_4px_0_0_#C2410C] transition-all">Try Free Explorer</Link>
              <a href="#how-it-works" className="px-10 py-5 bg-white text-[#0B1B3A] rounded-full text-xl font-bold border-2 border-white hover:bg-transparent hover:text-white transition-all">See How it Works</a>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-4">Reading made joyful.</h2>
          <p className="text-xl text-[#0B1B3A]/60">Four promises to every family.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard title="Personalized" description="Adaptive story synthesis builds chapters around your child's level and interests." color="bg-[#7DD3FC]" />
          <FeatureCard title="Speech Evaluation" description="Real-time speech recognition evaluation listens as your child reads aloud." color="bg-[#A3E635]" />
          <FeatureCard title="100% Parent PIN" description="No ads, and every parent area stays locked behind your Parent PIN." color="bg-[#F472B6]" />
          <FeatureCard title="Ages 3 to 12" description="Content that grows with your child from first sounds to full chapters." color="bg-[#A78BFA]" />
        </div>
      </section>

      <section id="curriculum" className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-center mb-12 bg-[#FDF8F3] p-2 rounded-full border-2 border-[#0B1B3A] w-fit mx-auto">
            {ageKeys.map((k) => (
              <button key={k} onClick={() => setAge(k)} className={"px-6 md:px-8 py-3 rounded-full font-bold transition-all " + (age === k ? "bg-[#0B1B3A] text-white" : "text-[#0B1B3A] hover:bg-[#0B1B3A]/5")}>
                Ages {k}
              </button>
            ))}
          </div>
          <div className={"p-10 md:p-16 rounded-[2.5rem] border-2 border-[#0B1B3A] shadow-[8px_8px_0px_0px_#0B1B3A] transition-all duration-500 " + active.color}>
            <h3 className="text-4xl md:text-6xl font-black mb-6">{active.title}</h3>
            <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8">{active.desc}</p>
            <Link href="/login" className="inline-block px-8 py-4 bg-[#0B1B3A] text-white rounded-full font-bold hover:scale-105 transition-transform">Start Reading</Link>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-20">4 steps to reading success</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          <div className="hidden md:block absolute top-10 left-0 w-full h-1 bg-[#0B1B3A]/10" />
          {STEPS.map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center relative">
              <div className="w-20 h-20 rounded-full bg-[#F97316] text-white flex items-center justify-center text-2xl font-black border-4 border-[#0B1B3A] mb-6">{s.step}</div>
              <h4 className="text-2xl font-bold mb-3">{s.title}</h4>
              <p className="text-[#0B1B3A]/60">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Simple, honest pricing.</h2>
            <div className="flex items-center justify-center gap-4">
              <span className={"font-bold " + (yearly ? "text-[#0B1B3A]/40" : "text-[#0B1B3A]")}>Monthly</span>
              <button aria-label="Toggle billing" onClick={() => setYearly(!yearly)} className="w-16 h-8 bg-[#0B1B3A] rounded-full relative">
                <span className={"absolute top-1 w-6 h-6 bg-white rounded-full transition-all " + (yearly ? "left-9" : "left-1")} />
              </button>
              <span className={"font-bold " + (yearly ? "text-[#0B1B3A]" : "text-[#0B1B3A]/40")}>Yearly (Save 20%)</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-10 rounded-[2.5rem] border-2 border-[#0B1B3A] shadow-[8px_8px_0px_0px_#0B1B3A]">
              <h3 className="text-2xl font-bold mb-2">Free Explorer</h3>
              <div className="text-5xl font-black mb-6">$0<span className="text-xl text-[#0B1B3A]/40 font-normal">/month</span></div>
              <ul className="space-y-4 mb-10">
                {["Personalized chapters", "Speech evaluation", "Parent PIN protection"].map((f) => (
                  <li key={f} className="flex items-center gap-3 font-medium"><CheckIcon /> {f}</li>
                ))}
              </ul>
              <Link href="/login" className="block text-center py-4 rounded-full font-bold border-2 border-[#0B1B3A] hover:bg-[#0B1B3A] hover:text-white transition-all">Get Started</Link>
            </div>
            <div className="bg-[#0B1B3A] p-10 rounded-[2.5rem] border-2 border-[#0B1B3A] text-white relative">
              <div className="absolute -top-4 right-10 bg-[#A3E635] text-[#0B1B3A] px-4 py-1 rounded-full font-bold text-sm">MOST POPULAR</div>
              <h3 className="text-2xl font-bold mb-2">Pro Reader</h3>
              <div className="text-5xl font-black mb-6">{yearly ? "$7.99" : "$9.99"}<span className="text-xl text-white/40 font-normal">/month</span></div>
              <ul className="space-y-4 mb-10">
                {["Everything in Free Explorer", "Unlimited personalized chapters", "Full progress insights"].map((f) => (
                  <li key={f} className="flex items-center gap-3 font-medium"><CheckIcon /> {f}</li>
                ))}
              </ul>
              <Link href="/login" className="block text-center py-4 bg-[#F97316] text-white rounded-full font-bold shadow-[0_6px_0_0_#C2410C] hover:translate-y-1 hover:shadow-none transition-all">Subscribe Now</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-black text-center mb-12">Frequently asked questions</h2>
        {FAQS.map((f) => (
          <AccordionItem key={f.q} question={f.q} answer={f.a} />
        ))}
      </section>

      <footer className="bg-[#0B1B3A] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-2xl font-black tracking-tighter">ONESIMOS</span>
          </div>
          <p className="text-white/50">Personalized reading for ages 3 to 12.</p>
          <p className="text-white/40">&copy; {new Date().getFullYear()} Onesimos</p>
        </div>
      </footer>
    </div>
  );
}
