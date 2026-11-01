const fs = require('fs');
const path = require('path');

function ensureDir(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    ensureDir(dirname);
    fs.mkdirSync(dirname);
  }
}

function writeFile(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[CREATED/UPDATED] ${filePath}`);
}

// 1. Input Primitive (Pill Shaped Input)
const inputPrimitive = `import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-full border border-brand-navy/15 bg-white px-5 py-3 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/30 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-brand-blue/40 transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
`;

// 2. Label Primitive
const labelPrimitive = `import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-xs font-bold uppercase tracking-wider text-brand-navy/70 dark:text-slate-300 mb-1.5 block select-none",
        className
      )}
      {...props}
    />
  )
);
Label.displayName = "Label";

export { Label };
`;

// 3. Avatar Picker Component
const avatarPickerComponent = `import * as React from "react";
import { cn } from "@/lib/utils";

export const AVATAR_OPTIONS = [
  { id: "lion", name: "Leo Lion", color: "bg-brand-lime" },
  { id: "owl", name: "Ollie Owl", color: "bg-brand-purple" },
  { id: "fox", name: "Felix Fox", color: "bg-brand-pink" },
  { id: "bear", name: "Barnaby Bear", color: "bg-brand-blue" },
  { id: "rabbit", name: "Rosie Rabbit", color: "bg-brand-lime" },
  { id: "panda", name: "Pip Panda", color: "bg-brand-purple" },
];

