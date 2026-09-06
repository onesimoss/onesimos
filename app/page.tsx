import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FFF8EE] text-[#4A3B32] font-sans overflow-hidden relative">
      
      {/* Decorative Background Shapes (Soft pastel blobs) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FDEBD0] rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#D8F3DC] rounded-full blur-3xl opacity-60"></div>
      
      {/* Navigation Bar */}
      <nav className="relative z-10 max-w-6xl mx-auto flex justify-between items-center py-6 px-6">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <div className="w-10 h-10 bg-[#FFB703] rounded-full flex items-center justify-center text-2xl shadow-md">🦊</div>
          <span className="text-2xl font-extrabold tracking-tight text-[#3A2E2A]">WonderQuest</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-semibold text-[#6D5D55]">
          <Link href="/parent/login" className="hover:text-[#FFB703] transition-colors">Parent Portal</Link>
          <Link href="/kids" className="hover:text-[#FFB703] transition-colors">Kid Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left: Text and CTAs */}
        <div>
          <div className="inline-block bg-[#FFE5D9] text-[#E76F51] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            A Digital Library for Curious Kids
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-[#3A2E2A]">
            Learn to <br />
            <span className="text-[#E76F51]">Love Reading</span>
          </h1>
          <p className="text-lg text-[#6D5D55] mb-8 max-w-md">
            Interactive stories, phonics games, and cozy bedtime tales designed to nurture literacy, empathy, and focus.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/parent/login" 
              className="px-8 py-4 bg-[#E76F51] text-white rounded-full font-bold shadow-lg hover:bg-[#D65B3E] hover:scale-105 transition-all"
            >
              Get 7 Days Free →
            </Link>
            <Link 
              href="/kids" 
              className="px-8 py-4 bg-white text-[#4A3B32] rounded-full font-bold border border-[#EAD5C3] hover:bg-[#FFF8EE] hover:scale-105 transition-all"
            >
              View Kid Login
            </Link>
          </div>
          
          {/* Trust Badges */}
          <div className="mt-10 flex gap-8">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-[#3A2E2A]">3K+</p>
              <p className="text-xs text-[#8C7B72]">Expertly Curated</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-[#3A2E2A]">850K</p>
              <p className="text-xs text-[#8C7B72]">Families Subscribed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-[#3A2E2A]">4.9/5</p>
              <p className="text-xs text-[#8C7B72]">App Store Rating</p>
            </div>
          </div>
        </div>

        {/* Right: Character Showcase */}
        <div className="relative flex justify-center items-center">
          {/* Floating Character (Panda) */}
          <div className="w-64 h-64 md:w-80 md:h-80 bg-[#FFF] rounded-full shadow-2xl flex items-center justify-center border-8 border-[#FFE5D9] relative z-10">
            <span className="text-8xl md:text-9xl animate-float">🐼</span>
          </div>
          
          {/* Floating Cards */}
          <div className="absolute -bottom-4 -left-4 bg-[#FFB703] text-white px-4 py-2 rounded-2xl shadow-lg text-sm font-bold rotate-[-6deg] z-20">
            Bedtime Stories
          </div>
          <div className="absolute top-0 -right-4 bg-[#D8F3DC] text-[#3A5A40] px-4 py-2 rounded-2xl shadow-lg text-sm font-bold rotate-[6deg] z-20">
            🔤 Phonics Fun
          </div>

          {/* Decorative Sun / Stars */}
          <div className="absolute top-10 right-20 text-4xl animate-spin-slow text-[#FFB703]">⭐</div>
          <div className="absolute bottom-10 left-0 text-3xl text-[#FFB703]">✨</div>
        </div>
      </div>

      {/* Bottom "Book" Feature Strip */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-[2rem] shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6 border border-[#F0E6DA]">
          
          {/* Feature 1 */}
          <div className="flex flex-col items-start">
            <div className="w-12 h-12 rounded-full bg-[#FFE5D9] flex items-center justify-center text-2xl mb-4">📱</div>
            <h3 className="text-xl font-bold text-[#3A2E2A] mb-2">Take the Library Anywhere</h3>
            <p className="text-sm text-[#6D5D55]">Download favorites for car rides, flights, and camping trips.</p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-start">
            <div className="w-12 h-12 rounded-full bg-[#D8F3DC] flex items-center justify-center text-2xl mb-4">🌱</div>
            <h3 className="text-xl font-bold text-[#3A2E2A] mb-2">Discover Your Next Favorite</h3>
            <p className="text-sm text-[#6D5D55]">Seasonal picks updated every Monday morning.</p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-start">
            <div className="w-12 h-12 rounded-full bg-[#E0AAFF] flex items-center justify-center text-2xl mb-4">🎧</div>
            <h3 className="text-xl font-bold text-[#3A2E2A] mb-2">Bedtime Stories & Audio</h3>
            <p className="text-sm text-[#6D5D55]">High-fidelity narration and soundscapes designed to help kids drift off.</p>
          </div>

        </div>
      </div>

    </main>
  );
}