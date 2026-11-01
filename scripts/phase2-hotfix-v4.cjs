// scripts/phase2-hotfix-v4.cjs
// Surgical fix: remove lucide-react from components/ui/avatar-picker.tsx
// and scan the entire project for any remaining forbidden imports.
// Run: node scripts/phase2-hotfix-v4.cjs

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

// ---- 1. Patch avatar-picker.tsx ----
const avatarPath = "components/ui/avatar-picker.tsx";
let avatarSrc = read(avatarPath);

if (!avatarSrc) {
  console.log("WARNING: " + avatarPath + " not found. Skipping patch.");
} else {
  console.log("Patching " + avatarPath + "...");

  // Remove the lucide-react import line entirely
  avatarSrc = avatarSrc.replace(
    /import\s*\{[^}]*\}\s*from\s*['"]lucide-react['"]\s*;?\s*\n?/g,
    "",
  );

  // Inject an inline CheckIcon component right after the last import
  const checkIcon =
    '\nconst CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (\n  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12" /></svg>\n);\n';

  // Find the last import statement and insert after it
  const importLines = avatarSrc.match(/^import\s.*$/gm);
  if (importLines && importLines.length > 0) {
    const lastImport = importLines[importLines.length - 1];
    const idx = avatarSrc.lastIndexOf(lastImport) + lastImport.length;
    avatarSrc = avatarSrc.slice(0, idx) + checkIcon + avatarSrc.slice(idx);
  } else {
    avatarSrc = checkIcon + avatarSrc;
  }

  // Replace all <Check with <CheckIcon (handles <Check />, <Check className="..." />, etc.)
  avatarSrc = avatarSrc.replace(/<Check\b/g, "<CheckIcon");
  avatarSrc = avatarSrc.replace(/<\/Check>/g, "</CheckIcon>");

  write(avatarPath, avatarSrc);
}

// ---- 2. Full project scan for forbidden imports ----
function walk(dir, out) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.name === "node_modules" || e.name === ".next" || e.name === ".git")
      continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (
      e.name.endsWith(".tsx") ||
      e.name.endsWith(".ts") ||
      e.name.endsWith(".jsx") ||
      e.name.endsWith(".js")
    ) {
      if (!e.name.endsWith(".cjs")) out.push(p);
    }
  }
  return out;
}

const allFiles = walk(ROOT, []);
const offenders = [];

for (const f of allFiles) {
  let txt = "";
  try {
    txt = fs.readFileSync(f, "utf8");
  } catch {
    continue;
  }
  const rel = path.relative(ROOT, f);
  const issues = [];
  if (/from\s+['"]lucide-react['"]/.test(txt)) issues.push("lucide-react");
  if (/from\s+['"]@supabase\/auth-helpers-nextjs['"]/.test(txt))
    issues.push("@supabase/auth-helpers-nextjs");
  if (/from\s+['"]clsx['"]/.test(txt)) issues.push("clsx");
  if (/from\s+['"]tailwind-merge['"]/.test(txt)) issues.push("tailwind-merge");
  if (/from\s+['"]class-variance-authority['"]/.test(txt))
    issues.push("class-variance-authority");
  if (issues.length > 0) offenders.push({ file: rel, issues: issues });
}

console.log("");
console.log("=== FULL PROJECT SCAN ===");
if (offenders.length === 0) {
  console.log("PASS: Zero forbidden imports found in the entire project.");
} else {
  console.log("OFFENDERS FOUND (" + offenders.length + "):");
  for (const o of offenders) {
    console.log("  " + o.file + "  [" + o.issues.join(", ") + "]");
  }
  console.log("");
  console.log(
    "These files will also cause build failures. A follow-up script is needed.",
  );
}
console.log("");
console.log("Done. Commit and push:");
console.log("  git add .");
console.log(
  '  git commit -m "Phase 2: remove lucide-react from avatar-picker"',
);
console.log("  git push origin main");
