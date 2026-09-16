/**
 * @file app/parent/page.tsx
 * @description Parent Dashboard — multi-child summary cards with academic snapshots,
 *              live stumbled vocabulary preview, Paystack subscription status,
 *              and clean metric displays without fake fallbacks or dashes.
 *
 * @fonts Achiko (headings) + Switzer (body/UI/stat numbers)
 * @dependencies
 * - @/context/AuthContext
 * - @/lib/children, @/lib/avatars, @/lib/stumbledWords
 * - @/lib/sessionInsights, @/lib/parentGate, @/lib/sessionBudget
 * - @/lib/payments
 */

"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/components/LogoutButton";
import {
  getChildrenForParent,
  deleteChild,
  getAgeBandConfig,
  type ChildProfile,
  type AgeBand,
} from "@/lib/children";
import { getAvatarById } from "@/lib/avatars";
import { getRecentStumbledWords } from "@/lib/stumbledWords";
import {
  getChildSessions,
  computeReportCardStats,
  type DetailedReportCardStats,
} from "@/lib/sessionInsights";
import { getParentPinStatus, setParentPin } from "@/lib/parentGate";
import { resetChildStoryQuota } from "@/lib/sessionBudget";
import {
  getParentSubscription,
  type ParentSubscriptionRow,
} from "@/lib/payments";

// ─── Section 1: Helpers & Badges ───

function renderStatusBadge(status: DetailedReportCardStats["progressStatus"]) {
  switch (status) {
    case "Accelerating":
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-200 font-switzer">
          Accelerating
        </span>
      );
    case "Needs Practice":
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider border border-amber-200 font-switzer">
          Needs Practice
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black uppercase tracking-wider border border-sky-200 font-switzer">
          On Track
        </span>
      );
  }
}

const AGE_BAND_STYLES: Record<
  AgeBand,
  { bg: string; border: string; text: string; icon: string }
> = {
  "pre-reader": {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    icon: "🌱",
  },
  emerging: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-700",
    icon: "📖",
  },
  confident: {
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    icon: "🚀",
  },
};

