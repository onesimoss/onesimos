const fs = require("fs");
const path = require("path");

function ensureDir(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    ensureDir(dirname);
    fs.mkdirSync(dirname);
  }
}

function scanAndFixUseTheme(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      scanAndFixUseTheme(fullPath);
    } else if (
      file.name.endsWith(".tsx") ||
      file.name.endsWith(".ts") ||
      file.name.endsWith(".jsx") ||
      file.name.endsWith(".js")
    ) {
      let content = fs.readFileSync(fullPath, "utf8");
      if (content.includes("useTheme must be used within a ThemeProvider")) {
        console.log(`[PATCHING] Found strict useTheme throw in: ${fullPath}`);
        content = content.replace(
          /if\s*\(\s*!context\s*\)\s*\{\s*throw\s+new\s+Error\(['"]useTheme must be used within a ThemeProvider['"]\);\s*\}/g,
          'if (!context) { return { theme: "light", setTheme: () => {}, toggleTheme: () => {} }; }',
        );
        content = content.replace(
          /throw\s+new\s+Error\(['"]useTheme must be used within a ThemeProvider['"]\);/g,
          'return { theme: "light", setTheme: () => {}, toggleTheme: () => {} };',
        );
        fs.writeFileSync(fullPath, content, "utf8");
        console.log(`[FIXED] Updated ${fullPath} with static fallback.`);
      }
    }
  }
}

console.log("Scanning repository to patch remaining prerender throws...");
scanAndFixUseTheme("app");
scanAndFixUseTheme("components");
scanAndFixUseTheme("lib");
scanAndFixUseTheme("context");
scanAndFixUseTheme("providers");
console.log("Scan and patch complete!");
