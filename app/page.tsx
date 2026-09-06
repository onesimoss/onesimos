import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#1E90FF] text-white flex flex-col font-sans relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-80 animate-float-slow">☁️</div>
      <div className="absolute top-20 right-20 text-4xl opacity-60 animate-float-fast">☁️</div>
      <div className="absolute bottom-10 left-1/4 text-5xl opacity-60 animate-float-slow">☁️</div>
      
      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto w-full flex justify-between items-center py-8 px-6 md:px-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1E90FF] font-extrabold text-xl">O</div>
          <span className="text-2xl font-extrabold tracking-tight">ONSIMOS</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <a href="#" className="hover:text-white/80 transition-colors">HOW IT WORKS</a>
          <a href="#" className="hover:text-white/80 transition-colors">THE STORY</a>
          <a href="#" className="hover:text-white/80 transition-colors">PARENT PORTAL</a>
        </div>
        
        <Link 
          href="/parent/login"
          className="px-6 py-2 bg-white text-[#1E90FF] rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
        >
          LOG IN
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 md:grid-cols-2 items-center px-6 md:px-12 pb-20">
        
        {/* Left: Bold Typography */}
        <div className="flex flex-col justify-center mb-10 md:mb-0">
          <div className="flex items-center gap-4 mb-4 text-sm font-semibold tracking-widest text-white/80">
            <span className="bg-[#FFD166] text-[#1E90FF] px-3 py-1 rounded-full text-xs font-extrabold">NEW</span>
            <span>IMMERSIVE READING EXPERIENCE</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-6 drop-shadow-2xl">
            LEARN TO
            <br />
            <span className="text-[#FFD166]">LOVE</span> READING
          </h1>
          
          <p className="text-lg md:text-xl text-white/85 max-w-md mb-10">
            Explore a world of stories, unlock new phonics skills, and watch your child's confidence soar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <button className="flex items-center gap-3 px-8 py-4 bg-[#FF7B54] text-white rounded-full font-bold text-lg hover:bg-[#ff6840] hover:scale-105 transition-all shadow-2xl">
              <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#FF7B54] text-xs">▶</span>
              WATCH TRAILER
            </button>
            <Link 
              href="/parent/login"
              className="px-8 py-4 border-2 border-white/40 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
            >
              START A FAMILY
            </Link>
          </div>
        </div>

        {/* Right: Premium 3D Character (Placeholder) */}
        <div className="relative flex justify-center items-center h-[400px] md:h-[600px]">
          {/* Drop Shadow / Glow */}
          <div className="absolute w-3/4 h-3/4 bg-[#0b5fa8] rounded-full blur-3xl opacity-50"></div>
          
          {/* The Character */}
          <div className="relative z-10 text-[15rem] md:text-[25rem] leading-none drop-shadow-2xl animate-float-big">
            🦊
          </div>

          {/* Small Accent Cards like the reference */}
          <div className="absolute top-10 left-0 bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-xl">
            <p className="text-xs font-bold text-white">TOP READ</p>
            <p className="text-xl font-black">The Moon Rabbit</p>
            <p className="text-xs text-white/80">⭐ 4.9 (1.2k)</p>
          </div>
          
          <div className="absolute bottom-10 right-0 bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-xl">
            <p className="text-3xl">🍎</p>
            <p className="text-xs font-bold text-white mt-1">Phonics Fun</p>
          </div>
        </div>
      </div>
    </main>
  );
}