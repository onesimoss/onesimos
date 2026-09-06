import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#8B5CF6] overflow-hidden">
      
      {/* THE BACKGROUND IMAGE - Direct <img> tag to bypass optimizer */}
      <div className="absolute inset-0 z-0 w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/background.png" 
          alt="Onesimos background" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* THE CONTENT ON TOP */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        
        {/* NAVIGATION - Signup & Login */}
        <nav className="absolute top-0 left-0 right-0 flex justify-center items-center pt-8">
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
        <div className="max-w-4xl mx-auto text-center px-6 mt-24">
          <h1 className="font-achiko text-7xl md:text-9xl font-black text-white mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
            ONESIMOS
          </h1>
          <p className="text-xl md:text-2xl text-white font-medium mb-10 max-w-2xl mx-auto drop-shadow-lg">
            A playful learning platform where kids unlock incredible stories, phonics adventures, and build a lifelong love for reading.
          </p>
        </div>

        {/* SOCIAL PROOF BADGES */}
        <div className="flex justify-center gap-6 text-white text-sm font-bold drop-shadow-md">
          <span>🛡️ Kid-Friendly</span>
          <span>🚫 No Ads</span>
          <span>🎯 Ages 3-9</span>
        </div>

      </div>
    </main>
  );
}