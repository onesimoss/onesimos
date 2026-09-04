import { supabase } from "./supabaseClient";

interface SaveSessionParams {
  childId: string;
  storyId?: string;
  durationSeconds: number;
  wordsRead: number;
  wordsStumbled: string[];
  endedAt?: Date;
}

export async function saveReadingSession({
  childId,
  storyId,
  durationSeconds,
  wordsRead,
  wordsStumbled,
  endedAt = new Date(),
}: SaveSessionParams) {
  const { data, error } = await supabase
    .from("sessions")
    .insert({
      child_id: childId,
      story_id: storyId || null,
      duration_seconds: durationSeconds,
      words_read: wordsRead,
      words_stumbled: wordsStumbled,
      ended_at: endedAt.toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving session:", error);
    return { error };
  }

  // Save mastered words (if any)
  // For now, we'll track stumbled words as "words to practice"
  // A word becomes "mastered" when the child reads it correctly multiple times
  return { data, error: null };
}

export async function getChildStats(childId: string) {
  // Get total sessions
  const { data: sessions, error: sessionsError } = await supabase
    .from("sessions")
    .select("*")
    .eq("child_id", childId)
    .order("ended_at", { ascending: false });

  if (sessionsError) {
    console.error("Error fetching sessions:", sessionsError);
    return { error: sessionsError };
  }

  // Calculate stats
  const totalSessions = sessions?.length || 0;
  const totalWordsRead = sessions?.reduce((sum, s) => sum + (s.words_read || 0), 0) || 0;
  const totalDuration = sessions?.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) || 0;
  const totalStumbles = sessions?.reduce((sum, s) => sum + (s.words_stumbled?.length || 0), 0) || 0;

  // Get unique stumbled words
  const allStumbledWords = sessions?.flatMap(s => s.words_stumbled || []) || [];
  const uniqueStumbledWords = [...new Set(allStumbledWords)];

  return {
    totalSessions,
    totalWordsRead,
    totalDuration,
    totalStumbles,
    uniqueStumbledWords,
    sessions: sessions || [],
    error: null,
  };
}

export async function getChild(childId: string) {
  const { data, error } = await supabase
    .from("children")
    .select("*")
    .eq("id", childId)
    .single();

  if (error) {
    console.error("Error fetching child:", error);
    return { error };
  }

  return { data, error: null };
}