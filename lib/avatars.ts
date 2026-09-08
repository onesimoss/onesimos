export interface Avatar {
  id: string;
  /** Image URL (illustrated style — not spooky emoji faces) */
  imageUrl: string;
  /** Tiny fallback for places that still need a character cue */
  emoji: string;
  color: string;
  gender: "girl" | "boy";
  skinTone: "light" | "medium" | "dark" | "deepest";
}

/**
 * Friendly illustrated avatars (DiceBear Adventurer).
 * Equal girls/boys and balanced skin tones.
 * Seeds are fixed so each avatar stays stable forever.
 */
export const AVATARS: Avatar[] = [
  // Girls (6)
  {
    id: "avatar-1",
    gender: "girl",
    skinTone: "dark",
    color: "#E8734A",
    emoji: "\u{1F467}\u{1F3FE}",
    imageUrl:
      "https://api.dicebear.com/7.x/adventurer/svg?seed=OnesimosGirlDark1&skinColor=ae5d29&hair=long01,long03&eyes=variant01",
  },
  {
    id: "avatar-2",
    gender: "girl",
    skinTone: "medium",
    color: "#F5B731",
    emoji: "\u{1F467}\u{1F3FD}",
    imageUrl:
      "https://api.dicebear.com/7.x/adventurer/svg?seed=OnesimosGirlMed1&skinColor=d08b5b&hair=long04,long06&eyes=variant02",
  },
  {
    id: "avatar-3",
    gender: "girl",
    skinTone: "deepest",
    color: "#8B5CF6",
    emoji: "\u{1F467}\u{1F3FF}",
    imageUrl:
      "https://api.dicebear.com/7.x/adventurer/svg?seed=OnesimosGirlDeep1&skinColor=614335&hair=long08,long09&eyes=variant03",
  },
  {
    id: "avatar-4",
    gender: "girl",
    skinTone: "light",
    color: "#5BB5F0",
    emoji: "\u{1F467}\u{1F3FB}",
    imageUrl:
      "https://api.dicebear.com/7.x/adventurer/svg?seed=OnesimosGirlLight1&skinColor=f2d3b1&hair=long12,long14&eyes=variant05",
  },
  {
    id: "avatar-5",
    gender: "girl",
    skinTone: "dark",
    color: "#34C78B",
    emoji: "\u{1F467}\u{1F3FE}",
    imageUrl:
      "https://api.dicebear.com/7.x/adventurer/svg?seed=OnesimosGirlDark2&skinColor=ae5d29&hair=long15,long16&eyes=variant06",
  },
  {
    id: "avatar-6",
    gender: "girl",
    skinTone: "medium",
    color: "#E8734A",
    emoji: "\u{1F467}\u{1F3FD}",
    imageUrl:
      "https://api.dicebear.com/7.x/adventurer/svg?seed=OnesimosGirlMed2&skinColor=d08b5b&hair=long17,long18&eyes=variant07",
  },

  // Boys (6)
  {
    id: "avatar-7",
    gender: "boy",
    skinTone: "dark",
    color: "#5BB5F0",
    emoji: "\u{1F466}\u{1F3FE}",
    imageUrl:
      "https://api.dicebear.com/7.x/adventurer/svg?seed=OnesimosBoyDark1&skinColor=ae5d29&hair=short01,short03&eyes=variant01",
  },
  {
    id: "avatar-8",
    gender: "boy",
    skinTone: "medium",
    color: "#34C78B",
    emoji: "\u{1F466}\u{1F3FD}",
    imageUrl:
      "https://api.dicebear.com/7.x/adventurer/svg?seed=OnesimosBoyMed1&skinColor=d08b5b&hair=short04,short06&eyes=variant02",
  },
  {
    id: "avatar-9",
    gender: "boy",
    skinTone: "deepest",
    color: "#E8734A",
    emoji: "\u{1F466}\u{1F3FF}",
    imageUrl:
      "https://api.dicebear.com/7.x/adventurer/svg?seed=OnesimosBoyDeep1&skinColor=614335&hair=short08,short09&eyes=variant03",
  },
  {
    id: "avatar-10",
    gender: "boy",
    skinTone: "light",
    color: "#8B5CF6",
    emoji: "\u{1F466}\u{1F3FB}",
    imageUrl:
      "https://api.dicebear.com/7.x/adventurer/svg?seed=OnesimosBoyLight1&skinColor=f2d3b1&hair=short12,short14&eyes=variant05",
  },
  {
    id: "avatar-11",
    gender: "boy",
    skinTone: "dark",
    color: "#F5B731",
    emoji: "\u{1F466}\u{1F3FE}",
    imageUrl:
      "https://api.dicebear.com/7.x/adventurer/svg?seed=OnesimosBoyDark2&skinColor=ae5d29&hair=short15,short16&eyes=variant06",
  },
  {
    id: "avatar-12",
    gender: "boy",
    skinTone: "medium",
    color: "#5BB5F0",
    emoji: "\u{1F466}\u{1F3FD}",
    imageUrl:
      "https://api.dicebear.com/7.x/adventurer/svg?seed=OnesimosBoyMed2&skinColor=d08b5b&hair=short17,short18&eyes=variant07",
  },
];

export const getAvatarById = (id: string): Avatar => {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
};