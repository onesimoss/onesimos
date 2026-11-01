// scripts/phase5-fix-callback.cjs
// Fixes route collision by removing route.ts and updating app/auth/callback/page.tsx
// Run: node scripts/phase5-fix-callback.cjs

const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();

function read(rel) {
  try {
    return fs.readFileSync(path.join(ROOT, rel), "utf8");
  } catch {
    return null;
  }
}

function write(rel, content) {
  const abs = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, "utf8");
  console.log("WROTE  " + rel + "  (" + content.length + " bytes)");
}

function removeFile(rel) {
  const abs = path.join(ROOT, rel);
  if (fs.existsSync(abs)) {
    fs.unlinkSync(abs);
    console.log("REMOVED " + rel);
  }
}

// Detect Supabase client export name
let supaName = "createClient";
const supaSrc = read("lib/supabase/client.ts");
if (supaSrc) {
  const m = supaSrc.match(/export\s+(?:async\s+)?(?:function|const)\s+(\w+)/);
  if (m) supaName = m[1];
}
function inject(s) {
  return s.split("__SUPA__").join(supaName);
}

// 1. Remove route.ts to fix Next.js collision
removeFile("app/auth/callback/route.ts");

// 2. Write client-side app/auth/callback/page.tsx
const pageAuthCallback = `"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { __SUPA__ } from "@/lib/supabase/client";

function CallbackContent() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const client = __SUPA__();
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
`;

write("app/auth/callback/page.tsx", inject(pageAuthCallback));

console.log("");
console.log("Done. Commit and push:");
console.log("  git add .");
console.log(
  '  git commit -m "fix: resolve route collision by standardizing on auth callback page"',
);
console.log("  git push origin main");
