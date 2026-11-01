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

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [parentPin, setParentPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (parentPin.length < 4) {
      setError("Parent Security PIN must be 4 digits");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: fullName,
          email,
          password,
          pin_code: parentPin,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create account");
      }

      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message || "Could not complete registration.");
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
              Create Parent Account
            </h1>
            <p className="text-xs text-brand-navy/70 dark:text-slate-300 mt-1">
              Set up your family space and security controls
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

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
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="parentPin">Parent Security PIN (4 Digits)</Label>
              <Input
                id="parentPin"
                type="password"
                maxLength={4}
                placeholder="****"
                value={parentPin}
                onChange={(e) => setParentPin(e.target.value.replace(/\D/g, ""))}
                required
              />
              <span className="text-[10px] text-brand-navy/50 dark:text-slate-400 mt-1 block">
                Used to unlock parent settings and subscription billing.
              </span>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full gap-2 text-base font-bold shadow-sm mt-2"
            >
              <span>{loading ? "Creating Account..." : "Continue to Child Setup"}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 text-center pt-4 border-t border-brand-navy/10 dark:border-slate-700">
            <p className="text-xs text-brand-navy/70 dark:text-slate-300">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-brand-blue hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
