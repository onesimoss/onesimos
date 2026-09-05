"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const PHONICS_QUESTIONS = [
  {
    id: 'q1',
    type: 'letter-sound',
    question: 'What sound does the letter "A" make?',
    options: ['/a/ as in "apple"', '/e/ as in "eagle"', '/i/ as in "ice"', '/o/ as in "octopus"'],
    correct: 0,
  },
  {
    id: 'q2',
    type: 'letter-sound',
    question: 'What sound does the letter "B" make?',
    options: ['/b/ as in "ball"', '/d/ as in "dog"', '/p/ as in "pig"', '/t/ as in "top"'],
    correct: 0,
  },
  {
    id: 'q3',
    type: 'blend',
    question: 'What does "SH" sound like?',
    options: ['/sh/ as in "ship"', '/ch/ as in "chip"', '/th/ as in "that"', '/wh/ as in "what"'],
    correct: 0,
  },
  {
    id: 'q4',
    type: 'blend',
    question: 'What does "CH" sound like?',
    options: ['/ch/ as in "chair"', '/sh/ as in "sheep"', '/th/ as in "this"', '/wh/ as in "when"'],
    correct: 0,
  },
  {
    id: 'q5',
    type: 'digraph',
    question: 'What sound does "TH" make?',
    options: ['/th/ as in "that"', '/t/ as in "top"', '/h/ as in "hat"', '/wh/ as in "what"'],
    correct: 0,
  },
];

export default function PhonicsAssessment() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleAnswer = (selected: number) => {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);

    if (currentQuestion < PHONICS_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      const correctCount = newAnswers.reduce((acc, ans, i) => {
        return acc + (ans === PHONICS_QUESTIONS[i].correct ? 1 : 0);
      }, 0);
      setScore(correctCount);
      setIsComplete(true);
    }
  };

  const goToReading = () => {
    router.push('/dashboard');
  };

  if (isComplete) {
    const passed = score >= 4; // Pass if 4+ correct
    return (
      <main className="min-h-screen bg-[#f7f2eb] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl w-full text-center">
          <div className="text-6xl mb-4">{passed ? '🎉' : '📚'}</div>
          <h1 className="text-3xl font-bold text-[#1e1916] mb-2">
            {passed ? 'Phonics Test Complete!' : 'Keep Practicing!'}
          </h1>
          <p className="text-[#4a423b] text-lg mb-4">
            You got {score} out of {PHONICS_QUESTIONS.length} correct.
          </p>
          {passed ? (
            <>
              <p className="text-[#b28b6a] font-medium mb-6">
                ✅ You're ready to start reading stories!
              </p>
              <button
                onClick={goToReading}
                className="px-8 py-3 bg-[#b28b6a] text-white rounded-full font-medium hover:shadow-xl transition-all"
              >
                📖 Start Reading
              </button>
            </>
          ) : (
            <>
              <p className="text-[#b28b6a] font-medium mb-6">
                🔁 Review the sounds and try again!
              </p>
              <button
                onClick={() => {
                  setCurrentQuestion(0);
                  setAnswers([]);
                  setIsComplete(false);
                }}
                className="px-8 py-3 bg-[#1e1916] text-white rounded-full font-medium hover:shadow-xl transition-all"
              >
                🔄 Try Again
              </button>
            </>
          )}
        </div>
      </main>
    );
  }

  const question = PHONICS_QUESTIONS[currentQuestion];

  return (
    <main className="min-h-screen bg-[#f7f2eb] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#1e1916]">🔤 Phonics Assessment</h2>
          <span className="text-sm text-[#8a7e74]">
            Question {currentQuestion + 1} of {PHONICS_QUESTIONS.length}
          </span>
        </div>

        <p className="text-lg font-medium text-[#1e1916] mb-6">{question.question}</p>

        <div className="space-y-3">
          {question.options.map((option: string, i: number) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="w-full text-left px-6 py-4 bg-[#f7f2eb] hover:bg-[#dcc8b4] rounded-xl transition-all font-medium text-[#1e1916] hover:scale-[1.02]"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}