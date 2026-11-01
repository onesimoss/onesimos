"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to sign in");
      }

      router.push("/who");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-darkBg flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo variant="spark" />
        </div>

        <Card className="rounded-[32px] p-8 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-brand-navy dark:text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-brand-navy/70 dark:text-slate-300 mt-1">
              Log in to manage learning progress and parent controls
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="parent@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full gap-2 text-base font-bold shadow-sm mt-2"
            >
              <span>{loading ? "Signing in..." : "Log In"}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3 pt-4 border-t border-brand-navy/10 dark:border-slate-700">
            <p className="text-xs text-brand-navy/70 dark:text-slate-300">
              Don't have a parent account yet?{" "}
              <Link href="/signup" className="font-bold text-brand-blue hover:underline">
                Sign up
              </Link>
            </p>
            <p className="text-xs">
              <Link
                href="/who"
                className="font-bold text-brand-navy/60 hover:text-brand-navy dark:text-slate-400"
              >
                Switch to Kid Space
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
