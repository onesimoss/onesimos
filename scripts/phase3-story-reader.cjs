// scripts/phase3-story-reader.cjs
// Restyles the Story Reader pages to match Behance visual standard.
// Run: node scripts/phase3-story-reader.cjs

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

// ============================================================
// app/kid/[childId]/read/[storyId]/page.tsx
// ============================================================
const pageStoryReader = `"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { __SUPA__ } from "@/lib/supabase/client";

// Inline Icons
const ArrowLeft = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const ArrowRight = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const VolumeIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>;
const MicIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>;
const StarIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;

// Mock sample story pages for UI preview
const SAMPLE_PAGES = [
  {
    page: 1,
    text: "Leo the little lion loved to explore the green forest every morning.",
    emoji: "🦁",
    bg: "#E1F18C"
  },
  {
    page: 2,
    text: "He found a shiny blue key under a big soft leaf.",
    emoji: "🔑",
    bg: "#E1C8F6"
  },
  {
    page: 3,
    text: "The key opened a wooden door to a magical garden of stars!",
    emoji: "✨",
    bg: "#F7D4DA"
  }
];

function ReaderContent() {
  const router = useRouter();
  const params = useParams();
  const childId = params?.childId as string;
  const storyId = params?.storyId as string;

  const [currentPage, setCurrentPage] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [storyTitle, setStoryTitle] = useState("Leo's Big Adventure");

  const pageData = SAMPLE_PAGES[currentPage] || SAMPLE_PAGES[0];
  const progressPercent = Math.round(((currentPage + 1) / SAMPLE_PAGES.length) * 100);

  function handleNext() {
    if (currentPage < SAMPLE_PAGES.length - 1) {
      setCurrentPage((prev) => prev + 1);
    } else {
      // Completed story -> redirect to summary or dashboard
      router.push(childId ? \`/kid/\${childId}/summary\` : "/dashboard");
    }
  }

  function handlePrev() {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  }

  function toggleMic() {
    setIsListening((prev) => !prev);
  }

  function toggleAudio() {
    setIsPlayingAudio((prev) => !prev);
  }

  return (
    <main className="min-h-screen bg-[#F4F8FF] dark:bg-[#0F172A] relative overflow-hidden flex justify-center">
      
      {/* Desktop Background Branding */}
      <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none z-0">
        <h1 className="text-[12rem] font-black text-[#71A6EE]/10 tracking-tighter select-none">Reading Time</h1>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md bg-[#F4F8FF] dark:bg-[#0F172A] min-h-screen lg:min-h-[820px] lg:my-8 lg:rounded-[40px] lg:shadow-2xl lg:border-[8px] lg:border-white/50 lg:dark:border-[#1E293B] flex flex-col justify-between p-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[calc(1.5rem+env(safe-area-inset-top))]">
        
        {/* Top Navigation */}
        <div>
          <div className="flex items-center justify-between gap-3">
            <button 
              type="button" 
              onClick={() => router.back()} 
              className="w-11 h-11 rounded-full bg-white dark:bg-[#1E293B] text-[#1C274C] dark:text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            >
              <ArrowLeft />
            </button>
            
            {/* Progress Track */}
            <div className="flex-1 bg-white dark:bg-[#1E293B] h-11 rounded-full px-4 flex items-center gap-3 shadow-sm border border-[#1C274C]/5 dark:border-white/5">
              <span className="text-xs font-black text-[#1C274C] dark:text-white whitespace-nowrap">
                {currentPage + 1} / {SAMPLE_PAGES.length}
              </span>
              <div className="flex-1 h-2.5 bg-[#F4F8FF] dark:bg-[#0F172A] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#71A6EE] rounded-full transition-all duration-300"
                  style={{ width: \`\${progressPercent}%\` }}
                />
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => router.push("/dashboard")} 
              className="w-11 h-11 rounded-full bg-white dark:bg-[#1E293B] text-[#1C274C]/60 dark:text-white/60 flex items-center justify-center shadow-sm font-bold text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Story Card */}
        <div className="my-auto py-4">
          <div 
            className="rounded-[36px] p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden transition-all duration-300 border border-[#1C274C]/5"
            style={{ backgroundColor: pageData.bg }}
          >
            {/* Page Emoji Illustration */}
            <div className="w-28 h-28 rounded-full bg-white/70 dark:bg-black/10 backdrop-blur-sm flex items-center justify-center text-6xl shadow-inner mb-6 transform hover:scale-105 transition-transform">
              {pageData.emoji}
            </div>

            {/* Story Text */}
            <p className="text-2xl sm:text-3xl font-black text-[#1C274C] leading-snug tracking-tight">
              {pageData.text}
            </p>

            {/* Audio Playing Pulse Badge */}
            {isPlayingAudio && (
              <div className="mt-4 px-4 py-1.5 rounded-full bg-[#1C274C] text-[#E1F18C] text-xs font-bold flex items-center gap-2 animate-pulse">
                <VolumeIcon /> Reading aloud...
              </div>
            )}
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="space-y-4">
          
          {/* Interaction Pill Controls */}
          <div className="flex justify-center items-center gap-4">
            
            {/* Read to Me Button */}
            <button 
              type="button" 
              onClick={toggleAudio} 
              className={\`w-14 h-14 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all \${
                isPlayingAudio 
                  ? "bg-[#71A6EE] text-white ring-4 ring-[#71A6EE]/30" 
                  : "bg-white dark:bg-[#1E293B] text-[#1C274C] dark:text-white"
              }\`}
              title="Read aloud"
            >
              <VolumeIcon />
            </button>

            {/* Speech Recognition Mic Button */}
            <button 
              type="button" 
              onClick={toggleMic} 
              className={\`w-20 h-20 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all \${
                isListening 
                  ? "bg-red-500 text-white ring-8 ring-red-500/20 animate-pulse" 
                  : "bg-[#1C274C] text-[#E1F18C] dark:bg-white dark:text-[#1C274C]"
              }\`}
              title="Tap to read"
            >
              <MicIcon />
            </button>

            {/* Next Page Arrow Button */}
            <button 
              type="button" 
              onClick={handleNext} 
              className="w-14 h-14 rounded-full bg-white dark:bg-[#1E293B] text-[#1C274C] dark:text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
              title="Next page"
            >
              <ArrowRight />
            </button>
          </div>

          {/* Helper Caption */}
          <p className="text-center text-xs font-bold text-[#1C274C]/50 dark:text-white/50 tracking-wider uppercase">
            {isListening ? "Listening... Speak now!" : "Tap microphone to read aloud"}
          </p>

        </div>

      </div>
    </main>
  );
}

export default function StoryReaderPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#F4F8FF] dark:bg-[#0F172A]" />}>
      <ReaderContent />
    </Suspense>
  );
}
`;

// ============================================================
// app/read/page.tsx (Re-exports story reader UI)
// ============================================================
const pageReadFallback = pageStoryReader;

// Write files
write("app/kid/[childId]/read/[storyId]/page.tsx", inject(pageStoryReader));
write("app/read/page.tsx", inject(pageReadFallback));

console.log("");
console.log("Done. Commit and push:");
console.log("  git add .");
console.log(
  '  git commit -m "Phase 3: Restyle Story Reader UI with Behance palette and Suspense"',
);
console.log("  git push origin main");
