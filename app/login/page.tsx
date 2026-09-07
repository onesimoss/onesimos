"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="absolute top-0 right-0 w-72 h-72 bg-sky/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-mint/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-md w-full">
        <Link href="/" className="block text-center mb-8">
          <span className="font-heading text-3xl font-extrabold text-bark">
            ✨ Onesimos
          </span>
        </Link>

        <div className="card !p-8">
          <h1 className="font-heading text-3xl font-extrabold text-bark text-center mb-1">
            Welcome Back!
          </h1>
          <p className="text-bark-muted text-center mb-8">
            Let&apos;s continue the reading adventure 📚
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-2xl mb-6 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

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
                className="w-full px-4 py-3 bg-cream border border-border rounded-2xl
                           focus:ring-2 focus:ring-coral/40 focus:border-coral focus:outline-none
                           text-bark placeholder:text-bark-muted/50 transition-all"
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
                className="w-full px-4 py-3 bg-cream border border-border rounded-2xl
                           focus:ring-2 focus:ring-coral/40 focus:border-coral focus:outline-none
                           text-bark placeholder:text-bark-muted/50 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3.5 !text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Log In"}
            </button>
          </form>

          <p className="text-center text-bark-muted text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-coral font-bold hover:underline"
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}