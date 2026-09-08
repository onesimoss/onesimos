import { supabase } from "./supabaseClient";

export interface ReadingSessionRow {
  id: string;
  child_id: string;
  story_id: string | null;
  pages_read: number;
  duration_seconds: number;
  completed_story: boolean;
  ended_at: string;
}

export async function saveReadingSession(params: {
  childId: string;
  storyId?: string;
  pagesRead: number;
  durationSeconds?: number;
  completedStory?: boolean;
}) {
  const { data, error } = await supabase
    .from("reading_sessions")
    .insert({
      child_id: params.childId,
      story_id: params.storyId || null,
      pages_read: Math.max(0, params.pagesRead || 0),
      duration_seconds: Math.max(0, params.durationSeconds || 0),
      completed_story: !!params.completedStory,
      ended_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving reading session:", error);
    return { data: null, error };
  }

  return { data: data as ReadingSessionRow, error: null };
}

export async function getChildSessions(childId: string, limit = 30) {
  const { data, error } = await supabase
    .from("reading_sessions")
    .select("*")
    .eq("child_id", childId)
    .order("ended_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching sessions:", error);
    return { data: [] as ReadingSessionRow[], error };
  }

  return { data: (data || []) as ReadingSessionRow[], error: null };
}

export function computeSessionStats(sessions: ReadingSessionRow[]) {
  const totalSessions = sessions.length;
  const totalPages = sessions.reduce((sum, s) => sum + (s.pages_read || 0), 0);
  const totalSeconds = sessions.reduce(
    (sum, s) => sum + (s.duration_seconds || 0),
    0
  );
  const storiesFinished = sessions.filter((s) => s.completed_story).length;

  // Streak: consecutive local days with at least one session, ending today or yesterday
  const dayKeys = [
    ...new Set(
      sessions.map((s) => {
        const d = new Date(s.ended_at);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
      })
    ),
  ].sort((a, b) => (a < b ? 1 : -1));

  let streak = 0;
  if (dayKeys.length > 0) {
    const today = new Date();
    const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const hasDay = (dt: Date) => {
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
      return dayKeys.includes(key);
    };

    // If nothing today, allow streak to still count from yesterday
    if (!hasDay(cursor)) {
      cursor.setDate(cursor.getDate() - 1);
    }

    while (hasDay(cursor)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  return {
    totalSessions,
    totalPages,
    totalMinutes: Math.round(totalSeconds / 60),
    storiesFinished,
    streak,
  };
}