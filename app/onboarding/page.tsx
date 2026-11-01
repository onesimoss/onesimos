"use client";

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
      router.push("/who");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-darkBg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
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
