"use client";

import { useMemo, useState } from "react";
import { clearKidSession } from "@/lib/children";

interface ParentGateProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ParentGate({ open, onClose, onSuccess }: ParentGateProps) {
  const problem = useMemo(() => {
    const a = Math.floor(Math.random() * 4) + 2; // 2–5
    const b = Math.floor(Math.random() * 4) + 2;
    return { a, b, answer: a + b };
  }, [open]);

  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const submit = () => {
    const n = Number(value);
    if (n === problem.answer) {
      clearKidSession();
      setValue("");
      setError("");
      onSuccess();
      return;
    }
    setError("Not quite — try again, grown-up!");
    setValue("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-bark/40 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="card max-w-sm w-full !p-6 text-center">
        <div className="text-4xl mb-3">🔒</div>
        <h2 className="font-heading text-2xl font-extrabold text-bark mb-2">
          Parents only
        </h2>
        <p className="text-bark-muted text-sm mb-4">
          Quick check so little hands stay in story land.
        </p>

        <p className="font-heading text-3xl font-bold text-bark mb-4">
          {problem.a} + {problem.b} = ?
        </p>

        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 3))}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          className="w-full px-4 py-3 rounded-2xl border border-border bg-cream text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-coral/40 mb-3"
          placeholder="?"
          autoFocus
        />

        {error && (
          <p className="text-coral text-sm font-bold mb-3">{error}</p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setValue("");
              setError("");
              onClose();
            }}
            className="btn-secondary flex-1 !py-2.5 !text-sm"
          >
            Back to stories
          </button>
          <button
            type="button"
            onClick={submit}
            className="btn-primary flex-1 !py-2.5 !text-sm"
          >
            Unlock
          </button>
        </div>
      </div>
    </div>
  );
}