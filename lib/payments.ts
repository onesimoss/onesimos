/**
 * @file lib/payments.ts
 * @description Paystack Payment & Subscription Engine for Onesimos.
 * Handles single-reader, family, extended family, and school classroom plans,
 * parent subscription resolution from Supabase, and Paystack transaction initialization.
 *
 * @fonts Achiko (headings) + Switzer (body/UI)
 * @dependencies
 * - @/lib/supabaseClient
 */

import { supabase } from "./supabaseClient";

// ─── Section 1: Types & Pricing Constants ───

export type SubscriptionPlanId =
  | "free"
  | "single_monthly"
  | "single_annual"
  | "family_monthly"
  | "family_annual"
  | "extended_monthly"
  | "school_term"
  | "school_annual"
  | "premium_monthly" // Legacy alias for single_monthly
  | "premium_annual"; // Legacy alias for single_annual

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "non-renewing"
  | "free";

export interface PlanConfig {
  id: SubscriptionPlanId;
  name: string;
  badge?: string;
  priceNgn: number;
  priceFormatted: string;
  approxUsd: string;
  approxGbp: string;
  interval: "month" | "year" | "term" | "free";
  maxChildren: number | "unlimited";
  features: string[];
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlanId, PlanConfig> = {
  free: {
    id: "free",
    name: "Starter Explorer",
    priceNgn: 0,
    priceFormatted: "₦0",
    approxUsd: "$0",
    approxGbp: "£0",
    interval: "free",
    maxChildren: 1,
    features: [
      "5 stories per month for 1 child",
      "2 solo spelling practice rounds per day",
      "Basic read-aloud pronunciation feedback",
      "Standard academic growth report card",
    ],
  },
  single_monthly: {
    id: "single_monthly",
    name: "Single Reader Monthly",
    priceNgn: 2500,
    priceFormatted: "₦2,500",
    approxUsd: "~$1.60",
    approxGbp: "~£1.30",
    interval: "month",
    maxChildren: 1,
    features: [
      "Unlimited stories for 1 Child",
      "Personal AI Living Story chapters woven from real mistakes",
      "Full 25 Core Life Skills & Virtues curriculum",
      "Unlimited daily spelling games with ElevenLabs audio",
      "Comprehensive growth reports & WPM tracking",
      "Cancel anytime with one tap",
    ],
  },
  single_annual: {
    id: "single_annual",
    name: "Single Reader Annual",
    badge: "Save 33%",
    priceNgn: 19999,
    priceFormatted: "₦19,999",
    approxUsd: "~$13.00",
    approxGbp: "~£10.50",
    interval: "year",
    maxChildren: 1,
    popular: true,
    features: [
      "Everything in Single Monthly for 1 Child all year",
      "33% annual discount (Save ₦10,000/yr)",
      "Priority AI chapter weaving",
      "Full offline bookshelf access (Read for Fun)",
      "Unlocks all age bands (3 to 9 years)",
    ],
  },
  family_monthly: {
    id: "family_monthly",
    name: "Family Plan Monthly",
    badge: "Most Popular for Homes",
    priceNgn: 5000,
    priceFormatted: "₦5,000",
    approxUsd: "~$3.20",
    approxGbp: "~£2.60",
    interval: "month",
    maxChildren: 4,
    popular: true,
    features: [
      "Unlimited stories for UP TO 4 CHILDREN",
      "Individual Word Pockets & spelling tracking per child",
      "Personal Living Chapters for every reader",
      "Family dashboard with multi-child growth cards",
      "Mastered Words Wall & Progress Story timelines",
    ],
  },
  family_annual: {
    id: "family_annual",
    name: "Family Plan Annual",
    badge: "Best Family Value",
    priceNgn: 39999,
    priceFormatted: "₦39,999",
    approxUsd: "~$26.00",
    approxGbp: "~£21.00",
    interval: "year",
    maxChildren: 4,
    features: [
      "Everything in Family Monthly for up to 4 children all year",
      "Save 33% on annual family billing",
      "Print/Save PDF progress packages for all kids",
      "Continuous curriculum & geo-adaptive updates",
    ],
  },
  extended_monthly: {
    id: "extended_monthly",
    name: "Extended Family & Daycare",
    priceNgn: 15000,
    priceFormatted: "₦15,000",
    approxUsd: "~$9.60",
    approxGbp: "~£7.80",
    interval: "month",
    maxChildren: 10,
    features: [
      "Unlimited reading for UP TO 10 CHILDREN",
      "Ideal for extended families, home-schools & daycares",
      "Individualized progress tracking for every reader",
      "Dedicated account management support",
    ],
  },
  school_term: {
    id: "school_term",
    name: "School Classroom License",
    badge: "For Teachers & Schools",
    priceNgn: 30000,
    priceFormatted: "₦30,000",
    approxUsd: "~$19.00",
    approxGbp: "~£15.50",
    interval: "term",
    maxChildren: 30,
    features: [
      "Covers 1 Classroom (UP TO 30 STUDENTS) for 1 Term",
      "Teacher dashboard with classroom fluency leaderboards",
      "Printable end-of-term academic report packages for parents",
      "Phonics & Spelling drills tailored for group learning",
    ],
  },
  school_annual: {
    id: "school_annual",
    name: "Classroom Full School Year",
    badge: "Best School Value",
    priceNgn: 85000,
    priceFormatted: "₦85,000",
    approxUsd: "~$55.00",
    approxGbp: "~£44.00",
    interval: "year",
    maxChildren: 30,
    features: [
      "Covers 1 Classroom (Up to 30 Students) for 3 Full Terms",
      "Save ₦5,000 off termly billing",
      "Official Onesimos School Partner Badge for school portal",
    ],
  },

  // Legacy mappings for existing DB rows
  premium_monthly: {
    id: "premium_monthly",
    name: "Living Reader Monthly",
    priceNgn: 2500,
    priceFormatted: "₦2,500",
    approxUsd: "~$1.60",
    approxGbp: "~£1.30",
    interval: "month",
    maxChildren: "unlimited",
    features: ["Unlimited stories for all children", "Living chapters"],
  },
  premium_annual: {
    id: "premium_annual",
    name: "Living Reader Annual",
    priceNgn: 19999,
    priceFormatted: "₦19,999",
    approxUsd: "~$13.00",
    approxGbp: "~£10.50",
    interval: "year",
    maxChildren: "unlimited",
    features: ["Unlimited annual stories for all children", "Living chapters"],
  },
};

export interface ParentSubscriptionRow {
  id: string;
  parent_id: string;
  plan: SubscriptionPlanId;
  provider: "paystack" | "manual";
  paystack_customer_code?: string | null;
  paystack_subscription_code?: string | null;
  paystack_email_token?: string | null;
  currency: string;
  status: SubscriptionStatus;
  current_period_start?: string | null;
  current_period_end?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ─── Section 2: Subscription Status Checkers ───

/**
 * Fetches active subscription details for a parent from Supabase.
 */
export async function getParentSubscription(
  parentId: string
): Promise<ParentSubscriptionRow | null> {
  if (!parentId) return null;

  try {
    const { data, error } = await supabase
      .from("parent_subscriptions")
      .select("*")
      .eq("parent_id", parentId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as ParentSubscriptionRow;
  } catch (err) {
    console.error("Error fetching parent subscription:", err);
    return null;
  }
}

/**
 * Evaluates whether a parent currently has active, unlimited paid access.
 */
export async function hasActivePaidPlan(parentId: string): Promise<boolean> {
  if (!parentId) return false;

  const sub = await getParentSubscription(parentId);
  if (!sub) return false;

  const isActive = sub.status === "active";
  const isPaid = sub.plan !== "free";

  if (sub.current_period_end) {
    const expiresAt = new Date(sub.current_period_end).getTime();
    if (Date.now() > expiresAt) {
      return false;
    }
  }

  return isActive && isPaid;
}

// ─── Section 3: Paystack API Integration Helpers ───

interface PaystackInitParams {
  email: string;
  amountNgn: number;
  planId: SubscriptionPlanId;
  parentId: string;
  callbackUrl: string;
}

interface PaystackInitResult {
  authorization_url?: string;
  access_code?: string;
  reference?: string;
  error?: string;
}

export async function initializePaystackCheckout(
  params: PaystackInitParams,
  secretKey: string
): Promise<PaystackInitResult> {
  try {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: params.email,
        amount: params.amountNgn * 100, // Paystack requires kobo
        currency: "NGN",
        reference: `ons_${params.planId}_${params.parentId.slice(0, 8)}_${Date.now()}`,
        callback_url: params.callbackUrl,
        metadata: {
          parent_id: params.parentId,
          plan_id: params.planId,
          custom_fields: [
            {
              display_name: "Plan",
              variable_name: "plan",
              value: SUBSCRIPTION_PLANS[params.planId]?.name || params.planId,
            },
          ],
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      return { error: data.message || "Failed to initialize Paystack checkout" };
    }

    return {
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    };
  } catch (err) {
    console.error("Paystack initialize error:", err);
    return { error: "Network error connecting to payment gateway" };
  }
}

export async function verifyPaystackReference(
  reference: string,
  secretKey: string
): Promise<{
  success: boolean;
  parentId?: string;
  planId?: SubscriptionPlanId;
  customerCode?: string;
  amount?: number;
  error?: string;
}> {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status || data.data.status !== "success") {
      return {
        success: false,
        error: data.message || "Transaction was not successful",
      };
    }

    const metadata = data.data.metadata || {};
    const parentId = metadata.parent_id;
    const planId = (metadata.plan_id as SubscriptionPlanId) || "single_monthly";

    return {
      success: true,
      parentId,
      planId,
      customerCode: data.data.customer?.customer_code,
      amount: data.data.amount / 100,
    };
  } catch (err) {
    console.error("Paystack verify error:", err);
    return { success: false, error: "Network error verifying transaction" };
  }
}