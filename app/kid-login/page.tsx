"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function KidLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams ? searchParams.get("child") : null;
  
  const [name, setName] = useState("Friend");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!childId) {
        if (!cancelled) router.push("/who");
        return;
      }
      try {
        const client = createClient();
        const { data } = await client.from("children").select("name").eq("id", childId).single();
        if (!cancelled && data) setName(data.name);
      } catch {} finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [childId, router]);

  function handleDigit(d: string) {
    if (pin.length < 4) {
      const newPin = pin + d;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => router.push("/dashboard?child=" + childId), 300);
      }
    }
  }

  function handleBackspace() {
    setPin((prev) => prev.slice(0, -1));
  }

  if (loading) return <main className="min-h-screen bg-[#E1C8F6] dark:bg-[#0F172A]" />;

  return (
    <main className="min-h-screen bg-[#E1C8F6] dark:bg-[#0F172A] flex flex-col items-center justify-center p-5 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#E1F18C]/40 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-xs">
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl font-black text-[#1C274C] ring-8 ring-white/30 dark:bg-[#1E293B] dark:text-white dark:ring-white/10 mb-6 shadow-xl">
          {name.charAt(0).toUpperCase()}
        </div>
        
        <h1 className="text-3xl font-black tracking-tight text-[#1C274C] dark:text-white mb-2 text-center">
          Hi, {name}!
        </h1>
        <p className="text-sm font-bold text-[#1C274C]/60 dark:text-white/60 mb-8 uppercase tracking-widest text-center">
          Enter your secret code
        </p>

        <div className="flex gap-4 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={"w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black transition-all " + (i < pin.length ? "bg-[#1C274C] text-white shadow-md dark:bg-white dark:text-[#1C274C]" : "bg-white/50 text-transparent dark:bg-white/10")}>
              *
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
            <button key={d} type="button" onClick={() => handleDigit(d.toString())} className="h-16 rounded-full bg-white/80 dark:bg-[#1E293B]/80 text-[#1C274C] dark:text-white text-2xl font-black shadow-sm active:scale-95 transition-transform backdrop-blur-sm">
              {d}
            </button>
          ))}
          <button type="button" onClick={() => router.push("/who")} className="h-16 rounded-full bg-transparent text-[#1C274C]/50 dark:text-white/50 text-sm font-bold active:scale-95 transition-transform">
            Cancel
          </button>
          <button type="button" onClick={() => handleDigit("0")} className="h-16 rounded-full bg-white/80 dark:bg-[#1E293B]/80 text-[#1C274C] dark:text-white text-2xl font-black shadow-sm active:scale-95 transition-transform backdrop-blur-sm">
            0
          </button>
          <button type="button" onClick={handleBackspace} className="h-16 rounded-full bg-transparent text-[#1C274C] dark:text-white flex items-center justify-center active:scale-95 transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
          </button>
        </div>
      </div>
    </main>
  );
}

export default function KidLoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#E1C8F6] dark:bg-[#0F172A]" />}>
      <KidLoginContent />
    </Suspense>
  );
}
