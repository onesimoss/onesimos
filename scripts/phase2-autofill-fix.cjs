// scripts/phase2-autofill-fix.cjs
// Adds name + autocomplete attributes to login/signup inputs
// so browser password managers recognize the forms again.
// Run: node scripts/phase2-autofill-fix.cjs

const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();

function patch(rel, replacements) {
  const abs = path.join(ROOT, rel);
  let src = fs.readFileSync(abs, "utf8");
  let changed = 0;
  for (const [find, replace] of replacements) {
    if (src.includes(find)) {
      src = src.split(find).join(replace);
      changed++;
    }
  }
  if (changed > 0) {
    fs.writeFileSync(abs, src, "utf8");
    console.log("PATCHED  " + rel + "  (" + changed + " replacements)");
  } else {
    console.log("SKIPPED  " + rel + "  (no matches found, already patched?)");
  }
}

// ---- Login page ----
patch("app/login/page.tsx", [
  // Email input
  [
    'type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"',
    'type="email" name="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"',
  ],
  // Password input
  [
    'type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password"',
    'type="password" name="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password"',
  ],
]);

// ---- Signup page ----
patch("app/signup/page.tsx", [
  // Name input
  [
    'type="text" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Jane Doe"',
    'type="text" name="name" autoComplete="name" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Jane Doe"',
  ],
  // Email input
  [
    'type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"',
    'type="email" name="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"',
  ],
  // Password input
  [
    'type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters"',
    'type="password" name="new-password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters"',
  ],
]);

console.log("");
console.log("Done. Commit and push:");
console.log("  git add .");
console.log('  git commit -m "fix: restore browser autofill on login/signup"');
console.log("  git push origin main");
