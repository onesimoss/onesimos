/**
 * @file components/PipCompanion.tsx
 * @description Pip the Parrot Claymorphic Interactive Companion.
 *              Synthesizes realistic bird chirps via Web Audio API,
 *              handles high-pitched young parrot speech synthesis,
 *              and provides a gentle background nudge + 20-minute break snooze.
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
  const [isSnoozed, setIsSnoozed] = useState<boolean>(false);
  const nudgeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Web Audio API Synthesizer for realistic Parrot Chirps & Squawks
  const playParrotChirp = useCallback((type: "chirp" | "squawk" | "happy" = "chirp") => {
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

      if (type === "chirp") {
        // Short high whistle
        osc.type = "sine";
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(3200, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === "squawk") {
        // Playful double warble
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.linearRampToValueAtTime(2200, now + 0.1);
        osc.frequency.linearRampToValueAtTime(1400, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === "happy") {
        // Tri-tone bird song
        osc.type = "sine";
        osc.frequency.setValueAtTime(1500, now);
        osc.frequency.exponentialRampToValueAtTime(2500, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(3500, now + 0.18);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      }
    } catch {
      // AudioContext fallback
    }
  }, []);

  // High-pitched playful parrot voice
  const pipSpeak = useCallback((text: string, chirpType: "chirp" | "squawk" | "happy" = "chirp") => {
    setMessage(text);
    playParrotChirp(chirpType);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 2.0; // Max high pitch for young bird sound
      utterance.rate = 1.3;  // Fast playful pace
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
    const timer = setTimeout(() => setMessage(""), 4500);
    return () => clearTimeout(timer);
  }, [playParrotChirp]);

  // Gentle background nudge timer when tab is hidden or paused
  useEffect(() => {
    if (isPaused && !isSnoozed) {
      nudgeTimerRef.current = setTimeout(() => {
        playParrotChirp("chirp");
        setMessage("Squawk! Pip is waiting! Take your time or click Snooze 20m!");
      }, 45000); // 45-second gentle reminder
    } else {
      if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
    }

    return () => {
      if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
    };
  }, [isPaused, isSnoozed, playParrotChirp]);

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
    pipSpeak(pick, "happy");
  };

  const handleFeedClick = () => {
    if (seeds <= 0) {
      pipSpeak("Read a page to earn seeds! 🌻", "chirp");
      return;
    }
    onFeed();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1200);
    pipSpeak("Yum yum! Thank you! 💚", "happy");
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-amber-50/90 border border-amber-200/80 px-3 py-1.5 rounded-2xl shadow-sm font-switzer">
        <button
          type="button"
          onClick={handleSquawk}
          className={`text-2xl transition-transform active:scale-125 ${
            isWiggling ? "animate-bounce" : "hover:scale-110"
          }`}
          title="Click Pip to squawk!"
        >
          🦜
        </button>
        <div className="text-left">
          <p className="text-[10px] font-black text-amber-900 leading-tight font-switzer">Pip</p>
          <button
            type="button"
            onClick={handleFeedClick}
            className="text-[9px] font-bold text-amber-700 hover:text-amber-950 underline font-switzer"
          >
            Feed ({seeds} 🌻)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center select-none font-switzer z-30">
      {/* Heart burst when fed */}
      {showHeart && (
        <div className="absolute -top-10 text-3xl animate-ping pointer-events-none z-50">
          💚
        </div>
      )}

      {/* Pip Speech Bubble */}
      {message && (
        <div className="mb-2 max-w-[210px] bg-white/95 backdrop-blur-md border-2 border-amber-300 px-3.5 py-2 rounded-2xl shadow-xl animate-in fade-in zoom-in duration-200 text-center relative">
          <p className="text-xs font-black text-amber-950 font-switzer leading-tight">
            {message}
          </p>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-amber-300 rotate-45" />
        </div>
      )}

      {/* Pip 3D Tactile Clay Card Frame */}
      <div
        onClick={handleSquawk}
        className={`relative cursor-pointer group flex flex-col items-center justify-center p-3 sm:p-4 rounded-3xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 border-2 border-amber-200 shadow-[6px_6px_16px_rgba(217,119,6,0.25),-4px_-4px_12px_rgba(255,255,255,0.8)] transition-all duration-300 hover:scale-105 active:scale-95 ${
          isWiggling ? "animate-bounce" : ""
        }`}
      >
        {/* Claymorphic Parrot Avatar */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center text-3xl sm:text-4xl shadow-inner mb-1 border border-white/40">
          🦜
        </div>

        <span className="text-[10px] font-black text-amber-950 uppercase tracking-wider font-switzer">
          Pip Buddy
        </span>
      </div>

      {/* Seed Feeding & Snooze Controls */}
      <div className="mt-2 flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-amber-200/80 px-3 py-1.5 rounded-full shadow-md">
          <span className="text-xs">🌻</span>
          <span className="text-xs font-black text-gray-800 font-switzer">
            {seeds}
          </span>
          <button
            type="button"
            onClick={handleFeedClick}
            className="ml-1 px-2.5 py-0.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black tracking-wide transition-transform active:scale-90 font-switzer shadow-xs"
          >
            FEED PIP
          </button>
        </div>

        {/* 20-Min Snooze Break Option if backgrounded/paused */}
        {isPaused && (
          <button
            type="button"
            onClick={() => {
              setIsSnoozed(true);
              pipSpeak("Take a 20-minute break! Pip will rest too!", "chirp");
            }}
            className="text-[9px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2.5 py-0.5 rounded-full border border-amber-300 transition-colors font-switzer"
          >
            {isSnoozed ? "Resting 20m 😴" : "Snooze 20m ⏱️"}
          </button>
        )}
      </div>
    </div>
  );
}