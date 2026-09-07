"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AvatarPicker from "@/components/AvatarPicker";
import {
  createChild,
  defaultReadingLevelFromAge,
  hasAnyChildren,
  type Curriculum,
} from "@/lib/children";

const INTERESTS = [
  { id: "dinosaurs", label: "Dinosaurs", emoji: "🦕" },
  { id: "space", label: "Space", emoji: "🚀" },
  { id: "football", label: "Football", emoji: "⚽" },
  { id: "fantasy", label: "Fantasy", emoji: "🧙" },
  { id: "animals", label: "Animals", emoji: "🦁" },
  { id: "adventure", label: "Adventure", emoji: "🗺️" },
];

const CURRICULUMS: { id: Curriculum; label: string; hint: string }[] = [
  { id: "nigerian", label: "Nigerian", hint: "Local schools & WAEC path" },
  { id: "british", label: "British", hint: "UK spelling & curriculum" },
  { id: "american", label: "American", hint: "US spelling & curriculum" },
  { id: "ghanaian", label: "Ghanaian", hint: "Ghana school path" },
  { id: "international", label: "International", hint: "IB / mixed" },
  { id: "other", label: "Other", hint: "We will keep it flexible" },
];

const LEVEL_HINTS = [
  { level: 1, label: "Just starting", desc: "Letters & simple sounds" },
  { level: 3, label: "Early reader", desc: "Short words & lines" },
  { level: 5, label: "Building up", desc: "Simple stories" },
  { level: 7, label: "Confident", desc: "Longer paragraphs" },
  { level: 9, label: "Advanced", desc: "Chapter-style text" },
];

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [age, setAge] = useState(6);
  const [avatarId, setAvatarId] = useState("avatar-1");
  const [curriculum, setCurriculum] = useState<Curriculum>("nigerian");
  const [interests, setInterests] = useState<string[]>(["adventure"]);
  const [readingLevel, setReadingLevel] = useState(3);
  const [sessionMinutes, setSessionMinutes] = useState<20 | 30 | 45>(20);

  const totalSteps = 6;
  const progress = ((step + 1) / totalSteps) * 100;

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function checkExisting() {
      if (!user) return;
      const exists = await hasAnyChildren(user.id);
      // If they already have kids and somehow land here, still allow add-another flow
      // but default stay on onboarding for first child.
      if (exists && step === 0) {
        // keep welcome; parent can continue to add another child
      }
    }
    checkExisting();
  }, [user, step]);

  useEffect(() => {
    setReadingLevel(defaultReadingLevelFromAge(age));
  }, [age]);

  const canContinue = useMemo(() => {
    if (step === 1) return name.trim().length >= 2;
    if (step === 2) return !!avatarId;
    if (step === 3) return !!curriculum;
    if (step === 4) return interests.length > 0;
    if (step === 5) return readingLevel >= 1;
    return true;
  }, [step, name, avatarId, curriculum, interests, readingLevel]);

  const toggleInterest = (id: string) => {
    setInterests((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    setError("");

    const { error: createError } = await createChild(user.id, {
      name: name.trim(),
      age,
      avatar_id: avatarId,
      reading_level: readingLevel,
      curriculum,
      interests,
      session_minutes: sessionMinutes,
      cultural_context: "general",
    });

    setSaving(false);

    if (createError) {
      setError(createError.message || "Could not save child profile. Try again.");
      return;
    }

    router.push("/dashboard");
  };

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-bark-muted font-heading">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream flex flex-col">
      {/* Top bar */}
      <div className="w-full max-w-2xl mx-auto px-6 pt-6">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="font-logo text-2xl text-bark">
            Onesimos
          </Link>
          <span className="text-sm font-bold text-bark-muted">
            Step {step + 1} of {totalSteps}
          </span>
        </div>
        <div className="h-2 w-full bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-coral rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl card !p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-3 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* STEP 0 — Welcome */}
          {step === 0 && (
            <div className="text-center">
              <div className="text-5xl mb-4">✨</div>
              <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-bark mb-3">
                Let&apos;s meet your reader
              </h1>
              <p className="text-bark-muted text-lg mb-8 max-w-md mx-auto">
                We&apos;ll set up a personal profile so every story matches their
                level, interests, and pace. Takes about 2 minutes.
              </p>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-primary !px-10 !py-3.5"
              >
                Start setup
              </button>
            </div>
          )}

          {/* STEP 1 — Name + Age */}
          {step === 1 && (
            <div>
              <h1 className="font-heading text-3xl font-extrabold text-bark mb-2">
                Child&apos;s details
              </h1>
              <p className="text-bark-muted mb-8">
                Use the name they like to be called while reading.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-bark-light mb-1.5">
                    First name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ada"
                    className="w-full px-4 py-3 bg-cream border border-border rounded-2xl
                               focus:ring-2 focus:ring-coral/40 focus:border-coral focus:outline-none
                               text-bark placeholder:text-bark-muted/50"
                    maxLength={40}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-bark-light mb-3">
                    Age: <span className="text-coral">{age}</span>
                  </label>
                  <input
                    type="range"
                    min={3}
                    max={9}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full accent-coral"
                  />
                  <div className="flex justify-between text-xs text-bark-muted mt-1">
                    <span>3</span>
                    <span>9</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Avatar */}
          {step === 2 && (
            <div>
              <h1 className="font-heading text-3xl font-extrabold text-bark mb-2">
                Pick an avatar
              </h1>
              <p className="text-bark-muted mb-8">
                No labels — just a look they like. They can change it later.
              </p>
              <AvatarPicker value={avatarId} onChange={setAvatarId} />
            </div>
          )}

          {/* STEP 3 — Curriculum */}
          {step === 3 && (
            <div>
              <h1 className="font-heading text-3xl font-extrabold text-bark mb-2">
                School curriculum
              </h1>
              <p className="text-bark-muted mb-8">
                This helps spelling, vocabulary, and story style match their school.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CURRICULUMS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCurriculum(c.id)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all ${
                      curriculum === c.id
                        ? "border-coral bg-white shadow-soft"
                        : "border-border bg-cream hover:border-coral/40"
                    }`}
                  >
                    <div className="font-heading font-bold text-bark">{c.label}</div>
                    <div className="text-sm text-bark-muted mt-1">{c.hint}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 — Interests */}
          {step === 4 && (
            <div>
              <h1 className="font-heading text-3xl font-extrabold text-bark mb-2">
                What do they love?
              </h1>
              <p className="text-bark-muted mb-8">
                Pick up to 3. Stories will lean into these themes.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {INTERESTS.map((item) => {
                  const selected = interests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleInterest(item.id)}
                      className={`p-4 rounded-2xl border-2 text-center transition-all ${
                        selected
                          ? "border-coral bg-white shadow-soft"
                          : "border-border bg-cream hover:border-coral/40"
                      }`}
                    >
                      <div className="text-3xl mb-2">{item.emoji}</div>
                      <div className="font-heading font-bold text-bark text-sm">
                        {item.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5 — Level + session time */}
          {step === 5 && (
            <div>
              <h1 className="font-heading text-3xl font-extrabold text-bark mb-2">
                Reading level & time
              </h1>
              <p className="text-bark-muted mb-6">
                Start honest — Onesimos will adjust automatically as they read.
              </p>

              <div className="mb-8">
                <label className="block text-sm font-bold text-bark-light mb-3">
                  Starting level: <span className="text-coral">{readingLevel}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={readingLevel}
                  onChange={(e) => setReadingLevel(Number(e.target.value))}
                  className="w-full accent-coral"
                />
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {LEVEL_HINTS.map((h) => (
                    <button
                      key={h.level}
                      type="button"
                      onClick={() => setReadingLevel(h.level)}
                      className={`text-left p-3 rounded-xl border ${
                        readingLevel === h.level
                          ? "border-coral bg-white"
                          : "border-border bg-cream"
                      }`}
                    >
                      <div className="text-sm font-bold text-bark">{h.label}</div>
                      <div className="text-xs text-bark-muted">{h.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-bark-light mb-3">
                  Daily reading time
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {([20, 30, 45] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSessionMinutes(m)}
                      className={`py-3 rounded-2xl border-2 font-heading font-bold ${
                        sessionMinutes === m
                          ? "border-coral bg-white text-bark shadow-soft"
                          : "border-border bg-cream text-bark-muted"
                      }`}
                    >
                      {m} min
                    </button>
                  ))}
                </div>
                <p className="text-xs text-bark-muted mt-3">
                  Healthy default is 20 minutes. You can change this later.
                </p>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          {step > 0 && (
            <div className="mt-10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="btn-secondary !px-6 !py-2.5 !text-sm"
                disabled={saving}
              >
                Back
              </button>

              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canContinue}
                  className="btn-primary !px-8 !py-2.5 !text-sm disabled:opacity-50"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={!canContinue || saving}
                  className="btn-primary !px-8 !py-2.5 !text-sm disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Finish setup"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}