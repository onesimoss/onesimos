"use client";

import { AVATARS } from "@/lib/avatars";

interface AvatarPickerProps {
  value: string;
  onChange: (avatarId: string) => void;
}

export default function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  const girls = AVATARS.filter((a) => a.gender === "girl");
  const boys = AVATARS.filter((a) => a.gender === "boy");

  const renderGroup = (title: string, list: typeof AVATARS) => (
    <div className="mb-5">
      <p className="text-xs font-bold text-bark-muted mb-2 uppercase tracking-wide">
        {title}
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {list.map((avatar) => {
          const selected = value === avatar.id;
          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onChange(avatar.id)}
              className={`aspect-square rounded-2xl overflow-hidden flex items-center justify-center transition-all border-2 bg-cream ${
                selected
                  ? "border-coral scale-105 shadow-soft"
                  : "border-border hover:border-coral/40 hover:scale-105"
              }`}
              style={{
                boxShadow: selected ? `0 0 0 3px ${avatar.color}33` : undefined,
              }}
              aria-label={`Select ${avatar.gender} avatar`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatar.imageUrl}
                alt=""
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      <p className="text-sm font-bold text-bark-light mb-3">
        Choose a friendly face
      </p>
      <p className="text-xs text-bark-muted mb-4">
        Pick whoever feels like them. You can change this later.
      </p>
      {renderGroup("Girls", girls)}
      {renderGroup("Boys", boys)}
    </div>
  );
}