/**
 * Onesimos — Solo Spelling Game
 * =======================================
 * Encoding practice pulling from each child's real stumbled words.
 * Features automatic curated level fallback words (so new kids can always play),
 * cross-device ElevenLabs + Supabase CDN audio playback, and level-scaled difficulty.
 *
 * Difficulty scaling (by child.reading_level):
 *   Level 1 (pre-reader)  : 3-letter words, 1 distractor, auto-hint after 8s
 *   Level 2 (emerging)    : 3–4 letter words, 2 distractors
 *   Level 3 (early)       : 4–5 letter words, 3 distractors
 *   Level 4 (confident)   : 5–7 letter words, 4 distractors
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

// ─── TYPES ──────────────────────────────────────────────────────────────────

interface SpellingWordItem {
  word: string;
  times_stumbled: number;
}

interface ChildProfile {
  id: string;
  name: string;
  reading_level: number;
  avatar_id?: string;
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
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const CELEBRATION_MS = 1400;
const RETRY_MS = 1200;

/** Curated age-appropriate practice words when Word Pocket is empty */
const FALLBACK_WORDS_BY_LEVEL: Record<number, string[]> = {
  1: ["cat", "sun", "dog", "run", "big", "red", "hat", "cup", "box", "top"],
  2: ["jump", "frog", "kind", "play", "star", "tree", "milk", "nest", "sing", "book"],
  3: ["brave", "smile", "water", "climb", "cloud", "green", "light", "clean", "story", "sweet"],
  4: ["courage", "whisper", "journey", "explore", "shelter", "patient", "curious", "freedom", "wisdom", "balance"],
};

/** Difficulty config per reading level */
const LEVEL_CONFIG: Record<
  number,
  {
    maxWordLen: number;
    distractors: number;
    autoHintMs: number;
    label: string;
  }
