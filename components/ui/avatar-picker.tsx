import * as React from "react";
import { cn } from "@/lib/utils";

export const AVATAR_OPTIONS = [
  { id: "lion", name: "Leo Lion", color: "bg-brand-lime" },
  { id: "owl", name: "Ollie Owl", color: "bg-brand-purple" },
  { id: "fox", name: "Felix Fox", color: "bg-brand-pink" },
  { id: "bear", name: "Barnaby Bear", color: "bg-brand-blue" },
  { id: "rabbit", name: "Rosie Rabbit", color: "bg-brand-lime" },
  { id: "panda", name: "Pip Panda", color: "bg-brand-purple" },
];

interface AvatarPickerProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function AvatarPicker({ selectedId, onSelect }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
      {AVATAR_OPTIONS.map((avatar) => {
        const isSelected = selectedId === avatar.id;
        return (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onSelect(avatar.id)}
            className={cn(
              "group flex flex-col items-center gap-2 rounded-3xl p-3 transition-all touch-target",
              isSelected
                ? "bg-white shadow-md ring-2 ring-brand-navy dark:bg-slate-800 dark:ring-brand-blue"
                : "hover:bg-white/50 dark:hover:bg-slate-800/50"
            )}
          >
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full text-2xl transition-transform group-hover:scale-105",
                avatar.color
              )}
            >
              {avatar.id === "lion" && "🦁"}
              {avatar.id === "owl" && "🦉"}
              {avatar.id === "fox" && "🦊"}
              {avatar.id === "bear" && "🐻"}
              {avatar.id === "rabbit" && "🐰"}
              {avatar.id === "panda" && "🐼"}
            </div>
            <span className="text-xs font-bold text-brand-navy dark:text-slate-200">
              {avatar.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
