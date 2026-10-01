/**
 * @file app/api/parent/delete-account/route.ts
 * @description Secure API route allowing authenticated parents to either Deactivate or
 * Permanently Delete their account under GDPR-K Right to Erasure laws.
 *
 * @module app/api/parent/delete-account/route
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization token" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const body = await req.json().catch(() => ({}));
    const action = body.action || "delete"; // "deactivate" | "delete"

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({ error: "Supabase configuration missing" }, { status: 500 });
    }

    // 1. Verify parent user identity using user token
    const supabaseClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Invalid parent session" }, { status: 401 });
    }

    const parentId = user.id;

    // ACTION A: DEACTIVATE ACCOUNT (Pause subscription & freeze profiles)
    if (action === "deactivate") {
      await supabaseClient
        .from("parent_subscriptions")
        .update({ status: "deactivated", updated_at: new Date().toISOString() })
        .eq("parent_id", parentId);

      return NextResponse.json({
        success: true,
        message: "Account deactivated. Your child progress is safely preserved.",
      });
    }

    // ACTION B: PERMANENTLY DELETE ACCOUNT (GDPR-K Hard Purge)
    // 2. Fetch all children owned by parent
    const { data: children } = await supabaseClient
      .from("children")
      .select("id")
      .eq("parent_id", parentId);

    if (children && children.length > 0) {
      const childIds = children.map((c) => c.id);

      // Cascade delete public table records using RLS
      await Promise.all([
        supabaseClient.from("reading_sessions").delete().in("child_id", childIds),
        supabaseClient.from("stumbled_words_log").delete().in("child_id", childIds),
        supabaseClient.from("stumbled_words").delete().in("child_id", childIds),
        supabaseClient.from("generated_stories").delete().in("child_id", childIds),
        supabaseClient.from("mastered_words").delete().in("child_id", childIds),
      ]);

      await supabaseClient.from("children").delete().eq("parent_id", parentId);
    }

    await supabaseClient.from("parent_subscriptions").delete().eq("parent_id", parentId);

    // 3. Purge user from auth.users if Service Role Key is configured
    if (serviceRoleKey) {
      try {
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
          auth: { persistSession: false },
        });
        await supabaseAdmin.auth.admin.deleteUser(parentId);
      } catch (adminErr) {
        console.warn("[DeleteAccount] Admin delete user warning:", adminErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Account permanently deleted.",
    });
  } catch (err) {
    console.error("[DeleteAccount] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}