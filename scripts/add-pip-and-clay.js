const fs = require('fs');
const path = require('path');

const root = process.cwd();

// 1. Create PipCompanion.tsx
const pipCode = `"use client";
import React, { useState, useEffect } from "react";

interface PipCompanionProps {
  childName: string;
  isPaused: boolean;
  seeds: number;
  onFeed: () => void;
}

export default function PipCompanion({ childName, isPaused, seeds, onFeed }: PipCompanionProps) {
  const [message, setMessage] = useState("");

  const pipSpeak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 2.0;
      utterance.rate = 1.2;
      window.speechSynthesis.speak(utterance);
      setMessage(text);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  useEffect(() => {
    if (isPaused) {
      setMessage("I am waiting for you!");
    } else {
      pipSpeak("Great to see you, " + childName + "!");
    }
  }, [isPaused]);

  return (
    <div className="flex flex-col items-center">
      {message && (
        <div className="bg-white border-2 border-amber-200 px-3 py-1 rounded-xl shadow-lg mb-2 animate-bounce">
          <p className="text-[10px] font-black text-amber-900 font-switzer">{message}</p>
        </div>
      )}
      <div
        onClick={() => pipSpeak("Squawk! More seeds please!")}
        className={\`w-16 h-16 bg-amber-400 rounded-full shadow-lg flex items-center justify-center text-3xl cursor-pointer transition-transform \${isPaused ? 'grayscale' : 'hover:scale-110'}\`}
      >
        🦜
      </div>
      <button
        onClick={onFeed}
        className="mt-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-full shadow-md active:scale-95"
      >
        FEED PIP (\${seeds})
      </button>
    </div>
  );
}
`;

fs.writeFileSync(path.join(root, 'components', 'PipCompanion.tsx'), pipCode, 'utf8');
console.log('Created PipCompanion.tsx');

// 2. Update globals.css with Claymorphic utilities
const globalsPath = path.join(root, 'app', 'globals.css');
let globalsContent = fs.existsSync(globalsPath) ? fs.readFileSync(globalsPath, 'utf8') : '';

const clayUtilities = `
/* ─── Claymorphic / Tactile 3D Design System ─── */
.clay-card {
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  box-shadow: 
    8px 8px 16px #d1d5db,
    -8px -8px 16px #ffffff,
    inset 2px 2px 4px rgba(255,255,255,0.8),
    inset -2px -2px 4px rgba(0,0,0,0.05);
  border-radius: 24px;
  border: 1px solid rgba(255,255,255,0.6);
}

.clay-btn {
  background: linear-gradient(145deg, #ff6b6b, #ee5a5a);
  box-shadow: 
    4px 4px 8px #d1d5db,
    -4px -4px 8px #ffffff;
  border-radius: 16px;
  border: none;
  transition: all 0.2s ease;
}

.clay-btn:active {
  box-shadow: 
    inset 2px 2px 4px rgba(0,0,0,0.2),
    inset -2px -2px 4px rgba(255,255,255,0.3);
  transform: scale(0.98);
}

.clay-input {
  background: linear-gradient(145deg, #f9fafb, #ffffff);
  box-shadow: 
    inset 2px 2px 4px #d1d5db,
    inset -2px -2px 4px #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.5);
}

.clay-avatar {
  background: linear-gradient(145deg, #fde68a, #fcd34d);
  box-shadow: 
    6px 6px 12px #d1d5db,
    -6px -6px 12px #ffffff;
  border-radius: 50%;
}

/* Tactile Color Palette */
:root {
  --clay-bg: #f0f4f8;
  --clay-surface: #ffffff;
  --clay-shadow-light: #ffffff;
  --clay-shadow-dark: #d1d5db;
  --clay-accent-coral: #ff6b6b;
  --clay-accent-mint: #4ade80;
  --clay-accent-amber: #fbbf24;
  --clay-accent-sky: #38bdf8;
}

/* Pip Specific Animations */
@keyframes pip-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.pip-floating {
  animation: pip-float 3s ease-in-out infinite;
}

.pip-seed {
  background: linear-gradient(145deg, #fcd34d, #fbbf24);
  box-shadow: 2px 2px 4px #d1d5db, -2px -2px 4px #ffffff;
  border-radius: 50%;
}
`;

if (!globalsContent.includes('Claymorphic')) {
  globalsContent += clayUtilities;
  fs.writeFileSync(globalsPath, globalsContent, 'utf8');
  console.log('Updated globals.css with Claymorphic utilities');
}

// 3. Update tailwind.config.js with clay extensions
const tailwindPath = path.join(root, 'tailwind.config.js');
let tailwindContent = fs.readFileSync(tailwindPath, 'utf8');

if (!tailwindContent.includes('clay')) {
  tailwindContent = tailwindContent.replace(
    'module.exports = {',
    `module.exports = {
  // Claymorphic shadow extensions
  theme: {
    extend: {
      boxShadow: {
        'clay': '8px 8px 16px #d1d5db, -8px -8px 16px #ffffff',
        'clay-inset': 'inset 2px 2px 4px #d1d5db, inset -2px -2px 4px #ffffff',
        'clay-soft': '4px 4px 8px #e5e7eb, -4px -4px 8px #ffffff',
        'pip-glow': '0 0 20px rgba(251, 191, 36, 0.4)',
      },
      animation: {
        'pip-float': 'pip-float 3s ease-in-out infinite',
        'seed-drop': 'seed-drop 0.5s ease-out',
      },
      keyframes: {
        'pip-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'seed-drop': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },`
  );
  fs.writeFileSync(tailwindPath, tailwindContent, 'utf8');
  console.log('Updated tailwind.config.js with clay extensions');
}

console.log('Pip and Claymorphic design system installed!');