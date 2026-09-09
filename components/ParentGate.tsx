"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { verifyParentPin } from "@/lib/parentGate";

interface ParentGateProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ParentGate({ open, onClose, onSuccess }: ParentGateProps) {
  const { user } = useAuth();
  const [pin, setPin] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    if (!user) {
      setError("Session expired. Please log in again.");
      return;
    }

    if (pin.length !== 4) {
      setError("Please enter a 4-digit code.");
      return;
    }

    setChecking(true);
    setError("");

    const result = await verifyParentPin(user.id, pin);
    setChecking(false);

    if (!result.ok) {
      setError(result.error?.message || "That code didn't match.");
      setPin("");
      return;
    }

    setPin("");
    setError("");
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-bark/40 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="card max-w-sm w-full !p-6 text-center">
        <div className="text-4xl mb-3">🔒</div>
        <h2 className="font-heading text-2xl font-extrabold text-bark mb-2">
          Parents Only
        </h2>
        <p className="text-bark-muted text-sm mb-6">
          Enter your secret 4-digit parent code to open the dashboard.
        </p>

        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={pin}
          onChange={(e) =>
            setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" && pin.length === 4) {
              void handleSubmit();
            }
          }}
          placeholder="••••"
          className="w-full px-4 py-3 rounded-2xl border border-border bg-cream text-center text-3xl tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-coral/40 mb-4"
          autoFocus
        />

        {error && (
          <p className="text-coral text-sm font-bold mb-4">{error}</p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setPin("");
              setError("");
              onClose();
            }}
            disabled={checking}
            className="btn-secondary flex-1 !py-2.5 !text-sm"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={checking || pin.length !== 4}
            className="btn-primary flex-1 !py-2.5 !text-sm disabled:opacity-50"
          >
            {checking ? "Checking..." : "Unlock"}
          </button>
        </div>
      </div>
    </div>
  );
}