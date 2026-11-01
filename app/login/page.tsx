"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const client = createClient();
      const { error: err } = await client.auth.signInWithPassword({ email: email, password: password });
      if (err) throw err;
      router.push("/who");
    } catch (err: any) {
      setError((err && err.message) || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider: "google" | "apple") {
    setError(null);
    setOauthLoading(provider);
    try {
      const client = createClient();
      const redirectTo = typeof window !== "undefined" ? window.location.origin + "/who" : undefined;
      const { error: err } = await client.auth.signInWithOAuth({ provider: provider, options: { redirectTo: redirectTo } });
      if (err) throw err;
    } catch (err: any) {
      setError((err && err.message) || "Unable to continue with " + provider + ".");
      setOauthLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#F4F8FF] px-5 dark:bg-[#0F172A] sm:px-8">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[calc(2rem+env(safe-area-inset-top))]">
        <div className="rounded-[32px] bg-white p-8 dark:bg-[#1E293B]">
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-[#71A6EE]">Onesimos</Link>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#1C274C] dark:text-white">Welcome back</h1>
          <p className="mt-2 text-sm font-medium text-[#1C274C]/70 dark:text-white/70">Sign in to keep the reading going.</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => handleOAuth("google")} disabled={!!oauthLoading} className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#1C274C]/10 bg-white text-sm font-bold text-[#1C274C] dark:border-white/10 dark:bg-[#0F172A] dark:text-white">
              <span className="text-base font-black">G</span> Google
            </button>
            <button type="button" onClick={() => handleOAuth("apple")} disabled={!!oauthLoading} className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#1C274C]/10 bg-white text-sm font-bold text-[#1C274C] dark:border-white/10 dark:bg-[#0F172A] dark:text-white">
              <span className="text-base font-black">A</span> Apple
            </button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#1C274C]/10 dark:bg-white/10" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#1C274C]/40 dark:text-white/40">or</span>
            <div className="h-px flex-1 bg-[#1C274C]/10 dark:bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#1C274C]/70 dark:text-white/70">Email</label>
              <input type="email" name="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-2 h-12 w-full rounded-full border border-[#1C274C]/10 bg-[#F4F8FF] px-5 font-medium text-[#1C274C] outline-none dark:border-white/10 dark:bg-[#0F172A] dark:text-white" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#1C274C]/70 dark:text-white/70">Password</label>
              <input type="password" name="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" className="mt-2 h-12 w-full rounded-full border border-[#1C274C]/10 bg-[#F4F8FF] px-5 font-medium text-[#1C274C] outline-none dark:border-white/10 dark:bg-[#0F172A] dark:text-white" />
            </div>

            {error && <p className="text-sm font-medium text-red-500">{error}</p>}

            <button type="submit" disabled={loading} className={"flex h-12 w-full items-center justify-center rounded-full bg-[#1C274C] font-bold text-white " + (loading ? "opacity-60" : "")}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm font-medium text-[#1C274C]/70 dark:text-white/70">
            New here? <Link href="/signup" className="font-bold text-[#1C274C] dark:text-white">Create an account</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
