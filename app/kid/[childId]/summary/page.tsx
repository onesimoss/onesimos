/**
 * @file app/kid/[childId]/summary/page.tsx
 * @description Kid Story Completion, Post-Story Comprehension Quiz, and Celebration Screen.
 *              Evaluates story understanding and logs exact reading duration and quiz accuracy
 *              to Supabase for honest, non-deceptive parent analytics.
 *
 * @fonts Achiko (headings/logo) + Switzer (body/UI)
 * @dependencies
 * - @/context/AuthContext
 * - @/lib/sampleStories, @/lib/stumbledWords, @/lib/sessionInsights
 * - @/lib/avatars, @/lib/children
 */

"use client";

import { Suspense, useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { getAvatarById } from "@/lib/avatars";
import { getAgeBand, type ChildProfile, type AgeBand } from "@/lib/children";
import { getStoryById, type ComprehensionQuestion } from "@/lib/sampleStories";
import { saveReadingSession } from "@/lib/sessionInsights";
import {
  getRecentStumbledWords,
  speakWord,
  extractClassifiedTokens,
  type StumbledItem,
} from "@/lib/stumbledWords";

// ─── Section 1: Helper Types & Classification ───

interface ProcessedSummaryWord {
  word: string;
  display: string;
  type: "word" | "name";
  count: number;
}

/**
 * Classifies raw stumbled words by cross-referencing story text or proper noun heuristics.
 */
function classifyStumbledList(
  rawWords: { word: string; count: number }[],
  storyText?: string
): ProcessedSummaryWord[] {
  const storyTokens = storyText ? extractClassifiedTokens(storyText) : [];
  const tokenMap = new Map<string, StumbledItem>();

  storyTokens.forEach((item) => {
    tokenMap.set(item.word.toLowerCase(), item);
  });

  return rawWords.map(({ word, count }) => {
    const lower = word.toLowerCase();
    const matched = tokenMap.get(lower);

    if (matched) {
      return {
        word: lower,
        display: matched.display,
        type: matched.type,
        count,
      };
    }

    const isCapitalized = /^[A-Z]/.test(word);
    const display = isCapitalized
      ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      : word;

    return {
      word: lower,
      display,
      type: isCapitalized ? "name" : "word",
      count,
    };
  });
}

/**
 * Allowed comprehension question types per age band.
 * Questions without an explicit type default to "literal".
 */
const ALLOWED_QUESTION_TYPES: Record<AgeBand, string[]> = {
  "pre-reader": ["literal"],
  emerging: ["literal", "vocabulary"],
  confident: ["literal", "inferential", "vocabulary"],
};

/**
 * Filter comprehension questions to match the child's age band.
 */
function filterQuestionsByAgeBand(
  questions: ComprehensionQuestion[],
  ageBand: AgeBand
): ComprehensionQuestion[] {
  const allowed = ALLOWED_QUESTION_TYPES[ageBand];

  return questions.filter((q) => {
    const qType = (q as ComprehensionQuestion & { type?: string }).type || "literal";
    return allowed.includes(qType);
  });
}

/**
 * Emoji letter guides for pre-reader quiz options.
 */
const OPTION_EMOJIS = ["🅰️", "🅱️", "🅲", "🅳"];

// ─── Section 2: Summary Core Content ───

function SummaryContent() {
  const { childId } = useParams<{ childId: string }>();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const router = useRouter();

  const storyId = searchParams.get("storyId") || "";
  const pagesRead = Number(searchParams.get("pages") || "0");
  const durationSeconds = Number(searchParams.get("duration") || "0");

  const [child, setChild] = useState<ChildProfile | null>(null);
  const [stumbledItems, setStumbledItems] = useState<ProcessedSummaryWord[]>([]);
  const [fetching, setFetching] = useState(true);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [activeSpeakingWord, setActiveSpeakingWord] = useState<string | null>(null);

  // Comprehension Quiz States
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const story = useMemo(() => getStoryById(storyId), [storyId]);
  const allQuestions: ComprehensionQuestion[] = useMemo(
    () => story?.questions || [],
    [story]
  );

  // Auth Protection
  useEffect(() => {
    if (!loading && !user) router.replace("/parent/login");
  }, [user, loading, router]);

  // Fetch Child Profile & Stumbled Words Log
  useEffect(() => {
    async function loadSummaryData() {
      if (!user || !childId) return;
      setFetching(true);

      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("id", childId)
        .eq("parent_id", user.id)
        .single();

      if (error || !data) {
        router.replace("/who");
        return;
      }

      const profile = data as ChildProfile;
      setChild(profile);

      // Fetch recent stumbled words for this session
      const { data: recentWords } = await getRecentStumbledWords(profile.id, 10);
      const fullStoryText = story?.pages.map((p) => p.text).join(" ") || "";
      const classified = classifyStumbledList(recentWords, fullStoryText);
      setStumbledItems(classified);

      setFetching(false);

      // If story has no matching questions for this age band, mark quiz completed
      const band = getAgeBand(profile.age);
      const filtered = filterQuestionsByAgeBand(allQuestions, band);
      if (filtered.length === 0) {
        setQuizCompleted(true);
      }
    }

    void loadSummaryData();
  }, [user, childId, router, story, allQuestions]);

  // Derive age band and filtered questions reactively
  const ageBand = useMemo<AgeBand>(() => {
    return child ? getAgeBand(child.age) : "emerging";
  }, [child]);

  const isPreReader = ageBand === "pre-reader";

  const questions = useMemo(() => {
    return filterQuestionsByAgeBand(allQuestions, ageBand);
  }, [allQuestions, ageBand]);

  // Save Reading Session with Real Duration & Quiz Accuracy to Supabase
  const persistSessionStats = useCallback(
    async (finalCorrectCount: number) => {
      if (!child || sessionSaved) return;

      const totalPages = story?.pages.length || pagesRead || 1;
      const completed = pagesRead >= totalPages;

      let quizAccuracy: number | undefined = undefined;
      if (questions.length > 0) {
        quizAccuracy = Math.round((finalCorrectCount / questions.length) * 100);
      }

      await saveReadingSession({
        childId: child.id,
        storyId: storyId || undefined,
        pagesRead: pagesRead || 0,
        durationSeconds: durationSeconds || 0,
        completedStory: completed,
        quizAccuracy,
      });

      setSessionSaved(true);
    },
    [child, sessionSaved, story, pagesRead, durationSeconds, storyId, questions]
  );

  // Trigger session save when quiz is completed or if no questions exist
  useEffect(() => {
    if (quizCompleted && child && !sessionSaved) {
      void persistSessionStats(correctAnswersCount);
    }
  }, [quizCompleted, child, sessionSaved, correctAnswersCount, persistSessionStats]);

  // Handle Option Selection in Quiz
  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowExplanation(true);

    const currentQ = questions[quizIndex];
    if (index === currentQ.correctIndex) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
  };

  // Advance Quiz to Next Question or Final Summary
  const handleNextQuizStep = () => {
    if (quizIndex < questions.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  // Handle Tap-to-Hear Pronunciation
  const handleTapToHear = (text: string) => {
    setActiveSpeakingWord(text);
    speakWord(text);
    setTimeout(() => setActiveSpeakingWord(null), 1200);
  };

  // ─── Loading State ───

  if (loading || fetching || !child) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 font-switzer">
        <div className="text-center space-y-3">
          <div className="text-4xl animate-bounce">🌟</div>
          <p className="font-extrabold text-gray-700 text-lg font-switzer">
            Counting your stars...
          </p>
        </div>
      </main>
    );
  }

  const avatar = getAvatarById(child.avatar_id);
  const totalPages = story?.pages.length || pagesRead || 1;
  const completed = pagesRead >= totalPages;
  const currentQuestion = questions[quizIndex];

  // Stars calculation includes completion + comprehension accuracy
  const quizPassedAll = questions.length > 0 && correctAnswersCount === questions.length;
  const stars = completed
    ? quizPassedAll
      ? 3
      : 2
    : pagesRead >= Math.ceil(totalPages / 2)
    ? 2
    : 1;

  const practiceWords = stumbledItems.filter((i) => i.type === "word");
  const characterNames = stumbledItems.filter((i) => i.type === "name");

  // ─── Section 3: Comprehension Quiz View ───

  if (!quizCompleted && currentQuestion) {
    const isCorrect = selectedOption === currentQuestion.correctIndex;

    return (
      <main className="min-h-screen bg-gradient-to-b from-sky-50/60 via-[#FDFBF7] to-amber-50/40 flex items-center justify-center p-4 sm:p-6 font-switzer">
        <div
          className={`w-full bg-white rounded-3xl border border-gray-100 shadow-xl text-center font-switzer ${
            isPreReader ? "max-w-xl p-8 sm:p-10" : "max-w-lg p-6 sm:p-8"
          }`}
        >
          {/* Header Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/60 text-xs font-black text-amber-900 mb-6 font-switzer">
            <span>{isPreReader ? "🌱" : "🤔"}</span>
            {isPreReader ? "Story Fun" : "Story Check"} : Question {quizIndex + 1} of{" "}
            {questions.length}
          </div>

          {/* Question Text */}
          <h2
            className={`font-black text-gray-900 leading-snug mb-6 font-achiko ${
              isPreReader ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
            }`}
          >
            {currentQuestion.questionText}
          </h2>

          {/* Multiple Choice Options */}
          <div className={`space-y-3 mb-6 text-left font-switzer ${isPreReader ? "space-y-4" : ""}`}>
            {currentQuestion.options.map((option, index) => {
              let btnStyle =
                "bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100";

              if (selectedOption !== null) {
                if (index === currentQuestion.correctIndex) {
                  btnStyle =
                    "bg-emerald-500 text-white border-emerald-600 shadow-sm";
                } else if (index === selectedOption) {
                  btnStyle = "bg-amber-100 text-amber-950 border-amber-300";
                } else {
                  btnStyle =
                    "bg-gray-50 border-gray-100 text-gray-400 opacity-60";
                }
              }

              return (
                <button
                  key={index}
                  type="button"
                  disabled={selectedOption !== null}
                  onClick={() => handleSelectOption(index)}
                  className={`w-full rounded-2xl border font-bold transition-all text-left flex items-center justify-between active:scale-[0.99] font-switzer ${btnStyle} ${
                    isPreReader
                      ? "p-5 text-base sm:text-lg gap-3"
                      : "p-4 text-sm"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isPreReader && (
                      <span className="text-lg shrink-0">
                        {OPTION_EMOJIS[index] || "🔵"}
                      </span>
                    )}
                    <span>{option}</span>
                  </span>
                  {selectedOption !== null &&
                    index === currentQuestion.correctIndex && (
                      <span className={isPreReader ? "text-2xl" : "text-base"}>
                        ✅
                      </span>
                    )}
                </button>
              );
            })}
          </div>

          {/* Instant Feedback & Explanation */}
          {showExplanation && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 mb-6 text-left font-switzer animate-fadeIn">
              <p className="text-xs font-black text-amber-900 mb-1 flex items-center gap-1.5">
                <span>
                  {isCorrect
                    ? isPreReader
                      ? "🎉 You did it!"
                      : "🎯 Great thinking!"
                    : isPreReader
                    ? "💛 Nice try!"
                    : "💡 Good try!"}
                </span>
              </p>
              <p
                className={`text-amber-950 font-medium leading-relaxed font-switzer ${
                  isPreReader ? "text-sm" : "text-xs"
                }`}
              >
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Next Question / Finish Quiz Button */}
          {selectedOption !== null && (
            <button
              type="button"
              onClick={handleNextQuizStep}
              className={`w-full rounded-2xl bg-coral text-white font-black hover:bg-coral/90 transition-all shadow-md active:scale-95 font-switzer ${
                isPreReader ? "py-4 px-6 text-sm" : "py-3.5 px-6 text-xs"
              }`}
            >
              {quizIndex < questions.length - 1
                ? "Next Question →"
                : "See My Stars ⭐"}
            </button>
          )}
        </div>
      </main>
    );
  }

  // ─── Section 4: Final Summary Celebration View ───

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/60 via-[#FDFBF7] to-emerald-50/40 flex items-center justify-center p-4 sm:p-6 font-switzer">
      <div
        className={`w-full bg-white rounded-3xl border border-gray-100 shadow-xl text-center font-switzer ${
          isPreReader ? "max-w-xl p-8 sm:p-10" : "max-w-lg p-6 sm:p-8"
        }`}
      >
        {/* Child Avatar & Headline */}
        <div
          className={`mx-auto rounded-3xl overflow-hidden border-2 border-white shadow-md mb-4 flex items-center justify-center ${
            isPreReader ? "w-24 h-24" : "w-20 h-20"
          }`}
          style={{ backgroundColor: `${avatar.color}33` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar.imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <h1
          className={`font-achiko font-black text-gray-900 tracking-tight mb-1 ${
            isPreReader ? "text-4xl" : "text-3xl"
          }`}
        >
          {isPreReader ? "Yay, " : "Amazing, "}
          {child.name}!
        </h1>
        <p className="text-gray-500 text-sm font-medium mb-6 font-switzer">
          {completed
            ? isPreReader
              ? "You read the whole story! So proud of you! 🌟"
              : "You finished the story and answered questions!"
            : isPreReader
            ? "You tried your best and that makes you a star! ⭐"
            : "Great reading effort today!"}
        </p>

        {/* Stars Celebration */}
        <div
          className={`flex justify-center items-center gap-3 mb-4 ${
            isPreReader ? "text-6xl" : "text-5xl"
          }`}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <span
              key={index}
              className={`transition-all transform ${
                index < stars
                  ? "scale-110 drop-shadow-md text-amber-400"
                  : "opacity-20 grayscale"
              }`}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Comprehension Quiz Score Pill */}
        {questions.length > 0 && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-4 font-switzer">
            <span>{isPreReader ? "🌱" : "🧠"}</span>
            {isPreReader ? "Story Fun" : "Comprehension"}: {correctAnswersCount} of{" "}
            {questions.length} correct
          </div>
        )}

        {/* Age Band Mode Badge */}
        <div className="mb-4">
          {isPreReader ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700 font-switzer">
              🌱 Pre-Reader Mode : No speed pressure, just fun!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[10px] font-bold text-sky-700 font-switzer">
              {ageBand === "emerging" ? "📖" : "🚀"}{" "}
              {ageBand === "emerging" ? "Emerging" : "Confident"} Reader Mode
            </span>
          )}
        </div>

        {/* Story Progress Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-xs font-bold text-gray-700 mb-8 block max-w-xs mx-auto font-switzer">
          <span>📖</span> {pagesRead} of {totalPages} pages read
        </div>

        {/* ─── Section 5: Stumbled Items Display ─── */}
        <div className="space-y-5 text-left mb-8 font-switzer">
          {/* Practice Words (Warm Gold - Tap to Hear) */}
          {practiceWords.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/50">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🟡</span>{" "}
                  {isPreReader ? "Words We Heard" : "Words to Practice"}
                </span>
                <span className="text-[10px] font-bold text-amber-700">
                  Tap to hear 🔊
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {practiceWords.map((item) => (
                  <button
                    key={item.word}
                    type="button"
                    onClick={() => handleTapToHear(item.display)}
                    className={`rounded-xl font-bold transition-all flex items-center gap-1.5 active:scale-95 border font-switzer ${
                      isPreReader ? "px-4 py-2.5 text-sm" : "px-3.5 py-1.5 text-xs"
                    } ${
                      activeSpeakingWord === item.display
                        ? "bg-amber-400 text-black border-amber-500 shadow-sm"
                        : "bg-white text-amber-950 border-amber-200 hover:bg-amber-100"
                    }`}
                  >
                    <span>{item.display}</span>
                    <span className="text-[10px] opacity-60">🔊</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Character & Place Names Met (Soft Purple - Quiet Badges) */}
          {characterNames.length > 0 && (
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/50">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🟣</span> Character & Place Names Met
                </span>
                <span className="text-[10px] font-bold text-purple-600">
                  People & Places
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {characterNames.map((item) => (
                  <div
                    key={item.word}
                    className={`rounded-xl font-bold bg-white text-purple-950 border border-purple-200/80 flex items-center gap-1.5 shadow-2xs font-switzer ${
                      isPreReader ? "px-4 py-2.5 text-sm" : "px-3 py-1.5 text-xs"
                    }`}
                  >
                    <span>{item.display}</span>
                    <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-md uppercase font-black tracking-wide">
                      Name
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 font-switzer">
          <Link
            href={`/kid/${child.id}`}
            className={`flex-1 rounded-2xl bg-gray-900 text-white font-black hover:bg-black transition-colors shadow-md text-center font-switzer ${
              isPreReader ? "py-4 px-6 text-sm" : "py-3.5 px-6 text-xs"
            }`}
          >
            Back to Dashboard
          </Link>
          <Link
            href="/who"
            className={`rounded-2xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors text-center font-switzer ${
              isPreReader ? "py-4 px-5 text-sm" : "py-3.5 px-5 text-xs"
            }`}
          >
            Switch Reader
          </Link>
        </div>
      </div>
    </main>
  );
}

// ─── Section 6: Suspense Wrapper Export ───

export default function SummaryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-switzer">
          <p className="text-gray-400 font-bold text-sm animate-pulse font-switzer">
            Loading summary...
          </p>
        </div>
      }
    >
      <SummaryContent />
    </Suspense>
  );
}