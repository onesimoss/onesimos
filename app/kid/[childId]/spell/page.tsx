/**
 * Onesimos — Solo Spelling Game (Step F)
 * =======================================
 * Encoding practice pulling from each child's real stumbled words.
 *
 * Flow:
 *   1. Fetch non-mastered stumbled words from Supabase
 *   2. Select a round (up to ROUND_SIZE words, scaled by reading level)
 *   3. For each word: play audio → child taps letter bank → fill slots
 *   4. Celebrate correct, gently retry incorrect
 *   5. Summary screen with stars → option to replay or go home
 *
 * Difficulty scaling (by child.reading_level):
 *   Level 1 (pre-reader)  : 3-letter words, 1 distractor, auto-hint after 8s
 *   Level 2 (emerging)    : 3–4 letter words, 2 distractors
 *   Level 3 (early)       : 4–5 letter words, 3 distractors
 *   Level 4 (confident)   : 5–7 letter words, 4 distractors
 *
 * @module app/kid/[childId]/spell/page
 */

'use client';

// ─── IMPORTS ────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// ─── TYPES ──────────────────────────────────────────────────────────────────

/** Row shape from public.stumbled_words */
interface StumbledWordRow {
  word: string;
  times_stumbled: number;
  mastered: boolean;
}

/** Child profile (minimal fields needed for game) */
interface ChildProfile {
  id: string;
  name: string;
  reading_level: number;
  avatar: {
    color: string;
    imageUrl: string;
  };
}

/** A single letter tile in the bank */
interface BankTile {
  id: number;
  letter: string;
  used: boolean;
}

/** A single letter slot in the answer row */
interface SlotTile {
  bankId: number | null;
  letter: string | null;
}

/** Top-level game phase */
type GamePhase =
  | 'loading'
  | 'empty'
  | 'intro'
  | 'playing'
  | 'checking'
  | 'correct'
  | 'retry'
  | 'complete';

// ─── CONSTANTS ──────────────────────────────────────────────────────────────

const ROUND_SIZE = 6;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CELEBRATION_MS = 1400;
const RETRY_MS = 1200;
const AUTO_HINT_MS_BASE = 10000;

/** Difficulty config per reading level */
const LEVEL_CONFIG: Record<
  number,
  { maxWordLen: number; distractors: number; autoHintMs: number; label: string }
> = {
  1: { maxWordLen: 3, distractors: 1, autoHintMs: 8000, label: 'Letter Match' },
  2: { maxWordLen: 4, distractors: 2, autoHintMs: 10000, label: 'Easy Spell' },
  3: { maxWordLen: 5, distractors: 3, autoHintMs: 12000, label: 'Spell It' },
  4: { maxWordLen: 7, distractors: 4, autoHintMs: 14000, label: 'Challenge' },
};

// ─── HELPERS ────────────────────────────────────────────────────────────────

/**
 * Fisher-Yates shuffle (pure, returns new array).
 */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Build a scrambled letter bank for a given word.
 * Includes all correct letters + N random distractors.
 * Handles duplicate letters correctly (e.g. "SHEEP" → two E tiles).
 */
