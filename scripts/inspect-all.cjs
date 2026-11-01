const fs = require("fs");
const path = require("path");

console.log(
  "==================== ONESIMOS FILE INSPECTION ====================",
);

// 1. Inspect lib/fonts.ts
const fontsPath = path.join(__dirname, "..", "lib", "fonts.ts");
if (fs.existsSync(fontsPath)) {
  console.log("\n[1] lib/fonts.ts:");
  console.log(fs.readFileSync(fontsPath, "utf8"));
} else {
  console.log("\n[1] lib/fonts.ts: NOT FOUND");
}

// 2. Inspect app/layout.tsx
const layoutPath = path.join(__dirname, "..", "app", "layout.tsx");
if (fs.existsSync(layoutPath)) {
  console.log("\n[2] app/layout.tsx:");
  console.log(fs.readFileSync(layoutPath, "utf8"));
} else {
  console.log("\n[2] app/layout.tsx: NOT FOUND");
}

// 3. Inspect app/page.tsx status
const pagePath = path.join(__dirname, "..", "app", "page.tsx");
if (fs.existsSync(pagePath)) {
  const content = fs.readFileSync(pagePath, "utf8");
  console.log("\n[3] app/page.tsx Summary:");
  console.log("- Total length:", content.length, "characters");
  console.log("- Total lines:", content.split("\n").length);
  console.log("- Has framer-motion?:", content.includes("framer-motion"));
  console.log("- Has lucide?:", content.includes("lucide"));
  console.log("\n--- First 30 lines of app/page.tsx ---");
  console.log(content.split("\n").slice(0, 30).join("\n"));
} else {
  console.log("\n[3] app/page.tsx: NOT FOUND");
}

console.log(
  "==================================================================",
);
