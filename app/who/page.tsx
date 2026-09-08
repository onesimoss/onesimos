"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getChildrenForParent,
  verifyChildPin,
  setKidSession,
  type ChildProfile,
} from "@/lib/children";
import { getAvatarById } from "@/lib/avatars";

export default function WhoIsReadingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [fetching, setFetching] = useState(true);
  const [selected, setSelected] = useState<ChildProfile | null>(null);
  const [pin, setPin] = useState("");
  const [checking, setChecking] = useState(false);
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
      setFetching(false);

      if (data.length === 0) {
        router.replace("/onboarding");
      }
    }
    load();
  }, [user, router]);

  const handleSelect = (child: ChildProfile) => {
    setSelected(child);
    setPin("");
    setError("");
  };

  const handleUnlock = async () => {
    if (!selected) return;
    setChecking(true);
    setError("");

    const result = await verifyChildPin(selected.id, pin);
    setChecking(false);

    if (!result.ok) {
      setError(result.error?.message || "That PIN doesn't match. Try again.");
      setPin("");
      return;
    }

    setKidSession(selected.id);
    router.push(`/kid/${selected.id}`);
  };

  if (loading || fetching || !user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-sky-light to-cream flex items-center justify-center">
        <p className="font-heading text-bark-muted text-xl">Loading friends...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-light via-cream to-gold-light">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/dashboard"
            className="text-sm font-bold text-bark-muted hover:text-bark"
          >
            ← Parents
          </Link>
          <span className="font-logo text-2xl text-bark">Onesimos</span>
        </div>

        {!selected ? (
          <>
            <div className="text-center mb-10">
              <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-bark mb-3">
                Who&apos;s reading?
              </h1>
              <p className="text-bark-muted text-lg">
                Tap your face to start your adventure
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {children.map((child) => {
                const avatar = getAvatarById(child.avatar_id);
                return (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => handleSelect(child)}
                    className="card !p-5 text-center hover:shadow-hover hover:-translate-y-1 transition-all"
                  >
                    <div
                      className="w-24 h-24 mx-auto rounded-[1.5rem] overflow-hidden border-4 border-white shadow-soft mb-3 bg-cream"
                      style={{ backgroundColor: `${avatar.color}33` }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={avatar.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-heading text-xl font-bold text-bark">
                      {child.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setPin("");
                setError("");
              }}
              className="text-sm font-bold text-bark-muted hover:text-bark mb-6"
            >
              ← Back to faces
            </button>

            <div className="card text-center !p-8">
              {(() => {
                const avatar = getAvatarById(selected.avatar_id);
                return (
                  <div
                    className="w-28 h-28 mx-auto rounded-[2rem] overflow-hidden border-4 border-white shadow-soft mb-4 bg-cream"
                    style={{ backgroundColor: `${avatar.color}33` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatar.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })()}

              <h1 className="font-heading text-3xl font-extrabold text-bark mb-2">
                Hi, {selected.name}!
              </h1>
              <p className="text-bark-muted mb-6">
                {selected.kid_pin
                  ? "Enter your secret 4-digit code"
                  : "No PIN yet — ask a parent to set one. You can continue for now."}
              </p>

              {selected.kid_pin ? (
                <>
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    value={pin}
                    onChange={(e) =>
                      setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && pin.length === 4) {
                        void handleUnlock();
                      }
                    }}
                    placeholder="••••"
                    className="w-full px-4 py-4 rounded-2xl border border-border bg-cream text-center text-3xl tracking-[0.6em] font-bold focus:outline-none focus:ring-2 focus:ring-coral/40 mb-4"
                    autoFocus
                  />

                  {error && (
                    <p className="text-coral text-sm font-bold mb-4">{error}</p>
                  )}

                  <button
                    type="button"
                    onClick={handleUnlock}
                    disabled={checking || pin.length !== 4}
                    className="btn-primary w-full !py-3 disabled:opacity-50"
                  >
                    {checking ? "Checking..." : "Let's read!"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleUnlock}
                  disabled={checking}
                  className="btn-primary w-full !py-3"
                >
                  {checking ? "Opening..." : "Continue"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}