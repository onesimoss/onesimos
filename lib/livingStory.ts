/**
 * @file lib/livingStory.ts
 * @description Living Story Book Generation Engine for Onesimos (The Moat).
 * Dynamically weaves a child's recent stumbling vocabulary, reading level, and 
 * interests into coherent, highly engageable personal story chapters set in 
 * vibrant African environments.
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

interface StoryTemplate {
  titlePrefix: string;
  coverEmoji: string;
  themes: string[];
  pages: (childName: string, words: string[]) => StoryPage[];
  questions: (childName: string, words: string[]) => ComprehensionQuestion[];
}

// ─── SECTION 2: TEMPLATE GENERATOR HELPERS ─────────────────────────────────

function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ─── SECTION 3: LEVEL 1 & 2 TEMPLATES (EMERGING READERS, AGES 3–6) ─────────

const LEVEL_1_2_TEMPLATES: StoryTemplate[] = [
  {
    titlePrefix: "and the Secret Garden Trail",
    coverEmoji: "🌿",
    themes: ["nature", "adventure"],
    pages: (name, words) => {
      const w1 = words[0] ? words[0].toLowerCase() : "tree";
      const w2 = words[1] ? words[1].toLowerCase() : "river";
      const w3 = words[2] ? words[2].toLowerCase() : "green";

      return [
        {
          text: `${name} went out into the warm morning sunshine.`,
          imageEmoji: "☀️",
        },
        {
          text: `Near the garden gate stood a tall ${w1} with bright branches.`,
          imageEmoji: "🌳",
        },
        {
          text: `${name} could hear the peaceful sound of the nearby ${w2}.`,
          imageEmoji: "🌊",
        },
        {
          text: `All around, the grass looked fresh and ${w3} in the light.`,
          imageEmoji: "🌱",
        },
        {
          text: `${name} smiled proudly, feeling happy after a lovely walk outside.`,
          imageEmoji: "🌟",
        },
      ];
    },
    questions: (name, words) => {
      const w1 = words[0] ? words[0].toLowerCase() : "tree";
      return [
        {
          id: `gen-q1-${Date.now()}`,
          questionText: `What did ${name} see near the garden gate?`,
          options: [`A tall ${w1}`, "A small cat", "A red bicycle"],
          correctIndex: 0,
          type: "literal",
          explanation: `${name} found a tall ${w1} standing near the garden gate.`,
        },
        {
          id: `gen-q2-${Date.now()}`,
          questionText: `How did ${name} feel at the end of the walk?`,
          options: ["Happy and proud", "Tired and sad", "Scared"],
          correctIndex: 0,
          type: "inferential",
          explanation: `${name} felt happy and proud after exploring outside.`,
        },
      ];
    },
  },
  {
    titlePrefix: "and the Golden Box of Courage",
    coverEmoji: "✨",
    themes: ["family", "discovery"],
    pages: (name, words) => {
      const w1 = words[0] ? words[0].toLowerCase() : "found";
      const w2 = words[1] ? words[1].toLowerCase() : "near";

      return [
        {
          text: `${name} sat with grandmother on the cozy veranda.`,
          imageEmoji: "🏡",
        },
        {
          text: `Together, they ${w1} a carved wooden chest under the table.`,
          imageEmoji: "🎁",
        },
        {
          text: `Grandmother placed it right ${w2} ${name}'s hands.`,
          imageEmoji: "🤲",
        },
        {
          text: "Inside was a shining star badge that glowed warmly.",
          imageEmoji: "⭐",
        },
        {
          text: `${name} held it tightly, ready to learn new things every day!`,
          imageEmoji: "🚀",
        },
      ];
    },
    questions: (name) => [
      {
        id: `gen-q1-${Date.now()}`,
        questionText: `Where were ${name} and grandmother sitting?`,
        options: ["On the cozy veranda", "In a noisy bus", "At school"],
        correctIndex: 0,
        type: "literal",
        explanation: "They were enjoying a calm moment on the veranda.",
      },
    ],
  },
];

// ─── SECTION 4: LEVEL 3 & 4 TEMPLATES (CONFIDENT READERS, AGES 7–9) ────────

const LEVEL_3_4_TEMPLATES: StoryTemplate[] = [
  {
    titlePrefix: "and the Whispering Baobab Tree",
    coverEmoji: "📚",
    themes: ["culture", "mystery", "adventure"],
    pages: (name, words) => {
      const w1 = words[0] ? words[0].toLowerCase() : "river";
      const w2 = words[1] ? words[1].toLowerCase() : "iroko";
      const w3 = words[2] ? words[2].toLowerCase() : "green";

      return [
        {
          text: `${name} loved reading storybooks beneath the shade of the village courtyard.`,
          imageEmoji: "🏡",
        },
        {
          text: `One afternoon, an ancient breeze drifted gently from the direction of the ${w1}.`,
          imageEmoji: "🌊",
        },
        {
          text: `The wind ruffled the leaves of a magnificent ${w2} tree standing tall nearby.`,
          imageEmoji: "🌳",
        },
        {
          text: `Underneath its ${w3} canopy, ${name} discovered a collection of glowing parchment scrolls.`,
          imageEmoji: "📜",
        },
        {
          text: `Each scroll contained stories of African heroes, bravery, and wisdom.`,
          imageEmoji: "🏆",
        },
        {
          text: `${name} closed the scroll with joy, inspired to write new adventures.`,
          imageEmoji: "✏️",
        },
      ];
    },
    questions: (name) => [
      {
        id: `gen-q1-${Date.now()}`,
        questionText: `What did ${name} discover under the tree?`,
        options: [
          "Glowing parchment scrolls",
          "A forgotten football",
          "A pair of shoes",
        ],
        correctIndex: 0,
        type: "literal",
        explanation: `${name} found ancient glowing parchment scrolls filled with heroic tales.`,
      },
      {
        id: `gen-q2-${Date.now()}`,
        questionText: "What lesson did the scrolls teach?",
        options: [
          "Bravery and wisdom",
          "How to drive a car",
          "How to cook soup",
        ],
        correctIndex: 0,
        type: "inferential",
        explanation: "The stories shared powerful lessons about African history, bravery, and wisdom.",
      },
    ],
  },
];

// ─── SECTION 5: CORE ENGINE LOGIC ─────────────────────────────────────────

/**
 * Generates a personalized Living Story chapter for a child profile,
 * weaving their stumbled vocabulary seamlessly into a brand new story.
 */
