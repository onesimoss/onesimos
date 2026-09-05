/// <reference lib="dom" />

"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { 
  saveReadingSession, 
  getChild,
  getChildStats 
} from "@/lib/readingUtils";
import { 
  hasCompletedToday, 
  saveDailyProgress, 
  saveStumbledWord,
  getChildStreak
} from "@/lib/dailyProgress";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/lib/themes";

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

const STORIES = [
  {
    id: 'story-1',
    title: "Ella the Kind Elephant",
    theme: "Kindness & Compassion",
    content: `Ella was the biggest elephant in the forest, but she had the softest heart. One morning, she found a tiny bird with a broken wing. "I can help you," Ella whispered, though she was in a hurry to meet her friends. She gently lifted the bird onto her back and carried it to the old owl who knew about healing. Later, her friends asked why she was late. Ella could have made up an excuse. Instead, she told the truth. "I stopped to help a bird," she said, despite feeling shy. Her friends were quiet for a moment. Then they smiled. "That is why we love you," they said. Ella learned that kindness is never wasted.`,
    questions: [
      { q: "Who did Ella help?", options: ["A bird", "A snake", "A monkey", "A rabbit"], correct: "A bird" },
      { q: "Why was Ella late?", options: ["She got lost", "She was helping a bird", "She was sleeping", "She didn't want to go"], correct: "She was helping a bird" },
      { q: "What did Ella learn?", options: ["Kindness is never wasted", "Being late is okay", "Birds are nice", "Friends don't matter"], correct: "Kindness is never wasted" },
    ],
    characterLesson: "Kindness is never wasted. Even small acts of kindness matter."
  },
  {
    id: 'story-2',
    title: "Felix the Brave Fox",
    theme: "Courage & Perseverance",
    content: `Felix the fox loved to race. But he always came last. One day, he tripped and fell right in front of everyone. "I'll never be fast," he muttered. His mother sat beside him and said, "You just need to practice, despite how hard it feels." Felix decided to try again. Every morning, he ran through the meadow, though his legs ached. After many weeks, the forest held a race. Felix did not come first. But he did not fall either. He finished with a steady pace and a happy heart. "I did it," he said, because he kept going even when he wanted to stop. Felix learned that being brave means trying again.`,
    questions: [
      { q: "What did Felix love to do?", options: ["Sing", "Race", "Sleep", "Read"], correct: "Race" },
      { q: "What did Felix's mother tell him?", options: ["To give up", "To practice", "To sleep more", "To find a new hobby"], correct: "To practice" },
      { q: "What did Felix learn?", options: ["Being brave means trying again", "Racing is scary", "He should stop racing", "He is always last"], correct: "Being brave means trying again" },
    ],
    characterLesson: "Being brave means trying again, even when it's hard. Courage is not giving up."
  }
];

