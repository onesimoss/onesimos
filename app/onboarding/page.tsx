"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const AVATARS = ["fox", "owl", "bear", "rabbit", "tiger", "panda"];
const INTERESTS = ["animals", "space", "ocean", "dinosaurs", "magic", "sports"];
const GOALS = [10, 15, 20, 30];
const AGES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function OnboardingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [age, setAge] = useState(5);
  const [avatarId, setAvatarId] = useState("fox");
  const [interests, setInterests] = useState<string[]>([]);
  const [sessionMinutes, setSessionMinutes] = useState(15);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const client = createClient();
        const { data } = await client.auth.getUser();
        if (!cancelled) {
          if (!data || !data.user) router.push("/login");
          else setReady(true);
        }
      } catch {
        if (!cancelled) router.push("/login");
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  function toggleInterest(i: string) {
    setInterests((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  }

  const canNext = step === 1 ? (name.trim().length >= 2 && age >= 3 && age <= 12) : interests.length > 0;

  async function finish() {
    setError(null);
    setSaving(true);
    try {
      const client = createClient();
      const { data } = await client.auth.getUser();
      const user = data && data.user;
      if (!user) throw new Error("Session expired. Please sign in again.");
      const { error: err } = await client.from("children").insert({
        parent_id: user.id,
        name: name.trim(),
        age: Math.round(age),
        avatar_id: avatarId,
        interests: interests,
        session_minutes: sessionMinutes,
        onboarding_completed: true
      });
      if (err) throw err;
      router.push("/who");
    } catch (err: any) {
      setError((err && err.message) || "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F8FF] dark:bg-[#0F172A]">
        <p className="text-sm font-bold text-[#1C274C] dark:text-white">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F8FF] px-5 dark:bg-[#0F172A] sm:px-8">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[calc(2rem+env(safe-area-inset-top))]">
        <div className="rounded-[32px] bg-white p-8 dark:bg-[#1E293B]">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <div className={"h-2 w-8 rounded-full " + (step >= 1 ? "bg-[#1C274C]" : "bg-[#1C274C]/20")} />
              <div className={"h-2 w-8 rounded-full " + (step >= 2 ? "bg-[#1C274C]" : "bg-[#1C274C]/20")} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#71A6EE]">Step {step} of 2</span>
          </div>

          {step === 1 && (
            <div className="mt-6 space-y-5">
              <h1 className="text-2xl font-black tracking-tight text-[#1C274C] dark:text-white">Who is learning?</h1>
              <p className="text-sm font-medium text-[#1C274C]/70 dark:text-white/70">Give us the basics and we will shape their reading path.</p>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C274C]/70 dark:text-white/70">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Child's name" className="mt-2 h-12 w-full rounded-full border border-[#1C274C]/10 bg-[#F4F8FF] px-5 font-medium text-[#1C274C] outline-none dark:border-white/10 dark:bg-[#0F172A] dark:text-white" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C274C]/70 dark:text-white/70">Age</label>
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {AGES.map((n) => (
                    <button key={n} type="button" onClick={() => setAge(n)} className={"h-10 rounded-full text-sm font-bold " + (age === n ? "bg-[#1C274C] text-white" : "bg-[#F4F8FF] text-[#1C274C] dark:bg-[#0F172A] dark:text-white")}>{n}</button>
                  ))}
                </div>
              </div>

              <button type="button" onClick={() => setStep(2)} disabled={!canNext} className={"flex h-12 w-full items-center justify-center rounded-full bg-[#1C274C] font-bold text-white " + (canNext ? "" : "opacity-50")}>Continue</button>
            </div>
          )}

          {step === 2 && (
            <div className="mt-6 space-y-5">
              <h1 className="text-2xl font-black tracking-tight text-[#1C274C] dark:text-white">Make it theirs</h1>
              <p className="text-sm font-medium text-[#1C274C]/70 dark:text-white/70">Pick an avatar and a few things they love.</p>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C274C]/70 dark:text-white/70">Avatar</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {AVATARS.map((a) => (
                    <button key={a} type="button" onClick={() => setAvatarId(a)} className={"h-12 w-12 rounded-full text-sm font-black uppercase " + (avatarId === a ? "bg-[#E1F18C] text-[#1C274C] ring-2 ring-[#1C274C]" : "bg-[#F4F8FF] text-[#1C274C] dark:bg-[#0F172A] dark:text-white")}>{a.charAt(0)}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C274C]/70 dark:text-white/70">Interests</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {INTERESTS.map((i) => (
                    <button key={i} type="button" onClick={() => toggleInterest(i)} className={"rounded-full px-4 py-2 text-sm font-bold capitalize " + (interests.includes(i) ? "bg-[#1C274C] text-white" : "bg-[#F4F8FF] text-[#1C274C] dark:bg-[#0F172A] dark:text-white")}>{i}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C274C]/70 dark:text-white/70">Daily goal</label>
                <div className="mt-2 flex gap-2">
                  {GOALS.map((g) => (
                    <button key={g} type="button" onClick={() => setSessionMinutes(g)} className={"flex-1 rounded-full py-2.5 text-sm font-bold " + (sessionMinutes === g ? "bg-[#E1C8F6] text-[#1C274C]" : "bg-[#F4F8FF] text-[#1C274C] dark:bg-[#0F172A] dark:text-white")}>{g}m</button>
                  ))}
                </div>
              </div>

              {error && <p className="text-sm font-medium text-red-500">{error}</p>}

              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(1)} className="flex h-12 flex-1 items-center justify-center rounded-full bg-[#F4F8FF] font-bold text-[#1C274C] dark:bg-[#0F172A] dark:text-white">Back</button>
                <button type="button" onClick={finish} disabled={!canNext || saving} className={"flex h-12 flex-[2] items-center justify-center rounded-full bg-[#1C274C] font-bold text-white " + ((!canNext || saving) ? "opacity-50" : "")}>{saving ? "Saving..." : "Finish setup"}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
