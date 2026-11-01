"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Inline SVGs to avoid dependency issues
const BellIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const PlayIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const BookIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>;

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams ? searchParams.get("child") : null;
  const [name, setName] = useState("Reader");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const client = createClient();
        if (childId) {
          const { data } = await client.from("children").select("name").eq("id", childId).single();
          if (!cancelled && data) setName(data.name);
        } else {
          // Fallback: load first child if no ID provided
          const { data: user } = await client.auth.getUser();
          if (user?.user) {
            const { data } = await client.from("children").select("id, name").eq("parent_id", user.user.id).limit(1).single();
            if (!cancelled && data) setName(data.name);
          }
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [childId]);

  return (
    <main className="min-h-screen bg-[#F4F8FF] dark:bg-[#0F172A] relative overflow-hidden flex justify-center">
      
      {/* ========================================================= */}
      {/* DESKTOP WRAPPER (Hidden on mobile)                        */}
      {/* ========================================================= */}
      <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none z-0">
        <h1 className="text-[12rem] font-black text-[#71A6EE]/10 tracking-tighter select-none">Onesimos</h1>
      </div>
      
      {/* Floating Elements (Desktop only) */}
      <div className="hidden lg:flex absolute top-20 left-[10%] items-center gap-3 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-sm px-6 py-4 rounded-full shadow-xl pointer-events-none z-0 border border-[#1C274C]/5">
         <span className="text-2xl">🤖</span>
         <span className="font-bold text-[#1C274C] dark:text-white">Your <span className="bg-[#1C274C] text-white px-3 py-1.5 rounded-full ml-1 text-sm">Reading Buddy</span></span>
      </div>
      <div className="hidden lg:flex absolute bottom-32 right-[15%] items-center gap-3 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-sm px-6 py-4 rounded-full shadow-xl pointer-events-none z-0 border border-[#1C274C]/5">
         <span className="font-bold text-[#1C274C] dark:text-white mr-1">Start reading</span>
         <div className="w-8 h-8 rounded-full bg-[#1C274C] text-white flex items-center justify-center"><PlayIcon /></div>
      </div>
      <div className="hidden lg:flex absolute bottom-20 left-[20%] w-16 h-16 bg-white/90 dark:bg-[#1E293B]/90 rounded-full shadow-xl items-center justify-center text-[#71A6EE] z-0">
         <BookIcon />
      </div>


      {/* ========================================================= */}
      {/* MOBILE APP CONTAINER (Fills screen on mobile, phone-sized on desktop) */}
      {/* ========================================================= */}
      <div className="relative z-10 w-full max-w-md bg-[#F4F8FF] dark:bg-[#0F172A] min-h-screen lg:min-h-[800px] lg:my-12 lg:rounded-[40px] lg:shadow-2xl lg:border-[8px] lg:border-white/50 lg:dark:border-[#1E293B] overflow-y-auto overflow-x-hidden pb-[calc(2rem+env(safe-area-inset-bottom))] scrollbar-hide">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center px-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#E1C8F6] border-2 border-[#1C274C] flex items-center justify-center font-black text-xl text-[#1C274C] ring-4 ring-white dark:ring-[#1E293B]">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-[#1C274C]/60 dark:text-white/60">Hello {name} 👋</p>
              <p className="text-sm font-black text-[#1C274C] dark:text-white">Good Morning</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-white dark:bg-[#1E293B] flex items-center justify-center shadow-sm text-[#1C274C] dark:text-white active:scale-95 transition-transform">
             <BellIcon />
          </button>
        </div>

        {/* Hero Buddy Card */}
        <div className="mx-6 mt-2 bg-white dark:bg-[#1E293B] rounded-[32px] p-5 flex items-center gap-4 shadow-sm border border-[#1C274C]/5 dark:border-white/5">
           <div className="w-12 h-12 rounded-full bg-[#1C274C] flex items-center justify-center text-white shrink-0 text-xl">🤖</div>
           <div>
             <p className="text-xs font-bold text-[#1C274C]/60 dark:text-white/60 uppercase tracking-wider">Your reading buddy</p>
             <p className="text-sm font-black text-[#1C274C] dark:text-white leading-tight mt-0.5">You're doing great today!</p>
           </div>
        </div>

        {/* Continue Card (Today's Pick) */}
        <div className="mx-6 mt-4 bg-white dark:bg-[#1E293B] rounded-[32px] p-5 shadow-sm border border-[#1C274C]/5 dark:border-white/5">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-xs font-bold text-[#1C274C]/60 dark:text-white/60 uppercase tracking-wider">Today's pick</p>
               <p className="text-lg font-black text-[#1C274C] dark:text-white mt-1">The Magic Forest</p>
               <div className="flex items-center gap-3 mt-2">
                 <p className="text-xs font-bold text-[#1C274C]/60 dark:text-white/60 flex items-center gap-1"><BookIcon /> 12 pages</p>
                 <p className="text-xs font-bold text-[#1C274C]/60 dark:text-white/60">⏱ 10 min</p>
               </div>
             </div>
           </div>
           
           <div className="mt-5 flex items-center justify-between">
             <div className="flex items-center gap-3 flex-1 pr-4">
               <span className="text-xs font-bold text-[#1C274C] dark:text-white whitespace-nowrap">20% complete</span>
               <div className="h-2 flex-1 bg-[#F4F8FF] dark:bg-[#0F172A] rounded-full overflow-hidden">
                 <div className="h-full bg-[#1C274C] dark:bg-[#E1F18C] rounded-full w-1/5" />
               </div>
             </div>
             <button className="w-12 h-12 shrink-0 rounded-full bg-[#1C274C] text-[#E1F18C] flex items-center justify-center shadow-md active:scale-95 transition-transform pl-1">
                <PlayIcon />
             </button>
           </div>
        </div>

        {/* Let's Read Section */}
        <div className="mx-6 mt-8">
           <h2 className="text-xl font-black text-[#1C274C] dark:text-white tracking-tight">Let's read</h2>
           
           {/* Filters */}
           <div className="flex gap-2 mt-4 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
              <button className="px-5 py-2.5 rounded-full bg-[#1C274C] text-white text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-2">
                All <span className="bg-white/20 px-1.5 py-0.5 rounded-full">12</span>
              </button>
              <button className="px-5 py-2.5 rounded-full bg-white dark:bg-[#1E293B] text-[#1C274C] dark:text-white text-xs font-bold whitespace-nowrap shrink-0 border border-[#1C274C]/5 dark:border-white/5 flex items-center gap-2">
                Animals <span className="text-[#1C274C]/40 dark:text-white/40">03</span>
              </button>
              <button className="px-5 py-2.5 rounded-full bg-white dark:bg-[#1E293B] text-[#1C274C] dark:text-white text-xs font-bold whitespace-nowrap shrink-0 border border-[#1C274C]/5 dark:border-white/5 flex items-center gap-2">
                Space <span className="text-[#1C274C]/40 dark:text-white/40">04</span>
              </button>
              <button className="px-5 py-2.5 rounded-full bg-white dark:bg-[#1E293B] text-[#1C274C] dark:text-white text-xs font-bold whitespace-nowrap shrink-0 border border-[#1C274C]/5 dark:border-white/5 flex items-center gap-2">
                Magic <span className="text-[#1C274C]/40 dark:text-white/40">05</span>
              </button>
           </div>

           {/* Grid Cards */}
           <div className="grid grid-cols-2 gap-4 mt-4">
              <button className="bg-[#E1C8F6] rounded-[32px] p-5 relative overflow-hidden h-48 flex flex-col justify-between text-left active:scale-95 transition-transform shadow-sm">
                 <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-lg">🦁</div>
                    <span className="bg-white/50 px-2.5 py-1 rounded-full text-[10px] font-bold text-[#1C274C] uppercase tracking-wider">10 min</span>
                 </div>
                 <div>
                    <p className="text-xs font-bold text-[#1C274C]/60 uppercase tracking-wider mb-1">Animals</p>
                    <p className="text-lg font-black text-[#1C274C] leading-tight tracking-tight">Lions and Tigers</p>
                 </div>
              </button>
              
              <button className="bg-[#E1F18C] rounded-[32px] p-5 relative overflow-hidden h-48 flex flex-col justify-between text-left active:scale-95 transition-transform shadow-sm">
                 <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-lg">🚀</div>
                    <span className="bg-white/50 px-2.5 py-1 rounded-full text-[10px] font-bold text-[#1C274C] uppercase tracking-wider">15 min</span>
                 </div>
                 <div>
                    <p className="text-xs font-bold text-[#1C274C]/60 uppercase tracking-wider mb-1">Space</p>
                    <p className="text-lg font-black text-[#1C274C] leading-tight tracking-tight">Journey to Mars</p>
                 </div>
              </button>

              <button className="bg-[#F7D4DA] rounded-[32px] p-5 relative overflow-hidden h-48 flex flex-col justify-between text-left active:scale-95 transition-transform shadow-sm col-span-2">
                 <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-lg">🪄</div>
                    <span className="bg-white/50 px-2.5 py-1 rounded-full text-[10px] font-bold text-[#1C274C] uppercase tracking-wider">12 lessons</span>
                 </div>
                 <div className="w-3/4">
                    <p className="text-xs font-bold text-[#1C274C]/60 uppercase tracking-wider mb-1">Magic</p>
                    <p className="text-xl font-black text-[#1C274C] leading-tight tracking-tight">The Wizard's Academy</p>
                 </div>
              </button>
           </div>
        </div>
      </div>
    </main>
  );
}
