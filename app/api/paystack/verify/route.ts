/**
 * @file app/api/paystack/verify/route.ts
 * @description Paystack Payment Callback & Verification Route.
 * Verifies transaction with Paystack server, writes or updates
 * the parent subscription record in Supabase, and redirects to dashboard.
 *
 * @dependencies
 * - @/lib/supabaseClient
 * - @/lib/payments
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import {
  verifyPaystackReference,
  SUBSCRIPTION_PLANS,
  type SubscriptionPlanId,
} from "@/lib/payments";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const baseUrl =
    request.headers.get("origin") ||
    `https://${request.headers.get("host") || "onesimos.app"}`;

  if (!reference) {
    return NextResponse.redirect(`${baseUrl}/parent/pricing?error=missing_reference`);
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error("Missing PAYSTACK_SECRET_KEY");
    return NextResponse.redirect(`${baseUrl}/parent/pricing?error=server_config`);
  }

  // 1. Verify transaction with Paystack
  const result = await verifyPaystackReference(reference, secretKey);

  if (!result.success || !result.parentId || !result.planId) {
    console.error("Paystack verification failed:", result.error);
    return NextResponse.redirect(
      `${baseUrl}/parent/pricing?error=${encodeURIComponent(result.error || "verification_failed")}`
    );
  }

  const { parentId, planId, customerCode } = result;
  const plan = SUBSCRIPTION_PLANS[planId as SubscriptionPlanId];

  // 2. Calculate subscription period dates
  const now = new Date();
  const periodEnd = new Date(now);
  if (plan.interval === "year") {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  }

  try {
    // 3. Upsert subscription into Supabase parent_subscriptions table
    const { error: dbError } = await supabase
      .from("parent_subscriptions")
      .upsert(
        {
          parent_id: parentId,
          plan: planId,
          provider: "paystack",
          paystack_customer_code: customerCode || null,
          currency: "NGN",
          status: "active",
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
          updated_at: now.toISOString(),
        },
        { onConflict: "parent_id" }
      );

    if (dbError) {
      console.error("Failed to update parent_subscriptions in DB:", dbError);
      return NextResponse.redirect(
        `${baseUrl}/parent/pricing?error=db_update_failed`
      );
    }

    // 4. Redirect to parent dashboard with celebration query param
    return NextResponse.redirect(`${baseUrl}/parent?payment=success&plan=${planId}`);
  } catch (err) {
    console.error("Unexpected error saving verified subscription:", err);
    return NextResponse.redirect(`${baseUrl}/parent/pricing?error=unknown`);
  }
}