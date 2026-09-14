/**
 * @file app/api/transcribe/route.ts
 * @description Deepgram Speech-to-Text for Onesimos read-aloud sessions.
 * Accepts WebM / MP4 / AAC / OGG from Chrome, Safari, and Amazon Silk (Fire OS).
 * Keyword boosting is strictly restricted to long/complex vocabulary (> 4 letters)
 * so short phonics target words (like "kite", "cat", "hat") are decoded naturally
 * without Deepgram auto-correcting speech errors.
 *
 * @module app/api/transcribe/route
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Max keyword boosts Deepgram accepts cleanly in one request */
const MAX_KEYWORDS = 30;

/**
 * Build Deepgram listen URL with child-reading-friendly params.
 * Only boosts words with > 4 letters to avoid auto-correcting short phonics errors.
 */
function buildDeepgramUrl(keywords: string[]): string {
  const params = new URLSearchParams({
    model: "nova-2",
    language: "en",
    smart_format: "true",
    punctuate: "true",
    utterances: "false",
    filler_words: "false",
  });

  // CRITICAL FIX: Only boost long/complex words (> 4 chars).
  // Short phonics words (<= 4 chars like "kite", "cat") MUST NOT be boosted,
  // allowing Deepgram to accurately transcribe "kit" when the child mispronounces "kite".
  const longVocabularyOnly = Array.from(
    new Set(
      keywords
        .map((k) => k.trim().toLowerCase().replace(/[^\w'-]/g, ""))
        .filter((k) => k.length > 4 && k.length <= 24)
    )
  ).slice(0, MAX_KEYWORDS);

  for (const word of longVocabularyOnly) {
    params.append("keywords", `${word}:2`);
  }

  return `https://api.deepgram.com/v1/listen?${params.toString()}`;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio");

    if (!audio || !(audio instanceof Blob)) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      console.error("[Transcribe] DEEPGRAM_API_KEY missing");
      return NextResponse.json(
        { error: "Deepgram API key not configured on server" },
        { status: 500 }
      );
    }

    // Optional comma-separated page words for keyword boosting
    const keywordsRaw = formData.get("keywords");
    const keywords: string[] =
      typeof keywordsRaw === "string" && keywordsRaw.trim().length > 0
        ? keywordsRaw.split(",").map((k) => k.trim()).filter(Boolean)
        : [];

    const buffer = Buffer.from(await audio.arrayBuffer());

    // Reject only empty payloads
    if (buffer.length < 64) {
      return NextResponse.json(
        { error: "Audio too short", transcript: "" },
        { status: 400 }
      );
    }

    const contentType =
      audio.type && audio.type.length > 0 ? audio.type : "audio/webm";

    const url = buildDeepgramUrl(keywords);

    console.log(
      `[Transcribe] bytes=${buffer.length} type=${contentType} rawKeywords=${keywords.length}`
    );

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": contentType,
      },
      body: buffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Transcribe] Deepgram error:", response.status, errorText);
      return NextResponse.json(
        { error: `Deepgram API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = (await response.json()) as {
      results?: {
        channels?: Array<{
          alternatives?: Array<{
            transcript?: string;
            confidence?: number;
          }>;
        }>;
      };
    };

    const alternative = data?.results?.channels?.[0]?.alternatives?.[0];
    const transcript = (alternative?.transcript || "").trim();
    const confidence =
      typeof alternative?.confidence === "number" ? alternative.confidence : null;

    console.log(
      `[Transcribe] ok transcript="${transcript}" confidence=${confidence ?? "n/a"}`
    );

    return NextResponse.json({
      transcript,
      confidence,
    });
  } catch (error) {
    console.error("[Transcribe] Unhandled error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}