"use client";
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
        className={`w-16 h-16 bg-amber-400 rounded-full shadow-lg flex items-center justify-center text-3xl cursor-pointer transition-transform ${isPaused ? 'grayscale' : 'hover:scale-110'}`}
      >
        🦜
      </div>
      <button
        onClick={onFeed}
        className="mt-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-full shadow-md active:scale-95"
      >
        FEED PIP (${seeds})
      </button>
    </div>
  );
}
