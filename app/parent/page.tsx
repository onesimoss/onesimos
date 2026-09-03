"use client";

import Link from "next/link";

export default function ParentDashboard() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4 relative">
      
      {/* Back Button */}
      <Link href="/" className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full shadow-md text-gray-600 font-semibold hover:bg-gray-50 transition-colors z-50">
        ← Back to Child
      </Link>

      {/* Main Dashboard Container */}
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row mt-10">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-[#FAFAFA] border-r border-gray-200 flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-[#FCE588] rounded-full flex items-center justify-center font-bold">O</div>
              <h1 className="text-2xl font-bold text-gray-800">Onesimos</h1>
            </div>
            
            <nav className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-[#FDF6D8] rounded-xl text-gray-800 font-medium cursor-pointer border-l-4 border-yellow-400">
                <span>📖</span> Dashboard
              </div>
              <div className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors">
                <span>🎙️</span> Reading Sessions
              </div>
              <div className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors">
                <span>👨‍👩‍👧</span> Child Profiles
              </div>
            </nav>
          </div>

          <div className="space-y-2 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors">
              <span>⚙️</span> Settings
            </div>
            <div className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-50 rounded-xl cursor-pointer transition-colors">
              <span>🚪</span> Log out
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-[#FDFDFD] overflow-y-auto max-h-[90vh]">
          {/* Top Header */}
          <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div className="w-full sm:w-1/3 bg-gray-100 rounded-full px-4 py-2 text-gray-400 text-sm">🔍 Search stories...</div>
            <button className="bg-[#FCE588] text-black font-semibold px-6 py-2 rounded-full hover:bg-yellow-300 transition-colors">+ Start New Session</button>
          </header>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Reading Calendar */}
            <div className="bg-[#FAFAFA] p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Reading Log</h3>
                <div className="text-gray-400 cursor-pointer">❮ ❯</div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-500 mb-2">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => <div key={d} className="font-semibold">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-600">
                {Array.from({ length: 31 }, (_, i) => (
                  <div key={i} className={`p-2 rounded-full cursor-pointer hover:bg-gray-200 ${i === 2 ? 'bg-[#FCE588] font-bold' : ''}`}>
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: My Tasks (Upcoming Reads) */}
            <div className="bg-[#FAFAFA] p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Upcoming Books (05)</h3>
                <span className="text-gray-400 cursor-pointer">⋮</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-yellow-200">
                  <div className="flex items-center gap-3"><span className="text-yellow-500">📘</span> The Dinosaur Detectives</div>
                  <span className="text-yellow-600 text-xs font-bold">Tonight</span>
                </div>
                {['Charlie and the Chocolate Factory', 'Where the Wild Things Are', 'Matilda', 'The Gruffalo'].map((task, i) => (
                  <div key={i} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3 text-gray-700"><span className="text-gray-300">📖</span> {task}</div>
                    <span className="text-gray-400 text-xs">{i === 0 ? 'Tomorrow' : i === 1 ? 'Wednesday' : 'This week'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: My Categories (Reading Levels) */}
            <div className="bg-[#FAFAFA] p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Reading Levels</h3>
                <span className="text-gray-400 cursor-pointer">⋮</span>
              </div>
              <div className="space-y-3">
                {[['🟢', 'Level 1: Beginner'], ['🟡', 'Level 2: Developing'], ['🔵', 'Level 3: Confident'], ['🟣', 'Level 4: Advanced']].map((cat, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white">
                    <div className="flex items-center gap-3"><span>{cat[0]}</span> {cat[1]}</div>
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gray-300 border border-white"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4: My Tracking (Reading Timer) */}
            <div className="bg-[#FAFAFA] p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Current Session</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FDF6D8] border-l-4 border-yellow-400">
                  <div className="flex items-center gap-3 font-semibold">⏱ Reading Chapter 3</div>
                  <div className="font-bold">12m 45s ⏸</div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white">
                  <div className="flex items-center gap-3 text-gray-700">📊 Words per minute</div>
                  <div className="text-gray-500 font-bold">84 WPM</div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white">
                  <div className="flex items-center gap-3 text-gray-700">🎯 Accuracy</div>
                  <div className="text-gray-500 font-bold">96%</div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-72 bg-[#FAFAFA] border-l border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Parent Notes</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:bg-gray-50">
              <p className="font-semibold text-sm text-gray-800">Sarah's Progress <span className="text-gray-400 float-right">›</span></p>
              <p className="text-xs text-gray-500 mt-1">Great improvement on pronunciation today!</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:bg-gray-50">
              <p className="font-semibold text-sm text-gray-800">Book Recommendation <span className="text-gray-400 float-right">›</span></p>
              <p className="text-xs text-gray-500 mt-1">Try the "Magic Treehouse" series next.</p>
            </div>
            <button className="w-full text-left text-gray-500 hover:text-black p-2 text-sm">+ Add note</button>
          </div>
        </aside>

      </div>
    </div>
  );
}