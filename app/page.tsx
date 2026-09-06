import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      
      {/* Clean Nav Bar */}
      <nav className="relative z-10 max-w-7xl mx-auto w-full flex justify-between items-center py-6 px-6 md:px-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FCD34D] rounded-full flex items-center justify-center text-2xl shadow-lg">⚓</div>
          <span className="text-3xl font-extrabold tracking-tight text-[#2A5B2E]">ONSIMOS</span>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-6 md:px-10 pb-12">
        
        {/* Left Side: Text & CTAs */}
        <div className="flex flex-col justify-center">
          <div className="bg-[#2A5B2E] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full w-fit mb-8">
            A World of Adventures Awaits
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] text-[#2A5B2E] mb-6">
            EXPLORE. READ.
            <br />
            <span className="text-[#E76F51]">DISCOVER.</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-md mb-10">
            Join the journey! Create an account to unlock immersive stories, phonics games, and a world of imagination for your little ones.
          </p>

          {/* Login / Signup Area */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 max-w-md shadow-xl">
            <div className="flex gap-3 mb-6">
              <Link 
                href="/parent/login"
                className="flex-1 text-center py-3 bg-[#2A5B2E] text-white rounded-full font-bold hover:bg-[#1B3B1E] transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/parent/signup"
                className="flex-1 text-center py-3 bg-[#E76F51] text-white rounded-full font-bold hover:bg-[#D65B3E] transition-colors"
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

        {/* Right Side: The Exact Art */}
        <div className="relative hidden lg:flex justify-center items-center h-[500px]">
          {/* INSERT THE IMAGE HERE */}
          <img 
            src="/hero-art.jpg" 
            alt="Pirate adventure illustration" 
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </main>
  );
}