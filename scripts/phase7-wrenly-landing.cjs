// scripts/phase7-wrenly-landing.cjs
// Step 1: Wrenly-style marketing homepage & responsive navbar for Onesimos
// Run: node scripts/phase7-wrenly-landing.cjs

const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();

function read(rel) {
  try {
    return fs.readFileSync(path.join(ROOT, rel), "utf8");
  } catch {
    return null;
  }
}

function write(rel, content) {
  const abs = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, "utf8");
  console.log("WROTE  " + rel + "  (" + content.length + " bytes)");
}

// Detect Supabase client export name
let supaName = "createClient";
const supaSrc = read("lib/supabase/client.ts");
if (supaSrc) {
  const m = supaSrc.match(/export\s+(?:async\s+)?(?:function|const)\s+(\w+)/);
  if (m) supaName = m[1];
}
function inject(s) {
  return s.split("__SUPA__").join(supaName);
}

const wrenlyPageContent = `"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { __SUPA__ } from "@/lib/supabase/client";

// Inline Icons (Zero forbidden dependencies)
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71A6EE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const MicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#E1F18C">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export default function HomePage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const client = __SUPA__();
        const { data } = await client.auth.getUser();
        if (!cancelled && data && data.user) {
          router.push("/who");
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F4F8FF] dark:bg-[#0F172A] text-[#1C274C] dark:text-white font-sans selection:bg-[#E1F18C] selection:text-[#1C274C]">
      
      {/* 1. STICKY GLASSMORPHIC NAVBAR */}
      <nav className="sticky top-0 z-50 px-4 sm:px-8 pt-4 pb-2">
        <div className="mx-auto max-w-6xl rounded-full bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-md border border-[#1C274C]/5 dark:border-white/10 px-6 py-3 flex items-center justify-between shadow-sm">
          
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#1C274C] text-[#E1F18C] font-black text-xl flex items-center justify-center shadow-sm">
              O
            </div>
            <span className="font-black text-xl tracking-tight text-[#1C274C] dark:text-white">
              Onesimos
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-[#1C274C]/70 dark:text-white/70">
            <a href="#features" className="hover:text-[#1C274C] dark:hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#1C274C] dark:hover:text-white transition-colors">How it works</a>
            <a href="#parents" className="hover:text-[#1C274C] dark:hover:text-white transition-colors">For parents</a>
            <Link href="/parent/pricing" className="hover:text-[#1C274C] dark:hover:text-white transition-colors">Pricing</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link 
              href="/login" 
              className="px-5 py-2.5 rounded-full text-sm font-bold text-[#1C274C] dark:text-white hover:bg-[#1C274C]/5 dark:hover:bg-white/5 transition-colors"
            >
              Sign in
            </Link>
            <Link 
              href="/signup" 
              className="px-6 py-2.5 rounded-full bg-[#1C274C] text-white text-sm font-bold shadow-md hover:bg-[#141C38] transition-all"
            >
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
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#1C274C]/5">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#1C274C]/5">How it works</a>
              <a href="#parents" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#1C274C]/5">For parents</a>
              <Link href="/parent/pricing" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#1C274C]/5">Pricing</Link>
            </div>
            <div className="pt-2 flex flex-col gap-3">
              <Link href="/login" className="w-full py-3 rounded-full text-center font-bold bg-[#F4F8FF] dark:bg-[#0F172A]">Sign in</Link>
              <Link href="/signup" className="w-full py-3 rounded-full text-center font-bold bg-[#1C274C] text-white">Get started free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* 2. HERO SECTION */}
      <section className="px-4 sm:px-8 pt-12 pb-20 max-w-6xl mx-auto text-center flex flex-col items-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E1F18C] text-[#1C274C] text-xs font-black uppercase tracking-wider shadow-sm mb-6">
          <SparkleIcon /> Early Literacy Platform for Ages 3 to 12
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] max-w-4xl text-[#1C274C] dark:text-white">
          Transform your child's reading journey with playful stories
        </h1>

        <p className="mt-6 text-lg sm:text-xl font-medium text-[#1C274C]/70 dark:text-white/70 max-w-2xl leading-relaxed">
          Onesimos delivers personalized reading chapters, real-time speech evaluation, and adaptive story synthesis that turns early readers into confident storytellers.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
            href="/signup" 
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#1C274C] text-white font-bold text-base shadow-xl hover:bg-[#141C38] transition-all text-center"
          >
            Start your free trial
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-[#1E293B] text-[#1C274C] dark:text-white font-bold text-base shadow-sm border border-[#1C274C]/10 dark:border-white/10 hover:bg-[#F4F8FF] transition-all text-center"
          >
            Parent Sign in
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-[#1C274C]/80 dark:text-white/80">
          <div className="flex items-center gap-2">
            <CheckCircleIcon /> Personalized by age & interest
          </div>
          <div className="flex items-center gap-2">
            <CheckCircleIcon /> Real-time speech evaluation
          </div>
          <div className="flex items-center gap-2">
            <CheckCircleIcon /> Parent PIN protected zone
          </div>
        </div>

        {/* 3. HERO PRODUCT SHOWCASE CARD */}
        <div className="mt-14 w-full rounded-[36px] bg-white dark:bg-[#1E293B] p-4 sm:p-8 shadow-2xl border border-[#1C274C]/5 dark:border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between pb-6 border-b border-[#1C274C]/5 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-xs font-bold text-[#1C274C]/40 dark:text-white/40 ml-2">onesimos.app / reader-demo</span>
            </div>
            <div className="flex items-center gap-2 bg-[#E1F18C] px-3 py-1 rounded-full text-[11px] font-black text-[#1C274C]">
              <span>⭐️</span> 10,000+ Chapters Mastered
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            <div className="md:col-span-2 bg-[#E1C8F6] rounded-[28px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <span className="bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1C274C]">
                  Chapter 1 • 5 min read
                </span>
                <span className="text-3xl">🦁</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#1C274C]/60 uppercase tracking-wider">Interactive Reader</p>
                <h3 className="text-2xl sm:text-3xl font-black text-[#1C274C] mt-1 leading-tight">
                  Leo the lion explores the green forest.
                </h3>
                <p className="text-sm font-medium text-[#1C274C]/80 mt-2">
                  Read aloud to earn star rewards and unlock new vocabulary words!
                </p>
              </div>
            </div>

            <div className="bg-[#1C274C] rounded-[28px] p-6 text-white flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 rounded-full bg-[#E1F18C] text-[#1C274C] flex items-center justify-center">
                  <MicIcon />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-full">Speech Engine</span>
              </div>

              <div className="my-6">
                <p className="text-xs font-bold text-white/60 uppercase">Evaluation State</p>
                <p className="text-lg font-black text-[#E1F18C] mt-0.5">Perfect Pronunciation!</p>
                <div className="mt-3 flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon key={s} />
                  ))}
                </div>
              </div>

              <div className="bg-white/10 rounded-full px-4 py-2 text-xs font-bold flex items-center justify-between">
                <span>Mastery Score</span>
                <span className="text-[#E1F18C]">98%</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      <footer className="py-8 text-center text-xs font-bold text-[#1C274C]/40 dark:text-white/40 border-t border-[#1C274C]/5">
        Onesimos Early Literacy Platform • Built for Young Readers
      </footer>

    </div>
  );
}
`;

write("app/page.tsx", inject(wrenlyPageContent));

console.log("");
console.log("Done. Commit and push:");
console.log("  git add .");
console.log(
  '  git commit -m "Step 1: Wrenly-style marketing homepage and mobile navbar"',
);
console.log("  git push origin main");
