const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "..",
  "app",
  "kid",
  "[childId]",
  "page.tsx",
);

if (!fs.existsSync(filePath)) {
  console.error("File not found:", filePath);
  process.exit(1);
}

let content = fs.readFileSync(filePath, "utf8");

// Replace any leftover first_name queries or properties with name
content = content.replace(/first_name/g, "name");

fs.writeFileSync(filePath, content, "utf8");
console.log(
  "Successfully patched app/kid/[childId]/page.tsx: updated first_name references to name.",
);
