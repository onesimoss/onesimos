/**
 * @file lib/livingStory.ts
 * @description Living Story Book Generation Engine for Onesimos (The Moat).
 * Dynamically weaves a child's recent stumbling vocabulary, reading level, and 
 * interests into personal story chapters set in vibrant African environments.
 *
 * @dependencies
 * - @/lib/supabaseClient (Database persistence for generated chapters)
 * - @/lib/children (ChildProfile types)
 * - @/lib/stumbledWords (Fetching target stumbled words)
 * - @/lib/sampleStories (SampleStory & ComprehensionQuestion interfaces)
 */

import { supabase } from "./supabaseClient";
import type { ChildProfile } from "./children";
import { getRecentStumbledWords } from "./stumbledWords";
import type { SampleStory, StoryPage, ComprehensionQuestion } from "./sampleStories";

// ─── Section 1: Types & Storage Interfaces ───

export interface GeneratedChapterRecord {
  id: string;
  child_id: string;
  chapter_number: number;
  title: string;
  story_data: SampleStory;
  target_words: string[];
  created_at: string;
}

// ─── Section 2: Personal Story Generation Templates ───

interface StoryTemplate {
  titlePrefix: string;
  coverEmoji: string;
  themes: string[];
  pages: (childName: string, words: string[]) => StoryPage[];
  questions: (childName: string, words: string[]) => ComprehensionQuestion[];
}

/**
 * Story templates tailored for Level 1 & 2 (Ages 3–6, Emerging Readers).
 */
const LEVEL_1_2_TEMPLATES: StoryTemplate[] = [
  {
    titlePrefix: "The Secret Trail to the River",
    coverEmoji: "🌊",
    themes: ["adventure", "animals"],
    pages: (name, words) => {
      const target1 = words[0] || "whisper";
      const target2 = words[1] || "bridge";
      return [
        { text: `${name} walked down a quiet path near the big iroko tree.`, imageEmoji: "🌳" },
        { text: `The birds began to ${target1} in the morning breeze.`, imageEmoji: "🐦" },
        { text: `${name} saw a tiny wooden ${target2} across the stream.`, imageEmoji: "🌉" },
        { text: "A small puppy ran across and wagged its tail with joy.", imageEmoji: "🐶" },
        { text: `${name} felt happy and brave after a wonderful adventure.`, imageEmoji: "⭐" },
      ];
    },
    questions: (name, words) => [
      {
        id: `gen-q1-${Date.now()}`,
        questionText: `Where did ${name} walk in the morning?`,
        options: ["Near the big iroko tree", "Inside a giant shop", "On a snowy mountain"],
        correctIndex: 0,
        type: "literal",
        explanation: `${name} walked down a quiet path near the big iroko tree.`,
      },
      {
        id: `gen-q2-${Date.now()}`,
        questionText: `What animal ran across the tiny wooden bridge?`,
        options: ["A small puppy", "A big lion", "A quiet fish"],
        correctIndex: 0,
        type: "literal",
        explanation: "A small puppy ran across and wagged its tail!",
      },
    ],
  },
  {
    titlePrefix: "The Golden Sunshine Adventure",
    coverEmoji: "☀️",
    themes: ["family", "adventure"],
    pages: (name, words) => {
      const target1 = words[0] || "courage";
      const target2 = words[1] || "glimmer";
      return [
        { text: `The warm morning sun began to shine over ${name}'s house.`, imageEmoji: "☀️" },
        { text: `${name} found a small box with a bright golden ${target2}.`, imageEmoji: "✨" },
        { text: `Mama smiled and said, "It takes ${target1} to try new things."`, imageEmoji: "👩" },
        { text: `${name} held the golden box and skipped happily into the garden.`, imageEmoji: "🌻" },
        { text: "Every new day brings bright new discoveries!", imageEmoji: "🌈" },
      ];
    },
    questions: (name, words) => [
      {
        id: `gen-q1-${Date.now()}`,
        questionText: `What did ${name} find in the small box?`,
        options: ["A silver key", "A bright golden glimmer", "A blue marble"],
        correctIndex: 1,
        type: "literal",
        explanation: `${name} found a small box with a bright golden glimmer.`,
      },
      {
        id: `gen-q2-${Date.now()}`,
        questionText: "What did Mama say it takes to try new things?",
        options: ["Courage", "Speed", "Money"],
        correctIndex: 0,
        type: "inferential",
        explanation: "Mama explained that trying new things takes courage.",
      },
    ],
  },
];

