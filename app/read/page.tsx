/// <reference lib="dom" />

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { saveReadingSession } from "@/lib/readingUtils";

// Common easy words to ignore
const EASY_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'so', 'for', 'nor', 'yet',
  'i', 'me', 'my', 'you', 'your', 'he', 'him', 'his', 'she', 'her',
  'it', 'we', 'us', 'our', 'they', 'them', 'their',
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  'do', 'does', 'did', 'has', 'have', 'had',
  'to', 'of', 'from', 'with', 'by', 'at', 'on', 'in', 'for', 'about',
  'up', 'down', 'off', 'over', 'under', 'into', 'through',
  'no', 'yes', 'not', 'so', 'very', 'too', 'quite', 'almost',
  'will', 'would', 'could', 'should', 'may', 'might', 'must',
  'this', 'that', 'these', 'those', 'then', 'than', 'there',
  'said', 'asked', 'told', 'went', 'came', 'looked', 'saw', 'made'
]);

const FILLER_WORDS = new Set(['um', 'uh', 'er', 'ah', 'like']);

export default function ReadPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const childId = searchParams.get('child');
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [stumbledWords, setStumbledWords] = useState<string[]>([]);
  const [readingTime, setReadingTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const story = `Ella was the biggest elephant in the forest, but she had the softest heart. One morning, she found a tiny bird with a broken wing. "I can help you," Ella whispered, though she was in a hurry to meet her friends. She gently lifted the bird onto her back and carried it to the old owl who knew about healing. Later, her friends asked why she was late. Ella could have made up an excuse. Instead, she told the truth. "I stopped to help a bird," she said, despite feeling shy. Her friends were quiet for a moment. Then they smiled. "That is why we love you," they said. Ella learned that kindness is never wasted.`;

  // Timer logic
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setReadingTime(prev => prev + 1);
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isTimerRunning]);

  // Auto-end when reading time reaches 5 minutes
  useEffect(() => {
    if (readingTime >= 300 && isTimerRunning) {
      stopListening();
      endSession();
    }
  }, [readingTime, isTimerRunning]);

  const detectStumbles = (text: string) => {
    const cleaned = text
      .toLowerCase()
      .replace(/\b(uh|um|er|ah|like|you know|i mean|so|well)\b/g, '')
      .replace(/[^a-z\s']/g, '')
      .replace(/\s+/g, ' ')
      .trim();
      
    const words = cleaned.split(' ');
    const storyWords = story.toLowerCase().split(/\s+/);
    const storyWordCount: Record<string, number> = {};
    storyWords.forEach((w: string) => {
      const clean = w.replace(/[^a-z']/g, '');
      if (clean) storyWordCount[clean] = (storyWordCount[clean] || 0) + 1;
    });
    
    words.forEach((word: string) => {
      const cleanWord = word.replace(/[^a-z']/g, '');
      if (!cleanWord || 
          EASY_WORDS.has(cleanWord) || 
          !storyWordCount[cleanWord] ||
          stumbledWords.includes(cleanWord) ||
          /^[0-9]+$/.test(cleanWord)) {
        return;
      }
      setStumbledWords(prev => [...prev, cleanWord]);
    });
  };

  const startListening = () => {
    if (!childId) {
      alert("Please select a child first. Go back to the dashboard.");
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setIsTimerRunning(true);
      setSessionEnded(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech error:', event.error);
      if (event.error === 'not-allowed') {
        alert("Please allow microphone access in your browser settings.");
      }
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(prev => prev + ' ' + finalTranscript);
        detectStumbles(finalTranscript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setIsTimerRunning(false);
    }
  };

  const endSession = async () => {
    if (isSaving || sessionEnded) return;
    setIsSaving(true);
    setSessionEnded(true);
    setIsTimerRunning(false);
    stopListening();

    const wordsRead = transcript.split(' ').filter(w => w.length > 0).length;

    const result = await saveReadingSession({
      childId: childId!,
      durationSeconds: readingTime,
      wordsRead: wordsRead,
      wordsStumbled: stumbledWords,
      endedAt: new Date(),
    });

    setIsSaving(false);

    if (result.error) {
      alert("There was an error saving your session. But don't worry, your reading data is still on this page.");
      console.error("Save error:", result.error);
    } else {
      alert(`🎉 Great reading! You read for ${Math.floor(readingTime / 60)} minutes and ${readingTime % 60} seconds.`);
      router.push('/dashboard');
    }
  };

  const resetSession = () => {
    setTranscript("");
    setStumbledWords([]);
    setReadingTime(0);
    setIsTimerRunning(false);
    setSessionEnded(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!childId) {
    return (
      <main className="min-h-screen bg-[#f7f2eb] flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-[#1e1916] mb-4">👶 Select a Child</h1>
          <p className="text-[#8a7e74] mb-6">Please go back to the dashboard and select a child to start reading.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-[#b28b6a] text-white rounded-full font-medium hover:shadow-xl transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f2eb] p-6">
      <div className="max-w-4xl mx-auto bg-[#fcf9f5] rounded-3xl shadow-xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#1e1916]">📖 Reading Session</h1>
            <p className="text-sm text-[#8a7e74]">Child ID: {childId}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[#1e1916] font-mono">
              ⏱️ {formatTime(readingTime)}
            </span>
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={sessionEnded}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                sessionEnded
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isListening 
                    ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' 
                    : 'bg-[#1e1916] text-white hover:bg-[#2d241e]'
              }`}
            >
              {isListening ? '⏹ Stop' : '🎙️ Start Reading'}
            </button>
          </div>
        </div>

        {/* Story */}
        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed whitespace-pre-wrap font-serif text-[#1e1916]">
            {story}
          </p>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="mt-6 p-4 bg-[#f3eee8] rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-[#4a423b] font-medium">What you read:</p>
              <button
                onClick={resetSession}
                className="text-xs text-[#8a7e74] hover:text-[#b28b6a] transition"
              >
                🔄 Reset
              </button>
            </div>
            <p className="text-[#1e1916] mt-1 text-sm">{transcript}</p>
          </div>
        )}

        {/* Stumbled Words */}
        {stumbledWords.length > 0 && (
          <div className="mt-4 p-4 bg-[#dcc8b4] bg-opacity-20 rounded-xl border border-[#b28b6a] border-opacity-30">
            <p className="text-sm text-[#4a423b] font-medium">📝 Words to practice:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {stumbledWords.map((word, i) => (
                <span key={i} className="px-3 py-1 bg-white rounded-full text-sm font-medium text-[#b28b6a]">
                  {word}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#8a7e74] mt-2">
              {stumbledWords.length} challenging words detected
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-between items-center pt-4 border-t border-black/5">
          <span className="text-sm text-[#8a7e74]">
            {sessionEnded ? '✅ Session complete!' : `${Math.floor(readingTime / 60)}m ${readingTime % 60}s reading`}
          </span>
          {sessionEnded ? (
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm bg-[#b28b6a] text-white px-4 py-2 rounded-full hover:shadow-xl transition-all"
            >
              📊 View Dashboard
            </button>
          ) : (
            <button
              onClick={endSession}
              disabled={!transcript || sessionEnded || isSaving}
              className="text-sm bg-[#1e1916] text-white px-4 py-2 rounded-full hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : '✅ End Session'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}