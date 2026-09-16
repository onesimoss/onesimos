/**
 * @file app/api/tts/route.ts
 * @description Cloud Text-to-Speech endpoint using Deepgram Aura.
 * Bypasses native Web Speech API limitations on iOS Safari and Amazon Fire OS (Silk).
 * 
 * @module app/api/tts/route
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const text = body?.text;

    if (!text || typeof text !== "string") {
      return new NextResponse("Missing text", { status: 400 });
    }

    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      console.error("[TTS] DEEPGRAM_API_KEY missing");
      return new NextResponse("Server configuration error", { status: 500 });
    }

    // Call Deepgram Aura (asteria is their fast, natural English female voice)
    const response = await fetch("https://api.deepgram.com/v1/speak?model=aura-asteria-en", {
      method: "POST",
      headers: {
        "Authorization": `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[TTS] Deepgram error:", response.status, err);
      return new NextResponse("TTS generation failed", { status: response.status });
    }

    // Return the audio stream directly to the frontend
    const audioBuffer = await response.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[TTS] Unhandled error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}