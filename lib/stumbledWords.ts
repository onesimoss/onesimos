import { supabase } from "./supabaseClient";

export async function saveStumbledWord(params: {
  childId: string;
  word: string;
  storyId?: string;
  sessionId?: string;
}) {
  const cleaned = params.word.toLowerCase().trim().replace(/[^a-z'-]/gi, "");
  if (!cleaned || cleaned.length < 2) {
    return { error: null };
  }

  const { error } = await supabase.from("stumbled_words_log").insert({
    child_id: params.childId,
    word: cleaned,
    session_id: params.sessionId || null,
    // story_id only if your table has this column — safe to omit if not
  });

  if (error) {
    console.error("Error saving stumbled word:", error);
    return { error };
  }

  return { error: null };
}

export async function getRecentStumbledWords(childId: string, limit = 20) {
  const { data, error } = await supabase
    .from("stumbled_words_log")
    .select("word, occurred_at")
    .eq("child_id", childId)
    .order("occurred_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching stumbled words:", error);
    return { data: [] as { word: string; count: number }[], error };
  }

  const counts: Record<string, number> = {};
  (data || []).forEach((row: { word: string }) => {
    const w = row.word.toLowerCase();
    counts[w] = (counts[w] || 0) + 1;
  });

  const ranked = Object.entries(counts)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return { data: ranked, error: null };
}

/** Compare page text to what we heard — simple MVP matcher */
export function findStumbledWords(pageText: string, transcript: string): string[] {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^\w\s'-]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

  const expected = normalize(pageText);
  const heard = new Set(normalize(transcript));

  const missed: string[] = [];
  for (const word of expected) {
    if (word.length < 3) continue; // skip tiny words: a, to, I
    if (!heard.has(word)) {
      missed.push(word);
    }
  }

  // unique
  return [...new Set(missed)];
}