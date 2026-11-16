const fs = require('fs');
const file = 'app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Ensure navExpanded state exists
if (!content.includes('navExpanded')) {
  content = content.replace(
    'const [menuOpen, setMenuOpen] = useState(false);',
    'const [menuOpen, setMenuOpen] = useState(false);\n  const [navExpanded, setNavExpanded] = useState(false);'
  );
}

// 2. Locate header end and main start case-insensitively
const lower = content.toLowerCase();
const headerEnd = lower.indexOf('</header>');
const mainStart = lower.indexOf('<main');

if (headerEnd !== -1 && mainStart !== -1) {
  const before = content.slice(0, headerEnd + 9);
  const after = content.slice(mainStart);

  const newMenuBlock = `

      {/* MOBILE MENU - FLOATING 3-COMPONENT STACK */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden flex flex-col items-center justify-center p-6">
          {/* 1. Translucent Frosted Glass Backdrop */}
          <div 
            className="absolute inset-0 bg-[#0B1B3A]/25 backdrop-blur-2xl transition-all"
            onClick={() => { setMenuOpen(false); setNavExpanded(false); }}
          />

          {/* 2. Independent Bright Red Close Button */}
          <button 
            onClick={() => { setMenuOpen(false); setNavExpanded(false); }}
            aria-label="Close menu"
            className="absolute top-6 right-6 z-[110] h-12 w-12 flex items-center justify-center bg-red-500 text-white rounded-2xl shadow-xl shadow-red-500/40 border border-white/30 active:scale-95 transition-all"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* 3. Floating 3-Component Stack with Air Gaps */}
          <div className="relative z-10 w-full max-w-[340px] flex flex-col items-center space-y-4">
            
            {/* COMPONENT 1: Video Card */}
            <div className="w-full h-[200px] bg-black/80 rounded-[24px] overflow-hidden shadow-2xl border border-white/20">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                poster="/hero-bg-mobile.jpg"
                className="w-full h-full object-cover"
              >
                <source src="/welcome-video.mp4" type="video/mp4" />
              </video>
            </div>

            {/* COMPONENT 2: Middle Navigation Pill (Expandable) */}
            <div className="w-full bg-white/95 backdrop-blur-2xl rounded-[28px] shadow-2xl border border-white/30 overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setNavExpanded(!navExpanded)}
                className="w-full h-14 px-6 flex items-center justify-between text-[#0B1B3A] font-bold text-lg"
              >
                <span>Navigation Menu</span>
                <svg 
                  className={\`w-5 h-5 text-[#0B1B3A] transition-transform duration-300 \${navExpanded ? 'rotate-180' : ''}\`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {navExpanded && (
                <div className="px-6 pb-6 flex flex-col space-y-4 border-t border-gray-100/80 pt-4 text-[17px] font-semibold text-gray-700">
                  <Link href="#features" onClick={() => {setMenuOpen(false); setNavExpanded(false);}} className="hover:text-[#0B1B3A]">Features</Link>
                  <Link href="#curriculum" onClick={() => {setMenuOpen(false); setNavExpanded(false);}} className="hover:text-[#0B1B3A]">Curriculum</Link>
                  <Link href="#pricing" onClick={() => {setMenuOpen(false); setNavExpanded(false);}} className="hover:text-[#0B1B3A]">Pricing</Link>
                  <Link href="#about" onClick={() => {setMenuOpen(false); setNavExpanded(false);}} className="hover:text-[#0B1B3A]">About us</Link>
                </div>
              )}
            </div>

            {/* COMPONENT 3: Bottom CTAs (iPhone Green + Brand Yellow) */}
            <div className="w-full flex space-x-3">
              <Link 
                href="/login"
                className="flex-1 h-14 bg-[#34C759] text-white rounded-[22px] flex items-center justify-center font-bold text-base shadow-xl shadow-green-500/30 border border-white/20 active:scale-95 transition-transform"
              >
                Log in
              </Link>
              <Link 
                href="/signup"
                className="flex-1 h-14 bg-[#FACC15] text-[#0B1B3A] rounded-[22px] flex items-center justify-center font-bold text-base shadow-xl shadow-yellow-500/25 active:scale-95 transition-transform"
              >
                Get Started
              </Link>
            </div>

          </div>
        </div>
      )}

      `;

  fs.writeFileSync(file, before + newMenuBlock + after, 'utf8');
  console.log('SUCCESS: Mobile menu updated with iPhone Green and Red close button!');
} else {
  console.log('ERROR: Could not find </header> or <main> tags');
}
