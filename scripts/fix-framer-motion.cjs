const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'app', 'page.tsx');

const content = `'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'3-5' | '6-8' | '9-12'>('6-8');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#0F172A] font-sans selection:bg-[#A3E635] selection:text-[#0B1B3A] overflow-x-hidden">
      
      {/* 1. STICKY GLASS NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#FDF8F3]/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F97316] to-[#F472B6] flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
                O
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#0B1B3A]">
                Onesimos
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#why" className="text-sm font-semibold text-[#0B1B3A]/80 hover:text-[#0B1B3A] transition-colors">Why us</a>
              <a href="#curriculum" className="text-sm font-semibold text-[#0B1B3A]/80 hover:text-[#0B1B3A] transition-colors">Curriculum</a>
              <a href="#pricing" className="text-sm font-semibold text-[#0B1B3A]/80 hover:text-[#0B1B3A] transition-colors">Pricing</a>
              <a href="#faq" className="text-sm font-semibold text-[#0B1B3A]/80 hover:text-[#0B1B3A] transition-colors">FAQ</a>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden md:inline-flex text-sm font-bold text-[#0B1B3A] hover:opacity-70 px-2">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden sm:inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#ea6305] text-white font-bold px-5 py-2.5 rounded-full transition-all shadow-md shadow-[#F97316]/20 hover:scale-105"
              >
                Start Free Trial
                <span className="text-lg">😊</span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full hover:bg-black/5 text-[#0B1B3A]"
                aria-label="Toggle navigation menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FDF8F3] border-t border-black/5 px-4 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
            <a href="#why" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-[#0B1B3A]">Why us</a>
            <a href="#curriculum" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-[#0B1B3A]">Curriculum</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-[#0B1B3A]">Pricing</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-[#0B1B3A]">FAQ</a>
            <div className="h-px bg-black/5 my-2" />
            <Link href="/login" className="text-lg font-bold text-[#0B1B3A]">Sign in</Link>
            <Link
              href="/signup"
              className="inline-flex justify-center items-center gap-2 bg-[#F97316] text-white font-bold px-5 py-3 rounded-full mt-2"
            >
              Start Free Trial 😊
            </Link>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#0B1B3A] text-white">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating Mascots */}
        <div className="hidden lg:flex absolute top-20 left-8 w-20 h-20 rounded-full bg-[#FACC15] items-center justify-center text-3xl shadow-lg border-2 border-[#0B1B3A] animate-bounce duration-[3000ms]">
          😄
        </div>
        <div className="hidden lg:flex absolute top-40 right-12 w-16 h-24 rounded-[2rem] bg-[#F472B6] items-center justify-center text-2xl border-2 border-[#0B1B3A] animate-pulse">
          🥰
        </div>
        <div className="hidden lg:flex absolute bottom-32 left-16 w-16 h-16 rounded-2xl bg-[#A3E635] items-center justify-center text-2xl border-2 border-[#0B1B3A] animate-bounce duration-[4000ms]">
          🚀
        </div>
        <div className="hidden lg:flex absolute bottom-40 right-20 w-20 h-16 rounded-t-full bg-[#A78BFA] items-end justify-center pb-2 text-xl border-2 border-[#0B1B3A] animate-pulse">
          📚
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-28 md:pt-32 md:pb-40 text-center z-10">
          <div className="inline-flex items-center gap-2 bg-[#A3E635]/20 text-[#A3E635] text-sm font-bold px-4 py-1.5 rounded-full mb-8 border border-[#A3E635]/30 uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
            Early literacy platform for ages 3 to 12
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
            Transform <span className="text-[#FACC15]">reading time</span>
            <br />
            into your child's{' '}
            <span className="inline-block bg-[#F472B6] text-[#0B1B3A] px-4 py-1 md:py-2 rounded-2xl -rotate-1 shadow-lg border-2 border-white/20">
              favorite
            </span>
            <br />
            daily <span className="text-[#A78BFA]">habit</span>.
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Onesimos creates personalized reading chapters, evaluates speech pronunciation in real-time, and builds lifetime reading confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#ea6305] text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg shadow-[#F97316]/25 hover:scale-105"
            >
              Start Free Trial
              <span className="text-xl">😊</span>
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-full border border-white/20 transition-all backdrop-blur-sm"
            >
              Parent Sign In
              <span className="text-lg">→</span>
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-white/70">
            <div className="flex items-center gap-2"><span className="text-[#A3E635] text-lg">✓</span> Age-adaptive stories</div>
            <div className="flex items-center gap-2"><span className="text-[#A3E635] text-lg">✓</span> Real-time speech evaluation</div>
            <div className="flex items-center gap-2"><span className="text-[#A3E635] text-lg">🔒</span> 100% PIN protected</div>
          </div>
        </div>
      </section>

      {/* 3. FOUR PROMISES */}
      <section id="why" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-32">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1B3A] leading-tight mb-6 tracking-tight">
              Four promises, <br className="hidden lg:block"/>kept every reading session.
            </h2>
            <p className="text-lg text-[#0B1B3A]/70 mb-8 leading-relaxed font-medium">
              We replace static books with dynamic, age-appropriate adventures that actively listen and encourage your child.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#ea6305] text-white font-bold px-6 py-3 rounded-full transition-all shadow-md hover:scale-105">
              Start Free Trial 😊
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: "Personalized Chapters", desc: "Fresh stories tailored precisely to your child's grade level and vocabulary needs.", bg: "bg-[#A3E635]", tags: ["Adaptive", "Engaging"], icon: "🚀" },
              { title: "Real-Time Feedback", desc: "Our voice engine listens carefully and rewards fluency without stress.", bg: "bg-[#FB923C]", tags: ["Speech Recognition", "Gentle"], icon: "🎙️" },
              { title: "Parent Security", desc: "Secure 4-digit PIN protection keeps your billing and settings safe.", bg: "bg-[#A78BFA]", tags: ["PIN Lock", "No Ads"], icon: "🔒" },
              { title: "Age-Tailored Paths", desc: "Curriculum scaling automatically from early phonics to chapter books.", bg: "bg-[#F472B6]", tags: ["Ages 3-12", "Growth"], icon: "📚" }
            ].map((card, idx) => (
              <div 
                key={idx}
                className={\`\${card.bg} text-[#0B1B3A] rounded-[2rem] p-8 shadow-sm hover:-translate-y-1 transition-transform flex flex-col justify-between\`}
              >
                <div>
                  <div className="text-4xl mb-6">{card.icon}</div>
                  <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
                  <p className="font-medium opacity-90 mb-8 leading-relaxed">{card.desc}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {card.tags.map(tag => (
                    <span key={tag} className="bg-white/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CURRICULUM TABS */}
      <section id="curriculum" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0B1B3A] mb-4 tracking-tight">A path for every reading stage.</h2>
          <p className="text-lg text-[#0B1B3A]/70 font-medium">From early phonics to confident chapter book readers.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { id: '3-5', label: 'Early Readers (3-5)' },
            { id: '6-8', label: 'Growing Readers (6-8)' },
            { id: '9-12', label: 'Confident Readers (9-12)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as '3-5' | '6-8' | '9-12')}
              className={\`px-6 py-3 rounded-full font-bold text-sm transition-all \${
                activeTab === tab.id 
                  ? 'bg-[#0B1B3A] text-white shadow-lg scale-105' 
                  : 'bg-white text-[#0B1B3A] border border-black/10 hover:border-[#0B1B3A]/30'
              }\`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-black/5 shadow-xl max-w-5xl mx-auto transition-all duration-300">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {activeTab === '3-5' && (
              <>
                <div>
                  <div className="inline-block bg-[#F472B6]/20 text-[#EC4899] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">Level 1 • Phonics</div>
                  <h3 className="text-3xl font-bold text-[#0B1B3A] mb-4">Building early word recognition</h3>
                  <p className="text-[#0B1B3A]/70 mb-8 leading-relaxed font-medium">Short, interactive stories focusing on high-frequency sight words and playful character dialogues with gentle voice assistance.</p>
                  <div className="space-y-4 font-bold text-[#0B1B3A]">
                    <div className="flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#FDF8F3] flex items-center justify-center text-[#F97316]">✓</span> Word-by-word highlighting</div>
                    <div className="flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#FDF8F3] flex items-center justify-center text-[#F97316]">✓</span> Positive feedback badges</div>
                    <div className="flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#FDF8F3] flex items-center justify-center text-[#F97316]">✓</span> Vibrant story themes</div>
                  </div>
                </div>
                <div className="bg-[#FDF8F3] rounded-[2rem] p-8 text-center border border-black/5">
                  <div className="text-6xl mb-6">🦁</div>
                  <h4 className="text-2xl font-bold text-[#0B1B3A] mb-2">Leo's First Adventure</h4>
                  <div className="flex justify-center gap-4 text-sm font-bold text-[#0B1B3A]/60 mt-4">
                    <span className="bg-white px-3 py-1 rounded-full">120 Words</span>
                    <span className="bg-white px-3 py-1 rounded-full">4 Mins</span>
                  </div>
                </div>
              </>
            )}
            {activeTab === '6-8' && (
              <>
                <div>
                  <div className="inline-block bg-[#A3E635]/20 text-[#65A30D] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">Level 2 • Fluency</div>
                  <h3 className="text-3xl font-bold text-[#0B1B3A] mb-4">Expanding vocabulary and pacing</h3>
                  <p className="text-[#0B1B3A]/70 mb-8 leading-relaxed font-medium">Engaging multi-chapter tales that challenge growing readers with richer plots, dynamic dialogues, and automated vocabulary helpers.</p>
                  <div className="space-y-4 font-bold text-[#0B1B3A]">
                    <div className="flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#FDF8F3] flex items-center justify-center text-[#F97316]">✓</span> Richer story arcs</div>
                    <div className="flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#FDF8F3] flex items-center justify-center text-[#F97316]">✓</span> Real-time pronunciation</div>
                    <div className="flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#FDF8F3] flex items-center justify-center text-[#F97316]">✓</span> Weekly progress tracking</div>
                  </div>
                </div>
                <div className="bg-[#FDF8F3] rounded-[2rem] p-8 text-center border border-black/5">
                  <div className="text-6xl mb-6">🚀</div>
                  <h4 className="text-2xl font-bold text-[#0B1B3A] mb-2">Journey to the Stars</h4>
                  <div className="flex justify-center gap-4 text-sm font-bold text-[#0B1B3A]/60 mt-4">
                    <span className="bg-white px-3 py-1 rounded-full">350 Words</span>
                    <span className="bg-white px-3 py-1 rounded-full">8 Mins</span>
                  </div>
                </div>
              </>
            )}
            {activeTab === '9-12' && (
              <>
                <div>
                  <div className="inline-block bg-[#A78BFA]/20 text-[#7C3AED] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">Level 3 • Comprehension</div>
                  <h3 className="text-3xl font-bold text-[#0B1B3A] mb-4">Fostering deep comprehension</h3>
                  <p className="text-[#0B1B3A]/70 mb-8 leading-relaxed font-medium">Chapter books featuring mystery, science, and history designed to build reading stamina and advanced vocabulary expression.</p>
                  <div className="space-y-4 font-bold text-[#0B1B3A]">
                    <div className="flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#FDF8F3] flex items-center justify-center text-[#F97316]">✓</span> Multi-chapter series</div>
                    <div className="flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#FDF8F3] flex items-center justify-center text-[#F97316]">✓</span> Context explanations</div>
                    <div className="flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#FDF8F3] flex items-center justify-center text-[#F97316]">✓</span> Expressive scoring</div>
                  </div>
                </div>
                <div className="bg-[#FDF8F3] rounded-[2rem] p-8 text-center border border-black/5">
                  <div className="text-6xl mb-6">🧙‍♂️</div>
                  <h4 className="text-2xl font-bold text-[#0B1B3A] mb-2">The Wizard's Academy</h4>
                  <div className="flex justify-center gap-4 text-sm font-bold text-[#0B1B3A]/60 mt-4">
                    <span className="bg-white px-3 py-1 rounded-full">800 Words</span>
                    <span className="bg-white px-3 py-1 rounded-full">15 Mins</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 5. PROCESS */}
      <section className="py-24 bg-white border-y border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1B3A] mb-4 tracking-tight">From first words to chapter books.</h2>
            <p className="text-lg text-[#0B1B3A]/70 font-medium">A simple daily routine that builds lifetime confidence.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { time: "Step 1", title: "Create Profile", desc: "Add your child name and select age in seconds.", color: "text-[#F97316]" },
              { time: "Step 2", title: "Pick a Theme", desc: "Choose from space, magic, animals, or mystery.", color: "text-[#F472B6]" },
              { time: "Step 3", title: "Read Aloud", desc: "Our engine listens and guides pronunciation gently.", color: "text-[#A3E635]" },
              { time: "Step 4", title: "Track Progress", desc: "Review reading minutes on the parent dashboard.", color: "text-[#A78BFA]" }
            ].map((step, idx) => (
              <div 
                key={idx}
                className="bg-[#FDF8F3] rounded-[2rem] p-8 border border-black/5 relative hover:-translate-y-1 transition-transform"
              >
                <div className={\`font-black text-xl mb-4 \${step.color}\`}>{step.time}</div>
                <h3 className="text-xl font-bold text-[#0B1B3A] mb-3">{step.title}</h3>
                <p className="text-[#0B1B3A]/70 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PRICING */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0B1B3A] mb-4 tracking-tight">Simple, honest pricing.</h2>
          
          <div className="flex justify-center items-center gap-4 mt-8">
            <span className={\`text-sm font-bold \${billingCycle === 'monthly' ? 'text-[#0B1B3A]' : 'text-[#0B1B3A]/50'}\`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-16 h-8 bg-[#0B1B3A] rounded-full p-1 relative transition-colors focus:outline-none"
            >
              <div 
                className={\`w-6 h-6 bg-[#A3E635] rounded-full transition-transform duration-200 \${billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-0'}\`}
              />
            </button>
            <span className={\`text-sm font-bold \${billingCycle === 'yearly' ? 'text-[#0B1B3A]' : 'text-[#0B1B3A]/50'}\`}>
              Yearly <span className="text-[#F97316] ml-1 bg-[#F97316]/10 px-2 py-0.5 rounded-full text-xs font-bold">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-black/5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-[#0B1B3A] mb-2">Free Explorer</h3>
              <p className="text-[#0B1B3A]/60 font-medium mb-6">Perfect for discovering the app.</p>
              <div className="text-5xl font-black text-[#0B1B3A] mb-8">$0 <span className="text-lg font-bold text-[#0B1B3A]/40">/ forever</span></div>
              <ul className="space-y-4 mb-10 font-bold text-[#0B1B3A]/80">
                <li className="flex items-center gap-3"><span className="text-[#A3E635] text-xl">✓</span> 3 sample story chapters</li>
                <li className="flex items-center gap-3"><span className="text-[#A3E635] text-xl">✓</span> Basic speech evaluation</li>
                <li className="flex items-center gap-3"><span className="text-[#A3E635] text-xl">✓</span> 1 Child Profile</li>
                <li className="flex items-center gap-3"><span className="text-[#A3E635] text-xl">✓</span> Parent PIN Protection</li>
              </ul>
            </div>
            <Link href="/signup" className="w-full py-4 text-center rounded-full font-bold bg-[#FDF8F3] text-[#0B1B3A] hover:bg-[#f2ebe1] transition-colors border border-black/5">
              Start Free Trial
            </Link>
          </div>

          <div className="bg-[#0B1B3A] text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative flex flex-col justify-between">
            <div className="absolute -top-4 right-8 bg-[#F472B6] text-[#0B1B3A] px-4 py-1 rounded-full text-sm font-bold shadow-md transform rotate-2">
              Most loved 💖
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Pro Reader</h3>
              <p className="text-white/70 font-medium mb-6">Unlimited personalized learning.</p>
              <div className="text-5xl font-black mb-8">
                {billingCycle === 'yearly' ? '$7.99' : '$9.99'}
                <span className="text-lg font-bold text-white/50"> / mo</span>
              </div>
              <ul className="space-y-4 mb-10 font-bold text-white/90">
                <li className="flex items-center gap-3"><span className="text-[#FACC15] text-xl">✓</span> Unlimited story chapters</li>
                <li className="flex items-center gap-3"><span className="text-[#FACC15] text-xl">✓</span> Real-time speech scoring</li>
                <li className="flex items-center gap-3"><span className="text-[#FACC15] text-xl">✓</span> Up to 4 Child Profiles</li>
                <li className="flex items-center gap-3"><span className="text-[#FACC15] text-xl">✓</span> Weekly activity reports</li>
                <li className="flex items-center gap-3"><span className="text-[#FACC15] text-xl">✓</span> Secure Paystack Billing</li>
              </ul>
            </div>
            <Link href="/parent/pricing" className="w-full py-4 text-center rounded-full font-bold bg-[#F97316] text-white hover:bg-[#ea6305] transition-colors shadow-lg">
              Upgrade to Pro 😊
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0B1B3A] mb-4 tracking-tight">Questions parents ask us.</h2>
        </div>

        <div className="space-y-4">
          {[
            { q: "What age range is Onesimos suitable for?", a: "Onesimos is specially tailored for children aged 3 to 12 years old, spanning early phonics to advanced chapter stories." },
            { q: "How does the real-time speech evaluation work?", a: "Our engine listens via your device microphone, highlighting correctly pronounced words and providing gentle visual assistance without interrupting the flow." },
            { q: "Can I manage multiple children?", a: "Yes! The Pro plan supports up to 4 distinct child profiles under one parent dashboard." },
            { q: "Is my child safe while using Onesimos?", a: "100%. Onesimos features a secure 4-digit Parent PIN lock preventing access to billing or settings, with zero third-party ads." },
            { q: "How does billing work?", a: "We partner with Paystack to support major credit/debit cards and local payment methods securely. You can cancel anytime from the dashboard." }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white rounded-[1.5rem] border border-black/5 overflow-hidden">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-6 text-left font-bold text-lg text-[#0B1B3A] flex justify-between items-center"
              >
                <span>{faq.q}</span>
                <span className={\`text-2xl text-[#0B1B3A]/40 transition-transform duration-200 \${openFaq === idx ? 'rotate-45' : ''}\`}>+</span>
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-6 text-[#0B1B3A]/70 font-medium leading-relaxed border-t border-black/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. FOOTER / CONTACT */}
      <footer className="bg-[#0B1B3A] text-white pt-24 pb-12 rounded-t-[3rem] md:rounded-t-[4rem] mt-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 mb-20">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Come and see us play.</h2>
            <p className="text-white/70 text-lg font-medium mb-10 max-w-md">Ready to transform your child's reading habit? Start your free trial today or send our support team a message.</p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FACC15] text-[#0B1B3A] font-black flex items-center justify-center">1</div>
                <span className="font-bold text-lg">Create Parent Profile</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F472B6] text-[#0B1B3A] font-black flex items-center justify-center">2</div>
                <span className="font-bold text-lg">Set up Kid Profiles</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#A3E635] text-[#0B1B3A] font-black flex items-center justify-center">3</div>
                <span className="font-bold text-lg">Read first adventure</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 text-[#0B1B3A]">
            {formSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="text-6xl mb-4">💖</div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-[#0B1B3A]/60 font-medium">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
                <div>
                  <input type="text" required placeholder="Your Name" className="w-full px-5 py-4 rounded-2xl bg-[#FDF8F3] border border-black/5 focus:outline-none focus:ring-2 focus:ring-[#F97316] font-medium" />
                </div>
                <div>
                  <input type="email" required placeholder="Email Address" className="w-full px-5 py-4 rounded-2xl bg-[#FDF8F3] border border-black/5 focus:outline-none focus:ring-2 focus:ring-[#F97316] font-medium" />
                </div>
                <div>
                  <textarea required rows={3} placeholder="How can we help?" className="w-full px-5 py-4 rounded-2xl bg-[#FDF8F3] border border-black/5 focus:outline-none focus:ring-2 focus:ring-[#F97316] font-medium" />
                </div>
                <button type="submit" className="w-full py-4 rounded-full bg-[#F97316] text-white font-bold hover:bg-[#ea6305] transition-colors shadow-lg">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-white/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F97316] to-[#F472B6] flex items-center justify-center text-white font-black text-xs">O</div>
            <span>© \${new Date().getFullYear()} Onesimos. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-white transition-colors">Parent Login</Link>
            <Link href="/kid-login" className="hover:text-white transition-colors">Kid Quick Login</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
`;

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully updated app/page.tsx without framer-motion dependency!');
`;

fs.writeFileSync(path.join(__dirname, 'fix-framer-motion.cjs'), content, 'utf8');