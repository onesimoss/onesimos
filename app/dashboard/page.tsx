"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/parent");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
      <p className="text-gray-400 font-bold animate-pulse text-sm">Opening Parent Dashboard...</p>
    </div>
  );
}