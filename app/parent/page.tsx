"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

// Inline Icons
const UsersIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const AwardIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>;
const ClockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const ShieldIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const PlusIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const CreditCardIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>;

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar_id: string | null;
  session_minutes: number;
}

function ParentDashboardContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [parentName, setParentName] = useState("Parent");
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string>("Free Plan");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const client = createClient();
        const { data: authData } = await client.auth.getUser();
        const user = authData?.user;
        if (!user) {
          if (!cancelled) router.push("/login");
          return;
        }

        if (user.user_metadata?.display_name) {
          setParentName(user.user_metadata.display_name);
        }

        // Fetch children
        const { data: kids } = await client
          .from("children")
          .select("id, name, age, avatar_id, session_minutes")
          .eq("parent_id", user.id);
        
        if (!cancelled && kids) {
          setChildren(kids as ChildProfile[]);
        }

        // Fetch subscription if available
        const { data: sub } = await client
          .from("parent_subscriptions")
          .select("plan, status")
          .eq("parent_id", user.id)
          .single();
        
        if (!cancelled && sub && sub.status === "active") {
          setSubscriptionPlan(sub.plan || "Pro Plan");
        }
      } catch {
        if (!cancelled) router.push("/login");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F4F8FF] dark:bg-[#0F172A] flex items-center justify-center">
        <p className="text-sm font-bold text-[#1C274C] dark:text-white">Loading parent portal...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F8FF] dark:bg-[#0F172A] px-5 sm:px-8 pb-[calc(3rem+env(safe-area-inset-bottom))] pt-[calc(2rem+env(safe-area-inset-top))]">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Top Navigation Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1E293B] p-6 rounded-[32px] shadow-sm border border-[#1C274C]/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#1C274C] text-[#E1F18C] flex items-center justify-center font-black text-2xl">
              {parentName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-[#1C274C] dark:text-white tracking-tight">{parentName}</h1>
                <span className="px-3 py-1 rounded-full bg-[#E1F18C] text-[#1C274C] text-xs font-bold uppercase tracking-wider">
                  {subscriptionPlan}
                </span>
              </div>
              <p className="text-xs font-medium text-[#1C274C]/60 dark:text-white/60 mt-0.5">Parent Command Center</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/who" 
              className="px-5 py-2.5 rounded-full bg-[#F4F8FF] dark:bg-[#0F172A] text-[#1C274C] dark:text-white font-bold text-sm hover:opacity-80 transition-opacity"
            >
              Switch Profile
            </Link>
            <Link 
              href="/parent/pricing" 
              className="px-5 py-2.5 rounded-full bg-[#1C274C] text-white font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <CreditCardIcon /> Manage Subscription
            </Link>
          </div>
        </header>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-[#E1C8F6] rounded-[32px] p-6 text-[#1C274C]">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">Learners</span>
              <div className="w-9 h-9 rounded-full bg-white/50 flex items-center justify-center"><UsersIcon /></div>
            </div>
            <p className="text-4xl font-black mt-3 tracking-tight">{children.length}</p>
            <p className="text-xs font-medium opacity-80 mt-1">Active child profiles</p>
          </div>

          <div className="bg-[#E1F18C] rounded-[32px] p-6 text-[#1C274C]">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">Weekly Reading</span>
              <div className="w-9 h-9 rounded-full bg-white/50 flex items-center justify-center"><ClockIcon /></div>
            </div>
            <p className="text-4xl font-black mt-3 tracking-tight">85m</p>
            <p className="text-xs font-medium opacity-80 mt-1">Total minutes this week</p>
          </div>

          <div className="bg-[#F7D4DA] rounded-[32px] p-6 text-[#1C274C]">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">Words Mastered</span>
              <div className="w-9 h-9 rounded-full bg-white/50 flex items-center justify-center"><AwardIcon /></div>
            </div>
            <p className="text-4xl font-black mt-3 tracking-tight">142</p>
            <p className="text-xs font-medium opacity-80 mt-1">Vocabulary milestones</p>
          </div>
        </div>

        {/* Children Management Grid */}
        <section className="bg-white dark:bg-[#1E293B] rounded-[32px] p-8 shadow-sm border border-[#1C274C]/5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-[#1C274C] dark:text-white tracking-tight">Your Children</h2>
              <p className="text-sm font-medium text-[#1C274C]/60 dark:text-white/60">Manage reading goals and individual progress</p>
            </div>
            <Link 
              href="/onboarding" 
              className="px-5 py-2.5 rounded-full bg-[#E1F18C] text-[#1C274C] font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <PlusIcon /> Add Child
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {children.map((child) => (
              <div key={child.id} className="bg-[#F4F8FF] dark:bg-[#0F172A] rounded-[28px] p-6 flex items-center justify-between border border-[#1C274C]/5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#E1C8F6] text-[#1C274C] font-black text-2xl flex items-center justify-center ring-4 ring-white dark:ring-[#1E293B]">
                    {child.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-[#1C274C] dark:text-white">{child.name}</h3>
                    <p className="text-xs font-medium text-[#1C274C]/60 dark:text-white/60">Age {child.age} • Goal: {child.session_minutes || 15}m daily</p>
                  </div>
                </div>

                <Link 
                  href={`/parent/child/${child.id}`}
                  className="px-4 py-2 rounded-full bg-white dark:bg-[#1E293B] text-[#1C274C] dark:text-white text-xs font-bold shadow-sm hover:opacity-80"
                >
                  View Details
                </Link>
              </div>
            ))}

            {children.length === 0 && (
              <div className="col-span-2 text-center py-8">
                <p className="text-sm font-medium text-[#1C274C]/60 dark:text-white/60">No child profiles found.</p>
                <Link href="/onboarding" className="mt-3 inline-block px-5 py-2 rounded-full bg-[#1C274C] text-white text-xs font-bold">
                  Create First Profile
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Reading Activity Visual Chart (Pure CSS) */}
        <section className="bg-white dark:bg-[#1E293B] rounded-[32px] p-8 shadow-sm border border-[#1C274C]/5">
          <h2 className="text-xl font-black text-[#1C274C] dark:text-white tracking-tight">Weekly Activity</h2>
          <p className="text-sm font-medium text-[#1C274C]/60 dark:text-white/60 mb-6">Daily reading session minutes</p>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 border-b border-[#1C274C]/10 dark:border-white/10 pb-2">
            {[
              { day: "Mon", mins: 15, h: "40%" },
              { day: "Tue", mins: 20, h: "60%" },
              { day: "Wed", mins: 10, h: "30%" },
              { day: "Thu", mins: 25, h: "75%" },
              { day: "Fri", mins: 30, h: "90%" },
              { day: "Sat", mins: 15, h: "40%" },
              { day: "Sun", mins: 20, h: "60%" }
            ].map((bar) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-[#1C274C]/60 dark:text-white/60">{bar.mins}m</span>
                <div className="w-full max-w-[36px] bg-[#F4F8FF] dark:bg-[#0F172A] rounded-t-full h-32 flex items-end overflow-hidden p-1">
                  <div 
                    className="w-full bg-[#71A6EE] rounded-t-full transition-all duration-500" 
                    style={{ height: bar.h }} 
                  />
                </div>
                <span className="text-xs font-bold text-[#1C274C] dark:text-white">{bar.day}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

export default function ParentDashboardPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#F4F8FF] dark:bg-[#0F172A]" />}>
      <ParentDashboardContent />
    </Suspense>
  );
}
