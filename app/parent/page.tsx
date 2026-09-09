/**
 * @file app/parent/page.tsx
 * @description Parent Dashboard — child profile overview cards, reading insights,
 * practice vocabulary list, story-time reminder settings, kid PIN lock management,
 * Parent 4-digit unlock PIN configuration, and test-data reset tools.
 *
 * @dependencies
 * - @/context/AuthContext (parent authentication & logout)
 * - @/lib/children (child profiles API, PINs, deletion)
 * - @/lib/avatars (avatar image & color resolution)
 * - @/lib/stumbledWords (recent stumbled vocabulary for practice)
 * - @/lib/reminders (story time notification preferences)
 * - @/lib/sessionInsights (reading streaks, page counts, session stats)
 * - @/lib/parentGate (4-digit Parent PIN setup and status)
 * - @/lib/sessionBudget (reset test story quota helper)
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/components/LogoutButton";
import {
  getChildrenForParent,
  deleteChild,
  setChildPin,
  type ChildProfile,
} from "@/lib/children";
import { getAvatarById } from "@/lib/avatars";
import { getRecentStumbledWords } from "@/lib/stumbledWords";
import {
  updateChildReminder,
  requestNotificationPermission,
} from "@/lib/reminders";
import {
  getChildSessions,
  computeSessionStats,
} from "@/lib/sessionInsights";
import { getParentPinStatus, setParentPin } from "@/lib/parentGate";
import { resetChildStoryQuota } from "@/lib/sessionBudget";

// ─── Section 1: Helper Types & Label Formatters ───

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

type ChildStats = {
  totalSessions: number;
  totalPages: number;
  totalMinutes: number;
  storiesFinished: number;
  streak: number;
};

// ─── Section 2: Component Implementation ───

export default function ParentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Child Data States
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [practiceByChild, setPracticeByChild] = useState<
    Record<string, { word: string; count: number }[]>
  >({});
  const [statsByChild, setStatsByChild] = useState<Record<string, ChildStats>>(
    {}
  );
  const [fetching, setFetching] = useState(true);

  // Child Profile Action States
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [pinEditId, setPinEditId] = useState<string | null>(null);
  const [pinValue, setPinValue] = useState("");
  const [pinSaving, setPinSaving] = useState(false);
  const [reminderSavingId, setReminderSavingId] = useState<string | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);

  // Parent PIN Security States
  const [hasParentPin, setHasParentPin] = useState<boolean | null>(null);
  const [showParentPinModal, setShowParentPinModal] = useState(false);
  const [newParentPin, setNewParentPin] = useState("");
  const [confirmParentPin, setConfirmParentPin] = useState("");
  const [parentPinSaving, setParentPinSaving] = useState(false);
  const [parentPinError, setParentPinError] = useState("");

  // Feedback Banner States
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Authentication Protection
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/parent/login");
    }
  }, [user, loading, router]);

  // Load All Parent Data (Children, Stats, Practice Words, Parent PIN Status)
  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      setFetching(true);

      // Check Parent PIN configuration status
      const { hasPin } = await getParentPinStatus(user.id);
      setHasParentPin(hasPin);

      // Fetch list of child profiles for parent
      const { data } = await getChildrenForParent(user.id);
      setChildren(data);

      const practiceMap: Record<string, { word: string; count: number }[]> = {};
      const statsMap: Record<string, ChildStats> = {};

      await Promise.all(
        data.map(async (child) => {
          const [{ data: words }, { data: sessions }] = await Promise.all([
            getRecentStumbledWords(child.id, 8),
            getChildSessions(child.id, 60),
          ]);
          practiceMap[child.id] = words;
          statsMap[child.id] = computeSessionStats(sessions);
        })
      );

      setPracticeByChild(practiceMap);
      setStatsByChild(statsMap);
      setFetching(false);

      if (data.length === 0) {
        router.replace("/onboarding");
      }
    }

    void loadDashboardData();
  }, [user, router]);

  // ─── Section 3: Event Handlers ───

  /**
   * Save or update secret 4-digit Parent PIN.
   */
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

  /**
   * Remove a child profile permanently.
   */
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

    if (next.length === 0) {
      router.replace("/onboarding");
    }
  };

  /**
   * Save 4-digit PIN for a child profile.
   */
  const handleSaveKidPin = async (child: ChildProfile) => {
    if (!user) return;
    setPinSaving(true);
    setError("");
    setMessage("");

    const { error: pinError } = await setChildPin(child.id, user.id, pinValue);
    setPinSaving(false);

    if (pinError) {
      setError(pinError.message || "Could not save PIN.");
      return;
    }

    setChildren((prev) =>
      prev.map((c) =>
        c.id === child.id ? { ...c, kid_pin: pinValue.replace(/\D/g, "") } : c
      )
    );
    setPinEditId(null);
    setPinValue("");
    setMessage(`Kid PIN saved for ${child.name}.`);
  };

  /**
   * Toggle Story Time Reminder preference.
   */
  const handleReminderToggle = async (child: ChildProfile, enabled: boolean) => {
    if (!user) return;
    setReminderSavingId(child.id);
    setError("");
    setMessage("");

    if (enabled) {
      const permission = await requestNotificationPermission();
      if (permission === "denied") {
        setError(
          "Notifications are blocked in this browser. Reminder is saved for in-app cues."
        );
      }
    }

    const timeLocal = child.reminder_time_local || "16:30";
    const { error: remError } = await updateChildReminder(child.id, user.id, {
      enabled,
      timeLocal,
    });
    setReminderSavingId(null);

    if (remError) {
      setError(remError.message || "Could not update reminder.");
      return;
    }

    setChildren((prev) =>
      prev.map((c) =>
        c.id === child.id ? { ...c, reminder_enabled: enabled } : c
      )
    );
    setMessage(
      enabled
        ? `Story Time Reminder turned on for ${child.name}.`
        : `Story Time Reminder turned off for ${child.name}.`
    );
  };

  /**
   * Update Story Time Reminder preferred time.
   */
  const handleReminderTime = async (child: ChildProfile, timeLocal: string) => {
    if (!user) return;
    setReminderSavingId(child.id);
    setError("");

    const { error: remError, timeLocal: saved } = await updateChildReminder(
      child.id,
      user.id,
      {
        enabled: !!child.reminder_enabled,
        timeLocal,
      }
    );
    setReminderSavingId(null);

    if (remError) {
      setError(remError.message || "Could not save time.");
      return;
    }

    setChildren((prev) =>
      prev.map((c) =>
        c.id === child.id
          ? { ...c, reminder_time_local: saved || timeLocal }
          : c
      )
    );
  };

  /**
   * Reset test reading session history and unblock monthly quotas for testing.
   */
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

    // Refresh local stats representation
    setStatsByChild((prev) => ({
      ...prev,
      [child.id]: {
        totalSessions: 0,
        totalPages: 0,
        totalMinutes: 0,
        storiesFinished: 0,
        streak: 0,
      },
    }));
    setPracticeByChild((prev) => ({
      ...prev,
      [child.id]: [],
    }));

    setMessage(`Test story quota & reading data reset for ${child.name}.`);
  };

  if (loading || fetching || !user) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <p className="text-gray-500 font-bold animate-pulse">Loading Parent Dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] font-sans pb-16">
      
      {/* ─── Section 4: Top Navigation Bar ─── */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
          <Link href="/parent" className="font-extrabold text-2xl text-gray-900 tracking-tight">
            Onesimos
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/who"
              className="text-xs sm:text-sm font-bold text-coral hover:underline"
            >
              Who&apos;s reading?
            </Link>
            <span className="hidden md:inline text-xs text-gray-500 font-medium">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Banner Alert if Parent PIN is missing */}
        {hasParentPin === false && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="text-sm font-bold text-amber-900">Set a 4-Digit Parent Code</p>
                <p className="text-xs text-amber-700">
                  Prevent kids from switching back into Parent Settings without authorization.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowParentPinModal(true)}
              className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors"
            >
              Set Parent PIN
            </button>
          </div>
        )}

        {/* Dashboard Title & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900">
              Parent Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Progress at a glance — calm numbers for you, adventures for them.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowParentPinModal(true)}
              className="px-4 py-2.5 rounded-full border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
            >
              {hasParentPin ? "Change Parent PIN" : "Set Parent PIN"}
            </button>
            <Link
              href="/onboarding"
              className="px-5 py-2.5 bg-coral text-white rounded-full text-xs font-bold hover:bg-coral/90 transition-colors shadow-sm"
            >
              + Add child
            </Link>
          </div>
        </div>

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

        {/* ─── Section 5: Child Cards Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => {
            const avatar = getAvatarById(child.avatar_id);
            const isConfirming = confirmId === child.id;
            const isDeleting = deletingId === child.id;
            const isPinEdit = pinEditId === child.id;
            const isResetting = resettingId === child.id;
            const practice = practiceByChild[child.id] || [];
            const stats = statsByChild[child.id] || {
              totalSessions: 0,
              totalPages: 0,
              totalMinutes: 0,
              storiesFinished: 0,
              streak: 0,
            };
            const hasKidPin = !!(child.kid_pin && String(child.kid_pin).length === 4);
            const reminderOn = !!child.reminder_enabled;
            const reminderTime = child.reminder_time_local || "16:30";
            const savingReminder = reminderSavingId === child.id;

            return (
              <div
                key={child.id}
                className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Child Profile Summary */}
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-200 bg-cream shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: `${avatar.color}22` }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={avatar.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xl font-black text-gray-900 truncate">
                        {child.name}
                      </h2>
                      <p className="text-xs text-gray-500 font-medium">
                        Age {child.age} · Reading level {child.reading_level}
                      </p>
                      <p className="text-xs font-bold mt-1">
                        {hasKidPin ? (
                          <span className="text-emerald-600">Kid PIN set</span>
                        ) : (
                          <span className="text-amber-600">PIN not set yet</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Insights Strip */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="rounded-2xl bg-[#FBF9F5] border border-gray-100 p-3 text-center">
                      <p className="text-lg font-black text-gray-900">
                        {stats.streak}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Day streak
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#FBF9F5] border border-gray-100 p-3 text-center">
                      <p className="text-lg font-black text-gray-900">
                        {stats.storiesFinished}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Stories done
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#FBF9F5] border border-gray-100 p-3 text-center">
                      <p className="text-lg font-black text-gray-900">
                        {stats.totalPages}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Pages read
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#FBF9F5] border border-gray-100 p-3 text-center">
                      <p className="text-lg font-black text-gray-900">
                        {stats.totalSessions}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Sessions
                      </p>
                    </div>
                  </div>

                  {/* Curriculum & Preferences Info */}
                  <div className="space-y-2 text-xs mb-4 pt-2 border-t border-gray-100">
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-400 font-medium">Curriculum</span>
                      <span className="font-bold text-gray-800 text-right">
                        {curriculumLabel(child.curriculum)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Daily time</span>
                      <span className="font-bold text-gray-800">
                        {child.session_minutes} min
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-400 font-medium">Interests</span>
                      <span className="font-bold text-gray-800 text-right capitalize truncate">
                        {(child.interests || []).join(", ") || "—"}
                      </span>
                    </div>
                  </div>

                  {/* Practice Vocabulary List */}
                  <div className="mb-4 rounded-2xl bg-[#FBF9F5] border border-gray-100 p-3">
                    <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">
                      Words to practice
                    </p>
                    {practice.length === 0 ? (
                      <p className="text-xs text-gray-400 font-medium">
                        No practice list yet. It fills in when they read aloud.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {practice.map((item) => (
                          <span
                            key={item.word}
                            className="px-2.5 py-1 rounded-full bg-amber-100/70 text-gray-900 text-xs font-bold border border-amber-200/50"
                          >
                            {item.word}
                            {item.count > 1 ? ` · ${item.count}` : ""}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Story Time Reminder Controls */}
                  <div className="mb-4 rounded-2xl border border-gray-100 bg-gray-50/60 p-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div>
                        <p className="text-xs font-bold text-gray-800">Story Time Reminder</p>
                        <p className="text-[10px] text-gray-400">
                          Optional · once a day · off after 7:30pm
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={savingReminder}
                        onClick={() => handleReminderToggle(child, !reminderOn)}
                        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                          reminderOn ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                        aria-label={reminderOn ? "Turn reminder off" : "Turn reminder on"}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                            reminderOn ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1">
                      Preferred time
                    </label>
                    <input
                      type="time"
                      value={reminderTime}
                      disabled={savingReminder}
                      onChange={(e) => handleReminderTime(child, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-gray-800 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  {/* Kid PIN Configuration */}
                  {isPinEdit ? (
                    <div className="mb-4 rounded-2xl border border-gray-200 bg-gray-50 p-3">
                      <p className="text-xs font-bold text-gray-800 mb-2">
                        4-digit PIN for {child.name}
                      </p>
                      <input
                        type="password"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={4}
                        value={pinValue}
                        onChange={(e) =>
                          setPinValue(e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        placeholder="••••"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-center text-xl tracking-[0.4em] font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => {
                            setPinEditId(null);
                            setPinValue("");
                          }}
                          className="flex-1 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-white"
                          disabled={pinSaving}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveKidPin(child)}
                          disabled={pinSaving || pinValue.length !== 4}
                          className="flex-1 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black disabled:opacity-50"
                        >
                          {pinSaving ? "Saving..." : "Save PIN"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setPinEditId(child.id);
                        setPinValue("");
                        setConfirmId(null);
                      }}
                      className="w-full mb-3 text-xs font-bold text-gray-600 hover:text-gray-900 py-2 border border-gray-200 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      {hasKidPin ? "Change Kid PIN" : "Set Kid PIN"}
                    </button>
                  )}
                </div>

                {/* Bottom Profile Actions & Tester Tooling */}
                <div>
                  {!isConfirming ? (
                    <div className="flex flex-col gap-2 pt-2">
                      <Link
                        href={`/kid/${child.id}`}
                        className="w-full py-2.5 rounded-2xl bg-coral text-white text-xs font-black hover:bg-coral/90 text-center shadow-sm transition-colors"
                      >
                        Open Kid View
                      </Link>
                      <div className="flex justify-between items-center px-1 pt-1">
                        <button
                          type="button"
                          disabled={isResetting}
                          onClick={() => void handleResetTestData(child)}
                          className="text-[11px] font-bold text-gray-400 hover:text-amber-700 transition-colors py-1 disabled:opacity-50"
                        >
                          {isResetting ? "Resetting..." : "🔄 Reset Test Quota"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmId(child.id);
                            setPinEditId(null);
                          }}
                          className="text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors py-1"
                        >
                          Remove profile
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-3 mt-2">
                      <p className="text-xs text-gray-800 mb-3 text-center">
                        Remove <span className="font-bold">{child.name}</span>&apos;s profile?
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirmId(null)}
                          disabled={isDeleting}
                          className="flex-1 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600"
                        >
                          Keep
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteChild(child)}
                          disabled={isDeleting}
                          className="flex-1 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50"
                        >
                          {isDeleting ? "Removing..." : "Remove"}
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

      {/* ─── Section 6: Parent 4-Digit Security PIN Modal ─── */}
      {showParentPinModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-gray-100">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-1">
              {hasParentPin ? "Change Parent PIN" : "Set Parent PIN"}
            </h3>
            <p className="text-gray-500 text-xs mb-6">
              Enter a secret 4-digit code to protect Parent Dashboard access.
            </p>

            <form onSubmit={handleSaveParentPin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 text-left mb-1">
                  New 4-Digit Code
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={newParentPin}
                  onChange={(e) => setNewParentPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="••••"
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-gray-50 text-center text-2xl tracking-[0.4em] font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 text-left mb-1">
                  Confirm Code
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={confirmParentPin}
                  onChange={(e) => setConfirmParentPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="••••"
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-gray-50 text-center text-2xl tracking-[0.4em] font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {parentPinError && (
                <p className="text-xs font-bold text-red-600 bg-red-50 py-2 px-3 rounded-xl">
                  {parentPinError}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowParentPinModal(false);
                    setParentPinError("");
                    setNewParentPin("");
                    setConfirmParentPin("");
                  }}
                  disabled={parentPinSaving}
                  className="flex-1 py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={parentPinSaving || newParentPin.length !== 4 || confirmParentPin.length !== 4}
                  className="flex-1 py-2.5 rounded-2xl bg-[#FCE588] text-black text-xs font-bold hover:bg-yellow-300 disabled:opacity-50"
                >
                  {parentPinSaving ? "Saving..." : "Save Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}