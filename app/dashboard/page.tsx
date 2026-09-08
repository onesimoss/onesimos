"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/components/LogoutButton";
import {
  getChildrenForParent,
  deleteChild,
  type ChildProfile,
} from "@/lib/children";
import { getAvatarById } from "@/lib/avatars";
import { getRecentStumbledWords } from "@/lib/stumbledWords";

function curriculumLabel(value: string) {
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

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [practiceByChild, setPracticeByChild] = useState<
    Record<string, { word: string; count: number }[]>
  >({});
  const [fetching, setFetching] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setFetching(true);
      const { data } = await getChildrenForParent(user.id);
      setChildren(data);

      const practiceMap: Record<string, { word: string; count: number }[]> = {};
      await Promise.all(
        data.map(async (child) => {
          const { data: words } = await getRecentStumbledWords(child.id, 8);
          practiceMap[child.id] = words;
        })
      );
      setPracticeByChild(practiceMap);

      setFetching(false);

      if (data.length === 0) {
        router.replace("/onboarding");
      }
    }
    load();
  }, [user, router]);

  const handleDelete = async (child: ChildProfile) => {
    if (!user) return;
    setDeletingId(child.id);
    setError("");

    const { error: deleteError } = await deleteChild(child.id, user.id);
    setDeletingId(null);
    setConfirmId(null);

    if (deleteError) {
      setError(deleteError.message || "Could not remove profile. Try again.");
      return;
    }

    const next = children.filter((c) => c.id !== child.id);
    setChildren(next);

    if (next.length === 0) {
      router.replace("/onboarding");
    }
  };

  if (loading || fetching || !user) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-bark-muted font-heading">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream">
      <header className="border-b border-border bg-parchment/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="font-logo text-2xl text-bark">
            Onesimos
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-bark-muted">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-bark">
              Parent Dashboard
            </h1>
            <p className="text-bark-muted mt-1">
              Your family&apos;s reading hub
            </p>
          </div>
          <Link href="/onboarding" className="btn-primary !py-2.5 !px-5 !text-sm">
            + Add child
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-3 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => {
            const avatar = getAvatarById(child.avatar_id);
            const isConfirming = confirmId === child.id;
            const isDeleting = deletingId === child.id;
            const practice = practiceByChild[child.id] || [];

            return (
              <div key={child.id} className="card hover:shadow-hover transition-all">
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-16 h-16 rounded-2xl overflow-hidden border border-border bg-cream shrink-0"
                    style={{ backgroundColor: `${avatar.color}22` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatar.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-heading text-xl font-bold text-bark truncate">
                      {child.name}
                    </h2>
                    <p className="text-sm text-bark-muted">
                      Age {child.age} · Reading level {child.reading_level}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between gap-3">
                    <span className="text-bark-muted shrink-0">Curriculum</span>
                    <span className="font-bold text-bark text-right">
                      {curriculumLabel(child.curriculum)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-bark-muted">Daily time</span>
                    <span className="font-bold text-bark">
                      {child.session_minutes} min
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-bark-muted shrink-0">Interests</span>
                    <span className="font-bold text-bark text-right capitalize">
                      {(child.interests || []).join(", ") || "—"}
                    </span>
                  </div>
                </div>

                {/* Practice words — parent only, calm framing */}
                <div className="mb-5 rounded-2xl bg-cream border border-border p-3">
                  <p className="text-xs font-bold text-bark-muted mb-2 uppercase tracking-wide">
                    Words to practice
                  </p>
                  {practice.length === 0 ? (
                    <p className="text-sm text-bark-muted">
                      No practice list yet. It fills in when they read aloud.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {practice.map((item) => (
                        <span
                          key={item.word}
                          className="px-2.5 py-1 rounded-full bg-gold-light text-bark text-xs font-bold border border-border"
                          title={`Noticed ${item.count} time(s)`}
                        >
                          {item.word}
                          {item.count > 1 ? ` · ${item.count}` : ""}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {!isConfirming ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/kid/${child.id}`}
                      className="btn-primary flex-1 !py-2.5 !text-sm text-center"
                    >
                      Open kid view
                    </Link>
                    <button
                      type="button"
                      onClick={() => setConfirmId(child.id)}
                      className="text-sm font-bold text-bark-muted hover:text-red-500 transition-colors py-2"
                    >
                      Remove profile
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-bark mb-3">
                      Remove <span className="font-bold">{child.name}</span>
                      &apos;s profile? You can add them again later.
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        disabled={isDeleting}
                        className="btn-secondary flex-1 !py-2 !text-sm"
                      >
                        Keep
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(child)}
                        disabled={isDeleting}
                        className="flex-1 !py-2 !text-sm font-bold rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        {isDeleting ? "Removing..." : "Yes, remove"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}