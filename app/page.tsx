// app/page.tsx (Kid Frontend)
import Link from "next/link";
import { AVATARS } from "@/lib/avatars";

export default function KidHome() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-kid-sky via-sky-100 to-white flex flex-col items-center justify-center p-6 overflow-hidden relative">
      
      {/* Decorative floating clouds (CSS only for now) */}
      <div className="absolute top-10 left-10 text-6xl opacity-50 animate-bounce">☁️</div>
      <div className="absolute top-20 right-20 text-4xl opacity-40 animate-pulse">☁️</div>
      <div className="absolute bottom-20 left-20 text-5xl opacity-30 animate-bounce">🎈</div>

      <h1 className="text-5xl font-kid font-bold text-kid-navy mb-2 drop-shadow-sm">
        Who is reading today?
      </h1>
      <p className="text-kid-navy/70 font-kid text-lg mb-10">
        Tap your buddy to jump in!
      </p>

      {/* Avatar Grid */}
      <div className="grid grid-cols-3 gap-6 max-w-lg w-full">
        {AVATARS.map((avatar) => (
          <button
            key={avatar.id}
            className="group flex flex-col items-center justify-center p-6 bg-kid-cream rounded-blob shadow-kid-soft transition-all duration-200 hover:-translate-y-2 hover:shadow-kid-hover border-4 border-transparent hover:border-kid-sun"
          >
            <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">
              {avatar.emoji}
            </div>
            <span className="font-kid font-bold text-kid-navy text-lg">
              {avatar.name}
            </span>
          </button>
        ))}
      </div>

      {/* Parent Gate - The only link to the backend */}
      <Link 
        href="/parent/login" 
        className="mt-12 text-sm font-kid text-kid-navy/60 hover:text-kid-navy underline underline-offset-4"
      >
        🔒 Grown-Ups Click Here
      </Link>
    </main>
  );
}