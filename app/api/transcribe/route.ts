/**
 * @file app/api/transcribe/route.ts
 * @description Next.js Server Route for Deepgram Speech-to-Text Transcription.
 * Dynamically detects audio MIME types (supporting WebM, MP4, AAC, OGG) to 
 * ensure speech recognition works across PC, Amazon Fire OS, iOS, and Android.
 *
 * @dependencies
 * - Next.js App Router (NextRequest, NextResponse)
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio") as File;

    if (!audio) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      console.error("DEEPGRAM_API_KEY is missing in environment variables.");
      return NextResponse.json(
        { error: "Deepgram API key not configured on server" },
        { status: 500 }
      );
    }

    // Convert incoming audio file to ArrayBuffer Buffer
    const buffer = Buffer.from(await audio.arrayBuffer());

    // Dynamically detect incoming audio format (e.g. 'audio/webm', 'audio/mp4', 'audio/aac')
    // Defaults to 'audio/webm' if browser omits content type header
    const contentType = audio.type && audio.type.length > 0 ? audio.type : "audio/webm";

    console.log(`[Transcribe API] Incoming audio size: ${buffer.length} bytes, format: ${contentType}`);

    // Call Deepgram STT API with dynamic Content-Type header
    const response = await fetch(
      "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&punctuate=true",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": contentType,
        },
        body: buffer,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Deepgram API returned error:", response.status, errorText);
      return NextResponse.json(
        { error: `Deepgram API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const transcript: string =
      data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";

    console.log(`[Transcribe API] Success transcript: "${transcript}"`);

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error("Unhandled transcribe API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}