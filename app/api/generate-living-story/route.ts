/**
 * @file app/api/generate-living-story/route.ts
 * @description Server-side Living Chapter generator for Onesimos.
 * Uses free-tier LLM when configured (Groq first, then Gemini), with a
 * concrete offline fallback. Always personalises child name, weaves
 * stumbled words naturally, and anchors one virtue / life skill with
 * visible actions (not vague "wisdom").
 *
 * Env (optional, any one is enough):
 *   GROQ_API_KEY
 *   GEMINI_API_KEY
 *
 * @module app/api/generate-living-story/route
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getRecentStumbledWords } from "@/lib/stumbledWords";
import { getRandomLifeSkill, type LifeSkill } from "@/lib/lifeSkills";
import type { SampleStory, StoryPage, ComprehensionQuestion } from "@/lib/sampleStories";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  const wordList = words.length > 0 ? words.join(", ") : "kindness, patience, brave";

  return `You write short children's reading chapters for African and diaspora families (ages 3-9).
Secular, warm, concrete. No preaching. No vague lines like "showed great wisdom" without saying WHAT the child DID.

CHILD NAME (must appear often, correctly capitalised): ${childName}
READING LEVEL 1-4 (1=very short sentences, 4=longer): ${level}
STUMBLED WORDS to weave naturally as vocabulary practice (do not list them; use in sentences): ${wordList}
LIFE SKILL FOCUS: ${skill.title}
SKILL MEANING: ${skill.description}
MORAL IN ONE LINE (show through action, do not lecture): ${skill.keyMoralLesson}

RULES:
- 5 pages for level 1-2, 6 pages for level 3-4.
- Each page: 1-3 short sentences. Concrete setting (home, school gate, market path, courtyard, bus stop).
- Page 1: ordinary moment. Middle: a real choice or problem tied to the skill. End: clear kind action + calm adult affirmation.
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
      text: `${name} stood by the courtyard ${w[1]} with a small ${w[0]}. Today felt ordinary, until a choice appeared.`,
      imageEmoji: "🏡",
    },
    {
      text: `A younger child dropped a bottle of ${w[2]}. People walked past. ${name} stopped and looked carefully.`,
      imageEmoji: skill.emoji,
    },
    {
      text: `${name} remembered: ${skill.keyMoralLesson} So ${name} knelt, picked up the bottle, and wiped the dust with clean hands.`,
      imageEmoji: "🤲",
    },
    {
      text: `"Thank you," the younger child whispered. ${name} offered a calm smile and helped place the bottle back safely.`,
      imageEmoji: "🤝",
    },
    {
      text: `At home, Mama asked what happened. ${name} told the truth, then offered to ${w[3]} the leftover fruit after homework.`,
      imageEmoji: "💛",
    },
    {
      text: `${name} felt proud, not loud proud. Quiet proud. The kind that grows when you choose the kind action on purpose.`,
      imageEmoji: "🌟",
    },
  ].slice(0, params.level <= 2 ? 5 : 6);

  const questions: ComprehensionQuestion[] = [
    {
      id: `lq1-${Date.now()}`,
      questionText: `What did ${name} do when the bottle fell?`,
      options: [
        "Walked away without looking",
        "Stopped, picked it up, and helped",
        "Laughed and ran to play",
      ],
      correctIndex: 1,
      type: "literal",
      explanation: `${name} stopped, picked up the bottle, and helped.`,
    },
    {
      id: `lq2-${Date.now()}`,
      questionText: `Which skill does this story practise?`,
      options: [skill.title, "Ignoring people", "Shouting louder"],
      correctIndex: 0,
      type: "inferential",
      explanation: `The story centres on ${skill.title.toLowerCase()}.`,
    },
    {
      id: `lq3-${Date.now()}`,
      questionText: `In the story, what does it mean to feel "quiet proud"?`,
      options: [
        "Proud from a kind choice, without showing off",
        "Proud from winning an argument",
        "Proud from keeping a secret that hurts someone",
      ],
      correctIndex: 0,
      type: "vocabulary",
      explanation: "Quiet proud means feeling good about a kind, honest action without boasting.",
    },
  ];

  const id = `living-offline-${Date.now()}`;
  return {
    id,
    title: `${name} and the Choice at the ${capitalize(w[1])}`,
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

async function generateWithGroq(prompt: string): Promise<LlmStoryPayload | null> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;

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
          content: "You are a children's literacy author. Return only valid JSON.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    console.error("[generate-living-story] Groq error", await res.text());
    return null;
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const raw = data.choices?.[0]?.message?.content || "";
  try {
    return JSON.parse(raw) as LlmStoryPayload;
  } catch {
    console.error("[generate-living-story] Groq JSON parse failed");
    return null;
  }
}

async function generateWithGemini(prompt: string): Promise<LlmStoryPayload | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
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
    console.error("[generate-living-story] Gemini error", await res.text());
    return null;
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  try {
    return JSON.parse(raw) as LlmStoryPayload;
  } catch {
    console.error("[generate-living-story] Gemini JSON parse failed");
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

  const questions: ComprehensionQuestion[] = (payload.questions || []).map((q, i) => ({
    id: `gen-${ts}-q${i}`,
    questionText: q.questionText,
    options: q.options?.slice(0, 3) || ["Yes", "No", "Maybe"],
    correctIndex:
      typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex <= 2
        ? q.correctIndex
        : 0,
    type: q.type || "literal",
    explanation: q.explanation || "Re-read that part of the story.",
  }));

  return {
    id,
    title: payload.title?.includes(name) ? payload.title : `${name}: ${payload.title || meta.skill.title}`,
    levelMin: meta.level,
    levelMax: meta.level,
    targetAgeGroup: `Ages ${meta.age || 6}`,
    themes: [meta.skill.category, "character", meta.skill.title.toLowerCase()],
    estimatedMinutes: meta.level <= 2 ? 4 : 6,
    coverEmoji: payload.coverEmoji || meta.skill.emoji,
    pages: pages.length > 0 ? pages : offlineFallback({
      childName: meta.childName,
      level: meta.level,
      words: meta.words,
      skill: meta.skill,
      age: meta.age,
    }).pages,
    questions: questions.length >= 2 ? questions : offlineFallback({
      childName: meta.childName,
      level: meta.level,
      words: meta.words,
      skill: meta.skill,
      age: meta.age,
    }).questions,
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as GenerateBody;
    if (!body?.childId || !body?.childName) {
      return NextResponse.json({ error: "childId and childName required" }, { status: 400 });
    }

    const level = body.readingLevel && body.readingLevel >= 1 && body.readingLevel <= 4
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

    let story: SampleStory | null = null;

    const groqPayload = await generateWithGroq(prompt);
    if (groqPayload?.pages?.length) {
      story = toSampleStory(groqPayload, {
        childId: body.childId,
        childName: body.childName,
        level,
        age: body.age,
        skill,
        words,
      });
    }

    if (!story) {
      const gemPayload = await generateWithGemini(prompt);
      if (gemPayload?.pages?.length) {
        story = toSampleStory(gemPayload, {
          childId: body.childId,
          childName: body.childName,
          level,
          age: body.age,
          skill,
          words,
        });
      }
    }

    if (!story) {
      story = offlineFallback({
        childName: body.childName,
        level,
        words,
        skill,
        age: body.age,
      });
      story.id = `living-${body.childId.slice(0, 6)}-${Date.now()}`;
    }

    // Attach skill + target words for UI badges (non-breaking extra fields via themes)
    const storyWithMeta = {
      ...story,
      themes: Array.from(new Set([...(story.themes || []), `skill:${skill.id}`, ...words.map((w) => `word:${w}`)])),
    };

    const { error } = await supabase.from("generated_stories").insert({
      id: storyWithMeta.id,
      child_id: body.childId,
      chapter_number: 1,
      title: storyWithMeta.title,
      story_data: storyWithMeta,
      target_words: words,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[generate-living-story] save error", error);
      // Still return story so parent UI can show it even if RLS blocks save
    }

    return NextResponse.json({
      story: storyWithMeta,
      skill: {
        id: skill.id,
        title: skill.title,
        emoji: skill.emoji,
        lesson: skill.keyMoralLesson,
      },
      targetWords: words,
      engine: process.env.GROQ_API_KEY
        ? "groq"
        : process.env.GEMINI_API_KEY
        ? "gemini"
        : "offline",
    });
  } catch (err) {
    console.error("[generate-living-story]", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}