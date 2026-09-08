"use client";

import { useEffect, useRef, useState } from "react";
import { findStumbledWords } from "@/lib/stumbledWords";
import { saveStumbledWord } from "@/lib/stumbledWords";

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
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const startRecording = async () => {
    setMessage("");
    setStumbled([]);
    chunksRef.current = [];

    try {
      if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setStatus("error");
        setMessage("This device can't use the microphone in the browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        setStatus("thinking");
        setMessage("Listening carefully...");

        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        stopStream();

        try {
          const form = new FormData();
          form.append("audio", blob, "reading.webm");

          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: form,
          });

          const data = await res.json();

          if (!res.ok) {
            setStatus("error");
            setMessage(data.error || "Could not hear that — try again.");
            return;
          }

          const transcript: string = data.transcript || "";

          if (!transcript.trim()) {
            setStatus("done");
            setMessage("I didn't catch words that time. Try reading a little louder!");
            onResult?.({ transcript: "", stumbled: [] });
            return;
          }

          const missed = findStumbledWords(pageText, transcript);
          setStumbled(missed);

          // Save gently in background — practice list for later stories
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

      recorder.start();
      setStatus("recording");
      setMessage("We're listening — read this page out loud!");
    } catch {
      setStatus("error");
      setMessage("Microphone is off. Please allow the mic, then try again.");
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
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            disabled={isBusy}
            className="btn-primary !px-6 !py-3 !text-sm disabled:opacity-50 flex items-center gap-2"
          >
            <span className="text-lg">🎤</span>
            {status === "done" || status === "error" ? "Read again" : "Read this page out loud"}
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="bg-coral text-white font-bold px-6 py-3 rounded-full shadow-kid-pop flex items-center gap-2 animate-pulse"
          >
            <span className="text-lg">⏹</span>
            I&apos;m done reading
          </button>
        )}
      </div>

      {message && (
        <p
          className={`mt-3 text-center text-sm font-bold ${
            status === "error" ? "text-coral" : "text-bark-muted"
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
              className="px-3 py-1 rounded-full bg-gold-light text-bark text-sm font-bold border border-border"
            >
              {word}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}