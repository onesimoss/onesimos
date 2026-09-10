/**
 * @file lib/sampleStories.ts
 * @description Curated, level-graded story catalog for Onesimos (Ages 3–9, Levels 1–4)
 * with structured post-story comprehension questions (literal, inferential, vocabulary).
 *
 * @dependencies None
 */

// ─── Section 1: Types & Interfaces ───

export type QuestionType = "literal" | "inferential" | "vocabulary";

export interface ComprehensionQuestion {
  /** Unique question identifier */
  id: string;
  /** The question prompt displayed to the child */
  questionText: string;
  /** Multiple-choice options (3 choices for age-appropriate simplicity) */
  options: string[];
  /** Zero-based index of the correct option */
  correctIndex: number;
  /** Classification of cognitive comprehension skill tested */
  type: QuestionType;
  /** Gentle explanation shown after answering */
  explanation: string;
}

export interface StoryPage {
  /** Text content displayed on this story page */
  text: string;
  /** Cover or page emoji illustration clue */
  imageEmoji?: string;
  /** Optional custom illustration URL */
  imageUrl?: string;
}

export interface SampleStory {
  /** Unique story identifier slug */
  id: string;
  /** Story display title */
  title: string;
  /** Minimum reading level (1 to 4) */
  levelMin: number;
  /** Maximum reading level (1 to 4) */
  levelMax: number;
  /** Human-readable age group recommendation */
  targetAgeGroup: string;
  /** Theme tags used for interest matching */
  themes: string[];
  /** Estimated reading duration in minutes */
  estimatedMinutes: number;
  /** Emoji cover icon */
  coverEmoji: string;
  /** Ordered array of story pages */
  pages: StoryPage[];
  /** Post-story comprehension questions */
  questions: ComprehensionQuestion[];
}

// ─── Section 2: Story Catalog with Comprehension Questions ───

