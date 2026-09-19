/**
 * @file app/parent/pricing/page.tsx
 * @description Parent Subscription & Pricing Plan Selection Screen.
 * Displays Single Reader, Family, Extended Family, and School Classroom tiers
 * with Paystack checkout integration and category tabs.
 * Wrapped in Suspense to satisfy Next.js 14 client-side navigation requirements.
 *
 * @fonts Achiko (headings/logo) + Switzer (body/UI)
 * @dependencies
 * - @/context/AuthContext
 * - @/lib/payments
 */

"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  SUBSCRIPTION_PLANS,
  getParentSubscription,
  type ParentSubscriptionRow,
  type SubscriptionPlanId,
} from "@/lib/payments";

function PricingContent(): JSX.Element {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentSub, setCurrentSub] = useState<ParentSubscriptionRow | null>(null);
  const [fetchingSub, setFetchingSub] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<SubscriptionPlanId | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [pricingTab, setPricingTab] = useState<"family" | "school">("family");

  const urlError = searchParams.get("error");

  // Auth protection
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/parent/login");
    }
  }, [user, loading, router]);

  // Load existing parent subscription
  useEffect(() => {
    async function loadSub() {
      if (!user) return;
      setFetchingSub(true);
      const sub = await getParentSubscription(user.id);
      setCurrentSub(sub);
      setFetchingSub(false);
    }
    void loadSub();
  }, [user]);

  const handleSelectPlan = async (planId: SubscriptionPlanId) => {
    if (!user) return;
    if (planId === "free") {
      router.push("/parent");
      return;
    }

    setLoadingPlan(planId);
    setErrorMessage("");

    try {
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          email: user.email,
          parentId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.authorization_url) {
        setErrorMessage(data.error || "Could not start checkout. Please try again.");
        setLoadingPlan(null);
        return;
      }

      window.location.href = data.authorization_url;
    } catch (err) {
      console.error("Checkout trigger error:", err);
      setErrorMessage("Network connection error. Please try again.");
      setLoadingPlan(null);
    }
  };

  if (loading || fetchingSub || !user) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-switzer">
        <p className="font-bold text-gray-500 text-lg animate-pulse font-switzer">
          Loading membership plans...
        </p>
      </main>
    );
  }

  const activePlanId = currentSub?.status === "active" ? currentSub.plan : "free";

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50/50 via-[#FDFBF7] to-amber-50/40 font-switzer pb-20">
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-10 font-switzer">
          <Link
            href="/parent"
            className="text-xs font-bold text-gray-600 hover:text-gray-900 bg-white/80 px-4 py-2 rounded-full border border-gray-200 shadow-2xs font-switzer"
          >
            ← Back to Dashboard
          </Link>
          <span className="font-achiko text-3xl text-amber-900 tracking-wide">
            Onesimos
          </span>
          <div className="w-24" />
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-8 font-switzer">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold mb-4 font-switzer">
            ✨ Flexible Tiers for Homes & Schools
          </span>
          <h1 className="font-achiko text-4xl sm:text-5xl text-amber-950 mb-4 tracking-tight">
            Unlock Unlimited Reading Adventures
          </h1>
          <p className="text-gray-600 text-base font-switzer leading-relaxed">
            Personal AI Living Stories, ElevenLabs audio pronunciations, and honest academic progress reports.
          </p>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex justify-center mb-10 font-switzer">
          <div className="bg-white/90 p-1.5 rounded-full border border-gray-200 shadow-xs inline-flex gap-1 font-switzer">
            <button
              type="button"
              onClick={() => setPricingTab("family")}
              className={`px-6 py-2.5 rounded-full text-xs font-extrabold transition-all font-switzer ${
                pricingTab === "family"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              👨‍👩‍👧‍👦 Families & Homes
            </button>
            <button
              type="button"
              onClick={() => setPricingTab("school")}
              className={`px-6 py-2.5 rounded-full text-xs font-extrabold transition-all font-switzer ${
                pricingTab === "school"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🏫 Schools & Classrooms
            </button>
          </div>
        </div>

        {/* Error Banners */}
        {(errorMessage || urlError) && (
          <div className="max-w-md mx-auto mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold font-switzer text-center">
            {errorMessage || "Payment could not be completed. Please try again."}
          </div>
        )}

        {/* TAB 1: FAMILIES & HOMES */}
        {pricingTab === "family" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-12 font-switzer animate-fadeIn">
            
            {/* Single Reader Plan */}
            <div
              className={`bg-white rounded-3xl p-7 border flex flex-col justify-between transition-all font-switzer ${
                activePlanId === "single_monthly" || activePlanId === "single_annual"
                  ? "border-amber-400 ring-2 ring-amber-300 shadow-md"
                  : "border-gray-200 shadow-xs hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-achiko text-2xl text-amber-950">
                    Single Reader
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold">
                    1 Child
                  </span>
                </div>

                <div className="mb-6">
                  <p className="font-achiko text-4xl text-amber-950 mb-1">
                    ₦2,500
                    <span className="text-sm text-gray-500 font-switzer font-normal"> / mo</span>
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    or ₦19,999 / year (Save 33%)
                  </p>
                </div>

                <ul className="space-y-3 text-xs text-gray-700 font-medium mb-8">
                  {SUBSCRIPTION_PLANS.single_monthly.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  disabled={loadingPlan === "single_monthly"}
                  onClick={() => handleSelectPlan("single_monthly")}
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-all font-switzer active:scale-95"
                >
                  {loadingPlan === "single_monthly" ? "Connecting..." : "Monthly (₦2,500/mo)"}
                </button>
                <button
                  type="button"
                  disabled={loadingPlan === "single_annual"}
                  onClick={() => handleSelectPlan("single_annual")}
                  className="w-full py-2.5 rounded-2xl border border-amber-300 text-amber-900 hover:bg-amber-50 text-xs font-bold transition-all font-switzer"
                >
                  {loadingPlan === "single_annual" ? "Connecting..." : "Annual (₦19,999/yr)"}
                </button>
              </div>
            </div>

            {/* Family Plan (Hero Card) */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-3xl p-7 border-2 border-amber-300 shadow-xl flex flex-col justify-between relative overflow-hidden font-switzer">
              <div className="absolute top-4 right-4 bg-white text-amber-900 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                Up to 4 Kids
              </div>

              <div>
                <div className="mb-4 pr-16">
                  <h2 className="font-achiko text-2xl text-white">
                    Family Plan
                  </h2>
                </div>

                <div className="mb-6">
                  <p className="font-achiko text-4xl text-white mb-1">
                    ₦5,000
                    <span className="text-sm text-amber-100 font-switzer font-normal"> / mo</span>
                  </p>
                  <p className="text-xs text-amber-100 font-medium">
                    or ₦39,999 / year (~$26/yr)
                  </p>
                </div>

                <ul className="space-y-3 text-xs text-amber-50 font-medium mb-8">
                  {SUBSCRIPTION_PLANS.family_monthly.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-200 font-bold">✨</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  disabled={loadingPlan === "family_monthly"}
                  onClick={() => handleSelectPlan("family_monthly")}
                  className="w-full py-3.5 rounded-2xl bg-white text-amber-900 hover:bg-amber-50 text-xs font-black shadow-md transition-all font-switzer active:scale-95"
                >
                  {loadingPlan === "family_monthly" ? "Connecting..." : "Family Monthly (₦5,000/mo)"}
                </button>
                <button
                  type="button"
                  disabled={loadingPlan === "family_annual"}
                  onClick={() => handleSelectPlan("family_annual")}
                  className="w-full py-2.5 rounded-2xl bg-amber-600/60 hover:bg-amber-600 text-white text-xs font-bold transition-all font-switzer"
                >
                  {loadingPlan === "family_annual" ? "Connecting..." : "Family Annual (₦39,999/yr)"}
                </button>
              </div>
            </div>

            {/* Extended Family / Daycare Plan */}
            <div className="bg-white rounded-3xl p-7 border border-gray-200 shadow-xs hover:shadow-md flex flex-col justify-between transition-all font-switzer">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-achiko text-2xl text-amber-950">
                    Daycare & Home-School
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-bold">
                    Up to 10 Kids
                  </span>
                </div>

                <div className="mb-6">
                  <p className="font-achiko text-4xl text-amber-950 mb-1">
                    ₦15,000
                    <span className="text-sm text-gray-500 font-switzer font-normal"> / mo</span>
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    Ideal for daycares & large families
                  </p>
                </div>

                <ul className="space-y-3 text-xs text-gray-700 font-medium mb-8">
                  {SUBSCRIPTION_PLANS.extended_monthly.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-sky-600 font-bold">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                disabled={loadingPlan === "extended_monthly"}
                onClick={() => handleSelectPlan("extended_monthly")}
                className="w-full py-3.5 rounded-2xl border border-gray-200 text-gray-800 hover:bg-gray-50 text-xs font-bold transition-all font-switzer active:scale-95"
              >
                {loadingPlan === "extended_monthly" ? "Connecting..." : "Choose Extended (₦15,000/mo)"}
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: SCHOOLS & CLASSROOMS */}
        {pricingTab === "school" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-12 max-w-4xl mx-auto font-switzer animate-fadeIn">
            
            {/* Classroom Term License */}
            <div className="bg-white rounded-3xl p-8 border-2 border-amber-200 shadow-md flex flex-col justify-between font-switzer">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-achiko text-3xl text-amber-950">
                    Classroom License
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black uppercase">
                    30 Students
                  </span>
                </div>

                <div className="mb-6">
                  <p className="font-achiko text-5xl text-amber-950 mb-1">
                    ₦30,000
                    <span className="text-base text-gray-500 font-switzer font-normal"> / term</span>
                  </p>
                  <p className="text-xs text-gray-500 font-medium">
                    Only ₦1,000 per student per term (~$19/term)
                  </p>
                </div>

                <ul className="space-y-3.5 text-xs text-gray-700 font-medium mb-8 leading-relaxed">
                  {SUBSCRIPTION_PLANS.school_term.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-amber-500 text-sm font-bold">🎓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                disabled={loadingPlan === "school_term"}
                onClick={() => handleSelectPlan("school_term")}
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md transition-all font-switzer active:scale-95"
              >
                {loadingPlan === "school_term" ? "Connecting Paystack..." : "Get Term Classroom License (₦30,000)"}
              </button>
            </div>

            {/* Full School Year License */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-3xl p-8 border-2 border-amber-300 shadow-xl flex flex-col justify-between font-switzer">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-achiko text-3xl text-white">
                    Full School Year
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-white text-amber-900 text-xs font-black uppercase">
                    3 Full Terms
                  </span>
                </div>

                <div className="mb-6">
                  <p className="font-achiko text-5xl text-white mb-1">
                    ₦85,000
                    <span className="text-base text-amber-100 font-switzer font-normal"> / year</span>
                  </p>
                  <p className="text-xs text-amber-100 font-medium">
                    Save ₦5,000 compared to termly billing
                  </p>
                </div>

                <ul className="space-y-3.5 text-xs text-amber-50 font-medium mb-8 leading-relaxed">
                  {SUBSCRIPTION_PLANS.school_annual.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-amber-200 text-sm font-bold">✨</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                disabled={loadingPlan === "school_annual"}
                onClick={() => handleSelectPlan("school_annual")}
                className="w-full py-4 rounded-2xl bg-white text-amber-900 hover:bg-amber-50 text-xs font-black shadow-md transition-all font-switzer active:scale-95"
              >
                {loadingPlan === "school_annual" ? "Connecting Paystack..." : "Get Annual School License (₦85,000)"}
              </button>
            </div>

          </div>
        )}

        {/* Trust Badges Footer */}
        <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-around gap-4 text-center sm:text-left font-switzer">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="text-xs font-bold text-gray-900">Bank-Grade Security</p>
              <p className="text-[11px] text-gray-500">256-bit encrypted via Paystack</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">💳</span>
            <div>
              <p className="text-xs font-bold text-gray-900">All Cards Accepted</p>
              <p className="text-[11px] text-gray-500">Local & International Visa, Mastercard, Verve</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="text-xs font-bold text-gray-900">Instant Activation</p>
              <p className="text-[11px] text-gray-500">Unlocked across all students immediately</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default function PricingPage(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-switzer">
          <p className="font-bold text-gray-500 text-lg animate-pulse font-switzer">
            Loading membership plans...
          </p>
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}