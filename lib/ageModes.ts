/**
 * @file lib/ageModes.ts
 * @description Age-Segmented Reading Modes Engine for Onesimos.
 * Tailors the reading experience, microphone requirements, font sizing, page length,
 * and comprehension depth across three distinct developmental age tiers:
 *   - Pre-Reader (Ages 3–4 / Level 1)
 *   - Emerging Reader (Ages 5–7 / Levels 2–3)
 *   - Confident Reader (Ages 8–9 / Level 4)
 *
 * @module lib/ageModes
 */

// ─── TYPES ──────────────────────────────────────────────────────────────────

export type AgeTier = "pre_reader" | "emerging" | "confident";

export interface AgeModeConfig {
  tier: AgeTier;
  label: string;
  ageRange: string;
  /** Tailwind text size for story content */
  textSizeClass: string;
  /** Max sentences per page */
  maxSentencesPerPage: number;
  /** Whether microphone read-aloud is strictly required or optional */
  micRequired: boolean;
  /** Whether tap-to-hear word audio is prominently highlighted */
  tapToHearProminent: boolean;
  /** Number of post-story comprehension questions */
  questionCount: number;
  /** Target Words Per Minute (WPM) benchmark for report card evaluation */
  targetWpm: number;
  /** Micro-copy encouragement */
  encouragement: string;
}

// ─── TIER CONFIGURATIONS ────────────────────────────────────────────────────

const PRE_READER_CONFIG: AgeModeConfig = {
  tier: "pre_reader",
  label: "Pre-Reader",
  ageRange: "Ages 3–4",
  textSizeClass: "text-2xl sm:text-3xl leading-relaxed",
  maxSentencesPerPage: 2,
  micRequired: false, // Tap-to-hear or listen first, mic optional
  tapToHearProminent: true,
  questionCount: 1,
  targetWpm: 20,
  encouragement: "Tap any word to hear how it sounds! 🔊",
};

const EMERGING_CONFIG: AgeModeConfig = {
  tier: "emerging",
  label: "Emerging Reader",
  ageRange: "Ages 5–7",
  textSizeClass: "text-xl sm:text-2xl leading-relaxed",
  maxSentencesPerPage: 4,
  micRequired: true,
  tapToHearProminent: true,
  questionCount: 2,
  targetWpm: 45,
  encouragement: "Read out loud at your own cozy pace! 🎙️",
};

const CONFIDENT_CONFIG: AgeModeConfig = {
  tier: "confident",
  label: "Confident Reader",
  ageRange: "Ages 8–9",
  textSizeClass: "text-lg sm:text-xl leading-relaxed",
  maxSentencesPerPage: 6,
  micRequired: true,
  tapToHearProminent: false,
  questionCount: 3,
  targetWpm: 75,
  encouragement: "Challenge yourself with big vocabulary! 🚀",
};

// ─── PUBLIC ENGINE FUNCTIONS ────────────────────────────────────────────────

/**
 * Resolves the appropriate AgeModeConfig for a child based on age and reading level.
 *
 * @param age Child age in years (3–9)
 * @param readingLevel Child reading level (1–4)
 * @returns Configured AgeModeConfig object
 */
export function getAgeModeConfig(
  age = 6,
  readingLevel = 2
): AgeModeConfig {
  if (age <= 4 || readingLevel === 1) {
    return PRE_READER_CONFIG;
  }
  if (age >= 8 || readingLevel === 4) {
    return CONFIDENT_CONFIG;
  }
  return EMERGING_CONFIG;
}

/**
 * Returns a human-friendly tier badge label.
 */
export function getAgeTierBadge(tier: AgeTier): {
  label: string;
  colorClass: string;
} {
  switch (tier) {
    case "pre_reader":
      return {
        label: "Pre-Reader (Ages 3–4)",
        colorClass: "bg-pink-100 text-pink-900 border-pink-200",
      };
    case "emerging":
      return {
        label: "Emerging Reader (Ages 5–7)",
        colorClass: "bg-amber-100 text-amber-900 border-amber-200",
      };
    case "confident":
      return {
        label: "Confident Reader (Ages 8–9)",
        colorClass: "bg-indigo-100 text-indigo-900 border-indigo-200",
      };
  }
}