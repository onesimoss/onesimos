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

function curriculumLabel(value: string) {
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

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [practiceByChild, setPracticeByChild] = useState<
    Record<string, { word: string; count: number }[]>
  >({});
  const [fetching, setFetching] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [pinEditId, setPinEditId] = useState<string | null>(null);
  const [pinValue, setPinValue] = useState("");
  const [pinSaving, setPinSaving] = useState(false);
  const [reminderSavingId, setReminderSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setFetching(true);
      const { data } = await getChildrenForParent(user.id);
      setChildren(data);

      const practiceMap: Record<string, { word: string; count: number }[]> = {};
      await Promise.all(
        data.map(async (child) => {
          const { data: words } = await getRecentStumbledWords(child.id, 8);
          practiceMap[child.id] = words;
        })
      );
      setPracticeByChild(practiceMap);

      setFetching(false);

      if (data.length === 0) {
        router.replace("/onboarding");
      }
    }
    load();
  }, [user, router]);

  const handleDelete = async (child: ChildProfile) => {
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

  const handleSavePin = async (child: ChildProfile) => {
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
    setMessage(`PIN saved for ${child.name}.`);
  };

  const handleReminderToggle = async (child: ChildProfile, enabled: boolean) => {
    if (!user) return;
    setReminderSavingId(child.id);
    setError("");
    setMessage("");

    if (enabled) {
      const permission = await requestNotificationPermission();
      if (permission === "denied") {
        setError(
          "Notifications are blocked in this browser. You can still save the time; enable notifications in browser settings for gentle alerts."
        );
      } else if (permission === "unsupported") {
        setMessage(
          "This device may not support browser notifications. Reminder is saved for in-app gentle cues."
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
        ? `Story Time Reminder on for ${child.name} (optional — you can turn it off anytime).`
        : `Story Time Reminder off for ${child.name}.`
    );
  };

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

  if (loading || fetching || !user) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-bark-muted font-heading">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream">
      <header className="border-b border-border bg-parchment/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
          <Link href="/dashboard" className="font-logo text-2xl text-bark">
            Onesimos
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/who"
              className="text-sm font-bold text-coral hover:underline"
            >
              Who&apos;s reading?
            </Link>
            <span className="hidden sm:block text-sm text-bark-muted">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-bark">
              Parent Dashboard
            </h1>
            <p className="text-bark-muted mt-1">
              PINs, practice words, and optional Story Time reminders — always under your control.
            </p>
          </div>
          <Link href="/onboarding" className="btn-primary !py-2.5 !px-5 !text-sm">
            + Add child
          </Link>
        </div>

        {message && (
          <div className="mb-6 bg-mint-light border border-mint/30 text-bark p-3 rounded-2xl text-sm font-medium">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-3 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => {
            const avatar = getAvatarById(child.avatar_id);
            const isConfirming = confirmId === child.id;
            const isDeleting = deletingId === child.id;
            const isPinEdit = pinEditId === child.id;
            const practice = practiceByChild[child.id] || [];
            const hasPin = !!(child.kid_pin && String(child.kid_pin).length === 4);
            const reminderOn = !!child.reminder_enabled;
            const reminderTime = child.reminder_time_local || "16:30";
            const savingReminder = reminderSavingId === child.id;

            return (
              <div key={child.id} className="card hover:shadow-hover transition-all">
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-16 h-16 rounded-2xl overflow-hidden border border-border bg-cream shrink-0"
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
                    <h2 className="font-heading text-xl font-bold text-bark truncate">
                      {child.name}
                    </h2>
                    <p className="text-sm text-bark-muted">
                      Age {child.age} · Reading level {child.reading_level}
                    </p>
                    <p className="text-xs font-bold mt-1">
                      {hasPin ? (
                        <span className="text-mint">PIN set</span>
                      ) : (
                        <span className="text-coral">PIN not set yet</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between gap-3">
                    <span className="text-bark-muted shrink-0">Curriculum</span>
                    <span className="font-bold text-bark text-right">
                      {curriculumLabel(child.curriculum)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-bark-muted">Daily time</span>
                    <span className="font-bold text-bark">
                      {child.session_minutes} min
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-bark-muted shrink-0">Interests</span>
                    <span className="font-bold text-bark text-right capitalize">
                      {(child.interests || []).join(", ") || "—"}
                    </span>
                  </div>
                </div>

                <div className="mb-4 rounded-2xl bg-cream border border-border p-3">
                  <p className="text-xs font-bold text-bark-muted mb-2 uppercase tracking-wide">
                    Words to practice
                  </p>
                  {practice.length === 0 ? (
                    <p className="text-sm text-bark-muted">
                      No practice list yet. It fills in when they read aloud.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {practice.map((item) => (
                        <span
                          key={item.word}
                          className="px-2.5 py-1 rounded-full bg-gold-light text-bark text-xs font-bold border border-border"
                        >
                          {item.word}
                          {item.count > 1 ? ` · ${item.count}` : ""}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Story Time Reminder */}
                <div className="mb-4 rounded-2xl border border-border bg-parchment p-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-bold text-bark">Story Time Reminder</p>
                      <p className="text-xs text-bark-muted">
                        Optional · once a day · off after 7:30pm
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={savingReminder}
                      onClick={() => handleReminderToggle(child, !reminderOn)}
                      className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
                        reminderOn ? "bg-mint" : "bg-border"
                      }`}
                      aria-label={reminderOn ? "Turn reminder off" : "Turn reminder on"}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                          reminderOn ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </div>
                  <label className="block text-xs font-bold text-bark-muted mb-1">
                    Preferred time
                  </label>
                  <input
                    type="time"
                    value={reminderTime}
                    disabled={savingReminder}
                    onChange={(e) => handleReminderTime(child, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-cream text-bark font-bold text-sm focus:outline-none focus:ring-2 focus:ring-coral/40"
                  />
                  <p className="text-[11px] text-bark-muted mt-2 leading-relaxed">
                    Gentle browser cue when this device is open. Not a loud alarm.
                    Turn off anytime. No nudge if today&apos;s reading time is already used.
                  </p>
                </div>

                {isPinEdit ? (
                  <div className="mb-4 rounded-2xl border border-border bg-parchment p-3">
                    <p className="text-sm font-bold text-bark mb-2">
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
                      className="w-full px-4 py-3 rounded-2xl border border-border bg-cream text-center text-2xl tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-coral/40"
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setPinEditId(null);
                          setPinValue("");
                        }}
                        className="btn-secondary flex-1 !py-2 !text-sm"
                        disabled={pinSaving}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSavePin(child)}
                        disabled={pinSaving || pinValue.length !== 4}
                        className="btn-primary flex-1 !py-2 !text-sm disabled:opacity-50"
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
                    className="w-full mb-3 text-sm font-bold text-bark-muted hover:text-coral py-2 border border-border rounded-full bg-cream"
                  >
                    {hasPin ? "Change kid PIN" : "Set kid PIN"}
                  </button>
                )}

                {!isConfirming ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/kid/${child.id}`}
                      className="btn-primary flex-1 !py-2.5 !text-sm text-center"
                    >
                      Open kid view
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmId(child.id);
                        setPinEditId(null);
                      }}
                      className="text-sm font-bold text-bark-muted hover:text-red-500 transition-colors py-2"
                    >
                      Remove profile
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-bark mb-3">
                      Remove <span className="font-bold">{child.name}</span>
                      &apos;s profile? You can add them again later.
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        disabled={isDeleting}
                        className="btn-secondary flex-1 !py-2 !text-sm"
                      >
                        Keep
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(child)}
                        disabled={isDeleting}
                        className="flex-1 !py-2 !text-sm font-bold rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        {isDeleting ? "Removing..." : "Yes, remove"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}