export async function generateLivingChapterForChild(
  child: ChildProfile
): Promise<SampleStory> {
  // 1. Fetch recent stumbled words for this child
  const { data: recentStumbled } = await getRecentStumbledWords(child.id, 6);
  const targetWords = (recentStumbled || []).map((w) => w.word);

  // 2. Choose level-appropriate template pool
  const level = child.reading_level || 2;
  const isEarlyReader = level <= 2;
  const pool = isEarlyReader ? LEVEL_1_2_TEMPLATES : LEVEL_3_4_TEMPLATES;

  // Pick random template
  const selectedTemplate = pool[Math.floor(Math.random() * pool.length)];

  // 3. Construct story metadata
  const timestamp = Date.now();
  const storyId = `living-${child.id.slice(0, 5)}-${timestamp}`;
  const title = `${capitalize(child.name)} ${selectedTemplate.titlePrefix}`;

  // 4. Generate story pages and questions
  const pages = selectedTemplate.pages(child.name, targetWords);
  const questions = selectedTemplate.questions(child.name, targetWords);

  const newStory: SampleStory = {
    id: storyId,
    title,
    levelMin: level,
    levelMax: level,
    targetAgeGroup: `Ages ${child.age || 6}`,
    themes: selectedTemplate.themes,
    estimatedMinutes: isEarlyReader ? 3 : 5,
    coverEmoji: selectedTemplate.coverEmoji,
    pages,
    questions,
  };

  // 5. Persist story to public.generated_stories in Supabase
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