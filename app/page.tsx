"use client";
import { useState } from "react";
import Link from "next/link";

export default function ChildDashboard() {
  const [theme, setTheme] = useState("dino");

  // 10 Rich Theme Gradients & Mascots
  const themes = {
    dino: { bg: "bg-gradient-to-br from-lime-200 via-emerald-100 to-teal-200", text: "text-emerald-900", button: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-300", mascot: "🦖", name: "Dino Land" },
    space: { bg: "bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-900", text: "text-white", button: "bg-fuchsia-500 hover:bg-fuchsia-600 shadow-fuchsia-900", mascot: "👨‍🚀", name: "Space Zone" },
    ocean: { bg: "bg-gradient-to-br from-cyan-300 via-blue-400 to-indigo-400", text: "text-blue-950", button: "bg-blue-600 hover:bg-blue-700 shadow-blue-300", mascot: "🐙", name: "Ocean World" },
    candy: { bg: "bg-gradient-to-br from-pink-300 via-rose-200 to-orange-200", text: "text-rose-900", button: "bg-rose-500 hover:bg-rose-600 shadow-rose-300", mascot: "🍭", name: "Candy Land" },
    jungle: { bg: "bg-gradient-to-br from-yellow-200 via-amber-200 to-green-300", text: "text-amber-900", button: "bg-amber-500 hover:bg-amber-600 shadow-amber-300", mascot: "🐒", name: "Jungle Boogie" },
    arctic: { bg: "bg-gradient-to-br from-blue-100 via-slate-100 to-purple-200", text: "text-slate-800", button: "bg-slate-600 hover:bg-slate-700 shadow-slate-300", mascot: "🐧", name: "Arctic Pals" },
    fairy: { bg: "bg-gradient-to-br from-purple-200 via-pink-100 to-indigo-300", text: "text-purple-900", button: "bg-purple-500 hover:bg-purple-600 shadow-purple-300", mascot: "🧚", name: "Fairy Tales" },
    robot: { bg: "bg-gradient-to-br from-gray-200 via-slate-300 to-gray-400", text: "text-gray-900", button: "bg-gray-700 hover:bg-gray-800 shadow-gray-300", mascot: "🤖", name: "Robot Lab" },
    pirate: { bg: "bg-gradient-to-br from-amber-100 via-orange-200 to-red-300", text: "text-red-900", button: "bg-red-600 hover:bg-red-700 shadow-red-300", mascot: "🏴‍☠️", name: "Pirate Cove" },
    castle: { bg: "bg-gradient-to-br from-fuchsia-200 via-purple-200 to-blue-200", text: "text-purple-900", button: "bg-purple-600 hover:bg-purple-700 shadow-purple-300", mascot: "🏰", name: "Castle Quest" }
  };

  const currentTheme = themes[theme];

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} flex flex-col items-center justify-center p-6 transition-all duration-700 ease-in-out relative overflow-hidden`}>
      
      {/* Cute Colorful Doodle Elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-pulse">☁️</div>
      <div className="absolute bottom-20 left-20 text-7xl opacity-20 animate-bounce">✨</div>
      <div className="absolute top-20 right-20 text-8xl opacity-20 animate-spin-slow">🌈</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-pulse">⭐</div>
      {/* SVG Doodle Blob */}
      <svg className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M45.7,-63.9C58.9,-54.1,68.6,-39.7,73.5,-23.3C78.4,-6.9,78.5,11.6,71.6,27.1C64.8,42.7,51.1,55.3,35.7,63.5C20.3,71.7,3.2,75.5,-14.3,71.3C-31.8,67.1,-49.7,54.9,-60.3,38.6C-70.9,22.3,-74.2,1.9,-69.8,-16.4C-65.4,-34.7,-53.3,-50.9,-38.5,-60.5C-23.7,-70.1,-6.2,-73.1,10.4,-72.4C27,-71.7,43.6,-67.3,45.7,-63.9Z" transform="translate(100 100)" />
      </svg>

      {/* Theme Selection with Rich Tooltip Styling */}
      <div className="z-10 absolute top-4 right-4 flex gap-2 bg-white/30 p-2 rounded-full backdrop-blur-xl shadow-lg border border-white/50">
        {Object.keys(themes).map((key) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            title={themes[key].name}
            className={`w-10 h-10 rounded-full text-xl flex items-center justify-center transition-all duration-300 ${theme === key ? "bg-white scale-110 shadow-md ring-2 ring-offset-2 ring-[#FCE588]" : "hover:scale-110 opacity-70"}`}
          >
            {themes[key].mascot}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center gap-8 max-w-2xl">
        
        {/* Animated Mascot */}
        <div className="text-9xl md:text-[10rem] animate-bounce drop-shadow-2xl transform hover:scale-110 transition-transform duration-500">
          {currentTheme.mascot}
        </div>

        {/* Premium Type */}
        <h1 className="text-5xl md:text-8xl font-black leading-tight drop-shadow-lg tracking-tight">
          Ready to Read?
        </h1>
        
        <p className={`text-xl md:text-3xl font-medium opacity-90 backdrop-blur-sm bg-white/20 px-6 py-2 rounded-full border border-white/30`}>
          Let's explore {currentTheme.name}!
        </p>

        {/* The MASSIVE Fun Button with Shadow and Hover Lift */}
        <button className={`relative group ${currentTheme.button} text-white text-3xl md:text-5xl font-extrabold px-14 py-8 md:px-20 md:py-10 rounded-[3rem] shadow-2xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-3xl active:translate-y-0 active:scale-95`}>
          <span className="absolute -top-3 -left-3 text-4xl animate-spin-slow">🔊</span>
          📚 START READING
        </button>

        {/* Fun Star Rewards */}
        <div className="flex gap-6 mt-4 text-5xl md:text-6xl drop-shadow-lg">
          <span className="hover:scale-125 transition-transform">⭐</span>
          <span className="hover:scale-125 transition-transform">⭐</span>
          <span className="hover:scale-125 transition-transform">⭐</span>
        </div>

      </main>

      {/* Secret Parent Link */}
      <Link href="/parent" className="absolute bottom-4 right-6 text-xs font-semibold uppercase tracking-widest underline opacity-40 hover:opacity-100 transition-opacity">
        Parent Login
      </Link>
    </div>
  );
}