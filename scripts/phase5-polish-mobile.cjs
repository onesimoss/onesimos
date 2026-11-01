// scripts/phase5-polish-mobile.cjs
// Phase 5: Mobile polish, Capacitor safe-areas, and OAuth callback handler.
// Run: node scripts/phase5-polish-mobile.cjs

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

// Detect Supabase client export name
let supaName = "createClient";
const supaSrc = read("lib/supabase/client.ts");
if (supaSrc) {
  const m = supaSrc.match(/export\s+(?:async\s+)?(?:function|const)\s+(\w+)/);
  if (m) supaName = m[1];
}

// ============================================================
// 1. app/auth/callback/route.ts (OAuth callback handler)
// ============================================================
const authCallbackRoute = `import { NextResponse } from "next/server";
import { ${supaName} } from "@/lib/supabase/client";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/who";

  if (code) {
    try {
      const supabase = ${supaName}();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(\`\${origin}\${next}\`);
      }
    } catch (e) {
      console.error("Auth callback error:", e);
    }
  }

  // Return to login on failure
  return NextResponse.redirect(\`\${origin}/login\`);
}
`;

// ============================================================
// 2. app/globals.css (Enhanced mobile & Capacitor safe areas)
// ============================================================
const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 220 100% 98%;
    --foreground: 228 46% 20%;

    --card: 0 0% 100%;
    --card-foreground: 228 46% 20%;

    --primary: 228 46% 20%;
    --primary-foreground: 0 0% 100%;

    --secondary: 214 77% 69%;
    --secondary-foreground: 228 46% 20%;

    --accent: 70 78% 75%;
    --accent-foreground: 228 46% 20%;

    --muted: 220 60% 95%;
    --muted-foreground: 220 20% 45%;

    --border: 220 30% 90%;
    --radius: 2rem;
  }

  .dark {
    --background: 222 47% 11%;
    --foreground: 210 40% 98%;

    --card: 217 33% 17%;
    --card-foreground: 210 40% 98%;

    --primary: 210 40% 98%;
    --primary-foreground: 222 47% 11%;

    --secondary: 214 77% 69%;
    --secondary-foreground: 222 47% 11%;

    --accent: 70 78% 75%;
    --accent-foreground: 222 47% 11%;

    --muted: 217 33% 22%;
    --muted-foreground: 215 20% 65%;

    --border: 217 33% 25%;
  }

  * {
    border-color: hsl(var(--border));
    -webkit-tap-highlight-color: transparent;
  }

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-family: var(--font-inter), system-ui, sans-serif;
    overscroll-behavior-y: none;
  }
}

/* Custom Mobile Utilities */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Touch Target Enforcement */
button, a, input, select {
  min-height: 44px;
  min-width: 44px;
}

/* Capacitor Safe Area Supports */
.safe-top {
  padding-top: env(safe-area-inset-top);
}
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
`;

write("app/auth/callback/route.ts", authCallbackRoute);
write("app/globals.css", globalsCss);

console.log("");
console.log("Done. Commit and push:");
console.log("  git add .");
console.log(
  '  git commit -m "Phase 5: Add OAuth callback handler and mobile/Capacitor CSS polish"',
);
console.log("  git push origin main");
