/**
 * @file app/kid/[childId]/read/[storyId]/page.tsx
 * @description Kid Active Reading Screen — paginated story reader, real-time
 * speech recognition mic, word stumble logging, session timer, and celebration
 * transition to the summary screen upon story completion.
 *
 * @dependencies
 * - @/context/AuthContext (parent authentication)
 * - @/lib/sampleStories (story catalog and page text)
 * - @/lib/avatars (avatar color & image resolution)
 * - @/lib/stumbledWords (stumbled word logging)
 * - @/components/ReadingTimer (timed session budget countdown)
 * - @/components/ReadAloudMic (Deepgram speech transcription component)
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { getAvatarById } from "@/lib/avatars";
import type { ChildProfile } from "@/lib/children";
import { getStoryById } from "@/lib/sampleStories";
import { saveStumbledWord } from "@/lib/stumbledWords";
import ReadingTimer from "@/components/ReadingTimer";
import ReadAloudMic from "@/components/ReadAloudMic";

// ─── Section 1: Helper Text Highlights ───

/**
 * Renders story page text with soft warm gold highlights on stumbling words.
 */
function renderPageText(text: string, softWords: string[]): React.ReactNode {
  if (!softWords.length) {
    return text;
  }

  const lowerSet = new Set(softWords.map((w) => w.toLowerCase()));
  const tokens = text.split(/(\s+)/);

  return tokens.map((part, index) => {
    const cleaned = part.toLowerCase().replace(/[^\w'-]/g, "");
    if (cleaned && lowerSet.has(cleaned)) {
      return (
        <span
          key={index}
          className="rounded-lg bg-amber-100 px-1 py-0.5 border border-amber-300/60 font-bold text-amber-950"
        >
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

// ─── Section 2: Reader Component ───

export default function KidReadPage() {
  const { childId, storyId } = useParams<{ childId: string; storyId: string }>();
  const { user, loading } = useAuth();
  const router = useRouter();

  // Story & Child Data States
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [fetching, setFetching] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [highlightWords, setHighlightWords] = useState<string[]>([]);

  const story = useMemo(() => getStoryById(storyId), [storyId]);

  // Auth Protection
  useEffect(() => {
    if (!loading && !user) router.replace("/parent/login");
  }, [user, loading, router]);

  // Load Child Profile
  useEffect(() => {
    async function loadReaderData() {
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

      setChild(data as ChildProfile);
      setFetching(false);
    }

    void loadReaderData();
  }, [user, childId, router]);

  // Reset soft highlights when moving between story pages
  useEffect(() => {
    setHighlightWords([]);
  }, [pageIndex]);

  // Session Budget Expiration Callback
  const handleTimeUp = useCallback(() => {
    setSessionEnded(true);
  }, []);

  // Story Completion Redirect to Summary
  const finishReading = useCallback(() => {
    router.push(
      `/kid/${childId}/summary?storyId=${storyId}&pages=${pageIndex + 1}`
    );
  }, [childId, storyId, pageIndex, router]);

  // Handle results returned from ReadAloudMic
  const handleMicResult = useCallback(
    (result: { transcript: string; stumbled: string[] }) => {
      if (!childId || !result.stumbled.length) return;
      setHighlightWords((prev) => Array.from(new Set([...prev, ...result.stumbled])));

      // Save each stumbled word to DB in background
      result.stumbled.forEach((word) => {
        void saveStumbledWord({
          childId,
          storyId,
          word,
        });
      });
    },
    [childId, storyId]
  );

  if (loading || fetching || !child) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-sans">
        <p className="font-extrabold text-gray-500 text-lg animate-pulse">
          Opening your story...
        </p>
      </main>
    );
  }

  if (!story) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-md text-center max-w-md">
          <p className="text-gray-600 font-bold mb-4">Story not found.</p>
          <Link
            href={`/kid/${childId}`}
            className="px-6 py-3 rounded-2xl bg-coral text-white font-bold text-xs hover:bg-coral/90 transition-colors inline-block"
          >
            Back to Stories
          </Link>
        </div>
      </main>
    );
  }

  const avatar = getAvatarById(child.avatar_id);
  const currentPage = story.pages[pageIndex];
  const totalPages = story.pages.length;
  const isLastPage = pageIndex >= totalPages - 1;
  const progressPercent = ((pageIndex + 1) / totalPages) * 100;

  // Safe optional extraction for optional page illustration property
  const pageImage = (currentPage as { imageUrl?: string; image?: string }).imageUrl ||
                    (currentPage as { imageUrl?: string; image?: string }).image;

  // Session Budget Ended Screen
  if (sessionEnded) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-[#FDFBF7] flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center border border-gray-100 shadow-2xl">
          <div className="text-6xl mb-4">⏱️</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Time&apos;s Up for Today!
          </h1>
          <p className="text-gray-500 text-sm font-medium mb-6">
            Great reading, {child.name}. Your daily reading session is complete.
            Come back tomorrow for new adventures!
          </p>
          <button
            type="button"
            onClick={finishReading}
            className="w-full py-3.5 px-6 rounded-2xl bg-coral text-white text-xs font-black hover:bg-coral/90 transition-colors shadow-sm mb-3"
          >
            See My Stars ⭐
          </button>
          <Link
            href={`/kid/${childId}`}
            className="block text-xs font-bold text-gray-400 hover:text-gray-600"
          >
            Back Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50/50 via-[#FDFBF7] to-amber-50/30 flex flex-col font-sans">
      
      {/* ─── Section 3: Header & Progress Bar ─── */}
      <header className="px-6 py-4 flex items-center justify-between gap-4 border-b border-gray-100 bg-white/70 backdrop-blur-sm sticky top-0 z-20">
        <Link
          href={`/kid/${childId}`}
          className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1"
        >
          <span>←</span> Back
        </Link>

        {/* Story Title & Visual Progress */}
        <div className="flex-1 max-w-xs text-center">
          <p className="text-xs font-black text-gray-800 truncate mb-1">
            {story.title}
          </p>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-200/50">
            <div
              className="bg-coral h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Daily Reading Timer */}
        <div className="shrink-0">
          <ReadingTimer
            childId={child.id}
            allowedMinutes={child.session_minutes || 20}
            onTimeUp={handleTimeUp}
          />
        </div>
      </header>

      {/* ─── Section 4: Main Reading Card Area ─── */}
      <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl my-auto text-center flex flex-col items-center">
          
          {/* Story Image / Page Illustration */}
          <div className="w-full max-w-sm h-48 sm:h-64 rounded-2xl bg-amber-50/60 border border-amber-100/60 overflow-hidden mb-6 flex items-center justify-center text-7xl shadow-inner">
            {pageImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pageImage}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{story.coverEmoji || "📖"}</span>
            )}
          </div>

          {/* Page Reading Text */}
          <div className="text-xl sm:text-2xl font-bold text-gray-900 leading-relaxed tracking-wide max-w-xl mb-6">
            {renderPageText(currentPage.text, highlightWords)}
          </div>

          {/* Read Aloud Microphone Component */}
          <div className="pt-2 w-full">
            <ReadAloudMic
              childId={child.id}
              storyId={story.id}
              pageText={currentPage.text}
              onResult={handleMicResult}
            />
          </div>
        </div>

        {/* ─── Section 5: Bottom Navigation & Final Page CTA ─── */}
        <footer className="pt-4 pb-2 flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={pageIndex === 0}
            onClick={() => setPageIndex((prev) => Math.max(0, prev - 1))}
            className="px-5 py-3 rounded-2xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:hover:bg-white"
          >
            ← Previous
          </button>

          <span className="text-xs font-bold text-gray-400">
            Page {pageIndex + 1} of {totalPages}
          </span>

          {!isLastPage ? (
            <button
              type="button"
              onClick={() => setPageIndex((prev) => Math.min(totalPages - 1, prev + 1))}
              className="px-6 py-3 rounded-2xl bg-gray-900 text-white text-xs font-black hover:bg-black transition-colors shadow-sm"
            >
              Next Page →
            </button>
          ) : (
            <button
              type="button"
              onClick={finishReading}
              className="px-6 py-3.5 rounded-2xl bg-coral text-white text-xs font-black hover:bg-coral/90 transition-all shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <span>Finish Story</span>
              <span>⭐</span>
            </button>
          )}
        </footer>
      </div>
    </main>
  );
}