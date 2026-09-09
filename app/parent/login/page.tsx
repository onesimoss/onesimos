"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ParentLogin() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await signIn(email, password);

      if (authError) {
        setError(authError.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      // Successful login -> Redirect to Parent Dashboard
      router.push("/parent");
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-border/60">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-coral/10 text-coral rounded-2xl mb-3 text-2xl font-black">
            🛡️
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-bark">
            Parent Login
          </h1>
          <p className="text-bark-muted text-xs mt-1">
            Access your Onesimos parent portal and manage reading settings.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-bark mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="parent@example.com"
              className="w-full px-4 py-3 rounded-2xl border border-border bg-[#FBF9F5] text-sm text-bark font-medium focus:outline-none focus:ring-2 focus:ring-coral/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-bark mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl border border-border bg-[#FBF9F5] text-sm text-bark font-medium focus:outline-none focus:ring-2 focus:ring-coral/40"
            />
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-coral/10 border border-coral/20 text-coral text-xs font-bold text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-2xl bg-bark text-cream font-extrabold text-sm hover:bg-bark/90 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 mt-2"
          >
            {loading ? "Signing in..." : "Log in to Dashboard →"}
          </button>
        </form>

        {/* Links */}
        <div className="mt-8 pt-6 border-t border-border/50 text-center space-y-3">
          <p className="text-xs text-bark-muted font-medium">
            Don&apos;t have a parent account yet?{" "}
            <Link href="/signup" className="text-coral font-bold hover:underline">
              Sign up
            </Link>
          </p>

          <Link
            href="/who"
            className="inline-block text-xs font-bold text-bark-muted hover:text-bark transition-colors"
          >
            ← Back to Kid Profiles
          </Link>
        </div>
      </div>
    </main>
  );
}