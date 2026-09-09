/**
 * @file app/kid/[childId]/page.tsx
 * @description Kid Home — story picker, daily time budget, free-plan monthly
 * story limit (3/month), story-time reminder, and Parent Gate entry.
 *
 * @dependencies
 * - @/context/AuthContext
 * - @/lib/sessionBudget (daily timer + monthly free quota)
 * - @/lib/sampleStories, @/lib/avatars, @/lib/reminders
 * - @/components/ParentGate
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { getAvatarById } from "@/lib/avatars";
import type { ChildProfile } from "@/lib/children";
import { getStoriesForChild, type SampleStory } from "@/lib/sampleStories";
import {
  getDailyBudgetSeconds,
  formatMMSS,
  checkMonthlyStoryLimit,
  FREE_MONTHLY_STORY_LIMIT,
  type MonthlyUsageStatus,
} from "@/lib/sessionBudget";
import ParentGate from "@/components/ParentGate";
import {
  shouldOfferReminder,
  markReminderShown,
  sendFriendlyStoryNotification,
} from "@/lib/reminders";

// ─── Section 1: Helpers ───

function storyFitLabel(story: SampleStory, readingLevel: number): string {
  if (readingLevel >= story.levelMin && readingLevel <= story.levelMax) {
    return "Just right for you";
  }
  if (readingLevel < story.levelMin) {
    return "A little challenge";
  }
  return "Easy warm-up";
}

// ─── Section 2: Page ───

export default function KidHomePage() {
  const { childId } = useParams<{ childId: string }>();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [child, setChild] = useState<ChildProfile | null>(null);
  const [fetching, setFetching] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [gateOpen, setGateOpen] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderDismissed, setReminderDismissed] = useState(false);

  // Free-plan monthly quota
  const [monthlyUsage, setMonthlyUsage] = useState<MonthlyUsageStatus | null>(null);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [startingStoryId, setStartingStoryId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/parent/login");
  }, [user, loading, router]);

  useEffect(() => {
    async function load() {
      if (!user || !childId) return;
      setFetching(true);

      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("id", childId)
        .eq("parent_id", user.id)
        .single();

      if (error || !data) {
        router.replace("/who");
        return;
      }

      const profile = data as ChildProfile;
      setChild(profile);

      const left = getDailyBudgetSeconds(
        profile.id,
        profile.session_minutes || 20
      );
      setSecondsLeft(left);

      const usage = await checkMonthlyStoryLimit(profile.id);
      setMonthlyUsage(usage);

      setFetching(false);

      const offer = shouldOfferReminder({
        enabled: !!profile.reminder_enabled,
        timeLocal: profile.reminder_time_local || "16:30",
        lastNotifiedDate: profile.reminder_last_date,
        childId: profile.id,
        sessionMinutes: profile.session_minutes || 20,
      });

      if (offer) {
        setShowReminder(true);
        sendFriendlyStoryNotification(profile.name);
        void markReminderShown(profile.id, user.id);
        setChild((prev) =>
          prev
            ? {
                ...prev,
                reminder_last_date: new Date().toISOString().slice(0, 10),
              }
            : prev
        );
      }
    }

    void load();
  }, [user, childId, router]);

  const stories = useMemo(() => {
    if (!child) return [];
    return getStoriesForChild({
      readingLevel: child.reading_level || 3,
      interests: child.interests || [],
    });
  }, [child]);

  /**
   * Start a story only if daily time remains and free monthly quota allows it.
   */
  const handleStartStory = useCallback(
    async (storyId: string) => {
      if (!child) return;

      if ((secondsLeft ?? 0) <= 0) {
        return;
      }

      setStartingStoryId(storyId);

      const usage = await checkMonthlyStoryLimit(child.id);
      setMonthlyUsage(usage);

      if (!usage.isPaidPlan && !usage.allowed) {
        setStartingStoryId(null);
        setLimitModalOpen(true);
        return;
      }

      setStartingStoryId(null);
      router.push(`/kid/${child.id}/read/${storyId}`);
    },
    [child, secondsLeft, router]
  );

  if (loading || fetching || !child) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-sky-light to-cream flex items-center justify-center">
        <p className="font-heading text-bark-muted text-xl">Getting ready...</p>
      </main>
    );
  }

  const avatar = getAvatarById(child.avatar_id);
  const timeIsUp = (secondsLeft ?? 1) <= 0;
  const reminderVisible = showReminder && !reminderDismissed && !timeIsUp;
  const freeStoriesLeft =
    monthlyUsage && !monthlyUsage.isPaidPlan
      ? Math.max(0, monthlyUsage.limit - monthlyUsage.used)
      : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-light via-cream to-gold-light">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => setGateOpen(true)}
            className="text-sm font-bold text-bark-muted hover:text-bark"
          >
            Parents
          </button>
          <span className="font-logo text-2xl text-bark">Onesimos</span>
          <Link
            href="/who"
            className="text-sm font-bold text-bark-muted hover:text-bark"
          >
            Switch
          </Link>
        </div>

        {/* Story-time reminder */}
        {reminderVisible && (
          <div className="mb-6 rounded-3xl border border-gold/40 bg-gold-light/80 px-5 py-4 shadow-soft flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="text-3xl shrink-0">📖</div>
            <div className="flex-1 text-left">
              <p className="font-heading text-lg font-bold text-bark">
                Story time, {child.name}?
              </p>
              <p className="text-sm text-bark-muted">
                A cozy adventure is waiting whenever you&apos;re ready. No rush.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setReminderDismissed(true)}
                className="btn-secondary !py-2 !px-4 !text-sm"
              >
                Maybe later
              </button>
              <button
                type="button"
                onClick={() => {
                  setReminderDismissed(true);
                  const first = stories[0];
                  if (first) void handleStartStory(first.id);
                }}
                className="btn-primary !py-2 !px-4 !text-sm"
              >
                Let&apos;s read
              </button>
            </div>
          </div>
        )}

        {/* Hero */}
        <div className="text-center mb-10">
          <div
            className="w-28 h-28 mx-auto rounded-[2rem] overflow-hidden border-4 border-white shadow-soft mb-5 bg-cream"
            style={{ backgroundColor: `${avatar.color}33` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar.imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-bark mb-2">
            Hi, {child.name}!
          </h1>
          <p className="text-bark-muted text-lg">
            {timeIsUp
              ? "You did amazing today. See you tomorrow!"
              : "Pick a story for today"}
          </p>
          <div className="inline-flex flex-wrap items-center justify-center gap-2 mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-border text-bark font-bold text-sm">
              {timeIsUp
                ? "Daily reading complete"
                : `Today's adventure time · ${formatMMSS(secondsLeft || 0)} left`}
            </div>
            {freeStoriesLeft !== null && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-border text-bark-muted font-bold text-xs">
                Free stories this month · {freeStoriesLeft} of{" "}
                {FREE_MONTHLY_STORY_LIMIT} left
              </div>
            )}
          </div>
        </div>

        {/* Stories or rest state */}
        {timeIsUp ? (
          <div className="card text-center !p-8 mb-8">
            <div className="text-5xl mb-3">🌟</div>
            <h2 className="font-heading text-2xl font-bold text-bark mb-2">
              Rest time
            </h2>
            <p className="text-bark-muted">
              Your stories will be waiting tomorrow. Go play, snack, or hug
              someone you love.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {stories.map((story) => {
              const isStarting = startingStoryId === story.id;
              return (
                <button
                  key={story.id}
                  type="button"
                  disabled={!!startingStoryId}
                  onClick={() => void handleStartStory(story.id)}
                  className="card hover:shadow-hover hover:-translate-y-1 transition-all text-left !p-5 disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  <div className="text-4xl mb-3">{story.coverEmoji}</div>
                  <h2 className="font-heading text-xl font-bold text-bark mb-1">
                    {story.title}
                  </h2>
                  <p className="text-sm text-bark-muted mb-1">
                    About {story.estimatedMinutes} minutes
                  </p>
                  <p className="text-xs font-bold text-coral mb-4">
                    {storyFitLabel(story, child.reading_level || 3)}
                  </p>
                  <span className="inline-flex btn-primary !py-2 !px-4 !text-sm">
                    {isStarting ? "Opening..." : "Read now"}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {!timeIsUp && stories.length === 0 && (
          <div className="card text-center py-10 mb-8">
            <p className="text-bark-muted">
              Stories are getting ready for you. Check back soon!
            </p>
          </div>
        )}

        {/* Secondary tiles */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href={`/kid/${child.id}`}
            className="card text-center hover:shadow-hover transition-all"
          >
            <div className="text-2xl mb-1">📚</div>
            <p className="text-sm font-bold text-bark">My stories</p>
          </Link>
          <button
            type="button"
            onClick={() => setGateOpen(true)}
            className="card text-center hover:shadow-hover transition-all"
          >
            <div className="text-2xl mb-1">👨‍👩‍👧</div>
            <p className="text-sm font-bold text-bark">Parents</p>
          </button>
        </div>
      </div>

      {/* Free-plan monthly limit modal (calm, parent-facing) */}
      {limitModalOpen && (
        <div className="fixed inset-0 z-50 bg-bark/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center border border-border shadow-2xl">
            <div className="text-4xl mb-3">📖</div>
            <h2 className="font-heading text-2xl font-extrabold text-bark mb-2">
              Free stories used up
            </h2>
            <p className="text-bark-muted text-sm mb-2">
              {child.name} has finished all{" "}
              <span className="font-bold text-bark">
                {FREE_MONTHLY_STORY_LIMIT} free stories
              </span>{" "}
              for this month.
            </p>
            <p className="text-bark-muted text-xs mb-6">
              Parents can unlock unlimited stories, or wait until next month when
              the free allowance refreshes.
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setLimitModalOpen(false);
                  setGateOpen(true);
                }}
                className="btn-primary !py-3 !text-sm w-full"
              >
                Parent unlock
              </button>
              <button
                type="button"
                onClick={() => setLimitModalOpen(false)}
                className="btn-secondary !py-3 !text-sm w-full"
              >
                Back to home
              </button>
            </div>
          </div>
        </div>
      )}

      <ParentGate
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        onSuccess={() => {
          setGateOpen(false);
          router.push("/parent");
        }}
      />
    </main>
  );
}