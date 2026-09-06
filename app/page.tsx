import Link from "next/link";
import { AVATARS } from "@/lib/avatars";

export default function KidHome() {
  // NOTE: In Phase 2, we will use Supabase to fetch the ACTUAL family from the DB.
  // For now, we will show the grid for the "Returning User" state.

  return (
    <main className="min-h-screen bg-gradient-to-b from-kid-sky via-sky-100 to-white flex flex-col items-center justify-center p-6 overflow-hidden relative">
      
      {/* Decorative floating clouds */}
      <div className="absolute top-10 left-10 text-6xl opacity-50 animate-bounce">☁️</div>
      <div className="absolute top-20 right-20 text-4xl opacity-40 animate-pulse">☁️</div>
      <div className="absolute bottom-20 left-20 text-5xl opacity-30 animate-bounce">🎈</div>

      {/* "New User" Gate - Added */}
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
        <Link href="/parent/login" className="text-kid-navy text-xs font-bold">
          ➕ New Family Setup
        </Link>
      </div>

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
            // disabled button for now, will be connected in Phase 3
            className="group flex flex-col items-center justify-center p-6 bg-kid-cream rounded-blob shadow-kid-soft transition-all duration-200 hover:-translate-y-2 hover:shadow-kid-hover border-4 border-transparent hover:border-kid-sun cursor-pointer"
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