"use client";

import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/lib/themes";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const currentTheme = themes[theme] || themes.dinosaurs;
  const { user } = useAuth();

  return (
    <main 
      className="min-h-screen flex items-center justify-center p-6 transition-colors duration-300 relative"
      style={{ background: currentTheme.background }}
    >
      {/* Auth Buttons - Top Right */}
      <div className="absolute top-4 right-4 flex gap-2">
        {user ? (
          <Link
            href="/dashboard"
            className="text-sm bg-[#b28b6a] text-white px-4 py-1 rounded-full hover:shadow-xl transition-all"
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm text-[#4a423b] hover:text-[#b28b6a] transition-colors px-3 py-1"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-[#b28b6a] text-white px-4 py-1 rounded-full hover:shadow-xl transition-all"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

      <div 
        className="max-w-4xl w-full rounded-3xl shadow-xl p-12 border transition-colors duration-300"
        style={{ 
          background: currentTheme.card,
          borderColor: currentTheme.accentLight,
          color: currentTheme.primary
        }}
      >
        {/* Theme Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {Object.entries(themes).map(([key, t]) => (
            <button
              key={key}
              onClick={() => setTheme(key as keyof typeof themes)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                theme === key 
                  ? 'ring-2 ring-offset-2' 
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                background: t.accent,
                color: key === "space" || key === "fantasy" ? "#fff" : t.primary,
              }}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: currentTheme.primary }}>
            Onesimos
          </h1>
          <span 
            className="text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-full border"
            style={{
              color: currentTheme.muted,
              borderColor: currentTheme.accentLight,
              background: currentTheme.accentLight + '33'
            }}
          >
            The Useful Tutor
          </span>
        </div>

        {/* Hero */}
        <div className="mb-12 text-center">
          <h2 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-4" style={{ color: currentTheme.primary }}>
            Read aloud.
            <br />
            <span style={{ color: currentTheme.accent }}>Get better.</span> Quietly.
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: currentTheme.secondary }}>
            A tutor that never tests, never pushes, and never lets a child feel like school.
            Just 20 minutes a night.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mb-16">
          <Link
            href="/phonics"
            className="inline-block px-12 py-4 rounded-full text-lg font-medium hover:shadow-xl transition-all hover:-translate-y-0.5"
            style={{
              background: currentTheme.accent,
              color: theme === "space" || theme === "fantasy" ? "#fff" : currentTheme.primary,
            }}
          >
            🎯 Start Learning
          </Link>
          <p className="text-sm mt-3" style={{ color: currentTheme.muted }}>
            Start with Phonics, then unlock reading stories!
          </p>
        </div>

        {/* 🔥 Active Tabs - Functional */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Link href="/phonics" className="text-center hover:scale-105 transition-all group">
            <div className="text-3xl mb-2">🔤</div>
            <h3 className="font-semibold text-sm" style={{ color: currentTheme.primary }}>Phonics</h3>
            <p className="text-xs" style={{ color: currentTheme.muted }}>Learn letter sounds</p>
          </Link>
          <Link href="/read?child=" className="text-center hover:scale-105 transition-all group">
            <div className="text-3xl mb-2">📖</div>
            <h3 className="font-semibold text-sm" style={{ color: currentTheme.primary }}>Read</h3>
            <p className="text-xs" style={{ color: currentTheme.muted }}>Practice reading stories</p>
          </Link>
          <Link href="/character" className="text-center hover:scale-105 transition-all group">
            <div className="text-3xl mb-2">🧠</div>
            <h3 className="font-semibold text-sm" style={{ color: currentTheme.primary }}>Character</h3>
            <p className="text-xs" style={{ color: currentTheme.muted }}>Build good habits</p>
          </Link>
          <Link href="/dashboard" className="text-center hover:scale-105 transition-all group">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-sm" style={{ color: currentTheme.primary }}>Dashboard</h3>
            <p className="text-xs" style={{ color: currentTheme.muted }}>Track progress</p>
          </Link>
        </div>

        {/* Testimonial */}
        <div className="mt-12 pt-8 border-t text-center" style={{ borderColor: currentTheme.accentLight }}>
          <p className="italic text-sm max-w-lg mx-auto" style={{ color: currentTheme.secondary }}>
            "My 8-year-old reads every night without being asked. 
            He thinks he's just telling a computer about dinosaurs."
          </p>
          <p className="text-xs mt-2" style={{ color: currentTheme.muted }}>
            — Sarah, mom of 2
          </p>
        </div>
      </div>
    </main>
  );
}