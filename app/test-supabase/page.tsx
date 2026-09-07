"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function TestSupabase() {
  const [status, setStatus] = useState("Testing connection...");

  useEffect(() => {
    async function test() {
      const { data, error } = await supabase.from("profiles").select("*").limit(1);
      if (error) {
        setStatus(`❌ Error: ${error.message}`);
      } else {
        setStatus(`✅ Connected! Found ${data.length} profiles.`);
      }
    }
    test();
  }, []);

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="card max-w-md w-full text-center">
        <h1 className="font-heading text-2xl font-bold text-bark mb-4">
          Supabase Connection Test
        </h1>
        <p
          className={`text-lg font-bold ${
            status.includes("Error") ? "text-red-500" : "text-mint"
          }`}
        >
          {status}
        </p>
      </div>
    </main>
  );
}