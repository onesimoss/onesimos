export interface Avatar {
  id: string;
  imageUrl: string;
  emoji: string;
  color: string;
  gender: "girl" | "boy";
  skinTone: "light" | "medium" | "dark" | "deepest";
}

/**
 * Conventional, parent-friendly avatars.
 * - Equal girls / boys (6 each)
 * - Balanced skin tones
 * - Dark hair only, short / neat styles (no wild colours)
 * DiceBear Avataaars with locked params (not Apple Memoji — those are proprietary)
 */
const base =
  "https://api.dicebear.com/7.x/avataaars/svg?size=200&backgroundColor=f5f0e8&facialHairProbability=0&accessoriesProbability=0&eyebrows=default,defaultNatural&mouth=smile,default";

export const AVATARS: Avatar[] = [
  // ——— Girls (6): neat dark hair ———
  {
    id: "avatar-1",
    gender: "girl",
    skinTone: "dark",
    color: "#E8734A",
    emoji: "\u{1F467}\u{1F3FE}",
    imageUrl: `${base}&seed=g1&top=bob&hairColor=2c1b18&skinColor=ae5d29&clothing=shirtCrewNeck&clothesColor=5199e4`,
  },
  {
    id: "avatar-2",
    gender: "girl",
    skinTone: "medium",
    color: "#F5B731",
    emoji: "\u{1F467}\u{1F3FD}",
    imageUrl: `${base}&seed=g2&top=bob&hairColor=4a312c&skinColor=d08b5b&clothing=shirtCrewNeck&clothesColor=ffb300`,
  },
  {
    id: "avatar-3",
    gender: "girl",
    skinTone: "deepest",
    color: "#8B5CF6",
    emoji: "\u{1F467}\u{1F3FF}",
    imageUrl: `${base}&seed=g3&top=straight01&hairColor=0e0e0e&skinColor=614335&clothing=shirtCrewNeck&clothesColor=9b59b6`,
  },
  {
    id: "avatar-4",
    gender: "girl",
    skinTone: "light",
    color: "#5BB5F0",
    emoji: "\u{1F467}\u{1F3FB}",
    imageUrl: `${base}&seed=g4&top=bob&hairColor=2c1b18&skinColor=edb98a&clothing=shirtCrewNeck&clothesColor=25557c`,
  },
  {
    id: "avatar-5",
    gender: "girl",
    skinTone: "dark",
    color: "#34C78B",
    emoji: "\u{1F467}\u{1F3FE}",
    imageUrl: `${base}&seed=g5&top=straight02&hairColor=2c1b18&skinColor=ae5d29&clothing=shirtCrewNeck&clothesColor=28a745`,
  },
  {
    id: "avatar-6",
    gender: "girl",
    skinTone: "medium",
    color: "#E8734A",
    emoji: "\u{1F467}\u{1F3FD}",
    imageUrl: `${base}&seed=g6&top=bob&hairColor=0e0e0e&skinColor=c68642&clothing=shirtCrewNeck&clothesColor=e67e22`,
  },

  // ——— Boys (6): low cut / short dark hair ———
  {
    id: "avatar-7",
    gender: "boy",
    skinTone: "dark",
    color: "#5BB5F0",
    emoji: "\u{1F466}\u{1F3FE}",
    imageUrl: `${base}&seed=b1&top=shortFlat&hairColor=0e0e0e&skinColor=ae5d29&clothing=shirtCrewNeck&clothesColor=3498db`,
  },
  {
    id: "avatar-8",
    gender: "boy",
    skinTone: "medium",
    color: "#34C78B",
    emoji: "\u{1F466}\u{1F3FD}",
    imageUrl: `${base}&seed=b2&top=shortRound&hairColor=2c1b18&skinColor=d08b5b&clothing=shirtCrewNeck&clothesColor=27ae60`,
  },
  {
    id: "avatar-9",
    gender: "boy",
    skinTone: "deepest",
    color: "#E8734A",
    emoji: "\u{1F466}\u{1F3FF}",
    imageUrl: `${base}&seed=b3&top=shortFlat&hairColor=0e0e0e&skinColor=614335&clothing=shirtCrewNeck&clothesColor=e74c3c`,
  },
  {
    id: "avatar-10",
    gender: "boy",
    skinTone: "light",
    color: "#8B5CF6",
    emoji: "\u{1F466}\u{1F3FB}",
    imageUrl: `${base}&seed=b4&top=shortWaved&hairColor=2c1b18&skinColor=edb98a&clothing=shirtCrewNeck&clothesColor=8e44ad`,
  },
  {
    id: "avatar-11",
    gender: "boy",
    skinTone: "dark",
    color: "#F5B731",
    emoji: "\u{1F466}\u{1F3FE}",
    imageUrl: `${base}&seed=b5&top=shortRound&hairColor=0e0e0e&skinColor=ae5d29&clothing=shirtCrewNeck&clothesColor=f1c40f`,
  },
  {
    id: "avatar-12",
    gender: "boy",
    skinTone: "medium",
    color: "#5BB5F0",
    emoji: "\u{1F466}\u{1F3FD}",
    imageUrl: `${base}&seed=b6&top=shortFlat&hairColor=2c1b18&skinColor=c68642&clothing=shirtCrewNeck&clothesColor=1abc9c`,
  },
];

export const getAvatarById = (id: string): Avatar => {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
};