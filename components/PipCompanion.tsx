/**
 * @file components/PipCompanion.tsx
 * @description 3D Tactile Claymorphic Pip Mascot Companion.
 */

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface PipCompanionProps {
  childName: string;
  isPaused: boolean;
  seeds: number;
  onFeed: () => void;
  compact?: boolean;
}

export default function PipCompanion({
  childName,
  isPaused,
  seeds,
  onFeed,
  compact = false,
}: PipCompanionProps) {
  const [message, setMessage] = useState<string>("");
  const [isWiggling, setIsWiggling] = useState<boolean>(false);
  const [showHeart, setShowHeart] = useState<boolean>(false);

  const playChirp = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      osc.type = "sine";
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(3200, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }, []);

  const pipSpeak = useCallback((text: string) => {
    setMessage(text);
    playChirp();

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 2.0;
      utterance.rate = 1.35;
      window.speechSynthesis.speak(utterance);
    }
    setTimeout(() => setMessage(""), 4500);
  }, [playChirp]);

  useEffect(() => {
    if (isPaused) {
      setMessage("I paused the timer for you! Take your time.");
    }
  }, [isPaused]);

  const handleSquawk = () => {
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 600);
    const phrases = [
      "Squawk! Cheep! You are doing amazing!",
      "I love reading with you!",
      "Read out loud so I can chirp!",
      "Feed me a seed if you have one! 🌻",
    ];
    const pick = phrases[Math.floor(Math.random() * phrases.length)];
    pipSpeak(pick);
  };

  const handleFeedClick = () => {
    if (seeds <= 0) {
      pipSpeak("Read out loud to earn seeds! 🌻");
      return;
    }
    onFeed();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1200);
    pipSpeak("Yum yum! Thank you! 💚");
  };

  return (
    <div className="relative flex flex-col items-center select-none font-switzer z-30">
      {showHeart && (
        <div className="absolute -top-12 text-4xl animate-ping pointer-events-none z-50">
          💚
        </div>
      )}

      {message && (
        <div className="mb-3 max-w-[220px] bg-white border-2 border-amber-300 p-3 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 text-center relative z-40">
          <p className="text-xs font-black text-amber-950 font-switzer leading-tight">
            {message}
          </p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-r-2 border-b-2 border-amber-300 rotate-45" />
        </div>
      )}

      {/* 3D Clay Pip Mascot Button */}
      <div
        onClick={handleSquawk}
        className={`clay-3d-pip-card p-3.5 sm:p-4 flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 active:scale-90 ${
          isWiggling ? "animate-bounce" : "hover:scale-105"
        }`}
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/40 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner mb-1.5 border border-white/60">
          🦜
        </div>
        <span className="text-[10px] font-black text-amber-950 uppercase tracking-widest font-switzer">
          Pip Buddy
        </span>
      </div>

      {/* 3D Seed Feed Pill */}
      <div className="mt-2.5 flex items-center gap-2 bg-white/95 border-2 border-amber-200 px-3.5 py-1.5 rounded-full shadow-lg">
        <span className="text-sm">🌻</span>
        <span className="text-xs font-black text-gray-900 font-switzer">
          {seeds}
        </span>
        <button
          type="button"
          onClick={handleFeedClick}
          className="ml-1 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 text-white text-[10px] font-black tracking-wide shadow-md active:scale-90 transition-transform font-switzer"
        >
          FEED PIP
        </button>
      </div>
    </div>
  );
}
