/**
 * @file app/kid/[childId]/summary/page.tsx
 * @description Kid Story Completion & Reading Summary Screen.
 * Displays stars earned, session statistics, practice vocabulary (gold chips),
 * and character/place names met (soft purple chips) with free tap-to-hear audio.
 *
 * @dependencies
 * - @/context/AuthContext (parent authentication)
 * - @/lib/stumbledWords (speech synthesis, token classification, recent word fetch)
 * - @/lib/sessionInsights (reading session logging for parent dashboard)
 */

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { getAvatarById } from "@/lib/avatars";
import type { ChildProfile } from "@/lib/children";
import { getStoryById } from "@/lib/sampleStories";
import { saveReadingSession } from "@/lib/sessionInsights";
import {
  getRecentStumbledWords,
  speakWord,
  extractClassifiedTokens,
  type StumbledItem,
} from "@/lib/stumbledWords";

// ─── Section 1: Helper Types & Functions ───

interface ProcessedSummaryWord {
  word: string;
  display: string;
  type: "word" | "name";
  count: number;
}

/**
 * Classifies raw stumbled words by cross-referencing story text or proper noun heuristics.
 */
function classifyStumbledList(
  rawWords: { word: string; count: number }[],
  storyText?: string
): ProcessedSummaryWord[] {
  const storyTokens = storyText ? extractClassifiedTokens(storyText) : [];
  const tokenMap = new Map<string, StumbledItem>();

  storyTokens.forEach((item) => {
    tokenMap.set(item.word.toLowerCase(), item);
  });

  return rawWords.map(({ word, count }) => {
    const lower = word.toLowerCase();
    const matched = tokenMap.get(lower);

    if (matched) {
      return {
        word: lower,
        display: matched.display,
        type: matched.type,
        count,
      };
    }

    // Default heuristic fallback if word wasn't in current story text
    const isCapitalized = /^[A-Z]/.test(word);
    const display = isCapitalized
      ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      : word;

    return {
      word: lower,
      display,
      type: isCapitalized ? "name" : "word",
      count,
    };
  });
}

// ─── Section 2: Summary Core Content ───

