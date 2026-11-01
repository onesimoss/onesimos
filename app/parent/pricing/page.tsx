"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const CheckIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const ArrowLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;

function PricingContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  async function handleSubscribe(planType: string) {
    setLoading(true);
    try {
      // Directs to existing Paystack endpoint flow
      window.location.href = `/api/paystack/checkout?plan=${planType}`;
    } catch {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F4F8FF] dark:bg-[#0F172A] px-5 sm:px-8 pb-[calc(3rem+env(safe-area-inset-bottom))] pt-[calc(2rem+env(safe-area-inset-top))] flex justify-center">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link href="/parent" className="flex items-center gap-2 font-bold text-sm text-[#1C274C] dark:text-white">
            <ArrowLeft /> Back to Parent Zone
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-[#71A6EE]">Flexible Plans</span>
        </div>

        {/* Hero Title */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black text-[#1C274C] dark:text-white tracking-tight">Unlock Unlimited Reading</h1>
          <p className="text-base font-medium text-[#1C274C]/70 dark:text-white/70 max-w-lg mx-auto">
            Give your children unlimited personalized chapters, real-time speech recognition, and detailed mastery tracking.
          </p>

          {/* Billing Switcher Pill */}
          <div className="inline-flex items-center p-1.5 rounded-full bg-white dark:bg-[#1E293B] shadow-sm border border-[#1C274C]/5 mt-4">
            <button 
              type="button" 
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                billingCycle === "monthly" 
                  ? "bg-[#1C274C] text-white" 
                  : "text-[#1C274C]/60 dark:text-white/60"
              }`}
            >
              Monthly Billing
            </button>
            <button 
              type="button" 
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                billingCycle === "yearly" 
                  ? "bg-[#1C274C] text-white" 
                  : "text-[#1C274C]/60 dark:text-white/60"
              }`}
            >
              Annual Billing
              <span className="bg-[#E1F18C] text-[#1C274C] text-[10px] px-2 py-0.5 rounded-full font-black">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* Free Tier */}
          <div className="bg-white dark:bg-[#1E293B] rounded-[36px] p-8 shadow-sm border border-[#1C274C]/5 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1C274C]/60 dark:text-white/60">Starter</span>
              <h2 className="text-2xl font-black text-[#1C274C] dark:text-white mt-1">Free Explorer</h2>
              <p className="text-4xl font-black text-[#1C274C] dark:text-white mt-4">$0 <span className="text-sm font-medium text-[#1C274C]/60 dark:text-white/60">/ forever</span></p>
              
              <ul className="mt-6 space-y-3">
                {["1 Child profile", "3 Free sample chapters", "Basic progress overview"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm font-medium text-[#1C274C] dark:text-white">
                    <span className="w-6 h-6 rounded-full bg-[#F4F8FF] dark:bg-[#0F172A] text-[#1C274C] dark:text-white flex items-center justify-center shrink-0"><CheckIcon /></span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              type="button" 
              onClick={() => router.push("/parent")}
              className="w-full py-3.5 rounded-full bg-[#F4F8FF] dark:bg-[#0F172A] text-[#1C274C] dark:text-white font-bold text-sm hover:opacity-80"
            >
              Current Plan
            </button>
          </div>

          {/* Pro Tier (Highlighted) */}
          <div className="bg-[#E1F18C] rounded-[36px] p-8 shadow-md border-2 border-[#1C274C] flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-[#1C274C] text-[#E1F18C] text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Most Popular
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1C274C]/70">Family Unlimited</span>
              <h2 className="text-2xl font-black text-[#1C274C] mt-1">Onesimos Pro</h2>
              <p className="text-4xl font-black text-[#1C274C] mt-4">
                {billingCycle === "monthly" ? "$9.99" : "$7.99"} 
                <span className="text-sm font-medium text-[#1C274C]/70"> / month</span>
              </p>
              
              <ul className="mt-6 space-y-3">
                {[
                  "Unlimited children profiles",
                  "Unlimited adaptive chapters",
                  "Real-time speech recognition evaluation",
                  "Detailed parent analytics dashboard",
                  "Vocabulary mastery & streak tracking"
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm font-bold text-[#1C274C]">
                    <span className="w-6 h-6 rounded-full bg-white text-[#1C274C] flex items-center justify-center shrink-0 shadow-sm"><CheckIcon /></span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              type="button" 
              onClick={() => handleSubscribe(billingCycle)}
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#1C274C] text-white font-bold text-sm shadow-md hover:opacity-95 transition-opacity"
            >
              {loading ? "Redirecting to Paystack..." : "Subscribe Now"}
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#F4F8FF] dark:bg-[#0F172A]" />}>
      <PricingContent />
    </Suspense>
  );
}
