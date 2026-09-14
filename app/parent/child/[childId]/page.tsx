/**
 * @file app/parent/child/[childId]/page.tsx
 * @description Dedicated Academic Progress Report Page for a single child profile.
 * Provides plain-language "Before & After" growth narratives, fluency (WPM),
 * accuracy, comprehension scores, vocabulary focus, session history, and the 
 * AI Living Story Book personal chapter generator engine with delete & preview controls.
 *
 * @dependencies
 * - @/context/AuthContext (parent authentication)
 * - @/lib/children (child profiles API, PINs)
 * - @/lib/avatars (avatar resolution)
 * - @/lib/stumbledWords (vocabulary practice list)
 * - @/lib/sessionInsights (sessions history & report card stats engine)
 * - @/lib/sessionBudget (reset test quota helper)
 * - @/lib/livingStory (AI chapter generator, retrieval & deletion)
 * - @/lib/lifeSkills (25 virtues & life skills lookup)
 * - @/lib/sampleStories (SampleStory types)
 */

"use client";

// ─── IMPORTS ────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { getAvatarById } from "@/lib/avatars";
import type { ChildProfile } from "@/lib/children";
import { setChildPin, deleteChild } from "@/lib/children";
import { getRecentStumbledWords, type StumbledWordCountItem } from "@/lib/stumbledWords";
import type { SampleStory } from "@/lib/sampleStories";
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
import {
  generateLivingChapterForChild,
  getGeneratedStoriesForChild,
  deleteGeneratedStory,
  extractSkillIdFromStory,
  extractTargetWordsFromStory,
} from "@/lib/livingStory";
import { getLifeSkillById } from "@/lib/lifeSkills";

