/**
 * @file components/PipCompanion.tsx
 * @description Pip the Parrot Claymorphic Interactive Companion.
 *              Floats, speaks via Web Speech Synthesis, tracks seed feeding,
 *              and reacts to child reading milestones in real time.
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";

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

  const pipSpeak = useCallback((text: string) => {
    setMessage(text);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.7;
      utterance.rate = 1.1;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
    const timer = setTimeout(() => setMessage(""), 4500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPaused) {
      setMessage("I paused the timer for you! Take your time.");
    } else if (childName) {
      const greetings = [
        `Hi ${childName}! Let's read together!`,
        `Ready for adventure, ${childName}?`,
        `Read out loud so I can hear you!`,
      ];
      const pick = greetings[Math.floor(Math.random() * greetings.length)];
      pipSpeak(pick);
    }
  }, [isPaused, childName, pipSpeak]);

  const handleSquawk = () => {
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 600);
    const phrases = [
      "Squawk! You are doing amazing!",
      "I love stories!",
      "Read the page out loud!",
      "Feed me a seed if you have one! 🌻",
    ];
    const pick = phrases[Math.floor(Math.random() * phrases.length)];
    pipSpeak(pick);
  };

  const handleFeedClick = () => {
    if (seeds <= 0) {
      pipSpeak("Tap the mic button and read to earn seeds! 🌻");
      return;
    }
    onFeed();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1200);
    pipSpeak("Yum! Thank you! You're the best reader! 💚");
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
          <p className="text-[10px] font-black text-amber-900 leading-tight">Pip</p>
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
        <div className="mb-2 max-w-[200px] bg-white/95 backdrop-blur-md border-2 border-amber-300 px-3.5 py-2 rounded-2xl shadow-lg animate-in fade-in zoom-in duration-200 text-center relative">
          <p className="text-xs font-black text-amber-950 font-switzer leading-tight">
            {message}
          </p>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-amber-300 rotate-45" />
        </div>
      )}

      {/* Pip 3D Tactile Clay Card Frame */}
      <div
        onClick={handleSquawk}
        className={`relative cursor-pointer group flex flex-col items-center justify-center p-3 rounded-3xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 border-2 border-amber-200 shadow-[6px_6px_16px_rgba(217,119,6,0.25),-4px_-4px_12px_rgba(255,255,255,0.8)] transition-all duration-300 hover:scale-105 active:scale-95 ${
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

      {/* Seed Feeding Bar */}
      <div className="mt-2 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-amber-200/80 px-3 py-1.5 rounded-full shadow-md">
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
    </div>
  );
}