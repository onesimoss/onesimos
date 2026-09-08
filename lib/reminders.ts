import { supabase } from "./supabaseClient";
import { getDailyBudgetSeconds } from "./sessionBudget";

export interface ReminderSettings {
  enabled: boolean;
  /** Local time "HH:MM" (24h), e.g. "16:30" */
  timeLocal: string;
  lastNotifiedDate?: string | null;
}

const DEFAULT_TIME = "16:30";

export function parseTimeLocal(timeLocal: string): { hours: number; minutes: number } {
  const match = /^(\d{1,2}):(\d{2})$/.exec((timeLocal || DEFAULT_TIME).trim());
  if (!match) return { hours: 16, minutes: 30 };
  const hours = Math.min(23, Math.max(0, Number(match[1])));
  const minutes = Math.min(59, Math.max(0, Number(match[2])));
  return { hours, minutes };
}

export function formatTimeLocal(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** After 7:30pm local — quiet hours for MVP */
export function isQuietHours(now = new Date()): boolean {
  const mins = now.getHours() * 60 + now.getMinutes();
  return mins >= 19 * 60 + 30;
}

export function todayDateKey(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Should we gently nudge this child right now?
 * Parent must have enabled reminders; once per day; not in quiet hours;
 * not if today's reading budget is already finished.
 */
export function shouldOfferReminder(options: {
  enabled: boolean;
  timeLocal: string;
  lastNotifiedDate?: string | null;
  childId: string;
  sessionMinutes: number;
  now?: Date;
}): boolean {
  const now = options.now || new Date();

  if (!options.enabled) return false;
  if (isQuietHours(now)) return false;

  const today = todayDateKey(now);
  if (options.lastNotifiedDate === today) return false;

  const budgetLeft = getDailyBudgetSeconds(options.childId, options.sessionMinutes);
  if (budgetLeft <= 0) return false;

  const { hours, minutes } = parseTimeLocal(options.timeLocal);
  const target = hours * 60 + minutes;
  const current = now.getHours() * 60 + now.getMinutes();

  // Offer from preferred time until quiet hours (same day)
  if (current < target) return false;

  return true;
}

export async function updateChildReminder(
  childId: string,
  parentId: string,
  settings: { enabled: boolean; timeLocal: string }
) {
  const { hours, minutes } = parseTimeLocal(settings.timeLocal);
  const timeLocal = formatTimeLocal(hours, minutes);

  const { error } = await supabase
    .from("children")
    .update({
      reminder_enabled: settings.enabled,
      reminder_time_local: timeLocal,
    })
    .eq("id", childId)
    .eq("parent_id", parentId);

  if (error) {
    console.error("Error updating reminder:", error);
    return { error };
  }

  return { error: null, timeLocal };
}

export async function markReminderShown(childId: string, parentId: string) {
  const today = todayDateKey();
  const { error } = await supabase
    .from("children")
    .update({ reminder_last_date: today })
    .eq("id", childId)
    .eq("parent_id", parentId);

  if (error) {
    console.error("Error marking reminder shown:", error);
    return { error };
  }

  return { error: null };
}

export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
}

export function sendFriendlyStoryNotification(childName: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  try {
    new Notification("Onesimos story time", {
      body: `${childName}, your story adventure is waiting when you're ready.`,
      tag: "onesimos-story-time",
      silent: false,
    });
  } catch (e) {
    console.error("Notification failed:", e);
  }
}