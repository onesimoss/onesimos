/**
 * @file app/api/tts/route.ts
 * @description Cloud Text-to-Speech endpoint with automatic Supabase CDN caching.
 * Bypasses native Web Speech API limitations on iOS Safari and Amazon Fire OS (Silk)
 * while preserving Deepgram API credit pool via self-populating Storage caching.
 *
 * @module app/api/tts/route
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Initialize Supabase Server Client for Storage Uploads */
function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";
  return createClient(url, key);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const text = body?.text;

    if (!text || typeof text !== "string") {
      return new NextResponse("Missing text parameter", { status: 400 });
    }

    const cleanedWord = text.trim().toLowerCase().replace(/[^\w'-]/g, "");
    if (!cleanedWord) {
      return new NextResponse("Invalid word format", { status: 400 });
    }

    const filename = `${cleanedWord}.mp3`;
    const supabase = getSupabaseServerClient();

    // ─── STEP 1: CHECK SUPABASE STORAGE CDN CACHE ───
    try {
      const { data: publicUrlData } = supabase.storage
        .from("tts-audio")
        .getPublicUrl(filename);

      if (publicUrlData?.publicUrl) {
        const headRes = await fetch(publicUrlData.publicUrl, { method: "HEAD" });
        if (headRes.ok) {
          const cachedAudioRes = await fetch(publicUrlData.publicUrl);
          if (cachedAudioRes.ok) {
            const cachedBuffer = await cachedAudioRes.arrayBuffer();
            return new NextResponse(cachedBuffer, {
              headers: {
                "Content-Type": "audio/mpeg",
                "Cache-Control": "public, max-age=31536000, immutable",
                "X-Audio-Source": "Supabase-CDN-Cache",
              },
            });
          }
        }
      }
    } catch {
      // Fall through to generation if CDN check fails
    }

    // ─── STEP 2: GENERATE VIA DEEPGRAM AURA (ONLY IF NOT IN CACHE) ───
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      console.error("[TTS] DEEPGRAM_API_KEY missing");
      return new NextResponse("Server configuration error", { status: 500 });
    }

    const response = await fetch(
      "https://api.deepgram.com/v1/speak?model=aura-asteria-en",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: cleanedWord }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("[TTS] Deepgram error:", response.status, err);
      return new NextResponse("TTS generation failed", { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();
    const bufferToSave = Buffer.from(audioBuffer);

    // ─── STEP 3: AWAIT SAVE TO SUPABASE STORAGE ───
    try {
      const { error: uploadError } = await supabase.storage
        .from("tts-audio")
        .upload(filename, bufferToSave, {
          contentType: "audio/mpeg",
          upsert: true,
        });

      if (uploadError) {
        console.error(`[TTS Cache Upload Error for "${cleanedWord}"]:`, uploadError);
      } else {
        console.log(`[TTS Cache] Successfully cached "${cleanedWord}" to Supabase tts-audio bucket.`);
      }
    } catch (uploadErr) {
      console.error(`[TTS Cache Exception for "${cleanedWord}"]:`, uploadErr);
    }

    // Return generated audio buffer immediately to the browser
    return new NextResponse(bufferToSave, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Audio-Source": "Deepgram-Aura-Generated",
      },
    });
  } catch (error) {
    console.error("[TTS] Unhandled error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}