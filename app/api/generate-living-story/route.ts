/**
 * @file app/api/generate-living-story/route.ts
 * @description Server-side Living Chapter generator for Onesimos.
 * Provider chain (first success wins):
 *   1. Groq        (GROQ_API_KEY)
 *   2. Gemini      (GEMINI_API_KEY)
 *   3. OpenRouter  (OPENROUTER_API_KEY)
 *   4. Offline concrete template (no key required)
 *
 * Never put raw API keys in source. Keys live only in env vars.
 *
 * @module app/api/generate-living-story/route
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getRecentStumbledWords } from "@/lib/stumbledWords";
import { getRandomLifeSkill, type LifeSkill } from "@/lib/lifeSkills";
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

function buildPrompt(params: {
  childName: string;
  level: number;
  words: string[];
  skill: LifeSkill;
}): string {
  const { childName, level, words, skill } = params;
  const wordList =
    words.length > 0 ? words.join(", ") : "kindness, patience, brave";

  return `You write short children's reading chapters for African and diaspora families (ages 3-9).
Secular, warm, concrete. No preaching. No vague lines like "showed great wisdom" without saying WHAT the child DID.

CHILD NAME (must appear often, correctly capitalised): ${childName}
READING LEVEL 1-4 (1=very short sentences, 4=longer): ${level}
STUMBLED WORDS to weave naturally as vocabulary practice (do not list them as a list; use inside sentences): ${wordList}
LIFE SKILL FOCUS: ${skill.title}
SKILL MEANING: ${skill.description}
MORAL IN ONE LINE (show through action, do not lecture): ${skill.keyMoralLesson}

RULES:
- 5 pages for level 1-2, 6 pages for level 3-4.
- Each page: 1-3 short sentences. Concrete setting (home, school gate, market path, courtyard, bus stop).
- Page 1: ordinary moment. Middle: a real choice or problem tied to the skill. End: clear kind action and calm adult affirmation.
- Use at least 3 of the stumbled words in natural places (not crammed).
- Comprehension: exactly 3 questions (literal, inferential, vocabulary) with 3 options each and correctIndex 0-2.
- Return ONLY valid JSON (no markdown) matching:
{
  "title": "string including ${childName}",
  "coverEmoji": "one emoji",
  "pages": [{"text":"...", "imageEmoji":"..."}],
  "questions": [{"questionText":"...","options":["a","b","c"],"correctIndex":0,"type":"literal","explanation":"..."}]
}`;
}

function offlineFallback(params: {
  childName: string;
  level: number;
  words: string[];
  skill: LifeSkill;
  age?: number;
}): SampleStory {
  const name = capitalize(params.childName);
  const w = [
    params.words[0] || "bag",
    params.words[1] || "gate",
    params.words[2] || "water",
    params.words[3] || "share",
  ].map((x) => x.toLowerCase());

  const skill = params.skill;
  const pages: StoryPage[] = [
    {
      text: `${name} carried a small ${w[0]} toward the ${w[1]} after school.`,
      imageEmoji: "🎒",
    },
    {
      text: `A younger child tripped and spilled a bottle of ${w[2]} across the path.`,
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
      text: `At home, ${name} told Mama exactly what happened, then offered to ${w[3]} the orange slices.`,
      imageEmoji: "🍊",
    },
  ].slice(0, params.level <= 2 ? 5 : 6);

  const ts = Date.now();
  const questions: ComprehensionQuestion[] = [
    {
      id: `lq1-${ts}`,
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
      id: `lq2-${ts}`,
      questionText: `Which skill does this story practise?`,
      options: [skill.title, "Ignoring people", "Shouting louder"],
      correctIndex: 0,
      type: "inferential",
      explanation: `The story centres on ${skill.title.toLowerCase()}.`,
    },
    {
      id: `lq3-${ts}`,
      questionText: `Why did ${name} ask if the younger child was hurt?`,
      options: [
        "To check they were safe",
        "To win a prize",
        "To keep a secret",
      ],
      correctIndex: 0,
      type: "vocabulary",
      explanation: skill.keyMoralLesson,
    },
  ];

  return {
    id: `living-offline-${ts}`,
    title: `${name} and the Spilled Bottle`,
    levelMin: params.level,
    levelMax: params.level,
    targetAgeGroup: `Ages ${params.age || 6}`,
    themes: [skill.category, "character", skill.title.toLowerCase()],
    estimatedMinutes: params.level <= 2 ? 4 : 6,
    coverEmoji: skill.emoji,
    pages,
    questions,
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
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a children's literacy author. Return only valid JSON.",
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
          temperature: 0.7,
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

/**
 * OpenRouter: one key, many models. Free-tier model id may change over time.
 * Uses OpenAI-compatible chat completions.
 */
async function generateWithOpenRouter(
  prompt: string
): Promise<LlmStoryPayload | null> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;

  // Prefer a free model; if OpenRouter renames free models, swap this string only.
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
        temperature: 0.7,
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

/**
 * Try providers in order until one returns usable pages.
 */
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