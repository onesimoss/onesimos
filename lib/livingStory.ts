/**
 * @file lib/livingStory.ts
 * @description Living Story Book Generation Engine for Onesimos (The Moat).
 * Weaves recent stumbling vocabulary and core virtues (from the 25 Life Skills framework)
 * into coherent, morally uplifting personal story chapters.
 *
 * @dependencies
 * - @/lib/supabaseClient (Database persistence for generated chapters)
 * - @/lib/children (ChildProfile types)
 * - @/lib/stumbledWords (Fetching target stumbled words)
 * - @/lib/lifeSkills (25 Virtues & Life Skills framework)
 * - @/lib/sampleStories (SampleStory & ComprehensionQuestion interfaces)
 */

import { supabase } from "./supabaseClient";
import type { ChildProfile } from "./children";
import { getRecentStumbledWords } from "./stumbledWords";
import { getRandomLifeSkill, type LifeSkill } from "./lifeSkills";
import type { SampleStory, StoryPage, ComprehensionQuestion } from "./sampleStories";

// ─── SECTION 1: TYPES & INTERFACES ─────────────────────────────────────────

export interface GeneratedChapterRecord {
  id: string;
  child_id: string;
  chapter_number: number;
  title: string;
  story_data: SampleStory;
  target_words: string[];
  created_at: string;
}

function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ─── SECTION 2: CORE LIVING STORY GENERATION ────────────────────────────────

/**
 * Generates a personalized Living Story chapter centered around a specific
 * Life Skill virtue (e.g. Body Safety, Money Basics, Managing Emotions, Honesty)
 * while weaving the child's stumbled words into natural sentences.
 */
export async function generateLivingChapterForChild(
  child: ChildProfile
): Promise<SampleStory> {
  // 1. Fetch recent stumbled words for this child
  const { data: recentStumbled } = await getRecentStumbledWords(child.id, 6);
  const targetWords = (recentStumbled || []).map((w) => w.word);

  // 2. Select a character-building Life Skill for this chapter
  const skill: LifeSkill = getRandomLifeSkill();

  // 3. Extract target vocabulary fallback tokens
  const w1 = targetWords[0] ? targetWords[0].toLowerCase() : "kite";
  const w2 = targetWords[1] ? targetWords[1].toLowerCase() : "tree";
  const w3 = targetWords[2] ? targetWords[2].toLowerCase() : "courage";

  const level = child.reading_level || 2;
  const childName = capitalize(child.name);

  // 4. Construct coherent story pages weaving the life skill and stumbled words
  const pages: StoryPage[] = [
    {
      text: `${childName} was practicing ${skill.title.toLowerCase()} on a pleasant morning.`,
      imageEmoji: skill.emoji,
    },
    {
      text: `While outside, ${childName} noticed a high ${w1} near the garden boundary.`,
      imageEmoji: "🌳",
    },
    {
      text: `Remembering that ${skill.keyMoralLesson.toLowerCase()}, ${childName} paused to think carefully.`,
      imageEmoji: "🧠",
    },
    {
      text: `With clear focus, ${childName} handled the situation near the ${w2} with great wisdom.`,
      imageEmoji: "✨",
    },
    {
      text: `Mama smiled proudly and commended ${childName} for showing such ${w3} and character.`,
      imageEmoji: "🌟",
    },
  ];

  // 5. Build comprehension questions reinforcing both literacy and character
  const questions: ComprehensionQuestion[] = [
    {
      id: `gen-q1-${Date.now()}`,
      questionText: `What virtue or skill was ${childName} practicing in the story?`,
      options: [skill.title, "Driving a truck", "Loud shouting"],
      correctIndex: 0,
      type: "literal",
      explanation: `${childName} was practicing ${skill.title.toLowerCase()} in this story.`,
    },
    {
      id: `gen-q2-${Date.now()}`,
      questionText: `What moral lesson did ${childName} demonstrate?`,
      options: [
        skill.keyMoralLesson,
        "Ignoring rules is good",
        "Throwing things away",
      ],
      correctIndex: 0,
      type: "inferential",
      explanation: `${childName} showed that ${skill.keyMoralLesson.toLowerCase()}`,
    },
  ];

  // 6. Assemble complete story object
  const timestamp = Date.now();
  const storyId = `living-${child.id.slice(0, 5)}-${timestamp}`;
  const title = `${childName} and the Lesson in ${skill.title}`;

  const newStory: SampleStory = {
    id: storyId,
    title,
    levelMin: level,
    levelMax: level,
    targetAgeGroup: `Ages ${child.age || 6}`,
    themes: [skill.category, "character", "virtue"],
    estimatedMinutes: 4,
    coverEmoji: skill.emoji,
    pages,
    questions,
  };

  // 7. Persist to Supabase generated_stories table
  try {
    await supabase.from("generated_stories").insert({
      id: storyId,
      child_id: child.id,
      chapter_number: 1,
      title,
      story_data: newStory,
      target_words: targetWords,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Generated story created in-memory (DB save bypassed):", err);
  }

  return newStory;
}

/**
 * Fetches all generated Living Story chapters for a child from Supabase.
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

    return data.map((row: { story_data: unknown }) => row.story_data as SampleStory);
  } catch {
    return [];
  }
}

/**
 * Parent Control: Deletes a generated story chapter by ID.
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