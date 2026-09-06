import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a3d62] via-[#1E90FF] to-[#4db8ff] text-white font-sans relative overflow-hidden">
      
      {/* Subtle Background Decorations (No heavy animations) */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 select-none pointer-events-none">☁️</div>
      <div className="absolute top-24 right-16 text-4xl opacity-20 select-none pointer-events-none">☁️</div>
      <div className="absolute bottom-10 left-1/4 text-5xl opacity-20 select-none pointer-events-none">🌿</div>

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto w-full flex justify-between items-center py-8 px-6 md:px-12">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#1E90FF] font-extrabold text-xl">O</div>
          <span className="text-3xl font-extrabold tracking-tight">ONSIMOS</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-white/90">
          <a href="#" className="hover:text-white transition-colors">HOW IT WORKS</a>
          <a href="#" className="hover:text-white transition-colors">THE STORY</a>
          <a href="#" className="hover:text-white transition-colors">PARENT PORTAL</a>
        </div>
        
        <Link 
          href="/parent/login"
          className="px-6 py-2 bg-white text-[#1E90FF] rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
        >
          LOG IN
        </Link>
      </nav>

      {/* Main Content Area - Balanced Grid */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col lg:flex-row items-center px-6 md:px-12 pb-20 pt-10 lg:pt-0">
        
        {/* Left: Text & CTAs */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-start text-left mb-10 lg:mb-0">
          <div className="bg-[#FFD166] text-[#0a3d62] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest mb-6">
            New: Phonics Adventures
          </div>
          
          <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tighter mb-6">
            WHERE 
            <br />
            <span className="text-[#FFD166]">CURIOSITY</span> 
            <br />
            MEETS STORYTIME.
          </h1>
          
          <p className="text-lg md:text-xl text-white/85 max-w-md mb-10 leading-relaxed">
            A safe, immersive world of reading where your child unlocks new stories, explores magical places, and builds confidence—one page at a time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Link 
              href="/parent/signup"
              className="flex-1 text-center px-8 py-4 bg-[#FFD166] text-[#0a3d62] rounded-full font-black text-lg hover:bg-[#fecf23] hover:scale-105 transition-all"
            >
              Create Family Account
            </Link>
            <Link 
              href="/parent/login"
              className="flex-1 text-center px-8 py-4 border-2 border-white/40 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
            >
              Parent Login
            </Link>
          </div>
        </div>

        {/* Right: The Fox Character */}
        <div className="w-full lg:w-1/2 relative flex justify-center items-center h-[300px] md:h-[450px] lg:h-[600px]">
          {/* Soft Glow Behind Fox */}
          <div className="absolute w-3/4 h-3/4 bg-[#0a3d62] rounded-full blur-3xl opacity-50"></div>
          
          {/* The Fox */}
          <div className="relative z-10 text-[12rem] md:text-[18rem] lg:text-[24rem] leading-none drop-shadow-2xl">
            🦊
          </div>

          {/* Floating Elements (Static) */}
          <div className="absolute top-10 right-0 bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-xl">
            <p className="text-xs text-white/90 font-bold">TOP READ</p>
            <p className="text-xl font-black">The Moon Rabbit</p>
            <p className="text-xs text-white/80">⭐ 4.9 (1.2k)</p>
          </div>
          
          <div className="absolute bottom-10 left-10 bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-xl">
            <p className="text-3xl">📚</p>
            <p className="text-xs font-bold text-white mt-1">100+ Stories</p>
          </div>
        </div>
      </div>
    </main>
  );
}