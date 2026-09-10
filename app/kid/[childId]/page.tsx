/**
 * @file app/kid/[childId]/page.tsx
 * @description Kid Home View — story catalog with completed story badges & stars,
 * daily reading session timer, free plan monthly quota gate, Word Pocket
 * (stumbled words practice), and Parent Gate access.
 *
 * @dependencies
 * - @/context/AuthContext (parent authentication)
 * - @/lib/sessionBudget (daily budget + monthly quota checks)
 * - @/lib/stumbledWords (recent stumbled words + speech synthesis)
 * - @/lib/sampleStories (story catalog for kid's level)
 * - @/lib/avatars (avatar image & color resolution)
 * - @/lib/sessionInsights (fetching completed reading session history)
 * - @/components/ParentGate (4-digit Parent PIN lock)
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
import {
  getRecentStumbledWords,
  speakWord,
  type StumbledItem,
} from "@/lib/stumbledWords";
import { getChildSessions, type ReadingSessionRow } from "@/lib/sessionInsights";
import ParentGate from "@/components/ParentGate";
import {
  shouldOfferReminder,
  markReminderShown,
  sendFriendlyStoryNotification,
} from "@/lib/reminders";

// ─── Section 1: Helper Types & Functions ───

interface ClassifiedWordItem {
  word: string;
  display: string;
  type: "word" | "name";
  count: number;
}

function storyFitLabel(story: SampleStory, readingLevel: number): string {
  if (readingLevel >= story.levelMin && readingLevel <= story.levelMax) {
    return "Just right for you";
  }
  if (readingLevel < story.levelMin) {
    return "A little challenge";
  }
  return "Easy warm-up";
}

// ─── Section 2: Page Component ───

export default function KidHomePage() {
  const { childId } = useParams<{ childId: string }>();
  const { user, loading } = useAuth();
  const router = useRouter();

  // Core Data States
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [fetching, setFetching] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [recentWords, setRecentWords] = useState<ClassifiedWordItem[]>([]);
  const [completedStoryIds, setCompletedStoryIds] = useState<Set<string>>(new Set());

  // UI & Navigation States
  const [gateOpen, setGateOpen] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderDismissed, setReminderDismissed] = useState(false);
  const [activeSpeakingWord, setActiveSpeakingWord] = useState<string | null>(null);

  // Free-plan monthly quota
  const [monthlyUsage, setMonthlyUsage] = useState<MonthlyUsageStatus | null>(null);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [startingStoryId, setStartingStoryId] = useState<string | null>(null);

  // Auth Protection
  useEffect(() => {
    if (!loading && !user) router.replace("/parent/login");
  }, [user, loading, router]);

  // Load Child Profile & Session Data
  useEffect(() => {
    async function loadKidHomeData() {
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

      // Load daily timer budget
      const left = getDailyBudgetSeconds(
        profile.id,
        profile.session_minutes || 20
      );
      setSecondsLeft(left);

      // Check monthly story quota
      const usage = await checkMonthlyStoryLimit(profile.id, user.email);
      setMonthlyUsage(usage);

      // Fetch completed story history to mark completed badges
      const { data: sessionData } = await getChildSessions(profile.id, 100);
      const finishedSet = new Set<string>();
      (sessionData || []).forEach((s) => {
        if (s.completed_story && s.story_id) {
          finishedSet.add(s.story_id);
        }
      });
      setCompletedStoryIds(finishedSet);

      // Fetch recent stumbled words for Word Pocket
      const { data: rawStumbled } = await getRecentStumbledWords(profile.id, 8);
      const classified: ClassifiedWordItem[] = (rawStumbled || []).map(({ word, count }) => {
        const isCap = /^[A-Z]/.test(word);
        return {
          word: word.toLowerCase(),
          display: isCap ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word,
          type: isCap ? "name" : "word",
          count,
        };
      });
      setRecentWords(classified);

      setFetching(false);

      // Story-time notification check
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

    void loadKidHomeData();
  }, [user, childId, router]);

  // Catalog filtered by reading level and interests
  const stories = useMemo(() => {
    if (!child) return [];
    return getStoriesForChild({
      readingLevel: child.reading_level || 3,
      interests: child.interests || [],
    });
  }, [child]);

  // Handle Story Selection & Quota Check
  const handleStartStory = useCallback(
    async (storyId: string) => {
      if (!child) return;

      if ((secondsLeft ?? 0) <= 0) {
        return;
      }

      setStartingStoryId(storyId);

      const usage = await checkMonthlyStoryLimit(child.id, user?.email);
      setMonthlyUsage(usage);

      if (!usage.isPaidPlan && !usage.allowed) {
        setStartingStoryId(null);
        setLimitModalOpen(true);
        return;
      }

      setStartingStoryId(null);
      router.push(`/kid/${child.id}/read/${storyId}`);
    },
    [child, secondsLeft, user?.email, router]
  );

  // Audio Pronunciation for Vocabulary Words
  const handleSpeakWord = (text: string) => {
    setActiveSpeakingWord(text);
    speakWord(text);
    setTimeout(() => setActiveSpeakingWord(null), 1200);
  };

  if (loading || fetching || !child) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-sans">
        <p className="font-extrabold text-gray-500 text-lg animate-pulse">Getting ready...</p>
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
    <main className="min-h-screen bg-gradient-to-b from-sky-50/50 via-[#FDFBF7] to-amber-50/30 font-sans pb-12">
      <div className="max-w-3xl mx-auto px-6 py-8">
        
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => setGateOpen(true)}
            className="text-xs font-bold text-gray-500 hover:text-gray-900 bg-white/80 px-3.5 py-1.5 rounded-full border border-gray-200 transition-colors shadow-2xs"
          >
            🔒 Parent Portal
          </button>
          <span className="font-logo text-2xl text-bark">Onesimos</span>
          <Link
            href="/who"
            className="text-xs font-bold text-gray-500 hover:text-gray-900 bg-white/80 px-3.5 py-1.5 rounded-full border border-gray-200 transition-colors shadow-2xs"
          >
            Switch Reader
          </Link>
        </div>

        {/* Story-time Reminder Banner */}
        {reminderVisible && (
          <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50/90 px-5 py-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="text-3xl shrink-0">📖</div>
            <div className="flex-1 text-left">
              <p className="font-heading text-lg font-bold text-gray-900">
                Story time, {child.name}?
              </p>
              <p className="text-xs text-gray-600">
                A cozy adventure is waiting whenever you&apos;re ready. No rush.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setReminderDismissed(true)}
                className="px-3.5 py-2 rounded-2xl border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50"
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
                className="px-4 py-2 rounded-2xl bg-coral text-white text-xs font-black hover:bg-coral/90 shadow-sm"
              >
                Let&apos;s read
              </button>
            </div>
          </div>
        )}

        {/* Child Hero Header */}
        <div className="text-center mb-10">
          <div
            className="w-24 h-28 mx-auto rounded-3xl overflow-hidden border-4 border-white shadow-md mb-4 flex items-center justify-center"
            style={{ backgroundColor: `${avatar.color}33` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar.imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-black text-gray-900 mb-2">
            Hi, {child.name}!
          </h1>
          <p className="text-gray-500 text-base font-medium">
            {timeIsUp
              ? "You did amazing today. See you tomorrow!"
              : "Pick a story for today"}
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-2 mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-gray-200 text-gray-800 font-bold text-xs shadow-sm">
              {timeIsUp
                ? "Daily reading complete 🌟"
                : `Today's time · ${formatMMSS(secondsLeft || 0)} left`}
            </div>
            {freeStoriesLeft !== null && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-gray-200 text-gray-600 font-bold text-xs shadow-sm">
                Free stories · {freeStoriesLeft} of {FREE_MONTHLY_STORY_LIMIT} left
              </div>
            )}
          </div>
        </div>

        {/* Story Grid or Rest Card */}
        {timeIsUp ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-200 shadow-sm mb-8">
            <div className="text-5xl mb-3">🌟</div>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
              Rest time
            </h2>
            <p className="text-gray-500 text-sm">
              Your stories will be waiting tomorrow. Go play, snack, or hug
              someone you love.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {stories.map((story) => {
              const isStarting = startingStoryId === story.id;
              const isCompleted = completedStoryIds.has(story.id);

              return (
                <button
                  key={story.id}
                  type="button"
                  disabled={!!startingStoryId}
                  onClick={() => void handleStartStory(story.id)}
                  className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between active:scale-[0.99] disabled:opacity-60 relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-4xl">{story.coverEmoji}</span>
                      {isCompleted && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <span>Completed</span>
                          <span>✅</span>
                        </span>
                      )}
                    </div>
                    <h2 className="font-heading text-xl font-black text-gray-900 mb-1">
                      {story.title}
                    </h2>
                    <p className="text-xs text-gray-500 mb-1 font-medium">
                      About {story.estimatedMinutes} minutes
                    </p>
                    <p className="text-xs font-bold text-coral mb-4">
                      {storyFitLabel(story, child.reading_level || 3)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className={`inline-block py-2 px-4 rounded-xl text-xs font-black shadow-2xs ${
                      isCompleted ? "bg-gray-100 text-gray-800" : "bg-coral text-white"
                    }`}>
                      {isStarting ? "Opening..." : isCompleted ? "Read again ↺" : "Read now →"}
                    </span>
                    {isCompleted && (
                      <span className="text-xs">⭐⭐⭐</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Empty Catalog State */}
        {!timeIsUp && stories.length === 0 && (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-200 shadow-sm mb-8">
            <p className="text-gray-500 text-sm font-medium">
              Stories are getting ready for you. Check back soon!
            </p>
          </div>
        )}

        {/* ─── Section 3: My Words Pocket ─── */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-heading text-lg font-black text-gray-900 flex items-center gap-2">
                <span>🎒</span> My Word Pocket
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">
                Words to practice from your recent reading sessions.
              </p>
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              Tap word to hear 🔊
            </span>
          </div>

          {recentWords.length === 0 ? (
            <p className="text-xs text-gray-400 font-medium py-3 text-center bg-gray-50/50 rounded-2xl">
              Your word pocket is empty! Read a story aloud to discover words to practice.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {recentWords.map((item) => {
                const isWord = item.type === "word";
                return (
                  <button
                    key={item.word}
                    type="button"
                    onClick={() => isWord && handleSpeakWord(item.display)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 border ${
                      isWord
                        ? activeSpeakingWord === item.display
                          ? "bg-amber-400 text-black border-amber-500 shadow-sm"
                          : "bg-amber-50/80 text-amber-950 border-amber-200/80 hover:bg-amber-100"
                        : "bg-purple-50/80 text-purple-950 border-purple-200/80 cursor-default"
                    }`}
                  >
                    <span>{item.display}</span>
                    {isWord ? (
                      <span className="text-[10px] opacity-60">🔊</span>
                    ) : (
                      <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-md uppercase font-black">
                        Name
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setGateOpen(true)}
            className="px-6 py-3 rounded-2xl bg-white/80 border border-gray-200 text-xs font-bold text-gray-600 hover:bg-white shadow-sm transition-colors flex items-center gap-2"
          >
            <span>🔒</span> Parent Portal & Settings
          </button>
        </div>

      </div>

      {/* Free Plan Monthly Limit Modal */}
      {limitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center border border-gray-100 shadow-2xl">
            <div className="text-4xl mb-3">📖</div>
            <h2 className="text-xl font-black text-gray-900 mb-2">
              Free Stories Completed
            </h2>
            <p className="text-gray-500 text-xs mb-3">
              {child.name} has finished all{" "}
              <span className="font-bold text-gray-900">
                {FREE_MONTHLY_STORY_LIMIT} free stories
              </span>{" "}
              for this month.
            </p>
            <p className="text-gray-400 text-[11px] mb-6">
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
                className="py-3 px-4 rounded-2xl bg-coral text-white text-xs font-black hover:bg-coral/90 transition-colors shadow-sm"
              >
                Parent Unlock
              </button>
              <button
                type="button"
                onClick={() => setLimitModalOpen(false)}
                className="py-2.5 px-4 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Parent Security Gate */}
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