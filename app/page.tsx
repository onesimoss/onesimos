export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f2eb] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-[#fcf9f5] rounded-3xl shadow-xl p-12 border border-white/50 text-center">
        
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <h1 className="text-2xl font-semibold text-[#1e1916] tracking-tight">
            Onesimos
          </h1>
          <span className="text-xs font-medium text-[#8a7e74] uppercase tracking-wider bg-black/5 px-3 py-1 rounded-full border border-black/5">
            The Useful Tutor
          </span>
        </div>

        {/* Hero */}
        <div className="mb-12">
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-[#1e1916] leading-tight mb-4">
            Read aloud.
            <br />
            <span className="text-[#b28b6a]">Get better.</span> Quietly.
          </h2>
          <p className="text-[#4a423b] text-lg max-w-2xl mx-auto leading-relaxed">
            A tutor that never tests, never pushes, and never lets a child feel like school.
            Just 20 minutes a night.
          </p>
        </div>

        {/* CTA Button - CHANGED to /read */}
        <div className="text-center mb-16">
          <a
            href="/read"
            className="inline-block bg-[#1e1916] text-white px-12 py-4 rounded-full text-lg font-medium hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            🎯 Start Reading
          </a>
          <p className="text-[#8a7e74] text-sm mt-3">
            No credit card required • Cancel anytime
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">📖</div>
            <h3 className="font-semibold text-[#1e1916] text-sm">Reads Aloud</h3>
            <p className="text-[#8a7e74] text-xs">Every word, out loud</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎙️</div>
            <h3 className="font-semibold text-[#1e1916] text-sm">Listens</h3>
            <p className="text-[#8a7e74] text-xs">Catches every stumble</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-[#1e1916] text-sm">Tracks</h3>
            <p className="text-[#8a7e74] text-xs">Private parent log</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">❤️</div>
            <h3 className="font-semibold text-[#1e1916] text-sm">Builds Character</h3>
            <p className="text-[#8a7e74] text-xs">Compassion & resilience</p>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-12 pt-8 border-t border-black/5 text-center">
          <p className="text-[#4a423b] italic text-sm max-w-lg mx-auto">
            "My 8-year-old reads every night without being asked. 
            He thinks he's just telling a computer about dinosaurs."
          </p>
          <p className="text-[#8a7e74] text-xs mt-2">— Sarah, mom of 2</p>
        </div>
      </div>
    </main>
  );
}
"use client";

import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/lib/themes";
import Link from "next/link";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const currentTheme = themes[theme];

  return (
    <main 
      className="min-h-screen flex items-center justify-center p-6 transition-colors duration-300"
      style={{ background: currentTheme.background }}
    >
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
                ringColor: t.accent,
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
            href="/read"
            className="inline-block px-12 py-4 rounded-full text-lg font-medium hover:shadow-xl transition-all hover:-translate-y-0.5"
            style={{
              background: currentTheme.accent,
              color: theme === "space" || theme === "fantasy" ? "#fff" : currentTheme.primary,
            }}
          >
            🎯 Start Reading
          </Link>
          <p className="text-sm mt-3" style={{ color: currentTheme.muted }}>
            No credit card required • Cancel anytime
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "📖", label: "Reads Aloud", desc: "Every word, out loud" },
            { icon: "🎙️", label: "Listens", desc: "Catches every stumble" },
            { icon: "📊", label: "Tracks", desc: "Private parent log" },
            { icon: "❤️", label: "Builds Character", desc: "Compassion & resilience" },
          ].map((feature) => (
            <div key={feature.label} className="text-center">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-sm" style={{ color: currentTheme.primary }}>
                {feature.label}
              </h3>
              <p className="text-xs" style={{ color: currentTheme.muted }}>
                {feature.desc}
              </p>
            </div>
          ))}
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