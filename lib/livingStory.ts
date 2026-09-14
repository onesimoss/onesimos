/**
 * @file lib/livingStory.ts
 * @description Living Story Book client engine for Onesimos (The Moat).
 * Delegates chapter generation to /api/generate-living-story, which chains
 * free LLM providers (Groq, then Gemini, then OpenRouter) and falls back to a
 * concrete offline template. Every chapter carries the child's name, real
 * stumbled words, and one of the 25 life skill virtues.
 *
 * Public API is unchanged so existing parent pages keep compiling:
 *   generateLivingChapterForChild(child)
 *   getGeneratedStoriesForChild(childId)
 *   deleteGeneratedStory(storyId, childId)
 *
 * @dependencies
 * - @/lib/supabaseClient (chapter persistence and retrieval)
 * - @/lib/children (ChildProfile types)
 * - @/lib/stumbledWords (fallback word sourcing)
 * - @/lib/lifeSkills (25 virtues framework)
 * - @/lib/sampleStories (SampleStory types)
 */

import { supabase } from "./supabaseClient";
import type { ChildProfile } from "./children";
import { getRecentStumbledWords } from "./stumbledWords";
import { getRandomLifeSkill, type LifeSkill } from "./lifeSkills";
import type {
  SampleStory,
  StoryPage,
  ComprehensionQuestion,
} from "./sampleStories";

// ─── SECTION 1: TYPES ───────────────────────────────────────────────────────

/** Row shape stored in public.generated_stories */
export interface GeneratedChapterRecord {
  id: string;
  child_id: string;
  chapter_number: number;
  title: string;
  story_data: SampleStory;
  target_words: string[];
  created_at: string;
}

/** Response contract from /api/generate-living-story */
interface GenerateApiResponse {
  story?: SampleStory;
  skill?: {
    id: number;
    title: string;
    emoji: string;
    lesson: string;
  };
  targetWords?: string[];
  engine?: string;
  error?: string;
}

/** Result returned to the parent dashboard */
export interface LivingChapterResult {
  story: SampleStory;
  skillTitle: string;
  targetWords: string[];
  engine: string;
}

// ─── SECTION 2: HELPERS ─────────────────────────────────────────────────────

