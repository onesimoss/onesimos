import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-[#333333]">
      
      {/* ---------------- HERO SECTION (PURPLE) ---------------- */}
      <section className="relative bg-[#8B5CF6] pt-8 pb-24 overflow-hidden">
        
        {/* NAVIGATION */}
        <nav className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 flex justify-center items-center mb-16">
          <div className="flex items-center gap-2 px-2 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
            <Link href="/" className="px-4 py-2 bg-white text-[#8B5CF6] font-bold rounded-full text-sm hover:bg-gray-100 transition-colors">Home</Link>
            <Link href="/parent/login" className="px-4 py-2 text-white font-bold rounded-full text-sm hover:bg-white/10 transition-colors">Parent Portal</Link>
            <div className="w-8 h-8 rounded-full bg-[#FFD166] flex items-center justify-center text-lg">🦊</div>
          </div>
        </nav>

        {/* HERO TEXT */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h1 className="text-7xl md:text-9xl font-black text-white mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
            ONSIMOS
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-10 max-w-2xl mx-auto">
            A playful learning platform where kids unlock incredible stories, phonics adventures, and build a lifelong love for reading.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/parent/signup"
              className="px-8 py-4 bg-[#4C1D95] text-white rounded-full font-bold text-lg hover:bg-[#381274] hover:scale-105 transition-all shadow-2xl"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/parent/login"
              className="px-8 py-4 bg-white/20 border border-white/40 text-white rounded-full font-bold text-lg hover:bg-white/30 transition-all"
            >
              How it Works
            </Link>
          </div>

          {/* SOCIAL PROOF BADGES */}
          <div className="mt-6 flex justify-center gap-6 text-white/80 text-sm font-semibold">
            <span>🛡️ Kid-Friendly</span>
            <span>🚫 No Ads</span>
            <span>🎯 Ages 3-12</span>
          </div>
        </div>

        {/* FLOATING POLAROIDS (Placeholders for real photos) */}
        <div className="absolute top-1/3 left-10 md:left-24 rotate-[-10deg] bg-white p-3 pb-8 rounded-lg shadow-2xl z-20 hidden lg:block">
          <div className="w-32 h-24 bg-[#3B82F6] rounded-md mb-2 flex items-center justify-center text-4xl">🧒</div>
          <p className="text-xs font-bold text-center text-gray-600">Making Magic</p>
        </div>
        <div className="absolute bottom-10 left-20 rotate-[6deg] bg-white p-3 pb-8 rounded-lg shadow-2xl z-20 hidden lg:block">
          <div className="w-32 h-24 bg-[#F59E0B] rounded-md mb-2 flex items-center justify-center text-4xl">👧</div>
          <p className="text-xs font-bold text-center text-gray-600">Reading Time</p>
        </div>
        <div className="absolute top-1/3 right-10 md:right-24 rotate-[12deg] bg-white p-3 pb-8 rounded-lg shadow-2xl z-20 hidden lg:block">
          <div className="w-32 h-24 bg-[#10B981] rounded-md mb-2 flex items-center justify-center text-4xl">👦</div>
          <p className="text-xs font-bold text-center text-gray-600">Learning Fun</p>
        </div>

        {/* CURVED BLOB TRANSITION */}
        <div className="absolute -bottom-1 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[60px] md:h-[120px]">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 45C840 60 960 90 1080 105C1200 120 1320 120 1380 120L1440 120V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ---------------- BOTTOM SECTION (WHITE CARDS) ---------------- */}
      <section className="bg-white pt-12 pb-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-[#333] mb-4">What They Can Do</h2>
          <p className="text-lg text-gray-500">Endless adventures, real skills.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Read */}
          <div className="bg-[#FFEDD5] rounded-3xl p-8 border-4 border-[#FED7AA] shadow-xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
            <div className="bg-white rounded-2xl p-4 h-40 mb-6 flex items-center justify-center shadow-inner">
              <span className="text-8xl group-hover:scale-110 transition-transform">📖</span>
            </div>
            <h3 className="text-2xl font-black text-[#9A3412] mb-2">Read Stories</h3>
            <p className="text-[#9A3412]/80 font-medium">Build comprehension with interactive, illustrated tales.</p>
          </div>

          {/* Card 2: Create */}
          <div className="bg-[#EDE9FE] rounded-3xl p-8 border-4 border-[#DDD6FE] shadow-xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
            <div className="bg-white rounded-2xl p-4 h-40 mb-6 flex items-center justify-center shadow-inner">
              <span className="text-8xl group-hover:scale-110 transition-transform">🎨</span>
            </div>
            <h3 className="text-2xl font-black text-[#5B21B6] mb-2">Make Art</h3>
            <p className="text-[#5B21B6]/80 font-medium">Express creativity through drawing and coloring games.</p>
          </div>

          {/* Card 3: Learn */}
          <div className="bg-[#FEF9C3] rounded-3xl p-8 border-4 border-[#FEF08A] shadow-xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
            <div className="bg-white rounded-2xl p-4 h-40 mb-6 flex items-center justify-center shadow-inner">
              <span className="text-8xl group-hover:scale-110 transition-transform">🔤</span>
            </div>
            <h3 className="text-2xl font-black text-[#854D0E] mb-2">Learn Phonics</h3>
            <p className="text-[#854D0E]/80 font-medium">Master sounds and letters with fun, interactive games.</p>
          </div>
        </div>
      </section>

    </main>
  );
}