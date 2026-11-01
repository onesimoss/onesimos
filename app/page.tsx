"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function HomePage() {
  const router = useRouter();

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

  return (
    <main className="min-h-screen bg-[#F4F8FF] px-5 dark:bg-[#0F172A] sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[calc(1.5rem+env(safe-area-inset-top))]">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1C274C] text-sm font-black text-[#E1F18C]">O</div>
            <span className="font-black tracking-tight text-[#1C274C] dark:text-white">Onesimos</span>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/login" className="rounded-full px-4 py-2 text-sm font-bold text-[#1C274C] dark:text-white">Sign in</Link>
            <Link href="/signup" className="rounded-full bg-[#1C274C] px-5 py-2.5 text-sm font-bold text-white">Get started</Link>
          </nav>
        </header>

        <section className="rounded-[32px] bg-white p-8 dark:bg-[#1E293B] sm:p-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#71A6EE]">Reading made playful</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#1C274C] dark:text-white sm:text-5xl">A reading app built for little learners</h1>
          <p className="mt-4 max-w-2xl text-base font-medium text-[#1C274C]/70 dark:text-white/70">Personalized learning chapters, real-time speech recognition evaluation, and adaptive story synthesis that grows with every child.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className="inline-flex h-12 items-center justify-center rounded-full bg-[#1C274C] px-6 font-bold text-white">Create account</Link>
            <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-full bg-[#E1F18C] px-6 font-bold text-[#1C274C]">I already have one</Link>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-[32px] bg-[#E1C8F6] p-6">
            <div className="h-12 w-12 rounded-full bg-white/70" />
            <h3 className="mt-6 text-lg font-black tracking-tight text-[#1C274C]">Personalized chapters</h3>
            <p className="mt-2 text-sm font-medium text-[#1C274C]/70">Each child gets a reading path tuned to their level and interests.</p>
          </div>
          <div className="rounded-[32px] bg-[#E1F18C] p-6">
            <div className="h-12 w-12 rounded-full bg-white/70" />
            <h3 className="mt-6 text-lg font-black tracking-tight text-[#1C274C]">Real-time feedback</h3>
            <p className="mt-2 text-sm font-medium text-[#1C274C]/70">Speech recognition evaluates each session as it happens.</p>
          </div>
          <div className="rounded-[32px] bg-[#F7D4DA] p-6">
            <div className="h-12 w-12 rounded-full bg-white/70" />
            <h3 className="mt-6 text-lg font-black tracking-tight text-[#1C274C]">Parent dashboard</h3>
            <p className="mt-2 text-sm font-medium text-[#1C274C]/70">See progress, mastery, and reading streaks at a glance.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