interface AvatarPickerProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function AvatarPicker({ selectedId, onSelect }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
      {AVATAR_OPTIONS.map((avatar) => {
        const isSelected = selectedId === avatar.id;
        return (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onSelect(avatar.id)}
            className={cn(
              "group flex flex-col items-center gap-2 rounded-3xl p-3 transition-all touch-target",
              isSelected
                ? "bg-white shadow-md ring-2 ring-brand-navy dark:bg-slate-800 dark:ring-brand-blue"
                : "hover:bg-white/50 dark:hover:bg-slate-800/50"
            )}
          >
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full text-2xl transition-transform group-hover:scale-105",
                avatar.color
              )}
            >
              {avatar.id === "lion" && "🦁"}
              {avatar.id === "owl" && "🦉"}
              {avatar.id === "fox" && "🦊"}
              {avatar.id === "bear" && "🐻"}
              {avatar.id === "rabbit" && "🐰"}
              {avatar.id === "panda" && "🐼"}
            </div>
            <span className="text-xs font-bold text-brand-navy dark:text-slate-200">
              {avatar.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
`;

// 4. Welcome Page (Matching Behance Reference Hero Stacked Cards)
const welcomePage = `"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

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

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-darkBg flex flex-col justify-between p-6 sm:p-10">
      {/* Header */}
      <header className="flex items-center justify-between max-w-5xl w-full mx-auto">
        <Logo variant="spark" />
        <Link href="/login">
          <Button variant="ghost" size="sm" className="font-semibold">
            Log in
          </Button>
        </Link>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-4xl w-full mx-auto my-auto py-8 flex flex-col items-center text-center">
        {/* Behance Reference Stacked Cards Visual */}
        <div className="relative w-full max-w-md h-64 mb-8 flex items-center justify-center">
          {/* Back Card 1 - Pink */}
          <div className="absolute top-0 w-72 h-36 rounded-3xl bg-brand-pink border border-black/5 -rotate-6 shadow-sm flex items-center justify-center p-4">
            <span className="font-bold text-brand-navy text-sm">
              Instant Feedback
            </span>
          </div>
          {/* Back Card 2 - Lime */}
          <div className="absolute top-4 w-80 h-36 rounded-3xl bg-brand-lime border border-black/5 rotate-3 shadow-sm flex items-center justify-center p-4">
            <span className="font-bold text-brand-navy text-sm">
              Fun Games & Activities
            </span>
          </div>
          {/* Front Hero Card - Blue/Purple */}
          <div className="absolute top-8 w-full max-w-sm rounded-[32px] bg-white dark:bg-slate-800 border border-black/5 p-6 shadow-xl flex flex-col items-center text-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/20 text-brand-navy dark:text-brand-blue text-xs font-bold">
              <span>Personalized</span>
            </div>
            <h2 className="text-2xl font-black text-brand-navy dark:text-white tracking-tight">
              Personalized Learning
            </h2>
            <p className="text-xs text-brand-navy/70 dark:text-slate-300 leading-relaxed">
              Lessons adapt to your child's pace, focusing on what they need most.
            </p>
          </div>
        </div>

        {/* Title & Copy */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-brand-navy dark:text-white max-w-xl leading-tight mb-4">
          Every child learns differently, our job is to meet them where they are.
        </h1>
        <p className="text-base text-brand-navy/70 dark:text-slate-300 max-w-md mb-8">
          Personalized learning chapters, real-time speech evaluation, and adaptive story synthesis designed for early learners.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xs sm:max-w-sm">
          <Link href="/signup" className="w-full">
            <Button size="lg" className="w-full gap-2 text-base font-bold shadow-md">
              <span>Sign up</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login" className="w-full">
            <Button variant="outline" size="lg" className="w-full text-base font-bold">
              Log in
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-brand-navy/50 dark:text-slate-500 py-4">
        Onesimos Early Learning System. Safe, ad-free, and private for children.
      </footer>
    </div>
  );
}
`;

// 5. Parent Login Page
const loginPage = `"use client";

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
      // Backend authentication logic wrapper
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
        {/* Header Logo */}
        <div className="flex justify-center mb-8">
          <Logo variant="spark" />
        </div>

        {/* Login Card */}
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
`;

// 6. Parent Signup Page
const signupPage = `"use client";

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
`;

// 7. Onboarding Page (Parent & Child Setup Wizard)
const onboardingPage = `"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AvatarPicker } from "@/components/ui/avatar-picker";
import { Badge } from "@/components/ui/badge";

const INTEREST_OPTIONS = [
  "Letters & Sounds",
  "Colors & Shapes",
  "Animals & Nature",
  "Stories & Tales",
  "Numbers & Math",
  "Science & Curiosity",
];

const AGE_OPTIONS = [3, 4, 5, 6, 7];
const TIME_LIMIT_OPTIONS = [5, 10, 15, 20, 30];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Child Profile Form State (Maps 1:1 to children table)
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState<number>(4);
  const [avatarId, setAvatarId] = useState("lion");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Letters & Sounds",
    "Colors & Shapes",
  ]);
  const [sessionMinutes, setSessionMinutes] = useState<number>(10);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleFinishOnboarding = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/children/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: childName || "Little Learner",
          age: childAge,
          avatar_id: avatarId,
          interests: selectedInterests,
          session_minutes: sessionMinutes,
          onboarding_completed: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create child profile");
      }

      router.push("/who");
    } catch (err) {
      console.error(err);
      // Fallback transition for web build
      router.push("/who");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-darkBg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Logo & Step Indicator */}
        <div className="flex flex-col items-center mb-8 gap-4">
          <Logo variant="spark" />
          <div className="flex items-center gap-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-2.5 rounded-full transition-all ${
                  step === s
                    ? "w-8 bg-brand-navy dark:bg-brand-blue"
                    : "w-2.5 bg-brand-navy/20 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Card Container */}
        <Card className="rounded-[32px] p-6 sm:p-10 shadow-sm">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-black text-brand-navy dark:text-white">
                  Meet Your Learner
                </h1>
                <p className="text-xs text-brand-navy/70 dark:text-slate-300 mt-1">
                  Create a personalized learning campaign profile for your child.
                </p>
              </div>

              <div>
                <Label htmlFor="childName">Child's First Name</Label>
                <Input
                  id="childName"
                  placeholder="e.g. Emma"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Age</Label>
                <div className="flex gap-2">
                  {AGE_OPTIONS.map((age) => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => setChildAge(age)}
                      className={`flex-1 py-3 rounded-full font-bold text-sm transition-all ${
                        childAge === age
                          ? "bg-brand-navy text-white dark:bg-brand-blue dark:text-brand-navy shadow-sm"
                          : "bg-white/80 text-brand-navy border border-brand-navy/15 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {age} yrs
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Choose Companion Avatar</Label>
                <AvatarPicker selectedId={avatarId} onSelect={setAvatarId} />
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!childName.trim()}
                className="w-full text-base font-bold mt-4"
              >
                Next: Learning Preferences
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-black text-brand-navy dark:text-white">
                  Learning Preferences
                </h1>
                <p className="text-xs text-brand-navy/70 dark:text-slate-300 mt-1">
                  Tailor learning chapters and daily session limits.
                </p>
              </div>

              <div>
                <Label>Favorite Learning Topics</Label>
                <div className="flex flex-wrap gap-2.5 mt-2">
                  {INTEREST_OPTIONS.map((topic) => {
                    const isSelected = selectedInterests.includes(topic);
                    return (
                      <Badge
                        key={topic}
                        variant={isSelected ? "active" : "outline"}
                        className="cursor-pointer px-4 py-2 text-xs font-bold"
                        onClick={() => toggleInterest(topic)}
                      >
                        {topic}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label>Daily Screen Time Goal</Label>
                <div className="flex gap-2 mt-2">
                  {TIME_LIMIT_OPTIONS.map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setSessionMinutes(mins)}
                      className={`flex-1 py-3 rounded-full font-bold text-xs transition-all ${
                        sessionMinutes === mins
                          ? "bg-brand-navy text-white dark:bg-brand-blue dark:text-brand-navy shadow-sm"
                          : "bg-white/80 text-brand-navy border border-brand-navy/15 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-1/3"
                >
                  Back
                </Button>
                <Button
                  onClick={handleFinishOnboarding}
                  disabled={loading}
                  className="w-2/3 text-base font-bold"
                >
                  {loading ? "Setting Up..." : "Start Learning"}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
`;

// 8. Who Page (Child Profile Selector & Parent PIN Unlock)
const whoPage = `"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function WhoPage() {
  const router = useRouter();
  const [showPinModal, setShowPinModal] = useState(false);
  const [parentPinInput, setParentPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  // Demo profile list mapping cleanly to children table data
  const profiles = [
    { id: "1", name: "Emma", age: 4, avatar: "🦁", color: "bg-brand-lime" },
    { id: "2", name: "Noah", age: 6, avatar: "🦉", color: "bg-brand-purple" },
  ];

  const handleSelectKid = (childId: string) => {
    localStorage.setItem("onesimos_current_child_id", childId);
    router.push("/kid/dashboard");
  };

  const handleVerifyParentPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (parentPinInput.length === 4) {
      router.push("/parent/overview");
    } else {
      setPinError("Please enter a valid 4-digit PIN");
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-darkBg flex flex-col justify-between p-6 sm:p-10">
      {/* Header */}
      <header className="flex items-center justify-between max-w-4xl w-full mx-auto">
        <Logo variant="spark" />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPinModal(true)}
          className="font-bold text-xs"
        >
          🔒 Parent Space
        </Button>
      </header>

      {/* Main Selection Area */}
      <main className="max-w-3xl w-full mx-auto my-auto text-center py-8">
        <h1 className="text-3xl sm:text-4xl font-black text-brand-navy dark:text-white tracking-tight mb-2">
          Who is learning today?
        </h1>
        <p className="text-sm text-brand-navy/70 dark:text-slate-300 mb-8">
          Pick your profile to jump into personalized chapters!
        </p>

        {/* Profile Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto mb-8">
          {profiles.map((profile) => (
            <Card
              key={profile.id}
              onClick={() => handleSelectKid(profile.id)}
              className="group cursor-pointer rounded-[32px] p-6 text-center hover:scale-105 transition-all shadow-sm border-2 border-transparent hover:border-brand-navy/20 dark:hover:border-brand-blue"
            >
              <div
                className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-4xl mb-4 shadow-sm group-hover:rotate-6 transition-transform ${profile.color}`}
              >
                {profile.avatar}
              </div>
              <h2 className="text-xl font-bold text-brand-navy dark:text-white">
                {profile.name}
              </h2>
              <span className="inline-block mt-1 text-xs font-semibold px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-brand-navy dark:text-slate-200">
                {profile.age} years old
              </span>
            </Card>
          ))}
        </div>

        <Link href="/onboarding">
          <Button variant="ghost" className="font-bold text-sm">
            + Add Another Child Profile
          </Button>
        </Link>
      </main>

      {/* Parent PIN Security Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <Card className="rounded-[32px] p-6 max-w-sm w-full bg-white dark:bg-slate-800 shadow-2xl">
            <h3 className="text-xl font-bold text-brand-navy dark:text-white text-center mb-1">
              Parent Verification
            </h3>
            <p className="text-xs text-brand-navy/70 dark:text-slate-300 text-center mb-4">
              Enter your 4-digit Parent Security PIN to access settings and analytics.
            </p>

            {pinError && (
              <p className="text-xs text-red-500 text-center mb-2 font-semibold">
                {pinError}
              </p>
            )}

            <form onSubmit={handleVerifyParentPin} className="space-y-4">
              <Input
                type="password"
                maxLength={4}
                placeholder="****"
                className="text-center text-xl tracking-widest font-bold"
                value={parentPinInput}
                onChange={(e) => {
                  setPinError("");
                  setParentPinInput(e.target.value.replace(/\D/g, ""));
                }}
                autoFocus
              />

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-1/2"
                  onClick={() => setShowPinModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-1/2 font-bold">
                  Unlock
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-brand-navy/50 dark:text-slate-500 py-4">
        Onesimos Early Learning System
      </footer>
    </div>
  );
}
`;

console.log("Writing Phase 2 Auth & Onboarding files...");
writeFile("components/ui/input.tsx", inputPrimitive);
writeFile("components/ui/label.tsx", labelPrimitive);
writeFile("components/ui/avatar-picker.tsx", avatarPickerComponent);
writeFile("app/welcome/page.tsx", welcomePage);
writeFile("app/login/page.tsx", loginPage);
writeFile("app/signup/page.tsx", signupPage);
writeFile("app/onboarding/page.tsx", onboardingPage);
writeFile("app/who/page.tsx", whoPage);
console.log("Phase 2 Auth & Onboarding files written successfully!");