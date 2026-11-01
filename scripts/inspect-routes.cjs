// scripts/inspect-routes.cjs
// Scans app/ directory to map out all routes and find the story reader file.
// Run: node scripts/inspect-routes.cjs

const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();

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
      e.name.startsWith("page.") &&
      (e.name.endsWith(".tsx") ||
        e.name.endsWith(".jsx") ||
        e.name.endsWith(".js"))
    ) {
      out.push(p);
    }
  }
  return out;
}

const pages = walk(path.join(ROOT, "app"), []);

console.log("=== ONESIMOS ROUTE MAP ===");
console.log("Found " + pages.length + " pages in app/\n");

const readerCandidates = [];

pages.forEach((p) => {
  const rel = path.relative(path.join(ROOT, "app"), p).replace(/\\/g, "/");
  const route =
    "/" +
    rel
      .replace(/\/page\.(tsx|jsx|js)$/, "")
      .replace(/^page\.(tsx|jsx|js)$/, "");
  console.log("  Route: " + (route === "/page" ? "/" : route));
  console.log("  File:  app/" + rel + "\n");

  if (/read|story|book|chapter/i.test(rel)) {
    readerCandidates.push("app/" + rel);
  }
});

console.log("=== STORY READER CANDIDATES ===");
if (readerCandidates.length === 0) {
  console.log(
    "No obvious reader routes found matching /read, /story, /book, or /chapter.",
  );
} else {
  readerCandidates.forEach((c) => console.log("  👉 " + c));
}
console.log("");
