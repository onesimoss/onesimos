import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#8B5CF6] overflow-hidden">
      
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

      {/* HERO TEXT */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <h1 className="font-achiko text-7xl md:text-9xl font-black text-white mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
          ONESIMOS
        </h1>
        <p className="text-xl md:text-2xl text-white/90 font-medium mb-10 max-w-2xl mx-auto">
          A playful learning platform where kids unlock incredible stories, phonics adventures, and build a lifelong love for reading.
        </p>
      </div>

      {/* SOCIAL PROOF BADGES */}
      <div className="mt-6 flex justify-center gap-6 text-white/80 text-sm font-semibold">
        <span>🛡️ Kid-Friendly</span>
        <span>🚫 No Ads</span>
        <span>🎯 Ages 3-9</span>
      </div>

      {/* DOWNLOAD BUTTONS */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link href="#" className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-colors shadow-lg">
          <Image src="/icons/apple-store.svg" alt="Apple Logo" width={24} height={24} />
          <div className="text-left">
            <p className="text-[10px] leading-none opacity-80">Download on the</p>
            <p className="text-lg font-bold leading-none mt-1">App Store</p>
          </div>
        </Link>
        
        <Link href="#" className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-colors shadow-lg">
          <Image src="/icons/google-play.svg" alt="Google Play Logo" width={24} height={24} />
          <div className="text-left">
            <p className="text-[10px] leading-none opacity-80">Get it on</p>
            <p className="text-lg font-bold leading-none mt-1">Google Play</p>
          </div>
        </Link>
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