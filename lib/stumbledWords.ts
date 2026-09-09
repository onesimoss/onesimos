import { supabase } from "./supabaseClient";

export type WordClassification = "word" | "name";

export interface StumbledItem {
  word: string;        // Cleaned lowercase token (e.g. "amaka", "whisper")
  display: string;     // Display format with proper casing (e.g. "Amaka", "whisper")
  type: WordClassification;
}

const SKIP_WORDS = new Set([
  "a", "an", "the",
  "i", "im", "ive",
  "to", "of", "in", "on", "at", "by", "up", "down", "into", "out",
  "is", "am", "are", "was", "were", "be", "been", "being",
  "and", "or", "but", "so", "if", "because",
  "he", "she", "it", "we", "you", "they",
  "him", "her", "his", "hers", "its", "our", "ours", "their", "theirs", "me", "us", "them",
  "my", "your",
  "for", "with", "as", "do", "did", "does", "done",
  "yes", "no", "not", "ok", "hi", "hey", "oh", "ah",
]);

// Common words that frequently start sentences (to prevent misclassifying them as names)
const COMMON_SENTENCE_STARTERS = new Set([
  "once", "then", "there", "they", "this", "that", "these", "those",
  "when", "while", "where", "what", "who", "why", "how",
  "suddenly", "soon", "after", "before", "next", "finally",
  "every", "some", "all", "many", "one", "two", "today", "yesterday",
  "long", "look", "listen", "come", "here", "just",
]);

function stripPunctuation(w: string): string {
  return w.replace(/^[^\w]+|[^\w]+$/g, "");
}

/**
 * Extract tokens from page text with classification (name vs vocabulary word).
 */
export function extractClassifiedTokens(pageText: string): StumbledItem[] {
  const sentences = pageText.split(/(?<=[.?!])\s+|\n+/g);
  const items: StumbledItem[] = [];

  for (const sentence of sentences) {
    const rawTokens = sentence.trim().split(/\s+/);

    rawTokens.forEach((raw, index) => {
      if (!raw) return;

      const cleaned = stripPunctuation(raw);
      if (!cleaned || cleaned.length < 2) return;

      const lower = cleaned.toLowerCase();
      if (SKIP_WORDS.has(lower)) return;

      const isFirstOfSentence = index === 0;
      const startsWithCapital = /^[A-Z]/.test(cleaned);

      // Classification heuristic:
      // 1. Mid-sentence capital -> definitely a Character / Place Name (e.g., "Tayo", "Amaka", "Lagos")
      // 2. Start-of-sentence capital not in common words list -> potential Name
      let type: WordClassification = "word";
      let display = lower;

      if (startsWithCapital) {
        if (!isFirstOfSentence) {
          type = "name";
          display = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        } else if (!COMMON_SENTENCE_STARTERS.has(lower) && cleaned.length >= 3) {
          // If the word isn't a typical sentence starter, keep original casing
          display = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        }
      }

      items.push({
        word: lower,
        display,
        type,
      });
    });
  }

  return items;
}

/**
 * Compare expected story text with speech transcript.
 * Returns classified items (distinguishing names to learn from practice vocabulary).
 */
export function findStumbledItems(pageText: string, transcript: string): StumbledItem[] {
  const expectedItems = extractClassifiedTokens(pageText);

  // Normalize transcript into clean lookup tokens
  const heardTokens = new Set(
    transcript
      .toLowerCase()
      .replace(/[^\w\s'-]/g, " ")
      .split(/\s+/)
      .map(stripPunctuation)
      .filter(Boolean)
  );

  const missed: StumbledItem[] = [];
  const seen = new Set<string>();

  for (const item of expectedItems) {
    if (seen.has(item.word)) continue;

    // Check if Deepgram heard this word
    if (!heardTokens.has(item.word)) {
      missed.push(item);
      seen.add(item.word);
    }
  }

  return missed;
}

/**
 * Backward-compatible helper returning string array of missed words.
 */
export function findStumbledWords(pageText: string, transcript: string): string[] {
  return findStumbledItems(pageText, transcript).map((item) => item.word);
}

/**
 * Browser-native free Speech Synthesis (Tap to Hear).
 */
export function speakWord(text: string, lang = "en-US") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel(); // Stop any currently playing audio

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.85; // Slightly slower for clear kid listening
  utterance.pitch = 1.05;

  window.speechSynthesis.speak(utterance);
}

/**
 * Save stumbled word to Supabase log.
 */
export async function saveStumbledWord(params: {
  childId: string;
  word: string;
  storyId?: string;
  sessionId?: string;
}) {
  const cleaned = stripPunctuation(params.word).toLowerCase();
  if (!cleaned || cleaned.length < 3 || SKIP_WORDS.has(cleaned)) {
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

/**
 * Fetch top stumbled words for a child.
 */
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