export type SessionMinutes = 20 | 30 | 45;

function storageKey(childId: string) {
  const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD local-ish UTC date
  return `onesimos_budget_${childId}_${day}`;
}

function todayLocalKey(childId: string) {
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
  if (typeof window === "undefined") return allowedMinutes * 60;

  const key = todayLocalKey(childId);
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

  // If parent raised allowance mid-day, don't shrink remaining unfairly below 0
  return Math.min(left, maxSeconds);
}

export function setDailyBudgetSeconds(childId: string, secondsLeft: number) {
  if (typeof window === "undefined") return;
  const key = todayLocalKey(childId);
  window.localStorage.setItem(key, String(Math.max(0, Math.floor(secondsLeft))));
}

export function formatMMSS(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}