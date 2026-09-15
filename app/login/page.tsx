/**
 * @file app/login/page.tsx
 * @description Parent Login Screen with Email/Password and Google OAuth authentication.
 *
 * @fonts Achiko (headings/logo) + Switzer (body/UI)
 * @dependencies
 * - @/context/AuthContext
 * - @/lib/supabaseClient
 * - @/lib/children
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { hasAnyChildren } from "@/lib/children";
import { supabase } from "@/lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const exists = await hasAnyChildren(user.id);
      router.push(exists ? "/dashboard" : "/onboarding");
    } else {
      router.push("/onboarding");
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);

    const redirectUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/dashboard`
        : "https://onesimos.app/dashboard";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      setError(error.message || "Failed to connect with Google. Try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-6 font-switzer">
      <div className="absolute top-0 right-0 w-72 h-72 bg-sky/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-mint/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-md w-full">
        <Link href="/" className="block text-center mb-8">
          <span className="font-logo text-3xl text-bark">Onesimos</span>
        </Link>

        <div className="card !p-8 shadow-soft bg-white rounded-3xl border border-border">
          <h1 className="font-heading text-3xl font-extrabold text-bark text-center mb-1">
            Welcome Back
          </h1>
          <p className="text-bark-muted text-center mb-6 text-sm">
            Continue the reading adventure
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-2xl mb-6 text-sm font-medium text-center">
              {error}
            </div>
          )}

          {/* Google OAuth Quick Sign-In */}
          <button
            type="button"
            disabled={googleLoading || loading}
            onClick={handleGoogleSignIn}
            className="w-full py-3.5 px-4 rounded-2xl border border-border bg-white text-bark font-bold text-sm hover:bg-cream/60 transition-all flex items-center justify-center gap-3 shadow-2xs active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mb-6 font-switzer"
          >
            {googleLoading ? (
              <span className="animate-pulse">Connecting to Google...</span>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-border w-full" />
            <span className="bg-white px-3 text-xs text-bark-muted font-bold uppercase tracking-wider absolute">
              Or
            </span>
          </div>

          {/* Standard Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-bark-light mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full px-4 py-3 bg-cream border border-border rounded-2xl focus:ring-2 focus:ring-coral/40 focus:border-coral focus:outline-none text-bark placeholder:text-bark-muted/50 transition-all font-switzer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-bark-light mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full px-4 py-3 bg-cream border border-border rounded-2xl focus:ring-2 focus:ring-coral/40 focus:border-coral focus:outline-none text-bark placeholder:text-bark-muted/50 transition-all font-switzer"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="btn-primary w-full !py-3.5 !text-base disabled:opacity-50 disabled:cursor-not-allowed font-switzer font-bold"
            >
              {loading ? "Signing in..." : "Log In"}
            </button>
          </form>

          <p className="text-center text-bark-muted text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-coral font-bold hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}