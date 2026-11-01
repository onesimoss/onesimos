const fs = require("fs");
const path = require("path");

function ensureDir(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    ensureDir(dirname);
    fs.mkdirSync(dirname);
  }
}

function writeFile(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`[CREATED/UPDATED] ${filePath}`);
}

// 1. Updated Globals CSS without problematic @apply inside @layer base
const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 216 100% 98%;
    --foreground: 226 46% 20%;
    --card: 0 0% 100%;
    --card-foreground: 226 46% 20%;
    --popover: 0 0% 100%;
    --popover-foreground: 226 46% 20%;
    --primary: 226 46% 20%;
    --primary-foreground: 0 0% 100%;
    --secondary: 70 78% 75%;
    --secondary-foreground: 226 46% 20%;
    --muted: 216 30% 95%;
    --muted-foreground: 215 16% 47%;
    --accent: 214 77% 69%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 226 46% 20%;
    --radius: 20px;
  }

  .dark {
    --background: 222 47% 11%;
    --foreground: 210 40% 98%;
    --card: 217 33% 17%;
    --card-foreground: 210 40% 98%;
    --popover: 217 33% 17%;
    --popover-foreground: 210 40% 98%;
    --primary: 214 77% 69%;
    --primary-foreground: 222 47% 11%;
    --secondary: 70 78% 75%;
    --secondary-foreground: 222 47% 11%;
    --muted: 217 19% 27%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 214 77% 69%;
    --accent-foreground: 222 47% 11%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217 19% 27%;
    --input: 217 19% 27%;
    --ring: 214 77% 69%;
  }
}

@layer base {
  * {
    border-color: hsl(var(--border));
    -webkit-tap-highlight-color: transparent;
  }
  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-family: var(--font-inter), sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
}

/* Mobile Capacitor touch target optimization */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}
`;

// 2. Verified Tailwind Config
const tailwindConfig = `import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          navy: "#1C274C",
          blue: "#71A6EE",
          lime: "#E1F18C",
          purple: "#E1C8F6",
          pink: "#F7D4DA",
          bg: "#F4F8FF",
          darkBg: "#0F172A",
          darkCard: "#1E293B",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        "4xl": "32px",
        "5xl": "40px",
        pill: "9999px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
`;

console.log("Fixing PostCSS layer compilation...");
writeFile("app/globals.css", globalsCss);
writeFile("tailwind.config.ts", tailwindConfig);
console.log("PostCSS fix applied successfully!");
