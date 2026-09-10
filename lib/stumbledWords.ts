/**
 * @file lib/stumbledWords.ts
 * @description Speech classification, stumbled word extraction, tap-to-hear 
 * audio synthesis with Fire OS / Silk tablet fixes, and unified Supabase persistence 
 * for Word Pocket & Solo Spelling Game.
 *
 * @dependencies
 * - @/lib/supabaseClient (Database queries & logging)
 */

import { supabase } from "./supabaseClient";

// ─── SECTION 1: TYPES & CONFIGURATION ───────────────────────────────────────

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
export function stripPunctuation(w: string): string {
  return w.replace(/^[^\w]+|[^\w]+$/g, "");
}

// ─── SECTION 2: TOKEN EXTRACTION & CLASSIFICATION ─────────────────────────

/**
 * Extracts tokens from story page text, classifying proper nouns (names) vs vocabulary.
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

// ─── SECTION 3: FIRE OS SAFE TAP-TO-HEAR AUDIO SYNTHESIS ───────────────────

/**
 * Checks if Speech Synthesis is available in the current browser.
 */
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/**
 * Speaks a word safely across all platforms including Amazon Fire OS (Silk browser).
 * Executes synchronously on touch event to comply with Fire OS audio policy.
 */
export function speakWord(text: string, lang = "en-US"): void {
  if (typeof window === "undefined" || !text) return;

  const cleanText = text.trim();

  try {
    if (isSpeechSynthesisSupported()) {
      const synth = window.speechSynthesis;
      synth.cancel(); // Reset audio queue

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang;
      utterance.rate = 0.85; // Natural pace for children
      utterance.pitch = 1.05;

      // Amazon Fire OS Silk fix: force voice load if array is empty
      const voices = synth.getVoices();
      if (voices.length > 0) {
        const preferred = voices.find((v) => v.lang.startsWith("en") && !v.name.includes("Compact")) || voices[0];
        if (preferred) utterance.voice = preferred;
      }

      utterance.onerror = () => {
        playWebAudioBeepFallback(cleanText);
      };

      synth.speak(utterance);
      return;
    }
  } catch {
    // Silent fallback
  }

  playWebAudioBeepFallback(cleanText);
}

/**
 * Web Audio synthesizer fallback when native TTS fails on old WebViews.
 */
function playWebAudioBeepFallback(text: string): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, ctx.currentTime); // Gentle A4 tone
    gain.gain.setValueAtTime(0.1, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Ignore fallback errors
  }
}

// ─── SECTION 4: UNIFIED SUPABASE PERSISTENCE (WORD POCKET & SPELLING) ───────

/**
 * Saves a stumbled word into public.stumbled_words (for Spelling Game & Word Pocket)
 * AND logs to public.stumbled_words_log (for session history).
 */
export async function saveStumbledWord(params: {
  childId: string;
  word: string;
  storyId?: string;
  sessionId?: string;
}): Promise<{ error: unknown | null }> {
  const cleaned = stripPunctuation(params.word).toLowerCase();
  if (!cleaned || cleaned.length < 2 || SKIP_WORDS.has(cleaned)) {
    return { error: null };
  }

  try {
    // 1. Check if word already exists in public.stumbled_words
    const { data: existing } = await supabase
      .from("stumbled_words")
      .select("id, times_stumbled")
      .eq("child_id", params.childId)
      .eq("word", cleaned)
      .maybeSingle();

    if (existing) {
      // Word exists → Increment count and set mastered = false
      await supabase
        .from("stumbled_words")
        .update({
          times_stumbled: (existing.times_stumbled || 1) + 1,
          mastered: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      // First time stumbling → Insert new row
      await supabase.from("stumbled_words").insert({
        child_id: params.childId,
        word: cleaned,
        times_stumbled: 1,
        mastered: false,
      });
    }

    // 2. Audit log into public.stumbled_words_log
    await supabase.from("stumbled_words_log").insert({
      child_id: params.childId,
      word: cleaned,
      session_id: params.sessionId || null,
    });

    return { error: null };
  } catch (err) {
    console.error("Error persisting stumbled word:", err);
    return { error: err };
  }
}

/**
 * Fetches recent non-mastered stumbled words for a child from public.stumbled_words.
 */
export async function getRecentStumbledWords(
  childId: string,
  limit = 20
): Promise<{ data: { word: string; count: number }[]; error: unknown | null }> {
  try {
    const { data, error } = await supabase
      .from("stumbled_words")
      .select("word, times_stumbled")
      .eq("child_id", childId)
      .eq("mastered", false)
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error || !data) {
      return { data: [], error };
    }

    const formatted = data.map((row) => ({
      word: row.word,
      count: row.times_stumbled || 1,
    }));

    return { data: formatted, error: null };
  } catch (err) {
    console.error("Error fetching stumbled words:", err);
    return { data: [], error: err };
  }
}