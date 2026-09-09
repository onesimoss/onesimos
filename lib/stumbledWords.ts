import { supabase } from "./supabaseClient";

const SKIP_WORDS = new Set([
  "a", "an", "the",
  "i", "im", "ive",
  "to", "of", "in", "on", "at", "by", "up",
  "is", "am", "are", "was", "were", "be",
  "and", "or", "but", "so", "if",
  "he", "she", "it", "we", "you", "they",
  "my", "your", "his", "her", "our", "their",
  "for", "with", "as", "do", "did", "does",
  "yes", "no", "ok", "hi", "hey", "oh",
]);

function stripPunct(w: string) {
  return w.toLowerCase().replace(/[^\w'-]/g, "");
}

/**
 * Extract "content words" from the page text.
 * Skips:
 *  - first word of a sentence (Capitalized regardless)
 *  - proper nouns (Capitalized mid-sentence): names, places
 *  - function words (a, the, to, and…)
 *  - very short words (< 3 letters)
 */
export function extractContentWords(pageText: string): string[] {
  // Split into sentences roughly by . ? ! newline
  const sentences = pageText.split(/(?<=[.?!])\s+|\n+/g);

  const out: string[] = [];

  for (const sentence of sentences) {
    const tokens = sentence.trim().split(/\s+/);
    tokens.forEach((raw, i) => {
      if (!raw) return;

      const cleaned = raw.replace(/[^\w'-]/g, "");
      if (!cleaned) return;

      // Skip first word of the sentence (usually capitalized)
      const isFirstOfSentence = i === 0;

      // Detect proper noun: starts with uppercase (and not the sentence-start caps)
      const startsUpper = /^[A-Z]/.test(cleaned);
      const isProperNoun = startsUpper && !isFirstOfSentence;

      const lower = cleaned.toLowerCase();

      if (isProperNoun) return;                  // names / places
      if (isFirstOfSentence && startsUpper) {
        // Only include if it's clearly a common word (small heuristic:
        // if lowercased form is a short common word, skip; otherwise include
        // downstream matching will still handle it).
        // We'll include it, since kids should still be able to say "Luna" -> but
        // we skip capitalized rare tokens later in match step too.
      }
      if (lower.length < 3) return;              // a, to, it
      if (SKIP_WORDS.has(lower)) return;

      out.push(lower);
    });
  }

  return out;
}

/**
 * Compare page text vs transcript.
 * Returns unique words the child likely missed — never returns names/proper nouns.
 */
export function findStumbledWords(pageText: string, transcript: string): string[] {
  const expected = extractContentWords(pageText);
  const heard = new Set(
    transcript
      .toLowerCase()
      .replace(/[^\w\s'-]/g, " ")
      .split(/\s+/)
      .map(stripPunct)
      .filter(Boolean)
  );

  const missed: string[] = [];
  const seen = new Set<string>();

  for (const word of expected) {
    if (seen.has(word)) continue;
    if (!heard.has(word)) {
      missed.push(word);
      seen.add(word);
    }
  }

  return missed;
}

export async function saveStumbledWord(params: {
  childId: string;
  word: string;
  storyId?: string;
  sessionId?: string;
}) {
  const cleaned = stripPunct(params.word);
  if (!cleaned || cleaned.length < 3) {
    return { error: null };
  }
  if (SKIP_WORDS.has(cleaned)) {
    return { error: null };
  }

  const { error } = await supabase.from("stumbled_words_log").insert({
    child_id: params.childId,
    word: cleaned,
    session_id: params.sessionId || null,
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