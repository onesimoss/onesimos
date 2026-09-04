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
    <main className="min-h-screen bg-[#f7f2eb] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-[#1e1916] mb-4">Supabase Connection Test</h1>
        <p className={`text-lg ${status.includes("Error") ? "text-red-500" : "text-green-600"}`}>
          {status}
        </p>
      </div>
    </main>
  );
}