/**
 * @file lib/payments.ts
 * @description Paystack Payment & Subscription Engine for Onesimos.
 * Handles plan tiers, parent subscription resolution from Supabase,
 * and server-side Paystack transaction initialization & verification.
 *
 * @fonts Achiko (headings) + Switzer (body/UI)
 * @dependencies
 * - @/lib/supabaseClient
 */

import { supabase } from "./supabaseClient";

// ─── Section 1: Types & Pricing Constants ───

export type SubscriptionPlanId = "free" | "premium_monthly" | "premium_annual";

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
  interval: "month" | "year" | "free";
  storyLimit: number | "unlimited";
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
    storyLimit: 3,
    features: [
      "3 reading stories per child every month",
      "Solo spelling practice game",
      "Basic read-aloud pronunciation feedback",
      "Standard reading report card",
    ],
  },
  premium_monthly: {
    id: "premium_monthly",
    name: "Living Reader Monthly",
    priceNgn: 2500,
    priceFormatted: "₦2,500",
    approxUsd: "~$1.60",
    approxGbp: "~£1.30",
    interval: "month",
    storyLimit: "unlimited",
    features: [
      "Unlimited stories for ALL your children",
      "Personal AI Living Story chapters woven from real mistakes",
      "Full 25 Core Life Skills & Virtues curriculum",
      "Comprehensive academic growth reports & WPM tracking",
      "Adaptive reading difficulty bridge",
      "Cancel anytime with one tap",
    ],
  },
  premium_annual: {
    id: "premium_annual",
    name: "Living Reader Annual",
    badge: "Save 33% (Best Value)",
    priceNgn: 19999,
    priceFormatted: "₦19,999",
    approxUsd: "~$13.00",
    approxGbp: "~£10.50",
    interval: "year",
    storyLimit: "unlimited",
    popular: true,
    features: [
      "Everything in Monthly with 33% annual discount",
      "Unlimited stories for ALL your children all year",
      "Priority AI chapter weaving",
      "Full offline bookshelf access (Read for Fun)",
      "Unlocks all age bands (3–9 years)",
      "Continuous curriculum & geo-adaptive updates",
    ],
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
 *
 * @param parentId - Supabase Auth User ID
 * @returns ParentSubscriptionRow or null
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
 *
 * @param parentId - Supabase Auth User ID
 * @returns boolean
 */
export async function hasActivePaidPlan(parentId: string): Promise<boolean> {
  if (!parentId) return false;

  const sub = await getParentSubscription(parentId);
  if (!sub) return false;

  const isActive = sub.status === "active";
  const isPaid = sub.plan === "premium_monthly" || sub.plan === "premium_annual";

  // If a period end date is specified, ensure it hasn't expired
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

/**
 * Initializes a Paystack transaction securely via the server.
 * Amount is converted to kobo (amountNgn * 100).
 */
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
              value: SUBSCRIPTION_PLANS[params.planId].name,
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

/**
 * Verifies a completed Paystack transaction by reference.
 */
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
    const planId = (metadata.plan_id as SubscriptionPlanId) || "premium_monthly";

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