"use client";

import { useEffect, useState } from "react";
import {
  getDailyBudgetSeconds,
  setDailyBudgetSeconds,
  formatMMSS,
} from "@/lib/sessionBudget";

interface ReadingTimerProps {
  childId: string;
  allowedMinutes: number;
  onTimeUp: () => void;
}

export default function ReadingTimer({
  childId,
  allowedMinutes,
  onTimeUp,
}: ReadingTimerProps) {
  const maxSeconds = Math.max(1, allowedMinutes) * 60;

  const [secondsLeft, setSecondsLeft] = useState(maxSeconds);
  const [ready, setReady] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showBreakNotice, setShowBreakWarning] = useState(false);
  const [elapsedInStory, setElapsedInStory] = useState(0);

  // Load today's remaining budget (shared across all stories)
  useEffect(() => {
    const left = getDailyBudgetSeconds(childId, allowedMinutes);
    setSecondsLeft(left);
    setReady(true);

    if (left <= 0) {
      onTimeUp();
    }
  }, [childId, allowedMinutes, onTimeUp]);

  // Countdown + persist remaining budget
  useEffect(() => {
    if (!ready || isPaused || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        setDailyBudgetSeconds(childId, next);
        return next;
      });
      setElapsedInStory((e) => e + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [ready, isPaused, secondsLeft, childId]);

  // Time up
  useEffect(() => {
    if (ready && secondsLeft <= 0) {
      setDailyBudgetSeconds(childId, 0);
      onTimeUp();
    }
  }, [ready, secondsLeft, childId, onTimeUp]);

  // Gentle eye-rest once per story after ~10 minutes of active reading
  useEffect(() => {
    if (elapsedInStory === 600) {
      setShowBreakWarning(true);
      setIsPaused(true);
    }
  }, [elapsedInStory]);

  const progressUsed = ((maxSeconds - secondsLeft) / maxSeconds) * 100;
  const isLowTime = secondsLeft <= 180;

  if (!ready) {
    return (
      <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-border text-sm font-bold text-bark-muted">
        ⏱️ ...
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-soft">
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="text-lg hover:scale-110 transition-transform"
          title={isPaused ? "Resume" : "Pause"}
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
            {formatMMSS(secondsLeft)}
          </span>
        </div>

        <div className="w-16 h-2 bg-border rounded-full overflow-hidden hidden sm:block">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isLowTime ? "bg-coral" : "bg-mint"
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progressUsed))}%` }}
          />
        </div>
      </div>

      {showBreakNotice && (
        <div className="fixed inset-0 z-50 bg-bark/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="card max-w-sm text-center !p-8">
            <div className="text-5xl mb-3">👀</div>
            <h3 className="font-heading text-2xl font-bold text-bark mb-2">
              Quick eye rest!
            </h3>
            <p className="text-bark-muted text-sm mb-6">
              Look away from the screen for 10 seconds, then keep going.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowBreakWarning(false);
                setIsPaused(false);
              }}
              className="btn-gold !py-2.5 !px-6 !text-sm"
            >
              I&apos;m ready 📖
            </button>
          </div>
        </div>
      )}
    </>
  );
}