const fs = require("fs");
const path = require("path");

function scanAndFix(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      scanAndFix(fullPath);
    } else if (file.name.endsWith(".tsx") || file.name.endsWith(".ts")) {
      let content = fs.readFileSync(fullPath, "utf8");
      if (
        content.includes("themes[theme]") ||
        content.includes("themes[currentTheme]")
      ) {
        console.log(`[PATCHING TYPE INDEXING] in ${fullPath}`);
        content = content.replace(
          /themes\[theme\]/g,
          "(themes as Record<string, any>)[theme]",
        );
        content = content.replace(
          /themes\[currentTheme\]/g,
          "(themes as Record<string, any>)[currentTheme]",
        );
        fs.writeFileSync(fullPath, content, "utf8");
        console.log(`[SUCCESS] Patched ${fullPath}`);
      }
    }
  }
}

console.log("Fixing TypeScript object indexer signatures...");
scanAndFix("app");
console.log("Indexing fix complete!");
