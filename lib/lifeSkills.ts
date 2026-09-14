/**
 * Onesimos — 25 Virtues & Practical Life Skills Framework
 * =================================────────────────=========
 * Character building, emotional intelligence, personal safety,
 * and real-world independence integrated directly into story generation.
 *
 * Source: 25 Core Virtues & Everyday Independence Framework
 *
 * @module lib/lifeSkills
 */

export type LifeSkillCategory =
  | "independence"
  | "money_skills"
  | "safety"
  | "emotional_skills"
  | "social_thinking";

export interface LifeSkill {
  id: number;
  category: LifeSkillCategory;
  categoryTitle: string;
  title: string;
  description: string;
  emoji: string;
  keyMoralLesson: string;
}

export const LIFE_SKILLS: LifeSkill[] = [
  // ── 1. EVERYDAY INDEPENDENCE ─────────────────────────────────────────────
  {
    id: 1,
    category: "independence",
    categoryTitle: "Everyday Independence",
    title: "Personal Hygiene",
    description: "Manage everyday hygiene and grooming independently.",
    emoji: "🧼",
    keyMoralLesson: "Taking care of your body builds health and self-respect.",
  },
  {
    id: 2,
    category: "independence",
    categoryTitle: "Everyday Independence",
    title: "Basic Cooking & Snack Prep",
    description: "Prepare simple healthy snacks or meals safely.",
    emoji: "🍳",
    keyMoralLesson: "patience and care in the kitchen make you helpful and capable.",
  },
  {
    id: 3,
    category: "independence",
    categoryTitle: "Everyday Independence",
    title: "Household Chores",
    description: "Clean up, organize space, and contribute at home.",
    emoji: "🧹",
    keyMoralLesson: "A tidy room brings a calm mind and helps the whole family.",
  },
  {
    id: 4,
    category: "independence",
    categoryTitle: "Everyday Independence",
    title: "Laundry Basics",
    description: "Sort, fold, and care for belongings and clothes.",
    emoji: "🧺",
    keyMoralLesson: "Taking care of clothes shows gratitude for what you have.",
  },
  {
    id: 5,
    category: "independence",
    categoryTitle: "Everyday Independence",
    title: "Taking Care of Belongings",
    description: "Pack own bag and keep track of personal things.",
    emoji: "🎒",
    keyMoralLesson: "Responsibility starts with looking after your own things.",
  },

  // ── 2. MONEY & REAL-WORLD SKILLS ─────────────────────────────────────────
  {
    id: 6,
    category: "money_skills",
    categoryTitle: "Money & Real-World Skills",
    title: "Money Basics",
    description: "Understand earning, saving, spending, needs, and wants.",
    emoji: "🪙",
    keyMoralLesson: "Saving money wisely helps you achieve big goals later.",
  },
  {
    id: 7,
    category: "money_skills",
    categoryTitle: "Money & Real-World Skills",
    title: "Paying Independently",
    description: "Handle cash, check change, and understand safe transactions.",
    emoji: "🏪",
    keyMoralLesson: "Honesty and accuracy in small transactions build trust.",
  },
  {
    id: 8,
    category: "money_skills",
    categoryTitle: "Money & Real-World Skills",
    title: "Time Management",
    description: "Plan schoolwork, activities, play, and responsibilities.",
    emoji: "⏰",
    keyMoralLesson: "Honouring your time makes space for both work and joy.",
  },
  {
    id: 9,
    category: "money_skills",
    categoryTitle: "Money & Real-World Skills",
    title: "Navigation & Landmarks",
    description: "Follow directions, recognize landmarks, and read basic maps.",
    emoji: "🗺️",
    keyMoralLesson: "Paying attention to your surroundings keeps you safe.",
  },
  {
    id: 10,
    category: "money_skills",
    categoryTitle: "Money & Real-World Skills",
    title: "Table & Social Manners",
    description: "Behave politely while eating, visiting, and in public spaces.",
    emoji: "🍽️",
    keyMoralLesson: "Good manners show respect and make everyone feel welcome.",
  },

  // ── 3. SAFETY SKILLS ─────────────────────────────────────────────────────
  {
    id: 11,
    category: "safety",
    categoryTitle: "Safety Skills",
    title: "Road Safety",
    description: "Cross roads safely and understand basic traffic rules.",
    emoji: "🚦",
    keyMoralLesson: "Stopping and looking both ways protects your precious life.",
  },
  {
    id: 12,
    category: "safety",
    categoryTitle: "Safety Skills",
    title: "Internet Safety",
    description: "Protect personal information and recognize unsafe online behavior.",
    emoji: "🛡️",
    keyMoralLesson: "Keep personal information private and talk to trusted adults.",
  },
  {
    id: 13,
    category: "safety",
    categoryTitle: "Safety Skills",
    title: "Emergency Readiness",
    description: "Know home address, parents' phone numbers, and emergency contacts.",
    emoji: "🏠",
    keyMoralLesson: "Memorizing key facts helps you stay calm in unexpected moments.",
  },
  {
    id: 14,
    category: "safety",
    categoryTitle: "Safety Skills",
    title: "What to Do if Lost",
    description: "Stay calm, stay in a safe place, and approach trusted adults.",
    emoji: "🦺",
    keyMoralLesson: "Staying put and looking for safe helpers brings quick safety.",
  },
  {
    id: 15,
    category: "safety",
    categoryTitle: "Safety Skills",
    title: "Basic First Aid",
    description: "Handle minor cuts, scrapes, and know when to call an adult.",
    emoji: "🩹",
    keyMoralLesson: "Remaining calm during minor injuries helps healing begin.",
  },

  // ── 4. PERSONAL SAFETY & EMOTIONAL SKILLS ────────────────────────────────
  {
    id: 16,
    category: "emotional_skills",
    categoryTitle: "Personal Safety & Emotional Skills",
    title: "Body Safety & Boundaries",
    description: "Understand privacy, consent, safe/unsafe touch, and speaking up.",
    emoji: "🐝",
    keyMoralLesson: "Your body belongs to you, and your voice is powerful.",
  },
  {
    id: 17,
    category: "emotional_skills",
    categoryTitle: "Personal Safety & Emotional Skills",
    title: "Swimming & Water Safety",
    description: "Know how to stay safe in and around water.",
    emoji: "🏊",
    keyMoralLesson: "Respecting water rules ensures swimming remains fun.",
  },
  {
    id: 18,
    category: "emotional_skills",
    categoryTitle: "Personal Safety & Emotional Skills",
    title: "Managing Big Emotions",
    description: "Recognize big feelings and use healthy ways to calm down.",
    emoji: "🌈",
    keyMoralLesson: "Taking deep breaths helps big feelings pass safely.",
  },
  {
    id: 19,
    category: "emotional_skills",
    categoryTitle: "Personal Safety & Emotional Skills",
    title: "Handling Mistakes & Failure",
    description: "Accept mistakes, learn from them, and try again with courage.",
    emoji: "💡",
    keyMoralLesson: "Mistakes are proof that you are learning and growing.",
  },
  {
    id: 20,
    category: "emotional_skills",
    categoryTitle: "Personal Safety & Emotional Skills",
    title: "Asking for Help",
    description: "Recognize when something is beyond you and approach trusted adults.",
    emoji: "🤝",
    keyMoralLesson: "Asking for help when needed is a sign of wisdom, not weakness.",
  },

  // ── 5. SOCIAL & THINKING SKILLS ──────────────────────────────────────────
  {
    id: 21,
    category: "social_thinking",
    categoryTitle: "Social & Thinking Skills",
    title: "Clear Communication",
    description: "Express thoughts clearly and listen respectfully to others.",
    emoji: "💬",
    keyMoralLesson: "Listening with patience helps you understand others deeply.",
  },
  {
    id: 22,
    category: "social_thinking",
    categoryTitle: "Social & Thinking Skills",
    title: "Conflict Resolution",
    description: "Disagree respectfully, apologize, and work towards peace.",
    emoji: "⚙️",
    keyMoralLesson: "A sincere apology and kind words restore great friendships.",
  },
  {
    id: 23,
    category: "social_thinking",
    categoryTitle: "Social & Thinking Skills",
    title: "Wise Decision-Making",
    description: "Think through choices and understand possible consequences.",
    emoji: "⚖️",
    keyMoralLesson: "Good choices today create happy outcomes tomorrow.",
  },
  {
    id: 24,
    category: "social_thinking",
    categoryTitle: "Social & Thinking Skills",
    title: "Critical Thinking",
    description: "Question information politely instead of believing everything.",
    emoji: "🧠",
    keyMoralLesson: "Asking thoughtful questions leads you to truth.",
  },
  {
    id: 25,
    category: "social_thinking",
    categoryTitle: "Social & Thinking Skills",
    title: "Friendships & Peer Pressure",
    description: "Recognize healthy friendships, set boundaries, and say no.",
    emoji: "🛑",
    keyMoralLesson: "True friends respect your boundaries and encourage your best.",
  },
];

export function getRandomLifeSkill(): LifeSkill {
  const index = Math.floor(Math.random() * LIFE_SKILLS.length);
  return LIFE_SKILLS[index];
}

export function getLifeSkillById(id: number): LifeSkill | undefined {
  return LIFE_SKILLS.find((s) => s.id === id);
}