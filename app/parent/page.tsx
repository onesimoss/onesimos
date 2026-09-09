"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getParentPinStatus, setParentPin } from "@/lib/parentGate";

export default function ParentDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  // Parent PIN state
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState("");

  // Check auth and PIN status
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/parent/login");
      return;
    }

    if (user) {
      void checkPinStatus();
    }
  }, [user, authLoading, router]);

  const checkPinStatus = async () => {
    if (!user) return;
    const { hasPin: exists } = await getParentPinStatus(user.id);
    setHasPin(exists);
  };

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    setPinSuccess("");

    if (!user) {
      setPinError("Please log in to manage your parent code.");
      return;
    }

    if (newPin.length !== 4) {
      setPinError("Parent code must be exactly 4 digits.");
      return;
    }

    if (newPin !== confirmPin) {
      setPinError("Codes do not match. Please try again.");
      return;
    }

    setPinLoading(true);
    const result = await setParentPin(user.id, newPin);
    setPinLoading(false);

    if (result.error) {
      setPinError(result.error.message || "Failed to update code.");
      return;
    }

    setPinSuccess("Parent Unlock Code saved successfully!");
    setHasPin(true);
    setNewPin("");
    setConfirmPin("");

    setTimeout(() => {
      setShowPinModal(false);
      setPinSuccess("");
    }, 1500);
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/parent/login");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <p className="text-gray-500 font-semibold animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4 relative font-sans">
      {/* Back Button */}
      <Link
        href="/who"
        className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full shadow-md text-gray-600 font-semibold hover:bg-gray-50 transition-colors z-40 flex items-center gap-2 text-sm"
      >
        <span>←</span> Back to Child
      </Link>

      {/* Main Dashboard Container */}
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row mt-10">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-64 bg-[#FAFAFA] border-r border-gray-200 flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-[#FCE588] rounded-full flex items-center justify-center font-bold text-gray-800">
                O
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Onesimos</h1>
            </div>

            <nav className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-[#FDF6D8] rounded-xl text-gray-800 font-medium cursor-pointer border-l-4 border-yellow-400">
                <span>📖</span> Dashboard
              </div>
              <Link
                href="/who"
                className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors block"
              >
                <span>🎙️</span> Reading Sessions
              </Link>
              <Link
                href="/who"
                className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors block"
              >
                <span>👨‍👩‍👧</span> Child Profiles
              </Link>
            </nav>
          </div>

          <div className="space-y-2 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowPinModal(true)}
              className="w-full flex items-center justify-between p-3 text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors text-left font-medium text-sm"
            >
              <div className="flex items-center gap-3">
                <span>🔒</span> Parent PIN
              </div>
              {hasPin === false && (
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition-colors text-left font-medium text-sm"
            >
              <span>🚪</span> Log out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-[#FDFDFD] overflow-y-auto max-h-[90vh]">
          {/* PIN Setup Alert (shown only if parent has no PIN yet) */}
          {hasPin === false && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="text-sm font-bold text-amber-900">Set your 4-digit Parent Code</p>
                  <p className="text-xs text-amber-700">
                    Secure parent settings and profile switching with a private code.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPinModal(true)}
                className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors"
              >
                Set PIN
              </button>
            </div>
          )}

          {/* Top Header */}
          <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div className="w-full sm:w-1/3 bg-gray-100 rounded-full px-4 py-2 text-gray-400 text-sm">
              🔍 Search stories...
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPinModal(true)}
                className="px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {hasPin ? "Change PIN" : "Set PIN"}
              </button>
              <Link
                href="/who"
                className="bg-[#FCE588] text-black font-semibold px-6 py-2 rounded-full hover:bg-yellow-300 transition-colors text-sm"
              >
                + Start New Session
              </Link>
            </div>
          </header>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Reading Calendar */}
            <div className="bg-[#FAFAFA] p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-gray-800">Reading Log</h3>
                <div className="text-gray-400 cursor-pointer">❮ ❯</div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-500 mb-2">
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                  <div key={d} className="font-semibold">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-600">
                {Array.from({ length: 31 }, (_, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors ${
                      i === 2 ? "bg-[#FCE588] font-bold text-black" : ""
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Upcoming Reads */}
            <div className="bg-[#FAFAFA] p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-gray-800">Upcoming Stories (05)</h3>
                <span className="text-gray-400 cursor-pointer">⋮</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-500">📘</span>
                    <span className="font-medium text-gray-800">The Brave Little Falcon</span>
                  </div>
                  <span className="text-yellow-700 bg-yellow-100 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    Tonight
                  </span>
                </div>
                {[
                  "Journey to the Sunlit Hill",
                  "The Whispering River",
                  "Echoes of the Forest",
                  "The Starry Night Quest",
                ].map((title, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/60 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-3 text-gray-700">
                      <span className="text-gray-300">📖</span>
                      <span className="text-sm font-medium">{title}</span>
                    </div>
                    <span className="text-gray-400 text-xs">
                      {i === 0 ? "Tomorrow" : i === 1 ? "Wednesday" : "This week"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Reading Levels */}
            <div className="bg-[#FAFAFA] p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-gray-800">Reading Levels</h3>
                <span className="text-gray-400 cursor-pointer">⋮</span>
              </div>
              <div className="space-y-3">
                {[
                  ["🟢", "Level 1: Beginner"],
                  ["🟡", "Level 2: Developing"],
                  ["🔵", "Level 3: Confident"],
                  ["🟣", "Level 4: Advanced"],
                ].map((cat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-3 text-sm font-medium text-gray-800">
                      <span>{cat[0]}</span> {cat[1]}
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4: Reading Tracker */}
            <div className="bg-[#FAFAFA] p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-gray-800">Current Session</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FDF6D8] border-l-4 border-yellow-400">
                  <div className="flex items-center gap-3 font-semibold text-gray-800 text-sm">
                    ⏱ The Brave Little Falcon
                  </div>
                  <div className="font-bold text-sm text-gray-800">12m 45s</div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white shadow-sm">
                  <div className="flex items-center gap-3 text-gray-700 text-sm">
                    📊 Words per minute
                  </div>
                  <div className="text-gray-800 font-bold text-sm">84 WPM</div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white shadow-sm">
                  <div className="flex items-center gap-3 text-gray-700 text-sm">
                    🎯 Pronunciation Accuracy
                  </div>
                  <div className="text-emerald-600 font-bold text-sm">96%</div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar: Notes */}
        <aside className="hidden lg:block w-72 bg-[#FAFAFA] border-l border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-800">Parent Notes</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
              <p className="font-semibold text-sm text-gray-800">
                Pronunciation Growth <span className="text-gray-400 float-right">›</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Noticeable improvement on multi-syllable words today.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
              <p className="font-semibold text-sm text-gray-800">
                Recommended Focus <span className="text-gray-400 float-right">›</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Practice words with &quot;wh&quot; and &quot;th&quot; blends next.
              </p>
            </div>
            <button
              type="button"
              className="w-full text-left text-gray-500 hover:text-black p-2 text-sm font-medium transition-colors"
            >
              + Add note
            </button>
          </div>
        </aside>
      </div>

      {/* 4-Digit Parent PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-1">
              {hasPin ? "Change Parent PIN" : "Set Parent PIN"}
            </h3>
            <p className="text-gray-500 text-xs mb-6">
              Enter a secret 4-digit code to keep parent settings secure.
            </p>

            <form onSubmit={handleSavePin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 text-left mb-1">
                  New 4-Digit Code
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="••••"
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-gray-50 text-center text-2xl tracking-[0.4em] font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 text-left mb-1">
                  Confirm Code
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="••••"
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-gray-50 text-center text-2xl tracking-[0.4em] font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {pinError && (
                <p className="text-xs font-bold text-red-600 bg-red-50 py-2 px-3 rounded-xl">
                  {pinError}
                </p>
              )}

              {pinSuccess && (
                <p className="text-xs font-bold text-emerald-700 bg-emerald-50 py-2 px-3 rounded-xl">
                  {pinSuccess}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPinModal(false);
                    setPinError("");
                    setPinSuccess("");
                    setNewPin("");
                    setConfirmPin("");
                  }}
                  disabled={pinLoading}
                  className="flex-1 py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pinLoading || newPin.length !== 4 || confirmPin.length !== 4}
                  className="flex-1 py-2.5 rounded-2xl bg-[#FCE588] text-black text-xs font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50"
                >
                  {pinLoading ? "Saving..." : "Save Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}