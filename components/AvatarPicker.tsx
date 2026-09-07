"use client";

import { AVATARS } from "@/lib/avatars";

interface AvatarPickerProps {
  value: string;
  onChange: (avatarId: string) => void;
}

export default function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  return (
    <div>
      <p className="text-sm font-bold text-bark-light mb-3">
        Choose an avatar
      </p>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {AVATARS.map((avatar) => {
          const selected = value === avatar.id;
          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onChange(avatar.id)}
              className={`aspect-square rounded-2xl text-3xl flex items-center justify-center transition-all border-2 ${
                selected
                  ? "border-coral scale-105 shadow-soft bg-white"
                  : "border-border bg-cream hover:border-coral/40 hover:scale-105"
              }`}
              style={{
                boxShadow: selected ? `0 0 0 3px ${avatar.color}33` : undefined,
              }}
              aria-label={`Select avatar ${avatar.id}`}
            >
              {avatar.emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}