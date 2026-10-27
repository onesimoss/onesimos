/**
 * @file lib/sessionBudget.ts
 * @description Session Budget & Plan Quota Enforcement Engine for Onesimos.
 * Manages daily timed reading sessions and enforces the Free Tier quota
 * (5 stories per calendar month per child) while recognizing active
 * parent subscriptions (Paystack), hard-blocking deactivated accounts,
 * and honoring admin bypass privileges.
 *
 * @dependencies
 * - @/lib/supabaseClient
 * - @/lib/payments
 */

import { supabase } from "./supabaseClient";
import { hasActivePaidPlan } from "./payments";

// SECTION 1: TYPES AND CONFIGURATION CONSTANTS

export type SessionMinutes = 20 | 30 | 45;

/** Maximum free stories allowed per child profile per calendar month */
export const FREE_MONTHLY_STORY_LIMIT = 5;

/** Admin email accounts that bypass free story quotas for testing and demoing */
export const ADMIN_EMAILS: readonly string[] = [
  "crux@onesimos.app",
  "examplemirrorltd@gmail.com",
  "baiceconsulting@gmail.com",
  "onesimos@examplemirror.com",
];

export interface MonthlyUsageStatus {
  allowed: boolean;
  used: number;
  limit: number;
  isPaidPlan: boolean;
  error: string | null;
}

// SECTION 2: DAILY READING TIMER AND LOCAL BUDGET

function getTodayLocalKey(childId: string): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `onesimos_budget_${childId}_${y}-${m}-${d}`;
}

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

export function setDailyBudgetSeconds(childId: string, secondsLeft: number): void {
  if (typeof window === "undefined") return;
  const key = getTodayLocalKey(childId);
  window.localStorage.setItem(key, String(Math.max(0, Math.floor(secondsLeft))));
}

export function formatMMSS(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

// SECTION 3: MONTHLY STORY LIMIT AND SUBSCRIPTION GATING

export async function checkMonthlyStoryLimit(
  childId: string,
  parentEmail?: string | null
): Promise<MonthlyUsageStatus> {
  if (!childId) {
    return {
      allowed: true,
      used: 0,
      limit: FREE_MONTHLY_STORY_LIMIT,
      isPaidPlan: false,
      error: "Missing child ID",
    };
  }

  // 1. Admin bypass check
  if (parentEmail && ADMIN_EMAILS.includes(parentEmail.toLowerCase().trim())) {
    return {
      allowed: true,
      used: 0,
      limit: FREE_MONTHLY_STORY_LIMIT,
      isPaidPlan: true,
      error: null,
    };
  }

  try {
    // 2. Fetch parent_id from child record to check subscription & status
    const { data: childData } = await supabase
      .from("children")
      .select("parent_id")
      .eq("id", childId)
      .maybeSingle();

    if (childData?.parent_id) {
      // Query parent_subscriptions for status
      const { data: sub } = await supabase
        .from("parent_subscriptions")
        .select("status")
        .eq("parent_id", childData.parent_id)
        .maybeSingle();

      // Hard block if parent subscription status is deactivated or paused
      if (sub?.status === "deactivated" || sub?.status === "paused") {
        return {
          allowed: false,
          used: FREE_MONTHLY_STORY_LIMIT,
          limit: FREE_MONTHLY_STORY_LIMIT,
          isPaidPlan: false,
          error: "Parent account is currently deactivated. Please ask your parent to reactivate the account.",
        };
      }

      const isSubscribed = await hasActivePaidPlan(childData.parent_id);
      if (isSubscribed) {
        return {
          allowed: true,
          used: 0,
          limit: 9999,
          isPaidPlan: true,
          error: null,
        };
      }
    }

    // 3. Free Plan: Query story count for current calendar month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0).toISOString();

    const { count, error } = await supabase
      .from("reading_sessions")
      .select("id", { count: "exact", head: true })
      .eq("child_id", childId)
      .gte("ended_at", startOfMonth);

    if (error) {
      console.error("Error querying monthly story sessions:", error);
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
      isPaidPlan: false,
      error: allowed ? null : "You have reached your free monthly limit of 5 stories. Ask your parent to upgrade for unlimited stories!",
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

// SECTION 4: TESTING AND DEMO RESET HELPERS

export async function resetChildStoryQuota(childId: string): Promise<{ error: string | null }> {
  if (!childId) return { error: "Missing child ID" };

  try {
    if (typeof window !== "undefined") {
      Object.keys(window.localStorage).forEach((key) => {
        if (key.startsWith(`onesimos_budget_${childId}`)) {
          window.localStorage.removeItem(key);
        }
      });
    }

    const { error } = await supabase
      .from("reading_sessions")
      .delete()
      .eq("child_id", childId);

    if (error) {
      console.error("Error purging test reading sessions:", error);
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    console.error("Unexpected error resetting child story quota:", err);
    return { error: "Failed to reset test quota" };
  }
}
