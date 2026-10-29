const fs = require("fs");
const path = require("path");

const root = process.cwd();

// 1. Overhaul app/globals.css with Matter-Grade 3D Claymorphism
const globalsPath = path.join(root, "app", "globals.css");
const clayCSS = `
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ─── ONESIMOS MATTER-GRADE 3D CLAYMORPHIC SYSTEM ─── */

:root {
  --clay-bg: #F7F4EC;
  --clay-surface: #FFFFFF;
}

/* 3D Clay Canvas Card */
.clay-3d-card {
  background: linear-gradient(145deg, #ffffff 0%, #fefcf8 100%);
  border: 3px solid rgba(255, 255, 255, 0.95);
  box-shadow: 
    16px 20px 40px rgba(180, 160, 120, 0.15),
    -10px -10px 24px rgba(255, 255, 255, 1),
    inset 3px 3px 6px rgba(255, 255, 255, 0.9),
    inset -3px -3px 6px rgba(0, 0, 0, 0.03);
  border-radius: 36px;
}

/* 3D Clay Frame for Illustrations */
.clay-3d-frame {
  background: linear-gradient(145deg, #fffcf0 0%, #fef3c7 100%);
  border: 3px solid #fde68a;
  box-shadow: 
    inset 5px 5px 10px rgba(217, 119, 6, 0.12),
    inset -5px -5px 10px rgba(255, 255, 255, 0.9),
    0 12px 28px rgba(245, 158, 11, 0.15);
  border-radius: 28px;
}

/* Juicy 3D Tactile Buttons */
.clay-3d-btn-coral {
  background: linear-gradient(180deg, #ff7676 0%, #ee5252 100%);
  box-shadow: 
    0 8px 0 #c93b3b,
    0 14px 25px rgba(238, 82, 82, 0.35),
    inset 0 2px 3px rgba(255, 255, 255, 0.6);
  border-radius: 22px;
  color: #ffffff;
  font-weight: 900;
  transition: all 0.12s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.clay-3d-btn-coral:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 10px 0 #c93b3b,
    0 18px 30px rgba(238, 82, 82, 0.45),
    inset 0 2px 3px rgba(255, 255, 255, 0.8);
}

.clay-3d-btn-coral:active {
  transform: translateY(6px) !important;
  box-shadow: 
    0 2px 0 #c93b3b,
    0 4px 10px rgba(238, 82, 82, 0.2),
    inset 0 1px 2px rgba(0, 0, 0, 0.2) !important;
}

.clay-3d-btn-dark {
  background: linear-gradient(180deg, #334155 0%, #1e293b 100%);
  box-shadow: 
    0 8px 0 #0f172a,
    0 14px 25px rgba(15, 23, 42, 0.3),
    inset 0 2px 3px rgba(255, 255, 255, 0.3);
  border-radius: 22px;
  color: #ffffff;
  font-weight: 900;
  transition: all 0.12s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.clay-3d-btn-dark:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 10px 0 #0f172a,
    0 18px 30px rgba(15, 23, 42, 0.4),
    inset 0 2px 3px rgba(255, 255, 255, 0.4);
}

.clay-3d-btn-dark:active {
  transform: translateY(6px) !important;
  box-shadow: 
    0 2px 0 #0f172a,
    0 4px 10px rgba(15, 23, 42, 0.2) !important;
}

.clay-3d-btn-white {
  background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
  box-shadow: 
    0 6px 0 #cbd5e1,
    0 10px 20px rgba(0, 0, 0, 0.08),
    inset 0 2px 3px rgba(255, 255, 255, 1);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  color: #334155;
  font-weight: 800;
  transition: all 0.12s ease;
}

.clay-3d-btn-white:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 0 #cbd5e1,
    0 14px 24px rgba(0, 0, 0, 0.12);
}

.clay-3d-btn-white:active {
  transform: translateY(4px) !important;
  box-shadow: 0 2px 0 #cbd5e1 !important;
}

/* Pip 3D Mascot Pill */
.clay-3d-pip-card {
  background: linear-gradient(145deg, #fbbf24 0%, #f59e0b 100%);
  border: 3px solid #fef08a;
  box-shadow: 
    0 10px 25px rgba(245, 158, 11, 0.35),
    inset 3px 3px 6px rgba(255, 255, 255, 0.8),
    inset -3px -3px 6px rgba(180, 83, 9, 0.3);
  border-radius: 28px;
}

/* Ambient Floating Clay Blobs */
@keyframes clay-float-slow {
  0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
  50% { transform: translate(12px, -15px) rotate(3deg); }
}

.ambient-clay-blob {
  animation: clay-float-slow 8s ease-in-out infinite;
}
`;

fs.writeFileSync(globalsPath, clayCSS, "utf8");
console.log("Upgraded app/globals.css with Matter-Grade 3D Claymorphic system!");

// 2. Overhaul components/PipCompanion.tsx for 3D Tactile Design
const pipPath = path.join(root, "components", "PipCompanion.tsx");
const pipContent = `/**
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
        className={\`clay-3d-pip-card p-3.5 sm:p-4 flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 active:scale-90 \${
          isWiggling ? "animate-bounce" : "hover:scale-105"
        }\`}
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
`;

fs.writeFileSync(pipPath, pipContent, "utf8");
console.log("Upgraded components/PipCompanion.tsx with 3D Tactile Design!");

// 3. Overhaul components/ReadAloudMic.tsx for Massive 3D Mic Button
const micPath = path.join(root, "components", "ReadAloudMic.tsx");
if (fs.existsSync(micPath)) {
  let micContent = fs.readFileSync(micPath, "utf8");
  micContent = micContent.replace(
    /className="[^"]*rounded-2xl[^"]*"/g,
    'className="clay-3d-btn-coral w-full py-4 px-8 text-base font-black flex items-center justify-center gap-2 font-switzer cursor-pointer shadow-2xl"'
  );
  fs.writeFileSync(micPath, micContent, "utf8");
  console.log("Upgraded components/ReadAloudMic.tsx with 3D Coral Clay button!");
}