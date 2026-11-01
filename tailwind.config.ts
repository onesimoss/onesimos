import type { Config } from "tailwindcss";

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
          DEFAULT: "#1C274C",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#E1F18C",
          foreground: "#1C274C",
        },
        accent: {
          DEFAULT: "#71A6EE",
          foreground: "#FFFFFF",
        },
        purpleCard: {
          DEFAULT: "#E1C8F6",
          foreground: "#1C274C",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
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
