"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { getAvatarById } from "@/lib/avatars";
import type { ChildProfile } from "@/lib/children";
import { getStoryById } from "@/lib/sampleStories";

function SummaryContent() {
  const { childId } = useParams<{ childId: string }>();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const router = useRouter();

  const storyId = searchParams.get("storyId") || "";
  const pagesRead = Number(searchParams.get("pages") || "0");

  const [child, setChild] = useState<ChildProfile | null>(null);
  const [fetching, setFetching] = useState(true);

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

  if (loading || fetching || !child) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gold-light to-cream flex items-center justify-center">
        <p className="font-heading text-bark-muted text-xl">Counting your stars...</p>
      </main>
    );
  }

  const avatar = getAvatarById(child.avatar_id);
  const totalPages = story?.pages.length || pagesRead || 1;
  const completed = pagesRead >= totalPages;
  const stars = completed ? 3 : pagesRead >= Math.ceil(totalPages / 2) ? 2 : 1;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gold-light via-cream to-mint-light flex items-center justify-center p-6">
      <div className="w-full max-w-md card text-center !p-8">
        <div className="text-6xl mb-3">{avatar.emoji}</div>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-bark mb-2">
          Amazing, {child.name}!
        </h1>
        <p className="text-bark-muted mb-6">
          {completed
            ? "You finished the whole story."
            : "You made great progress today."}
        </p>

        <div className="flex justify-center gap-2 text-4xl mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={i < stars ? "" : "opacity-25"}>
              ⭐
            </span>
          ))}
        </div>

        <div className="bg-cream rounded-2xl border border-border p-4 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-bark-muted">Story</span>
            <span className="font-bold text-bark">
              {story?.title || "Reading session"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-bark-muted">Pages</span>
            <span className="font-bold text-bark">
              {pagesRead} / {totalPages}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-bark-muted">Session</span>
            <span className="font-bold text-bark">
              {child.session_minutes} min max
            </span>
          </div>
        </div>

        <Link
          href={`/kid/${childId}`}
          className="btn-primary w-full !py-3 inline-flex justify-center"
        >
          Back to my stories
        </Link>

        <Link
          href="/dashboard"
          className="block mt-4 text-sm font-bold text-bark-muted hover:text-bark"
        >
          Parent dashboard
        </Link>
      </div>
    </main>
  );
}

export default function KidSummaryPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-cream flex items-center justify-center">
          <p className="text-bark-muted font-heading">Loading...</p>
        </main>
      }
    >
      <SummaryContent />
    </Suspense>
  );
}