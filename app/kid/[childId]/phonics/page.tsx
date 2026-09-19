/**
 * @file app/kid/[childId]/phonics/page.tsx
 * @description Phonics Sound Lab : Interactive phonics curriculum covering 7 essential groups
 * with interactive sound tiles, phonetic pronunciation mappings (phonemes over letter names),
 * physiological mouth guidelines, animated sample word cascades, and browser-cached discovery tracking.
 *
 * @module app/kid/[childId]/phonics/page
 * @fonts Logo (wordmark) + Achiko (headings) + Switzer (body/UI/stats)
 */

"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { getAvatarById } from "@/lib/avatars";
import type { ChildProfile } from "@/lib/children";
import { speakWord } from "@/lib/stumbledWords";

// ─── Section 1: Phonetic Speech Synthesis Mapping ───

/**
 * Phonetic spelling overrides so Text-to-Speech engines pronounce true phonemes
 * instead of spelling out letter names or reading acronyms.
 */
const PHONETIC_AUDIO_MAP: Record<string, string> = {
  // Single Letter Short Vowels & Consonants
  a: "ah",
  b: "buh",
  c: "cuh",
  d: "duh",
  e: "eh",
  f: "fff",
  g: "guh",
  h: "huh",
  i: "ih",
  j: "juh",
  k: "kuh",
  l: "lll",
  m: "mmm",
  n: "nnn",
  o: "aw",
  p: "puh",
  q: "kwah",
  r: "rrr",
  s: "sss",
  t: "tuh",
  u: "uh",
  v: "vvv",
  w: "wuh",
  x: "ks",
  y: "yuh",
  z: "zzz",

  // Digraphs & Blends
  sh: "shhh",
  ch: "chuh",
  th: "thhh",
  wh: "wuh",
  ph: "fff",
  ng: "ngg",
  nk: "nnk",

  // Long Vowels
  a_e: "ay",
  ee: "eee",
  i_e: "eye",
  o_e: "oh",
  u_e: "ooo",

  // R-Controlled
  ar: "ahr",
  er: "err",
  ir: "err",
  or: "or",
  ur: "err",

  // Diphthongs
  oi: "oy",
  oy: "oy",
  ou: "ow",
  ow: "ow",
  au: "aw",
  aw: "aw",

  // Wild Old Rules
  old: "ohld",
  ost: "ohst",
  ild: "eyeld",
  ind: "ined",
  olt: "ohlt",

  // Soft Consonants
  "soft c": "sss",
  "soft g": "juh",
};

// ─── Section 2: Curriculum Data Structure ───

interface SoundTile {
  sound: string;
  mouthHint: string;
  examples: string[];
}

interface PhonicsCategory {
  id: string;
  title: string;
  emoji: string;
  color: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  sounds: SoundTile[];
}

