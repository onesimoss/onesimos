/**
 * @file app/signup/page.tsx
 * @description Parent registration page with Google OAuth, email signup,
 * Parent Name capture, Newsletter consent, and adult COPPA verification checkbox.
 *
 * @module app/signup/page
 * @fonts Logo (wordmark) + Achiko (headings) + Switzer (body/UI)
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage(): JSX.Element {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(false);
  const [newsletterConsent, setNewsletterConsent] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/onboarding");
    }
  }, [user, loading, router]);

  const handleEmailSignup = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setAuthError(null);

    if (!isAdultConfirmed) {
      setAuthError("You must confirm you are an adult (18+) to create an account.");
      return;
    }
    if (!parentName.trim()) {
      setAuthError("Please enter your name or nickname.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Sign up user with metadata
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: parentName.trim(),
            newsletter_opt_in: newsletterConsent,
          },
        },
      });

      if (error) {
        setAuthError(error.message);
        setSubmitting(false);
        return;
      }

      // 2. Ensure session is locked in immediately if email confirmation is disabled
      if (data?.user && !data.session) {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (loginError) {
          // If email confirmation is enabled on Supabase, inform parent cleanly
          setAuthError("Account created! Please check your email to confirm your account.");
          setSubmitting(false);
          return;
        }
      }

      router.replace("/onboarding");
    } catch {
      setAuthError("An unexpected error occurred during signup.");
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async (): Promise<void> => {
    setAuthError(null);

    if (!isAdultConfirmed) {
      setAuthError("Please check the box confirming you are an adult (18+).");
      return;
    }

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
    } catch {
      setAuthError("Failed to initialize Google signup.");
      setGoogleSubmitting(false);
    }
  };

  if (loading || user) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-switzer">
        <div className="text-center font-switzer">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-amber-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="font-bold text-gray-600 text-sm font-switzer">Creating account...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FDFBF7] via-amber-50/20 to-sky-50/30 font-switzer flex items-center justify-center p-6 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-sm font-switzer">
        
        {/* Header */}
        <div className="text-center mb-6 font-switzer">
          <Link href="/" className="font-logo text-4xl text-amber-900 block mb-2">
            Onesimos
          </Link>
          <h1 className="font-achiko text-2xl text-amber-950">
            Start Your Reading Adventure
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-switzer">
            Free forever tier includes 5 stories/month + Phonics Lab
          </p>
        </div>

        {authError && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-bold text-center font-switzer">
            {authError}
          </div>
        )}

        {/* Adult COPPA Age Checkbox (Mandatory) */}
        <div className="mb-5 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3 font-switzer transition-all hover:bg-amber-100/80">
          <input
            type="checkbox"
            id="adult-confirm"
            checked={isAdultConfirmed}
            onChange={(e) => setIsAdultConfirmed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 shrink-0 cursor-pointer"
          />
          <label htmlFor="adult-confirm" className="text-xs text-amber-950 leading-tight font-medium cursor-pointer font-switzer">
            I confirm I am a <strong>parent, legal guardian, or educator (18+)</strong> setting up this account for a child.
          </label>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={() => void handleGoogleSignup()}
          disabled={googleSubmitting}
          className="w-full py-3.5 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-3 font-switzer active:scale-[0.98] disabled:opacity-60 mb-6"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>{googleSubmitting ? "Connecting to Google..." : "Sign Up with Google"}</span>
        </button>

        <div className="relative flex items-center justify-center mb-6 font-switzer">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-[10px] uppercase font-bold text-gray-400 absolute font-switzer">
            or email
          </span>
        </div>

        {/* Email Form */}
        <form onSubmit={(e) => void handleEmailSignup(e)} className="space-y-4 font-switzer">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 font-switzer">
              Parent Name / Nickname
            </label>
            <input
              type="text"
              required
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder="e.g. Mama David, Mr. Ojo"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-switzer focus:outline-none focus:border-amber-400 bg-gray-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 font-switzer">
              Email Address
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
              Create Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-switzer focus:outline-none focus:border-amber-400 bg-gray-50/50"
            />
          </div>

          {/* Newsletter Consent Checkbox */}
          <div className="flex items-start gap-2 pt-1 font-switzer">
            <input
              type="checkbox"
              id="newsletter-confirm"
              checked={newsletterConsent}
              onChange={(e) => setNewsletterConsent(e.target.checked)}
              className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 shrink-0 cursor-pointer"
            />
            <label htmlFor="newsletter-confirm" className="text-[10px] text-gray-500 leading-tight cursor-pointer font-switzer">
              Send me weekly progress tips and reading advice (You can unsubscribe anytime).
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all active:scale-[0.98] disabled:opacity-60 font-switzer mt-2"
          >
            {submitting ? "Creating Account..." : "Create Parent Account →"}
          </button>
        </form>

        <p className="text-[10px] text-gray-400 text-center mt-4 font-switzer leading-tight">
          By signing up, you agree to Example Mirror Ltd&apos;s{" "}
          <Link href="/terms" className="underline hover:text-gray-600">Terms of Service</Link> and{" "}
          <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
        </p>

        <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-500 font-switzer">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-amber-800 hover:underline font-switzer">Log In</Link>
        </div>

      </div>
    </main>
  );
}