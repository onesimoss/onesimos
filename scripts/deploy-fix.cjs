
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// --- Assets & Icons (Inline SVGs) ---

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="#F97316"/>
    <path d="M12 28V12H16L24 22V12H28V28H24L16 18V28H12Z" fill="white"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="10" fill="#A3E635"/>
    <path d="M6 10L9 13L14 7" stroke="#0B1B3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
  </svg>
);

// --- Components ---

const FloatingCharacter = ({ color, shape, position, delay, children }) => (
  <div 
    className={`absolute ${position} animate-bounce`} 
    style={{ animationDuration: '3s', animationDelay: delay }}
  >
    <div className={`w-16 h-16 ${shape === 'circle' ? 'rounded-full' : 'rounded-2xl'} ${color} flex items-center justify-center shadow-lg border-4 border-[#0B1B3A]`}>
      {children}
    </div>
  </div>
);

const FeatureCard = ({ title, description, color }) => (
  <div className={`p-8 rounded-[2.5rem] ${color} border-2 border-[#0B1B3A] h-full`}>
    <h3 className="text-2xl font-bold text-[#0B1B3A] mb-4">{title}</h3>
    <p className="text-[#0B1B3A]/80 leading-relaxed">{description}</p>
  </div>
);

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#0B1B3A]/10 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left font-bold text-xl text-[#0B1B3A]"
      >
        <span>{question}</span>
        <span className="text-2xl transition-transform duration-300" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
      </button>
      {isOpen && <p className="mt-4 text-[#0B1B3A]/70 leading-relaxed">{answer}</p>}
    </div>
  );
};

// --- Page Content ---

