"use client";
import React, { useState } from "react";
import Link from "next/link";

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#F97316"/>
    <path d="M12 10V30M12 10H28M12 20H24M12 30H28" stroke="white" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  return (
    <div className="min-h-screen bg-[#FDF8F3] font-[family-name:var(--font-switzer)] text-[#0B1B3A]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDF8F3]/90 backdrop-blur-md border-b border-[#0B1B3A]/5 h-20 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-2"><Logo /><span className="font-[family-name:var(--font-achiko)] text-2xl font-bold">Onesimos</span></div>
          <div className="flex gap-4">
            <Link href="/login" className="px-6 py-2 rounded-full border border-[#0B1B3A]">Log in</Link>
            <Link href="/signup" className="px-6 py-2 rounded-full bg-[#F97316] text-white">Try for free</Link>
          </div>
        </div>
      </nav>
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-[1400px] mx-auto bg-[#0B1B3A] rounded-[40px] p-20 text-center relative overflow-hidden">
          <h1 className="font-[family-name:var(--font-achiko)] text-6xl md:text-8xl text-white mb-8">Make reading something kids <span className="bg-[#F472B6] px-4 py-1 rounded-[30px] inline-block -rotate-2">own</span></h1>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">Personalized learning chapters and real-time speech evaluation for ages 3-12.</p>
          <Link href="/signup" className="px-10 py-5 bg-[#F97316] text-white text-xl font-bold rounded-full inline-block">Start Reading Now</Link>
        </div>
      </main>
      <div className="bg-[#FACC15] py-6 border-y-2 border-[#0B1B3A] overflow-hidden">
        <div className="animate-marquee flex gap-12 text-2xl font-black uppercase text-[#0B1B3A]">
           <span>Real-time speech evaluation • Personalized chapters • Parent PIN protection • Adaptive synthesis • </span>
           <span>Real-time speech evaluation • Personalized chapters • Parent PIN protection • Adaptive synthesis • </span>
        </div>
      </div>
      <section className="py-24 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-5xl font-[family-name:var(--font-achiko)] mb-12">Simple Pricing</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          <div className="p-10 rounded-[40px] bg-white border-2 border-[#0B1B3A]/5">
            <h3 className="text-2xl font-bold mb-4">Family Unlimited</h3>
            <p className="text-4xl font-bold mb-6">$3.20 / ₦5,000</p>
            <button className="w-full py-4 rounded-full bg-[#F97316] text-white font-bold">Choose Plan</button>
          </div>
          <div className="p-10 rounded-[40px] bg-white border-2 border-[#0B1B3A]/5">
            <h3 className="text-2xl font-bold mb-4">School Classroom</h3>
            <p className="text-4xl font-bold mb-6">$19.00 / ₦30,000</p>
            <button className="w-full py-4 rounded-full border-2 border-[#0B1B3A] font-bold">Contact Sales</button>
          </div>
        </div>
      </section>
      <footer className="bg-[#0B1B3A] py-20 text-center text-white/60">
        <p>&copy; 2024 Onesimos. All rights reserved.</p>
      </footer>
    </div>
  );
}