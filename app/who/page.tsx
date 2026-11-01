"use client";

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

      <main className="max-w-3xl w-full mx-auto my-auto text-center py-8">
        <h1 className="text-3xl sm:text-4xl font-black text-brand-navy dark:text-white tracking-tight mb-2">
          Who is learning today?
        </h1>
        <p className="text-sm text-brand-navy/70 dark:text-slate-300 mb-8">
          Pick your profile to jump into personalized chapters!
        </p>

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

      <footer className="text-center text-xs text-brand-navy/50 dark:text-slate-500 py-4">
        Onesimos Early Learning System
      </footer>
    </div>
  );
}
