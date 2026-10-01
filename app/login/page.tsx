/**
 * @file app/login/page.tsx
 * @description Login page with Google OAuth, email magic link / password login,
 * and automatic session detection forwarding authenticated users to /who.
 *
 * @module app/login/page
 * @fonts Logo (wordmark) + Achiko (headings) + Switzer (body/UI)
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage(): JSX.Element {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  // Auto-forward logged-in parents straight to profile selector
  useEffect(() => {
    if (!loading && user) {
      router.replace("/who");
    }
  }, [user, loading, router]);

  const handleEmailLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setAuthError(null);
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setAuthError(error.message);
        setSubmitting(false);
        return;
      }

      router.replace("/who");
    } catch (err) {
      setAuthError("An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    setAuthError(null);
    setGoogleSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setAuthError(error.message);
        setGoogleSubmitting(false);
      }
    } catch (err) {
      setAuthError("Failed to initialize Google login.");
      setGoogleSubmitting(false);
    }
  };

  if (loading || user) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-switzer">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-amber-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="font-bold text-gray-600 text-sm font-switzer">
            Signing you in...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FDFBF7] via-amber-50/20 to-sky-50/30 font-switzer flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-sm font-switzer">
        
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="font-logo text-4xl text-amber-900 block mb-2">
            Onesimos
          </Link>
          <h1 className="font-achiko text-2xl text-amber-950">
            Welcome Back, Parent!
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-switzer">
            Sign in to access your child&apos;s reading journey
          </p>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-bold text-center font-switzer">
            {authError}
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={() => void handleGoogleLogin()}
          disabled={googleSubmitting}
          className="w-full py-3.5 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-3 font-switzer active:scale-[0.98] disabled:opacity-60 mb-6"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{googleSubmitting ? "Connecting to Google..." : "Continue with Google"}</span>
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-[10px] uppercase font-bold text-gray-400 absolute font-switzer">
            or email
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={(e) => void handleEmailLogin(e)} className="space-y-4 font-switzer">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 font-switzer">
              Parent Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="parent@example.com"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-switzer focus:outline-none focus:border-amber-400 bg-gray-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 font-switzer">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-switzer focus:outline-none focus:border-amber-400 bg-gray-50/50"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all active:scale-[0.98] disabled:opacity-60 font-switzer"
          >
            {submitting ? "Signing In..." : "Sign In to Onesimos →"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500 font-switzer">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="font-bold text-amber-800 hover:underline">
            Create Parent Account
          </Link>
        </div>

      </div>
    </main>
  );
}