/**
 * @file lib/children.ts
 * @description Child profile types, CRUD helpers, session management,
 *              and age-band segmentation for Onesimos reading modes.
 *
 * @section Age Bands (Step K)
 * - "pre-reader"  → ages 3–4  (letter sounds, picture-heavy, no WPM)
 * - "emerging"    → ages 5–7  (CVC words, short sentences, literal comprehension)
 * - "confident"   → ages 8–9  (multi-syllable, inferential + vocab, WPM tracking)
 *
 * @dependencies
 * - @/lib/supabaseClient
 */

import { supabase } from "./supabaseClient";

// ─── Section 1: Curriculum & Age Band Types ───

export type Curriculum =
  | "nigerian"
  | "british"
  | "american"
  | "ghanaian"
  | "international"
  | "other";

/**
 * Age-segmented reading mode.
 * Derived from the child's numeric age via getAgeBand().
 */
export type AgeBand = "pre-reader" | "emerging" | "confident";

/**
 * Configuration for each age band — used by UI screens to adapt
 * reading flow, comprehension difficulty, and avatar speech pacing.
 */
export interface AgeBandConfig {
  band: AgeBand;
  ageRange: [number, number];
  label: string;
  kidLabel: string;
  description: string;
  /** Whether WPM tracking is meaningful for this band */
  trackWpm: boolean;
  /** Default comprehension question types for this band */
  comprehensionTypes: ("literal" | "inferential" | "vocabulary")[];
  /** Suggested max sentence length (words) for generated stories */
  maxSentenceWords: number;
}

export const AGE_BAND_CONFIG: Record<AgeBand, AgeBandConfig> = {
  "pre-reader": {
    band: "pre-reader",
    ageRange: [3, 4],
    label: "Pre-Reader",
    kidLabel: "I'm just starting! 🌱",
    description: "Letters, simple sounds, and picture-heavy stories. No reading speed pressure.",
    trackWpm: false,
    comprehensionTypes: ["literal"],
    maxSentenceWords: 6,
  },
  emerging: {
    band: "emerging",
    ageRange: [5, 7],
    label: "Emerging Reader",
    kidLabel: "I can read a bit! 📖",
    description: "Short words, simple sentences, and literal comprehension questions.",
    trackWpm: true,
    comprehensionTypes: ["literal", "vocabulary"],
    maxSentenceWords: 10,
  },
  confident: {
    band: "confident",
    ageRange: [8, 9],
    label: "Confident Reader",
    kidLabel: "I'm a strong reader! 🚀",
    description: "Multi-syllable words, longer paragraphs, inferential and vocabulary challenges.",
    trackWpm: true,
    comprehensionTypes: ["literal", "inferential", "vocabulary"],
    maxSentenceWords: 16,
  },
};

/**
 * Derive the age band from a child's numeric age.
 * Ages outside 3–9 default to the nearest band.
 */
export function getAgeBand(age: number): AgeBand {
  if (age <= 4) return "pre-reader";
  if (age <= 7) return "emerging";
  return "confident";
}

/**
 * Get the full config object for a given age.
 */
export function getAgeBandConfig(age: number): AgeBandConfig {
  return AGE_BAND_CONFIG[getAgeBand(age)];
}

// ─── Section 2: Profile Types ───

export interface ChildProfile {
  id: string;
  parent_id: string;
  name: string;
  age: number;
  avatar_id: string;
  reading_level: number;
  curriculum: Curriculum;
  interests: string[];
  session_minutes: 20 | 30 | 45;
  cultural_context: string;
  onboarding_completed: boolean;
  kid_pin?: string | null;
  reminder_enabled?: boolean;
  reminder_time_local?: string | null;
  reminder_last_date?: string | null;
  created_at?: string;
}

export interface CreateChildInput {
  name: string;
  age: number;
  avatar_id: string;
  reading_level: number;
  curriculum: Curriculum;
  interests: string[];
  session_minutes: 20 | 30 | 45;
  cultural_context?: string;
}

// ─── Section 3: CRUD Operations ───

export async function getChildrenForParent(parentId: string) {
  const { data, error } = await supabase
    .from("children")
    .select("*")
    .eq("parent_id", parentId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching children:", error);
    return { data: [] as ChildProfile[], error };
  }

  return { data: (data || []) as ChildProfile[], error: null };
}

export async function createChild(parentId: string, input: CreateChildInput) {
  const { data, error } = await supabase
    .from("children")
    .insert({
      parent_id: parentId,
      name: input.name.trim(),
      age: input.age,
      avatar_id: input.avatar_id,
      reading_level: input.reading_level,
      curriculum: input.curriculum,
      interests: input.interests,
      session_minutes: input.session_minutes,
      cultural_context: input.cultural_context || "general",
      onboarding_completed: true,
      kid_pin: null,
      reminder_enabled: false,
      reminder_time_local: "16:30",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating child:", error);
    return { data: null, error };
  }

  return { data: data as ChildProfile, error: null };
}

export async function deleteChild(childId: string, parentId: string) {
  const { error } = await supabase
    .from("children")
    .delete()
    .eq("id", childId)
    .eq("parent_id", parentId);

  if (error) {
    console.error("Error deleting child profile:", error);
    return { error };
  }

  return { error: null };
}

// ─── Section 4: PIN Management ───

export async function setChildPin(
  childId: string,
  parentId: string,
  pin: string
) {
  const cleaned = pin.replace(/\D/g, "");
  if (cleaned.length !== 4) {
    return { error: { message: "PIN must be exactly 4 digits" } };
  }

  const { error } = await supabase
    .from("children")
    .update({ kid_pin: cleaned })
    .eq("id", childId)
    .eq("parent_id", parentId);

  if (error) {
    console.error("Error setting kid PIN:", error);
    return { error };
  }

  return { error: null };
}

export async function verifyChildPin(childId: string, pin: string) {
  const cleaned = pin.replace(/\D/g, "");
  const { data, error } = await supabase
    .from("children")
    .select("id, kid_pin, name, avatar_id")
    .eq("id", childId)
    .single();

  if (error || !data) {
    return { ok: false, error: error || { message: "Child not found" } };
  }

  if (!data.kid_pin) {
    return { ok: true, error: null, needsPinSetup: true };
  }

  if (data.kid_pin !== cleaned) {
    return {
      ok: false,
      error: { message: "That PIN doesn't match. Try again." },
    };
  }

  return { ok: true, error: null, needsPinSetup: false };
}

// ─── Section 5: Utility Helpers ───

export async function hasAnyChildren(parentId: string) {
  const { data, error } = await supabase
    .from("children")
    .select("id")
    .eq("parent_id", parentId)
    .limit(1);

  if (error) {
    console.error("Error checking children:", error);
    return false;
  }

  return (data?.length || 0) > 0;
}

export function defaultReadingLevelFromAge(age: number): number {
  if (age <= 4) return 1;
  if (age === 5) return 2;
  if (age === 6) return 3;
  if (age === 7) return 4;
  if (age === 8) return 6;
  if (age === 9) return 7;
  return Math.min(age - 2, 12);
}

// ─── Section 6: Kid Session (localStorage) ───

const KID_SESSION_KEY = "onesimos_kid_session";

export function setKidSession(childId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    KID_SESSION_KEY,
    JSON.stringify({ childId, at: Date.now() })
  );
}

export function getKidSession(): { childId: string; at: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KID_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearKidSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KID_SESSION_KEY);
}