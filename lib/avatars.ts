export interface Avatar {
  id: string;
  emoji: string;
  color: string;
  skinTone: "light" | "medium" | "dark" | "deepest";
}

export const AVATARS: Avatar[] = [
  { id: "avatar-1", emoji: "👧🏾", color: "#E8734A", skinTone: "dark" },
  { id: "avatar-2", emoji: "👦🏾", color: "#5BB5F0", skinTone: "dark" },
  { id: "avatar-3", emoji: "👧🏽", color: "#F5B731", skinTone: "medium" },
  { id: "avatar-4", emoji: "👦🏽", color: "#34C78B", skinTone: "medium" },
  { id: "avatar-5", emoji: "👧🏿", color: "#8B5CF6", skinTone: "deepest" },
  { id: "avatar-6", emoji: "👦🏿", color: "#E8734A", skinTone: "deepest" },
  { id: "avatar-7", emoji: "👧🏻", color: "#5BB5F0", skinTone: "light" },
  { id: "avatar-8", emoji: "👦🏻", color: "#34C78B", skinTone: "light" },
  { id: "avatar-9", emoji: "🦸🏾‍♀️", color: "#F5B731", skinTone: "dark" },
  { id: "avatar-10", emoji: "🦸🏽‍♂️", color: "#8B5CF6", skinTone: "medium" },
  { id: "avatar-11", emoji: "🧑🏿‍🚀", color: "#5BB5F0", skinTone: "deepest" },
  { id: "avatar-12", emoji: "🧑🏽‍🎨", color: "#E8734A", skinTone: "medium" },
];

export const getAvatarById = (id: string): Avatar => {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
};