> = {
  1: {
    maxWordLen: 3,
    distractors: 1,
    autoHintMs: 8000,
    label: "Letter Match",
  },
  2: {
    maxWordLen: 4,
    distractors: 2,
    autoHintMs: 10000,
    label: "Easy Spell",
  },
  3: {
    maxWordLen: 5,
    distractors: 3,
    autoHintMs: 12000,
    label: "Spell It",
  },
  4: {
    maxWordLen: 7,
    distractors: 4,
    autoHintMs: 14000,
    label: "Challenge",
  },
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

/**
 * Builds round word list from stumbled words + level fallbacks if empty.
 */
function assembleRoundWords(
  stumbledItems: StumbledWordCountItem[],
  level: number
): SpellingWordItem[] {
  const cfg = LEVEL_CONFIG[level] ?? LEVEL_CONFIG[2];
  
  // 1. Filter stumbled words fitting this level
  const realStumbled: SpellingWordItem[] = stumbledItems
    .filter((w) => w.word.length <= cfg.maxWordLen)
    .map((w) => ({ word: w.word.toLowerCase(), times_stumbled: w.count }));

  // 2. If enough stumbled words exist, return top ones
  if (realStumbled.length >= ROUND_SIZE) {
    return realStumbled.slice(0, ROUND_SIZE);
  }

  // 3. Otherwise, blend stumbled words with curated level fallback words
  const pool = [...realStumbled];
  const seen = new Set(pool.map((p) => p.word));

  const fallbackList = FALLBACK_WORDS_BY_LEVEL[level] || FALLBACK_WORDS_BY_LEVEL[2];
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

  // ── Per-word state ──
  const [bank, setBank] = useState<BankTile[]>([]);
  const [slots, setSlots] = useState<SlotTile[]>([]);
  const [hintSlotIndex, setHintSlotIndex] = useState<number | null>(null);
  const autoHintRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Derived ──
  const currentWord = roundWords[wordIndex];
  const level = child?.reading_level ?? 2;
  const cfg = LEVEL_CONFIG[level] ?? LEVEL_CONFIG[2];

  // ─── DATA FETCH ──────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    async function load(): Promise<void> {
      // 1. Fetch child profile
      const { data: childData, error: childErr } = await supabase
        .from("children")
        .select("id, name, reading_level, avatar_id")
        .eq("id", childId)
        .single();

      if (cancelled || childErr || !childData) {
        if (!cancelled) router.replace("/who");
        return;
      }

      const profile: ChildProfile = {
        id: childData.id,
        name: childData.name,
        reading_level: childData.reading_level ?? 2,
        avatar_id: childData.avatar_id,
      };
      setChild(profile);

      // 2. Fetch stumbled words with automatic fallback support
      const { data: words } = await getRecentStumbledWords(childId, 30);

      if (cancelled) return;

      const roundList = assembleRoundWords(words || [], profile.reading_level);
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

      // Cross-device ElevenLabs + Supabase CDN Tap-to-Hear
      setTimeout(() => void speakWord(word), 300);

      if (autoHintRef.current) clearTimeout(autoHintRef.current);
      if (level <= 1) {
        autoHintRef.current = setTimeout(() => {
          setHintSlotIndex(0);
        }, cfg.autoHintMs);
      }
    },
    [cfg, level]
  );

  useEffect(() => {
    if (phase === "playing" && currentWord) {
      setupWord(currentWord.word);
    }
  }, [phase, wordIndex, setupWord, currentWord]);

  useEffect(() => {
    return () => {
      if (autoHintRef.current) clearTimeout(autoHintRef.current);
    };
  }, []);

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

  function checkAnswer(filledSlots: SlotTile[]): void {
    if (!currentWord) return;
    const attempt = filledSlots.map((s) => s.letter).join("");
    const target = currentWord.word.toUpperCase();

    if (attempt === target) {
      setPhase("correct");
      setStars((prev) => prev + 1);
      if (autoHintRef.current) clearTimeout(autoHintRef.current);

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
    if (phase !== "playing" || !currentWord) return;
    const nextEmpty = slots.findIndex((s) => s.bankId === null);
    if (nextEmpty === -1) return;

    const neededLetter = currentWord.word.toUpperCase()[nextEmpty];
    const matchingTile = bank.find(
      (t) => t.letter === neededLetter && !t.used
    );

    if (matchingTile) {
      setHintSlotIndex(nextEmpty);

      setTimeout(() => {
        handleBankTap(matchingTile.id);
        setHintSlotIndex(null);
      }, 900);
    }
  }

  function handleSkip(): void {
    if (autoHintRef.current) clearTimeout(autoHintRef.current);
    advanceWord();
  }

  // ─── RENDER: LOADING ─────────────────────────────────────────────────────

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

  const avatar = getAvatarById(child?.avatar_id);

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
        <p className="rounded-full bg-amber-100 border border-amber-200 px-4 py-1.5 font-switzer text-xs font-bold text-amber-900">
          Mode: {cfg.label}
        </p>
        <button
          type="button"
          onClick={() => {
            setWordIndex(0);
            setStars(0);
            setPhase("playing");
          }}
          className="mt-2 rounded-2xl bg-amber-500 hover:bg-amber-600 px-10 py-4 font-achiko text-xl text-white shadow-md active:scale-95 transition-all font-switzer"
        >
          Start Spelling 🚀
        </button>
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
              setWordIndex(0);
              setStars(0);
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

  // ─── RENDER: MAIN GAME (playing / correct / retry) ───────────────────────

  const targetWord = currentWord?.word.toUpperCase() ?? "";
  const allFilled = slots.every((s) => s.letter !== null);

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50/40 via-[#FDFBF7] to-amber-50/40 font-switzer pb-8">
      {/* ── Header ── */}
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

      {/* ── Progress bar ── */}
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

      {/* ── Game area ── */}
      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-6 max-w-2xl mx-auto w-full font-switzer">
        {/* Audio prompt with ElevenLabs / Deepgram Aura Cloud TTS */}
        <button
          type="button"
          onClick={() => currentWord && void speakWord(currentWord.word)}
          className="flex items-center gap-2.5 rounded-2xl bg-white border-2 border-amber-300 px-7 py-3.5 font-switzer font-extrabold text-amber-950 shadow-sm hover:bg-amber-50 active:scale-95 transition-all"
          aria-label="Hear the word out loud"
        >
          <span className="text-2xl">🔊</span>
          <span className="text-base font-switzer">Hear Word Out Loud</span>
        </button>

        {/* Feedback overlay */}
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
                aria-label={
                  slot.letter
                    ? `Remove letter ${slot.letter}`
                    : `Empty slot ${i + 1}`
                }
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
                aria-label={`Letter ${tile.letter}`}
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

      {/* ── Bottom actions ── */}
      <footer className="flex items-center justify-center gap-4 px-6 pb-8 pt-6 max-w-2xl mx-auto w-full font-switzer">
        <button
          type="button"
          onClick={handleHint}
          disabled={phase !== "playing" || allFilled}
          className="rounded-2xl bg-amber-100 border border-amber-300 px-6 py-3 font-switzer font-extrabold text-xs text-amber-950 hover:bg-amber-200 active:scale-95 disabled:opacity-40"
        >
          💡 Hint
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