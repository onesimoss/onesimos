/**
 * Onesimos — Solo Spelling Game
 * =======================================
 * Encoding practice pulling from each child's real stumbled words.
 * Features 1-hint max limit per round, unassisted word mastery graduation,
 * 0.85x slower ElevenLabs audio, and daily free quota limits.
 *
 * Difficulty scaling (by child.reading_level):
 *   Level 1 (pre-reader)  : 3-letter words, 1 distractor, 1 hint max
 *   Level 2 (emerging)    : 3–4 letter words, 2 distractors, 1 hint max
 *   Level 3 (early)       : 4–5 letter words, 3 distractors, 1 hint max
 *   Level 4 (confident)   : 5–7 letter words, 4 distractors, 2 hints max
 *
 * @fonts Achiko (headings) + Switzer (body/UI)
 * @module app/kid/[childId]/spell/page
 */

"use client";

// ─── IMPORTS ────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  getRecentStumbledWords,
  speakWord,
  type StumbledWordCountItem,
} from "@/lib/stumbledWords";
import { getAvatarById } from "@/lib/avatars";
import type { ChildProfile } from "@/lib/children";
import { checkMonthlyStoryLimit } from "@/lib/sessionBudget";
import ParentGate from "@/components/ParentGate";

// ─── TYPES ──────────────────────────────────────────────────────────────────

interface SpellingWordItem {
  word: string;
  times_stumbled: number;
}

interface BankTile {
  id: number;
  letter: string;
  used: boolean;
}

interface SlotTile {
  bankId: number | null;
  letter: string | null;
}

type GamePhase =
  | "loading"
  | "intro"
  | "playing"
  | "correct"
  | "retry"
  | "complete";

// ─── CONSTANTS ──────────────────────────────────────────────────────────────

const ROUND_SIZE = 6;
const FREE_DAILY_ROUND_LIMIT = 2;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const CELEBRATION_MS = 1400;
const RETRY_MS = 1200;

/** Expanded 50+ Curriculum Words Per Level (Shuffled for non-repetitive play) */
const EXPANDED_FALLBACK_WORDS: Record<number, string[]> = {
  1: [
    "cat", "sun", "dog", "run", "big", "red", "hat", "cup", "box", "top",
    "pen", "pig", "bus", "mud", "bed", "net", "map", "bug", "hop", "wet",
    "fan", "pin", "fox", "log", "jam", "rug", "bat", "cot", "dig", "fit",
  ],
  2: [
    "jump", "frog", "kind", "play", "star", "tree", "milk", "nest", "sing", "book",
    "fish", "bird", "lamp", "hand", "fast", "slow", "duck", "park", "cold", "warm",
    "gold", "rain", "moon", "wind", "ship", "bell", "ring", "gift", "cake", "boat",
  ],
  3: [
    "brave", "smile", "water", "climb", "cloud", "green", "light", "clean", "story", "sweet",
    "house", "plant", "bread", "earth", "fruit", "happy", "river", "train", "ocean", "grass",
    "table", "chair", "music", "laugh", "bright", "dream", "heart", "voice", "grace", "trust",
  ],
  4: [
    "courage", "whisper", "journey", "explore", "shelter", "patient", "curious", "freedom", "wisdom", "balance",
    "harmony", "respect", "kindness", "gentle", "partner", "promise", "purpose", "treasure", "builder", "silence",
    "creature", "together", "forgive", "comfort", "glorious", "pathway", "triumph", "caring", "honor", "inspire",
  ],
};

const LEVEL_CONFIG: Record<
  number,
  {
    maxWordLen: number;
    distractors: number;
    maxHintsPerRound: number;
    label: string;
  }
> = {
  1: { maxWordLen: 3, distractors: 1, maxHintsPerRound: 1, label: "Letter Match" },
  2: { maxWordLen: 4, distractors: 2, maxHintsPerRound: 1, label: "Easy Spell" },
  3: { maxWordLen: 5, distractors: 3, maxHintsPerRound: 1, label: "Spell It" },
  4: { maxWordLen: 7, distractors: 4, maxHintsPerRound: 2, label: "Challenge" },
};