export const SAMPLE_STORIES: SampleStory[] = [
  // ── Level 1: Pre-Reader / Early Beginner (Ages 3–4) ──
  {
    id: "red-ball",
    title: "The Red Ball",
    levelMin: 1,
    levelMax: 1,
    targetAgeGroup: "Ages 3–4",
    themes: ["adventure", "animals"],
    estimatedMinutes: 3,
    coverEmoji: "🔴",
    pages: [
      { text: "Sam had a red ball.", imageEmoji: "🔴" },
      { text: "The ball went hop, hop, hop.", imageEmoji: "🔄" },
      { text: "A small puppy saw the ball.", imageEmoji: "🐶" },
      { text: "Sam and the puppy played together.", imageEmoji: "🎡" },
      { text: "Then they sat and rested under the tree.", imageEmoji: "🌙" },
      { text: "What a happy day!", imageEmoji: "😊" },
    ],
    questions: [
      {
        id: "red-ball-q1",
        questionText: "What color was Sam's ball?",
        options: ["Blue", "Red", "Yellow"],
        correctIndex: 1,
        type: "literal",
        explanation: "Sam had a bright red ball!",
      },
      {
        id: "red-ball-q2",
        questionText: "Who played with Sam?",
        options: ["A puppy", "A kitten", "A bird"],
        correctIndex: 0,
        type: "literal",
        explanation: "The small puppy saw the ball and played with Sam.",
      },
    ],
  },
  {
    id: "luna-star",
    title: "Luna and the Tiny Star",
    levelMin: 1,
    levelMax: 2,
    targetAgeGroup: "Ages 3–4",
    themes: ["space", "adventure"],
    estimatedMinutes: 4,
    coverEmoji: "🌙",
    pages: [
      { text: "Luna looked up at the night sky.", imageEmoji: "🌌" },
      { text: "One tiny star was blinking at her.", imageEmoji: "⭐" },
      { text: '"Hello," said Luna. "Are you lost?"', imageEmoji: "👧" },
      { text: "The star glowed brighter and brighter.", imageEmoji: "🌟" },
      { text: "Luna made a wish for the star to feel brave.", imageEmoji: "🙏" },
      { text: "The tiny star smiled and danced home.", imageEmoji: "🌌" },
      { text: "Luna waved goodnight. The sky felt warm.", imageEmoji: "🌙" },
    ],
    questions: [
      {
        id: "luna-q1",
        questionText: "What did Luna see in the night sky?",
        options: ["A red ball", "A tiny star", "A flying kite"],
        correctIndex: 1,
        type: "literal",
        explanation: "Luna saw a tiny blinking star in the sky.",
      },
      {
        id: "luna-q2",
        questionText: "What wish did Luna make for the star?",
        options: ["To feel brave", "To go fast", "To sleep"],
        correctIndex: 0,
        type: "inferential",
        explanation: "Luna wished for the star to feel brave so it could dance home.",
      },
    ],
  },

  // ── Level 2: Emerging Reader (Ages 5–6) ──
  {
    id: "dino-egg",
    title: "The Soft Green Egg",
    levelMin: 2,
    levelMax: 2,
    targetAgeGroup: "Ages 5–6",
    themes: ["dinosaurs", "animals", "adventure"],
    estimatedMinutes: 5,
    coverEmoji: "🦕",
    pages: [
      { text: "Tayo found a soft green egg near the river.", imageEmoji: "🥚" },
      { text: "He sat beside the egg and waited quietly.", imageEmoji: "🌳" },
      { text: "Crack! A tiny green nose peeked out.", imageEmoji: "🌖" },
      { text: "It was a friendly baby dinosaur!", imageEmoji: "🦖" },
      { text: '"I will call you Dot," said Tayo with a smile.', imageEmoji: "👦" },
      { text: "Dot liked green leaves, mud, and gentle songs.", imageEmoji: "🌿" },
      { text: "They walked home slowly under the bright sun.", imageEmoji: "☀️" },
      { text: "Tayo knew a big friendship could start small.", imageEmoji: "💚" },
    ],
    questions: [
      {
        id: "dino-q1",
        questionText: "Where did Tayo find the green egg?",
        options: ["In his bedroom", "Near the river", "On a bus"],
        correctIndex: 1,
        type: "literal",
        explanation: "Tayo found the soft green egg near the river.",
      },
      {
        id: "dino-q2",
        questionText: "What hatched out of the egg?",
        options: ["A baby dinosaur", "A small bird", "A tiny fish"],
        correctIndex: 0,
        type: "literal",
        explanation: "Crack! A friendly baby dinosaur hatched out.",
      },
      {
        id: "dino-q3",
        questionText: "What does 'gentle' mean when Tayo sang songs?",
        options: ["Loud and noisy", "Soft and kind", "Fast and hard"],
        correctIndex: 1,
        type: "vocabulary",
        explanation: "Gentle means soft, quiet, and kind.",
      },
    ],
  },
  {
    id: "bisi-kite",
    title: "Bisi's Bright Red Kite",
    levelMin: 2,
    levelMax: 3,
    targetAgeGroup: "Ages 5–6",
    themes: ["adventure", "family"],
    estimatedMinutes: 5,
    coverEmoji: "🪁",
    pages: [
      { text: "Bisi held her new kite by the long string.", imageEmoji: "👧" },
      { text: "The warm wind blew across the green field.", imageEmoji: "🍃" },
      { text: "Up, up, up went the red kite into the blue sky!", imageEmoji: "🪁" },
      { text: "It danced higher than the banana trees.", imageEmoji: "🌴" },
      { text: "Bisi laughed as her brother clapped his hands.", imageEmoji: "👏" },
      { text: "The sky was full of color and happy wind.", imageEmoji: "🌈" },
    ],
    questions: [
      {
        id: "bisi-q1",
        questionText: "What made Bisi's kite fly high?",
        options: ["The warm wind", "Rain drops", "Heavy stones"],
        correctIndex: 0,
        type: "literal",
        explanation: "The warm wind blew across the field and lifted the kite.",
      },
      {
        id: "bisi-q2",
        questionText: "How did Bisi feel when the kite flew?",
        options: ["Sad", "Happy and excited", "Scared"],
        correctIndex: 1,
        type: "inferential",
        explanation: "Bisi laughed as her red kite danced higher than the trees.",
      },
    ],
  },

  // ── Level 3: Developing Reader (Ages 7–8) ──
  {
    id: "market-day",
    title: "Market Day Surprise",
    levelMin: 3,
    levelMax: 3,
    targetAgeGroup: "Ages 7–8",
    themes: ["adventure", "culture", "family"],
    estimatedMinutes: 7,
    coverEmoji: "🛒",
    pages: [
      {
        text: "Amaka held Mama's hand tightly as they walked into the busy market.",
        imageEmoji: "🌺",
      },
      {
        text: "Red peppers, yellow mangoes, and sweet fried plantains filled the stalls.",
        imageEmoji: "🍍",
      },
      {
        text: '"We need six ripe tomatoes for dinner," said Mama.',
        imageEmoji: "🍅",
      },
      {
        text: "Amaka counted carefully into the woven basket: one, two, three, four, five, six.",
        imageEmoji: "🔢",
      },
      {
        text: "Suddenly, a playful little goat trotted past their feet and bleated loudly!",
        imageEmoji: "🐐",
      },
      {
        text: "Amaka laughed out loud and held her basket safely.",
        imageEmoji: "😁",
      },
      {
        text: 'On the walk home, Mama smiled and said, "You were a wonderful helper today."',
        imageEmoji: "🧠",
      },
      {
        text: "Amaka felt proud. Every market day was a grand new adventure.",
        imageEmoji: "🏆",
      },
    ],
    questions: [
      {
        id: "market-q1",
        questionText: "How many tomatoes did Mama and Amaka need?",
        options: ["Three", "Six", "Ten"],
        correctIndex: 1,
        type: "literal",
        explanation: "Mama said they needed six ripe tomatoes for dinner.",
      },
      {
        id: "market-q2",
        questionText: "What animal trotted past their feet in the market?",
        options: ["A little goat", "A big dog", "A small cat"],
        correctIndex: 0,
        type: "literal",
        explanation: "A playful little goat trotted past their feet!",
      },
      {
        id: "market-q3",
        questionText: "Why did Amaka feel proud on the walk home?",
        options: [
          "She ran very fast",
          "She helped Mama carefully at the market",
          "She bought a toy",
        ],
        correctIndex: 1,
        type: "inferential",
        explanation: "Amaka felt proud because Mama praised her for being a wonderful helper.",
      },
    ],
  },
  {
    id: "football-rain",
    title: "Football in the Rain",
    levelMin: 3,
    levelMax: 4,
    targetAgeGroup: "Ages 7–8",
    themes: ["football", "sports", "adventure"],
    estimatedMinutes: 7,
    coverEmoji: "⚽",
    pages: [
      {
        text: "Chike laced his bright boots and hurried out to the dusty field.",
        imageEmoji: "👟",
      },
      {
        text: "Dark gray clouds gathered overhead, but the match had to go on.",
        imageEmoji: "⛈️",
      },
      {
        text: "The first raindrops began to fall. Slap! Slap! against the leather ball.",
        imageEmoji: "💧",
      },
      {
        text: "Chike dribbled past two defenders and passed cleanly to the wing.",
        imageEmoji: "🏃",
      },
      {
        text: "A high cross floated into the box. Chike leaped high and headed the ball!",
        imageEmoji: "⚽",
      },
      {
        text: "GOAL! The roaring thunder could not match the team's loud cheer.",
        imageEmoji: "🏆",
      },
      {
        text: "They walked back home muddy, soaked, and beaming with pride.",
        imageEmoji: "🌤️",
      },
    ],
    questions: [
      {
        id: "football-q1",
        questionText: "What happened to the weather during the match?",
        options: ["It became very hot", "It started raining", "It started snowing"],
        correctIndex: 1,
        type: "literal",
        explanation: "First raindrops began to fall as dark gray clouds gathered.",
      },
      {
        id: "football-q2",
        questionText: "How did Chike score the goal?",
        options: ["He kicked it from far", "He headed a high cross", "The goalkeeper missed"],
        correctIndex: 1,
        type: "literal",
        explanation: "Chike leaped high and headed the ball into the goal!",
      },
    ],
  },

  // ── Level 4: Confident Reader (Age 9) ──
  {
    id: "iroko-tree",
    title: "The Mystery of the Old Iroko",
    levelMin: 4,
    levelMax: 4,
    targetAgeGroup: "Age 9",
    themes: ["mystery", "fantasy", "adventure"],
    estimatedMinutes: 9,
    coverEmoji: "🌳",
    pages: [
      {
        text: "Deep in the quiet forest behind grandmother's house stood the ancient iroko tree.",
        imageEmoji: "🌲",
      },
      {
        text: "Zainab noticed a carved wooden door tucked between two giant roots.",
        imageEmoji: "🚪",
      },
      {
        text: "The door had no handle, only a shimmering silver leaf embedded in the wood.",
        imageEmoji: "🥬",
      },
      {
        text: "When Zainab gently pressed the leaf, the door swung open without a sound.",
        imageEmoji: "✨",
      },
      {
        text: "Inside was a magnificent room filled with floating books and glowing lanterns.",
        imageEmoji: "📚",
      },
      {
        text: "Soft whispers filled the air as the pages turned by themselves in the gentle breeze.",
        imageEmoji: "📖",
      },
      {
        text: "One special book floated down into her hands. Its cover bore her own name in gold.",
        imageEmoji: "💡",
      },
      {
        text: "Zainab read the first page and realized that bravery is a story you write every day.",
        imageEmoji: "🌙",
      },
      {
        text: "She closed the book gently and stepped back out, carrying wisdom in her heart.",
        imageEmoji: "🏡",
      },
    ],
    questions: [
      {
        id: "iroko-q1",
        questionText: "What was embedded in the wooden door instead of a handle?",
        options: ["A golden key", "A silver leaf", "A bronze coin"],
        correctIndex: 1,
        type: "literal",
        explanation: "The door had no handle, only a shimmering silver leaf.",
      },
      {
        id: "iroko-q2",
        questionText: "What lesson did Zainab learn from the floating book?",
        options: [
          "Trees grow tall",
          "Bravery is a story you write every day",
          "Doors are made of wood",
        ],
        correctIndex: 1,
        type: "inferential",
        explanation: "Zainab realized that bravery is a story you write every day.",
      },
      {
        id: "iroko-q3",
        questionText: "What does 'ancient' mean when describing the iroko tree?",
        options: ["Very young", "Very old", "Very small"],
        correctIndex: 1,
        type: "vocabulary",
        explanation: "Ancient means extremely old, having lived for many years.",
      },
    ],
  },
  {
    id: "river-courage",
    title: "Zainab and the Whispering River",
    levelMin: 4,
    levelMax: 4,
    targetAgeGroup: "Age 9",
    themes: ["adventure", "animals", "courage"],
    estimatedMinutes: 9,
    coverEmoji: "🌊",
    pages: [
      {
        text: "The morning mist hung low over the river as the fishermen prepared their canoes.",
        imageEmoji: "🛶",
      },
      {
        text: "Zainab listened carefully to the water rushing over smooth river stones.",
        imageEmoji: "💧",
      },
      {
        text: "A stranded baby crane fluttered its injured wing near the reed bank.",
        imageEmoji: "🦩",
      },
      {
        text: "Zainab waded cautiously into the cool current, keeping her eyes fixed on the bird.",
        imageEmoji: "🌊",
      },
      {
        text: "With gentle hands and soft words, she wrapped the bird in her warm cloth.",
        imageEmoji: "🕊️",
      },
      {
        text: "Her grandfather smiled warmly from the bank. 'True courage is quiet and kind,' he said.",
        imageEmoji: "👴",
      },
    ],
    questions: [
      {
        id: "river-q1",
        questionText: "What animal needed help near the river bank?",
        options: ["A stranded baby crane", "A lost dog", "A trapped fish"],
        correctIndex: 0,
        type: "literal",
        explanation: "A stranded baby crane fluttered its injured wing near the reed bank.",
      },
      {
        id: "river-q2",
        questionText: "What did Grandfather say true courage is?",
        options: [
          "Loud and strong",
          "Quiet and kind",
          "Fast and brave",
        ],
        correctIndex: 1,
        type: "inferential",
        explanation: "Grandfather told Zainab that true courage is quiet and kind.",
      },
    ],
  },
];