// Helper: split story into word array with punctuation attached
function getWordsWithPunctuation(text: string): { word: string; clean: string }[] {
  return text.split(/\s+/).map(w => ({
    word: w,
    clean: w.replace(/[^a-zA-Z']/g, '').toLowerCase()
  }));
}

function ReadingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const childId = searchParams.get('child');
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dinosaurs;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [stumbledWords, setStumbledWords] = useState<string[]>([]);
  const [readingTime, setReadingTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [highlightedIndices, setHighlightedIndices] = useState<Set<number>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [comprehensionScore, setComprehensionScore] = useState(0);
  const [badgesEarned, setBadgesEarned] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [childName, setChildName] = useState("");
  const [showAllWords, setShowAllWords] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const story = STORIES[storyIndex] || STORIES[0];
  const storyWords = getWordsWithPunctuation(story.content);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function loadData() {
      if (!childId) {
        setIsLoading(false);
        return;
      }

      try {
        const childResult = await getChild(childId);
        if (childResult.data) {
          setChildName(childResult.data.name || "Child");
        }

        const completed = await hasCompletedToday(childId);
        if (completed) {
          setIsComplete(true);
        }

        const streakResult = await getChildStreak(childId);
        setStreak(streakResult.streak || 0);

        const stats = await getChildStats(childId);
        if (!stats.error) {
          const badges = [];
          if (stats.totalSessions >= 1) badges.push("📖 First Reader");
          if (stats.totalSessions >= 5) badges.push("⭐ Story Explorer");
          if (stats.totalSessions >= 10) badges.push("🏆 Bookworm");
          if (stats.totalSessions >= 20) badges.push("👑 Reading Champion");
          setBadgesEarned(badges);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }

      setIsLoading(false);
    }

    loadData();
  }, [childId]);

  // Timer
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

  // Auto-end after 20 minutes
  useEffect(() => {
    if (readingTime >= 1200 && isTimerRunning) {
      endSession();
    }
  }, [readingTime, isTimerRunning]);

  // 🔥 FIX: Real-time word highlighting - instant
  const highlightWords = (text: string) => {
    if (!text) return;
    
    const spokenWords = text.toLowerCase().split(' ');
    const newHighlighted = new Set<number>();
    
    storyWords.forEach((item, index) => {
      const cleanStory = item.clean;
      if (!cleanStory) return;
      
      // Check if this story word appears in the spoken text
      for (const spoken of spokenWords) {
        const cleanSpoken = spoken.replace(/[^a-z']/g, '');
        if (cleanSpoken && cleanStory === cleanSpoken) {
          newHighlighted.add(index);
          break;
        }
      }
    });
    
    setHighlightedIndices(newHighlighted);
  };

  // Detect stumbles from transcript
  const detectStumbles = (text: string) => {
    const cleaned = text
      .toLowerCase()
      .replace(/\b(uh|um|er|ah|like|you know)\b/g, '')
      .replace(/[^a-z\s']/g, '')
      .replace(/\s+/g, ' ')
      .trim();
      
    const words = cleaned.split(' ');
    const storyWordSet = new Set(storyWords.map(w => w.clean).filter(Boolean));
    
    const newStumbles: string[] = [];
    words.forEach((word: string) => {
      const cleanWord = word.replace(/[^a-z']/g, '');
      if (!cleanWord || 
          EASY_WORDS.has(cleanWord) || 
          !storyWordSet.has(cleanWord) ||
          stumbledWords.includes(cleanWord) ||
          /^[0-9]+$/.test(cleanWord)) {
        return;
      }
      newStumbles.push(cleanWord);
      if (childId) {
        saveStumbledWord(childId, cleanWord);
      }
    });
    
    if (newStumbles.length > 0) {
      setStumbledWords(prev => [...prev, ...newStumbles]);
    }
  };

  // Voice: start listening
  const startListening = () => {
    if (!childId) {
      alert("Please select a child first.");
      return;
    }

    if (isComplete) {
      alert("You've already completed today's reading! Come back tomorrow.");
      return;
    }

    if (!process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY) {
      alert("Deepgram API key not configured. Please check your environment variables.");
      return;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser doesn't support microphone access.");
        return;
      }

      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          const audioChunks: BlobPart[] = [];

          mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
          };

          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            await transcribeAudio(audioBlob);
          };

          mediaRecorder.start(1000);
          recognitionRef.current = mediaRecorder;
          setIsListening(true);
          setIsTimerRunning(true);
        })
        .catch((err) => {
          console.error("Microphone error:", err);
          alert("Could not access microphone. Please allow microphone permissions.");
        });

    } catch (error) {
      console.error("Speech error:", error);
      alert("There was an error starting voice recognition. Please try again.");
    }
  };

  // Transcribe via Deepgram
  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error("Transcription API error:", response.status);
        return;
      }

      const data = await response.json();
      if (data.transcript) {
        const newTranscript = data.transcript;
        // 🔥 FIX: Update transcript and trigger highlighting immediately
        setTranscript(prev => {
          const updated = prev + ' ' + newTranscript;
          return updated;
        });
        // 🔥 FIX: Highlight instantly
        highlightWords(newTranscript);
        detectStumbles(newTranscript);
      }
    } catch (error) {
      console.error("Transcription error:", error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      if (typeof recognitionRef.current.stop === 'function') {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setIsTimerRunning(false);
    }
  };

  // 🔥 FIX: End session with proper save handling
  const endSession = async () => {
    if (isSaving || sessionEnded) return;
    setIsSaving(true);
    setSessionEnded(true);
    setIsTimerRunning(false);
    stopListening();

    const wordsRead = transcript.split(' ').filter(w => w.length > 0).length || 1;

    try {
      // Attempt to save to Supabase
      const result = await saveReadingSession({
        childId: childId!,
        storyId: story.id,
        durationSeconds: Math.max(readingTime, 1),
        wordsRead: wordsRead,
        wordsStumbled: stumbledWords,
        endedAt: new Date(),
      });

      if (result.error) {
        console.error("Save error:", result.error);
        setSaveError(result.error.message || "Failed to save to database");
        // 🔥 FIX: Still show questions even if save fails (local progress)
        setShowQuestions(true);
        setCurrentQuestionIndex(0);
        setAnswers([]);
      } else {
        // Success! Show questions
        setShowQuestions(true);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setSaveError(null);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setSaveError("An unexpected error occurred");
      // Still show questions
      setShowQuestions(true);
      setCurrentQuestionIndex(0);
      setAnswers([]);
    }

    setIsSaving(false);
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    const currentQuestion = story.questions[currentQuestionIndex];
    if (answer === currentQuestion.correct) {
      setComprehensionScore(prev => prev + 1);
    }

    if (currentQuestionIndex < story.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishReading(newAnswers);
    }
  };

  const finishReading = async (finalAnswers: string[]) => {
    const score = story.questions.reduce((acc, q, i) => {
      return acc + (finalAnswers[i] === q.correct ? 1 : 0);
    }, 0);
    
    setComprehensionScore(score);
    
    const badges: string[] = [];
    if (score === story.questions.length) badges.push("⭐ Word Wizard");
    if (stumbledWords.length === 0) badges.push("🎯 Perfect Reader");
    if (readingTime < 600) badges.push("⚡ Fast Reader");
    badges.push("📖 Story Explorer");
    setBadgesEarned(badges);

    try {
      await saveDailyProgress({
        childId: childId!,
        storyId: story.id,
        wordsRead: transcript.split(' ').filter(w => w.length > 0).length,
        comprehensionScore: score,
        badgesEarned: badges,
      });
    } catch (err) {
      console.error("Error saving daily progress:", err);
    }

    const streakResult = await getChildStreak(childId!);
    setStreak(streakResult.streak || 0);
    
    setIsComplete(true);
    setShowQuestions(false);
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  // Loading
  if (isLoading || !isClient) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6" style={{ background: currentTheme?.background || '#f7f2eb' }}>
        <div className="text-[#8a7e74]">Loading...</div>
      </main>
    );
  }

  // No child
  if (!childId) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: currentTheme?.background || '#f7f2eb' }}>
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-[#1e1916] mb-4">👶 Select a Child</h1>
          <p className="text-[#8a7e74] mb-6">Please go back to the dashboard and select a child to start reading.</p>
          <button onClick={goToDashboard} className="px-6 py-2 bg-[#b28b6a] text-white rounded-full font-medium hover:shadow-xl transition-all">Go to Dashboard</button>
        </div>
      </main>
    );
  }

  // Celebration
  if (isComplete) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6" style={{ background: currentTheme?.background || '#f7f2eb' }}>
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl w-full text-center">
          <div className="text-6xl mb-4">🌟</div>
          <h1 className="text-3xl font-bold text-[#1e1916] mb-2">You did it, {childName || "Champion"}!</h1>
          <p className="text-[#4a423b] text-lg mb-6">You read a whole story and answered all the questions!</p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#f7f2eb] p-4 rounded-xl">
              <p className="text-2xl font-bold text-[#b28b6a]">{readingTime > 0 ? `${Math.floor(readingTime / 60)}m` : '—'}</p>
              <p className="text-xs text-[#8a7e74]">Reading Time</p>
            </div>
            <div className="bg-[#f7f2eb] p-4 rounded-xl">
              <p className="text-2xl font-bold text-[#b28b6a]">{comprehensionScore}/{story.questions.length}</p>
              <p className="text-xs text-[#8a7e74]">Questions Correct</p>
            </div>
            <div className="bg-[#f7f2eb] p-4 rounded-xl">
              <p className="text-2xl font-bold text-[#b28b6a]">🔥 {streak}</p>
              <p className="text-xs text-[#8a7e74]">Day Streak</p>
            </div>
          </div>

          {badgesEarned.length > 0 && (
            <div className="mb-8">
              <p className="text-sm font-medium text-[#4a423b] mb-3">🏅 Badges Earned</p>
              <div className="flex flex-wrap justify-center gap-2">
                {badgesEarned.map((badge, i) => (
                  <span key={i} className="px-4 py-2 bg-[#dcc8b4] bg-opacity-20 rounded-full text-sm font-medium text-[#b28b6a]">{badge}</span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#f3eee8] p-6 rounded-xl mb-8 text-left">
            <p className="text-sm font-medium text-[#4a423b] mb-2">💡 Character Lesson</p>
            <p className="text-[#1e1916] italic">"{story.characterLesson}"</p>
          </div>

          <button onClick={goToDashboard} className="px-8 py-3 bg-[#1e1916] text-white rounded-full font-medium hover:shadow-xl transition-all">📊 Back to Dashboard</button>
          <p className="text-xs text-[#8a7e74] mt-4">🔒 Come back tomorrow for a new story!</p>
        </div>
      </main>
    );
  }

  // Comprehension Questions
  if (showQuestions) {
    const question = story.questions[currentQuestionIndex];
    if (!question) {
      return <div className="flex items-center justify-center p-8">Loading...</div>;
    }

    return (
      <main className="min-h-screen flex items-center justify-center p-6" style={{ background: currentTheme?.background || '#f7f2eb' }}>
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl w-full">
          {saveError && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg mb-4 text-sm">
              ⚠️ {saveError} Your progress is saved locally.
            </div>
          )}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#1e1916]">🤔 Comprehension Check</h2>
            <span className="text-sm text-[#8a7e74]">Question {currentQuestionIndex + 1} of {story.questions.length}</span>
          </div>
          <p className="text-lg font-medium text-[#1e1916] mb-6">{question.q}</p>
          <div className="space-y-3">
            {question.options.map((option: string, i: number) => (
              <button key={i} onClick={() => handleAnswer(option)} className="w-full text-left px-6 py-4 bg-[#f7f2eb] hover:bg-[#dcc8b4] rounded-xl transition-all font-medium text-[#1e1916] hover:scale-[1.02]">{option}</button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Main reading screen
  return (
    <main className="min-h-screen p-6 transition-colors duration-300" style={{ background: currentTheme?.background || '#f7f2eb' }}>
      <div className="max-w-4xl mx-auto rounded-3xl shadow-xl p-8 transition-colors duration-300" style={{ background: currentTheme?.card || '#fcf9f5', borderColor: currentTheme?.accentLight || '#dcc8b4' }}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#1e1916]">📖 {story.title}</h1>
            <p className="text-sm text-[#8a7e74]">Theme: {story.theme} · {childName || "Child"}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[#1e1916] font-mono">⏱️ {Math.floor(readingTime / 60)}m {readingTime % 60}s</span>
            <button onClick={isListening ? stopListening : startListening} disabled={sessionEnded || isComplete} className={`px-6 py-2 rounded-full font-medium transition-all ${sessionEnded || isComplete ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : isListening ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' : 'bg-[#1e1916] text-white hover:bg-[#2d241e]'}`}>
              {isListening ? '⏹ Stop' : '🎙️ Start Reading'}
            </button>
          </div>
        </div>

        {/* Story with INSTANT highlighting */}
        <div className="prose max-w-none mb-6">
          <div className="text-lg leading-relaxed whitespace-pre-wrap font-serif text-[#1e1916]">
            {storyWords.map((item, i) => {
              const cleanWord = item.clean;
              const isHighlighted = highlightedIndices.has(i);
              const isStumbled = stumbledWords.includes(cleanWord);
              
              return (
                <span key={i} className={`transition-all duration-150 ${isStumbled ? 'bg-[#dcc8b4] bg-opacity-40 px-1 rounded text-[#b28b6a] font-bold underline decoration-wavy' : isHighlighted ? 'bg-[#b28b6a] bg-opacity-25 px-1 rounded' : ''}`}>
                  {item.word}{' '}
                </span>
              );
            })}
          </div>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="mt-4 p-4 bg-[#f3eee8] rounded-xl">
            <p className="text-sm text-[#4a423b] font-medium">What you read:</p>
            <p className="text-[#1e1916] mt-1 text-sm max-h-40 overflow-y-auto">{transcript}</p>
          </div>
        )}

        {/* Stumbled Words - Expandable */}
        {stumbledWords.length > 0 && (
          <div className="mt-4 p-4 bg-[#dcc8b4] bg-opacity-20 rounded-xl border border-[#b28b6a] border-opacity-30">
            <p className="text-sm text-[#4a423b] font-medium">📝 Words to practice:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {stumbledWords.slice(0, 15).map((word, i) => (
                <span key={i} className="px-3 py-1 bg-white rounded-full text-sm font-medium text-[#b28b6a]">{word}</span>
              ))}
              {stumbledWords.length > 15 && (
                <button onClick={() => setShowAllWords(!showAllWords)} className="px-3 py-1 text-sm text-[#b28b6a] hover:underline cursor-pointer bg-white rounded-full">
                  {showAllWords ? 'Show less' : `+${stumbledWords.length - 15} more`}
                </button>
              )}
            </div>
            {showAllWords && stumbledWords.length > 15 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {stumbledWords.slice(15).map((word, i) => (
                  <span key={i} className="px-3 py-1 bg-white rounded-full text-sm font-medium text-[#b28b6a]">{word}</span>
                ))}
              </div>
            )}
            <p className="text-xs text-[#8a7e74] mt-2">{stumbledWords.length} challenging words detected</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-between items-center pt-4 border-t border-black/5 flex-wrap gap-3">
          <span className="text-sm text-[#8a7e74]">
            {sessionEnded ? '✅ Session complete! Answer questions now.' : `${Math.floor(readingTime / 60)}m ${readingTime % 60}s reading`}
          </span>
          <div className="flex gap-3 flex-wrap">
            {sessionEnded ? (
              <span className="text-sm text-[#b28b6a] font-medium">⏳ Answer the questions to finish!</span>
            ) : (
              <button onClick={endSession} disabled={!transcript || sessionEnded || isSaving || isListening} className="text-sm bg-[#1e1916] text-white px-6 py-2 rounded-full hover:shadow-xl transition-all disabled:opacity-50">
                {isSaving ? 'Saving...' : '✅ End Session'}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function ReadingFallback() {
  return (
    <main className="min-h-screen bg-[#f7f2eb] flex items-center justify-center p-6">
      <div className="text-[#8a7e74]">Loading reading session...</div>
    </main>
  );
}

export default function ReadPage() {
  return (
    <Suspense fallback={<ReadingFallback />}>
      <ReadingContent />
    </Suspense>
  );
}