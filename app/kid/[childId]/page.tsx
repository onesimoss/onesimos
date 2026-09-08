"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { getAvatarById } from "@/lib/avatars";
import type { ChildProfile } from "@/lib/children";
import { getStoriesForChild } from "@/lib/sampleStories";

export default function KidHomePage() {
  const { childId } = useParams<{ childId: string }>();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [fetching, setFetching] = useState(true);

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

  const stories = useMemo(() => {
    if (!child) return [];
    return getStoriesForChild({
      readingLevel: child.reading_level || 3,
      interests: child.interests || [],
    });
  }, [child]);

  if (loading || fetching || !child) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-sky-light to-cream flex items-center justify-center">
        <p className="font-heading text-bark-muted text-xl">Getting ready...</p>
      </main>
    );
  }

  const avatar = getAvatarById(child.avatar_id);

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-light via-cream to-gold-light">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard"
            className="text-sm font-bold text-bark-muted hover:text-bark"
          >
            ← Parent dashboard
          </Link>
          <span className="font-logo text-2xl text-bark">Onesimos</span>
        </div>

        <div className="text-center mb-10">
          <div
            className="w-28 h-28 mx-auto rounded-[2rem] flex items-center justify-center text-6xl border-4 border-white shadow-soft mb-5"
            style={{ backgroundColor: `${avatar.color}33` }}
          >
            {avatar.emoji}
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-bark mb-2">
            Hi, {child.name}!
          </h1>
          <p className="text-bark-muted text-lg">
            Pick a story for today
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-white/80 border border-border text-bark font-bold text-sm">
            Level {child.reading_level} · {child.session_minutes} min
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/kid/${child.id}/read/${story.id}`}
              className="card hover:shadow-hover hover:-translate-y-1 transition-all text-left !p-5"
            >
              <div className="text-4xl mb-3">{story.coverEmoji}</div>
              <h2 className="font-heading text-xl font-bold text-bark mb-1">
                {story.title}
              </h2>
              <p className="text-sm text-bark-muted mb-4">
                ~{story.estimatedMinutes} min · Levels {story.levelMin}–
                {story.levelMax}
              </p>
              <span className="inline-flex btn-primary !py-2 !px-4 !text-sm">
                Read now
              </span>
            </Link>
          ))}
        </div>

        {stories.length === 0 && (
          <div className="card text-center py-10">
            <p className="text-bark-muted mb-2">No stories matched yet.</p>
            <p className="text-sm text-bark-muted">
              Try updating interests from onboarding, or we will add more stories soon.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="card text-center">
            <div className="text-2xl mb-1">⭐</div>
            <div className="font-heading font-bold text-bark">Streak</div>
            <div className="text-bark-muted text-sm">Coming soon</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl mb-1">📖</div>
            <div className="font-heading font-bold text-bark">Words</div>
            <div className="text-bark-muted text-sm">Coming soon</div>
          </div>
        </div>
      </div>
    </main>
  );
}