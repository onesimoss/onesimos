/**
 * @file app/api/generate-living-story/route.ts
 * @description Server-side Living Chapter generator for Onesimos.
 * Provider chain (first success wins):
 *   1. Groq        (GROQ_API_KEY)
 *   2. Gemini      (GEMINI_API_KEY)
 *   3. OpenRouter  (OPENROUTER_API_KEY)
 *   4. Dynamic 25-Virtue Offline Matrix (no key required)
 *
 * Never put raw API keys in source. Keys live only in env vars.
 *
 * @module app/api/generate-living-story/route
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getRecentStumbledWords } from "@/lib/stumbledWords";
import { getRandomLifeSkill, getLifeSkillById, type LifeSkill } from "@/lib/lifeSkills";
import type {
  SampleStory,
  StoryPage,
  ComprehensionQuestion,
} from "@/lib/sampleStories";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─── TYPES ──────────────────────────────────────────────────────────────────

interface GenerateBody {
  childId: string;
  childName: string;
  readingLevel?: number;
  age?: number;
}

interface LlmStoryPayload {
  title: string;
  coverEmoji?: string;
  pages: Array<{ text: string; imageEmoji?: string }>;
  questions: Array<{
    questionText: string;
    options: string[];
    correctIndex: number;
    type: "literal" | "inferential" | "vocabulary";
    explanation: string;
  }>;
}

type EngineName = "groq" | "gemini" | "openrouter" | "offline";

// ─── HELPERS ────────────────────────────────────────────────────────────────

function capitalize(name: string): string {
  const t = name.trim();
  if (!t) return "Friend";
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const STORY_SETTINGS = [
  "at the neighborhood park playground",
  "along the bustling market path",
  "in the quiet corner of the school library",
  "near the big mango tree in the courtyard",
  "at the community garden gate",
  "on a rainy afternoon on the porch",
  "during art time in the classroom",
  "at the evening bus stop with family",
];

function buildPrompt(params: {
  childName: string;
  level: number;
  words: string[];
  skill: LifeSkill;
}): string {
  const { childName, level, words, skill } = params;
  const wordList =
    words.length > 0 ? words.join(", ") : "kindness, patience, brave";
  
  const randomSetting = STORY_SETTINGS[Math.floor(Math.random() * STORY_SETTINGS.length)];

  return `You write short, creative children's reading chapters for African and diaspora families (ages 3-9).
Secular, warm, concrete. No preaching. No vague lines like "showed great wisdom" without saying WHAT the child DID.

CHILD NAME (must appear often, correctly capitalised): ${childName}
READING LEVEL 1-4 (1=very short 4-word sentences, 4=longer 10-word sentences): ${level}
STUMBLED WORDS to weave naturally as vocabulary practice: ${wordList}
LIFE SKILL FOCUS: ${skill.title}
SKILL MEANING: ${skill.description}
MORAL IN ONE LINE: ${skill.keyMoralLesson}
SETTING SUGGESTION: ${randomSetting}

RULES:
- 5 pages for level 1-2, 6 pages for level 3-4.
- Make the story TITLE unique and creative based on ${skill.title}. Examples: "${childName} and the Lost Puppy", "${childName}'s Mango Tree Choice", "${childName} at the Big Gate". NEVER use "Spilled Bottle".
- Use at least 3 of the stumbled words naturally inside sentences.
- Generate exactly 3 comprehension questions (1 literal, 1 inferential, 1 vocabulary) with 3 options each (correctIndex 0-2).
- Return ONLY valid JSON matching:
{
  "title": "Creative Title With ${childName}",
  "coverEmoji": "one emoji",
  "pages": [{"text":"...", "imageEmoji":"..."}],
  "questions": [
    {
      "questionText": "...",
      "options": ["a", "b", "c"],
      "correctIndex": 0,
      "type": "literal",
      "explanation": "..."
    }
  ]
}`;
}

// ─── DYNAMIC 25-VIRTUE OFFLINE MATRIX ───────────────────────────────────────

function getSkillTemplateScenario(skillId: number, name: string, w: string[]): {
  title: string;
  coverEmoji: string;
  pages: StoryPage[];
  questions: ComprehensionQuestion[];
} {
  const ts = Date.now();

  switch (skillId % 5) {
    case 1:
      return {
        title: `${name} and the Tall Tree`,
        coverEmoji: "🌳",
        pages: [
          { text: `${name} walked past the big tree near the ${w[0] || "gate"}.`, imageEmoji: "🌳" },
          { text: `A small kite was stuck high in the leaves above the path.`, imageEmoji: "🪁" },
          { text: `${name} stopped and looked at the climbing rope nearby.`, imageEmoji: "🧗" },
          { text: `Instead of rushing, ${name} called an adult for help to safely reach the ${w[1] || "branch"}.`, imageEmoji: "🤝" },
          { text: `Together, they gently pulled the kite down and handed it to a happy child.`, imageEmoji: "😊" },
          { text: `At home, ${name} shared a fresh ${w[2] || "water"} bottle and smiled.`, imageEmoji: "💧" },
        ],
        questions: [
          {
            id: `lq1-${ts}`,
            questionText: `What was stuck in the tree?`,
            options: ["A small kite", "A basketball", "A hat"],
            correctIndex: 0,
            type: "literal",
            explanation: "A small kite was stuck high in the leaves.",
          },
          {
            id: `lq2-${ts}`,
            questionText: `Why did ${name} call an adult for help?`,
            options: ["To be safe and thoughtful", "To win a race", "Because they were scared"],
            correctIndex: 0,
            type: "inferential",
            explanation: `${name} made a safe, careful choice.`,
          },
          {
            id: `lq3-${ts}`,
            questionText: `What did ${name} do after getting the kite?`,
            options: ["Handed it to a happy child", "Kept it secret", "Threw it away"],
            correctIndex: 0,
            type: "vocabulary",
            explanation: `${name} handed the kite back kindly.`,
          },
        ],
      };

    case 2:
      return {
        title: `${name} and the Lost Puppy`,
        coverEmoji: "🐶",
        pages: [
          { text: `${name} heard a quiet sound near the ${w[0] || "garden"} fence.`, imageEmoji: "🏡" },
          { text: `A little puppy with a blue collar was sitting under a ${w[1] || "bench"}.`, imageEmoji: "🐶" },
          { text: `${name} did not run or shout. ${name} walked slowly and spoke softly.`, imageEmoji: "🌱" },
          { text: `${name} checked the collar and saw a phone number written clearly.`, imageEmoji: "🔍" },
          { text: `Mama called the number, and the neighbor came quickly to hug their pet.`, imageEmoji: "❤️" },
          { text: `${name} felt proud for staying calm and offering a cup of ${w[2] || "milk"}.`, imageEmoji: "🥛" },
        ],
        questions: [
          {
            id: `lq1-${ts}`,
            questionText: `Where was the puppy sitting?`,
            options: ["Under a bench", "In a car", "On the roof"],
            correctIndex: 0,
            type: "literal",
            explanation: "The puppy was sitting under a bench.",
          },
          {
            id: `lq2-${ts}`,
            questionText: `How did ${name} approach the puppy?`,
            options: ["Walked slowly and spoke softly", "Shouted loudly", "Ran away"],
            correctIndex: 0,
            type: "inferential",
            explanation: "Gentle words and slow steps help animals feel safe.",
          },
          {
            id: `lq3-${ts}`,
            questionText: `Who came to pick up the puppy?`,
            options: ["The neighbor", "A bus driver", "A teacher"],
            correctIndex: 0,
            type: "vocabulary",
            explanation: "The neighbor came quickly when Mama called the number.",
          },
        ],
      };

    case 3:
      return {
        title: `${name}'s Shared Umbrella`,
        coverEmoji: "☂️",
        pages: [
          { text: `Rain started to fall heavily over the ${w[0] || "bus"} stop.`, imageEmoji: "🌧️" },
          { text: `${name} opened a bright yellow umbrella with a strong handle.`, imageEmoji: "☂️" },
          { text: `A classmate was standing in the rain, clutching a heavy ${w[1] || "bag"}.`, imageEmoji: "🎒" },
          { text: `${name} stepped closer and held the umbrella over both of them.`, imageEmoji: "🤗" },
          { text: `They walked together safely under the shield until the bus arrived.`, imageEmoji: "🚌" },
          { text: `The classmate thanked ${name} with a big smile for sharing the ${w[2] || "shelter"}.`, imageEmoji: "🌟" },
        ],
        questions: [
          {
            id: `lq1-${ts}`,
            questionText: `What color was ${name}'s umbrella?`,
            options: ["Bright yellow", "Dark blue", "Green"],
            correctIndex: 0,
            type: "literal",
            explanation: `${name} opened a bright yellow umbrella.`,
          },
          {
            id: `lq2-${ts}`,
            questionText: `What action showed kindness?`,
            options: ["Sharing the umbrella in the rain", "Running ahead alone", "Hiding the umbrella"],
            correctIndex: 0,
            type: "inferential",
            explanation: "Offering shelter to a classmate in the rain shows care.",
          },
          {
            id: `lq3-${ts}`,
            questionText: `Where were they waiting?`,
            options: ["At the bus stop", "At a bakery", "In a cinema"],
            correctIndex: 0,
            type: "vocabulary",
            explanation: "Rain fell heavily over the bus stop.",
          },
        ],
      };

    default:
      return {
        title: `${name} and the Community Garden`,
        coverEmoji: "🌻",
        pages: [
          { text: `${name} arrived at the garden path carrying a clean ${w[0] || "bucket"}.`, imageEmoji: "🌻" },
          { text: `The green plants needed water after a warm, sunny morning.`, imageEmoji: "☀️" },
          { text: `${name} filled the container carefully near the ${w[1] || "tap"}.`, imageEmoji: "🚰" },
          { text: `${name} poured water at the roots of every seedling without spilling.`, imageEmoji: "🌱" },
          { text: `An elder nodded with joy and handed ${name} a sweet ${w[2] || "orange"}.`, imageEmoji: "🍊" },
          { text: `${name} thanked them politely and walked home feeling cheerful.`, imageEmoji: "🏡" },
        ],
        questions: [
          {
            id: `lq1-${ts}`,
            questionText: `What did ${name} carry to the garden?`,
            options: ["A clean bucket", "A heavy box", "A football"],
            correctIndex: 0,
            type: "literal",
            explanation: `${name} carried a clean bucket to the garden path.`,
          },
          {
            id: `lq2-${ts}`,
            questionText: `Where did ${name} pour the water?`,
            options: ["At the roots of every seedling", "On the stone path", "In the air"],
            correctIndex: 0,
            type: "inferential",
            explanation: "Pouring water at the roots helps plants grow strong.",
          },
          {
            id: `lq3-${ts}`,
            questionText: `What fruit did the elder give ${name}?`,
            options: ["A sweet orange", "An apple", "A banana"],
            correctIndex: 0,
            type: "vocabulary",
            explanation: "The elder handed ${name} a sweet orange.",
          },
        ],
      };
  }
}

function offlineFallback(params: {
  childName: string;
  level: number;
  words: string[];
  skill: LifeSkill;
  age?: number;
}): SampleStory {
  const name = capitalize(params.childName);
  const scenario = getSkillTemplateScenario(params.skill.id, name, params.words);

  const pages = scenario.pages.slice(0, params.level <= 2 ? 5 : 6);

  return {
    id: `living-offline-${Date.now()}`,
    title: scenario.title,
    levelMin: params.level,
    levelMax: params.level,
    targetAgeGroup: `Ages ${params.age || 6}`,
    themes: [params.skill.category, "character", params.skill.title.toLowerCase()],
    estimatedMinutes: params.level <= 2 ? 4 : 6,
    coverEmoji: scenario.coverEmoji || params.skill.emoji,
    pages,
    questions: scenario.questions,
  };
}

function parseJsonPayload(raw: string): LlmStoryPayload | null {
  try {
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    return JSON.parse(cleaned) as LlmStoryPayload;
  } catch {
    return null;
  }
}

// ─── PROVIDERS ──────────────────────────────────────────────────────────────

async function generateWithGroq(
  prompt: string
): Promise<LlmStoryPayload | null> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.8,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a creative children's literacy author. Return only valid JSON.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      console.error("[living-story] Groq HTTP", res.status, await res.text());
      return null;
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return parseJsonPayload(data.choices?.[0]?.message?.content || "");
  } catch (err) {
    console.error("[living-story] Groq exception", err);
    return null;
  }
}

async function generateWithGemini(
  prompt: string
): Promise<LlmStoryPayload | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      console.error("[living-story] Gemini HTTP", res.status, await res.text());
      return null;
    }

    const data = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return parseJsonPayload(raw);
  } catch (err) {
    console.error("[living-story] Gemini exception", err);
    return null;
  }
}

async function generateWithOpenRouter(
  prompt: string
): Promise<LlmStoryPayload | null> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;

  const model =
    process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free";

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://onesimos.vercel.app",
        "X-Title": "Onesimos Living Story",
      },
      body: JSON.stringify({
        model,
        temperature: 0.8,
        messages: [
          {
            role: "system",
            content:
              "You are a children's literacy author. Return only valid JSON, no markdown.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      console.error(
        "[living-story] OpenRouter HTTP",
        res.status,
        await res.text()
      );
      return null;
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return parseJsonPayload(data.choices?.[0]?.message?.content || "");
  } catch (err) {
    console.error("[living-story] OpenRouter exception", err);
    return null;
  }
}

function toSampleStory(
  payload: LlmStoryPayload,
  meta: {
    childId: string;
    childName: string;
    level: number;
    age?: number;
    skill: LifeSkill;
    words: string[];
  }
): SampleStory {
  const ts = Date.now();
  const id = `living-${meta.childId.slice(0, 6)}-${ts}`;
  const name = capitalize(meta.childName);

  const pages: StoryPage[] = (payload.pages || []).map((p) => ({
    text: p.text,
    imageEmoji: p.imageEmoji || meta.skill.emoji,
  }));

  const questions: ComprehensionQuestion[] = (payload.questions || []).map(
    (q, i) => ({
      id: `gen-${ts}-q${i}`,
      questionText: q.questionText,
      options: q.options?.slice(0, 3) || ["Yes", "No", "Maybe"],
      correctIndex:
        typeof q.correctIndex === "number" &&
        q.correctIndex >= 0 &&
        q.correctIndex <= 2
          ? q.correctIndex
          : 0,
      type: q.type || "literal",
      explanation: q.explanation || "Re-read that part of the story.",
    })
  );

  const fallback = offlineFallback({
    childName: meta.childName,
    level: meta.level,
    words: meta.words,
    skill: meta.skill,
    age: meta.age,
  });

  return {
    id,
    title: payload.title?.includes(name)
      ? payload.title
      : `${name}: ${payload.title || meta.skill.title}`,
    levelMin: meta.level,
    levelMax: meta.level,
    targetAgeGroup: `Ages ${meta.age || 6}`,
    themes: [
      meta.skill.category,
      "character",
      meta.skill.title.toLowerCase(),
      `skill:${meta.skill.id}`,
      ...meta.words.map((w) => `word:${w}`),
    ],
    estimatedMinutes: meta.level <= 2 ? 4 : 6,
    coverEmoji: payload.coverEmoji || meta.skill.emoji,
    pages: pages.length > 0 ? pages : fallback.pages,
    questions: questions.length >= 2 ? questions : fallback.questions,
  };
}

async function generateWithFailover(
  prompt: string
): Promise<{ payload: LlmStoryPayload | null; engine: EngineName }> {
  const groq = await generateWithGroq(prompt);
  if (groq?.pages?.length) return { payload: groq, engine: "groq" };

  const gemini = await generateWithGemini(prompt);
  if (gemini?.pages?.length) return { payload: gemini, engine: "gemini" };

  const openrouter = await generateWithOpenRouter(prompt);
  if (openrouter?.pages?.length) {
    return { payload: openrouter, engine: "openrouter" };
  }

  return { payload: null, engine: "offline" };
}

// ─── ROUTE ──────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as GenerateBody;
    if (!body?.childId || !body?.childName) {
      return NextResponse.json(
        { error: "childId and childName required" },
        { status: 400 }
      );
    }

    const level =
      body.readingLevel && body.readingLevel >= 1 && body.readingLevel <= 4
        ? body.readingLevel
        : 2;

    const { data: recent } = await getRecentStumbledWords(body.childId, 8);
    const words = (recent || []).map((r) => r.word).filter(Boolean);
    const skill = getRandomLifeSkill();
    const prompt = buildPrompt({
      childName: capitalize(body.childName),
      level,
      words,
      skill,
    });

    const { payload, engine } = await generateWithFailover(prompt);

    let story: SampleStory;
    if (payload?.pages?.length) {
      story = toSampleStory(payload, {
        childId: body.childId,
        childName: body.childName,
        level,
        age: body.age,
        skill,
        words,
      });
    } else {
      story = offlineFallback({
        childName: body.childName,
        level,
        words,
        skill,
        age: body.age,
      });
      story.id = `living-${body.childId.slice(0, 6)}-${Date.now()}`;
      story.themes = [
        ...(story.themes || []),
        `skill:${skill.id}`,
        ...words.map((w) => `word:${w}`),
      ];
    }

    const { error } = await supabase.from("generated_stories").insert({
      id: story.id,
      child_id: body.childId,
      chapter_number: 1,
      title: story.title,
      story_data: story,
      target_words: words,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[living-story] save error", error);
    }

    console.log(
      `[living-story] engine=${engine} child=${body.childId.slice(0, 8)} words=${words.length}`
    );

    return NextResponse.json({
      story,
      skill: {
        id: skill.id,
        title: skill.title,
        emoji: skill.emoji,
        lesson: skill.keyMoralLesson,
      },
      targetWords: words,
      engine,
    });
  } catch (err) {
    console.error("[living-story] Unhandled", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}