"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/lib/themes";

export default function KidLogin() {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dinosaurs;
  const router = useRouter();
  
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 🔥 Find the kid profile with this PIN
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, is_kid")
      .eq("pin_code", pin)
      .eq("is_kid", true)
      .single();

    if (error || !data) {
      setError("❌ Invalid PIN. Please ask your parent for the correct code.");
      setLoading(false);
      return;
    }

    // 🔥 Store kid session
    sessionStorage.setItem("kidId", data.id);
    sessionStorage.setItem("kidName", data.display_name);
    
    // 🔥 Redirect to the reading dashboard
    router.push("/kid/dashboard");
  };

  return (
    <main 
      className="min-h-screen flex items-center justify-center p-6 transition-colors duration-300"
      style={{ background: currentTheme.background }}
    >
      <div 
        className="max-w-md w-full rounded-3xl shadow-xl p-8 border transition-colors duration-300"
        style={{ 
          background: currentTheme.card,
          borderColor: currentTheme.accentLight,
          color: currentTheme.primary
        }}
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🧒</div>
          <h1 className="text-2xl font-bold">Welcome Back, Reader!</h1>
          <p className="text-sm" style={{ color: currentTheme.muted }}>Enter your secret PIN to start reading.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.secondary }}>
              Your PIN Code
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 text-2xl text-center rounded-xl border focus:ring-2 focus:outline-none"
              style={{ 
                borderColor: currentTheme.accentLight,
                focusRingColor: currentTheme.accent,
                background: currentTheme.background,
                color: currentTheme.primary
              }}
              placeholder="🔒 Enter 4-digit PIN"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || pin.length < 4}
            className="w-full py-3 rounded-full font-medium transition-all hover:shadow-xl disabled:opacity-50"
            style={{
              background: currentTheme.accent,
              color: theme === "space" || theme === "fantasy" ? "#fff" : currentTheme.primary,
            }}
          >
            {loading ? "Checking..." : "🔓 Unlock Reading"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs" style={{ color: currentTheme.muted }}>
            👋 This is a Kids-Only login. Parents, use the main login.
          </p>
        </div>
      </div>
    </main>
  );
}