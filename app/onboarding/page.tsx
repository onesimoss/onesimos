/**
 * @file app/onboarding/page.tsx
 * @description Parent onboarding wizard — 6-step child profile creation.
 *              Enforces subscription plan child profile limits (1 for Single, 4 for Family, 
 *              10 for Daycare, 30 for Classroom, Unlimited for Admin).
 *
 * @steps
 *  0 — Welcome
 *  1 — Name + Age (with live age-band badge)
 *  2 — Avatar
 *  3 — Curriculum
 *  4 — Interests
 *  5 — Reading level + session time (with age-band context)
 *
 * @module app/onboarding/page
 * @fonts Logo (wordmark) + Achiko (headings) + Switzer (body/UI)
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AvatarPicker from "@/components/AvatarPicker";
import {
  createChild,
  getChildrenForParent,
  defaultReadingLevelFromAge,
  getAgeBandConfig,
  type Curriculum,
  type AgeBand,
} from "@/lib/children";
import { getParentSubscription } from "@/lib/payments";

// ─── Section 1: Constants & Limit Rules ───

const ADMIN_EMAILS = new Set([
  "crux@onesimos.app",
  "examplemirrorltd@gmail.com",
  "baiceconsulting@gmail.com",
]);

function getMaxChildrenAllowed(plan?: string | null, email?: string | null): number {
  if (email && ADMIN_EMAILS.has(email.toLowerCase())) {
    return 999;
  }
  if (!plan) return 1;
  if (plan.includes("family")) return 4;
  if (plan.includes("daycare")) return 10;
  if (plan.includes("classroom")) return 30;
  return 1;
}

const INTERESTS = [
  { id: "dinosaurs", label: "Dinosaurs", emoji: "🦕" },
  { id: "space", label: "Space", emoji: "🚀" },
  { id: "football", label: "Football", emoji: "⚽" },
  { id: "fantasy", label: "Fantasy", emoji: "🧙" },
  { id: "animals", label: "Animals", emoji: "🦁" },
  { id: "adventure", label: "Adventure", emoji: "🗺️" },
];

const CURRICULUMS: { id: Curriculum; label: string; hint: string }[] = [
  {
    id: "british",
    label: "British / Commonwealth",
    hint: "UK spelling (colour, favourite), Cambridge & WAEC/NERDC path",
  },
  {
    id: "american",
    label: "American English",
    hint: "US spelling (color, favorite) & US style curriculum",
  },
  {
    id: "international",
    label: "International / IB",
    hint: "Dual-curriculum or International Baccalaureate schools",
  },
  {
    id: "other",
    label: "Other / Flexible",
    hint: "General English reading tailored to their pace",
  },
];

const LEVEL_HINTS = [
  { level: 1, label: "Just starting", desc: "Letters & simple sounds" },
  { level: 3, label: "Early reader", desc: "Short words & lines" },
  { level: 5, label: "Building up", desc: "Simple stories" },
  { level: 7, label: "Confident", desc: "Longer paragraphs" },
  { level: 9, label: "Advanced", desc: "Chapter-style text" },
];

const AGE_BAND_STYLES: Record<
  AgeBand,
  { bg: string; border: string; text: string; icon: string }
> = {
  "pre-reader": {
    bg: "bg-emerald-50",
    border: "border-emerald-300",
    text: "text-emerald-800",
    icon: "🌱",
  },
  emerging: {
    bg: "bg-sky-50",
    border: "border-sky-300",
    text: "text-sky-800",
    icon: "📖",
  },
  confident: {
    bg: "bg-violet-50",
    border: "border-violet-300",
    text: "text-violet-800",
    icon: "🚀",
  },
};

// ─── Section 2: Main Component ───

export default function OnboardingPage(): JSX.Element {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Child Profile Form State
  const [name, setName] = useState("");
  const [age, setAge] = useState(6);
  const [avatarId, setAvatarId] = useState("avatar-1");
  const [curriculum, setCurriculum] = useState<Curriculum>("british");
  const [interests, setInterests] = useState<string[]>(["adventure"]);
  const [readingLevel, setReadingLevel] = useState(3);
  const [sessionMinutes, setSessionMinutes] = useState<20 | 30 | 45>(20);

  // Plan Limit Check States
  const [existingCount, setExistingCount] = useState<number>(0);
  const [maxAllowed, setMaxAllowed] = useState<number>(1);
  const [limitReached, setLimitReached] = useState<boolean>(false);

  const totalSteps = 6;
  const progress = ((step + 1) / totalSteps) * 100;

  const ageBandConfig = useMemo(() => getAgeBandConfig(age), [age]);
  const bandStyle = AGE_BAND_STYLES[ageBandConfig.band];

  // Auth Guard & Limit Fetching
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }

    async function checkLimits(): Promise<void> {
      if (!user) return;
      const [sub, childrenRes] = await Promise.all([
        getParentSubscription(user.id),
        getChildrenForParent(user.id),
      ]);

      const count = childrenRes.data.length;
      const allowed = getMaxChildrenAllowed(sub?.plan, user.email);

      setExistingCount(count);
      setMaxAllowed(allowed);

      if (count >= allowed) {
        setLimitReached(true);
      }
    }

    void checkLimits();
  }, [user, loading, router]);

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

  const toggleInterest = (id: string): void => {
    setInterests((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleFinish = async (): Promise<void> => {
    if (!user) return;

    if (existingCount >= maxAllowed) {
      setLimitReached(true);
      return;
    }

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

    router.push("/parent");
  };

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-switzer">
        <p className="text-gray-500 font-bold animate-pulse font-switzer">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex flex-col font-switzer">
      
      {/* Progress Bar Header */}
      <div className="w-full max-w-2xl mx-auto px-6 pt-6 font-switzer">
        <div className="flex items-center justify-between mb-4">
          <Link href="/parent" className="font-logo text-2xl text-amber-900">
            Onesimos
          </Link>
          <span className="text-xs font-bold text-gray-500 font-switzer">
            Step {step + 1} of {totalSteps}
          </span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content Card */}
      <div className="flex-1 flex items-center justify-center p-6 font-switzer">
        <div className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 p-8 shadow-sm font-switzer">
          
          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl text-xs font-bold text-center font-switzer">
              {error}
            </div>
          )}

          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center font-switzer">
              <div className="text-5xl mb-4">✨</div>
              <h1 className="font-achiko text-3xl md:text-4xl text-amber-950 mb-3">
                Let&apos;s meet your reader
              </h1>
              <p className="text-gray-600 text-sm mb-8 max-w-md mx-auto leading-relaxed font-switzer">
                We&apos;ll set up a personal profile so every story matches their
                level, interests, and pace. Takes under 2 minutes.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (limitReached) {
                    return;
                  }
                  setStep(1);
                }}
                className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-xs active:scale-95 transition-all font-switzer"
              >
                Start Setup →
              </button>
            </div>
          )}

          {/* Step 1: Name + Age */}
          {step === 1 && (
            <div className="font-switzer">
              <h1 className="font-achiko text-3xl text-amber-950 mb-2">
                Child&apos;s details
              </h1>
              <p className="text-xs text-gray-500 mb-8 font-switzer">
                Use the name they like to be called while reading.
              </p>

              <div className="space-y-6 font-switzer">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 font-switzer">
                    First name or nickname
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ada"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-amber-400 focus:outline-none text-xs font-switzer"
                    maxLength={40}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-3 font-switzer">
                    Age: <span className="text-amber-800 font-extrabold">{age}</span>
                  </label>
                  <input
                    type="range"
                    min={3}
                    max={9}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 mt-1 font-switzer">
                    <span>3 yrs</span>
                    <span>9 yrs</span>
                  </div>

                  <div className={`mt-4 p-4 rounded-2xl border-2 ${bandStyle.bg} ${bandStyle.border} transition-all duration-300 font-switzer`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{bandStyle.icon}</span>
                      <span className={`font-achiko font-bold text-sm ${bandStyle.text}`}>
                        {ageBandConfig.kidLabel}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${bandStyle.text} opacity-90 font-switzer`}>
                      {ageBandConfig.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Avatar */}
          {step === 2 && (
            <div className="font-switzer">
              <h1 className="font-achiko text-3xl text-amber-950 mb-2">
                Pick an avatar
              </h1>
              <p className="text-xs text-gray-500 mb-8 font-switzer">
                Choose a fun avatar for their dashboard.
              </p>
              <AvatarPicker value={avatarId} onChange={setAvatarId} />
            </div>
          )}

          {/* Step 3: Curriculum */}
          {step === 3 && (
            <div className="font-switzer">
              <h1 className="font-achiko text-3xl text-amber-950 mb-2">
                School curriculum style
              </h1>
              <p className="text-xs text-gray-500 mb-8 font-switzer">
                Helps spelling and vocabulary match what they learn in school.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-switzer">
                {CURRICULUMS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCurriculum(c.id)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all font-switzer ${
                      curriculum === c.id
                        ? "border-amber-400 bg-amber-50/50 shadow-xs"
                        : "border-gray-200 bg-white hover:border-amber-200"
                    }`}
                  >
                    <div className="font-bold text-xs text-gray-900 font-switzer">{c.label}</div>
                    <div className="text-[11px] text-gray-500 mt-1 leading-relaxed font-switzer">
                      {c.hint}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Interests */}
          {step === 4 && (
            <div className="font-switzer">
              <h1 className="font-achiko text-3xl text-amber-950 mb-2">
                What do they love?
              </h1>
              <p className="text-xs text-gray-500 mb-8 font-switzer">
                Pick up to 3. Personal stories will lean into these themes.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-switzer">
                {INTERESTS.map((item) => {
                  const selected = interests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleInterest(item.id)}
                      className={`p-4 rounded-2xl border-2 text-center transition-all font-switzer ${
                        selected
                          ? "border-amber-400 bg-amber-50/50 shadow-xs"
                          : "border-gray-200 bg-white hover:border-amber-200"
                      }`}
                    >
                      <div className="text-3xl mb-2">{item.emoji}</div>
                      <div className="font-bold text-xs text-gray-900 font-switzer">
                        {item.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Reading Level + Time */}
          {step === 5 && (
            <div className="font-switzer">
              <h1 className="font-achiko text-3xl text-amber-950 mb-2">
                Reading level & time
              </h1>
              <p className="text-xs text-gray-500 mb-6 font-switzer">
                Onesimos adjusts automatically as they read out loud.
              </p>

              <div className={`mb-6 p-3 rounded-xl border ${bandStyle.bg} ${bandStyle.border} flex items-center gap-2 font-switzer`}>
                <span className="text-lg">{bandStyle.icon}</span>
                <span className={`text-xs font-bold ${bandStyle.text}`}>
                  {ageBandConfig.label} mode
                </span>
                <span className={`text-[11px] ${bandStyle.text} opacity-80 font-switzer`}>
                  : {ageBandConfig.trackWpm ? "Reading speed will be calculated" : "Focus on fun & sounds"}
                </span>
              </div>

              <div className="mb-8 font-switzer">
                <label className="block text-xs font-bold text-gray-700 mb-3 font-switzer">
                  Starting level: <span className="text-amber-800 font-black">{readingLevel}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={readingLevel}
                  onChange={(e) => setReadingLevel(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 font-switzer">
                  {LEVEL_HINTS.map((h) => (
                    <button
                      key={h.level}
                      type="button"
                      onClick={() => setReadingLevel(h.level)}
                      className={`text-left p-3 rounded-xl border text-xs font-switzer ${
                        readingLevel === h.level
                          ? "border-amber-400 bg-amber-50/60 font-bold"
                          : "border-gray-200 bg-white text-gray-600"
                      }`}
                    >
                      <div className="font-bold text-gray-900 font-switzer">{h.label}</div>
                      <div className="text-[10px] text-gray-500 font-switzer">{h.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="font-switzer">
                <p className="text-xs font-bold text-gray-700 mb-3 font-switzer">
                  Daily target reading time
                </p>
                <div className="grid grid-cols-3 gap-3 font-switzer">
                  {([20, 30, 45] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSessionMinutes(m)}
                      className={`py-3 rounded-2xl border-2 font-bold text-xs font-switzer ${
                        sessionMinutes === m
                          ? "border-amber-400 bg-amber-50/60 text-amber-950 shadow-2xs"
                          : "border-gray-200 bg-white text-gray-600"
                      }`}
                    >
                      {m} min
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Bar */}
          {step > 0 && (
            <div className="mt-10 flex items-center justify-between gap-3 font-switzer">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="px-6 py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 font-switzer"
                disabled={saving}
              >
                Back
              </button>

              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canContinue}
                  className="px-8 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-2xs disabled:opacity-50 font-switzer"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void handleFinish()}
                  disabled={!canContinue || saving}
                  className="px-8 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-2xs disabled:opacity-50 font-switzer"
                >
                  {saving ? "Saving Profile..." : "Finish Setup 🎉"}
                </button>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Plan Child Limit Exceeded Modal */}
      {limitReached && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 font-switzer">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-gray-100 font-switzer">
            <div className="text-4xl mb-3">👨‍👩‍👧</div>
            <h3 className="font-achiko text-xl text-amber-900 mb-2">
              Reader Profile Limit Reached
            </h3>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed font-switzer">
              Your current plan allows <strong>{maxAllowed} child profile{maxAllowed > 1 ? "s" : ""}</strong> (you already have {existingCount}). Upgrade to the Family Plan to add up to 4 children!
            </p>
            <div className="flex flex-col gap-2 font-switzer">
              <Link
                href="/parent/pricing"
                className="w-full py-3 rounded-2xl bg-amber-500 text-white font-bold text-xs shadow-sm hover:bg-amber-600 font-switzer active:scale-95 transition-all text-center"
              >
                Upgrade to Family Plan ✨
              </Link>
              <Link
                href="/parent"
                className="w-full py-2.5 rounded-2xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 font-switzer text-center"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}