import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#1E3A8A] to-[#3B82F6] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative Background Elements (Immersive feel) */}
      <div className="absolute top-20 left-10 text-8xl opacity-20 animate-bounce">🦖</div>
      <div className="absolute bottom-20 right-10 text-9xl opacity-20 animate-pulse">🌊</div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[20rem] opacity-10 select-none pointer-events-none">🐋</div>

      {/* Logo / Header */}
      <div className="z-10 flex flex-col items-center mb-8">
        <h1 className="text-5xl md:text-7xl font-kid font-extrabold text-white drop-shadow-lg tracking-tight">
          Wonder<span className="text-kid-sun">Quest</span>
        </h1>
        <p className="text-kid-sky font-kid text-xl mt-2 tracking-widest uppercase">
          Learning
        </p>
      </div>

      {/* Hero Content */}
      <div className="z-10 max-w-3xl text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-kid font-bold mb-6 leading-tight drop-shadow-lg">
          Let the world be <br />
          <span className="text-kid-sun">their classroom.</span>
        </h2>
        <p className="text-xl md:text-2xl text-blue-100 font-kid mb-10">
          Immersive reading adventures, phonics, and exploration designed for curious young minds.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/parent/login" 
            className="px-10 py-4 bg-kid-sun text-kid-navy rounded-full font-kid font-bold text-xl hover:scale-105 hover:shadow-xl transition-all duration-200"
          >
            🚀 Get Started
          </Link>
          
          <Link 
            href="/kids" 
            className="px-10 py-4 border-2 border-white/30 text-white rounded-full font-kid font-bold text-xl hover:bg-white/10 hover:border-white/50 transition-all duration-200"
          >
            👧 Returning Kids
          </Link>
        </div>
      </div>

      {/* App Store / Footer Note */}
      <div className="z-10 mt-8 flex flex-col items-center gap-4">
        <button className="flex items-center gap-3 bg-black border border-white/20 px-6 py-3 rounded-xl hover:bg-gray-900 transition-colors">
          <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          <div className="text-left">
            <p className="text-[10px] leading-none text-gray-400">Download on the</p>
            <p className="text-lg leading-none font-bold">App Store</p>
          </div>
        </button>
        
        <p className="text-xs text-blue-300/50 font-parent mt-4">
          © 2024 WonderQuest. A safe space for families.
        </p>
      </div>
      
    </main>
  );
}