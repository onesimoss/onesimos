/**
 * @file app/api/paystack/initialize/route.ts
 * @description Secure Server API route to initialize Paystack checkout sessions.
 * Converts selected plan into kobo, attaches parent metadata, and returns
 * the authorization URL for seamless client redirection.
 *
 * @dependencies
 * - @/lib/payments
 */

import { NextRequest, NextResponse } from "next/server";
import {
  SUBSCRIPTION_PLANS,
  initializePaystackCheckout,
  type SubscriptionPlanId,
} from "@/lib/payments";

interface RequestBody {
  planId?: SubscriptionPlanId;
  email?: string;
  parentId?: string;
  callbackUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;
    const { planId, email, parentId, callbackUrl } = body;

    // Validate required fields
    if (!planId || !email || !parentId) {
      return NextResponse.json(
        { error: "Missing required fields: planId, email, or parentId" },
        { status: 400 }
      );
    }

    // Validate plan
    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan || plan.id === "free") {
      return NextResponse.json(
        { error: "Invalid subscription plan selected" },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      console.error("Missing PAYSTACK_SECRET_KEY environment variable");
      return NextResponse.json(
        { error: "Payment gateway configuration error on server" },
        { status: 500 }
      );
    }

    // Determine callback URL (fallback to origin /parent/pricing)
    const host = request.headers.get("origin") || request.headers.get("host") || "https://onesimos.app";
    const resolvedCallbackUrl =
      callbackUrl ||
      `${host.startsWith("http") ? host : `https://${host}`}/api/paystack/verify`;

    // Initialize Paystack checkout
    const result = await initializePaystackCheckout(
      {
        email: email.trim().toLowerCase(),
        amountNgn: plan.priceNgn,
        planId,
        parentId,
        callbackUrl: resolvedCallbackUrl,
      },
      secretKey
    );

    if (result.error || !result.authorization_url) {
      return NextResponse.json(
        { error: result.error || "Could not initialize checkout" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      authorization_url: result.authorization_url,
      access_code: result.access_code,
      reference: result.reference,
    });
  } catch (err) {
    console.error("Unexpected error initializing Paystack transaction:", err);
    return NextResponse.json(
      { error: "Internal server error initializing payment" },
      { status: 500 }
    );
  }
}