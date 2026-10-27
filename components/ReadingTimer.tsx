/**
 * @file components/ReadingTimer.tsx
 * @description Reading Session Timer component with daily budget protection
 *              and tab-focus / app-backgrounding automatic pause.
 *              Step K.2: Age-segmented layout. For Pre-readers (ages 3-4),
 *              it hides the numeric clock countdown to remove cognitive pressure,
 *              displaying a friendly visual garden progress track instead.
 *
 * @dependencies
 * - @/lib/sessionBudget
 * - @/lib/children
 */

"use client";

import { useEffect, useState } from "react";
import {
  getDailyBudgetSeconds,
  setDailyBudgetSeconds,
  formatMMSS,
} from "@/lib/sessionBudget";
import { getAgeBand } from "@/lib/children";

interface ReadingTimerProps {
  childId: string;
  allowedMinutes: number;
  onTimeUp: () => void;
  age?: number;
  isExternalPaused?: boolean;
}

export default function ReadingTimer({
  childId,
  allowedMinutes,
  onTimeUp,
  age,
  isExternalPaused = false,
}: ReadingTimerProps) {
  const maxSeconds = Math.max(1, allowedMinutes) * 60;

  const [secondsLeft, setSecondsLeft] = useState(maxSeconds);
  const [ready, setReady] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showBreakNotice, setShowBreakWarning] = useState(false);
  const [elapsedInStory, setElapsedInStory] = useState(0);
  const [tabHidden, setTabHidden] = useState(false);

  // Derive age band to customize visual pressure
  const isPreReader = age ? getAgeBand(age) === "pre-reader" : false;

  // Detect tab visibility and window blur to pause timer automatically when backgrounded
  useEffect(() => {
    const handleVisibilityChange = () => {
      setTabHidden(document.hidden);
    };
    const handleBlur = () => setTabHidden(true);
    const handleFocus = () => setTabHidden(false);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Effective paused status combining manual user toggle, parent/external state, and tab visibility
  const effectivePaused = isPaused || isExternalPaused || tabHidden;

  // Load today remaining budget (shared across all stories)
  useEffect(() => {
    const left = getDailyBudgetSeconds(childId, allowedMinutes);
    setSecondsLeft(left);
    setReady(true);

    if (left <= 0) {
      onTimeUp();
    }
  }, [childId, allowedMinutes, onTimeUp]);

  // Countdown and persist remaining budget
  useEffect(() => {
    if (!ready || effectivePaused || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        setDailyBudgetSeconds(childId, next);
        return next;
      });
      setElapsedInStory((e) => e + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [ready, effectivePaused, secondsLeft, childId]);

  // Time up check
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
      <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-border text-sm font-bold text-bark-muted font-switzer">
        ⏳ ...
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-soft font-switzer">
        {/* Play/Pause Control */}
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="text-lg hover:scale-110 transition-transform focus:outline-none"
          title={isPaused ? "Resume" : "Pause"}
        >
          {effectivePaused ? "▶️" : "⏸️"}
        </button>

        {/* Visual Timer Display depending on Age Band */}
        <div className="flex items-center gap-2">
          {isPreReader ? (
            <>
              <span className="text-sm">🌱</span>
              <span className="font-achiko text-xs sm:text-sm text-emerald-800 tracking-wide select-none">
                Cozy Read
              </span>
            </>
          ) : (
            <>
              <span className="text-sm font-bold text-bark-muted">⏱️</span>
              <span
                className={`font-switzer text-2xl font-black leading-none select-none ${
                  isLowTime ? "text-coral animate-pulse" : "text-bark"
                }`}
              >
                {formatMMSS(secondsLeft)}
              </span>
            </>
          )}
        </div>

        {/* Status Indicator Badge when backgrounded/paused */}
        {effectivePaused && (
          <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full uppercase tracking-wider font-switzer">
            Paused
          </span>
        )}

        {/* Progress Bar Track */}
        <div className="w-16 h-2 bg-border rounded-full overflow-hidden hidden sm:block">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isPreReader
                ? "bg-emerald-400"
                : isLowTime
                ? "bg-coral"
                : "bg-mint"
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progressUsed))}%` }}
          />
        </div>
      </div>

      {/* 10-Minute Eye Rest Break Modal */}
      {showBreakNotice && (
        <div className="fixed inset-0 z-50 bg-bark/40 backdrop-blur-sm flex items-center justify-center p-6 font-switzer">
          <div className="card max-w-sm text-center !p-8 bg-white rounded-3xl shadow-2xl border border-gray-100">
            <div className="text-5xl mb-3">👀</div>
            <h3 className="font-achiko text-2xl font-bold text-bark mb-2">
              Quick eye rest!
            </h3>
            <p className="text-bark-muted text-sm mb-6 font-switzer">
              Look away from the screen for 10 seconds, then keep going.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowBreakWarning(false);
                setIsPaused(false);
              }}
              className="py-2.5 px-6 rounded-2xl bg-gold text-bark font-bold text-sm shadow-md hover:brightness-105 transition-all font-switzer"
            >
              I am ready 📖
            </button>
          </div>
        </div>
      )}
    </>
  );
}

