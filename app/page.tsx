"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const FEATURES = [
  {
    icon: "📖",
    title: "Interactive Stories",
    desc: "Kids read aloud while Onesimos listens, gently helps with tricky words, and celebrates every page turned.",
    color: "bg-sky-light",
  },
  {
    icon: "🎯",
    title: "Personalized Learning",
    desc: "Every child gets their own stories, tailored to their level, interests, and the words they're still learning.",
    color: "bg-gold-light",
  },
  {
    icon: "🧩",
    title: "Comprehension Quests",
    desc: "After each story, playful questions make sure your child truly understood the adventure.",
    color: "bg-mint-light",
  },
  {
    icon: "🏆",
    title: "Streaks & Badges",
    desc: "Daily reading streaks, achievement badges, and a growing word bank keep motivation soaring.",
    color: "bg-sky-light",
  },
];

const STEPS = [
  { num: "1", emoji: "👨‍👩‍👧", title: "Create a Profile", desc: "Set up your child's avatar, age, and reading level in under a minute." },
  { num: "2", emoji: "📚", title: "Pick a Story",     desc: "Choose from themed adventures — dinosaurs, space, fantasy, and more." },
  { num: "3", emoji: "🎙️", title: "Read Aloud",       desc: "Your child reads while Onesimos listens and gently guides them." },
  { num: "4", emoji: "🎉", title: "Celebrate!",       desc: "Earn badges, unlock new stories, and watch confidence soar." },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="min-h-screen w-full overflow-x-hidden">

      {/* ============================================ */}
      {/* HERO SECTION                                  */}
      {/* ============================================ */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-berry via-purple-600 to-indigo-700">

        {/* Background Illustration */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/background.png"
            alt="Onesimos magical background"
            fill
            priority
            className="object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-transparent to-indigo-900/60" />
        </div>

        {/* Floating Decorations */}
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-60 hidden md:block">⭐</div>
        <div className="absolute top-40 right-16 text-5xl animate-float-slow opacity-50 hidden md:block">🌙</div>
        <div className="absolute bottom-32 left-20 text-4xl animate-wiggle opacity-40 hidden md:block">📚</div>
        <div className="absolute bottom-20 right-10 text-5xl animate-float opacity-50 hidden md:block">✨</div>

        {/* Navigation */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled
              ? "bg-white/90 backdrop-blur-xl shadow-soft py-3"
              : "bg-transparent py-5"
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
            <Link href="/" className="font-logo text-3xl md:text-4xl tracking-tight">
              <span className={scrolled ? "text-coral" : "text-white"}>
                Onesimos
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                  scrolled
                    ? "text-bark hover:bg-cream"
                    : "text-white hover:bg-white/15"
                }`}
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="btn-primary !py-2 !px-5 !text-sm"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-20 animate-fade-up">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full glass text-white/90 text-sm font-semibold">
            🎯 Designed for Ages 3–9
          </div>

          {/* ACHIKO LOGO TITLE (no font-black/font-extrabold classes to avoid breaking the font) */}
          <h1 className="font-logo text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white mb-6 leading-[0.95] drop-shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            ONESIMOS
          </h1>

          <p className="font-heading text-lg sm:text-xl md:text-2xl text-white/95 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            A playful reading platform where kids unlock incredible stories,
            conquer tricky words, and build a{" "}
            <span className="text-gold font-bold">lifelong love for reading</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn-gold !text-lg !px-10 !py-4">
              🚀 Start Reading Free
            </Link>
            <Link
              href="#how-it-works"
              className="btn-secondary !bg-white/10 !text-white !border-white/30 hover:!bg-white/20 !text-lg !px-10 !py-4"
            >
              See How It Works
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-white/90 text-sm font-bold">
            <span className="flex items-center gap-1.5">🛡️ Kid-Safe</span>
            <span className="flex items-center gap-1.5">🚫 No Ads Ever</span>
            <span className="flex items-center gap-1.5">🔒 Private & Secure</span>
            <span className="flex items-center gap-1.5">💯 Free to Start</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-bark mb-4">
              Everything Your Child Needs to <span className="text-coral">Fall in Love</span> with Reading
            </h2>
            <p className="text-bark-muted text-lg max-w-2xl mx-auto">
              Onesimos turns every reading session into a personal adventure — built around your child.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="card group hover:shadow-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform`}
                >
                  {f.icon}
                </div>
                <h3 className="font-heading text-2xl font-bold text-bark mb-2">
                  {f.title}
                </h3>
                <p className="text-bark-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 bg-parchment">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-bark mb-4">
              Up & Running in <span className="text-gold">4 Easy Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-5 bg-cream rounded-3xl shadow-soft border border-border flex items-center justify-center text-4xl group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                  {s.emoji}
                </div>
                <div className="inline-block px-3 py-0.5 bg-coral text-white text-xs font-bold rounded-full mb-3">
                  Step {s.num}
                </div>
                <h3 className="font-heading text-xl font-bold text-bark mb-2">
                  {s.title}
                </h3>
                <p className="text-bark-muted text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 bg-gradient-to-br from-berry to-indigo-700 relative overflow-hidden">
        <div className="absolute top-10 left-10 text-7xl opacity-20 animate-float">📖</div>
        <div className="absolute bottom-10 right-10 text-7xl opacity-20 animate-float-slow">🌟</div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-heading text-4xl md:text-6xl font-extrabold text-white mb-6">
            Ready to Start the Adventure?
          </h2>
          <p className="text-white/80 text-xl mb-10 max-w-xl mx-auto">
            Join families making reading the best part of their day.
          </p>
          <Link href="/signup" className="btn-gold !text-xl !px-12 !py-5">
            🎉 Create Free Account
          </Link>
          <p className="text-white/50 text-sm mt-4">
            No credit card required · Set up in 60 seconds
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-bark text-white/60 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-logo text-3xl text-white">
            Onesimos
          </div>
          <div className="flex gap-8 text-sm">
            <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
            <Link href="/login" className="hover:text-white transition-colors">Log In</Link>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} Onesimos. Made with ❤️ for little readers.</p>
        </div>
      </footer>
    </main>
  );
}