function renderAgeBandBadge(age: number) {
  const config = getAgeBandConfig(age);
  const style = AGE_BAND_STYLES[config.band];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border font-switzer ${style.bg} ${style.border} ${style.text}`}
    >
      <span className="text-xs">{style.icon}</span>
      {config.label}
    </span>
  );
}

// ─── Section 2: Dashboard Content Component ───

function ParentDashboardContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [subscription, setSubscription] = useState<ParentSubscriptionRow | null>(null);
  const [practiceByChild, setPracticeByChild] = useState<
    Record<string, { word: string; count: number }[]>
  >({});
  const [reportStatsByChild, setReportStatsByChild] = useState<
    Record<string, DetailedReportCardStats>
  >({});
  const [fetching, setFetching] = useState(true);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);

  const [hasParentPin, setHasParentPin] = useState<boolean | null>(null);
  const [showParentPinModal, setShowParentPinModal] = useState(false);
  const [newParentPin, setNewParentPin] = useState("");
  const [confirmParentPin, setConfirmParentPin] = useState("");
  const [parentPinSaving, setParentPinSaving] = useState(false);
  const [parentPinError, setParentPinError] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const paymentSuccess = searchParams.get("payment") === "success";

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/parent/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      setFetching(true);

      const [pinStatus, subStatus, childrenRes] = await Promise.all([
        getParentPinStatus(user.id),
        getParentSubscription(user.id),
        getChildrenForParent(user.id),
      ]);

      setHasParentPin(pinStatus.hasPin);
      setSubscription(subStatus);
      setChildren(childrenRes.data);

      const practiceMap: Record<string, { word: string; count: number }[]> = {};
      const statsMap: Record<string, DetailedReportCardStats> = {};

      await Promise.all(
        childrenRes.data.map(async (child) => {
          const [{ data: words }, { data: sessions }] = await Promise.all([
            getRecentStumbledWords(child.id, 6),
            getChildSessions(child.id, 60),
          ]);
          practiceMap[child.id] = words;
          statsMap[child.id] = computeReportCardStats(child, sessions, words.length);
        })
      );

      setPracticeByChild(practiceMap);
      setReportStatsByChild(statsMap);
      setFetching(false);

      if (childrenRes.data.length === 0) {
        router.replace("/onboarding");
      }
    }

    void loadDashboardData();
  }, [user, router]);

  const handleSaveParentPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setParentPinError("");
    if (!user) return;

    if (newParentPin.length !== 4) {
      setParentPinError("Parent PIN must be exactly 4 digits.");
      return;
    }
    if (newParentPin !== confirmParentPin) {
      setParentPinError("Codes do not match. Try again.");
      return;
    }

    setParentPinSaving(true);
    const result = await setParentPin(user.id, newParentPin);
    setParentPinSaving(false);

    if (result.error) {
      setParentPinError(result.error.message || "Failed to set Parent PIN.");
      return;
    }

    setHasParentPin(true);
    setShowParentPinModal(false);
    setNewParentPin("");
    setConfirmParentPin("");
    setMessage("Parent unlock PIN saved successfully!");
  };

  const handleDeleteChild = async (child: ChildProfile) => {
    if (!user) return;
    setDeletingId(child.id);
    setError("");

    const { error: deleteError } = await deleteChild(child.id, user.id);
    setDeletingId(null);
    setConfirmId(null);

    if (deleteError) {
      setError(deleteError.message || "Could not remove profile. Try again.");
      return;
    }

    const next = children.filter((c) => c.id !== child.id);
    setChildren(next);
    if (next.length === 0) router.replace("/onboarding");
  };

  const handleResetTestData = async (child: ChildProfile) => {
    setResettingId(child.id);
    setError("");
    setMessage("");

    const { error: resetError } = await resetChildStoryQuota(child.id);
    setResettingId(null);

    if (resetError) {
      setError(`Failed to reset test data for ${child.name}.`);
      return;
    }

    const emptyStats: DetailedReportCardStats = {
      totalSessions: 0,
      totalPages: 0,
      totalMinutes: 0,
      storiesFinished: 0,
      streak: 0,
      wordsPerMinute: 0,
      accuracyPercentage: 0,
      comprehensionPercentage: 0,
      readingAgeEstimate: "5 to 6 years",
      progressStatus: "On Track",
    };

    setReportStatsByChild((prev) => ({ ...prev, [child.id]: emptyStats }));
    setPracticeByChild((prev) => ({ ...prev, [child.id]: [] }));
    setMessage(`Test data reset for ${child.name}.`);
  };

  if (loading || fetching || !user) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-switzer">
        <p className="text-gray-500 font-bold animate-pulse font-switzer">Loading Parent Dashboard...</p>
      </main>
    );
  }

  const isPaidSubscriber =
    subscription?.status === "active" &&
    (subscription.plan === "premium_monthly" || subscription.plan === "premium_annual");

  return (
    <main className="min-h-screen bg-[#FDFBF7] font-switzer pb-16">
      {/* Top Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
          <Link href="/parent" className="font-achiko text-2xl text-gray-900 tracking-tight">
            Onesimos
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/parent/pricing"
              className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all font-switzer ${
                isPaidSubscriber
                  ? "bg-amber-100/80 text-amber-900 border-amber-300 hover:bg-amber-200"
                  : "bg-amber-500 text-white border-amber-600 hover:bg-amber-600 shadow-2xs"
              }`}
            >
              {isPaidSubscriber ? "⭐ Premium Active" : "✨ Upgrade to Unlimited"}
            </Link>

            <Link href="/who" className="text-xs sm:text-sm font-bold text-coral hover:underline font-switzer">
              Who&apos;s reading?
            </Link>
            <span className="hidden md:inline text-xs text-gray-500 font-medium font-switzer">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Payment Celebration Banner */}
        {paymentSuccess && (
          <div className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md flex items-center justify-between gap-4 font-switzer">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <p className="font-black text-sm">Welcome to Onesimos Premium!</p>
                <p className="text-xs text-amber-100">
                  Unlimited stories and AI Living Chapters are now unlocked for all your children.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.replace("/parent")}
              className="px-3.5 py-1.5 rounded-xl bg-white text-amber-900 text-xs font-bold hover:bg-amber-50 shrink-0 font-switzer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Set Parent PIN Notice */}
        {hasParentPin === false && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between flex-wrap gap-4 font-switzer">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="text-sm font-bold text-amber-900">Set a 4-Digit Parent Code</p>
                <p className="text-xs text-amber-700">
                  Keep parent settings out of kids&apos; reach.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowParentPinModal(true)}
              className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 font-switzer"
            >
              Set Parent PIN
            </button>
          </div>
        )}

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-achiko text-3xl md:text-4xl text-gray-900">
              Family overview
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-switzer">
              Snapshot per child : open a full report for growth story, history, and settings.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowParentPinModal(true)}
              className="px-4 py-2.5 rounded-full border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm font-switzer"
            >
              {hasParentPin ? "Change Parent PIN" : "Set Parent PIN"}
            </button>
            <Link
              href="/onboarding"
              className="px-5 py-2.5 bg-coral text-white rounded-full text-xs font-bold hover:bg-coral/90 shadow-sm font-switzer"
            >
              + Add child
            </Link>
          </div>
        </div>

        {message && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl text-xs font-bold font-switzer">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-2xl text-xs font-bold font-switzer">
            {error}
          </div>
        )}

        {/* Children Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => {
            const avatar = getAvatarById(child.avatar_id);
            const isConfirming = confirmId === child.id;
            const isDeleting = deletingId === child.id;
            const isResetting = resettingId === child.id;
            const practice = practiceByChild[child.id] || [];
            const reportStats = reportStatsByChild[child.id] || {
              totalSessions: 0,
              totalPages: 0,
              totalMinutes: 0,
              storiesFinished: 0,
              streak: 0,
              wordsPerMinute: 0,
              accuracyPercentage: 0,
              comprehensionPercentage: 0,
              readingAgeEstimate: "5 to 6 years",
              progressStatus: "On Track" as const,
            };
            const bandConfig = getAgeBandConfig(child.age);
            const isPreReader = bandConfig.band === "pre-reader";

            return (
              <div
                key={child.id}
                className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col font-switzer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-200 shrink-0"
                    style={{ backgroundColor: `${avatar.color}33` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatar.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-lg font-black text-gray-900 truncate font-achiko">
                        {child.name}
                      </h2>
                      {renderStatusBadge(reportStats.progressStatus)}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 font-switzer">
                      <p className="text-xs text-gray-500 font-medium">
                        Age {child.age} · Level {child.reading_level}
                      </p>
                      {renderAgeBandBadge(child.age)}
                    </div>
                    <p className="text-[11px] font-bold text-gray-600 mt-0.5 font-switzer">
                      Est. reading age:{" "}
                      <span className="text-coral font-bold">{reportStats.readingAgeEstimate}</span>
                    </p>
                  </div>
                </div>

                {/* Stat Box Cards */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div
                    className={`rounded-2xl px-2 py-2 text-center ${
                      isPreReader
                        ? "bg-gray-50 border border-gray-100"
                        : "bg-amber-50/80 border border-amber-100"
                    }`}
                  >
                    <p
                      className={`font-switzer text-2xl font-black leading-none ${
                        isPreReader ? "text-gray-400" : "text-amber-950"
                      }`}
                    >
                      {isPreReader || reportStats.wordsPerMinute === 0
                        ? "n/a"
                        : reportStats.wordsPerMinute}
                    </p>
                    <p
                      className={`text-[9px] font-bold uppercase mt-1 ${
                        isPreReader ? "text-gray-400" : "text-amber-800"
                      }`}
                    >
                      WPM
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50/80 border border-emerald-100 px-2 py-2 text-center">
                    <p className="font-switzer text-2xl font-black leading-none text-emerald-950">
                      {reportStats.accuracyPercentage}%
                    </p>
                    <p className="text-[9px] font-bold text-emerald-800 uppercase mt-1">Accuracy</p>
                  </div>
                  <div className="rounded-2xl bg-sky-50/80 border border-sky-100 px-2 py-2 text-center">
                    <p className="font-switzer text-2xl font-black leading-none text-sky-950">
                      {reportStats.comprehensionPercentage}%
                    </p>
                    <p className="text-[9px] font-bold text-sky-800 uppercase mt-1">Comprehend</p>
                  </div>
                </div>

                {/* Stumbled Words Preview Box */}
                <div className="mb-4 min-h-[3rem] font-switzer">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Tricky Words Logged:
                  </p>
                  {practice.length === 0 ? (
                    <p className="text-[11px] text-gray-400 font-medium">
                      Practice words appear after read-aloud sessions.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {practice.slice(0, 5).map((item) => (
                        <span
                          key={item.word}
                          className="px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-950 text-[11px] font-bold border border-amber-200"
                        >
                          {item.word}
                        </span>
                      ))}
                      {practice.length > 5 && (
                        <span className="text-[11px] font-bold text-gray-400">
                          +{practice.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-auto space-y-2 pt-2 border-t border-gray-100 font-switzer">
                  {!isConfirming ? (
                    <>
                      <Link
                        href={`/parent/child/${child.id}`}
                        className="block w-full py-2.5 rounded-2xl bg-gray-900 text-white text-xs font-black hover:bg-black text-center shadow-sm font-switzer"
                      >
                        View full report →
                      </Link>
                      <Link
                        href={`/kid/${child.id}`}
                        className="block w-full py-2 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 text-center font-switzer"
                      >
                        Open kid view
                      </Link>
                      <div className="flex justify-between items-center px-1 font-switzer">
                        <button
                          type="button"
                          disabled={isResetting}
                          onClick={() => void handleResetTestData(child)}
                          className="text-[11px] font-bold text-gray-400 hover:text-amber-700 disabled:opacity-50 font-switzer"
                        >
                          {isResetting ? "Resetting..." : "Reset test quota"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmId(child.id)}
                          className="text-[11px] font-bold text-gray-400 hover:text-red-500 font-switzer"
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-3 font-switzer">
                      <p className="text-xs text-gray-800 mb-3 text-center font-switzer">
                        Remove <span className="font-bold">{child.name}</span>?
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirmId(null)}
                          disabled={isDeleting}
                          className="flex-1 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold font-switzer"
                        >
                          Keep
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteChild(child)}
                          disabled={isDeleting}
                          className="flex-1 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold disabled:opacity-50 font-switzer"
                        >
                          {isDeleting ? "..." : "Remove"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showParentPinModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 font-switzer">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-gray-100 font-switzer">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-achiko text-xl text-gray-900 mb-1">
              {hasParentPin ? "Change Parent PIN" : "Set Parent PIN"}
            </h3>
            <p className="text-gray-500 text-xs mb-6 font-switzer">
              Secret 4-digit code for parent access.
            </p>
            <form onSubmit={handleSaveParentPin} className="space-y-4 font-switzer">
              <div>
                <label className="block text-xs font-bold text-gray-700 text-left mb-1 font-switzer">
                  New code
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={newParentPin}
                  onChange={(e) =>
                    setNewParentPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  placeholder="••••"
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-gray-50 text-center text-2xl tracking-[0.4em] font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400 font-switzer"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 text-left mb-1 font-switzer">
                  Confirm
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={confirmParentPin}
                  onChange={(e) =>
                    setConfirmParentPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  placeholder="••••"
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-gray-50 text-center text-2xl tracking-[0.4em] font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400 font-switzer"
                />
              </div>
              {parentPinError && (
                <p className="text-xs font-bold text-red-600 bg-red-50 py-2 px-3 rounded-xl font-switzer">
                  {parentPinError}
                </p>
              )}
              <div className="flex gap-2 pt-2 font-switzer">
                <button
                  type="button"
                  onClick={() => {
                    setShowParentPinModal(false);
                    setParentPinError("");
                    setNewParentPin("");
                    setConfirmParentPin("");
                  }}
                  className="flex-1 py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 font-switzer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    parentPinSaving ||
                    newParentPin.length !== 4 ||
                    confirmParentPin.length !== 4
                  }
                  className="flex-1 py-2.5 rounded-2xl bg-[#FCE588] text-black text-xs font-bold disabled:opacity-50 font-switzer"
                >
                  {parentPinSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ParentDashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-switzer">
          <p className="text-gray-500 font-bold animate-pulse font-switzer">Loading Parent Dashboard...</p>
        </div>
      }
    >
      <ParentDashboardContent />
    </Suspense>
  );
}