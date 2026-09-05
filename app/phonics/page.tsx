"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { markPhonicsPassed } from "@/lib/dailyProgress";

type PhonicsQuestion = {
  id: string;
  level: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  correct: number;
  sound: string;
};

const PHONICS_QUESTIONS: PhonicsQuestion[] = [
  { id: "q1", level: "easy", question: 'What sound does the letter "A" make?', options: ["/a/ as in apple", "/e/ as in eagle", "/i/ as in ice"], correct: 0, sound: "a as in apple" },
  { id: "q2", level: "easy", question: 'What sound does the letter "B" make?', options: ["/b/ as in ball", "/d/ as in dog", "/p/ as in pig"], correct: 0, sound: "b as in ball" },
  { id: "q3", level: "easy", question: 'What sound does the letter "C" make?', options: ["/k/ as in cat", "/s/ as in city", "/g/ as in go"], correct: 0, sound: "k as in cat" },
  { id: "q4", level: "easy", question: 'What sound does the letter "D" make?', options: ["/d/ as in dog", "/b/ as in ball", "/t/ as in top"], correct: 0, sound: "d as in dog" },
  { id: "q5", level: "easy", question: 'What sound does the letter "E" make?', options: ["/e/ as in egg", "/i/ as in ice", "/a/ as in apple"], correct: 0, sound: "e as in egg" },
  { id: "q6", level: "easy", question: 'What sound does the letter "F" make?', options: ["/f/ as in fish", "/v/ as in van", "/th/ as in that"], correct: 0, sound: "f as in fish" },
  { id: "q7", level: "medium", question: 'What does "SH" sound like?', options: ["/sh/ as in ship", "/ch/ as in chip", "/th/ as in that"], correct: 0, sound: "sh as in ship" },
  { id: "q8", level: "medium", question: 'What does "CH" sound like?', options: ["/ch/ as in chair", "/sh/ as in sheep", "/th/ as in this"], correct: 0, sound: "ch as in chair" },
  { id: "q9", level: "medium", question: 'What does "TH" sound like?', options: ["/th/ as in that", "/t/ as in top", "/h/ as in hat"], correct: 0, sound: "th as in that" },
  { id: "q10", level: "medium", question: 'What does "WH" sound like?', options: ["/wh/ as in what", "/w/ as in wet", "/h/ as in hat"], correct: 0, sound: "wh as in what" },
  { id: "q11", level: "medium", question: 'What does "AI" sound like?', options: ["/ay/ as in rain", "/ah/ as in cat", "/ee/ as in see"], correct: 0, sound: "ay as in rain" },
  { id: "q12", level: "medium", question: 'What does "EA" sound like?', options: ["/ee/ as in eat", "/eh/ as in bed", "/ay/ as in say"], correct: 0, sound: "ee as in eat" },
  { id: "q13", level: "medium", question: 'What does "OA" sound like?', options: ["/oh/ as in boat", "/ow/ as in cow", "/ah/ as in cat"], correct: 0, sound: "oh as in boat" },
  { id: "q14", level: "hard", question: 'What does "STR" sound like?', options: ["/str/ as in street", "/st/ as in stop", "/tr/ as in tree"], correct: 0, sound: "str as in street" },
  { id: "q15", level: "hard", question: 'What does "PL" sound like?', options: ["/pl/ as in play", "/bl/ as in blue", "/cl/ as in clap"], correct: 0, sound: "pl as in play" },
  { id: "q16", level: "hard", question: 'What does "SPR" sound like?', options: ["/spr/ as in spring", "/sp/ as in spot", "/pr/ as in press"], correct: 0, sound: "spr as in spring" },
  { id: "q17", level: "hard", question: 'What does "TCH" sound like?', options: ["/ch/ as in catch", "/sh/ as in ship", "/th/ as in that"], correct: 0, sound: "ch as in catch" },
];

function PhonicsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get('child');
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | null>(null);
  const [questions, setQuestions] = useState<PhonicsQuestion[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const speakSound = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startPhonics = (level: "easy" | "medium" | "hard") => {
    setDifficulty(level);
    const filtered = PHONICS_QUESTIONS.filter((q) => q.level === level);
    setQuestions(filtered);
    setCurrentQuestion(0);
    setAnswers([]);
    setIsComplete(false);
    setScore(0);
  };

  const handleAnswer = (selected: number) => {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const correctCount = newAnswers.reduce((acc, ans, i) => {
        return acc + (ans === questions[i].correct ? 1 : 0);
      }, 0);
      setScore(correctCount);
      setIsComplete(true);
    }
  };

  const handlePassAndContinue = async () => {
    if (childId) {
      await markPhonicsPassed(childId);
    }
    router.push(`/read?child=${childId}`);
  };

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  if (!user) return null;

  if (!difficulty) {
    return (
      <main className="min-h-screen bg-[#f7f2eb] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl w-full text-center">
          <h1 className="text-3xl font-bold text-[#1e1916] mb-4">🔤 Choose Your Level</h1>
          <p className="text-[#4a423b] mb-8">Start with Easy, then work your way up!</p>
          <div className="space-y-4">
            <button onClick={() => startPhonics("easy")} className="w-full px-8 py-4 bg-green-100 hover:bg-green-200 rounded-xl text-lg font-semibold text-green-800 transition-all hover:scale-[1.02]">🌱 Easy – Letter Sounds</button>
            <button onClick={() => startPhonics("medium")} className="w-full px-8 py-4 bg-yellow-100 hover:bg-yellow-200 rounded-xl text-lg font-semibold text-yellow-800 transition-all hover:scale-[1.02]">⭐ Medium – Blends & Digraphs</button>
            <button onClick={() => startPhonics("hard")} className="w-full px-8 py-4 bg-red-100 hover:bg-red-200 rounded-xl text-lg font-semibold text-red-800 transition-all hover:scale-[1.02]">🚀 Hard – Advanced Blends</button>
          </div>
          <button onClick={goToDashboard} className="mt-8 text-sm text-[#8a7e74] hover:underline">← Back to Dashboard</button>
        </div>
      </main>
    );
  }

  if (isComplete) {
    const passed = score >= Math.ceil(questions.length * 0.7);
    return (
      <main className="min-h-screen bg-[#f7f2eb] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl w-full text-center">
          <div className="text-6xl mb-4">{passed ? "🎉" : "📚"}</div>
          <h1 className="text-3xl font-bold text-[#1e1916] mb-2">
            {passed ? "Phonics Test Complete!" : "Keep Practicing!"}
          </h1>
          <p className="text-[#4a423b] text-lg mb-4">
            You got {score} out of {questions.length} correct.
          </p>
          {passed ? (
            <>
              <p className="text-[#b28b6a] font-medium mb-6">✅ You're ready to start reading!</p>
              <button onClick={handlePassAndContinue} className="px-8 py-3 bg-[#b28b6a] text-white rounded-full font-medium hover:shadow-xl transition-all">📖 Start Reading</button>
            </>
          ) : (
            <>
              <p className="text-[#b28b6a] font-medium mb-6">🔁 Review the sounds and try again!</p>
              <button onClick={() => { setDifficulty(null); setQuestions([]); setCurrentQuestion(0); setAnswers([]); setIsComplete(false); }} className="px-8 py-3 bg-[#1e1916] text-white rounded-full font-medium hover:shadow-xl transition-all">🔄 Try Again</button>
            </>
          )}
          <button onClick={goToDashboard} className="mt-4 text-sm text-[#8a7e74] hover:underline block w-full">← Back to Dashboard</button>
        </div>
      </main>
    );
  }

  const question = questions[currentQuestion];
  if (!question) return <div className="p-8 text-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-[#f7f2eb] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#1e1916]">🔤 Phonics</h2>
            <p className="text-xs text-[#8a7e74] capitalize">Level: {difficulty}</p>
          </div>
          <span className="text-sm text-[#8a7e74]">{currentQuestion + 1} of {questions.length}</span>
        </div>

        <p className="text-lg font-medium text-[#1e1916] mb-4">{question.question}</p>

        <button onClick={() => speakSound(question.sound)} className="text-sm text-[#b28b6a] hover:underline mb-4 flex items-center gap-2">🔊 Tap to hear the sound</button>

        <div className="space-y-3">
          {question.options.map((option, i) => (
            <button key={i} onClick={() => handleAnswer(i)} className="w-full text-left px-6 py-4 bg-[#f7f2eb] hover:bg-[#dcc8b4] rounded-xl transition-all font-medium text-[#1e1916] hover:scale-[1.02]">{option}</button>
          ))}
        </div>

        <div className="mt-6 w-full h-2 bg-[#f0e8e0] rounded-full overflow-hidden">
          <div className="h-full bg-[#b28b6a] transition-all duration-300" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
        </div>
      </div>
    </main>
  );
}

function PhonicsFallback() {
  return (
    <main className="min-h-screen bg-[#f7f2eb] flex items-center justify-center p-6">
      <div className="text-[#8a7e74]">Loading...</div>
    </main>
  );
}

export default function PhonicsAssessment() {
  return (
    <Suspense fallback={<PhonicsFallback />}>
      <PhonicsContent />
    </Suspense>
  );
}