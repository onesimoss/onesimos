/**
 * @file app/phonics/page.tsx
 * @description Smart Gateway Redirect: Forwards traffic from legacy /phonics to the active
 * child profile's Phonics Sound Lab (/kid/[childId]/phonics).
 *
 * @module app/phonics/page
 * @fonts Switzer (body/UI)
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export default function PhonicsGatewayPage(): JSX.Element {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function resolvePhonicsTarget(): Promise<void> {
      if (loading) return;

      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        // Fetch the parent's first child profile
        const { data: children, error } = await supabase
          .from("children")
          .select("id")
          .eq("parent_id", user.id)
          .order("created_at", { ascending: true })
          .limit(1);

        if (error || !children || children.length === 0) {
          router.replace("/onboarding");
          return;
        }

        // Redirect to the first child's Phonics Sound Lab
        const childId = children[0].id;
        router.replace(`/kid/${childId}/phonics`);
      } catch (err) {
        console.error("[PhonicsGateway] Failed to resolve target route:", err);
        router.replace("/who");
      } finally {
        setChecking(false);
      }
    }

    void resolvePhonicsTarget();
  }, [user, loading, router]);

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 font-switzer text-center">
      <div className="w-16 h-16 bg-amber-100 rounded-3xl flex items-center justify-center text-3xl mb-4 animate-bounce">
        🎵
      </div>
      <h1 className="font-bold text-amber-950 text-xl mb-1 font-switzer">
        Entering the Sound Lab...
      </h1>
      <p className="text-xs text-gray-500 font-switzer">
        {checking ? "Finding your reader profile..." : "Taking you there now!"}
      </p>
    </main>
  );
}