import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#2A5B2E] flex flex-col relative overflow-hidden">
      
      {/* Subtle Decorations (Static, not animated to save battery) */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#3B7A40] to-[#1B3B1E] z-0"></div>
      <div className="absolute top-10 left-10 text-6xl opacity-40 z-0">🍃</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-40 z-0">🌿</div>

      {/* Clean Nav Bar */}
      <nav className="relative z-10 max-w-7xl mx-auto w-full flex justify-between items-center py-6 px-6 md:px-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FCD34D] rounded-full flex items-center justify-center text-2xl shadow-lg">⚓</div>
          <span className="text-3xl font-extrabold tracking-tight text-white">ONSIMOS</span>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-6 md:px-10 pb-12">
        
        {/* Left Side: Text & CTAs */}
        <div className="flex flex-col justify-center">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full w-fit mb-8">
            A World of Adventures Awaits
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] text-white mb-6 drop-shadow-lg">
            EXPLORE. READ.
            <br />
            <span className="text-[#FCD34D]">DISCOVER.</span>
          </h1>
          
          <p className="text-lg text-white/85 max-w-md mb-10">
            Join the journey! Create an account to unlock immersive stories, phonics games, and a world of imagination for your little ones.
          </p>

          {/* Login / Signup Area */}
          <div className="bg-white rounded-3xl p-6 max-w-md shadow-2xl">
            <div className="flex gap-3 mb-6">
              <Link 
                href="/parent/login"
                className="flex-1 text-center py-3 bg-[#2A5B2E] text-white rounded-full font-bold hover:bg-[#1B3B1E] transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/parent/signup"
                className="flex-1 text-center py-3 bg-[#FCD34D] text-[#2A5B2E] rounded-full font-bold hover:bg-[#fecf23] transition-colors"
              >
                Signup
              </Link>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gray-300"></div>
              <span className="text-xs text-gray-500 font-semibold uppercase">Or Get The App</span>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div>

            {/* Future Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors">
                <span className="text-xl">🍎</span> App Store
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors">
                <span className="text-xl">🤖</span> Google Play
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: The Illustration Space */}
        <div className="relative hidden lg:flex justify-center items-center h-[500px]">
          {/* This is the placeholder for your custom ship illustration */}
          <div className="relative z-10 w-full h-full bg-white/10 border-2 border-dashed border-white/30 rounded-[2rem] flex flex-col items-center justify-center text-center p-10">
            <span className="text-9xl mb-4 drop-shadow-2xl">⛵</span>
            <p className="text-white font-bold text-xl mb-2">Your Adventure Starts Here</p>
            <p className="text-white/70 max-w-xs">
              [Placeholder: Insert the beautiful pirate ship illustration here exactly as shown in the reference]
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}