// ─── HELPERS ────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildBank(word: string, distractorCount: number): BankTile[] {
  const correct = word.toUpperCase().split("");
  const usedSet = new Set(correct);
  const distractors: string[] = [];

  while (distractors.length < distractorCount) {
    const r = ALPHABET[Math.floor(Math.random() * 26)];
    if (!usedSet.has(r)) {
      distractors.push(r);
      usedSet.add(r);
    }
  }

  const all = shuffle([...correct, ...distractors]);
  return all.map((letter, i) => ({ id: i, letter, used: false }));
}

/** Priority queue: Words stumbled 2+ times come first! */
function assembleRoundWords(
  stumbledItems: StumbledWordCountItem[],
  level: number
): SpellingWordItem[] {
  const cfg = LEVEL_CONFIG[level] ?? LEVEL_CONFIG[2];
  
  // High struggle priority words (stumbled 2+ times)
  const highPriority = shuffle(
    stumbledItems
      .filter((w) => w.word.length <= cfg.maxWordLen && w.count >= 2)
      .map((w) => ({ word: w.word.toLowerCase(), times_stumbled: w.count }))
  );

  // Single stumble words
  const normalStumbled = shuffle(
    stumbledItems
      .filter((w) => w.word.length <= cfg.maxWordLen && w.count < 2)
      .map((w) => ({ word: w.word.toLowerCase(), times_stumbled: w.count }))
  );

  const combined = [...highPriority, ...normalStumbled];

  if (combined.length >= ROUND_SIZE) {
    return combined.slice(0, ROUND_SIZE);
  }

  const pool = [...combined];
  const seen = new Set(pool.map((p) => p.word));

  const fallbackList = shuffle(
    EXPANDED_FALLBACK_WORDS[level] || EXPANDED_FALLBACK_WORDS[2]
  );
  for (const fallbackWord of fallbackList) {
    if (pool.length >= ROUND_SIZE) break;
    const lower = fallbackWord.toLowerCase();
    if (!seen.has(lower)) {
      pool.push({ word: lower, times_stumbled: 1 });
      seen.add(lower);
    }
  }

  return pool.slice(0, ROUND_SIZE);
}

function getDailySpellingRoundsCount(childId: string): number {
  if (typeof window === "undefined") return 0;
  const todayKey = `spelling_rounds_${childId}_${new Date().toISOString().slice(0, 10)}`;
  return Number(localStorage.getItem(todayKey) || "0");
}

