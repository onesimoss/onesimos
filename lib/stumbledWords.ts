/**
 * @file lib/stumbledWords.ts
 * @description Speech classification, fuzzy stumble extraction algorithm,
 * tap-to-hear audio synthesis for Amazon Fire OS / Silk, and Supabase persistence.
 *
 * @dependencies
 * - @/lib/supabaseClient (Database logging)
 * - @/lib/geoNames (African and Diaspora names protection)
 */

import { supabase } from "./supabaseClient";
import { isGeoName, formatGeoNameDisplay } from "./geoNames";

// ─── SECTION 1: TYPES & CONFIGURATION ───────────────────────────────────────

export type WordClassification = "word" | "name";

export interface StumbledItem {
  word: string;        // Cleaned lowercase token (e.g. "whisper")
  display: string;     // Formatted display token (e.g. "whisper" or "Chinedu")
  type: WordClassification;
  count?: number;
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

const COMMON_SENTENCE_STARTERS = new Set([
  "once", "then", "there", "they", "this", "that", "these", "those",
  "when", "while", "where", "what", "who", "why", "how",
  "suddenly", "soon", "after", "before", "next", "finally",
  "every", "some", "all", "many", "one", "two", "today", "yesterday",
  "long", "look", "listen", "come", "here", "just",
]);

/**
 * Strips leading/trailing punctuation.
 */
export function stripPunctuation(w: string): string {
  return w.replace(/^[^\w]+|[^\w]+$/g, "");
}

/**
 * Levenshtein distance helper for fuzzy speech matching.
 */
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1  // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Returns true if candidate is phonetically/spelling close to target (>=70% match).
 */
function isFuzzyMatch(target: string, candidate: string): boolean {
  if (target === candidate) return true;
  if (Math.abs(target.length - candidate.length) > 3) return false;

  const distance = levenshteinDistance(target, candidate);
  const maxLen = Math.max(target.length, candidate.length);
  const similarity = 1 - distance / maxLen;

  return similarity >= 0.65;
}

// ─── SECTION 2: TOKEN EXTRACTION & CLASSIFICATION ─────────────────────────

/**
 * Extracts tokens from story page text, classifying proper nouns/names vs vocabulary.
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

      if (isGeoName(lower)) {
        type = "name";
        display = formatGeoNameDisplay(lower);
      } else if (startsWithCapital) {
        if (!isFirstOfSentence || (!COMMON_SENTENCE_STARTERS.has(lower) && cleaned.length >= 3)) {
          type = "name";
          display = cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
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
 * Fuzzy speech-to-text stumble detection algorithm.
 * Prevents minor transcription typos from falsely flagging valid reading.
 */
export function findStumbledItems(pageText: string, transcript: string): StumbledItem[] {
  const expectedItems = extractClassifiedTokens(pageText);

  if (!transcript || transcript.trim().length === 0) {
    return expectedItems;
  }

  const heardTokens = transcript
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .map(stripPunctuation)
    .filter((t) => t.length > 0);

  const missed: StumbledItem[] = [];
  const seen = new Set<string>();

  for (const item of expectedItems) {
    if (seen.has(item.word)) continue;

    // Check if expected word exists in transcript directly or with fuzzy match
    const found = heardTokens.some((heard) => isFuzzyMatch(item.word, heard));

    if (!found) {
      missed.push(item);
      seen.add(item.word);
    }
  }

  return missed;
}

/**
 * Legacy string array return helper.
 */
export function findStumbledWords(pageText: string, transcript: string): string[] {
  return findStumbledItems(pageText, transcript).map((item) => item.word);
}

// ─── SECTION 3: FIRE OS SAFE AUDIO SYNTHESIS ────────────────────────────────

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speakWord(text: string, lang = "en-US"): void {
  if (typeof window === "undefined" || !text) return;

  const cleanText = text.trim();

  try {
    if (isSpeechSynthesisSupported()) {
      const synth = window.speechSynthesis;
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang;
      utterance.rate = 0.85;
      utterance.pitch = 1.05;

      const voices = synth.getVoices();
      if (voices.length > 0) {
        const preferred = voices.find((v) => v.lang.startsWith("en") && !v.name.includes("Compact")) || voices[0];
        if (preferred) utterance.voice = preferred;
      }

      synth.speak(utterance);
      return;
    }
  } catch {
    // Fallback
  }

  playWebAudioBeepFallback();
}

function playWebAudioBeepFallback(): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Ignore fallback errors
  }
}

// ─── SECTION 4: UNIFIED SUPABASE PERSISTENCE ────────────────────────────────

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
    // Save to public.stumbled_words for Word Pocket & Spelling Game
    const { data: existing } = await supabase
      .from("stumbled_words")
      .select("id, times_stumbled")
      .eq("child_id", params.childId)
      .eq("word", cleaned)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("stumbled_words")
        .update({
          times_stumbled: (existing.times_stumbled || 1) + 1,
          mastered: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("stumbled_words").insert({
        child_id: params.childId,
        word: cleaned,
        times_stumbled: 1,
        mastered: false,
      });
    }

    // Save to public.stumbled_words_log
    await supabase.from("stumbled_words_log").insert({
      child_id: params.childId,
      word: cleaned,
      session_id: params.sessionId || null,
    });

    return { error: null };
  } catch (err) {
    console.error("Error saving stumbled word:", err);
    return { error: err };
  }
}

export async function getRecentStumbledWords(
  childId: string,
  limit = 20
): Promise<{ data: StumbledItem[]; error: unknown | null }> {
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

    const items: StumbledItem[] = data.map((row) => {
      const lower = row.word.toLowerCase();
      const isName = isGeoName(lower) || /^[A-Z]/.test(row.word);
      return {
        word: lower,
        display: isName ? formatGeoNameDisplay(lower) : lower,
        type: isName ? "name" : "word",
        count: row.times_stumbled || 1,
      };
    });

    return { data: items, error: null };
  } catch (err) {
    console.error("Error fetching stumbled words:", err);
    return { data: [], error: err };
  }
}