function buildBank(word: string, distractorCount: number): BankTile[] {
  const correct = word.toUpperCase().split('');
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
 * Safe speech synthesis with Fire OS / Silk fallback.
 * Mirrors the pattern in lib/stumbledWords.ts.
 */
function speakWord(word: string): void {
  if (typeof window === 'undefined') return;

  try {
    const synth = window.speechSynthesis;
    if (!synth) return;

    synth.cancel();
    const utter = new SpeechSynthesisUtterance(word);
    utter.rate = 0.75;
    utter.pitch = 1.1;

    // Fire OS fix: force a short delay before speak
    const timer = setTimeout(() => {
      synth.speak(utter);
    }, 50);

    utter.onend = () => clearTimeout(timer);
    utter.onerror = () => clearTimeout(timer);
  } catch {
    // Silent fallback — the word is still visible on screen
  }
}

/**
 * Pick N words from the stumbled list, prioritising most-stumbled.
 * Filters by max word length for the child's level.
 */
function pickRoundWords(
  words: StumbledWordRow[],
  level: number,
  count: number,
): StumbledWordRow[] {
  const cfg = LEVEL_CONFIG[level] ?? LEVEL_CONFIG[2];
  const eligible = words
    .filter((w) => w.word.length <= cfg.maxWordLen && !w.mastered)
    .sort((a, b) => b.times_stumbled - a.times_stumbled);

  // If not enough eligible, relax length constraint
  if (eligible.length < count) {
    const relaxed = words
      .filter((w) => !w.mastered)
      .sort((a, b) => b.times_stumbled - a.times_stumbled);
    return relaxed.slice(0, count);
  }

  return eligible.slice(0, count);
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function SpellingGamePage(): JSX.Element {
  const params = useParams<{ childId: string }>();
  const router = useRouter();
  const childId = params.childId;
  const supabase = useMemo(() => createClient(), []);

  // ── Core state ──
  const [phase, setPhase] = useState<GamePhase>('loading');
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [roundWords, setRoundWords] = useState<StumbledWordRow[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  // ── Per-word state ──
  const [bank, setBank] = useState<BankTile[]>([]);
  const [slots, setSlots] = useState<SlotTile[]>([]);
  const [hintSlotIndex, setHintSlotIndex] = useState<number | null>(null);
  const autoHintRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Derived ──
  const currentWord = roundWords[wordIndex];
  const level = child?.reading_level ?? 2;
  const cfg = LEVEL_CONFIG[level] ?? LEVEL_CONFIG[2];
  const isComplete = wordIndex >= roundWords.length;

  // ─── DATA FETCH ──────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    async function load(): Promise<void> {
      // 1. Fetch child profile
      const { data: childData, error: childErr } = await supabase
        .from('children')
        .select('id, name, reading_level, avatar_color, avatar_image_url')
        .eq('id', childId)
        .single();

      if (cancelled || childErr || !childData) {
        if (!cancelled) setPhase('empty');
        return;
      }

      const profile: ChildProfile = {
        id: childData.id,
        name: childData.name,
        reading_level: childData.reading_level ?? 2,
        avatar: {
          color: childData.avatar_color ?? '#F59E0B',
          imageUrl: childData.avatar_image_url ?? '',
        },
      };
      setChild(profile);

      // 2. Fetch stumbled words
      const { data: words, error: wordsErr } = await supabase
        .from('stumbled_words')
        .select('word, times_stumbled, mastered')
        .eq('child_id', childId)
        .eq('mastered', false)
        .order('times_stumbled', { ascending: false })
        .limit(40);

      if (cancelled) return;

      if (wordsErr || !words || words.length === 0) {
        setPhase('empty');
        return;
      }

      const picked = pickRoundWords(words, profile.reading_level, ROUND_SIZE);
      if (picked.length === 0) {
        setPhase('empty');
        return;
      }

      setRoundWords(picked);
      setPhase('intro');
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [childId, supabase]);

  // ─── WORD SETUP ──────────────────────────────────────────────────────────

  const setupWord = useCallback(
    (word: string) => {
      const upper = word.toUpperCase();
      const newBank = buildBank(upper, cfg.distractors);
      const newSlots: SlotTile[] = upper.split('').map(() => ({
        bankId: null,
        letter: null,
      }));
      setBank(newBank);
      setSlots(newSlots);
      setHintSlotIndex(null);
      setHintsUsed(0);

      // Auto-speak the word
      setTimeout(() => speakWord(word), 300);

      // Auto-hint timer (Level 1 only by default)
      if (autoHintRef.current) clearTimeout(autoHintRef.current);
      if (level <= 1) {
        autoHintRef.current = setTimeout(() => {
          setHintSlotIndex(0);
        }, cfg.autoHintMs);
      }
    },
    [cfg, level],
  );

  // Start first word when entering 'playing'
  useEffect(() => {
    if (phase === 'playing' && currentWord) {
      setupWord(currentWord.word);
    }
  }, [phase, wordIndex, currentWord, setupWord]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (autoHintRef.current) clearTimeout(autoHintRef.current);
    };
  }, []);

  // ─── INTERACTIONS ────────────────────────────────────────────────────────

  /** Child taps a letter in the bank → place in next empty slot */
  function handleBankTap(tileId: number): void {
    if (phase !== 'playing') return;

    const tile = bank.find((t) => t.id === tileId);
    if (!tile || tile.used) return;

    const nextEmpty = slots.findIndex((s) => s.bankId === null);
    if (nextEmpty === -1) return;

    setBank((prev) =>
      prev.map((t) => (t.id === tileId ? { ...t, used: true } : t)),
    );
    setSlots((prev) =>
      prev.map((s, i) =>
        i === nextEmpty ? { bankId: tileId, letter: tile.letter } : s,
      ),
    );
    setHintSlotIndex(null);

    // Check if all slots filled
    const newSlots = slots.map((s, i) =>
      i === nextEmpty ? { bankId: tileId, letter: tile.letter } : s,
    );
    if (newSlots.every((s) => s.letter !== null)) {
      checkAnswer(newSlots);
    }
  }

  /** Child taps a filled slot → return letter to bank */
  function handleSlotTap(slotIndex: number): void {
    if (phase !== 'playing') return;

    const slot = slots[slotIndex];
    if (!slot.bankId && slot.bankId !== 0) return;

    setBank((prev) =>
      prev.map((t) => (t.id === slot.bankId ? { ...t, used: false } : t)),
    );
    setSlots((prev) =>
      prev.map((s, i) =>
        i === slotIndex ? { bankId: null, letter: null } : s,
      ),
    );
  }

  /** Validate filled slots against the target word */
  function checkAnswer(filledSlots: SlotTile[]): void {
    if (!currentWord) return;
    const attempt = filledSlots.map((s) => s.letter).join('');
    const target = currentWord.word.toUpperCase();

    if (attempt === target) {
      setPhase('correct');
      setStars((prev) => prev + 1);
      if (autoHintRef.current) clearTimeout(autoHintRef.current);

      // Mark word as practiced in Supabase (fire-and-forget)
      void supabase
        .from('stumbled_words')
        .update({ mastered: true })
        .eq('child_id', childId)
        .eq('word', currentWord.word);

      setTimeout(() => advanceWord(), CELEBRATION_MS);
    } else {
      setPhase('retry');
      setTimeout(() => {
        setupWord(currentWord.word);
        setPhase('playing');
      }, RETRY_MS);
    }
  }

  /** Move to next word or finish */
  function advanceWord(): void {
    const next = wordIndex + 1;
    if (next >= roundWords.length) {
      setPhase('complete');
    } else {
      setWordIndex(next);
      setPhase('playing');
    }
  }

  /** Show a hint: pulse the correct letter for the first empty slot */
  function handleHint(): void {
    if (phase !== 'playing' || !currentWord) return;
    const nextEmpty = slots.findIndex((s) => s.bankId === null);
    if (nextEmpty === -1) return;

    const neededLetter = currentWord.word.toUpperCase()[nextEmpty];
    const matchingTile = bank.find(
      (t) => t.letter === neededLetter && !t.used,
    );

    if (matchingTile) {
      setHintSlotIndex(nextEmpty);
      setHintsUsed((h) => h + 1);

      // Auto-place after a brief pulse
      setTimeout(() => {
        handleBankTap(matchingTile.id);
        setHintSlotIndex(null);
      }, 900);
    }
  }

  /** Skip current word */
  function handleSkip(): void {
    if (autoHintRef.current) clearTimeout(autoHintRef.current);
    advanceWord();
  }

  // ─── RENDER HELPERS ──────────────────────────────────────────────────────

  /** Loading spinner */
  if (phase === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-orange-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-300 border-t-amber-600" />
          <p className="font-switzer text-lg text-amber-900">
            Getting your words ready…
          </p>
        </div>
      </main>
    );
  }

  /** Empty state — no stumbled words yet */
  if (phase === 'empty') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-orange-50 px-6 text-center">
        <span className="text-6xl">📖</span>
        <h1 className="font-achiko text-2xl text-amber-900">
          No tricky words yet!
        </h1>
        <p className="max-w-xs font-switzer text-amber-700">
          Read a story first and I&apos;ll save the words you find tricky. Then
          come back here to practise spelling them!
        </p>
        <button
          onClick={() => router.push(`/kid/${childId}`)}
          className="rounded-2xl bg-amber-500 px-8 py-4 font-achiko text-lg text-white shadow-lg active:scale-95"
        >
          Go Read a Story 📚
        </button>
      </main>
    );
  }

  /** Intro screen */
  if (phase === 'intro') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-orange-50 px-6 text-center">
        {child && (
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full text-3xl shadow-md"
            style={{ backgroundColor: child.avatar.color }}
          >
            {child.avatar.imageUrl ? (
              <img
                src={child.avatar.imageUrl}
                alt={child.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span>🌟</span>
            )}
          </div>
        )}
        <h1 className="font-achiko text-3xl text-amber-900">
          Spelling Time! ✏️
        </h1>
        <p className="max-w-sm font-switzer text-amber-700">
          Let&apos;s practise spelling{' '}
          <strong>{roundWords.length} tricky words</strong> from your stories.
          Listen, then tap the letters!
        </p>
        <p className="rounded-full bg-amber-100 px-4 py-1 font-switzer text-sm text-amber-600">
          Mode: {cfg.label}
        </p>
        <button
          onClick={() => {
            setWordIndex(0);
            setStars(0);
            setPhase('playing');
          }}
          className="mt-2 rounded-2xl bg-amber-500 px-10 py-5 font-achiko text-xl text-white shadow-lg active:scale-95"
        >
          Start! 🚀
        </button>
      </main>
    );
  }

  /** Completion screen */
  if (phase === 'complete') {
    const pct = Math.round((stars / roundWords.length) * 100);
    const emoji = pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '💪';
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-orange-50 px-6 text-center">
        <span className="text-7xl">{emoji}</span>
        <h1 className="font-achiko text-3xl text-amber-900">
          Amazing, {child?.name ?? 'Reader'}!
        </h1>
        <p className="font-switzer text-xl text-amber-700">
          You spelled{' '}
          <strong className="text-amber-600">
            {stars} / {roundWords.length}
          </strong>{' '}
          words!
        </p>
        <div className="flex gap-1 text-3xl">
          {Array.from({ length: roundWords.length }).map((_, i) => (
            <span key={i}>{i < stars ? '⭐' : '☆'}</span>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <button
            onClick={() => {
              setWordIndex(0);
              setStars(0);
              setPhase('intro');
            }}
            className="rounded-2xl bg-amber-500 px-8 py-4 font-achiko text-lg text-white shadow-lg active:scale-95"
          >
            Play Again 🔄
          </button>
          <button
            onClick={() => router.push(`/kid/${childId}`)}
            className="rounded-2xl border-2 border-amber-300 bg-white px-8 py-4 font-achiko text-lg text-amber-700 active:scale-95"
          >
            Back Home 🏠
          </button>
        </div>
      </main>
    );
  }

  // ─── MAIN GAME UI (playing / checking / correct / retry) ────────────────

  const targetWord = currentWord?.word.toUpperCase() ?? '';
  const allFilled = slots.every((s) => s.letter !== null);

  return (
    <main className="flex min-h-screen flex-col bg-orange-50">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => router.push(`/kid/${childId}`)}
          aria-label="Back to home"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-sm active:scale-90"
        >
          ←
        </button>

        {child && (
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm shadow-sm"
            style={{ backgroundColor: child.avatar.color }}
          >
            {child.avatar.imageUrl ? (
              <img
                src={child.avatar.imageUrl}
                alt={child.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span>🌟</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-1 font-switzer text-lg text-amber-700">
          <span>⭐</span>
          <span>
            {stars}/{roundWords.length}
          </span>
        </div>
      </header>

      {/* ── Progress bar ── */}
      <div className="mx-4 mb-2 h-2 overflow-hidden rounded-full bg-amber-100">
        <div
          className="h-full rounded-full bg-amber-400 transition-all duration-500"
          style={{
            width: `${((wordIndex + (phase === 'correct' ? 1 : 0)) / roundWords.length) * 100}%`,
          }}
        />
      </div>

      {/* ── Game area ── */}
      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-4">
        {/* Audio prompt */}
        <button
          onClick={() => currentWord && speakWord(currentWord.word)}
          className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-switzer text-lg text-amber-800 shadow-md active:scale-95"
          aria-label="Hear the word again"
        >
          <span className="text-2xl">🔊</span>
          Hear the word
        </button>

        {/* Feedback overlay */}
        {phase === 'correct' && (
          <div className="animate-bounce text-center">
            <span className="text-5xl">🎉</span>
            <p className="mt-2 font-achiko text-2xl text-green-600">
              Correct!
            </p>
          </div>
        )}
        {phase === 'retry' && (
          <div className="text-center">
            <span className="text-5xl">💪</span>
            <p className="mt-2 font-achiko text-xl text-amber-600">
              Almost! Try again…
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
                onClick={() => handleSlotTap(i)}
                aria-label={
                  slot.letter
                    ? `Remove letter ${slot.letter}`
                    : `Empty slot ${i + 1}`
                }
                className={`
                  flex h-14 w-14 items-center justify-center rounded-xl border-3
                  font-achiko text-2xl uppercase shadow-sm transition-all
                  ${
                    slot.letter
                      ? 'border-amber-400 bg-amber-100 text-amber-900'
                      : 'border-dashed border-amber-300 bg-white text-transparent'
                  }
                  ${isHinted ? 'animate-pulse border-green-400 bg-green-50' : ''}
                  ${phase === 'retry' ? 'animate-[shake_0.4s_ease-in-out]' : ''}
                  active:scale-90
                `}
              >
                {slot.letter ?? '_'}
              </button>
            );
          })}
        </div>

        {/* Letter bank */}
        <div className="flex flex-wrap justify-center gap-3">
          {bank.map((tile) => (
            <button
              key={tile.id}
              onClick={() => handleBankTap(tile.id)}
              disabled={tile.used || phase !== 'playing'}
              aria-label={`Letter ${tile.letter}`}
              className={`
                flex h-14 w-14 items-center justify-center rounded-xl
                font-achiko text-2xl uppercase shadow-md transition-all
                ${
                  tile.used
                    ? 'bg-gray-100 text-gray-300 shadow-none'
                    : 'bg-white text-amber-800 active:scale-90 active:bg-amber-50'
                }
                ${
                  hintSlotIndex !== null &&
                  !tile.used &&
                  currentWord &&
                  tile.letter ===
                    targetWord[slots.findIndex((s) => s.bankId === null)]
                    ? 'ring-2 ring-green-400'
                    : ''
                }
              `}
            >
              {tile.letter}
            </button>
          ))}
        </div>
      </section>

      {/* ── Bottom actions ── */}
      <footer className="flex items-center justify-center gap-4 px-4 pb-8 pt-4">
        <button
          onClick={handleHint}
          disabled={phase !== 'playing' || allFilled}
          className="rounded-xl bg-amber-100 px-5 py-3 font-switzer text-amber-700 active:scale-95 disabled:opacity-40"
        >
          💡 Hint
        </button>
        <button
          onClick={handleSkip}
          disabled={phase !== 'playing'}
          className="rounded-xl bg-white px-5 py-3 font-switzer text-amber-600 shadow-sm active:scale-95 disabled:opacity-40"
        >
          ⏭ Skip
        </button>
      </footer>

      {/* ── Inline keyframe for shake ── */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-6px);
          }
          40% {
            transform: translateX(6px);
          }
          60% {
            transform: translateX(-4px);
          }
          80% {
            transform: translateX(4px);
          }
        }
      `}</style>
    </main>
  );
}