function SummaryContent() {
  const { childId } = useParams<{ childId: string }>();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const router = useRouter();

  const storyId = searchParams.get("storyId") || "";
  const pagesRead = Number(searchParams.get("pages") || "0");

  const [child, setChild] = useState<ChildProfile | null>(null);
  const [stumbledItems, setStumbledItems] = useState<ProcessedSummaryWord[]>([]);
  const [fetching, setFetching] = useState(true);
  const [saved, setSaved] = useState(false);
  const [activeSpeakingWord, setActiveSpeakingWord] = useState<string | null>(null);

  const story = useMemo(() => getStoryById(storyId), [storyId]);

  // Auth Protection
  useEffect(() => {
    if (!loading && !user) router.replace("/parent/login");
  }, [user, loading, router]);

  // Fetch Child Profile, Story Data & Stumbled Words Log
  useEffect(() => {
    async function loadSummaryData() {
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

      // Fetch recent stumbled words for this session
      const { data: recentWords } = await getRecentStumbledWords(profile.id, 10);
      const fullStoryText = story?.pages.map((p) => p.text).join(" ") || "";
      const classified = classifyStumbledList(recentWords, fullStoryText);
      setStumbledItems(classified);

      setFetching(false);

      // Save session stats to parent analytics (run once)
      const totalPages = story?.pages.length || pagesRead || 1;
      const completed = pagesRead >= totalPages;

      if (!saved) {
        await saveReadingSession({
          childId: profile.id,
          storyId: storyId || undefined,
          pagesRead: pagesRead || 0,
          durationSeconds: 0,
          completedStory: completed,
        });
        setSaved(true);
      }
    }

    void loadSummaryData();
  }, [user, childId, router, story, pagesRead, storyId, saved]);

  // Handle Tap-to-Hear Pronunciation
  const handleTapToHear = (text: string) => {
    setActiveSpeakingWord(text);
    speakWord(text);
    setTimeout(() => setActiveSpeakingWord(null), 1200);
  };

  if (loading || fetching || !child) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-3">
          <div className="text-4xl animate-bounce">🌟</div>
          <p className="font-extrabold text-gray-700 text-lg">Counting your stars...</p>
        </div>
      </main>
    );
  }

  const avatar = getAvatarById(child.avatar_id);
  const totalPages = story?.pages.length || pagesRead || 1;
  const completed = pagesRead >= totalPages;
  const stars = completed ? 3 : pagesRead >= Math.ceil(totalPages / 2) ? 2 : 1;

  const practiceWords = stumbledItems.filter((i) => i.type === "word");
  const characterNames = stumbledItems.filter((i) => i.type === "name");

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/60 via-[#FDFBF7] to-emerald-50/40 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl text-center">
        
        {/* Child Avatar & Headline */}
        <div
          className="w-20 h-20 mx-auto rounded-3xl overflow-hidden border-2 border-white shadow-md mb-4 flex items-center justify-center"
          style={{ backgroundColor: avatar.bgColor || "#FEF3C7" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar.src}
            alt={avatar.alt}
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
          Amazing, {child.name}!
        </h1>
        <p className="text-gray-500 text-sm font-medium mb-6">
          {completed
            ? "You finished the whole story!"
            : "Great reading effort today!"}
        </p>

        {/* Stars Celebration */}
        <div className="flex justify-center items-center gap-3 text-5xl mb-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <span
              key={index}
              className={`transition-all transform ${
                index < stars
                  ? "scale-110 drop-shadow-md text-amber-400"
                  : "opacity-20 grayscale"
              }`}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Story Progress Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-xs font-bold text-gray-700 mb-8">
          <span>📖</span> {pagesRead} of {totalPages} pages read
        </div>

        {/* ─── Section 3: Stumbled Items Display (Tap-to-Hear) ─── */}
        <div className="space-y-5 text-left mb-8">
          
          {/* Practice Words (Warm Gold) */}
          {practiceWords.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/50">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🟡</span> Words to Practice
                </span>
                <span className="text-[10px] font-bold text-amber-700">
                  Tap to hear 🔊
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {practiceWords.map((item) => (
                  <button
                    key={item.word}
                    type="button"
                    onClick={() => handleTapToHear(item.display)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 border ${
                      activeSpeakingWord === item.display
                        ? "bg-amber-400 text-black border-amber-500 shadow-sm"
                        : "bg-white text-amber-950 border-amber-200 hover:bg-amber-100"
                    }`}
                  >
                    <span>{item.display}</span>
                    <span className="text-[10px] opacity-60">🔊</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Character & Place Names Met (Soft Purple) */}
          {characterNames.length > 0 && (
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/50">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🟣</span> Character & Place Names
                </span>
                <span className="text-[10px] font-bold text-purple-700">
                  Tap to hear 🔊
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {characterNames.map((item) => (
                  <button
                    key={item.word}
                    type="button"
                    onClick={() => handleTapToHear(item.display)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 border ${
                      activeSpeakingWord === item.display
                        ? "bg-purple-400 text-white border-purple-500 shadow-sm"
                        : "bg-white text-purple-950 border-purple-200 hover:bg-purple-100"
                    }`}
                  >
                    <span>{item.display}</span>
                    <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-md uppercase font-black">
                      Name
                    </span>
                    <span className="text-[10px] opacity-60">🔊</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/kid/${child.id}`}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-gray-900 text-white text-xs font-black hover:bg-black transition-colors shadow-md text-center"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/who"
            className="py-3.5 px-5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors text-center"
          >
            Switch Reader
          </Link>
        </div>

      </div>
    </main>
  );
}

// ─── Section 4: Suspense Wrapper Export ───

export default function SummaryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <p className="text-gray-400 font-bold text-sm animate-pulse">
            Loading summary...
          </p>
        </div>
      }
    >
      <SummaryContent />
    </Suspense>
  );
}