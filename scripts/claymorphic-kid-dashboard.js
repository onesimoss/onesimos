const fs = require('fs');
const path = require('path');

const targetPath = path.join(process.cwd(), 'app', 'kid', '[childId]', 'page.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// Upgrade main container background to tactile soft clay gradient
content = content.replace(
  'main className="min-h-screen bg-gradient-to-b from-sky-50/50 via-[#FDFBF7] to-amber-50/30 font-switzer pb-16"',
  'main className="min-h-screen bg-[#F7F4EC] font-switzer pb-16 relative overflow-hidden"'
);

// Upgrade Spelling Practice launcher card to Claymorphic 3D
content = content.replace(
  'bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-5 text-white shadow-md flex flex-col justify-between gap-4 font-switzer',
  'bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-[8px_8px_20px_rgba(217,119,6,0.3),-4px_-4px_12px_rgba(255,255,255,0.8)] border-2 border-amber-300 flex flex-col justify-between gap-4 font-switzer transition-transform hover:scale-[1.02] active:scale-[0.98]'
);

// Upgrade Phonics Sound Lab launcher card to Claymorphic 3D
content = content.replace(
  'bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl p-5 text-white shadow-md flex flex-col justify-between gap-4 font-switzer',
  'bg-gradient-to-br from-pink-400 via-rose-500 to-pink-600 rounded-3xl p-6 text-white shadow-[8px_8px_20px_rgba(225,29,72,0.3),-4px_-4px_12px_rgba(255,255,255,0.8)] border-2 border-rose-300 flex flex-col justify-between gap-4 font-switzer transition-transform hover:scale-[1.02] active:scale-[0.98]'
);

// Upgrade Story Cards to Tactile Claymorphism
content = content.replace(
  'bg-white rounded-3xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between active:scale-[0.99] disabled:opacity-60 relative overflow-hidden font-switzer',
  'bg-white rounded-3xl p-6 border-2 border-amber-100 shadow-[6px_6px_16px_rgba(0,0,0,0.06),-6px_-6px_16px_rgba(255,255,255,0.9)] hover:shadow-[10px_10px_24px_rgba(217,119,6,0.15),-8px_-8px_20px_rgba(255,255,255,1)] hover:-translate-y-1 transition-all text-left flex flex-col justify-between active:scale-[0.98] disabled:opacity-60 relative overflow-hidden font-switzer'
);

// Upgrade My Bookshelf container
content = content.replace(
  'bg-amber-100/50 rounded-3xl p-6 border border-amber-200/80 font-switzer',
  'bg-amber-100/60 rounded-3xl p-6 border-2 border-amber-200 shadow-[ inset_2px_2px_6px_rgba(0,0,0,0.04),6px_6px_16px_rgba(217,119,6,0.1)] font-switzer'
);

// Upgrade Word Pocket container
content = content.replace(
  'bg-white rounded-3xl p-6 border border-gray-200 shadow-sm font-switzer mb-8',
  'bg-white rounded-3xl p-6 border-2 border-amber-100 shadow-[8px_8px_20px_rgba(0,0,0,0.05),-8px_-8px_20px_rgba(255,255,255,0.9)] font-switzer mb-8'
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully upgraded Kid Dashboard with Claymorphic 3D styling!');