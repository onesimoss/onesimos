import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#8B5CF6] overflow-hidden relative">
      
      {/* NAVIGATION - Signup & Login */}
      <nav className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 flex justify-center items-center pt-8 mb-16">
        <div className="flex items-center gap-2 px-2 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
          <Link href="/parent/signup" className="px-6 py-2 bg-white text-[#4C1D95] font-bold rounded-full text-sm hover:bg-gray-100 transition-colors">
            Signup
          </Link>
          <Link href="/parent/login" className="px-6 py-2 text-white font-bold rounded-full text-sm hover:bg-white/10 transition-colors">
            Login
          </Link>
        </div>
      </nav>

      {/* MAIN HERO AREA WITH CHARACTER */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-10 pb-20">
        
        {/* LEFT SIDE: TEXT & BUTTONS */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1 className="font-achiko text-7xl md:text-9xl font-black text-white mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
            ONESIMOS
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-8 max-w-xl mx-auto lg:mx-0">
            A playful learning platform where kids unlock incredible stories, phonics adventures, and build a lifelong love for reading.
          </p>

          {/* SOCIAL PROOF BADGES */}
          <div className="flex justify-center lg:justify-start gap-6 text-white/80 text-sm font-semibold mb-10">
            <span>🛡️ Kid-Friendly</span>
            <span>🚫 No Ads</span>
            <span>🎯 Ages 3-9</span>
          </div>

          {/* DOWNLOAD BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="#" className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-colors shadow-lg">
              {/* Make sure you put 'apple-store.svg' in public/icons/ */}
              <Image src="/icons/apple-store.svg" alt="Apple Logo" width={24} height={24} />
              <div className="text-left">
                <p className="text-[10px] leading-none opacity-80">Download on the</p>
                <p className="text-lg font-bold leading-none mt-1">App Store</p>
              </div>
            </Link>
            
            <Link href="#" className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-colors shadow-lg">
              {/* Make sure you put 'google-play.svg' in public/icons/ */}
              <Image src="/icons/google-play.svg" alt="Google Play Logo" width={24} height={24} />
              <div className="text-left">
                <p className="text-[10px] leading-none opacity-80">Get it on</p>
                <p className="text-lg font-bold leading-none mt-1">Google Play</p>
              </div>
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE: THE CHARACTER */}
        <div className="w-full lg:w-1/2 relative flex justify-center items-center h-[300px] md:h-[400px] lg:h-[600px]">
          {/* Soft Glow Behind Fox */}
          <div className="absolute w-3/4 h-3/4 bg-[#6D28D9] rounded-full blur-3xl opacity-50"></div>
          
          {/* The Character (3D Fox) */}
          <div className="relative z-10 text-[12rem] md:text-[16rem] lg:text-[22rem] leading-none drop-shadow-2xl">
            🦊
          </div>
          
          {/* Floating Elements (Static, for depth) */}
          <div className="absolute top-10 left-0 bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-xl">
            <p className="text-xs text-white/90 font-bold">TOP READ</p>
            <p className="text-xl font-black text-white">The Moon Rabbit</p>
            <p className="text-xs text-white/80">⭐ 4.9 (1.2k)</p>
          </div>
          
          <div className="absolute bottom-20 right-0 bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-xl">
            <p className="text-3xl">📚</p>
            <p className="text-xs font-bold text-white mt-1">100+ Stories</p>
          </div>
        </div>
      </div>

      {/* CURVED BLOB TRANSITION */}
      <div className="absolute -bottom-1 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[60px] md:h-[120px]">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 45C840 60 960 90 1080 105C1200 120 1320 120 1380 120L1440 120V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>

    </main>
  );
}