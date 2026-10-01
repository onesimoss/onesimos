/**
 * @file app/forgot-password/page.tsx
 * @description Password recovery page sending password reset links via Resend SMTP.
 *
 * @module app/forgot-password/page
 * @fonts Logo (wordmark) + Achiko (headings) + Switzer (body/UI)
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleResetRequest = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setSubmitting(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) {
        setError(resetError.message);
        setSubmitting(false);
        return;
      }

      setMessage(`Password reset link sent to ${email}. Please check your inbox!`);
      setSubmitting(false);
    } catch {
      setError("Failed to request password reset. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FDFBF7] via-amber-50/20 to-sky-50/30 font-switzer flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-sm text-center font-switzer">
        
        <Link href="/" className="font-logo text-4xl text-amber-900 block mb-2">
          Onesimos
        </Link>

        <h1 className="font-achiko text-2xl text-amber-950 mb-1">
          Reset Your Password
        </h1>
        <p className="text-xs text-gray-500 mb-6 font-switzer">
          Enter your parent account email and we&apos;ll send you a reset link
        </p>

        {message && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold font-switzer">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-bold font-switzer">
            {error}
          </div>
        )}

        <form onSubmit={(e) => void handleResetRequest(e)} className="space-y-4 text-left font-switzer">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 font-switzer">
              Parent Email Address
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

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all active:scale-[0.98] disabled:opacity-60 font-switzer"
          >
            {submitting ? "Sending Link..." : "Send Reset Link →"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 font-switzer">
          Remembered your password?{" "}
          <Link href="/login" className="font-bold text-amber-800 hover:underline">
            Back to Login
          </Link>
        </div>

      </div>
    </main>
  );
}