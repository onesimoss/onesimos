/**
 * @file app/kid/[childId]/page.tsx
 * @description Kid Home View — story catalog with completed story badges & stars,
 * daily reading session timer, free plan monthly quota gate, Word Pocket
 * (stumbled words practice with tap-to-hear audio), Solo Spelling Game launcher,
 * and Parent Gate access.
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

// ─── IMPORTS ────────────────────────────────────────────────────────────────

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
} from "@/lib/stumbledWords";
import { getChildSessions } from "@/lib/sessionInsights";
import ParentGate from "@/components/ParentGate";
import {
  shouldOfferReminder,
  markReminderShown,
  sendFriendlyStoryNotification,
} from "@/lib/reminders";

// ─── TYPES & HELPERS ────────────────────────────────────────────────────────

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

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function KidHomePage(): JSX.Element {
  const params = useParams<{ childId: string }>();
  const childId = params.childId;
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
    async function loadKidHomeData(): Promise<void> {
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
  const handleSpeakWord = (text: string): void => {
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
    <main className="min-h-screen bg-gradient-to-b from-sky-50/50 via-[#FDFBF7] to-amber-50/30 font-sans pb-16">
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
        <div className="text-center mb-8">
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
              : "Pick a story or practise your spelling!"}
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

        {/* Spelling Practice Quick Launcher Banner */}
        <div className="mb-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-xs rounded-2xl flex items-center justify-center text-3xl shrink-0">
              ✏️
            </div>
            <div>
              <h2 className="font-heading text-xl font-black text-white">
                Spelling Practice
              </h2>
              <p className="text-amber-100 text-xs font-medium">
                Spell words from your stories and earn stars!
              </p>
            </div>
          </div>
          <Link
            href={`/kid/${child.id}/spell`}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white text-amber-700 font-black text-sm shadow-sm hover:bg-amber-50 active:scale-95 transition-all text-center shrink-0"
          >
            Play Spelling 🚀
          </Link>
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
                    <span
                      className={`inline-block py-2 px-4 rounded-xl text-xs font-black shadow-2xs ${
                        isCompleted
                          ? "bg-gray-100 text-gray-800"
                          : "bg-coral text-white"
                      }`}
                    >
                      {isStarting
                        ? "Opening..."
                        : isCompleted
                        ? "Read again ↺"
                        : "Read now →"}
                    </span>
                    {isCompleted && <span className="text-xs">⭐ Star reader</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Word Pocket (Stumbled Words with Tap-to-Hear) */}
        {recentWords.length > 0 && (
          <section className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-heading text-lg font-black text-gray-900">
                  🎒 Word Pocket
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  Tap any word to hear how it sounds
                </p>
              </div>
              <Link
                href={`/kid/${child.id}/spell`}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200"
              >
                Spell these →
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {recentWords.map((item) => {
                const isSpeaking = activeSpeakingWord === item.word;
                return (
                  <button
                    key={item.word}
                    type="button"
                    onClick={() => handleSpeakWord(item.word)}
                    className={`px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSpeaking
                        ? "bg-amber-100 border-amber-400 text-amber-900 scale-95"
                        : item.type === "name"
                        ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        : "bg-amber-50/60 border-amber-200/80 text-amber-900 hover:bg-amber-100/80"
                    }`}
                  >
                    <span>{item.display}</span>
                    <span className="text-[10px] text-gray-400">🔊</span>
                    {item.type === "name" && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600 font-medium">
                        Name
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Parent PIN Lock Gate Modal */}
      <ParentGate
        isOpen={gateOpen}
        onClose={() => setGateOpen(false)}
        onSuccess={() => {
          setGateOpen(false);
          router.push("/parent");
        }}
      />

      {/* Free Plan Monthly Limit Modal */}
      {limitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-gray-100">
            <div className="text-4xl mb-3">🌟</div>
            <h3 className="font-heading text-xl font-black text-gray-900 mb-2">
              Story Goal Reached!
            </h3>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              You&apos;ve completed all <strong>{FREE_MONTHLY_STORY_LIMIT} free stories</strong> for this month. 
              Ask a parent to unlock unlimited adventures!
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setLimitModalOpen(false);
                  setGateOpen(true);
                }}
                className="w-full py-3 rounded-2xl bg-coral text-white font-black text-xs shadow-sm hover:bg-coral/90"
              >
                Ask Parent to Unlock ✨
              </button>
              <button
                type="button"
                onClick={() => setLimitModalOpen(false)}
                className="w-full py-2.5 rounded-2xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}