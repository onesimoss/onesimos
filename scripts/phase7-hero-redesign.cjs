// scripts/phase7-hero-redesign.cjs
// Step 1: Exact Hero Landing Page redesign matching reference image.
// Run: node scripts/phase7-hero-redesign.cjs

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

// Detect Supabase client name
let supaName = "createClient";
const supaSrc = read("lib/supabase/client.ts");
if (supaSrc) {
  const m = supaSrc.match(/export\s+(?:async\s+)?(?:function|const)\s+(\w+)/);
  if (m) supaName = m[1];
}
function inject(s) {
  return s.split("__SUPA__").join(supaName);
}

const heroPageContent = `"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { __SUPA__ } from "@/lib/supabase/client";

// Inline Icons
const SparkleStar = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const BookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
  </svg>
);

export default function HomePage() {
  const router = useRouter();

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
    <main className="min-h-screen bg-[#D6E5FD] dark:bg-[#0F172A] p-4 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden font-sans select-none">
      
      {/* Top Header Controls (Floating Subtle Nav) */}
      <header className="absolute top-6 left-6 right-6 z-40 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1C274C] text-[#E1F18C] font-black text-xl flex items-center justify-center shadow-md">
            O
          </div>
          <span className="font-black text-2xl tracking-tight text-[#1C274C] dark:text-white">
            Onesimos
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-full bg-white/80 hover:bg-white text-[#1C274C] font-bold text-sm backdrop-blur-sm transition-all shadow-sm"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2.5 rounded-full bg-[#1C274C] hover:bg-[#141C38] text-white font-bold text-sm shadow-md transition-all"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Main Canvas Frame Container */}
      <div className="w-full max-w-7xl min-h-[860px] rounded-[40px] bg-[#D6E5FD] dark:bg-[#0F172A] relative flex flex-col items-center justify-center pt-20 pb-12 px-4 overflow-hidden">
        
        {/* ========================================================= */}
        {/* 1. TOP FLOATING WIDGET (Your AI Learning Buddy)            */}
        {/* ========================================================= */}
        <div className="z-20 mb-6 sm:mb-8 flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
          <div className="bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md px-8 py-4 rounded-[28px] shadow-xl border border-white/80 dark:border-white/10 flex flex-col items-center relative">
            
            {/* Sparkle decorative icons around top card */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[#1C274C] dark:text-[#E1F18C]">
              <SparkleStar className="w-5 h-5" />
            </div>
            
            {/* Robot Buddy Avatar */}
            <div className="w-12 h-12 rounded-2xl bg-[#EAF2FF] dark:bg-[#0F172A] flex items-center justify-center text-2xl shadow-inner mb-2 border border-white">
              🤖
            </div>

            {/* Pill Badge */}
            <div className="flex items-center gap-2 text-base font-black text-[#1C274C] dark:text-white">
              <span>Your AI</span>
              <span className="bg-[#1C274C] text-white dark:bg-[#E1F18C] dark:text-[#1C274C] px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                Learning Buddy
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. GIANT BACKDROP DISPLAY TITLE ("Onesimos")               */}
        {/* ========================================================= */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="relative">
            <h1 className="text-[15vw] sm:text-[14rem] font-black text-[#7FB3F9]/40 dark:text-[#71A6EE]/15 tracking-tighter leading-none select-none">
              Onesimos
            </h1>
            
            {/* Decorative Stars placed on text */}
            <div className="absolute top-[15%] left-[2%] text-[#1C274C] dark:text-white opacity-80">
              <SparkleStar className="w-8 h-8 sm:w-12 sm:h-12" />
            </div>
            <div className="absolute top-[10%] right-[4%] text-[#1C274C] dark:text-white opacity-80">
              <SparkleStar className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. CENTER MOBILE PHONE MOCKUP                              */}
        {/* ========================================================= */}
        <div className="relative z-10 my-2">
          
          {/* Outer Phone Hardware Frame */}
          <div className="w-[320px] sm:w-[370px] h-[670px] bg-black rounded-[50px] p-3 shadow-[0_25px_60px_-15px_rgba(28,39,76,0.35)] border-[4 border-black relative ring-1 ring-white/20">
            
            {/* Dynamic Island / Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-end px-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1C274C]/60" />
            </div>

            {/* Inner Screen Viewport */}
            <div className="w-full h-full bg-white dark:bg-[#0F172A] rounded-[40px] overflow-hidden flex flex-col justify-between pt-9 pb-6 px-4 font-sans text-left">
              
              {/* Phone Top Status Bar */}
              <div className="flex justify-between items-center px-3 text-[11px] font-bold text-[#1C274C] dark:text-white mb-3">
                <span>08:34</span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>4G</span>
                  <div className="w-5 h-2.5 border border-[#1C274C] dark:border-white rounded-sm p-0.5 flex items-center">
                    <div className="h-full w-full bg-[#1C274C] dark:bg-white rounded-2xs" />
                  </div>
                </div>
              </div>

              {/* Kid Header inside App */}
              <div className="flex justify-between items-center px-1 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#E1C8F6] border-2 border-[#1C274C] flex items-center justify-center font-black text-base text-[#1C274C]">
                    👦
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#1C274C]/60 dark:text-white/60">Hello Max 👋</p>
                    <p className="text-xs font-black text-[#1C274C] dark:text-white">Good Morning</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-[#F4F8FF] dark:bg-[#1E293B] px-2.5 py-1 rounded-full text-[10px] font-bold text-[#1C274C] dark:text-white border border-[#1C274C]/10">
                    <span>🇬🇧</span> English <span>⌄</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#F4F8FF] dark:bg-[#1E293B] flex items-center justify-center text-[#1C274C] dark:text-white border border-[#1C274C]/10">
                    <BellIcon />
                  </div>
                </div>
              </div>

              {/* Buddy Encouragement Card */}
              <div className="bg-[#F4F8FF] dark:bg-[#1E293B] rounded-[24px] p-3.5 flex items-center gap-3 border border-[#1C274C]/5 mb-3">
                <div className="w-9 h-9 rounded-full bg-[#1C274C] flex items-center justify-center text-white text-sm shrink-0">
                  🤖
                </div>
                <div>
                  <p className="text-[9px] font-bold text-[#1C274C]/60 dark:text-white/60 uppercase tracking-wider">Your Reading Buddy</p>
                  <p className="text-xs font-black text-[#1C274C] dark:text-white leading-tight">You're learning great today!</p>
                </div>
              </div>

              {/* Today's Pick Card */}
              <div className="bg-[#F4F8FF] dark:bg-[#1E293B] rounded-[24px] p-4 border border-[#1C274C]/5 mb-4 shadow-sm">
                <p className="text-[10px] font-bold text-[#1C274C]/60 dark:text-white/60 uppercase tracking-wider">Today's pick: Shapes</p>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-[#1C274C]/70 dark:text-white/70">
                    <span>📖 12 lessons</span>
                    <span>•</span>
                    <span>⏱ 10 min</span>
                  </div>
                  <span className="text-[10px] font-black text-[#1C274C] dark:text-white">20% complete</span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="h-2 flex-1 bg-white dark:bg-[#0F172A] rounded-full overflow-hidden">
                    <div className="h-full bg-[#1C274C] dark:bg-[#E1F18C] rounded-full w-1/5" />
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#1C274C] text-[#E1F18C] flex items-center justify-center shrink-0 shadow-md pl-0.5">
                    <PlayIcon />
                  </div>
                </div>
              </div>

              {/* Let's Learn Grid Section */}
              <div>
                <h3 className="text-sm font-black text-[#1C274C] dark:text-white tracking-tight mb-2">Let's learn</h3>
                
                {/* Filter Chips */}
                <div className="flex gap-1.5 mb-3 overflow-x-auto scrollbar-hide">
                  <span className="px-3 py-1 rounded-full bg-[#1C274C] text-white text-[10px] font-bold shrink-0">
                    All <span className="ml-1 bg-white/20 px-1 rounded-full">12</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#F4F8FF] dark:bg-[#1E293B] text-[#1C274C] dark:text-white text-[10px] font-bold shrink-0 border border-[#1C274C]/5">
                    Aa Letters <span className="text-[#1C274C]/40">03</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#F4F8FF] dark:bg-[#1E293B] text-[#1C274C] dark:text-white text-[10px] font-bold shrink-0 border border-[#1C274C]/5">
                    🎨 Colors <span className="text-[#1C274C]/40">04</span>
                  </span>
                </div>

                {/* Two Column Pastel Cards */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-[#E1C8F6] rounded-[22px] p-3 flex flex-col justify-between h-28 text-left">
                    <div className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center text-xs">🎨</div>
                    <div>
                      <p className="text-[9px] font-bold text-[#1C274C]/60 uppercase">Colors</p>
                      <p className="text-xs font-black text-[#1C274C] leading-tight">Learn colors with objects</p>
                    </div>
                  </div>

                  <div className="bg-[#E1F18C] rounded-[22px] p-3 flex flex-col justify-between h-28 text-left">
                    <div className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center text-xs">Aa</div>
                    <div>
                      <p className="text-[9px] font-bold text-[#1C274C]/60 uppercase">Letters</p>
                      <p className="text-xs font-black text-[#1C274C] leading-tight">Learn fun sounds</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. FLOATING RIGHT CTA BUTTON ("Start learning")           */}
        {/* ========================================================= */}
        <div className="hidden md:flex absolute right-[8%] sm:right-[12%] top-[45%] z-20">
          <Link
            href="/signup"
            className="group bg-white/90 hover:bg-white dark:bg-[#1E293B]/90 backdrop-blur-md px-7 py-3.5 rounded-full shadow-2xl border border-white/80 dark:border-white/10 flex items-center gap-4 transition-all duration-300 hover:scale-105"
          >
            <span className="font-black text-lg text-[#1C274C] dark:text-white">Start learning</span>
            <div className="w-9 h-9 rounded-full bg-[#1C274C] text-white flex items-center justify-center shadow-md group-hover:translate-x-0.5 transition-transform pl-0.5">
              <PlayIcon />
            </div>
          </Link>
        </div>

        {/* ========================================================= */}
        {/* 5. FLOATING LEFT ILLUSTRATION (Cute Reader Graphic)        */}
        {/* ========================================================= */}
        <div className="hidden lg:flex absolute left-[6%] bottom-[12%] z-20 pointer-events-none">
          <div className="w-36 h-36 relative flex items-center justify-center">
            {/* Playful vector child sitting on an apple */}
            <svg viewBox="0 0 160 160" fill="none" className="w-full h-full drop-shadow-md">
              <circle cx="80" cy="105" r="45" fill="#F7D4DA" />
              <path d="M80 60 C75 45, 95 40, 85 30" stroke="#1C274C" strokeWidth="4" strokeLinecap="round" />
              <path d="M85 30 Q95 25 100 35" fill="#E1F18C" />
              <circle cx="70" cy="55" r="18" fill="#FFDBAC" />
              <path d="M60 45 Q70 35 82 45" fill="#1C274C" />
              <rect x="52" y="65" width="36" height="24" rx="4" fill="#71A6EE" transform="rotate(-10 70 77)" />
            </svg>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 6. FLOATING BOTTOM RIGHT BOOK CIRCLE                       */}
        {/* ========================================================= */}
        <div className="hidden md:flex absolute right-[10%] bottom-[15%] z-20">
          <div className="w-16 h-16 rounded-full bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-md shadow-xl flex items-center justify-center text-[#71A6EE] border border-white/60">
            <BookIcon />
          </div>
        </div>

      </div>
    </main>
  );
}
`;

write("app/page.tsx", inject(heroPageContent));

console.log("");
console.log("Done. Commit and push:");
console.log("  git add .");
console.log(
  '  git commit -m "Step 1: Redesign Hero landing page to 98%+ match Behance reference"',
);
console.log("  git push origin main");
