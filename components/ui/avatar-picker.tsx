'use client';

import React from 'react';
import { cn } from '@/lib/utils';
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12" /></svg>
);

export const AVATAR_OPTIONS = [
  { id: 'avatar_bear', name: 'Barnaby Bear', bg: 'bg-[#E1F18C]', emoji: '🐻' },
  { id: 'avatar_owl', name: 'Ollie Owl', bg: 'bg-[#71A6EE]', emoji: '🦉' },
  { id: 'avatar_fox', name: 'Fiona Fox', bg: 'bg-[#F7D4DA]', emoji: '🦊' },
  { id: 'avatar_rabbit', name: 'Rosie Rabbit', bg: 'bg-[#E1C8F6]', emoji: '🐰' },
  { id: 'avatar_lion', name: 'Leo Lion', bg: 'bg-amber-200', emoji: '🦁' },
  { id: 'avatar_panda', name: 'Penelope Panda', bg: 'bg-emerald-200', emoji: '🐼' },
  { id: 'avatar_koala', name: 'Kip Koala', bg: 'bg-cyan-200', emoji: '🐨' },
  { id: 'avatar_unicorn', name: 'Una Unicorn', bg: 'bg-pink-200', emoji: '🦄' },
];

interface AvatarPickerProps {
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({ selectedId, onSelect, className }) => {
  return (
    <div className={cn('grid grid-cols-4 gap-4 sm:gap-6', className)}>
      {AVATAR_OPTIONS.map((avatar) => {
        const isSelected = selectedId === avatar.id;
        return (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onSelect(avatar.id)}
            className="group flex flex-col items-center focus:outline-none"
          >
            <div
              className={cn(
                'relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full text-3xl sm:text-4xl transition-all duration-200 shadow-sm',
                avatar.bg,
                isSelected
                  ? 'ring-4 ring-[#71A6EE] ring-offset-2 scale-110 shadow-md'
                  : 'hover:scale-105 opacity-80 hover:opacity-100'
              )}
            >
              <span role="img" aria-label={avatar.name}>
                {avatar.emoji}
              </span>
              {isSelected && (
                <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#1C274C] text-white shadow">
                  <CheckIcon className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              )}
            </div>
            <span
              className={cn(
                'mt-2 text-xs font-semibold text-center transition-colors',
                isSelected ? 'text-[#1C274C] font-bold dark:text-white' : 'text-slate-500 dark:text-slate-400'
              )}
            >
              {avatar.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
