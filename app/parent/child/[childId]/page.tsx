/**
 * @file app/parent/child/[childId]/page.tsx
 * @description Dedicated Academic Progress Report Page for a single child profile.
 * Provides plain-language "Before & After" growth narratives, fluency (WPM),
 * accuracy, comprehension scores, vocabulary focus, and session history.
 *
 * @dependencies
 * - @/context/AuthContext (parent authentication)
 * - @/lib/children (child profiles API, PINs)
 * - @/lib/avatars (avatar resolution)
 * - @/lib/stumbledWords (vocabulary practice list)
 * - @/lib/sessionInsights (sessions history & report card stats engine)
 * - @/lib/sessionBudget (reset test quota helper)
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { getAvatarById } from "@/lib/avatars";
import type { ChildProfile } from "@/lib/children";
import { setChildPin, deleteChild } from "@/lib/children";
import { getRecentStumbledWords } from "@/lib/stumbledWords";
import {
  getChildSessions,
  computeReportCardStats,
  type ReadingSessionRow,
  type DetailedReportCardStats,
} from "@/lib/sessionInsights";
import {
  updateChildReminder,
  requestNotificationPermission,
} from "@/lib/reminders";
import { resetChildStoryQuota } from "@/lib/sessionBudget";

// ─── Section 1: Helper Formatters & Narrative Engine ───

function curriculumLabel(value: string): string {
  switch (value) {
    case "british":
      return "British / Commonwealth";
    case "american":
      return "American English";
    case "international":
      return "International / IB";
    case "nigerian":
    case "ghanaian":
      return "British / Commonwealth";
    default:
      return "Other / Flexible";
  }
}

/**
 * Generates a plain-language "Before & After" growth narrative for parents.
 */
function generateProgressNarrative(
  child: ChildProfile,
  stats: DetailedReportCardStats,
  sessions: ReadingSessionRow[],
  stumbledWords: { word: string; count: number }[]
): { before: string; current: string; recommendation: string } {
  if (sessions.length === 0) {
    return {
      before: `${child.name} is just beginning their reading journey on Onesimos.`,
      current: `Current baseline level is Level ${child.reading_level || 2}. No read-aloud sessions recorded yet.`,
      recommendation: `Start by picking a Level ${child.reading_level || 2} story together. Reading aloud for just 10 minutes a day builds confidence quickly!`,
    };
  }

  const oldestSession = sessions[sessions.length - 1];
  const totalStories = stats.storiesFinished;

  const beforeText = `When ${child.name} started, baseline reading focused on Level ${child.reading_level || 2} decoding skills across initial story sessions.`;

  const currentText = `${child.name} has completed ${totalStories} story ${
    totalStories === 1 ? "session" : "sessions"
  }, reading at an average speed of ${stats.wordsPerMinute} WPM with ${
    stats.accuracyPercentage
  }% pronunciation accuracy and a ${
    stats.comprehensionPercentage
  }% comprehension score.`;

  let recommendationText = `Keep up the momentum! Reading 3 times a week maintains steady fluency gains.`;
  if (stumbledWords.length > 0) {
    const topWords = stumbledWords.slice(0, 3).map((w) => `"${w.word}"`).join(", ");
    recommendationText = `Focus on practice vocabulary like ${topWords} during warm-ups before starting a new story.`;
  }

  return {
    before: beforeText,
    current: currentText,
    recommendation: recommendationText,
  };
}

// ─── Section 2: Component Implementation ───