function capitalize(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "Friend";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Reads the skill id embedded in a story's themes array.
 * Format written by the API: "skill:18"
 */
export function extractSkillIdFromStory(story: SampleStory): number | null {
  const tag = (story.themes || []).find((t) => t.startsWith("skill:"));
  if (!tag) return null;
  const parsed = Number(tag.split(":")[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Reads the stumbled words embedded in a story's themes array.
 * Format written by the API: "word:kite"
 */
export function extractTargetWordsFromStory(story: SampleStory): string[] {
  return (story.themes || [])
    .filter((t) => t.startsWith("word:"))
    .map((t) => t.split(":")[1])
    .filter(Boolean);
}

// ─── SECTION 3: OFFLINE FALLBACK (CONCRETE ACTIONS, NOT VAGUE PRAISE) ──────

/**
 * Builds a readable chapter without any AI call.
 * Used when the API route is unreachable or no provider key is configured.
 * Every page describes a visible action, never a vague summary.
 */
function buildOfflineChapter(params: {
  child: ChildProfile;
  words: string[];
  skill: LifeSkill;
}): SampleStory {
  const name = capitalize(params.child.name);
  const level = params.child.reading_level || 2;

  const w1 = (params.words[0] || "bag").toLowerCase();
  const w2 = (params.words[1] || "gate").toLowerCase();
  const w3 = (params.words[2] || "water").toLowerCase();
  const w4 = (params.words[3] || "share").toLowerCase();

  const skill = params.skill;

  const allPages: StoryPage[] = [
    {
      text: `${name} carried a small ${w1} toward the ${w2} after school.`,
      imageEmoji: "🎒",
    },
    {
      text: `A younger child tripped and spilled a bottle of ${w3} across the path.`,
      imageEmoji: "💧",
    },
    {
      text: `Some people walked around the puddle. ${name} stopped and looked closely.`,
      imageEmoji: skill.emoji,
    },
    {
      text: `${name} knelt down, lifted the bottle, and moved it away from the walking path.`,
      imageEmoji: "🤲",
    },
    {
      text: `"Are you hurt?" ${name} asked quietly. The younger child shook their head and smiled.`,
      imageEmoji: "🤝",
    },
    {
      text: `At home, ${name} told Mama exactly what happened, then offered to ${w4} the orange slices.`,
      imageEmoji: "🍊",
    },
  ];

  const pages = allPages.slice(0, level <= 2 ? 5 : 6);

  const timestamp = Date.now();
  const questions: ComprehensionQuestion[] = [
    {
      id: `off-${timestamp}-q1`,
      questionText: `What did ${name} do when the bottle spilled?`,
      options: [
        "Walked around it quickly",
        "Knelt down and moved the bottle away",
        "Shouted at the younger child",
      ],
      correctIndex: 1,
      type: "literal",
      explanation: `${name} knelt down, lifted the bottle, and moved it off the path.`,
    },
    {
      id: `off-${timestamp}-q2`,
      questionText: `Why did ${name} ask "Are you hurt?"`,
      options: [
        "To check if the younger child was safe",
        "To get a reward",
        "To find the bottle owner",
      ],
      correctIndex: 0,
      type: "inferential",
      explanation: "Checking on someone shows care for their safety.",
    },
    {
      id: `off-${timestamp}-q3`,
      questionText: `Which skill best matches what ${name} practised?`,
      options: [skill.title, "Running fast", "Staying silent"],
      correctIndex: 0,
      type: "vocabulary",
      explanation: skill.keyMoralLesson,
    },
  ];

  return {
    id: `living-${params.child.id.slice(0, 6)}-${timestamp}`,
    title: `${name} and the Spilled Bottle`,
    levelMin: level,
    levelMax: level,
    targetAgeGroup: `Ages ${params.child.age || 6}`,
    themes: [
      skill.category,
      "character",
      `skill:${skill.id}`,
      ...params.words.map((w) => `word:${w}`),
    ],
    estimatedMinutes: level <= 2 ? 4 : 6,
    coverEmoji: skill.emoji,
    pages,
    questions,
  };
}

// ─── SECTION 4: MAIN GENERATION ENTRY POINT ─────────────────────────────────

/**
 * Generates a personal Living Story chapter for a child.
 * Calls the server route which chains Groq, Gemini, and OpenRouter.
 * Falls back to a concrete offline chapter if the route fails.
 *
 * @param child Target child profile
 * @returns Generated SampleStory ready to display or read
 */
export async function generateLivingChapterForChild(
  child: ChildProfile
): Promise<SampleStory> {
  // Server side rendering guard: relative fetch is unavailable outside the browser
  const canCallApi = typeof window !== "undefined";

  if (canCallApi) {
    try {
      const response = await fetch("/api/generate-living-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: child.id,
          childName: child.name,
          readingLevel: child.reading_level || 2,
          age: child.age || 6,
        }),
      });

      const payload = (await response.json()) as GenerateApiResponse;

      if (response.ok && payload.story && payload.story.pages?.length) {
        return payload.story;
      }

      console.warn(
        "[livingStory] API returned no usable story, using offline chapter:",
        payload.error
      );
    } catch (err) {
      console.warn("[livingStory] API unreachable, using offline chapter:", err);
    }
  }

  // Offline path: build a concrete chapter and persist it directly
  const { data: recent } = await getRecentStumbledWords(child.id, 6);
  const words = (recent || []).map((r) => r.word).filter(Boolean);
  const skill = getRandomLifeSkill();

  const offlineStory = buildOfflineChapter({ child, words, skill });

  try {
    await supabase.from("generated_stories").insert({
      id: offlineStory.id,
      child_id: child.id,
      chapter_number: 1,
      title: offlineStory.title,
      story_data: offlineStory,
      target_words: words,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("[livingStory] Offline chapter not saved to database:", err);
  }

  return offlineStory;
}

/**
 * Rich variant returning skill and target word metadata for parent UI badges.
 *
 * @param child Target child profile
 * @returns Story plus the skill title, target words, and engine used
 */
export async function generateLivingChapterDetailed(
  child: ChildProfile
): Promise<LivingChapterResult> {
  if (typeof window !== "undefined") {
    try {
      const response = await fetch("/api/generate-living-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: child.id,
          childName: child.name,
          readingLevel: child.reading_level || 2,
          age: child.age || 6,
        }),
      });

      const payload = (await response.json()) as GenerateApiResponse;

      if (response.ok && payload.story && payload.story.pages?.length) {
        return {
          story: payload.story,
          skillTitle: payload.skill?.title || "Character",
          targetWords: payload.targetWords || [],
          engine: payload.engine || "unknown",
        };
      }
    } catch (err) {
      console.warn("[livingStory] Detailed generation fell back offline:", err);
    }
  }

  const story = await generateLivingChapterForChild(child);
  return {
    story,
    skillTitle: "Character",
    targetWords: extractTargetWordsFromStory(story),
    engine: "offline",
  };
}

// ─── SECTION 5: RETRIEVAL AND PARENT CONTROLS ───────────────────────────────

/**
 * Fetches all generated Living Story chapters for a child.
 *
 * @param childId Target child profile id
 * @returns Array of SampleStory objects, newest first
 */
export async function getGeneratedStoriesForChild(
  childId: string
): Promise<SampleStory[]> {
  try {
    const { data, error } = await supabase
      .from("generated_stories")
      .select("story_data")
      .eq("child_id", childId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data
      .map((row: { story_data: unknown }) => row.story_data as SampleStory)
      .filter((s) => s && Array.isArray(s.pages));
  } catch {
    return [];
  }
}

/**
 * Fetches chapters with their creation timestamps for parent history views.
 *
 * @param childId Target child profile id
 * @returns Array of records including created_at
 */
export async function getGeneratedChapterRecords(
  childId: string
): Promise<Array<{ story: SampleStory; createdAt: string; targetWords: string[] }>> {
  try {
    const { data, error } = await supabase
      .from("generated_stories")
      .select("story_data, created_at, target_words")
      .eq("child_id", childId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((row) => ({
      story: row.story_data as SampleStory,
      createdAt: (row.created_at as string) || new Date().toISOString(),
      targetWords: Array.isArray(row.target_words)
        ? (row.target_words as string[])
        : [],
    }));
  } catch {
    return [];
  }
}

/**
 * Parent control: permanently removes a generated chapter.
 *
 * @param storyId Generated story id
 * @param childId Owning child id, used as a safety scope
 * @returns Error object or null on success
 */
export async function deleteGeneratedStory(
  storyId: string,
  childId: string
): Promise<{ error: unknown | null }> {
  try {
    const { error } = await supabase
      .from("generated_stories")
      .delete()
      .eq("id", storyId)
      .eq("child_id", childId);

    return { error };
  } catch (err) {
    return { error: err };
  }
}