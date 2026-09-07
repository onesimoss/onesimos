export interface Avatar {
  id: string;
  emoji: string;
  color: string;
  skinTone: "light" | "medium" | "dark" | "deepest";
}

export const AVATARS: Avatar[] = [
  { id: "avatar-1", emoji: "👧🏾", color: "#E8734A", skinTone: "dark" },
  { id: "avatar-2", emoji: "👦🏾", color: "#5BB5F0", skinTone: "dark" },
  { id: "avatar-3", emoji: "👧", color: "#F5B731", skinTone: "medium" },
  { id: "avatar-4", emoji: "👦", color: "#34C78B", skinTone: "medium" },
  { id: "avatar-5", emoji: "👧🏿", color: "#8B5CF6", skinTone: "deepest" },
  { id: "avatar-6", emoji: " compatibility", color: "#E8734A", skinTone: "deepest" },
  { id: "avatar-7", emoji: "👧🏻", color: "#5BB5F0", skinTone: "light" },
  { id: "avatar-8", emoji: "👦🏻", color: "#34C78B", skinTone: "light" },
  { id: "avatar-9", emoji: "Use **Unicode escapes** so the file can’t get corrupted by copy/paste again.

### Replace **entire** `lib/avatars.ts` with this only:

```typescript
export interface Avatar {
  id: string;
  emoji: string;
  color: string;
  skinTone: "light" | "medium" | "dark" | "deepest";
}

export const AVATARS: Avatar[] = [
  { id: "avatar-1", emoji: "\u{1F467}\u{1F3FE}", color: "#E8734A", skinTone: "dark" },
  { id: "avatar-2", emoji: "\u{1F466}\u{1F3FE}", color: "#5BB5F0", skinTone: "dark" },
  { id: "avatar-3", emoji: "\u{1F467}\u{1F3FD}", color: "#F5B731", skinTone: "medium" },
  { id: "avatar-4", emoji: "\u{1F466}\u{1F3FD}", color: "#34C78B", skinTone: "medium" },
  { id: "avatar-5", emoji: "\u{1F467}\u{1F3FF}", color: "#8B5CF6", skinTone: "deepest" },
  { id: "avatar-6", emoji: "\u{1F466}\u{1F3FF}", color: "#E8734A", skinTone: "deepest" },
  { id: "avatar-7", emoji: "\u{1F467}\u{1F3FB}", color: "#5BB5F0", skinTone: "light" },
  { id: "avatar-8", emoji: "\u{1F466}\u{1F3FB}", color: "#34C78B", skinTone: "light" },
  { id: "avatar-9", emoji: "\u{1F9B8}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", color: "#F5B731", skinTone: "dark" },
  { id: "avatar-10", emoji: "\u{1F9B8}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", color: "#8B5CF6", skinTone: "medium" },
  { id: "avatar-11", emoji: "\u{1F9D1}\u{1F3FF}\u{200D}\u{1F680}", color: "#5BB5F0", skinTone: "deepest" },
  { id: "avatar-12", emoji: "\u{1F9D1}\u{1F3FD}\u{200D}\u{1F3A8}", color: "#E8734A", skinTone: "medium" },
];

export const getAvatarById = (id: string): Avatar => {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
};