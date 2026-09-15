/**
 * @file app/parent/pricing/page.tsx
 * @description Parent Subscription & Pricing Plan Selection Screen.
 * Displays Free, Monthly, and Annual pricing tiers with Paystack checkout
 * integration, diaspora approximate currency guides, and active plan badges.
 * Wrapped in Suspense to satisfy Next.js 14 client-side navigation requirements.
 *
 * @fonts Achiko (headings) + Switzer (body/UI)
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

      // Redirect to Paystack Checkout URL
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
      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-10">
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
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold mb-4 font-switzer">
            ✨ Simple, Family-First Pricing
          </span>
          <h1 className="font-achiko text-4xl sm:text-5xl text-amber-950 mb-4 tracking-tight">
            Unlock Unlimited Reading for All Your Children
          </h1>
          <p className="text-gray-600 text-base font-switzer leading-relaxed">
            One membership covers every child in your family. Personal AI Living Stories,
            honest academic reports, and zero reading speed anxiety.
          </p>
        </div>

        {/* Error Banners */}
        {(errorMessage || urlError) && (
          <div className="max-w-md mx-auto mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold font-switzer text-center">
            {errorMessage || "Payment could not be completed. Please try again."}
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-12">
          
          {/* Plan 1: Free Starter */}
          <div
            className={`bg-white rounded-3xl p-7 border flex flex-col justify-between transition-all font-switzer ${
              activePlanId === "free"
                ? "border-amber-300 ring-2 ring-amber-200 shadow-sm"
                : "border-gray-200 shadow-xs hover:shadow-md"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-achiko text-2xl text-gray-900">
                  {SUBSCRIPTION_PLANS.free.name}
                </h2>
                {activePlanId === "free" && (
                  <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider">
                    Current Plan
                  </span>
                )}
              </div>

              <div className="mb-6">
                <p className="font-achiko text-4xl text-gray-900 mb-1">
                  {SUBSCRIPTION_PLANS.free.priceFormatted}
                </p>
                <p className="text-xs text-gray-400 font-bold">Free forever</p>
              </div>

              <ul className="space-y-3 text-xs text-gray-600 font-medium mb-8">
                {SUBSCRIPTION_PLANS.free.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              disabled={activePlanId === "free"}
              onClick={() => handleSelectPlan("free")}
              className="w-full py-3 rounded-2xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 font-switzer"
            >
              {activePlanId === "free" ? "Active Plan" : "Downgrade to Free"}
            </button>
          </div>

          {/* Plan 2: Monthly Premium */}
          <div
            className={`bg-white rounded-3xl p-7 border flex flex-col justify-between transition-all font-switzer ${
              activePlanId === "premium_monthly"
                ? "border-amber-400 ring-2 ring-amber-300 shadow-md"
                : "border-gray-200 shadow-xs hover:shadow-md"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-achiko text-2xl text-amber-950">
                  {SUBSCRIPTION_PLANS.premium_monthly.name}
                </h2>
                {activePlanId === "premium_monthly" && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                    Active
                  </span>
                )}
              </div>

              <div className="mb-6">
                <p className="font-achiko text-4xl text-amber-950 mb-1">
                  {SUBSCRIPTION_PLANS.premium_monthly.priceFormatted}
                  <span className="text-sm text-gray-500 font-switzer font-normal"> / month</span>
                </p>
                <p className="text-xs text-gray-400 font-medium">
                  {SUBSCRIPTION_PLANS.premium_monthly.approxUsd} · {SUBSCRIPTION_PLANS.premium_monthly.approxGbp} for diaspora
                </p>
              </div>

              <ul className="space-y-3 text-xs text-gray-700 font-medium mb-8">
                {SUBSCRIPTION_PLANS.premium_monthly.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">★</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              disabled={loadingPlan === "premium_monthly" || activePlanId === "premium_monthly"}
              onClick={() => handleSelectPlan("premium_monthly")}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 font-switzer active:scale-95"
            >
              {loadingPlan === "premium_monthly"
                ? "Connecting Paystack..."
                : activePlanId === "premium_monthly"
                ? "Current Plan"
                : "Choose Monthly"}
            </button>
          </div>

          {/* Plan 3: Annual Premium (Hero Plan - 33% Off) */}
          <div
            className={`bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-3xl p-7 border-2 border-amber-300 shadow-xl flex flex-col justify-between relative overflow-hidden font-switzer ${
              activePlanId === "premium_annual" ? "ring-4 ring-amber-300" : ""
            }`}
          >
            {/* Best Value Pill */}
            <div className="absolute top-4 right-4 bg-white text-amber-900 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
              Save 33%
            </div>

            <div>
              <div className="mb-4 pr-16">
                <h2 className="font-achiko text-2xl text-white">
                  {SUBSCRIPTION_PLANS.premium_annual.name}
                </h2>
              </div>

              <div className="mb-6">
                <p className="font-achiko text-4xl text-white mb-1">
                  {SUBSCRIPTION_PLANS.premium_annual.priceFormatted}
                  <span className="text-sm text-amber-100 font-switzer font-normal"> / year</span>
                </p>
                <p className="text-xs text-amber-100 font-medium">
                  {SUBSCRIPTION_PLANS.premium_annual.approxUsd} · {SUBSCRIPTION_PLANS.premium_annual.approxGbp} / year
                </p>
              </div>

              <ul className="space-y-3 text-xs text-amber-50 font-medium mb-8">
                {SUBSCRIPTION_PLANS.premium_annual.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-200 font-bold">✨</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              disabled={loadingPlan === "premium_annual" || activePlanId === "premium_annual"}
              onClick={() => handleSelectPlan("premium_annual")}
              className="w-full py-4 rounded-2xl bg-white text-amber-900 hover:bg-amber-50 text-xs font-black shadow-md transition-all disabled:opacity-50 font-switzer active:scale-95 text-center"
            >
              {loadingPlan === "premium_annual"
                ? "Connecting Paystack..."
                : activePlanId === "premium_annual"
                ? "Current Active Plan"
                : "Get Annual (Best Value) 🚀"}
            </button>
          </div>

        </div>

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
              <p className="text-[11px] text-gray-500">Unlocked across all kids immediately</p>
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