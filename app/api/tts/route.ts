/**
 * @file app/api/tts/route.ts
 * @description Cloud Text-to-Speech endpoint with automatic Supabase CDN caching.
 * Primary: ElevenLabs (Multilingual v2, 0.85x speed for young readers).
 * Fallback: Deepgram Aura.
 * Cache: Supabase Storage ("tts-audio" bucket) for $0 repeat cost.
 *
 * @module app/api/tts/route
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** ElevenLabs default voice ID (Rachel - clear, friendly tone) */
const DEFAULT_ELEVENLABS_VOICE = "21m00Tcm4TlvDq8ikWAM";

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
      // Fall through to live generation if CDN check fails
    }

    let audioBuffer: ArrayBuffer | null = null;
    let providerSource = "ElevenLabs";

    // ─── STEP 2A: GENERATE VIA ELEVENLABS (PRIMARY) ───
    const elevenLabsKey = process.env.ELEVENLABS_API_KEY;

    if (elevenLabsKey) {
      try {
        const elevenRes = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${DEFAULT_ELEVENLABS_VOICE}`,
          {
            method: "POST",
            headers: {
              "xi-api-key": elevenLabsKey,
              "Content-Type": "application/json",
              Accept: "audio/mpeg",
            },
            body: JSON.stringify({
              text: cleanedWord,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.6,
                similarity_boost: 0.8,
                speed: 0.85,
              },
            }),
          }
        );

        if (elevenRes.ok) {
          audioBuffer = await elevenRes.arrayBuffer();
          providerSource = "ElevenLabs";
        } else {
          const errText = await elevenRes.text();
          console.warn(`[TTS] ElevenLabs warning (${elevenRes.status}):`, errText);
        }
      } catch (elevenErr) {
        console.warn("[TTS] ElevenLabs fetch exception:", elevenErr);
      }
    }

    // ─── STEP 2B: FALLBACK TO DEEPGRAM AURA ───
    if (!audioBuffer) {
      const deepgramKey = process.env.DEEPGRAM_API_KEY;
      if (!deepgramKey) {
        console.error("[TTS] Neither ELEVENLABS_API_KEY nor DEEPGRAM_API_KEY is configured.");
        return new NextResponse("TTS key not configured on server", { status: 500 });
      }

      const deepgramRes = await fetch(
        "https://api.deepgram.com/v1/speak?model=aura-asteria-en",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${deepgramKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: cleanedWord }),
        }
      );

      if (!deepgramRes.ok) {
        const errText = await deepgramRes.text();
        console.error("[TTS] Deepgram error:", deepgramRes.status, errText);
        return new NextResponse("TTS generation failed", { status: deepgramRes.status });
      }

      audioBuffer = await deepgramRes.arrayBuffer();
      providerSource = "Deepgram-Aura";
    }

    const bufferToSave = Buffer.from(audioBuffer);

    // ─── STEP 3: AWAIT SAVE TO SUPABASE STORAGE FOR FUTURE $0 COST ───
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
        console.log(`[TTS Cache] Successfully cached "${cleanedWord}" (${providerSource}) to Supabase tts-audio bucket.`);
      }
    } catch (uploadErr) {
      console.error(`[TTS Cache Exception for "${cleanedWord}"]:`, uploadErr);
    }

    // Return generated audio buffer
    return new NextResponse(bufferToSave, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Audio-Source": providerSource,
      },
    });
  } catch (error) {
    console.error("[TTS] Unhandled error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}