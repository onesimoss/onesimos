"use client";

import { useState } from "react";
import Link from "next/link";
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
  const [needsSetup, setNeedsSetup] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!user) {
      setError("Session expired. Please log in as a parent.");
      return;
    }

    if (pin.length !== 4) {
      setError("Please enter all 4 digits.");
      return;
    }

    setChecking(true);
    setError("");

    const result = await verifyParentPin(user.id, pin);
    setChecking(false);

    if (!result.ok) {
      setError(result.error?.message || "Incorrect code. Try again.");
      if (result.needsSetup) {
        setNeedsSetup(true);
      }
      setPin("");
      return;
    }

    setPin("");
    setError("");
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-gray-100">
        <div className="text-4xl mb-3">🔒</div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">
          Parents Only
        </h2>
        <p className="text-gray-500 text-xs mb-6">
          Enter your secret 4-digit Parent PIN to continue.
        </p>

        {!needsSetup ? (
          <>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && pin.length === 4) {
                  void handleSubmit();
                }
              }}
              placeholder="••••"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-center text-3xl tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4"
              autoFocus
            />

            {error && (
              <p className="text-red-500 text-xs font-bold mb-4 bg-red-50 py-2 px-3 rounded-xl">
                {error}
              </p>
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
                className="flex-1 py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={checking || pin.length !== 4}
                className="flex-1 py-2.5 rounded-2xl bg-[#FCE588] text-black text-xs font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50"
              >
                {checking ? "Checking..." : "Unlock"}
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl font-medium">
              You haven't set a 4-digit parent PIN yet. Please log into the Parent Portal to set one.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setNeedsSetup(false);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <Link
                href="/parent/login"
                className="flex-1 py-2.5 rounded-2xl bg-black text-white text-xs font-bold hover:bg-gray-800 text-center flex items-center justify-center"
              >
                Parent Login →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}