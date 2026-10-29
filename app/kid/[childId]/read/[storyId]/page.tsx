/**
 * @file app/kid/[childId]/read/[storyId]/page.tsx
 * @description 3D Claymorphic Reader Screen — Matter Styling Benchmark.
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { getAvatarById } from "@/lib/avatars";
import { getAgeBand, type ChildProfile } from "@/lib/children";
import { getStoryById, type SampleStory } from "@/lib/sampleStories";
import { saveStumbledWord } from "@/lib/stumbledWords";
import ReadingTimer from "@/components/ReadingTimer";
import ReadAloudMic from "@/components/ReadAloudMic";
import PipCompanion from "@/components/PipCompanion";

function renderPageText(text: string, softWords: string[]): React.ReactNode {
  if (!softWords.length) return text;
  const lowerSet = new Set(softWords.map((w) => w.toLowerCase()));
  const tokens = text.split(/(\s+)/);

  return tokens.map((part, index) => {
    const cleaned = part.toLowerCase().replace(/[^\w'-]/g, "");
    if (cleaned && lowerSet.has(cleaned)) {
      return (
        <span
          key={index}
          className="rounded-xl bg-amber-200/90 px-2 py-1 border-2 border-amber-400 font-black text-amber-950 shadow-md font-switzer inline-block transform hover:scale-105 transition-transform"
        >
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function KidReadPage() {
  const { childId, storyId } = useParams<{ childId: string; storyId: string }>();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [child, setChild] = useState<ChildProfile | null>(null);
  const [story, setStory] = useState<SampleStory | null>(null);
  const [fetching, setFetching] = useState(true);

  const [pageIndex, setPageIndex] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [highlightWords, setHighlightWords] = useState<string[]>([]);
  const [storyNotFound, setStoryNotFound] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTabPaused, setIsTabPaused] = useState(false);
  const [pipSeeds, setPipSeeds] = useState(4);

  useEffect(() => {
    const handleVisibility = () => setIsTabPaused(document.hidden);
    const handleBlur = () => setIsTabPaused(true);
    const handleFocus = () => setIsTabPaused(false);

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    if (!loading && !user) router.replace("/parent/login");
  }, [user, loading, router]);

  useEffect(() => {
    async function loadReaderData() {
      if (!user || !childId || !storyId) return;
      setFetching(true);

      const { data: childData } = await supabase
        .from("children")
        .select("*")
        .eq("id", childId)
        .eq("parent_id", user.id)
        .single();

      if (!childData) {
        router.replace("/who");
        return;
      }
      setChild(childData as ChildProfile);

      const catalogStory = getStoryById(storyId);
      if (catalogStory) {
        setStory(catalogStory);
        setFetching(false);
        return;
      }

      const { data: dbStory } = await supabase
        .from("generated_stories")
        .select("story_data")
        .eq("id", storyId)
        .single();

      if (!dbStory?.story_data) {
        setStoryNotFound(true);
      } else {
        setStory(dbStory.story_data as SampleStory);
      }

      setFetching(false);
    }

    void loadReaderData();
  }, [user, childId, storyId, router]);

  useEffect(() => {
    if (fetching || sessionEnded || !child || storyNotFound || isTabPaused) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [fetching, sessionEnded, child, storyNotFound, isTabPaused]);

  useEffect(() => {
    setHighlightWords([]);
    setPipSeeds((s) => s + 1);
  }, [pageIndex]);

  const handleTimeUp = useCallback(() => setSessionEnded(true), []);

  const finishReading = useCallback(() => {
    const finalSeconds = Math.max(1, elapsedSeconds);
    router.push('/kid/' + childId + '/summary?storyId=' + storyId + '&pages=' + (pageIndex + 1) + '&duration=' + finalSeconds);
  }, [childId, storyId, pageIndex, elapsedSeconds, router]);

  const handleMicResult = useCallback(
    (result: { transcript: string; stumbled: string[] }) => {
      if (!childId) return;
      setPipSeeds((s) => s + 2);
      if (result.stumbled.length) {
        setHighlightWords((prev) => Array.from(new Set([...prev, ...result.stumbled])));
        result.stumbled.forEach((word) => {
          void saveStumbledWord({ childId, storyId, word });
        });
      }
    },
    [childId, storyId]
  );

  const ageBand = useMemo(() => (child ? getAgeBand(child.age) : "emerging"), [child]);
  const isPreReader = ageBand === "pre-reader";

  if (loading || fetching || !child) {
    return (
      <main className="min-h-screen bg-[#F7F4EC] flex items-center justify-center font-switzer">
        <p className="font-extrabold text-amber-900 text-xl animate-pulse font-switzer">
          Opening storybook... 📖
        </p>
      </main>
    );
  }

  if (storyNotFound || !story) {
    return (
      <main className="min-h-screen bg-[#F7F4EC] flex items-center justify-center p-6 font-switzer">
        <div className="clay-3d-card p-8 text-center max-w-md">
          <p className="text-gray-700 font-bold mb-4">Story not found.</p>
          <button
            type="button"
            onClick={() => router.back()}
            className="clay-3d-btn-coral px-6 py-3 text-xs"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  const currentPage = story.pages[pageIndex];
  const totalPages = story.pages.length;
  const isLastPage = pageIndex >= totalPages - 1;
  const progressPercent = ((pageIndex + 1) / totalPages) * 100;
  const pageImage = (currentPage as { imageUrl?: string; image?: string }).imageUrl || (currentPage as { imageUrl?: string; image?: string }).image;

  return (
    <main className="min-h-screen bg-[#F7F4EC] flex flex-col font-switzer relative overflow-hidden">
      {/* Ambient 3D Clay Background Decorative Orbs */}
      <div className="absolute top-12 left-8 w-40 h-40 rounded-full bg-amber-200/40 blur-2xl ambient-clay-blob pointer-events-none" />
      <div className="absolute bottom-16 right-10 w-56 h-56 rounded-full bg-sky-200/40 blur-3xl ambient-clay-blob pointer-events-none" />

      {/* Pip Tab-Pause Banner */}
      {isTabPaused && (
        <div className="fixed inset-x-0 top-0 z-50 bg-amber-500 text-white px-4 py-3 text-center shadow-2xl font-switzer flex items-center justify-center gap-2 animate-bounce">
          <span className="text-2xl">🦜</span>
          <span className="text-xs sm:text-sm font-black tracking-wide">
            Pip paused the reading timer while you are away! Click back here to resume.
          </span>
        </div>
      )}

      {/* Reader Glossy Header Bar */}
      <header className="px-6 py-4 flex items-center justify-between gap-4 border-b-2 border-amber-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-20 font-switzer shadow-sm">
        <Link
          href={'/kid/' + childId}
          className="clay-3d-btn-white px-4 py-2 text-xs font-bold flex items-center gap-1.5"
        >
          <span>←</span> Back
        </Link>

        <div className="flex-1 max-w-sm text-center">
          <p className="text-xs font-black text-amber-950 truncate mb-1.5 font-switzer">
            {story.title}
          </p>
          <div className="w-full bg-amber-100 rounded-full h-3 overflow-hidden border border-amber-200 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500 shadow-sm"
              style={{ width: progressPercent + '%' }}
            />
          </div>
        </div>

        <div className="shrink-0">
          <ReadingTimer
            childId={child.id}
            allowedMinutes={child.session_minutes || 20}
            onTimeUp={handleTimeUp}
            age={child.age}
            isExternalPaused={isTabPaused}
          />
        </div>
      </header>

      {/* Reader Main 3D Canvas */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between font-switzer relative z-10">
        <div className="clay-3d-card p-6 sm:p-12 my-auto text-center flex flex-col items-center relative">
          
          {/* Pip Companion - Prominently Displayed 3D Tactile Pill */}
          <div className="absolute right-4 top-4 sm:right-8 sm:top-8 z-30">
            <PipCompanion
              childName={child.name}
              isPaused={isTabPaused}
              seeds={pipSeeds}
              onFeed={() => setPipSeeds((s) => Math.max(0, s - 1))}
            />
          </div>

          {/* 3D Story Visual Frame */}
          <div className={'w-full max-w-md clay-3d-frame overflow-hidden mb-8 flex items-center justify-center ' + (isPreReader ? 'h-60 sm:h-80 text-8xl' : 'h-52 sm:h-72 text-7xl')}>
            {pageImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pageImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <span>{currentPage.imageEmoji || story.coverEmoji || "📖"}</span>
            )}
          </div>

          {/* Story Text */}
          <div className={'font-bold text-gray-900 leading-relaxed tracking-wide max-w-2xl mb-8 font-switzer ' + (isPreReader ? 'text-2xl sm:text-3xl md:text-4xl leading-loose' : 'text-xl sm:text-3xl')}>
            {renderPageText(currentPage.text, highlightWords)}
          </div>

          {/* Interactive Mic Button */}
          <div className="pt-2 w-full max-w-md">
            <ReadAloudMic
              childId={child.id}
              storyId={story.id}
              pageText={currentPage.text}
              onResult={handleMicResult}
            />
          </div>
        </div>

        {/* Story Pagination Navigation Footer */}
        <footer className="pt-6 pb-2 flex items-center justify-between gap-4 font-switzer">
          <button
            type="button"
            disabled={pageIndex === 0}
            onClick={() => setPageIndex((prev) => Math.max(0, prev - 1))}
            className="clay-3d-btn-white px-6 py-3.5 text-xs font-black disabled:opacity-30"
          >
            ← Previous
          </button>

          <span className="text-xs font-black text-amber-900/60 font-switzer">
            Page {pageIndex + 1} of {totalPages}
          </span>

          {!isLastPage ? (
            <button
              type="button"
              onClick={() => setPageIndex((prev) => Math.min(totalPages - 1, prev + 1))}
              className="clay-3d-btn-dark px-8 py-3.5 text-xs font-black"
            >
              Next Page →
            </button>
          ) : (
            <button
              type="button"
              onClick={finishReading}
              className="clay-3d-btn-coral px-8 py-4 text-xs font-black flex items-center gap-2"
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
