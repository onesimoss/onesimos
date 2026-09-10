/**
 * @file components/ReadAloudMic.tsx
 * @description Real-time microphone audio capture component for read-aloud sessions.
 * Features 200ms timesliced audio chunking, multi-format MIME type resolution
 * (WebM, MP4, AAC, WAV), lowered volume threshold for Fire OS tablets & quiet mics,
 * keyword boosting pass-through, and fuzzy stumble detection.
 *
 * @dependencies
 * - @/lib/stumbledWords (fuzzy stumble detection & Supabase logging)
 */

"use client";

import { useEffect, useRef, useState } from "react";
import {
  findStumbledItems,
  saveStumbledWord,
  stripPunctuation,
  type StumbledItem,
} from "@/lib/stumbledWords";

type MicStatus = "idle" | "recording" | "thinking" | "done" | "error";

interface ReadAloudMicProps {
  childId: string;
  storyId: string;
  pageText: string;
  onResult?: (result: {
    transcript: string;
    stumbled: string[];
    stumbledItems: StumbledItem[];
  }) => void;
}

export default function ReadAloudMic({
  childId,
  storyId,
  pageText,
  onResult,
}: ReadAloudMicProps): JSX.Element {
  const [status, setStatus] = useState<MicStatus>("idle");
  const [message, setMessage] = useState("");
  const [stumbledItems, setStumbledItems] = useState<StumbledItem[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  const stopStream = (): void => {
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

  /**
   * Extracts distinct page words to pass to Deepgram for vocabulary keyword boosting.
   */
  const getPageKeywords = (): string => {
    if (!pageText) return "";
    const words = pageText
      .split(/\s+/)
      .map(stripPunctuation)
      .filter((w) => w.length >= 2);
    const unique = Array.from(new Set(words.map((w) => w.toLowerCase())));
    return unique.slice(0, 30).join(",");
  };

  const startRecording = async (): Promise<void> => {
    setMessage("");
    setStumbledItems([]);
    chunksRef.current = [];

    try {
      if (
        typeof window === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        setStatus("error");
        setMessage("This device cannot use the microphone in this browser.");
        return;
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
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

        // Fire OS & Quiet Mic Fix: Lower minimum threshold from 800 bytes to 200 bytes
        if (audioBlob.size < 200) {
          setStatus("done");
          setMessage(
            "I didn't catch words that time. Try reading a little louder!"
          );
          onResult?.({ transcript: "", stumbled: [], stumbledItems: [] });
          return;
        }

        try {
          const form = new FormData();
          const extension = finalMime.includes("mp4") ? "mp4" : "webm";
          form.append("audio", audioBlob, `reading_audio.${extension}`);
          form.append("keywords", getPageKeywords());

          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: form,
          });

          const data = await res.json();

          if (!res.ok) {
            setStatus("error");
            setMessage(
              data.error || "Could not hear clearly — try again!"
            );
            return;
          }

          const transcript: string = (data.transcript || "").trim();

          if (!transcript) {
            setStatus("done");
            setMessage(
              "I didn't catch words that time. Try reading a little louder!"
            );
            onResult?.({ transcript: "", stumbled: [], stumbledItems: [] });
            return;
          }

          // Run fuzzy match stumble detection
          const missed = findStumbledItems(pageText, transcript);
          setStumbledItems(missed);

          // Save stumbled items to practice list (fire-and-forget)
          for (const item of missed.slice(0, 8)) {
            void saveStumbledWord({
              childId,
              word: item.word,
              storyId,
            });
          }

          const missedWordsOnly = missed.map((item) => item.word);

          setStatus("done");
          if (missed.length === 0) {
            setMessage(
              "Wonderful reading! You can turn the page when you're ready."
            );
          } else {
            setMessage(
              "Great try! We saved a few tricky words to your Word Pocket to practise later."
            );
          }

          onResult?.({
            transcript,
            stumbled: missedWordsOnly,
            stumbledItems: missed,
          });
        } catch {
          setStatus("error");
          setMessage("Something went wrong. Let's try once more.");
        }
      };

      // 200ms timeslice chunking for continuous recording
      recorder.start(200);
      setStatus("recording");
      setMessage("Listening... Read this page out loud!");
    } catch {
      setStatus("error");
      setMessage(
        "Microphone is off. Please allow mic permissions in your browser and try again."
      );
      stopStream();
    }
  };

  const stopRecording = (): void => {
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
    <div className="w-full max-w-2xl mx-auto font-switzer">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            disabled={isBusy}
            className="px-6 py-3.5 rounded-2xl bg-coral text-white font-extrabold text-xs hover:bg-coral/90 transition-all shadow-md flex items-center gap-2 active:scale-95 disabled:opacity-50 font-switzer"
          >
            <span className="text-base">🎙️</span>
            {status === "done" || status === "error"
              ? "Read Page Again"
              : "Read Page Out Loud"}
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="px-6 py-3.5 rounded-2xl bg-coral text-white font-extrabold text-xs shadow-md flex items-center gap-2 animate-pulse active:scale-95 font-switzer"
          >
            <span className="text-base">⏹️</span>
            I&apos;m Done Reading
          </button>
        )}
      </div>

      {message && (
        <p
          className={`mt-3 text-center text-xs font-bold font-switzer ${
            status === "error" ? "text-red-500" : "text-gray-600"
          }`}
        >
          {message}
        </p>
      )}

      {stumbledItems.length > 0 && status === "done" && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {stumbledItems.slice(0, 6).map((item) => (
            <span
              key={item.word}
              className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1 ${
                item.type === "name"
                  ? "bg-slate-100 text-slate-800 border-slate-300"
                  : "bg-amber-100/80 text-amber-900 border-amber-200/80"
              }`}
            >
              <span>{item.display}</span>
              {item.type === "name" && (
                <span className="text-[9px] bg-slate-200 text-slate-600 px-1 rounded-full">
                  Name
                </span>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}