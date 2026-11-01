"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface ChildRow {
  id: string;
  name: string;
  age: number;
  avatar_id: string | null;
}

const PARENT_PIN_FALLBACK = "1234";

export default function WhoPage() {
  const router = useRouter();
  const [children, setChildren] = useState<ChildRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const client = createClient();
        const { data: authData } = await client.auth.getUser();
        const user = authData && authData.user;
        if (!user) { if (!cancelled) router.push("/login"); return; }
        const { data: kids, error } = await client
          .from("children")
          .select("id,name,age,avatar_id")
          .eq("parent_id", user.id)
          .order("created_at", { ascending: true });
        if (!cancelled) setChildren((kids as ChildRow[]) || []);
      } catch {
        if (!cancelled) router.push("/login");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  function openPin() {
    setPin("");
    setPinError(null);
    setPinOpen(true);
  }

  function submitPin(e: React.FormEvent) {
    e.preventDefault();
    if (pin === PARENT_PIN_FALLBACK) {
      setPinOpen(false);
      router.push("/parent-dashboard");
    } else {
      setPinError("Incorrect PIN.");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F8FF] dark:bg-[#0F172A]">
        <p className="text-sm font-bold text-[#1C274C] dark:text-white">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F8FF] px-5 dark:bg-[#0F172A] sm:px-8">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[calc(2rem+env(safe-area-inset-top))]">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-black tracking-tight text-[#1C274C] dark:text-white">Who is learning today?</h1>
          <button type="button" onClick={openPin} className="shrink-0 rounded-full bg-[#1C274C] px-4 py-2 text-sm font-bold text-white">Parent zone</button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {children.map((child) => (
            <Link key={child.id} href={"/kid-login?child=" + child.id} className="flex flex-col items-center gap-3 rounded-[32px] bg-white p-5 text-center dark:bg-[#1E293B]">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E1C8F6] text-2xl font-black text-[#1C274C] ring-4 ring-[#E1F18C]">
                {(child.name || "?").charAt(0).toUpperCase()}
              </div>
              <p className="font-bold text-[#1C274C] dark:text-white">{child.name}</p>
              <p className="text-xs font-medium text-[#1C274C]/60 dark:text-white/60">{child.age} yrs</p>
            </Link>
          ))}

          <Link href="/onboarding" className="flex flex-col items-center justify-center gap-2 rounded-[32px] border-2 border-dashed border-[#1C274C]/20 p-5 text-center dark:border-white/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F8FF] text-xl font-black text-[#1C274C] dark:bg-[#0F172A] dark:text-white">+</div>
            <p className="text-sm font-bold text-[#1C274C] dark:text-white">Add child</p>
          </Link>
        </div>
      </div>

      {pinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
          <form onSubmit={submitPin} className="w-full max-w-sm rounded-[32px] bg-white p-6 dark:bg-[#1E293B]">
            <h2 className="text-lg font-black tracking-tight text-[#1C274C] dark:text-white">Parent PIN</h2>
            <p className="mt-1 text-sm font-medium text-[#1C274C]/70 dark:text-white/70">Enter your 4-digit PIN to continue</p>
            <input type="password" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value.slice(0, 4))} autoFocus className="mt-4 h-12 w-full rounded-full border border-[#1C274C]/10 bg-[#F4F8FF] px-5 text-center text-xl font-black tracking-widest text-[#1C274C] outline-none dark:border-white/10 dark:bg-[#0F172A] dark:text-white" />
            {pinError && <p className="mt-2 text-sm font-medium text-red-500">{pinError}</p>}
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setPinOpen(false)} className="h-11 flex-1 rounded-full bg-[#F4F8FF] font-bold text-[#1C274C] dark:bg-[#0F172A] dark:text-white">Cancel</button>
              <button type="submit" className="h-11 flex-1 rounded-full bg-[#1C274C] font-bold text-white">Unlock</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
