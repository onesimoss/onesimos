"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/lib/themes";
import { supabase } from "@/lib/supabaseClient";
import { hasPassedPhonics, getChildReadingLevel } from "@/lib/dailyProgress";

export default function KidDashboard() {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dinosaurs;
  const router = useRouter();
  
  const [kidId, setKidId] = useState<string | null>(null);
  const [kidName, setKidName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [phonicsPassed, setPhonicsPassed] = useState(false);
  const [readingLevel, setReadingLevel] = useState(7);

  useEffect(() => {
    const id = sessionStorage.getItem("kidId");
    const name = sessionStorage.getItem("kidName");
    
    if (!id) {
      router.push("/kid-login");
      return;
    }

    setKidId(id);
    setKidName(name || "Reader");
    
    // Check phonics status
    const checkStatus = async () => {
      const passed = await hasPassedPhonics(id);
      setPhonicsPassed(passed);
      
      const level = await getChildReadingLevel(id);
      setReadingLevel(level);
      setIsLoading(false);
    };
    
    checkStatus();
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("kidId");
    sessionStorage.removeItem("kidName");
    router.push("/kid-login");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6" style={{ background: currentTheme.background }}>
        <div className="text-[#8a7e74]">Loading your reading world...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 transition-colors duration-300" style={{ background: currentTheme.background }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: currentTheme.primary }}>
              👋 Hi, {kidName}!
            </h1>
            <p className="text-sm" style={{ color: currentTheme.muted }}>
              Reading Level: {readingLevel}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border rounded-full text-sm font-medium transition-all hover:bg-black/5"
            style={{ borderColor: currentTheme.accentLight, color: currentTheme.muted }}
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phonics Card */}
          <Link
            href={phonicsPassed ? "#" : `/phonics?child=${kidId}`}
            className={`rounded-3xl shadow-xl p-8 transition-all hover:scale-[1.02] ${
              phonicsPassed ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ background: currentTheme.card }}
          >
            <div className="text-5xl mb-4">🔤</div>
            <h2 className="text-xl font-bold" style={{ color: currentTheme.primary }}>
              {phonicsPassed ? "✅ Phonics Complete!" : "Phonics Assessment"}
            </h2>
            <p className="text-sm" style={{ color: currentTheme.muted }}>
              {phonicsPassed 
                ? "You've mastered the sounds! Now read stories." 
                : "Learn letter sounds to unlock reading."}
            </p>
          </Link>

          {/* Reading Card */}
          <Link
            href={phonicsPassed ? `/read?child=${kidId}` : "#"}
            className={`rounded-3xl shadow-xl p-8 transition-all hover:scale-[1.02] ${
              !phonicsPassed ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ background: currentTheme.card }}
          >
            <div className="text-5xl mb-4">📖</div>
            <h2 className="text-xl font-bold" style={{ color: currentTheme.primary }}>
              {phonicsPassed ? "Read Stories" : "🔒 Locked"}
            </h2>
            <p className="text-sm" style={{ color: currentTheme.muted }}>
              {phonicsPassed 
                ? "Read 3 stories and answer questions!" 
                : "Complete Phonics first to unlock."}
            </p>
          </Link>

          {/* Character Building Card */}
          <Link
            href={`/character?child=${kidId}`}
            className="rounded-3xl shadow-xl p-8 transition-all hover:scale-[1.02]"
            style={{ background: currentTheme.card }}
          >
            <div className="text-5xl mb-4">🧠</div>
            <h2 className="text-xl font-bold" style={{ color: currentTheme.primary }}>
              Build Character
            </h2>
            <p className="text-sm" style={{ color: currentTheme.muted }}>
              Learn kindness, honesty, and courage.
            </p>
          </Link>

          {/* Interactive Clock Card */}
          <Link
            href="/clock"
            className="rounded-3xl shadow-xl p-8 transition-all hover:scale-[1.02]"
            style={{ background: currentTheme.card }}
          >
            <div className="text-5xl mb-4">🕐</div>
            <h2 className="text-xl font-bold" style={{ color: currentTheme.primary }}>
              Learn Time
            </h2>
            <p className="text-sm" style={{ color: currentTheme.muted }}>
              Interactive clock to learn time.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}