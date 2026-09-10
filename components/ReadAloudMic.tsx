/**
 * @file components/ReadAloudMic.tsx
 * @description Real-time microphone audio capture component for read-aloud sessions.
 * Features 200ms timesliced audio chunking, multi-format MIME type resolution
 * (WebM, MP4, AAC, WAV), minimum audio volume checks, and Deepgram API integration.
 *
 * @dependencies
 * - @/lib/stumbledWords (stumble detection algorithm & Supabase logging)
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { findStumbledWords, saveStumbledWord } from "@/lib/stumbledWords";

type MicStatus = "idle" | "recording" | "thinking" | "done" | "error";

interface ReadAloudMicProps {
  childId: string;
  storyId: string;
  pageText: string;
  onResult?: (result: {
    transcript: string;
    stumbled: string[];
  }) => void;
}

export default function ReadAloudMic({
  childId,
  storyId,
  pageText,
  onResult,
}: ReadAloudMicProps) {
  const [status, setStatus] = useState<MicStatus>("idle");
  const [message, setMessage] = useState("");
  const [stumbled, setStumbled] = useState<string[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  /**
   * Evaluates supported browser audio MIME types across Chrome, Safari, and Silk (Fire OS).
   */
  const getSupportedMimeType = (): string => {
    if (typeof window === "undefined" || !window.MediaRecorder) return "";

    const candidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/aac",
      "audio/ogg",
      "audio/wav",
    ];

    for (const type of candidates) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return "";
  };

  const startRecording = async () => {
    setMessage("");
    setStumbled([]);
    chunksRef.current = [];

    try {
      if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setStatus("error");
        setMessage("This device can't use the microphone in this browser.");
        return;
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const recorderOptions = mimeType ? { mimeType } : undefined;
      const recorder = new MediaRecorder(stream, recorderOptions);

      mediaRecorderRef.current = recorder;

      // Continuously capture audio chunks
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        setStatus("thinking");
        setMessage("Listening carefully...");

        const finalMime = recorder.mimeType || mimeType || "audio/webm";
        const audioBlob = new Blob(chunksRef.current, { type: finalMime });
        stopStream();

        // Check if audio file has sufficient volume/data
        if (audioBlob.size < 800) {
          setStatus("done");
          setMessage("I didn't catch words that time. Try reading a little louder!");
          onResult?.({ transcript: "", stumbled: [] });
          return;
        }

        try {
          const form = new FormData();
          form.append("audio", audioBlob, `reading_audio.${finalMime.includes("mp4") ? "mp4" : "webm"}`);

          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: form,
          });

          const data = await res.json();

          if (!res.ok) {
            setStatus("error");
            setMessage(data.error || "Could not hear clearly — try again!");
            return;
          }

          const transcript: string = (data.transcript || "").trim();

          if (!transcript) {
            setStatus("done");
            setMessage("I didn't catch words that time. Try reading a little louder!");
            onResult?.({ transcript: "", stumbled: [] });
            return;
          }

          const missed = findStumbledWords(pageText, transcript);
          setStumbled(missed);

          // Save stumbled words to practice list
          for (const word of missed.slice(0, 8)) {
            void saveStumbledWord({
              childId,
              word,
              storyId,
            });
          }

          setStatus("done");
          if (missed.length === 0) {
            setMessage("Wonderful reading! You can turn the page when you're ready.");
          } else {
            setMessage("Great try! We'll practice a few words again later — no rush.");
          }

          onResult?.({ transcript, stumbled: missed });
        } catch {
          setStatus("error");
          setMessage("Something went wrong. Let's try once more.");
        }
      };

      // ⚠️ FIX: Pass 200ms timeslice so audio chunks are pushed continuously!
      recorder.start(200);
      setStatus("recording");
      setMessage("Listening... Read this page out loud!");
    } catch {
      setStatus("error");
      setMessage("Microphone is off. Please allow mic permissions and try again.");
      stopStream();
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === "recording") {
      recorder.stop();
    } else {
      stopStream();
      setStatus("idle");
    }
  };

  const isRecording = status === "recording";
  const isBusy = status === "thinking";

  return (
    <div className="w-full max-w-2xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            disabled={isBusy}
            className="px-6 py-3.5 rounded-2xl bg-coral text-white font-extrabold text-xs hover:bg-coral/90 transition-all shadow-md flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <span className="text-base">🎙️</span>
            {status === "done" || status === "error" ? "Read Page Again" : "Read Page Out Loud"}
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="px-6 py-3.5 rounded-2xl bg-coral text-white font-extrabold text-xs shadow-md flex items-center gap-2 animate-pulse active:scale-95"
          >
            <span className="text-base">⏹️</span>
            I&apos;m Done Reading
          </button>
        )}
      </div>

      {message && (
        <p
          className={`mt-3 text-center text-xs font-bold ${
            status === "error" ? "text-red-500" : "text-gray-600"
          }`}
        >
          {message}
        </p>
      )}

      {stumbled.length > 0 && status === "done" && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {stumbled.slice(0, 6).map((word) => (
            <span
              key={word}
              className="px-3 py-1 rounded-xl bg-amber-100/80 text-gray-900 text-xs font-bold border border-amber-200/80"
            >
              {word}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}