// scripts/phase7-wrenly-exact.cjs
// Exact Wrenly Framer visual replica with Onesimos content & zero extra packages.
// Run: node scripts/phase7-wrenly-exact.cjs

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

const wrenlyExactContent = `"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { __SUPA__ } from "@/lib/supabase/client";

// Inline Icons (Zero extra npm packages)
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

const SparkleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FACC15">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
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

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const BookOpenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
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
    <div className="min-h-screen bg-[#080B11] text-white font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
      
      {/* ========================================================= */}
      {/* AMBIENT RADIAL LIGHT GLOWS (WRENLY SIGNATURE BACKGROUND)   */}
      {/* ========================================================= */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-purple-600/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-[800px] right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] pointer-events-none z-0" />

      {/* ========================================================= */}
      {/* 1. GLASSMORPHIC FLOATING NAVBAR                           */}
      {/* ========================================================= */}
      <nav className="sticky top-0 z-50 px-4 sm:px-8 pt-5 pb-3">
        <div className="mx-auto max-w-6xl rounded-full bg-[#111622]/80 backdrop-blur-xl border border-white/10 px-6 py-3 flex items-center justify-between shadow-2xl">
          
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              O
            </div>
            <span className="font-black text-xl tracking-tight text-white">
              Onesimos
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#parents" className="hover:text-white transition-colors">For parents</a>
            <Link href="/parent/pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link 
              href="/login" 
              className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
            >
              Sign in
            </Link>
            <Link 
              href="/signup" 
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-[0_0_25px_rgba(79,70,229,0.35)] transition-all"
            >
              Get started free
            </Link>
          </div>

          <button 
            type="button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mx-auto mt-3 max-w-6xl rounded-[32px] bg-[#111622] border border-white/10 p-6 space-y-4 shadow-2xl">
            <div className="flex flex-col gap-3 font-bold text-base text-slate-300">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5">How it works</a>
              <a href="#parents" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5">For parents</a>
              <Link href="/parent/pricing" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/5">Pricing</Link>
            </div>
            <div className="pt-2 flex flex-col gap-3">
              <Link href="/login" className="w-full py-3 rounded-full text-center font-bold bg-white/5 border border-white/10">Sign in</Link>
              <Link href="/signup" className="w-full py-3 rounded-full text-center font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white">Get started free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ========================================================= */}
      {/* 2. HERO SECTION (WRENLY EXACT STRUCTURE)                   */}
      {/* ========================================================= */}
      <section className="relative z-10 px-4 sm:px-8 pt-16 pb-20 max-w-6xl mx-auto text-center flex flex-col items-center">
        
        {/* Glowing Pill Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider shadow-inner mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          <SparkleIcon /> Adaptive Early Literacy Platform • Ages 3 to 12
        </div>

        {/* Gradient Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] max-w-4xl text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400">
          Transform reading time into your child's favorite adventure
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl font-medium text-slate-400 max-w-2xl leading-relaxed">
          Onesimos generates personalized reading chapters, evaluates pronunciation in real-time, and builds lifetime confidence through playful story synthesis.
        </p>

        {/* CTA Buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
            href="/signup" 
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-base shadow-[0_0_35px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-2"
          >
            Start your free trial <ArrowRight />
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-base border border-white/10 transition-all text-center"
          >
            Parent Sign in
          </Link>
        </div>

        {/* Social Proof Row */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 text-xs font-bold text-slate-400">
          <div className="flex -space-x-2">
            {["👦", "👧", "🦊", "🦁"].map((avatar, idx) => (
              <div key={idx} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#080B11] flex items-center justify-center text-sm shadow-md">
                {avatar}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} />)}
            </div>
            <span className="text-slate-300 font-bold">Loved by 2,000+ early readers</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. WRENLY HERO BENTO SHOWCASE CARD                         */}
        {/* ========================================================= */}
        <div className="mt-16 w-full rounded-[36px] bg-[#111622]/90 p-4 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-white/10 relative overflow-hidden backdrop-blur-xl">
          
          {/* Glowing Top Frame */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="text-xs font-bold text-slate-500 ml-2">onesimos.app / adaptive-reader</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 rounded-full text-xs font-bold text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              Live Reader Active
            </div>
          </div>

          {/* Interactive Feature Demo Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            
            {/* Bento Card 1: Interactive Story Reader */}
            <div className="md:col-span-2 rounded-[28px] bg-gradient-to-br from-slate-900 to-[#141B2D] p-6 sm:p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold">
                  Chapter 1 • Magic Forest
                </span>
                <span className="text-3xl">🚀</span>
              </div>

              <div>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Adaptive Reading Engine</p>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                  Leo unlocked the glowing blue key under the giant leaf.
                </h3>
                
                {/* Audio Waveform Micro-Widget */}
                <div className="mt-6 flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                    🔊
                  </div>
                  <div className="flex-1 flex items-center gap-1 h-6">
                    {[40, 70, 25, 90, 60, 30, 80, 50, 95, 40, 60, 30].map((h, i) => (
                      <div key={i} className="flex-1 bg-blue-400/80 rounded-full" style={{ height: \`\${h}%\` }} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-400">0:14</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Speech Recognition Evaluation */}
            <div className="rounded-[28px] bg-gradient-to-b from-indigo-950/60 to-[#111622] p-6 border border-indigo-500/20 flex flex-col justify-between text-left">
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                  <MicIcon />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-500/30">
                  Speech AI
                </span>
              </div>

              <div className="my-6">
                <p className="text-xs font-bold text-slate-400 uppercase">Pronunciation Feedback</p>
                <p className="text-xl font-black text-white mt-1">98% Mastery</p>
                <div className="mt-3 flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} />)}
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-3 border border-white/10 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Stumbled Words Log</span>
                <span className="text-emerald-400">+3 Mastered</span>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* 4. THREE COLUMN BENTO FEATURES (WRENLY FEATURE GRID)       */}
      {/* ========================================================= */}
      <section id="features" className="relative z-10 px-4 sm:px-8 py-20 max-w-6xl mx-auto text-center">
        
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">
          Core Capability
        </span>
        
        <h2 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight text-white max-w-2xl mx-auto">
          Built for how children naturally learn to read
        </h2>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          {/* Feature 1 */}
          <div className="rounded-[32px] bg-[#111622] p-8 border border-white/10 hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
              <BookOpenIcon />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Personalized Chapters</h3>
              <p className="mt-2 text-sm font-medium text-slate-400 leading-relaxed">
                Stories adapt automatically to your child's age, vocabulary level, and personal interests like animals, space, or magic.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="rounded-[32px] bg-[#111622] p-8 border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
              <MicIcon />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Real-Time Evaluation</h3>
              <p className="mt-2 text-sm font-medium text-slate-400 leading-relaxed">
                Speech recognition listens as your child reads aloud, giving instant gentle feedback without pressure or stress.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="rounded-[32px] bg-[#111622] p-8 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
              <ShieldIcon />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Protected Parent Zone</h3>
              <p className="mt-2 text-sm font-medium text-slate-400 leading-relaxed">
                Guarded by a 4-digit PIN, parents can monitor mastery streaks, set daily minute goals, and handle subscriptions safely.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. FOOTER BRANDING                                         */}
      {/* ========================================================= */}
      <footer className="relative z-10 py-12 text-center text-xs font-bold text-slate-500 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">O</div>
            <span className="font-bold text-slate-300">Onesimos Literacy Platform</span>
          </div>
          <p>© {new Date().getFullYear()} Onesimos. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
`;

write("app/page.tsx", inject(wrenlyExactContent));

console.log("");
console.log("Done. Commit and push:");
console.log("  git add .");
console.log(
  '  git commit -m "Step 1: Exact Wrenly Framer visual replica for Onesimos homepage"',
);
console.log("  git push origin main");