/**
 * Story templates tailored for Level 3 & 4 (Ages 7–9, Confident Readers).
 */
const LEVEL_3_4_TEMPLATES: StoryTemplate[] = [
  {
    titlePrefix: "The Whispering Library of Lagos",
    coverEmoji: "📚",
    themes: ["mystery", "culture", "adventure"],
    pages: (name, words) => {
      const target1 = words[0] || "curious";
      const target2 = words[1] || "shadow";
      const target3 = words[2] || "glimmer";
      return [
        { text: `${name} visited grandmother's quiet courtyard house in Lagos.`, imageEmoji: "🏡" },
        { text: `Being very ${target1}, ${name} explored behind the carved wooden doors.`, imageEmoji: "🔍" },
        { text: `A soft ${target2} moved across a bookshelf full of glowing leather books.`, imageEmoji: "📚" },
        { text: `One ancient book had a golden ${target3} along its smooth spine.`, imageEmoji: "✨" },
        { text: `As ${name} opened the cover, the pages shared stories of courage and wisdom.`, imageEmoji: "📖" },
        { text: `${name} closed the book proudly, ready to share the secret with family.`, imageEmoji: "💡" },
      ];
    },
    questions: (name, words) => [
      {
        id: `gen-q1-${Date.now()}`,
        questionText: `Where was grandmother's house located?`,
        options: ["In Lagos", "In London", "On an island"],
        correctIndex: 0,
        type: "literal",
        explanation: "Grandmother's quiet courtyard house was in Lagos.",
      },
      {
        id: `gen-q2-${Date.now()}`,
        questionText: `What was special about the books on the bookshelf?`,
        options: ["They were covered in dust", "They were glowing leather books", "They were torn"],
        correctIndex: 1,
        type: "literal",
        explanation: "The bookshelf was full of glowing leather books.",
      },
    ],
  },
];

// ─── Section 3: Core Story Generator Engine ───

/**
 * Generates a personalized Living Story chapter for a child profile, weaving their 
 * real stumbled words into a brand-new level-matched story.
 *
 * @param child - Target ChildProfile object
 * @returns Generated SampleStory object
 */
export async function generateLivingChapterForChild(child: ChildProfile): Promise<SampleStory> {
  // 1. Fetch recent stumbled words for this child
  const { data: recentStumbled } = await getRecentStumbledWords(child.id, 6);
  const targetWords = (recentStumbled || []).map((w) => w.word);

  // 2. Select appropriate template set by child's reading level
  const isEarlyReader = (child.reading_level || 2) <= 2;
  const pool = isEarlyReader ? LEVEL_1_2_TEMPLATES : LEVEL_3_4_TEMPLATES;
  
  // Pick a template pseudorandomly based on date to keep it fresh
  const templateIndex = Math.floor(Math.random() * pool.length);
  const selectedTemplate = pool[templateIndex];

  // 3. Build unique story ID and title
  const timestamp = Date.now();
  const storyId = `living-${child.id.slice(0, 5)}-${timestamp}`;
  const title = `${child.name} and ${selectedTemplate.titlePrefix}`;

  // 4. Generate story pages and comprehension questions with woven target words
  const pages = selectedTemplate.pages(child.name, targetWords);
  const questions = selectedTemplate.questions(child.name, targetWords);

  const newStory: SampleStory = {
    id: storyId,
    title,
    levelMin: child.reading_level || 2,
    levelMax: child.reading_level || 2,
    targetAgeGroup: `Ages ${child.age}`,
    themes: selectedTemplate.themes,
    estimatedMinutes: isEarlyReader ? 4 : 7,
    coverEmoji: selectedTemplate.coverEmoji,
    pages,
    questions,
  };

  // 5. Persist to Supabase if generated_stories table exists (background silent save)
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
    // Non-blocking fallback if table hasn't been created yet
    console.warn("Generated story created in-memory (DB save bypassed):", err);
  }

  return newStory;
}

/**
 * Fetches all generated Living Story chapters for a child from Supabase.
 *
 * @param childId - Target child profile UUID
 * @returns Array of generated SampleStory objects
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