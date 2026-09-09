/**
 * @file lib/sessionBudget.ts
 * @description Session Budget & Free Plan Limit Gating Engine for Onesimos.
 * Manages daily timed reading sessions (20, 30, 45 mins) and enforces the 
 * Free Tier limit of 3 stories per calendar month per child profile.
 *
 * @dependencies
 * - @/lib/supabaseClient (Supabase client for session logging checks)
 */

import { supabase } from "./supabaseClient";

// ─── Section 1: Types & Configuration Constants ───

export type SessionMinutes = 20 | 30 | 45;

/** Maximum free stories allowed per child profile per calendar month */
export const FREE_MONTHLY_STORY_LIMIT = 3;

export interface MonthlyUsageStatus {
  allowed: boolean;
  used: number;
  limit: number;
  isPaidPlan: boolean;
  error: string | null;
}

// ─── Section 2: Daily Reading Timer & Local Budget ───

/**
 * Generates a local storage key for daily timed reading budget.
 */
function getTodayLocalKey(childId: string): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `onesimos_budget_${childId}_${y}-${m}-${d}`;
}

/**
 * Retrieves remaining seconds for a child's daily reading session allowance.
 *
 * @param childId - Target child profile UUID
 * @param allowedMinutes - Daily minute budget set by parent (default: 20 min)
 * @returns Remaining time in seconds
 */
export function getDailyBudgetSeconds(
  childId: string,
  allowedMinutes: SessionMinutes | number
): number {
  if (typeof window === "undefined") return (allowedMinutes || 20) * 60;

  const key = getTodayLocalKey(childId);
  const raw = window.localStorage.getItem(key);
  const maxSeconds = Math.max(1, Number(allowedMinutes) || 20) * 60;

  if (raw === null) {
    window.localStorage.setItem(key, String(maxSeconds));
    return maxSeconds;
  }

  const left = Number(raw);
  if (Number.isNaN(left) || left < 0) {
    window.localStorage.setItem(key, String(maxSeconds));
    return maxSeconds;
  }

  return Math.min(left, maxSeconds);
}

/**
 * Persists updated remaining seconds for today's reading session.
 *
 * @param childId - Target child profile UUID
 * @param secondsLeft - Remaining seconds left
 */
export function setDailyBudgetSeconds(childId: string, secondsLeft: number): void {
  if (typeof window === "undefined") return;
  const key = getTodayLocalKey(childId);
  window.localStorage.setItem(key, String(Math.max(0, Math.floor(secondsLeft))));
}

/**
 * Formats total seconds into MM:SS display string.
 *
 * @param totalSeconds - Time in seconds
 * @returns Formatted time string (e.g. "14:30")
 */
export function formatMMSS(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

// ─── Section 3: Free Plan Monthly Story Limit Gating ───

/**
 * Checks if a child has reached their 3 free stories/month quota for the current calendar month.
 * Queries `reading_sessions` matching on `ended_at` timestamp.
 *
 * @param childId - Target child profile UUID
 * @returns MonthlyUsageStatus containing usage count, limit, and permission flag
 */
export async function checkMonthlyStoryLimit(childId: string): Promise<MonthlyUsageStatus> {
  if (!childId) {
    return {
      allowed: true,
      used: 0,
      limit: FREE_MONTHLY_STORY_LIMIT,
      isPaidPlan: false,
      error: "Missing child ID",
    };
  }

  try {
    // Determine start of current calendar month in ISO UTC
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0).toISOString();

    // Query reading_sessions using ended_at column
    const { count, error } = await supabase
      .from("reading_sessions")
      .select("id", { count: "exact", head: true })
      .eq("child_id", childId)
      .gte("ended_at", startOfMonth);

    if (error) {
      console.error("Error querying monthly story sessions:", error);
      // Fallback: allow reading if query fails so kids are not blocked by transient DB errors
      return {
        allowed: true,
        used: 0,
        limit: FREE_MONTHLY_STORY_LIMIT,
        isPaidPlan: false,
        error: error.message,
      };
    }

    const used = count || 0;
    const allowed = used < FREE_MONTHLY_STORY_LIMIT;

    return {
      allowed,
      used,
      limit: FREE_MONTHLY_STORY_LIMIT,
      isPaidPlan: false, // Default Free Tier until Paystack/Stripe integration
      error: null,
    };
  } catch (err) {
    console.error("Unexpected error checking monthly story limit:", err);
    return {
      allowed: true,
      used: 0,
      limit: FREE_MONTHLY_STORY_LIMIT,
      isPaidPlan: false,
      error: "Failed to evaluate usage quota",
    };
  }
}