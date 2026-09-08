"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { getAvatarById } from "@/lib/avatars";
import type { ChildProfile } from "@/lib/children";
import { getStoryById } from "@/lib/sampleStories";
import ReadingTimer from "@/components/ReadingTimer";

export default function KidReadPage() {
  const { childId, storyId } = useParams<{ childId: string; storyId: string }>();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [child, setChild] = useState<ChildProfile | null>(null);
  const [fetching, setFetching] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);

  const story = useMemo(() => getStoryById(storyId), [storyId]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
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
        router.replace("/dashboard");
        return;
      }

      setChild(data as ChildProfile);
      setFetching(false);
    }
    load();
  }, [user, childId, router]);

  const handleTimeUp = useCallback(() => {
    setSessionEnded(true);
  }, []);

  const finishReading = () => {
    router.push(
      `/kid/${childId}/summary?storyId=${storyId}&pages=${pageIndex + 1}`
    );
  };

  if (loading || fetching || !child) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-sky-light to-cream flex items-center justify-center">
        <p className="font-heading text-bark-muted text-xl">Opening your story...</p>
      </main>
    );
  }

  if (!story) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="card text-center max-w-md">
          <p className="text-bark-muted mb-4">Story not found.</p>
          <Link href={`/kid/${childId}`} className="btn-primary inline-flex">
            Back to stories
          </Link>
        </div>
      </main>
    );
  }

  const avatar = getAvatarById(child.avatar_id);
  const page = story.pages[pageIndex];
  const isLastPage = pageIndex >= story.pages.length - 1;
  const progress = ((pageIndex + 1) / story.pages.length) * 100;

  if (sessionEnded) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gold-light to-cream flex items-center justify-center p-6">
        <div className="card max-w-md text-center !p-8">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="font-heading text-3xl font-extrabold text-bark mb-2">
            Time&apos;s up for today!
          </h1>
          <p className="text-bark-muted mb-6">
            Great reading, {child.name}. Your daily time is finished.
            Come back tomorrow for more adventures.
          </p>
          <button type="button" onClick={finishReading} className="btn-primary w-full">
            See my stars
          </button>
          <Link
            href={`/kid/${childId}`}
            className="block mt-4 text-sm font-bold text-bark-muted hover:text-bark"
          >
            Back home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-light via-cream to-parchment flex flex-col">
      <header className="px-4 py-3 flex items-center justify-between gap-3">
        <Link
          href={`/kid/${childId}`}
          className="text-sm font-bold text-bark-muted hover:text-bark shrink-0"
        >
          ← Exit
        </Link>

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-2xl shrink-0">{avatar.emoji}</span>
          <span className="font-heading font-bold text-bark truncate">
            {child.name}
          </span>
        </div>

        <ReadingTimer
          childId={child.id}
          allowedMinutes={child.session_minutes || 20}
          onTimeUp={handleTimeUp}
        />
      </header>

      <div className="px-6 mb-2">
        <div className="h-2 bg-border rounded-full overflow-hidden max-w-3xl mx-auto">
          <div
            className="h-full bg-coral rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-xs font-bold text-bark-muted mt-2">
          Page {pageIndex + 1} of {story.pages.length} · daily time left above
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl card !p-6 sm:!p-10 text-center">
          <p className="text-sm font-bold text-coral mb-2">{story.title}</p>

          {page.imageEmoji && (
            <div className="text-7xl sm:text-8xl mb-6 select-none">
              {page.imageEmoji}
            </div>
          )}

          <p className="font-heading text-2xl sm:text-3xl md:text-4xl leading-snug text-bark font-bold">
            {page.text}
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 pb-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={pageIndex === 0}
            className="btn-secondary !px-5 !py-3 !text-sm disabled:opacity-40"
          >
            ← Back
          </button>

          {!isLastPage ? (
            <button
              type="button"
              onClick={() => setPageIndex((p) => p + 1)}
              className="btn-primary !px-8 !py-3 !text-base"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={finishReading}
              className="btn-gold !px-8 !py-3 !text-base"
            >
              Finish story ⭐
            </button>
          )}
        </div>
      </div>
    </main>
  );
}