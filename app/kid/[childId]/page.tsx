/**
 * @file app/kid/[childId]/page.tsx
 * @description Kid Home View — story catalog, personal Living Story chapters,
 * daily reading session budget timer, free plan monthly quota gate, Word Pocket
 * (categorised into Vocabulary Words vs Names & Places), Solo Spelling Game launcher,
 * and Parent Gate access.
 *
 * @dependencies
 * - @/context/AuthContext (parent authentication)
 * - @/lib/sessionBudget (daily budget + monthly quota checks)
 * - @/lib/stumbledWords (recent stumbled words + speech synthesis)
 * - @/lib/geoNames (African & Diaspora names protection)
 * - @/lib/sampleStories (story catalog for kid's level)
 * - @/lib/livingStory (fetching generated personal chapters)
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
import { getGeneratedStoriesForChild } from "@/lib/livingStory";
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
  type StumbledWordCountItem,
} from "@/lib/stumbledWords";
import { isGeoName, formatGeoNameDisplay } from "@/lib/geoNames";
import { getChildSessions } from "@/lib/sessionInsights";
import ParentGate from "@/components/ParentGate";
import {
  shouldOfferReminder,
  markReminderShown,
  sendFriendlyStoryNotification,
} from "@/lib/reminders";

// ─── HELPERS ────────────────────────────────────────────────────────────────

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
  const [recentWords, setRecentWords] = useState<StumbledWordCountItem[]>([]);
  const [personalStories, setPersonalStories] = useState<SampleStory[]>([]);
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

      // 1. Load daily timer budget
      const left = getDailyBudgetSeconds(
        profile.id,
        profile.session_minutes || 20
      );
      setSecondsLeft(left);

      // 2. Check monthly story quota
      const usage = await checkMonthlyStoryLimit(profile.id, user.email);
      setMonthlyUsage(usage);

      // 3. Fetch completed story history
      const { data: sessionData } = await getChildSessions(profile.id, 100);
      const finishedSet = new Set<string>();
      (sessionData || []).forEach((s) => {
        if (s.completed_story && s.story_id) {
          finishedSet.add(s.story_id);
        }
      });
      setCompletedStoryIds(finishedSet);

      // 4. Fetch recent stumbled words for Word Pocket
      const { data: rawStumbled } = await getRecentStumbledWords(profile.id, 12);
      setRecentWords(rawStumbled || []);

      // 5. Fetch Living Stories generated for this child
      const generated = await getGeneratedStoriesForChild(profile.id);
      setPersonalStories(generated || []);

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
  const catalogStories = useMemo(() => {
    if (!child) return [];
    return getStoriesForChild({
      readingLevel: child.reading_level || 3,
      interests: child.interests || [],
    });
  }, [child]);

  // Word Pocket categorization: Vocabulary vs Names & Places
  const { vocabularyWords, nameWords } = useMemo(() => {
    const vocab: StumbledWordCountItem[] = [];
    const names: StumbledWordCountItem[] = [];

    recentWords.forEach((item) => {
      const lower = item.word.toLowerCase();
      if (item.type === "name" || isGeoName(lower)) {
        names.push({
          ...item,
          display: formatGeoNameDisplay(lower),
          type: "name",
        });
      } else {
        vocab.push({
          ...item,
          display: lower,
          type: "word",
        });
      }
    });

    return { vocabularyWords: vocab, nameWords: names };
  }, [recentWords]);

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
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-switzer">
        <p className="font-bold text-gray-500 text-lg animate-pulse font-switzer">
          Getting ready...
        </p>
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
    <main className="min-h-screen bg-gradient-to-b from-sky-50/50 via-[#FDFBF7] to-amber-50/30 font-switzer pb-16">
      <div className="max-w-3xl mx-auto px-6 py-8">
        
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => setGateOpen(true)}
            className="text-xs font-bold text-gray-600 hover:text-gray-900 bg-white/80 px-3.5 py-1.5 rounded-full border border-gray-200 transition-colors shadow-2xs font-switzer"
          >
            🔒 Parent Portal
          </button>
          <span className="font-achiko text-2xl text-amber-900">Onesimos</span>
          <Link
            href="/who"
            className="text-xs font-bold text-gray-600 hover:text-gray-900 bg-white/80 px-3.5 py-1.5 rounded-full border border-gray-200 transition-colors shadow-2xs font-switzer"
          >
            Switch Reader
          </Link>
        </div>

        {/* Story-time Reminder Banner */}
        {reminderVisible && (
          <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50/90 px-5 py-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="text-3xl shrink-0">📖</div>
            <div className="flex-1 text-left">
              <p className="font-achiko text-lg text-amber-900">
                Story time, {child.name}?
              </p>
              <p className="text-xs text-amber-800 font-switzer">
                A cozy adventure is waiting whenever you&apos;re ready. No rush.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setReminderDismissed(true)}
                className="px-3.5 py-2 rounded-2xl border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50 font-switzer"
              >
                Maybe later
              </button>
              <button
                type="button"
                onClick={() => {
                  setReminderDismissed(true);
                  const first = catalogStories[0];
                  if (first) void handleStartStory(first.id);
                }}
                className="px-4 py-2 rounded-2xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 shadow-sm font-switzer"
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
              alt={child.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-achiko text-4xl md:text-5xl text-amber-950 mb-2">
            Hi, {child.name}!
          </h1>
          <p className="text-amber-800 text-base font-switzer">
            {timeIsUp
              ? "You did amazing today. See you tomorrow!"
              : "Pick a story or practise your spelling!"}
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-2 mt-4 font-switzer">
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
        <div className="mb-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 font-switzer">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-xs rounded-2xl flex items-center justify-center text-3xl shrink-0">
              ✏️
            </div>
            <div>
              <h2 className="font-achiko text-2xl text-white">
                Spelling Practice
              </h2>
              <p className="text-amber-100 text-xs font-switzer">
                Spell words from your stories and earn stars!
              </p>
            </div>
          </div>
          <Link
            href={`/kid/${child.id}/spell`}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white text-amber-800 font-bold text-sm shadow-sm hover:bg-amber-50 active:scale-95 transition-all text-center shrink-0 font-switzer"
          >
            Play Spelling 🚀
          </Link>
        </div>

        {/* Section: Personal Living Stories (Generated Chapters) */}
        {personalStories.length > 0 && !timeIsUp && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-achiko text-2xl text-amber-900 flex items-center gap-2">
                <span>✨</span> Your Personal Stories
              </h2>
              <span className="text-xs text-amber-700 font-switzer">
                Written from your reading journey
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {personalStories.map((story) => (
                <button
                  key={story.id}
                  type="button"
                  disabled={!!startingStoryId}
                  onClick={() => void handleStartStory(story.id)}
                  className="bg-gradient-to-br from-amber-50 to-orange-50/80 rounded-3xl p-5 border-2 border-amber-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between active:scale-[0.99] disabled:opacity-60 relative overflow-hidden font-switzer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-4xl">{story.coverEmoji || "📖"}</span>
                      <span className="px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 border border-amber-300 text-[10px] font-bold uppercase tracking-wider">
                        Personal Chapter
                      </span>
                    </div>
                    <h3 className="font-achiko text-xl text-amber-950 mb-1">
                      {story.title}
                    </h3>
                    <p className="text-xs text-amber-800 mb-3 font-switzer">
                      About {story.estimatedMinutes} minutes
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className="inline-block py-2 px-4 rounded-xl text-xs font-bold bg-amber-500 text-white shadow-xs">
                      Read Personal Chapter →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Story Grid or Rest Card */}
        {timeIsUp ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-200 shadow-sm mb-8 font-switzer">
            <div className="text-5xl mb-3">🌟</div>
            <h2 className="font-achiko text-2xl text-amber-900 mb-2">
              Rest time
            </h2>
            <p className="text-gray-600 text-sm font-switzer">
              Your stories will be waiting tomorrow. Go play, snack, or hug
              someone you love.
            </p>
          </div>
        ) : (
          <section className="mb-8">
            <h2 className="font-achiko text-2xl text-amber-900 mb-4">
              📚 Story Library
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {catalogStories.map((story) => {
                const isStarting = startingStoryId === story.id;
                const isCompleted = completedStoryIds.has(story.id);

                return (
                  <button
                    key={story.id}
                    type="button"
                    disabled={!!startingStoryId}
                    onClick={() => void handleStartStory(story.id)}
                    className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between active:scale-[0.99] disabled:opacity-60 relative overflow-hidden font-switzer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-4xl">{story.coverEmoji}</span>
                        {isCompleted && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <span>Completed</span>
                            <span>✅</span>
                          </span>
                        )}
                      </div>
                      <h3 className="font-achiko text-xl text-amber-950 mb-1">
                        {story.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-1 font-switzer">
                        About {story.estimatedMinutes} minutes
                      </p>
                      <p className="text-xs font-bold text-amber-600 mb-4 font-switzer">
                        {storyFitLabel(story, child.reading_level || 3)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-1 font-switzer">
                      <span
                        className={`inline-block py-2 px-4 rounded-xl text-xs font-bold shadow-2xs ${
                          isCompleted
                            ? "bg-gray-100 text-gray-800"
                            : "bg-amber-500 text-white"
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
          </section>
        )}

        {/* Word Pocket (Divided into Practice Words vs Names & Places) */}
        {recentWords.length > 0 && (
          <section className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm font-switzer">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-achiko text-2xl text-amber-900">
                  🎒 Word Pocket
                </h2>
                <p className="text-xs text-gray-500 font-switzer">
                  Tap any word to hear how it sounds
                </p>
              </div>
              <Link
                href={`/kid/${child.id}/spell`}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 font-switzer"
              >
                Spell these →
              </Link>
            </div>

            {/* Sub-section: Vocabulary Practice Words */}
            {vocabularyWords.length > 0 && (
              <div className="mb-4">
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-2">
                  Vocabulary Words
                </p>
                <div className="flex flex-wrap gap-2">
                  {vocabularyWords.map((item) => {
                    const isSpeaking = activeSpeakingWord === item.word;
                    return (
                      <button
                        key={item.word}
                        type="button"
                        onClick={() => handleSpeakWord(item.word)}
                        className={`px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isSpeaking
                            ? "bg-amber-200 border-amber-400 text-amber-950 scale-95"
                            : "bg-amber-50/80 border-amber-200 text-amber-900 hover:bg-amber-100"
                        }`}
                      >
                        <span>{item.display}</span>
                        <span className="text-[10px] text-amber-500">🔊</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-section: Names & Places */}
            {nameWords.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Names & Places
                </p>
                <div className="flex flex-wrap gap-2">
                  {nameWords.map((item) => {
                    const isSpeaking = activeSpeakingWord === item.word;
                    return (
                      <button
                        key={item.word}
                        type="button"
                        onClick={() => handleSpeakWord(item.word)}
                        className={`px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isSpeaking
                            ? "bg-slate-200 border-slate-400 text-slate-900 scale-95"
                            : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        <span>{item.display}</span>
                        <span className="text-[10px] text-slate-400">🔊</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600 font-medium">
                          Name
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Parent PIN Lock Gate Modal */}
      <ParentGate
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        onSuccess={() => {
          setGateOpen(false);
          router.push("/parent");
        }}
      />

      {/* Free Plan Monthly Limit Modal */}
      {limitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 font-switzer">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-gray-100">
            <div className="text-4xl mb-3">🌟</div>
            <h3 className="font-achiko text-xl text-amber-900 mb-2">
              Story Goal Reached!
            </h3>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed font-switzer">
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
                className="w-full py-3 rounded-2xl bg-amber-500 text-white font-bold text-xs shadow-sm hover:bg-amber-600 font-switzer"
              >
                Ask Parent to Unlock ✨
              </button>
              <button
                type="button"
                onClick={() => setLimitModalOpen(false)}
                className="w-full py-2.5 rounded-2xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 font-switzer"
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