"use client";

import { useEffect, useState } from "react";

interface ReadingTimerProps {
  allowedMinutes: number;
  onTimeUp: () => void;
}

export default function ReadingTimer({
  allowedMinutes,
  onTimeUp,
}: ReadingTimerProps) {
  const totalSeconds = allowedMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [showBreakNotice, setShowBreakWarning] = useState(false);

  useEffect(() => {
    if (isPaused || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, secondsLeft, onTimeUp]);

  useEffect(() => {
    const elapsed = totalSeconds - secondsLeft;
    if (elapsed === 600 && totalSeconds >= 1200) {
      setShowBreakWarning(true);
    }
  }, [secondsLeft, totalSeconds]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const isLowTime = secondsLeft <= 180;

  return (
    <>
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-soft">
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="text-lg hover:scale-110 transition-transform"
          title={isPaused ? "Resume session" : "Pause session"}
        >
          {isPaused ? "▶️" : "⏸️"}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-bark-muted">⏱️</span>
          <span
            className={`font-heading font-extrabold text-sm tracking-wider ${
              isLowTime ? "text-coral animate-pulse" : "text-bark"
            }`}
          >
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
        </div>

        <div className="w-16 h-2 bg-border rounded-full overflow-hidden hidden sm:block">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isLowTime ? "bg-coral" : "bg-mint"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {showBreakNotice && (
        <div className="fixed inset-0 z-50 bg-bark/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="card max-w-sm text-center !p-8 animate-bounce-in">
            <div className="text-5xl mb-3">👀</div>
            <h3 className="font-heading text-2xl font-bold text-bark mb-2">
              Time for a 10-second eye rest!
            </h3>
            <p className="text-bark-muted text-sm mb-6">
              Look away from the screen at something far across the room.
            </p>
            <button
              type="button"
              onClick={() => setShowBreakWarning(false)}
              className="btn-gold !py-2.5 !px-6 !text-sm"
            >
              I&apos;m ready to keep reading! 📖
            </button>
          </div>
        </div>
      )}
    </>
  );
}