// ─── Section 3: Helper Functions & Adaptive Level Matching ───

/**
 * Retrieves a single story by its unique ID slug.
 *
 * @param id - Story identifier slug
 * @returns SampleStory object or undefined if not found
 */
export function getStoryById(id: string): SampleStory | undefined {
  return SAMPLE_STORIES.find((story) => story.id === id);
}

/**
 * Adaptive story selection engine. Filters and ranks stories for a child profile
 * based on their exact reading level (1–4) and interest preferences.
 *
 * @param options - Object containing readingLevel (1–4) and child interest tags
 * @returns Array of SampleStory objects ranked by fit score (highest fit first)
 */
export function getStoriesForChild(options: {
  readingLevel: number;
  interests: string[];
}): SampleStory[] {
  const { readingLevel = 2, interests = [] } = options;
  const normalizedInterests = new Set(interests.map((i) => i.toLowerCase().trim()));

  const scoredStories = SAMPLE_STORIES.map((story) => {
    // 1. Evaluate Level Fit
    const isExactLevel = readingLevel >= story.levelMin && readingLevel <= story.levelMax;
    const isAdjacentLevel =
      Math.abs(readingLevel - story.levelMin) === 1 ||
      Math.abs(readingLevel - story.levelMax) === 1;

    // Strict Filter: Never serve stories that are > 1 level away from child's capability
    if (!isExactLevel && !isAdjacentLevel) {
      return { story, score: 0 };
    }

    let levelScore = 0;
    if (isExactLevel) {
      levelScore = 10;
    } else if (isAdjacentLevel) {
      levelScore = 4;
    }

    // 2. Evaluate Theme Interest Fit
    const themeScore = story.themes.reduce((sum, theme) => {
      return sum + (normalizedInterests.has(theme.toLowerCase()) ? 3 : 0);
    }, 0);

    return {
      story,
      score: levelScore + themeScore,
    };
  });

  return scoredStories
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.story);
}git add lib/sampleStories.ts
git commit -m "feat(step-g): add structured comprehension questions (literal, inferential, vocabulary) to story catalog"
git push origin main