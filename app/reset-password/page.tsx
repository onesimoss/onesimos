/**
 * @file app/reset-password/page.tsx
 * @description Reset password form rendered after clicking reset link from email.
 *
 * @module app/reset-password/page
 * @fonts Logo (wordmark) + Achiko (headings) + Switzer (body/UI)
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage(): JSX.Element {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        setSubmitting(false);
        return;
      }

      router.replace("/parent");
    } catch {
      setError("Failed to update password. Please try again.");
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
          Set New Password
        </h1>
        <p className="text-xs text-gray-500 mb-6 font-switzer">
          Enter your new password below
        </p>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-bold font-switzer">
            {error}
          </div>
        )}

        <form onSubmit={(e) => void handleUpdatePassword(e)} className="space-y-4 text-left font-switzer">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 font-switzer">
              New Password
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

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all active:scale-[0.98] disabled:opacity-60 font-switzer"
          >
            {submitting ? "Updating Password..." : "Save New Password →"}
          </button>
        </form>

      </div>
    </main>
  );
}