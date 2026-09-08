export interface StoryPage {
  text: string;
  imageEmoji?: string;
}

export interface SampleStory {
  id: string;
  title: string;
  levelMin: number;
  levelMax: number;
  themes: string[];
  estimatedMinutes: number;
  coverEmoji: string;
  pages: StoryPage[];
}

export const SAMPLE_STORIES: SampleStory[] = [
  {
    id: "luna-star",
    title: "Luna and the Tiny Star",
    levelMin: 1,
    levelMax: 3,
    themes: ["space", "adventure"],
    estimatedMinutes: 5,
    coverEmoji: "\u{1F319}",
    pages: [
      { text: "Luna looked up at the night sky.", imageEmoji: "\u{1F30C}" },
      { text: "One tiny star was blinking at her.", imageEmoji: "\u{2B50}" },
      { text: "\"Hello,\" said Luna. \"Are you lost?\"", imageEmoji: "\u{1F467}" },
      { text: "The star glowed brighter.", imageEmoji: "\u{1F31F}" },
      { text: "Luna made a wish for the star to feel brave.", imageEmoji: "\u{1F64F}" },
      { text: "The tiny star smiled and danced home.", imageEmoji: "\u{1F30C}" },
      { text: "Luna waved goodnight. The sky felt warm.", imageEmoji: "\u{1F319}" },
    ],
  },
  {
    id: "dino-egg",
    title: "The Soft Green Egg",
    levelMin: 2,
    levelMax: 5,
    themes: ["dinosaurs", "animals", "adventure"],
    estimatedMinutes: 7,
    coverEmoji: "\u{1F995}",
    pages: [
      { text: "Tayo found a soft green egg near the river.", imageEmoji: "\u{1F95A}" },
      { text: "He sat beside it and waited.", imageEmoji: "\u{1F333}" },
      { text: "Crack! A tiny nose peeked out.", imageEmoji: "\u{1F313}" },
      { text: "It was a baby dinosaur!", imageEmoji: "\u{1F996}" },
      { text: "\"I will call you Dot,\" said Tayo.", imageEmoji: "\u{1F466}" },
      { text: "Dot liked leaves, mud, and gentle songs.", imageEmoji: "\u{1F33F}" },
      { text: "They walked home slowly under the sun.", imageEmoji: "\u{2600}\u{FE0F}" },
      { text: "Tayo knew a big friend could start small.", imageEmoji: "\u{1F49A}" },
    ],
  },
  {
    id: "market-day",
    title: "Market Day Surprise",
    levelMin: 3,
    levelMax: 6,
    themes: ["adventure", "animals"],
    estimatedMinutes: 8,
    coverEmoji: "\u{1F6D2}",
    pages: [
      {
        text: "Amaka held Mama's hand as they entered the busy market.",
        imageEmoji: "\u{1F33A}",
      },
      {
        text: "Red peppers. Yellow mangoes. Loud friendly voices.",
        imageEmoji: "\u{1F34D}",
      },
      {
        text: "\"We need tomatoes,\" said Mama.",
        imageEmoji: "\u{1F345}",
      },
      {
        text: "Amaka counted carefully: one, two, three.",
        imageEmoji: "\u{1F522}",
      },
      {
        text: "A small goat trotted past their feet!",
        imageEmoji: "\u{1F410}",
      },
      {
        text: "Amaka laughed and held the bag tight.",
        imageEmoji: "\u{1F601}",
      },
      {
        text: "On the way home, Mama said, \"You helped so well.\"",
        imageEmoji: "\u{1F9E0}",
      },
      {
        text: "Amaka felt proud. Market day was an adventure.",
        imageEmoji: "\u{1F3C6}",
      },
    ],
  },
  {
    id: "football-rain",
    title: "Football in the Rain",
    levelMin: 4,
    levelMax: 7,
    themes: ["football", "adventure"],
    estimatedMinutes: 8,
    coverEmoji: "\u{26BD}",
    pages: [
      {
        text: "Chike laced his boots and ran to the field.",
        imageEmoji: "\u{1F45F}",
      },
      {
        text: "Dark clouds gathered, but the game had to go on.",
        imageEmoji: "\u{26C8}\u{FE0F}",
      },
      {
        text: "The first drops fell. Slap! Slap! on the ball.",
        imageEmoji: "\u{1F4A7}",
      },
      {
        text: "Chike passed to his friend on the wing.",
        imageEmoji: "\u{1F3C3}",
      },
      {
        text: "A clean cross. Chike jumped and headed the ball.",
        imageEmoji: "\u{1F925}",
      },
      {
        text: "GOAL! The rain could not stop their joy.",
        imageEmoji: "\u{1F3C6}",
      },
      {
        text: "They walked home muddy, wet, and smiling.",
        imageEmoji: "\u{1F324}\u{FE0F}",
      },
    ],
  },
  {
    id: "forest-door",
    title: "The Door in the Forest",
    levelMin: 5,
    levelMax: 9,
    themes: ["fantasy", "adventure"],
    estimatedMinutes: 10,
    coverEmoji: "\u{1F9D9}",
    pages: [
      {
        text: "Behind the old iroko tree, Zainab found a wooden door.",
        imageEmoji: "\u{1F332}",
      },
      {
        text: "It had no handle, only a silver leaf.",
        imageEmoji: "\u{1F96C}",
      },
      {
        text: "When she touched the leaf, the door opened softly.",
        imageEmoji: "\u{1F6AA}",
      },
      {
        text: "Inside was a library floating on clouds.",
        imageEmoji: "\u{1F4DA}",
      },
      {
        text: "Books whispered stories she had never heard.",
        imageEmoji: "\u{1F4D6}",
      },
      {
        text: "One book glowed with her name on the cover.",
        imageEmoji: "\u{1F4A1}",
      },
      {
        text: "Zainab read one page and felt braver already.",
        imageEmoji: "\u{1F319}",
      },
      {
        text: "She stepped back through the door, carrying courage home.",
        imageEmoji: "\u{1F3E0}",
      },
    ],
  },
  {
    id: "red-ball",
    title: "The Red Ball",
    levelMin: 1,
    levelMax: 2,
    themes: ["adventure", "animals"],
    estimatedMinutes: 4,
    coverEmoji: "\u{1F534}",
    pages: [
      { text: "Sam had a red ball.", imageEmoji: "\u{1F534}" },
      { text: "The ball went hop hop hop.", imageEmoji: "\u{1F503}" },
      { text: "A puppy saw the ball.", imageEmoji: "\u{1F436}" },
      { text: "Sam and the puppy played.", imageEmoji: "\u{1F3A1}" },
      { text: "Then they sat and rested.", imageEmoji: "\u{1F319}" },
      { text: "What a fun day!", imageEmoji: "\u{1F60A}" },
    ],
  },
];

export function getStoryById(id: string): SampleStory | undefined {
  return SAMPLE_STORIES.find((s) => s.id === id);
}

export function getStoriesForChild(options: {
  readingLevel: number;
  interests: string[];
}): SampleStory[] {
  const { readingLevel, interests } = options;
  const interestSet = new Set(interests.map((i) => i.toLowerCase()));

  const scored = SAMPLE_STORIES.map((story) => {
    const levelOk =
      readingLevel >= story.levelMin && readingLevel <= story.levelMax + 1;
    const themeScore = story.themes.reduce(
      (sum, t) => sum + (interestSet.has(t) ? 2 : 0),
      0
    );
    const levelScore = levelOk ? 3 : Math.abs(readingLevel - story.levelMin) <= 2 ? 1 : 0;
    return { story, score: themeScore + levelScore };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.story);
}