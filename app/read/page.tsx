/// <reference lib="dom" />

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

"use client";

import { useState, useRef } from "react";

export default function ReadPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [stumbledWords, setStumbledWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(20); // in minutes
  const recognitionRef = useRef<any>(null);

  const story = `Ella was the biggest elephant in the forest, but she had the softest heart. One morning, she found a tiny bird with a broken wing. "I can help you," Ella whispered, though she was in a hurry to meet her friends. She gently lifted the bird onto her back and carried it to the old owl who knew about healing. Later, her friends asked why she was late. Ella could have made up an excuse. Instead, she told the truth. "I stopped to help a bird," she said, despite feeling shy. Her friends were quiet for a moment. Then they smiled. "That is why we love you," they said. Ella learned that kindness is never wasted.`;

  const startListening = () => {
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
        setTranscript(finalTranscript);
        const words = finalTranscript.split(' ');
        words.forEach((word: string) => {
          if (word.length > 0 && !stumbledWords.includes(word.toLowerCase())) {
            setStumbledWords(prev => [...prev, word.toLowerCase()]);
          }
        });
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
    }
  };

  const adjustTime = (change: number) => {
    setTimeLeft(prev => Math.max(5, Math.min(60, prev + change)));
  };

  return (
    <main className="min-h-screen bg-[#f7f2eb] p-6">
      <div className="max-w-4xl mx-auto bg-[#fcf9f5] rounded-3xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-semibold text-[#1e1916]">📖 Reading Session</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#f3eee8] px-3 py-1 rounded-full">
              <button 
                onClick={() => adjustTime(-5)}
                className="text-[#b28b6a] hover:bg-[#dcc8b4] px-2 py-1 rounded-full transition"
              >
                −
              </button>
              <span className="text-sm font-medium text-[#1e1916] min-w-[40px] text-center">
                ⏱️ {timeLeft}m
              </span>
              <button 
                onClick={() => adjustTime(5)}
                className="text-[#b28b6a] hover:bg-[#dcc8b4] px-2 py-1 rounded-full transition"
              >
                +
              </button>
            </div>
            <button
              onClick={isListening ? stopListening : startListening}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                isListening 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-[#1e1916] text-white hover:bg-[#2d241e]'
              }`}
            >
              {isListening ? '⏹ Stop' : '🎙️ Start Reading'}
            </button>
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed whitespace-pre-wrap font-serif text-[#1e1916]">
            {story}
          </p>
        </div>

        {transcript && (
          <div className="mt-6 p-4 bg-[#f3eee8] rounded-xl">
            <p className="text-sm text-[#4a423b] font-medium">What you read:</p>
            <p className="text-[#1e1916] mt-1">{transcript}</p>
          </div>
        )}

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
          </div>
        )}

        <div className="mt-6 flex justify-between items-center pt-4 border-t border-black/5">
          <span className="text-sm text-[#8a7e74]">Progress: 0%</span>
          <button className="text-sm text-[#b28b6a] hover:underline">Next Story →</button>
        </div>
      </div>
    </main>
  );
}