export default function HomePage() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [activeAgeTab, setActiveAgeTab] = useState('3-5');

  const ages = {
    '3-5': { 
      title: 'Foundation Seekers', 
      desc: 'Interactive visual storytelling and sound-letter association to build early phonemic awareness.',
      color: 'bg-[#F472B6]' 
    },
    '6-8': { 
      title: 'Word Explorers', 
      desc: 'Developing sentence structure and comprehension through personalized adventure chapters.',
      color: 'bg-[#A3E635]' 
    },
    '9-12': { 
      title: 'Master Readers', 
      desc: 'Advanced vocabulary and real-time speech evaluation for complex narrative mastery.',
      color: 'bg-[#A78BFA]' 
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#0B1B3A] selection:bg-[#F97316] selection:text-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-2xl font-black tracking-tighter">ONESIMOS</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium">
          <a href="#how-it-works" className="hover:text-[#F97316] transition-colors">How it works</a>
          <a href="#curriculum" className="hover:text-[#F97316] transition-colors">Curriculum</a>
          <a href="#pricing" className="hover:text-[#F97316] transition-colors">Pricing</a>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2 rounded-full font-bold border-2 border-[#0B1B3A] hover:bg-[#0B1B3A] hover:text-white transition-all">
            Login
          </Link>
          <Link href="/login" className="px-6 py-2 rounded-full font-bold bg-[#F97316] text-white border-2 border-[#0B1B3A] shadow-[4px_4px_0px_0px_#0B1B3A] hover:translate-y-1 hover:shadow-none transition-all">
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 pb-20 pt-10">
        <div className="max-w-7xl mx-auto bg-[#0B1B3A] rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center">
          {/* Floating Mascots */}
          <FloatingCharacter color="bg-[#A3E635]" shape="circle" position="top-10 left-10" delay="0s">
            <span className="text-2xl">👀</span>
          </FloatingCharacter>
          <FloatingCharacter color="bg-[#F472B6]" shape="square" position="bottom-20 right-10" delay="1s">
            <span className="text-2xl">📖</span>
          </FloatingCharacter>
          
          <div className="max-w-4xl mx-auto">
            <div className="inline-block px-4 py-1 rounded-full bg-white/10 text-white border border-white/20 mb-6 backdrop-blur-md">
              ✨ Personalized Learning for Ages 3-12
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
              Where Every Child <br/> 
              <span className="text-[#A3E635]">Reads</span> Their <span className="text-[#F472B6]">Own</span> Story.
            </h1>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Onesimos crafts personalized learning chapters that adapt to your child's pace, featuring real-time speech evaluation and zero ads.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="px-10 py-5 bg-[#F97316] text-white rounded-full text-xl font-bold shadow-[0_8px_0_0_#C2410C] hover:shadow-[0_4px_0_0_#C2410C] hover:translate-y-1 transition-all">
                Try Free Explorer
              </Link>
              <button className="px-10 py-5 bg-white text-[#0B1B3A] rounded-full text-xl font-bold border-2 border-white hover:bg-transparent hover:text-white transition-all flex items-center justify-center gap-2">
                <PlayIcon /> See How it Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Promises Bento */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-4">Reading made joyful.</h2>
          <p className="text-xl text-[#0B1B3A]/60">Everything you need to raise a confident reader.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            title="Personalized" 
            description="Adaptive story synthesis creates chapters based on your child's vocabulary level." 
            color="bg-[#7DD3FC]"
          />
          <FeatureCard 
            title="Smart Speech" 
            description="Real-time evaluation listens to your child read and helps with pronunciation." 
            color="bg-[#A3E635]"
          />
          <FeatureCard 
            title="100% Safe" 
            description="No ads, no social tracking, and full Parent PIN protection for your peace of mind." 
            color="bg-[#F472B6]"
          />
          <FeatureCard 
            title="Progress Tracks" 
            description="Detailed analytics show you exactly how many words your child has mastered today." 
            color="bg-[#A78BFA]"
          />
        </div>
      </section>

      {/* Curriculum Tabs */}
      <section id="curriculum" className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-center mb-12 bg-[#FDF8F3] p-2 rounded-full border-2 border-[#0B1B3A] w-fit mx-auto">
            {Object.keys(ages).map((age) => (
              <button
                key={age}
                onClick={() => setActiveAgeTab(age)}
                className={`px-8 py-3 rounded-full font-bold transition-all ${activeAgeTab === age ? 'bg-[#0B1B3A] text-white' : 'text-[#0B1B3A] hover:bg-[#0B1B3A]/5'}`}
              >
                Ages {age}
              </button>
            ))}
          </div>
          
          <div className={`p-12 md:p-20 rounded-[3rem] border-2 border-[#0B1B3A] shadow-[8px_8px_0px_0px_#0B1B3A] ${ages[activeAgeTab].color} transition-all duration-500`}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-4xl md:text-6xl font-black mb-6">{ages[activeAgeTab].title}</h3>
                <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8">
                  {ages[activeAgeTab].desc}
                </p>
                <Link href="/login" className="inline-block px-8 py-4 bg-[#0B1B3A] text-white rounded-full font-bold hover:scale-105 transition-transform">
                  Explore Age {activeAgeTab}
                </Link>
              </div>
              <div className="aspect-square bg-white/30 rounded-[2rem] border-4 border-[#0B1B3A] flex items-center justify-center">
                <span className="text-8xl">🎓</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black">4 Steps to Reading Success</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-[#0B1B3A]/10 -z-10" />
          {[
            { step: '01', title: 'Create Profile', text: 'Set your child\'s name and reading level.' },
            { step: '02', title: 'Pick a Story', text: 'Choose a topic they love, from space to magic.' },
            { step: '03', title: 'Read Aloud', text: 'Our AI listens and provides gentle guidance.' },
            { step: '04', title: 'Level Up', text: 'Unlock new rewards and more complex chapters.' },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#F97316] text-white flex items-center justify-center text-2xl font-black border-4 border-[#0B1B3A] mb-6 shadow-lg">
                {item.step}
              </div>
              <h4 className="text-2xl font-bold mb-3">{item.title}</h4>
              <p className="text-[#0B1B3A]/60">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-[#FDF8F3]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-6">Simple, Honest Pricing.</h2>
            <div className="flex items-center justify-center gap-4">
              <span className={`font-bold ${billingCycle === 'monthly' ? 'text-[#0B1B3A]' : 'text-[#0B1B3A]/40'}`}>Monthly</span>
              <button 
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="w-16 h-8 bg-[#0B1B3A] rounded-full relative transition-all"
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${billingCycle === 'yearly' ? 'right-1' : 'left-1'}`} />
              </button>
              <span className={`font-bold ${billingCycle === 'yearly' ? 'text-[#0B1B3A]' : 'text-[#0B1B3A]/40'}`}>Yearly (Save 20%)</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white p-10 rounded-[2.5rem] border-2 border-[#0B1B3A] shadow-[8px_8px_0px_0px_#0B1B3A]">
              <h3 className="text-2xl font-bold mb-2">Free Explorer</h3>
              <div className="text-5xl font-black mb-6">$0<span className="text-xl text-[#0B1B3A]/40 font-normal">/forever</span></div>
              <ul className="space-y-4 mb-10">
                {['1 Child Profile', 'Basic Story Access', 'Speech Feedback', 'Daily Limit Applied'].map((f) => (
                  <li key={f} className="flex items-center gap-3 font-medium">
                    <CheckIcon /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block text-center py-4 rounded-full font-bold border-2 border-[#0B1B3A] hover:bg-[#0B1B3A] hover:text-white transition-all">
                Get Started
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-[#0B1B3A] p-10 rounded-[2.5rem] border-2 border-[#0B1B3A] text-white relative transform md:scale-105">
              <div className="absolute -top-4 right-10 bg-[#A3E635] text-[#0B1B3A] px-4 py-1 rounded-full font-bold text-sm">MOST POPULAR</div>
              <h3 className="text-2xl font-bold mb-2">Pro Reader</h3>
              <div className="text-5xl font-black mb-6">
                {billingCycle === 'monthly' ? '$9.99' : '$7.99'}
                <span className="text-xl text-white/40 font-normal">/month</span>
              </div>
              <ul className="space-y-4 mb-10">
                {['Unlimited Profiles', 'Advanced Story Synthesis', 'Full Performance Analytics', 'No Daily Limits', 'Priority Support'].map((f) => (
                  <li key={f} className="flex items-center gap-3 font-medium">
                    <CheckIcon /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block text-center py-4 bg-[#F97316] text-white rounded-full font-bold shadow-[0_6px_0_0_#C2410C] hover:translate-y-1 hover:shadow-none transition-all">
                Subscribe Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-black text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-2">
          <AccordionItem 
            question="Is it really personalized?" 
            answer="Yes! Every story is synthesized in real-time based on your child's favorite themes and their specific reading level, ensuring they are always challenged but never frustrated."
          />
          <AccordionItem 
            question="How does the speech recognition work?" 
            answer="We use browser-native speech recognition to listen as your child reads. The app identifies words they struggle with and provides gentle audio cues to help them master the pronunciation."
          />
          <AccordionItem 
            question="Is there a family plan?" 
            answer="Our Pro Reader subscription covers all children in your household. You can create individual profiles for each child with their own separate progress tracking."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B1B3A] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Logo />
                <span className="text-2xl font-black tracking-tighter uppercase">Onesimos</span>
              </div>
              <p className="text-white/60 text-lg max-w-sm">
                Empowering the next generation of readers through personalized story adventures and adaptive learning.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-6">Product</h5>
              <ul className="space-y-4 text-white/60">
                <li><a href="#" className="hover:text-[#F97316]">Features</a></li>
                <li><a href="#" className="hover:text-[#F97316]">Curriculum</a></li>
                <li><a href="#" className="hover:text-[#F97316]">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6">Legal</h5>
              <ul className="space-y-4 text-white/60">
                <li><a href="#" className="hover:text-[#F97316]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#F97316]">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#F97316]">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-white/10 flex flex-col md:row justify-between items-center gap-6">
            <p className="text-white/40">© 2024 Onesimos Reading. Built for kids, trusted by parents.</p>
            <div className="flex gap-6">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F97316] transition-colors cursor-pointer">𝕏</div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F97316] transition-colors cursor-pointer">IG</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
`;

const targetPath = path.join(__dirname, '..', 'app', 'page.tsx');

try {
  fs.writeFileSync(targetPath, code);
  console.log('✅ app/page.tsx updated with Wrenly-style redesign (zero-dependency).');
} catch (error) {
  console.error('❌ Error updating file:', error);
  process.exit(1);
}
