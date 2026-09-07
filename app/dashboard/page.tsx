"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/components/LogoutButton";
import { getChildrenForParent, type ChildProfile } from "@/lib/children";
import { getAvatarById } from "@/lib/avatars";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [fetching, setFetching] = useState(true);

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
      setFetching(false);

      if (data.length === 0) {
        router.replace("/onboarding");
      }
    }
    load();
  }, [user, router]);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => {
            const avatar = getAvatarById(child.avatar_id);
            return (
              <div key={child.id} className="card hover:shadow-hover transition-all">
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border border-border"
                    style={{ backgroundColor: `${avatar.color}22` }}
                  >
                    {avatar.emoji}
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-bold text-bark">
                      {child.name}
                    </h2>
                    <p className="text-sm text-bark-muted">
                      Age {child.age} · Level {child.reading_level}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-bark-muted">Curriculum</span>
                    <span className="font-bold text-bark capitalize">
                      {child.curriculum}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-bark-muted">Session</span>
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

                <div className="flex gap-2">
                  <Link
                    href={`/kid/${child.id}`}
                    className="btn-primary flex-1 !py-2.5 !text-sm text-center"
                  >
                    Open kid view
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {children.length === 0 && (
          <div className="card text-center py-16">
            <p className="text-bark-muted mb-4">No child profiles yet.</p>
            <Link href="/onboarding" className="btn-primary inline-flex">
              Create first profile
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}