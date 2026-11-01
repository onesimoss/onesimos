const fs = require("fs");
const path = require("path");

console.log("--- LIB/FONTS.TS ---");
try {
  console.log(
    fs.readFileSync(path.join(__dirname, "..", "lib", "fonts.ts"), "utf8"),
  );
} catch (e) {
  console.log("Not found or error:", e.message);
}

console.log("\n--- LIB/PAYMENTS.TS ---");
try {
  console.log(
    fs.readFileSync(path.join(__dirname, "..", "lib", "payments.ts"), "utf8"),
  );
} catch (e) {
  console.log("Not found or error:", e.message);
}

console.log("\n--- APP/PARENT/PRICING/PAGE.TSX ---");
try {
  console.log(
    fs.readFileSync(
      path.join(__dirname, "..", "app", "parent", "pricing", "page.tsx"),
      "utf8",
    ),
  );
} catch (e) {
  console.log("Not found or error:", e.message);
}