export default function ChildReportPage() {
  const { childId } = useParams<{ childId: string }>();
  const { user, loading } = useAuth();
  const router = useRouter();

  // Data States
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [sessions, setSessions] = useState<ReadingSessionRow[]>([]);
  const [practiceWords, setPracticeWords] = useState<{ word: string; count: number }[]>([]);
  const [stats, setStats] = useState<DetailedReportCardStats | null>(null);
  const [fetching, setFetching] = useState(true);

  // Settings & Controls States
  const [pinEdit, setPinEdit] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [pinSaving, setPinSaving] = useState(false);
  const [reminderSaving, setReminderSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Feedback Messages
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Auth Protection
  useEffect(() => {
    if (!loading && !user) router.replace("/parent/login");
  }, [user, loading, router]);

  // Load Child Data & Analytics
  useEffect(() => {
    async function loadChildReport() {
      if (!user || !childId) return;
      setFetching(true);

      const { data, error: childError } = await supabase
        .from("children")
        .select("*")
        .eq("id", childId)
        .eq("parent_id", user.id)
        .single();

      if (childError || !data) {
        router.replace("/parent");
        return;
      }

      const profile = data as ChildProfile;
      setChild(profile);

      const [{ data: words }, { data: sessionData }] = await Promise.all([
        getRecentStumbledWords(profile.id, 12),
        getChildSessions(profile.id, 50),
      ]);

      setPracticeWords(words);
      setSessions(sessionData);
      setStats(computeReportCardStats(profile, sessionData, words.length));

      setFetching(false);
    }

    void loadChildReport();
  }, [user, childId, router]);

  // Event Handlers
  const handleSaveKidPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !child) return;

    setPinSaving(true);
    setError("");
    setMessage("");

    const { error: pinErr } = await setChildPin(child.id, user.id, pinValue);
    setPinSaving(false);

    if (pinErr) {
      setError(pinErr.message || "Could not save PIN.");
      return;
    }

    setChild((prev) => (prev ? { ...prev, kid_pin: pinValue.replace(/\D/g, "") } : prev));
    setPinEdit(false);
    setPinValue("");
    setMessage("Kid PIN saved successfully!");
  };

  const handleReminderToggle = async (enabled: boolean) => {
    if (!user || !child) return;
    setReminderSaving(true);
    setError("");
    setMessage("");

    if (enabled) {
      const permission = await requestNotificationPermission();
      if (permission === "denied") {
        setError("Notifications blocked in browser. Cues saved for in-app reminders.");
      }
    }

    const timeLocal = child.reminder_time_local || "16:30";
    const { error: remError } = await updateChildReminder(child.id, user.id, {
      enabled,
      timeLocal,
    });
    setReminderSaving(false);

    if (remError) {
      setError(remError.message || "Could not update reminder.");
      return;
    }

    setChild((prev) => (prev ? { ...prev, reminder_enabled: enabled } : prev));
    setMessage(enabled ? "Story Time Reminder turned on." : "Story Time Reminder turned off.");
  };

  const handleResetTestQuota = async () => {
    if (!child) return;
    setResetting(true);
    setError("");
    setMessage("");

    const { error: resetErr } = await resetChildStoryQuota(child.id);
    setResetting(false);

    if (resetErr) {
      setError("Failed to reset test quota.");
      return;
    }

    setSessions([]);
    setPracticeWords([]);
    setStats(computeReportCardStats(child, [], 0));
    setMessage(`Test story quota & reading history reset for ${child.name}.`);
  };

  const handleDeleteProfile = async () => {
    if (!user || !child) return;
    setDeleting(true);
    setError("");

    const { error: delErr } = await deleteChild(child.id, user.id);
    setDeleting(false);

    if (delErr) {
      setError(delErr.message || "Could not remove profile.");
      return;
    }

    router.replace("/parent");
  };

  if (loading || fetching || !child || !stats) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-sans">
        <p className="text-gray-500 font-bold animate-pulse">Loading Child Report...</p>
      </main>
    );
  }

  const avatar = getAvatarById(child.avatar_id);
  const narrative = generateProgressNarrative(child, stats, sessions, practiceWords);
  const hasKidPin = !!(child.kid_pin && String(child.kid_pin).length === 4);

  return (
    <main className="min-h-screen bg-[#FDFBF7] font-sans pb-16">
      
      {/* Top Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
          <Link
            href="/parent"
            className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1.5"
          >
            <span>←</span> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/kid/${child.id}`}
              className="px-4 py-2 rounded-full bg-coral text-white text-xs font-black hover:bg-coral/90 shadow-sm"
            >
              Open {child.name}&apos;s View
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Feedback Banners */}
        {message && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl text-xs font-bold">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-2xl text-xs font-bold">
            {error}
          </div>
        )}

        {/* ─── Child Profile Hero Header ─── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-left w-full md:w-auto">
            <div
              className="w-20 h-20 rounded-3xl overflow-hidden border border-gray-200 shrink-0 flex items-center justify-center shadow-xs"
              style={{ backgroundColor: `${avatar.color}33` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatar.imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                  {child.name}&apos;s Report
                </h1>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase">
                  {stats.progressStatus}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Age {child.age} · Reading Level {child.reading_level} · {curriculumLabel(child.curriculum)}
              </p>
              <p className="text-xs font-bold text-gray-700 mt-1">
                Estimated Reading Age: <span className="text-coral">{stats.readingAgeEstimate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={() => void handleResetTestQuota()}
              disabled={resetting}
              className="px-4 py-2.5 rounded-2xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              {resetting ? "Resetting..." : "🔄 Reset Test Quota"}
            </button>
          </div>
        </div>

        {/* ─── Before & After Progress Summary ─── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8">
          <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <span>📝</span> Teacher & Coach Progress Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-gray-100">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
                Baseline (When Started)
              </p>
              <p className="text-xs text-gray-700 font-medium leading-relaxed">
                {narrative.before}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800 mb-1">
                Current Performance
              </p>
              <p className="text-xs text-gray-800 font-medium leading-relaxed">
                {narrative.current}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60">
            <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
              <span>🎯</span> Next Step Recommendation
            </p>
            <p className="text-xs text-amber-950 font-medium">
              {narrative.recommendation}
            </p>
          </div>
        </div>

        {/* ─── Metric Tiles Grid ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm text-center">
            <p className="text-2xl font-black text-gray-900">{stats.wordsPerMinute}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
              Words Per Min (WPM)
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm text-center">
            <p className="text-2xl font-black text-emerald-600">{stats.accuracyPercentage}%</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
              Pronunciation Accuracy
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm text-center">
            <p className="text-2xl font-black text-sky-600">{stats.comprehensionPercentage}%</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
              Comprehension Score
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm text-center">
            <p className="text-2xl font-black text-coral">{stats.streak}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
              Day Reading Streak
            </p>
          </div>
        </div>

        {/* ─── Practice Vocabulary Section ─── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8">
          <h3 className="text-base font-black text-gray-900 mb-2 flex items-center gap-2">
            <span>🎒</span> Active Vocabulary Focus
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Words flagged during read-aloud sessions for extra practice and reinforcement.
          </p>

          {practiceWords.length === 0 ? (
            <p className="text-xs text-gray-400 font-medium py-3 text-center bg-gray-50 rounded-2xl">
              No practice words recorded yet. As {child.name} reads stories aloud, hard words will appear here automatically.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {practiceWords.map((item) => (
                <span
                  key={item.word}
                  className="px-3 py-1.5 rounded-xl bg-amber-100/70 text-gray-900 text-xs font-bold border border-amber-200/60"
                >
                  {item.word} {item.count > 1 ? `· ${item.count}x` : ""}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ─── Recent Sessions Log Table ─── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8">
          <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
            <span>📖</span> Reading Sessions History ({sessions.length})
          </h3>

          {sessions.length === 0 ? (
            <p className="text-xs text-gray-400 font-medium py-4 text-center bg-gray-50 rounded-2xl">
              No reading sessions recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase font-black tracking-wider text-[10px]">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Story ID</th>
                    <th className="pb-3 text-center">Pages Read</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sessions.slice(0, 10).map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50/50">
                      <td className="py-3 font-medium text-gray-600">
                        {new Date(session.ended_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 font-bold text-gray-900 capitalize">
                        {session.story_id || "Timed Reading"}
                      </td>
                      <td className="py-3 font-bold text-center text-gray-800">
                        {session.pages_read}
                      </td>
                      <td className="py-3 text-right">
                        {session.completed_story ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                            Completed ⭐
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-bold text-[10px]">
                            In Progress
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ─── Profile Settings & Danger Zone ─── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-black text-gray-900">Profile Settings</h3>

          {/* Kid PIN Configuration */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs font-bold text-gray-800">4-Digit Kid PIN</p>
                <p className="text-[11px] text-gray-400">
                  {hasKidPin ? "Kid PIN is enabled for profile switching." : "No Kid PIN set."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPinEdit(!pinEdit)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                {hasKidPin ? "Change PIN" : "Set PIN"}
              </button>
            </div>

            {pinEdit && (
              <form onSubmit={handleSaveKidPin} className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={pinValue}
                  onChange={(e) => setPinValue(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="••••"
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-center text-lg tracking-[0.3em] font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={pinSaving || pinValue.length !== 4}
                  className="px-4 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black disabled:opacity-50"
                >
                  {pinSaving ? "Saving..." : "Save"}
                </button>
              </form>
            )}
          </div>

          {/* Story Time Reminder Toggle */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-800">Story Time Reminder</p>
              <p className="text-[11px] text-gray-400">In-app reminder cues once a day.</p>
            </div>
            <button
              type="button"
              disabled={reminderSaving}
              onClick={() => void handleReminderToggle(!child.reminder_enabled)}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                child.reminder_enabled ? "bg-emerald-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  child.reminder_enabled ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>

          {/* Profile Deletion */}
          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            {!showConfirmDelete ? (
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="text-xs font-bold text-red-500 hover:underline"
              >
                Remove {child.name}&apos;s profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-red-600">Are you sure?</span>
                <button
                  type="button"
                  onClick={() => void handleDeleteProfile()}
                  disabled={deleting}
                  className="px-3 py-1 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-3 py-1 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}