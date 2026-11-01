"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function CallbackContent() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const client = createClient();
        const { data } = await client.auth.getSession();
        if (!cancelled) {
          if (data && data.session) {
            router.push("/who");
          } else {
            setTimeout(() => router.push("/who"), 1000);
          }
        }
      } catch {
        if (!cancelled) router.push("/login");
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  return (
    <main className="min-h-screen bg-[#F4F8FF] dark:bg-[#0F172A] flex items-center justify-center p-5">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#1C274C] text-[#E1F18C] flex items-center justify-center font-black text-xl mx-auto animate-bounce">
          O
        </div>
        <p className="text-sm font-bold text-[#1C274C] dark:text-white">Completing sign in...</p>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#F4F8FF] dark:bg-[#0F172A]" />}>
      <CallbackContent />
    </Suspense>
  );
}
