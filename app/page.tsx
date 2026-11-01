"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

// Inline Icons (Zero extra dependencies)
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71A6EE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const SparkleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const ChevronDownIcon = ({ open }: { open: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={"transition-transform duration-200 " + (open ? "rotate-180" : "")}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#E1F18C">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

function LandingContent() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Contact Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formChildAge, setFormChildAge] = useState("5-7");
  const [formMessage, setFormMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const client = createClient();
        const { data } = await client.auth.getUser();
        if (!cancelled && data && data.user) router.push("/who");
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [router]);

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!formName.trim() || !formEmail.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }
    setFormSubmitted(true);
  }

  // Offerings Data (4.5)
  const offerings = [
    {
      name: "Ages 3 to 5",
      subtitle: "Early Phonics & Sight Words",
      title: "Building foundational sound and letter confidence",
      desc: "Short 5-minute interactive audio chapters with high-contrast text and instant praise for every correct word spoken.",
      stats: [
        { value: "5 min", label: "Daily Goal" },
        { value: "100+", label: "Sight Words" },
        { value: "100%", label: "Audio Guided" }
      ],
      checks: ["Phonics sound matching", "Visual word highlighting", "Audio read-aloud support"]
    },
    {
      name: "Ages 6 to 8",
      subtitle: "Interactive Story Chapters",
      title: "Expanding vocabulary through topic adventures",
      desc: "Personalized chapters based on their favorite themes like space, animals, and magic, evaluated with speech recognition.",
      stats: [
        { value: "10 min", label: "Daily Goal" },
        { value: "500+", label: "Vocabulary Pool" },
        { value: "Real-time", label: "Speech Engine" }
      ],
      checks: ["Speech evaluation feedback", "Dynamic chapter branching", "Weekly streak rewards"]
    },
    {
      name: "Ages 9 to 12",
      subtitle: "Advanced Reading Synthesis",
      title: "Mastering complex sentences and comprehension",
      desc: "Longer narrative synthesis designed to boost reading speed, pronunciation accuracy, and critical thinking.",
      stats: [
        { value: "15 min", label: "Daily Goal" },
        { value: "1,200+", label: "Mastery Words" },
        { value: "Detailed", label: "Parent Insights" }
      ],
      checks: ["Advanced story synthesis", "Stumbled words log tracking", "Parent progress reports"]
    }
  ];

  // FAQ Data (4.9)
  const faqs = [
    {
      q: "How does real-time speech evaluation work?",
      a: "Our speech recognition engine listens as your child reads aloud, highlighting correctly pronounced words in real time and gently saving tricky words to their personal review list."
    },
    {
      q: "Is my child's voice recording stored securely?",
      a: "No. Speech recognition evaluations are processed in real time purely for learning feedback. We prioritize child safety and privacy above everything else."
    },
    {
      q: "How does the Parent PIN protection work?",
      a: "Parents set a 4-digit Parent PIN during registration. This prevents children from accessing billing settings, subscription options, or parent analytics."
    },
    {
      q: "Can I add multiple children to one account?",
      a: "Yes! Family plans support multiple child profiles, allowing each kid to have their own reading level, avatar, daily goal, and personalized chapters."
    },
    {
      q: "Can my child use Onesimos on a tablet or phone?",
      a: "Yes. Onesimos works seamlessly across all desktop browsers, iPads, tablets, and mobile devices."
    },
    {
      q: "Can I cancel my subscription at any time?",
      a: "Absolutely. You can manage or cancel your subscription anytime directly from the Parent Zone with zero hassle."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F8FF] dark:bg-[#0F172A] text-[#1C274C] dark:text-white font-sans selection:bg-[#E1F18C] selection:text-[#1C274C]">
      
      {/* 4.1 STICKY HEADER / NAVIGATION */}
      <nav className="sticky top-0 z-50 px-4 sm:px-8 pt-4 pb-2">
        <div className="mx-auto max-w-6xl rounded-full bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-md border border-[#1C274C]/5 dark:border-white/10 px-6 py-3 flex items-center justify-between shadow-sm">
          
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#1C274C] text-[#E1F18C] font-black text-xl flex items-center justify-center shadow-sm">
              O
            </div>
            <span className="font-black text-xl tracking-tight text-[#1C274C] dark:text-white">
              Onesimos
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-[#1C274C]/70 dark:text-white/70">
            <a href="#why-us" className="hover:text-[#1C274C] dark:hover:text-white transition-colors">Why us</a>
            <a href="#offerings" className="hover:text-[#1C274C] dark:hover:text-white transition-colors">Offerings</a>
            <a href="#how-it-works" className="hover:text-[#1C274C] dark:hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-[#1C274C] dark:hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[#1C274C] dark:hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-5 py-2.5 rounded-full text-sm font-bold text-[#1C274C] dark:text-white hover:bg-[#1C274C]/5 transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="px-6 py-2.5 rounded-full bg-[#1C274C] text-white text-sm font-bold shadow-md hover:bg-[#141C38] transition-all">
              Get started free
            </Link>
          </div>

          <button 
            type="button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full bg-[#F4F8FF] dark:bg-[#0F172A] flex items-center justify-center text-[#1C274C] dark:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mx-auto mt-2 max-w-6xl rounded-[32px] bg-white dark:bg-[#1E293B] border border-[#1C274C]/5 p-6 space-y-4 shadow-xl">
            <div className="flex flex-col gap-3 font-bold text-base">
              <a href="#why-us" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#1C274C]/5">Why us</a>
              <a href="#offerings" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#1C274C]/5">Offerings</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#1C274C]/5">How it works</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#1C274C]/5">Pricing</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#1C274C]/5">FAQ</a>
            </div>
            <div className="pt-2 flex flex-col gap-3">
              <Link href="/login" className="w-full py-3 rounded-full text-center font-bold bg-[#F4F8FF] dark:bg-[#0F172A]">Sign in</Link>
              <Link href="/signup" className="w-full py-3 rounded-full text-center font-bold bg-[#1C274C] text-white">Get started free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* 4.2 HERO SECTION */}
      <section className="px-4 sm:px-8 pt-12 pb-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E1F18C] text-[#1C274C] text-xs font-black uppercase tracking-wider shadow-sm">
              <SparkleIcon /> Early Literacy Platform for Ages 3 to 12
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-[#1C274C] dark:text-white">
              Transform reading time into your child's favorite daily habit
            </h1>

            <p className="text-lg font-medium text-[#1C274C]/70 dark:text-white/70 leading-relaxed">
              Onesimos creates personalized reading chapters, evaluates speech pronunciation in real-time, and builds lifetime reading confidence through playful story synthesis.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link href="/signup" className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#1C274C] text-white font-bold text-base shadow-xl hover:bg-[#141C38] transition-all text-center">
                Start your free trial
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-[#1E293B] text-[#1C274C] dark:text-white font-bold text-base shadow-sm border border-[#1C274C]/10 dark:border-white/10 hover:bg-[#F4F8FF] transition-all text-center">
                Parent Sign in
              </Link>
            </div>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#1C274C]/10 dark:border-white/10">
              <div className="flex items-center gap-2.5 text-xs font-bold text-[#1C274C] dark:text-white">
                <CheckIcon /> Age-adaptive stories
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-[#1C274C] dark:text-white">
                <CheckIcon /> Real-time speech evaluation
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-[#1C274C] dark:text-white">
                <CheckIcon /> 100% Parent PIN protected
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-[#E1C8F6] rounded-[32px] p-6 text-[#1C274C] shadow-sm transform hover:-translate-y-1 transition-transform">
                <span className="text-3xl">🦁</span>
                <p className="text-xs font-bold uppercase tracking-wider mt-3 opacity-70">Ages 3 to 5</p>
                <h3 className="text-lg font-black mt-1 leading-tight">Leo's First Adventure</h3>
              </div>
              <div className="bg-[#E1F18C] rounded-[32px] p-6 text-[#1C274C] shadow-sm transform hover:-translate-y-1 transition-transform">
                <span className="text-3xl">🚀</span>
                <p className="text-xs font-bold uppercase tracking-wider mt-3 opacity-70">Ages 6 to 8</p>
                <h3 className="text-lg font-black mt-1 leading-tight">Journey to the Stars</h3>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="bg-[#F7D4DA] rounded-[32px] p-6 text-[#1C274C] shadow-sm transform hover:-translate-y-1 transition-transform">
                <span className="text-3xl">🪄</span>
                <p className="text-xs font-bold uppercase tracking-wider mt-3 opacity-70">Ages 9 to 12</p>
                <h3 className="text-lg font-black mt-1 leading-tight">The Wizard's Academy</h3>
              </div>
              <div className="bg-[#1C274C] text-white rounded-[32px] p-6 shadow-md transform hover:-translate-y-1 transition-transform">
                <span className="text-2xl font-black text-[#E1F18C]">98%</span>
                <p className="text-xs font-bold uppercase tracking-wider mt-2 text-white/70">Speech Mastery</p>
                <h3 className="text-sm font-bold mt-1 text-white">Real-time evaluation active</h3>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4.3 MARQUEE STRIP */}
      <section className="bg-[#1C274C] text-[#E1F18C] py-4 overflow-hidden shadow-inner">
        <div className="flex whitespace-nowrap gap-12 justify-center text-xs sm:text-sm font-black uppercase tracking-widest">
          <span>Personalized Reading Chapters</span>
          <span>•</span>
          <span>Real-Time Speech Evaluation</span>
          <span>•</span>
          <span>Parent PIN Protected Zone</span>
          <span>•</span>
          <span>Adaptive Learning Synthesis</span>
          <span>•</span>
          <span>Ages 3 to 12 Early Literacy</span>
        </div>
      </section>

      {/* 4.4 WHY CHOOSE US */}
      <section id="why-us" className="px-4 sm:px-8 py-20 max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#71A6EE]">Built For Little Learners</p>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-2 text-[#1C274C] dark:text-white">Why parents love Onesimos</h2>
        </div>

        <div className="space-y-8">
          {[
            {
              num: "01",
              title: "Adaptive Story Synthesis",
              text: "Every chapter adapts dynamically to your child's age, reading level, and favorite interests like space, animals, or magic.",
              tags: ["Personalized", "Age 3 to 12"],
              bg: "bg-[#E1C8F6]"
            },
            {
              num: "02",
              title: "Real-Time Speech Recognition Evaluation",
              text: "Our speech engine evaluates read-aloud practice sentence by sentence, rewarding correct pronunciation instantly.",
              tags: ["Speech Evaluation", "Instant Feedback"],
              bg: "bg-[#E1F18C]"
            },
            {
              num: "03",
              title: "100% Parent PIN Protected",
              text: "Children enjoy a safe, distraction-free reading portal. Parent settings, subscription management, and analytics are locked behind a 4-digit Parent PIN.",
              tags: ["Child Safe", "Parent PIN"],
              bg: "bg-[#F7D4DA]"
            },
            {
              num: "04",
              title: "Parental Insights & Goal Tracking",
              text: "Monitor daily session minutes, vocabulary milestone progress, and reading streaks from your protected parent dashboard.",
              tags: ["Analytics", "Daily Goals"],
              bg: "bg-[#D6E5FD]"
            }
          ].map((item) => (
            <div key={item.num} className="rounded-[32px] bg-white dark:bg-[#1E293B] p-8 shadow-sm border border-[#1C274C]/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <span className="text-3xl font-black text-[#71A6EE]">{item.num}</span>
                <h3 className="text-2xl font-black text-[#1C274C] dark:text-white">{item.title}</h3>
                <p className="text-sm font-medium text-[#1C274C]/70 dark:text-white/70 max-w-xl">{item.text}</p>
                <div className="flex gap-2 pt-2">
                  {item.tags.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full bg-[#F4F8FF] dark:bg-[#0F172A] text-xs font-bold text-[#1C274C] dark:text-white">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className={"w-full md:w-48 h-32 rounded-[24px] " + item.bg + " flex items-center justify-center font-black text-2xl text-[#1C274C] shadow-inner shrink-0"}>
                Feature {item.num}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4.5 OFFERINGS / TABBED PANEL */}
      <section id="offerings" className="px-4 sm:px-8 py-20 bg-white dark:bg-[#1E293B]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-[#71A6EE]">Curriculum Paths</p>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-2 text-[#1C274C] dark:text-white">Tailored for every stage</h2>
          </div>

          <div className="flex justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {offerings.map((tab, idx) => (
              <button
                key={tab.name}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={"px-6 py-3 rounded-full text-sm font-bold transition-all shrink-0 " + (activeTab === idx ? "bg-[#1C274C] text-white shadow-md" : "bg-[#F4F8FF] dark:bg-[#0F172A] text-[#1C274C] dark:text-white")}
              >
                {tab.name} • <span className="opacity-70 text-xs">{tab.subtitle}</span>
              </button>
            ))}
          </div>

          <div className="rounded-[32px] bg-[#F4F8FF] dark:bg-[#0F172A] p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-[#1C274C]/5">
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-black text-[#1C274C] dark:text-white">{offerings[activeTab].title}</h3>
              <p className="text-base font-medium text-[#1C274C]/70 dark:text-white/70 leading-relaxed">{offerings[activeTab].desc}</p>

              <div className="grid grid-cols-3 gap-4 pt-2">
                {offerings[activeTab].stats.map((s) => (
                  <div key={s.label} className="bg-white dark:bg-[#1E293B] p-4 rounded-[20px] text-center shadow-sm">
                    <p className="text-xl font-black text-[#1C274C] dark:text-white">{s.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#1C274C]/60 dark:text-white/60 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                {offerings[activeTab].checks.map((c) => (
                  <div key={c} className="flex items-center gap-2 text-sm font-bold text-[#1C274C] dark:text-white">
                    <CheckIcon /> {c}
                  </div>
                ))}
              </div>

              <Link href="/signup" className="inline-block px-6 py-3 rounded-full bg-[#1C274C] text-white font-bold text-sm shadow-md">
                Explore {offerings[activeTab].name}
              </Link>
            </div>

            <div className="lg:col-span-5 bg-[#E1C8F6] rounded-[28px] h-72 flex items-center justify-center font-black text-3xl text-[#1C274C]">
              {offerings[activeTab].name} Preview
            </div>
          </div>
        </div>
      </section>

      {/* 4.6 PROCESS TIMELINE */}
      <section id="how-it-works" className="px-4 sm:px-8 py-20 max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#71A6EE]">Simple 4-Step Process</p>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-2 text-[#1C274C] dark:text-white">How Onesimos works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: "Step 01", title: "Create Parent Account", text: "Sign up and set your secret 4-digit Parent PIN to protect settings." },
            { step: "Step 02", title: "Set Up Child Profile", text: "Select your child's age, avatar, daily reading goal, and favorite topics." },
            { step: "Step 03", title: "Read Stories Aloud", text: "Your child reads personalized chapters while speech evaluation tracks accuracy." },
            { step: "Step 04", title: "Track Progress", text: "Review daily minute streaks and word mastery from the protected parent portal." }
          ].map((item) => (
            <div key={item.step} className="rounded-[32px] bg-white dark:bg-[#1E293B] p-6 shadow-sm border border-[#1C274C]/5 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#71A6EE]">{item.step}</span>
              <h3 className="text-lg font-black text-[#1C274C] dark:text-white">{item.title}</h3>
              <p className="text-xs font-medium text-[#1C274C]/70 dark:text-white/70 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4.7 TESTIMONIALS */}
      <section className="px-4 sm:px-8 py-20 bg-[#E1C8F6]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto text-[#1C274C]">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">Parent Feedback</p>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-2">Loved by families</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Sarah M.", role: "Parent of 6-year-old", text: "The real-time speech evaluation has completely transformed my son's reading confidence!" },
              { name: "David K.", role: "Parent of two (ages 4 & 8)", text: "Having separate child profiles under one parent account guarded by a PIN is genius." },
              { name: "Elena R.", role: "Parent of 7-year-old", text: "The personalized chapters keep my daughter begging to complete her daily reading goal!" }
            ].map((q) => (
              <div key={q.name} className="bg-white rounded-[32px] p-6 text-[#1C274C] shadow-sm space-y-4">
                <div className="flex text-yellow-400 gap-1"><StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon /></div>
                <p className="text-sm font-medium leading-relaxed">"{q.text}"</p>
                <div>
                  <p className="font-black text-sm">{q.name}</p>
                  <p className="text-xs font-medium opacity-60">{q.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4.8 PRICING */}
      <section id="pricing" className="px-4 sm:px-8 py-20 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#71A6EE]">Simple Transparent Pricing</p>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-2 text-[#1C274C] dark:text-white">Choose your plan</h2>

          <div className="inline-flex items-center p-1.5 rounded-full bg-white dark:bg-[#1E293B] shadow-sm border border-[#1C274C]/5 mt-6">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={"px-6 py-2 rounded-full text-xs font-bold transition-all " + (billingCycle === "monthly" ? "bg-[#1C274C] text-white" : "text-[#1C274C]/60 dark:text-white/60")}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={"px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 " + (billingCycle === "yearly" ? "bg-[#1C274C] text-white" : "text-[#1C274C]/60 dark:text-white/60")}
            >
              Annual <span className="bg-[#E1F18C] text-[#1C274C] text-[10px] px-2 py-0.5 rounded-full font-black">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="bg-white dark:bg-[#1E293B] rounded-[36px] p-8 shadow-sm border border-[#1C274C]/5 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1C274C]/60 dark:text-white/60">Free Explorer</span>
              <p className="text-4xl font-black text-[#1C274C] dark:text-white mt-4">$0 <span className="text-sm font-medium text-[#1C274C]/60 dark:text-white/60">/ forever</span></p>
              <ul className="mt-6 space-y-3 text-sm font-medium text-[#1C274C] dark:text-white">
                <li className="flex items-center gap-2"><CheckIcon /> 1 Child profile</li>
                <li className="flex items-center gap-2"><CheckIcon /> 3 Sample story chapters</li>
                <li className="flex items-center gap-2"><CheckIcon /> Basic speech feedback</li>
              </ul>
            </div>
            <Link href="/signup" className="w-full py-3.5 rounded-full bg-[#F4F8FF] dark:bg-[#0F172A] text-[#1C274C] dark:text-white font-bold text-center text-sm">
              Get Started Free
            </Link>
          </div>

          <div className="bg-[#E1F18C] rounded-[36px] p-8 shadow-md border-2 border-[#1C274C] flex flex-col justify-between space-y-6 relative">
            <span className="absolute top-4 right-4 bg-[#1C274C] text-[#E1F18C] text-[10px] font-black uppercase px-3 py-1 rounded-full">Most Popular</span>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1C274C]/70">Family Unlimited</span>
              <p className="text-4xl font-black text-[#1C274C] mt-4">
                {billingCycle === "monthly" ? "$9.99" : "$7.99"} <span className="text-sm font-medium opacity-70">/ month</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm font-bold text-[#1C274C]">
                <li className="flex items-center gap-2"><CheckIcon /> Unlimited child profiles</li>
                <li className="flex items-center gap-2"><CheckIcon /> Unlimited personalized chapters</li>
                <li className="flex items-center gap-2"><CheckIcon /> Real-time speech evaluation</li>
                <li className="flex items-center gap-2"><CheckIcon /> Full parent analytics & goals</li>
              </ul>
            </div>
            <Link href="/signup" className="w-full py-3.5 rounded-full bg-[#1C274C] text-white font-bold text-center text-sm shadow-md">
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* 4.9 FAQ */}
      <section id="faq" className="px-4 sm:px-8 py-20 bg-white dark:bg-[#1E293B]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#71A6EE]">Got Questions?</p>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-2 text-[#1C274C] dark:text-white">Frequently asked questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={faq.q} className="rounded-[24px] bg-[#F4F8FF] dark:bg-[#0F172A] border border-[#1C274C]/5 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center font-black text-base text-[#1C274C] dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDownIcon open={openFaq === idx} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-sm font-medium text-[#1C274C]/70 dark:text-white/70 leading-relaxed border-t border-[#1C274C]/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4.10 BOOKING / CONTACT FORM */}
      <section className="px-4 sm:px-8 py-20 max-w-4xl mx-auto space-y-12">
        <div className="text-center max-w-xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#71A6EE]">Get In Touch</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-2 text-[#1C274C] dark:text-white">Have a question for our team?</h2>
        </div>

        <div className="rounded-[36px] bg-white dark:bg-[#1E293B] p-8 shadow-sm border border-[#1C274C]/5">
          {formSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#E1F18C] text-[#1C274C] font-black text-2xl flex items-center justify-center mx-auto">✓</div>
              <h3 className="text-2xl font-black text-[#1C274C] dark:text-white">Message Received!</h3>
              <p className="text-sm font-medium text-[#1C274C]/70 dark:text-white/70 max-w-md mx-auto">
                Thank you for reaching out. A member of the Onesimos team will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1C274C]/70 dark:text-white/70">Your Name *</label>
                  <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Jane Doe" className="mt-2 h-12 w-full rounded-full border border-[#1C274C]/10 bg-[#F4F8FF] px-5 font-medium text-[#1C274C] outline-none dark:border-white/10 dark:bg-[#0F172A] dark:text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1C274C]/70 dark:text-white/70">Email Address *</label>
                  <input type="email" required value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="you@example.com" className="mt-2 h-12 w-full rounded-full border border-[#1C274C]/10 bg-[#F4F8FF] px-5 font-medium text-[#1C274C] outline-none dark:border-white/10 dark:bg-[#0F172A] dark:text-white" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C274C]/70 dark:text-white/70">Child's Age Range</label>
                <select value={formChildAge} onChange={(e) => setFormChildAge(e.target.value)} className="mt-2 h-12 w-full rounded-full border border-[#1C274C]/10 bg-[#F4F8FF] px-5 font-medium text-[#1C274C] outline-none dark:border-white/10 dark:bg-[#0F172A] dark:text-white">
                  <option value="3-4">Ages 3 to 4</option>
                  <option value="5-7">Ages 5 to 7</option>
                  <option value="8-10">Ages 8 to 10</option>
                  <option value="11-12">Ages 11 to 12</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C274C]/70 dark:text-white/70">Message</label>
                <textarea rows={4} value={formMessage} onChange={(e) => setFormMessage(e.target.value)} placeholder="How can we help your family?" className="mt-2 w-full rounded-[24px] border border-[#1C274C]/10 bg-[#F4F8FF] p-5 font-medium text-[#1C274C] outline-none dark:border-white/10 dark:bg-[#0F172A] dark:text-white" />
              </div>

              {formError && <p className="text-sm font-bold text-red-500">{formError}</p>}

              <button type="submit" className="w-full py-4 rounded-full bg-[#1C274C] text-white font-bold text-sm shadow-md hover:bg-[#141C38]">
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 4.11 FOOTER */}
      <footer className="py-12 px-4 sm:px-8 bg-[#1C274C] text-white border-t border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E1F18C] text-[#1C274C] font-black flex items-center justify-center">O</div>
              <span className="font-black text-xl">Onesimos</span>
            </div>
            <p className="text-xs font-medium text-white/70 leading-relaxed">
              Early literacy platform empowering children ages 3 to 12 with personalized stories and speech evaluation.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#E1F18C] mb-3">Explore</h4>
            <ul className="space-y-2 text-xs font-medium text-white/80">
              <li><a href="#why-us">Why Onesimos</a></li>
              <li><a href="#offerings">Curriculum Paths</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#pricing">Pricing Plans</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#E1F18C] mb-3">Legal & Safety</h4>
            <ul className="space-y-2 text-xs font-medium text-white/80">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/refunds">Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#E1F18C] mb-3">Parent Support</h4>
            <p className="text-xs font-medium text-white/80">Questions? Reach out to support@onesimos.app</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-white/10 text-center text-xs font-bold text-white/50">
          © {new Date().getFullYear()} Onesimos Early Literacy Platform. All rights reserved.
        </div>
      </footer>

    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#F4F8FF] dark:bg-[#0F172A]" />}>
      <LandingContent />
    </Suspense>
  );
}