const PHONICS_CURRICULUM: PhonicsCategory[] = [
  {
    id: "letter-sounds",
    title: "Letter Sounds",
    emoji: "🔤",
    color: "from-amber-500 to-orange-500",
    border: "border-amber-200 hover:border-amber-300",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
    description: "The basic building blocks of reading from A to Z",
    sounds: [
      { sound: "a", mouthHint: "Open your mouth wide like taking a bite", examples: ["apple", "ant", "cat"] },
      { sound: "b", mouthHint: "Put your lips together and make a quick pop", examples: ["ball", "bat", "tub"] },
      { sound: "c", mouthHint: "Make a cool click at the back of your throat", examples: ["cat", "cup", "cap"] },
      { sound: "d", mouthHint: "Tap your tongue behind your front teeth", examples: ["dog", "dad", "bed"] },
      { sound: "e", mouthHint: "Pull back the corners of your mouth a little", examples: ["egg", "elbow", "net"] },
      { sound: "f", mouthHint: "Gently touch your top teeth to your bottom lip", examples: ["fox", "fan", "off"] },
      { sound: "g", mouthHint: "Make a gulp sound deep in your throat", examples: ["goat", "gum", "bag"] },
      { sound: "h", mouthHint: "Blow out warm air like a quiet sigh", examples: ["hat", "hen", "hop"] },
      { sound: "i", mouthHint: "Smile wide and show your beautiful teeth", examples: ["ink", "igloo", "pig"] },
      { sound: "j", mouthHint: "Push your lips out and make a fast vibration", examples: ["jam", "jug", "jet"] },
      { sound: "k", mouthHint: "Make a crisp click just like the letter C", examples: ["kid", "kite", "book"] },
      { sound: "l", mouthHint: "Touch the tip of your tongue behind your top teeth", examples: ["lion", "leg", "bell"] },
      { sound: "m", mouthHint: "Close your lips tight and hum through your nose", examples: ["man", "map", "ham"] },
      { sound: "n", mouthHint: "Open your lips and press your tongue tip flat up", examples: ["nut", "nest", "pin"] },
      { sound: "o", mouthHint: "Make your lips into a perfect circle shape", examples: ["octopus", "on", "hot"] },
      { sound: "p", mouthHint: "Press lips and release a fast burst of cool air", examples: ["pig", "pen", "cup"] },
      { sound: "q", mouthHint: "Make a quick kiss shape then slide it open", examples: ["queen", "quick", "quill"] },
      { sound: "r", mouthHint: "Curl your tongue back and roar like a lion", examples: ["red", "run", "car"] },
      { sound: "s", mouthHint: "Hiss air through your front teeth like a snake", examples: ["sun", "sit", "bus"] },
      { sound: "t", mouthHint: "Tap the roof of your mouth with a quick tick", examples: ["top", "ten", "cat"] },
      { sound: "u", mouthHint: "Relax your mouth and drop your chin down", examples: ["up", "umbrella", "tub"] },
      { sound: "v", mouthHint: "Bite your bottom lip and let your voice vibrate", examples: ["van", "vest", "wave"] },
      { sound: "w", mouthHint: "Pucker up your lips tight then stretch them wide", examples: ["wet", "wig", "win"] },
      { sound: "x", mouthHint: "Make a tiny hiss sound like a little snake sneeze", examples: ["box", "fox", "six"] },
      { sound: "y", mouthHint: "Keep your tongue high and push your cheeks back", examples: ["yoyo", "yellow", "yes"] },
      { sound: "z", mouthHint: "Buzz air through your front teeth like a honeybee", examples: ["zoo", "zebra", "buzz"] },
    ],
  },
  {
    id: "closed-syllables",
    title: "Closed Syllables",
    emoji: "📦",
    color: "from-sky-500 to-blue-500",
    border: "border-sky-200 hover:border-sky-300",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-800",
    description: "Short vowels capped by locking consonants",
    sounds: [
      { sound: "sh", mouthHint: "Put your finger to your lips: hush sound", examples: ["ship", "shell", "fish"] },
      { sound: "ch", mouthHint: "Make a sharp choo choo train sneeze", examples: ["chin", "chip", "rich"] },
      { sound: "th", mouthHint: "Bite your tongue tip gently and blow soft air", examples: ["thin", "this", "with"] },
      { sound: "wh", mouthHint: "Blow out air like whistling at a cloud", examples: ["whip", "when", "wheel"] },
      { sound: "ph", mouthHint: "Touch top teeth to bottom lip just like F", examples: ["phone", "photo", "graph"] },
      { sound: "ng", mouthHint: "Keep tongue back and hum through your nose", examples: ["sing", "ring", "song"] },
      { sound: "nk", mouthHint: "Make the nose hum then add a tiny click", examples: ["pink", "bank", "sunk"] },
    ],
  },
  {
    id: "long-vowels",
    title: "Long Vowels",
    emoji: "☀️",
    color: "from-emerald-500 to-teal-500",
    border: "border-emerald-200 hover:border-emerald-300",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
    description: "Vowels that proudly shout out their own name",
    sounds: [
      { sound: "a_e", mouthHint: "Smile wide then relax your jaw down", examples: ["make", "lake", "gate"] },
      { sound: "ee", mouthHint: "Stretch your lips wide like cheering", examples: ["see", "tree", "feet"] },
      { sound: "i_e", mouthHint: "Open wide then slide your jaw shut flat", examples: ["bike", "kite", "five"] },
      { sound: "o_e", mouthHint: "Pucker into a circle then make it tighter", examples: ["bone", "rope", "home"] },
      { sound: "u_e", mouthHint: "Make a small circle and say ooh", examples: ["cute", "tube", "mule"] },
    ],
  },
  {
    id: "r-controlled",
    title: "R-Controlled Vowels",
    emoji: "🤠",
    color: "from-purple-500 to-indigo-500",
    border: "border-purple-200 hover:border-purple-300",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-800",
    description: "The bossy letter R takes charge of vowels",
    sounds: [
      { sound: "ar", mouthHint: "Open wide like a pirate: say arrr", examples: ["car", "star", "park"] },
      { sound: "er", mouthHint: "Keep your tongue steady and growl a bit", examples: ["her", "sister", "term"] },
      { sound: "ir", mouthHint: "Growl exactly like the er sound", examples: ["bird", "girl", "shirt"] },
      { sound: "or", mouthHint: "Make an oh circle then curl your tongue", examples: ["fork", "horn", "corn"] },
      { sound: "ur", mouthHint: "Make the same steady growling sound", examples: ["turn", "burn", "surf"] },
    ],
  },
  {
    id: "diphthongs",
    title: "Diphthongs & Glides",
    emoji: "🤸",
    color: "from-pink-500 to-rose-500",
    border: "border-pink-200 hover:border-pink-300",
    badgeBg: "bg-pink-100",
    badgeText: "text-pink-800",
    description: "Sliding vowel sounds that jump from high to low",
    sounds: [
      { sound: "oi", mouthHint: "Start with a round oh and slide into ee", examples: ["coin", "soil", "join"] },
      { sound: "oy", mouthHint: "Slide from oh into a cheerful ee cheer", examples: ["boy", "toy", "joy"] },
      { sound: "ou", mouthHint: "Open very wide then make a tight ooh", examples: ["out", "house", "loud"] },
      { sound: "ow", mouthHint: "Make the same loud sliding ouch sound", examples: ["cow", "town", "brown"] },
      { sound: "au", mouthHint: "Drop your jaw and make a soft yawn sound", examples: ["haul", "vault", "launch"] },
      { sound: "aw", mouthHint: "Make the exact same yawn sound as au", examples: ["saw", "paw", "draw"] },
    ],
  },
  {
    id: "wild-old-rule",
    title: "Wild Old Rules",
    emoji: "🦁",
    color: "from-violet-500 to-fuchsia-500",
    border: "border-violet-200 hover:border-violet-300",
    badgeBg: "bg-violet-100",
    badgeText: "text-violet-800",
    description: "Special endings that stretch short vowels long",
    sounds: [
      { sound: "old", mouthHint: "Make a long oh then slide into a flat L", examples: ["bold", "cold", "gold"] },
      { sound: "ost", mouthHint: "A long oh sound followed by a quick hiss", examples: ["most", "post", "host"] },
      { sound: "ild", mouthHint: "Make a long eye sound then touch the roof", examples: ["wild", "child", "mild"] },
      { sound: "ind", mouthHint: "Long eye sound then drop your tongue down", examples: ["kind", "find", "mind"] },
      { sound: "olt", mouthHint: "Long oh followed by a sharp tongue tap", examples: ["bolt", "colt", "volt"] },
    ],
  },
  {
    id: "soft-consonants",
    title: "Soft Consonants",
    emoji: "☁️",
    color: "from-cyan-500 to-blue-500",
    border: "border-cyan-200 hover:border-cyan-300",
    badgeBg: "bg-cyan-100",
    badgeText: "text-cyan-800",
    description: "Consonants that swap clicks for gentle sighs",
    sounds: [
      { sound: "soft c", mouthHint: "Make a clean snake hiss when beside e, i, y", examples: ["city", "face", "race"] },
      { sound: "soft g", mouthHint: "Push lips out and vibrate when beside e, i, y", examples: ["gem", "giraffe", "cage"] },
    ],
  },
];

