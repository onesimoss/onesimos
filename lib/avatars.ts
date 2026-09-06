// lib/avatars.ts

export interface Avatar {
  id: string;
  name: string;
  emoji: string;
  color: string; // Tailwind gradient classes or hex codes for the character
}

export const AVATARS: Avatar[] = [
  { id: 'fox', name: 'Foxy', emoji: '🦊', color: '#F4A261' },
  { id: 'panda', name: 'Panda', emoji: '🐼', color: '#E9C46A' },
  { id: 'penguin', name: 'Pingu', emoji: '🐧', color: '#2A9D8F' },
  { id: 'dino', name: 'Rex', emoji: '🦖', color: '#E76F51' },
  { id: 'cat', name: 'Whiskers', emoji: '🐱', color: '#E9C46A' },
  { id: 'frog', name: 'Hopper', emoji: '🐸', color: '#06D6A0' },
];

// Helper to get an avatar by its ID
export const getAvatarById = (id: string): Avatar => {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
};