// ─── HELPERS & NARRATIVE ENGINE ─────────────────────────────────────────────

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
  stumbledWords: StumbledWordCountItem[]
): { before: string; current: string; recommendation: string } {
  if (sessions.length === 0) {
    return {
      before: `${child.name} is just beginning their reading journey on Onesimos.`,
      current: `Current baseline level is Level ${child.reading_level || 2}. No read-aloud sessions recorded yet.`,
      recommendation: `Start by picking a Level ${child.reading_level || 2} story together. Reading aloud for just 10 minutes a day builds confidence quickly!`,
    };
  }

  const totalStories = stats.storiesFinished;

  const beforeText = `When ${child.name} started, baseline reading focused on Level ${
    child.reading_level || 2
  } decoding skills across initial story sessions.`;

  const currentText = `${child.name} has completed ${totalStories} story ${
    totalStories === 1 ? "session" : "sessions"
  }, reading at an average speed of ${stats.wordsPerMinute} WPM with ${
    stats.accuracyPercentage
  }% pronunciation accuracy and a ${
    stats.comprehensionPercentage
  }% comprehension score.`;

  let recommendationText = `Keep up the momentum! Reading 3 times a week maintains steady fluency gains.`;
  if (stumbledWords.length > 0) {
    const topWords = stumbledWords.slice(0, 3).map((w) => `"${w.display}"`).join(", ");
    recommendationText = `Focus on practice vocabulary like ${topWords} during warm-ups before starting a new story.`;
  }

  return {
    before: beforeText,
    current: currentText,
    recommendation: recommendationText,
  };
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function ChildReportPage(): JSX.Element {
  const params = useParams<{ childId: string }>();
  const childId = params.childId;
  const { user, loading } = useAuth();
  const router = useRouter();

  // Data States
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [sessions, setSessions] = useState<ReadingSessionRow[]>([]);
  const [practiceWords, setPracticeWords] = useState<StumbledWordCountItem[]>([]);
  const [generatedStories, setGeneratedStories] = useState<SampleStory[]>([]);
  const [stats, setStats] = useState<DetailedReportCardStats | null>(null);
  const [fetching, setFetching] = useState(true);

  // Settings & Controls States
  const [pinEdit, setPinEdit] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [pinSaving, setPinSaving] = useState(false);
  const [reminderSaving, setReminderSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [generatingChapter, setGeneratingChapter] = useState(false);
  const [deletingStoryId, setDeletingStoryId] = useState<string | null>(null);
  const [showConfirmDeleteChild, setShowConfirmDeleteChild] = useState(false);

  // Feedback Messages
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Auth Protection
  useEffect(() => {
    if (!loading && !user) router.replace("/parent/login");
  }, [user, loading, router]);

  // Load Child Data & Analytics
  useEffect(() => {
    async function loadChildReport(): Promise<void> {
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

      const [{ data: words }, { data: sessionData }, personalChapters] = await Promise.all([
        getRecentStumbledWords(profile.id, 12),
        getChildSessions(profile.id, 50),
        getGeneratedStoriesForChild(profile.id),
      ]);

      setPracticeWords(words || []);
      setSessions(sessionData || []);
      setGeneratedStories(personalChapters || []);
      setStats(computeReportCardStats(profile, sessionData || [], (words || []).length));

      setFetching(false);
    }

    void loadChildReport();
  }, [user, childId, router]);

  // Handlers
  const handleSaveKidPin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!user || !child) return;

    setPinSaving(true);
    setError("");
    setMessage("");

    const { error: pinErr } = await setChildPin(child.id, user.id, pinValue);
    setPinSaving(false);

    if (pinErr) {
      setError((pinErr as { message?: string }).message || "Could not save PIN.");
      return;
    }

    setChild((prev) => (prev ? { ...prev, kid_pin: pinValue.replace(/\D/g, "") } : prev));
    setPinEdit(false);
    setPinValue("");
    setMessage("Child PIN updated successfully.");
  };

  const handleGeneratePersonalChapter = async (): Promise<void> => {
    if (!child) return;
    setGeneratingChapter(true);
    setMessage("");
    setError("");

    try {
      const newStory = await generateLivingChapterForChild(child);
      setGeneratedStories((prev) => [newStory, ...prev]);
      setMessage(`✨ New personal chapter "${newStory.title}" created for ${child.name}!`);
    } catch {
      setError("Could not generate personal chapter. Please try again.");
    } finally {
      setGeneratingChapter(false);
    }
  };

  const handleDeletePersonalChapter = async (storyId: string): Promise<void> => {
    if (!child) return;
    setDeletingStoryId(storyId);
    setMessage("");
    setError("");

    const { error: delErr } = await deleteGeneratedStory(storyId, child.id);
    setDeletingStoryId(null);

    if (delErr) {
      setError("Could not delete personal chapter.");
      return;
    }

    setGeneratedStories((prev) => prev.filter((s) => s.id !== storyId));
    setMessage("Personal chapter deleted.");
  };

  const handleResetQuota = async (): Promise<void> => {
    if (!user || !child) return;
    setResetting(true);
    setMessage("");
    setError("");

    const { error: resetErr } = await resetChildStoryQuota(child.id, user.id);
    setResetting(false);

    if (resetErr) {
      setError("Could not reset monthly story limit.");
      return;
    }

    setMessage("Monthly story count reset! Child can read immediately.");
  };

  const handleDeleteChildProfile = async (): Promise<void> => {
    if (!user || !child) return;
    const { error: delErr } = await deleteChild(child.id, user.id);
    if (delErr) {
      setError("Could not delete child profile.");
      setShowConfirmDeleteChild(false);
      return;
    }
    router.replace("/parent");
  };

  if (loading || fetching || !child || !stats) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-switzer">
        <p className="font-bold text-gray-500 text-lg animate-pulse font-switzer">
          Loading report card...
        </p>
      </main>
    );
  }

  const avatar = getAvatarById(child.avatar_id);
  const narrative = generateProgressNarrative(child, stats, sessions, practiceWords);

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50/50 via-[#FDFBF7] to-amber-50/30 font-switzer pb-16">
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Top Bar Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/parent"
            className="text-xs font-bold text-gray-600 hover:text-gray-900 bg-white/80 px-3.5 py-1.5 rounded-full border border-gray-200 shadow-2xs font-switzer"
          >
            ← Back to Dashboard
          </Link>
          <span className="font-achiko text-3xl text-amber-900">Onesimos</span>
          <div className="w-24" />
        </div>

        {/* Feedback Banners */}
        {message && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-switzer">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold font-switzer">
            {error}
          </div>
        )}

        {/* Hero Profile Header */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-6">
          <div
            className="w-24 h-28 rounded-3xl overflow-hidden border-4 border-white shadow-md shrink-0 flex items-center justify-center"
            style={{ backgroundColor: `${avatar.color}33` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatar.imageUrl} alt={child.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <h1 className="font-achiko text-3xl sm:text-4xl text-amber-950">
                {child.name}&apos;s Academic Report
              </h1>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold font-switzer">
                Level {child.reading_level || 2}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-switzer">
              Age {child.age || 6} • Curriculum: {curriculumLabel(child.curriculum || "british")}
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={handleResetQuota}
              disabled={resetting}
              className="px-4 py-2 rounded-2xl bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 text-xs font-bold transition-all disabled:opacity-50 font-switzer"
            >
              {resetting ? "Resetting..." : "Reset Story Limit"}
            </button>
          </div>
        </section>

        {/* Narrative Growth Narrative Card */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8 font-switzer">
          <h2 className="font-achiko text-2xl text-amber-900 mb-4">
            📖 Reading Growth Narrative
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
              <p className="font-bold text-sky-900 mb-1">Starting Baseline:</p>
              <p>{narrative.before}</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <p className="font-bold text-emerald-900 mb-1">Current Mastery:</p>
              <p>{narrative.current}</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
              <p className="font-bold text-amber-900 mb-1">Parent Recommendation:</p>
              <p>{narrative.recommendation}</p>
            </div>
          </div>
        </section>

        {/* Key Academic Metrics Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 font-switzer">
          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs text-center">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Fluency Speed</p>
            <p className="font-achiko text-3xl text-amber-900">{stats.wordsPerMinute}</p>
            <p className="text-[10px] text-gray-400 font-bold mt-1">Words / Minute</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs text-center">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Accuracy</p>
            <p className="font-achiko text-3xl text-emerald-700">{stats.accuracyPercentage}%</p>
            <p className="text-[10px] text-gray-400 font-bold mt-1">Pronunciation</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs text-center">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Comprehension</p>
            <p className="font-achiko text-3xl text-indigo-700">{stats.comprehensionPercentage}%</p>
            <p className="text-[10px] text-gray-400 font-bold mt-1">Post-Story Quiz</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs text-center">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Reading Age</p>
            <p className="font-achiko text-3xl text-amber-900">{stats.estimatedReadingAge}</p>
            <p className="text-[10px] text-gray-400 font-bold mt-1">Estimated Level</p>
          </div>
        </section>

        {/* AI Living Story Book Engine (The Product Moat) */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50/80 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-sm mb-8 font-switzer">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-achiko text-2xl text-amber-950 flex items-center gap-2">
                <span>✨</span> The Living Story Book
              </h2>
              <p className="text-xs text-amber-800 font-switzer">
                Generates personal story chapters woven from {child.name}&apos;s real stumbled words and virtue skills.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleGeneratePersonalChapter()}
              disabled={generatingChapter}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all shrink-0 active:scale-95 disabled:opacity-50 font-switzer"
            >
              {generatingChapter ? "Weaving AI Chapter..." : "✨ Generate Personal Chapter"}
            </button>
          </div>

          {/* Generated Chapters List */}
          {generatedStories.length === 0 ? (
            <div className="bg-white/80 rounded-2xl p-6 text-center border border-amber-200">
              <p className="text-xs font-bold text-amber-900 font-switzer">
                No personal chapters generated yet! Tap above to create {child.name}&apos;s first custom chapter.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {generatedStories.map((story) => {
                const skillId = extractSkillIdFromStory(story);
                const skill = skillId ? getLifeSkillById(skillId) : null;
                const targetWords = extractTargetWordsFromStory(story);
                const isDeleting = deletingStoryId === story.id;

                return (
                  <div
                    key={story.id}
                    className="bg-white rounded-2xl p-4 border border-amber-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl shrink-0">{story.coverEmoji || "📖"}</span>
                      <div>
                        <h3 className="font-switzer font-extrabold text-base text-amber-950">
                          {story.title}
                        </h3>
                        
                        {/* Badges for Virtue Skill and Stumbled Words */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {skill && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                              {skill.emoji} {skill.title}
                            </span>
                          )}
                          {targetWords.map((word) => (
                            <span
                              key={word}
                              className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold"
                            >
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Parent Read-for-Fun Preview Button (No Mic / No Token Burn) */}
                      <Link
                        href={`/kid/${child.id}/read/${story.id}?mode=fun`}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all text-center"
                      >
                        Preview (No Mic) 📖
                      </Link>

                      {/* Parent Delete Story Button */}
                      <button
                        type="button"
                        onClick={() => void handleDeletePersonalChapter(story.id)}
                        disabled={isDeleting}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all text-xs font-bold disabled:opacity-50"
                        title="Delete Chapter"
                      >
                        {isDeleting ? "…" : "🗑️"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Practice Vocabulary Section */}
        {practiceWords.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8 font-switzer">
            <h2 className="font-achiko text-2xl text-amber-900 mb-2">
              🎒 Focus Practice Vocabulary
            </h2>
            <p className="text-xs text-gray-500 mb-4 font-switzer">
              Words {child.name} stumbled on during recent story sessions:
            </p>
            <div className="flex flex-wrap gap-2">
              {practiceWords.map((item) => (
                <span
                  key={item.word}
                  className="px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>{item.display}</span>
                  <span className="text-[10px] text-amber-600 font-bold">({item.count}x)</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Danger Zone: Child PIN & Profile Controls */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm font-switzer">
          <h2 className="font-achiko text-2xl text-amber-900 mb-4">
            ⚙️ Security & Profile Controls
          </h2>

          <div className="space-y-6">
            {/* Kid PIN Management */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <p className="font-bold text-xs text-gray-900">Child Lock PIN</p>
                <p className="text-xs text-gray-500">
                  {child.kid_pin ? `Current PIN: ${child.kid_pin}` : "No PIN set yet"}
                </p>
              </div>

              {!pinEdit ? (
                <button
                  type="button"
                  onClick={() => setPinEdit(true)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800"
                >
                  {child.kid_pin ? "Change PIN" : "Set Child PIN"}
                </button>
              ) : (
                <form onSubmit={handleSaveKidPin} className="flex items-center gap-2">
                  <input
                    type="password"
                    maxLength={4}
                    value={pinValue}
                    onChange={(e) => setPinValue(e.target.value)}
                    placeholder="4 digits"
                    className="w-24 px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-center"
                  />
                  <button
                    type="submit"
                    disabled={pinSaving || pinValue.length !== 4}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold disabled:opacity-50"
                  >
                    {pinSaving ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPinEdit(false)}
                    className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>

            {/* Delete Child Profile */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-xs text-rose-800">Delete Reader Profile</p>
                <p className="text-xs text-gray-500">
                  Permanently deletes {child.name}&apos;s profile, session logs, and personal chapters.
                </p>
              </div>

              {!showConfirmDeleteChild ? (
                <button
                  type="button"
                  onClick={() => setShowConfirmDeleteChild(true)}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold"
                >
                  Delete Profile
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void handleDeleteChildProfile()}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
                  >
                    Confirm Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmDeleteChild(false)}
                    className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}