const TOTAL_SOUND_INVENTORY = PHONICS_CURRICULUM.reduce((acc, cat) => acc + cat.sounds.length, 0);

// ─── Section 3: Main Component ───

export default function PhonicsSoundLabPage(): JSX.Element {
  const params = useParams<{ childId: string }>();
  const childId = params.childId;
  const { user, loading } = useAuth();
  const router = useRouter();

  // Child Data & UI Navigation
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [fetching, setFetching] = useState(true);
  const [activeCategory, setActiveCategory] = useState<PhonicsCategory | null>(null);
  
  // Interaction and Gamification State
  const [discoveredSounds, setDiscoveredSounds] = useState<string[]>([]);
  const [currentlyPlayingSound, setCurrentlyPlayingSound] = useState<string | null>(null);
  const [currentlyPlayingWord, setCurrentlyPlayingWord] = useState<string | null>(null);

  // Auth Guard protection
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/parent/login");
    }
  }, [user, loading, router]);

  // Load Child Profile & Discovery Progress
  useEffect(() => {
    async function loadLabData(): Promise<void> {
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

      setChild(data as ChildProfile);

      try {
        const stored = localStorage.getItem(`onesimos_phonics_progress_${childId}`);
        if (stored) {
          setDiscoveredSounds(JSON.parse(stored));
        }
      } catch (err) {
        console.warn("[Phonics] Error loading stored achievements:", err);
      }

      setFetching(false);
    }

    void loadLabData();
  }, [user, childId, router]);

  const handleSaveDiscovery = (sound: string): void => {
    const cleanSound = sound.toLowerCase();
    if (discoveredSounds.includes(cleanSound)) return;

    const updated = [...discoveredSounds, cleanSound];
    setDiscoveredSounds(updated);

    try {
      localStorage.setItem(`onesimos_phonics_progress_${childId}`, JSON.stringify(updated));
    } catch (err) {
      console.warn("[Phonics] Failed to write achievements:", err);
    }
  };

  // Play Sound pronunciation using Phonetic Audio Map Override
  const handlePlaySound = async (soundItem: SoundTile): Promise<void> => {
    const key = soundItem.sound.toLowerCase();
    const spokenText = PHONETIC_AUDIO_MAP[key] || soundItem.sound;

    setCurrentlyPlayingSound(soundItem.sound);
    setCurrentlyPlayingWord(null);

    handleSaveDiscovery(soundItem.sound);

    await speakWord(spokenText);
    
    setTimeout(() => {
      setCurrentlyPlayingSound(null);
    }, 1800);
  };

  const handlePlayExampleWord = async (word: string): Promise<void> => {
    setCurrentlyPlayingWord(word);
    await speakWord(word);
    
    setTimeout(() => {
      setCurrentlyPlayingWord(null);
    }, 1200);
  };

  const categoryProgressMap = useMemo(() => {
    const results: Record<string, { count: number; percentage: number }> = {};
    
    PHONICS_CURRICULUM.forEach((cat) => {
      let discoveredCount = 0;
      cat.sounds.forEach((s) => {
        if (discoveredSounds.includes(s.sound.toLowerCase())) {
          discoveredCount += 1;
        }
      });
      const percent = cat.sounds.length > 0 ? (discoveredCount / cat.sounds.length) * 100 : 0;
      results[cat.id] = { count: discoveredCount, percentage: Math.round(percent) };
    });

    return results;
  }, [discoveredSounds]);

  if (loading || fetching || !child) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-switzer">
        <p className="font-bold text-gray-500 text-lg animate-pulse font-switzer">
          Waking up the Phonics Lab...
        </p>
      </main>
    );
  }

  const avatar = getAvatarById(child.avatar_id);
  const totalDiscoveredCount = discoveredSounds.length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FDFBF7] via-amber-50/20 to-sky-50/30 font-switzer pb-16">
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Top Header Section */}
        <div className="flex items-center justify-between mb-8 font-switzer">
          <Link
            href={`/kid/${child.id}`}
            className="text-xs font-bold text-gray-600 hover:text-gray-900 bg-white/90 px-4 py-2 rounded-full border border-gray-200 transition-colors shadow-2xs font-switzer flex items-center gap-1.5"
          >
            <span>🏠</span> Back to Home
          </Link>

          <span className="font-logo text-3xl md:text-4xl tracking-tight text-amber-900">
            Onesimos
          </span>

          <div className="flex items-center gap-2">
            <div
              className="w-8 h-10 rounded-xl overflow-hidden border border-white shadow-xs flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${avatar.color}33` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatar.imageUrl}
                alt={child.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-bold text-amber-950 font-switzer">
              {child.name}
            </span>
          </div>
        </div>

        {/* Gamified Achievement Progress Bar */}
        <div className="mb-8 rounded-3xl bg-white border border-gray-200 p-6 shadow-sm font-switzer">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <div>
              <h1 className="font-achiko text-3xl text-amber-950 flex items-center gap-2 leading-none">
                <span>🎵</span> Sound Lab Explorer
              </h1>
              <p className="text-xs text-gray-500 mt-1 font-switzer">
                Tap the magic buttons, mimic the sounds, and unlock achievements!
              </p>
            </div>
            <div className="shrink-0 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl text-center">
              <span className="block font-switzer font-black text-2xl text-amber-800 leading-none">
                {totalDiscoveredCount} / {TOTAL_SOUND_INVENTORY}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-amber-700 font-bold font-switzer">
                Sounds Explored
              </span>
            </div>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-4 relative overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 to-amber-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${(totalDiscoveredCount / TOTAL_SOUND_INVENTORY) * 100}%` }}
            />
          </div>
          {totalDiscoveredCount === TOTAL_SOUND_INVENTORY && (
            <p className="text-center text-xs font-bold text-emerald-700 mt-3 animate-bounce font-switzer">
              🌟 Stellar achievement, you completed the entire Sound Lab! 🌟
            </p>
          )}
        </div>

        {/* Categories Grid or Selected Category */}
        {!activeCategory ? (
          <section className="font-switzer">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-achiko text-2xl text-amber-950">
                Explore Categories
              </h2>
              <span className="text-xs text-gray-500 font-switzer">
                Select a room to begin
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PHONICS_CURRICULUM.map((category) => {
                const stats = categoryProgressMap[category.id] || { count: 0, percentage: 0 };
                
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`bg-white rounded-3xl p-5 border ${category.border} shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all text-left flex items-center justify-between gap-4 active:scale-[0.99] group font-switzer`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-3xl text-white shadow-xs shrink-0`}>
                        {category.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-switzer font-black text-lg text-gray-900 group-hover:text-amber-950 leading-tight">
                            {category.title}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 mr-2 leading-relaxed font-switzer">
                          {category.description}
                        </p>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${category.badgeBg} ${category.badgeText} mt-2 font-switzer`}>
                          {category.sounds.length} lessons
                        </span>
                      </div>
                    </div>

                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="18"
                          className="stroke-gray-100 fill-none"
                          strokeWidth="3.5"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="18"
                          className="stroke-amber-500 fill-none transition-all duration-500"
                          strokeWidth="3.5"
                          strokeDasharray={2 * Math.PI * 18}
                          strokeDashoffset={2 * Math.PI * 18 * (1 - stats.percentage / 100)}
                        />
                      </svg>
                      <span className="absolute text-[10px] font-black text-gray-700 font-switzer">
                        {stats.percentage}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-3xl border border-amber-200 shadow-sm p-6 sm:p-8 font-switzer">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-5 mb-6 gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory(null);
                    setCurrentlyPlayingSound(null);
                    setCurrentlyPlayingWord(null);
                  }}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 font-bold transition-all shrink-0 font-switzer text-base shadow-2xs"
                  aria-label="Back to categories"
                >
                  ◀
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{activeCategory.emoji}</span>
                    <h2 className="font-achiko text-2xl text-amber-950">
                      {activeCategory.title}
                    </h2>
                  </div>
                  <p className="text-xs text-gray-500 font-switzer">
                    {activeCategory.description}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-2xl flex items-center gap-2 font-switzer">
                <span className="text-xs font-bold text-gray-700 font-switzer">
                  Progress:
                </span>
                <span className="text-xs font-black text-amber-900 bg-white border border-gray-100 px-2 py-0.5 rounded-lg font-switzer">
                  {categoryProgressMap[activeCategory.id]?.count || 0} / {activeCategory.sounds.length}
                </span>
              </div>
            </div>

            <div className="mb-6 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/50 text-center text-xs text-amber-900 font-switzer">
              👈 Tap any sound tile to hear its phonics sound and see sample word cards pop up!
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeCategory.sounds.map((item) => {
                const isPlayingSound = currentlyPlayingSound === item.sound;
                const isDiscovered = discoveredSounds.includes(item.sound.toLowerCase());

                return (
                  <div
                    key={item.sound}
                    className={`rounded-2xl border p-4 transition-all duration-300 ${
                      isPlayingSound
                        ? "bg-amber-100/60 border-amber-400 shadow-md ring-2 ring-amber-400/20"
                        : "bg-white border-gray-200/80 hover:border-amber-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="text-left flex-1">
                        <button
                          type="button"
                          onClick={() => void handlePlaySound(item)}
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black font-switzer uppercase transition-all shadow-2xs active:scale-95 ${
                            isDiscovered
                              ? "bg-gradient-to-br from-amber-400 to-orange-400 text-white"
                              : "bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {item.sound.replace("_", " ")}
                        </button>
                      </div>
                      
                      {isDiscovered && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold uppercase font-switzer">
                          Explored ✔
                        </span>
                      )}
                    </div>

                    <div className="mb-3 text-left">
                      <p className="text-[10px] uppercase font-bold text-gray-400 font-switzer">
                        Mouth Shape Guide
                      </p>
                      <p className="text-xs font-semibold text-gray-700 leading-tight font-switzer mt-0.5">
                        {item.mouthHint}
                      </p>
                    </div>

                    <div className="border-t border-gray-100/70 pt-3">
                      <p className="text-[9px] uppercase font-bold text-gray-400 mb-1.5 text-left font-switzer">
                        Tap To Speak Words
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.examples.map((ex) => {
                          const isPlayingWord = currentlyPlayingWord === ex;
                          return (
                            <button
                              key={ex}
                              type="button"
                              onClick={() => void handlePlayExampleWord(ex)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-3xs flex items-center gap-1 font-switzer ${
                                isPlayingWord
                                  ? "bg-pink-500 border-pink-600 text-white scale-95"
                                  : "bg-[#FDFBF7] border border-amber-100 text-amber-900 hover:bg-amber-100"
                              }`}
                            >
                              <span>{ex}</span>
                              <span className="text-[9px] opacity-70">🔊</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory(null);
                  setCurrentlyPlayingSound(null);
                  setCurrentlyPlayingWord(null);
                }}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-all font-switzer"
              >
                Return to Categories
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}