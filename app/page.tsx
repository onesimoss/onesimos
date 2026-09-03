import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f2eb] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-[#fcf9f5] rounded-3xl shadow-xl p-12 border border-white/50">
        
        {/* Brand */}
        <div className="flex items-center gap-3 mb-12">
          <h1 className="text-2xl font-semibold text-[#1e1916] tracking-tight">
            Onesimos
          </h1>
          <span className="text-xs font-medium text-[#8a7e74] uppercase tracking-wider bg-black/5 px-3 py-1 rounded-full border border-black/5">
            The Useful Tutor
          </span>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-[#1e1916] leading-tight mb-4">
            Read aloud.
            <br />
            <span className="text-[#b28b6a]">Get better.</span> Quietly.
          </h2>
          <p className="text-[#4a423b] text-lg max-w-2xl mx-auto leading-relaxed">
            A tutor that never tests, never pushes, and never lets a child feel like school.
            Just 20 minutes a night.
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center mb-16">
          <Link
            href="/dashboard"
            className="inline-block bg-[#1e1916] text-white px-12 py-4 rounded-full text-lg font-medium hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            🎯 Start Free Trial
          </Link>
          <p className="text-[#8a7e74] text-sm mt-3">
            No credit card required • Cancel anytime
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">📖</div>
            <h3 className="font-semibold text-[#1e1916] text-sm">Reads Aloud</h3>
            <p className="text-[#8a7e74] text-xs">Every word, out loud</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎙️</div>
            <h3 className="font-semibold text-[#1e1916] text-sm">Listens</h3>
            <p className="text-[#8a7e74] text-xs">Catches every stumble</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-[#1e1916] text-sm">Tracks</h3>
            <p className="text-[#8a7e74] text-xs">Private parent log</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">❤️</div>
            <h3 className="font-semibold text-[#1e1916] text-sm">Builds Character</h3>
            <p className="text-[#8a7e74] text-xs">Compassion & resilience</p>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-12 pt-8 border-t border-black/5 text-center">
          <p className="text-[#4a423b] italic text-sm max-w-lg mx-auto">
            "My 8-year-old reads every night without being asked. 
            He thinks he's just telling a computer about dinosaurs."
          </p>
          <p className="text-[#8a7e74] text-xs mt-2">— Sarah, mom of 2</p>
        </div>
      </div>
    </main>
  );
}
