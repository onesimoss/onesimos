/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Kid Frontend Palette
        "kid-sky": "#87CEEB", // Bright, calm background
        "kid-sun": "#FFD166", // Buttons and rewards
        "kid-coral": "#EF476F", // Accents and warnings
        "kid-mint": "#06D6A0", // Success and positive feedback
        "kid-navy": "#073B4C", // Kid text (soft, not stark black)
        "kid-cream": "#FFFDF7", // Cards and panels

        // Parent Backend Palette (Clean, professional, separate)
        "parent-bg": "#F8FAFC", // Light gray background
        "parent-card": "#FFFFFF", // White cards
        "parent-text": "#1E293B", // Dark blue-gray text
        "parent-accent": "#4F46E5", // Indigo for buttons/links
      },
      borderRadius: {
        blob: "2rem", // Large, rounded, chunky corners
      },
      boxShadow: {
        "kid-soft": "0 10px 30px -10px rgba(0,0,0,0.15)",
        "kid-hover": "0 20px 40px -10px rgba(0,0,0,0.2)",
      },
      fontFamily: {
        kid: ['"Comic Neue"', "cursive"], // Suggested: Import "Comic Neue" or "Baloo 2"
        parent: ['"Inter"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
