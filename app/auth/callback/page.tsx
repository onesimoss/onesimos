/**
 * @file app/auth/callback/page.tsx
 * @description Client-side OAuth callback page that handles hash fragments (#access_token) 
 * and PKCE codes (?code=), confirms the session, and redirects parents to the Welcome page.
 *
 * @module app/auth/callback/page
 * @fonts Logo (wordmark) + Achiko (headings) + Switzer (body/UI)
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage(): JSX.Element {
  const router = useRouter();
  const [status, setStatus] = useState("Signing you in securely...");

  useEffect(() => {
    async function handleAuthCallback(): Promise<void> {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("[AuthCallback] Session error:", error);
          setStatus("Authentication failed. Redirecting to login...");
          setTimeout(() => router.replace("/login"), 1500);
          return;
        }

        if (session) {
          setStatus("Success! Welcome to Onesimos...");
          router.replace("/welcome");
          return;
        }

        // Wait brief moment for client auth listener
        const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
          if (event === "SIGNED_IN" && newSession) {
            listener.subscription.unsubscribe();
            router.replace("/welcome");
          }
        });

        setTimeout(() => {
          router.replace("/welcome");
        }, 2000);
      } catch (err) {
        console.error("[AuthCallback] Unexpected error:", err);
        router.replace("/login");
      }
    }

    void handleAuthCallback();
  }, [router]);

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 font-switzer text-center">
      <div className="w-16 h-16 border-4 border-amber-400 border-t-amber-600 rounded-full animate-spin mb-4" />
      <h1 className="font-logo text-3xl text-amber-900 mb-2">Onesimos</h1>
      <p className="font-bold text-gray-700 text-sm font-switzer animate-pulse">
        {status}
      </p>
    </main>
  );
}