function incrementDailySpellingRounds(childId: string): void {
  if (typeof window === "undefined") return;
  const todayKey = `spelling_rounds_${childId}_${new Date().toISOString().slice(0, 10)}`;
  const current = getDailySpellingRoundsCount(childId);
  localStorage.setItem(todayKey, String(current + 1));
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function SpellingGamePage(): JSX.Element {
  const params = useParams<{ childId: string }>();
  const router = useRouter();
  const childId = params.childId;

  // ── Core state ──
  const [phase, setPhase] = useState<GamePhase>("loading");
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [roundWords, setRoundWords] = useState<SpellingWordItem[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [stars, setStars] = useState(0);

  // Hint budget state (Max 1-2 per round)
  const [hintsRemaining, setHintsRemaining] = useState(1);
  const [usedHintOnCurrentWord, setUsedHintOnCurrentWord] = useState(false);

  // Free Tier Lock States
  const [isPaidPlan, setIsPaidPlan] = useState(false);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);

  // ── Per-word state ──
  const [bank, setBank] = useState<BankTile[]>([]);
  const [slots, setSlots] = useState<SlotTile[]>([]);
  const [hintSlotIndex, setHintSlotIndex] = useState<number | null>(null);

  // ── Derived ──
  const currentWord = roundWords[wordIndex];
  const level = child?.reading_level ?? 2;
  const cfg = LEVEL_CONFIG[level] ?? LEVEL_CONFIG[2];

  // ─── DATA FETCH ──────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    async function load(): Promise<void> {
      if (!childId) return;

      const { data: childData, error: childErr } = await supabase
        .from("children")
        .select("*")
        .eq("id", childId)
        .single();

      if (cancelled) return;

      if (childErr || !childData) {
        router.replace("/who");
        return;
      }

      const profile = childData as ChildProfile;
      setChild(profile);

      const usage = await checkMonthlyStoryLimit(profile.id);
      setIsPaidPlan(usage.isPaidPlan);

      const { data: words } = await getRecentStumbledWords(childId, 30);

      if (cancelled) return;

      const roundList = assembleRoundWords(words || [], profile.reading_level || 2);
      setRoundWords(roundList);
      setPhase("intro");
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [childId, router]);

  // ─── WORD SETUP ──────────────────────────────────────────────────────────

  const setupWord = useCallback(
    (word: string) => {
      const upper = word.toUpperCase();
      const newBank = buildBank(upper, cfg.distractors);
      const newSlots: SlotTile[] = upper.split("").map(() => ({
        bankId: null,
        letter: null,
      }));
      setBank(newBank);
      setSlots(newSlots);
      setHintSlotIndex(null);
      setUsedHintOnCurrentWord(false);

      // Speak word with 0.85x speed ElevenLabs
      setTimeout(() => void speakWord(word), 300);
    },
    [cfg]
  );

  useEffect(() => {
    if (phase === "playing" && currentWord) {
      setupWord(currentWord.word);
    }
  }, [phase, wordIndex, setupWord, currentWord]);

  // ─── START GAME ──────────────────────────────────────────────────────────

  const handleStartGame = () => {
    if (!child) return;

    if (!isPaidPlan) {
      const roundsToday = getDailySpellingRoundsCount(child.id);
      if (roundsToday >= FREE_DAILY_ROUND_LIMIT) {
        setLimitModalOpen(true);
        return;
      }
    }

    incrementDailySpellingRounds(child.id);
    setWordIndex(0);
    setStars(0);
    setHintsRemaining(cfg.maxHintsPerRound);
    setPhase("playing");
  };

  // ─── INTERACTIONS ────────────────────────────────────────────────────────

  function handleBankTap(tileId: number): void {
    if (phase !== "playing") return;

    const tile = bank.find((t) => t.id === tileId);
    if (!tile || tile.used) return;

    const nextEmpty = slots.findIndex((s) => s.bankId === null);
    if (nextEmpty === -1) return;

    const newBank = bank.map((t) =>
      t.id === tileId ? { ...t, used: true } : t
    );
    const newSlots = slots.map((s, i) =>
      i === nextEmpty ? { bankId: tileId, letter: tile.letter } : s
    );

    setBank(newBank);
    setSlots(newSlots);
    setHintSlotIndex(null);

    if (newSlots.every((s) => s.letter !== null)) {
      checkAnswer(newSlots);
    }
  }

  function handleSlotTap(slotIndex: number): void {
    if (phase !== "playing") return;

    const slot = slots[slotIndex];
    if (slot.bankId === null) return;

    setBank((prev) =>
      prev.map((t) =>
        t.id === slot.bankId ? { ...t, used: false } : t
      )
    );
    setSlots((prev) =>
      prev.map((s, i) =>
        i === slotIndex ? { bankId: null, letter: null } : s
      )
    );
  }

  async function checkAnswer(filledSlots: SlotTile[]): Promise<void> {
    if (!currentWord) return;
    const attempt = filledSlots.map((s) => s.letter).join("");
    const target = currentWord.word.toUpperCase();

    if (attempt === target) {
      setPhase("correct");
      setStars((prev) => prev + 1);

      // GRADUATION LOGIC: Mark word as MASTERED in Supabase ONLY IF NO HINTS WERE USED!
      if (!usedHintOnCurrentWord) {
        try {
          await supabase
            .from("stumbled_words")
            .update({ mastered: true, updated_at: new Date().toISOString() })
            .eq("child_id", childId)
            .eq("word", currentWord.word.toLowerCase());
        } catch {
          // Ignore fallback if table missing
        }
      }

      setTimeout(() => advanceWord(), CELEBRATION_MS);
    } else {
      setPhase("retry");
      setTimeout(() => {
        setupWord(currentWord.word);
        setPhase("playing");
      }, RETRY_MS);
    }
  }

  function advanceWord(): void {
    const next = wordIndex + 1;
    if (next >= roundWords.length) {
      setPhase("complete");
    } else {
      setWordIndex(next);
      setPhase("playing");
    }
  }

  function handleHint(): void {
    if (phase !== "playing" || !currentWord || hintsRemaining <= 0) return;

    const nextEmpty = slots.findIndex((s) => s.bankId === null);
    if (nextEmpty === -1) return;

    const neededLetter = currentWord.word.toUpperCase()[nextEmpty];
    const matchingTile = bank.find(
      (t) => t.letter === neededLetter && !t.used
    );

    if (matchingTile) {
      setHintsRemaining((h) => Math.max(0, h - 1));
      setUsedHintOnCurrentWord(true);
      setHintSlotIndex(nextEmpty);

      setTimeout(() => {
        handleBankTap(matchingTile.id);
        setHintSlotIndex(null);
      }, 800);
    }
  }

  function handleSkip(): void {
    advanceWord();
  }

  if (phase === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-amber-50/60 font-switzer">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-300 border-t-amber-600" />
          <p className="font-switzer font-bold text-lg text-amber-900">
            Getting your spelling round ready...
          </p>
        </div>
      </main>
    );
  }

  const avatar = getAvatarById(child?.avatar_id || "avatar-1");

  // ─── RENDER: INTRO ───────────────────────────────────────────────────────

  if (phase === "intro") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-amber-50/60 px-6 text-center font-switzer">
        {child && (
          <div
            className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white shadow-md overflow-hidden"
            style={{ backgroundColor: `${avatar.color}33` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar.imageUrl}
              alt={child.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <h1 className="font-achiko text-4xl text-amber-950">
          Spelling Time! ✏️
        </h1>
        <p className="max-w-sm font-switzer text-amber-800 text-sm font-medium">
          Let&apos;s practise spelling{" "}
          <strong className="text-amber-950 font-extrabold">{roundWords.length} practice words</strong>.
          Tap 🔊 to listen, then tap the letters!
        </p>
        <div className="flex gap-2 font-switzer">
          <span className="rounded-full bg-amber-100 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-900">
            Mode: {cfg.label}
          </span>
          <span className="rounded-full bg-amber-100 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-900">
            💡 {cfg.maxHintsPerRound} Hint Per Round
          </span>
        </div>
        <button
          type="button"
          onClick={handleStartGame}
          className="mt-2 rounded-2xl bg-amber-500 hover:bg-amber-600 px-10 py-4 font-achiko text-xl text-white shadow-md active:scale-95 transition-all font-switzer"
        >
          Start Spelling 🚀
        </button>

        {limitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 font-switzer">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-gray-100 font-switzer">
              <div className="text-4xl mb-3">🌟</div>
              <h3 className="font-achiko text-xl text-amber-900 mb-2">
                Spelling Goal Reached!
              </h3>
              <p className="text-xs text-gray-600 mb-6 leading-relaxed font-switzer">
                You completed today&apos;s <strong>{FREE_DAILY_ROUND_LIMIT} free spelling rounds</strong>! 
                Ask a parent to unlock unlimited daily spelling!
              </p>
              <div className="flex flex-col gap-2 font-switzer">
                <button
                  type="button"
                  onClick={() => {
                    setLimitModalOpen(false);
                    setGateOpen(true);
                  }}
                  className="w-full py-3 rounded-2xl bg-amber-500 text-white font-bold text-xs shadow-sm hover:bg-amber-600 font-switzer active:scale-95 transition-all"
                >
                  Ask Parent to Unlock ✨
                </button>
                <button
                  type="button"
                  onClick={() => setLimitModalOpen(false)}
                  className="w-full py-2.5 rounded-2xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 font-switzer"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}

        <ParentGate
          open={gateOpen}
          onClose={() => setGateOpen(false)}
          onSuccess={() => {
            setGateOpen(false);
            router.push("/parent/pricing");
          }}
        />
      </main>
    );
  }

  // ─── RENDER: COMPLETE ────────────────────────────────────────────────────

  if (phase === "complete") {
    const pct = Math.round((stars / roundWords.length) * 100);
    const emoji = pct >= 80 ? "🏆" : pct >= 50 ? "⭐" : "💪";
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-amber-50/60 px-6 text-center font-switzer">
        <span className="text-7xl">{emoji}</span>
        <h1 className="font-achiko text-3xl text-amber-950">
          Amazing, {child?.name ?? "Reader"}!
        </h1>
        <p className="font-switzer text-lg text-amber-800 font-medium">
          You spelled{" "}
          <strong className="text-amber-950 font-black">
            {stars} of {roundWords.length}
          </strong>{" "}
          words correctly!
        </p>
        <div className="flex gap-1.5 text-3xl">
          {Array.from({ length: roundWords.length }).map((_, i) => (
            <span key={i}>{i < stars ? "⭐" : "☆"}</span>
          ))}
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-3 font-switzer">
          <button
            type="button"
            onClick={() => {
              const nextWords = assembleRoundWords([], child?.reading_level || 2);
              setRoundWords(nextWords);
              setHintsRemaining(cfg.maxHintsPerRound);
              setPhase("intro");
            }}
            className="rounded-2xl bg-amber-500 hover:bg-amber-600 px-8 py-3.5 font-achiko text-base text-white shadow-md active:scale-95 transition-all"
          >
            Play Again 🔄
          </button>
          <button
            type="button"
            onClick={() => router.push(`/kid/${childId}`)}
            className="rounded-2xl border border-amber-300 bg-white hover:bg-amber-50 px-8 py-3.5 font-achiko text-base text-amber-900 shadow-2xs active:scale-95 transition-all"
          >
            Back Home 🏠
          </button>
        </div>
      </main>
    );
  }

  // ─── RENDER: MAIN GAME ───────────────────────────────────────────────────

  const targetWord = currentWord?.word.toUpperCase() ?? "";
  const allFilled = slots.every((s) => s.letter !== null);

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50/40 via-[#FDFBF7] to-amber-50/40 font-switzer pb-8">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto w-full font-switzer">
        <button
          type="button"
          onClick={() => router.push(`/kid/${childId}`)}
          aria-label="Back to home"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-gray-200 text-gray-700 shadow-2xs active:scale-90 font-switzer font-bold"
        >
          ←
        </button>

        {child && (
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-white shadow-xs overflow-hidden"
            style={{ backgroundColor: `${avatar.color}33` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar.imageUrl}
              alt={child.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-1.5 font-switzer font-extrabold text-base text-amber-950 bg-white/90 border border-amber-200 px-3 py-1 rounded-full shadow-2xs">
          <span>⭐</span>
          <span>
            {stars}/{roundWords.length}
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="max-w-2xl mx-auto w-full px-6 mb-4">
        <div className="h-2.5 overflow-hidden rounded-full bg-amber-100/80 border border-amber-200">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-500"
            style={{
              width: `${((wordIndex + (phase === "correct" ? 1 : 0)) / roundWords.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Game area */}
      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-6 max-w-2xl mx-auto w-full font-switzer">
        <button
          type="button"
          onClick={() => currentWord && void speakWord(currentWord.word)}
          className="flex items-center gap-2.5 rounded-2xl bg-white border-2 border-amber-300 px-7 py-3.5 font-switzer font-extrabold text-amber-950 shadow-sm hover:bg-amber-50 active:scale-95 transition-all"
          aria-label="Hear the word out loud"
        >
          <span className="text-2xl">🔊</span>
          <span className="text-base font-switzer">Hear Word Out Loud</span>
        </button>

        {phase === "correct" && (
          <div className="animate-bounce text-center">
            <span className="text-5xl">🎉</span>
            <p className="mt-2 font-achiko text-2xl text-emerald-700">
              Correct!
            </p>
          </div>
        )}
        {phase === "retry" && (
          <div className="text-center">
            <span className="text-5xl">💪</span>
            <p className="mt-2 font-achiko text-xl text-amber-800">
              Almost! Try again...
            </p>
          </div>
        )}

        {/* Letter slots */}
        <div className="flex flex-wrap justify-center gap-2">
          {slots.map((slot, i) => {
            const isHinted = hintSlotIndex === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSlotTap(i)}
                className={`
                  flex h-14 w-14 items-center justify-center rounded-2xl border-2
                  font-achiko text-2xl uppercase shadow-xs transition-all
                  ${
                    slot.letter
                      ? "border-amber-400 bg-amber-100/90 text-amber-950 font-black"
                      : "border-dashed border-amber-300 bg-white/80 text-transparent"
                  }
                  ${isHinted ? "animate-pulse border-emerald-400 bg-emerald-50" : ""}
                  ${phase === "retry" ? "animate-[shake_0.4s_ease-in-out]" : ""}
                  active:scale-90
                `}
              >
                {slot.letter ?? "_"}
              </button>
            );
          })}
        </div>

        {/* Letter bank */}
        <div className="flex flex-wrap justify-center gap-3">
          {bank.map((tile) => {
            const nextEmptyIdx = slots.findIndex((s) => s.bankId === null);
            const isHintTarget =
              hintSlotIndex !== null &&
              !tile.used &&
              currentWord &&
              nextEmptyIdx >= 0 &&
              tile.letter === targetWord[nextEmptyIdx];

            return (
              <button
                key={tile.id}
                type="button"
                onClick={() => handleBankTap(tile.id)}
                disabled={tile.used || phase !== "playing"}
                className={`
                  flex h-14 w-14 items-center justify-center rounded-2xl
                  font-achiko text-2xl uppercase shadow-sm transition-all
                  ${
                    tile.used
                      ? "bg-gray-100 text-gray-300 border border-gray-200 shadow-none opacity-40"
                      : "bg-white border border-amber-200 text-amber-950 hover:bg-amber-50 active:scale-90 font-black"
                  }
                  ${isHintTarget ? "ring-2 ring-emerald-400" : ""}
                `}
              >
                {tile.letter}
              </button>
            );
          })}
        </div>
      </section>

      {/* Bottom actions with Hint Budget */}
      <footer className="flex items-center justify-center gap-4 px-6 pb-8 pt-6 max-w-2xl mx-auto w-full font-switzer">
        <button
          type="button"
          onClick={handleHint}
          disabled={phase !== "playing" || allFilled || hintsRemaining <= 0}
          className="rounded-2xl bg-amber-100 border border-amber-300 px-6 py-3 font-switzer font-extrabold text-xs text-amber-950 hover:bg-amber-200 active:scale-95 disabled:opacity-40"
        >
          💡 Hint ({hintsRemaining} Left)
        </button>
        <button
          type="button"
          onClick={handleSkip}
          disabled={phase !== "playing"}
          className="rounded-2xl bg-white border border-gray-200 px-6 py-3 font-switzer font-bold text-xs text-gray-700 hover:bg-gray-50 active:scale-95 disabled:opacity-40"
        >
          ⏭ Skip Word
        </button>
      </footer>
    </main>
  );
}