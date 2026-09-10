/**
 * @file lib/stumbledWords.ts
 * @description Speech classification, stumbled word extraction, tap-to-hear 
 * audio synthesis with fallback support for Amazon Fire OS / Silk browsers, 
 * and Supabase stumbled words logging.
 *
 * @dependencies
 * - @/lib/supabaseClient (Database queries & logging)
 */

import { supabase } from "./supabaseClient";

// ─── Section 1: Types & Configuration ───

export type WordClassification = "word" | "name";

export interface StumbledItem {
  word: string;        // Cleaned lowercase token (e.g. "whisper")
  display: string;     // Formatted display token (e.g. "whisper" or "Amaka")
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

// Words that frequently start sentences (not proper nouns/names)
const COMMON_SENTENCE_STARTERS = new Set([
  "once", "then", "there", "they", "this", "that", "these", "those",
  "when", "while", "where", "what", "who", "why", "how",
  "suddenly", "soon", "after", "before", "next", "finally",
  "every", "some", "all", "many", "one", "two", "today", "yesterday",
  "long", "look", "listen", "come", "here", "just",
]);

/**
 * Strips leading/trailing non-alphanumeric punctuation.
 */
function stripPunctuation(w: string): string {
  return w.replace(/^[^\w]+|[^\w]+$/g, "");
}

// ─── Section 2: Token Extraction & Classification ───

/**
 * Extracts tokens from story page text, classifying proper nouns (names) vs vocabulary.
 *
 * @param pageText - Full page or story text
 * @returns Array of classified StumbledItem objects
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

      let type: WordClassification = "word";
      let display = lower;

      if (startsWithCapital) {
        if (!isFirstOfSentence) {
          type = "name";
          display = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        } else if (!COMMON_SENTENCE_STARTERS.has(lower) && cleaned.length >= 3) {
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
 * Compares expected story text with speech transcript from Deepgram.
 *
 * @param pageText - Story text on current page
 * @param transcript - Speech-to-text transcript returned from microphone
 * @returns Array of missed items classified by word vs name
 */
export function findStumbledItems(pageText: string, transcript: string): StumbledItem[] {
  const expectedItems = extractClassifiedTokens(pageText);

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

    if (!heardTokens.has(item.word)) {
      missed.push(item);
      seen.add(item.word);
    }
  }

  return missed;
}

/**
 * Legacy helper returning raw string array of missed words.
 */
export function findStumbledWords(pageText: string, transcript: string): string[] {
  return findStumbledItems(pageText, transcript).map((item) => item.word);
}

// ─── Section 3: Tap-to-Hear Audio Synthesis & Device Fallbacks ───

/**
 * Checks if the user's browser/tablet supports Speech Synthesis API.
 */
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/**
 * Triggers browser-native text-to-speech for vocabulary words.
 * Includes explicit fallbacks for Amazon Fire OS (Silk Browser) & WebViews.
 *
 * @param text - Word or phrase to speak
 * @param lang - Target BCP-47 language tag (default: "en-US")
 */
export function speakWord(text: string, lang = "en-US"): void {
  if (!isSpeechSynthesisSupported()) {
    console.warn("Speech synthesis unavailable on this device/browser (e.g. Silk / Fire OS).");
    return;
  }

  try {
    // Cancel any currently playing speech to avoid audio queuing delay
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85; // Slightly slower pacing for young readers
    utterance.pitch = 1.05;

    // Handle error events on low-end WebViews safely
    utterance.onerror = (event) => {
      console.warn("Speech utterance encountered error:", event.error);
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("Failed to execute speakWord on this device:", err);
  }
}

// ─── Section 4: Supabase Logging & History Fetching ───

/**
 * Persists a stumbled word to Supabase log.
 */
export async function saveStumbledWord(params: {
  childId: string;
  word: string;
  storyId?: string;
  sessionId?: string;
}): Promise<{ error: unknown | null }> {
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
 * Fetches recent stumbled words for a given child profile.
 */
export async function getRecentStumbledWords(
  childId: string,
  limit = 20
): Promise<{ data: { word: string; count: number }[]; error: unknown | null }> {
  const { data, error } = await supabase
    .from("stumbled_words_log")
    .select("word, occurred_at")
    .eq("child_id", childId)
    .order("occurred_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching stumbled words:", error);
    return { data: [], error };
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