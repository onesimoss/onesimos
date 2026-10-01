/**
 * @file app/api/parent/delete-account/route.ts
 * @description Secure API route allowing authenticated parents to delete their account,
 * child profiles, reading history, and auth credentials under GDPR-K Right to Erasure laws.
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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Server configuration missing" }, { status: 500 });
    }

    // Initialize Supabase Admin Client
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // Verify requesting parent user
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Invalid parent session" }, { status: 401 });
    }

    const parentId = user.id;

    // 1. Fetch all child IDs owned by parent
    const { data: children } = await supabaseAdmin
      .from("children")
      .select("id")
      .eq("parent_id", parentId);

    if (children && children.length > 0) {
      const childIds = children.map((c) => c.id);

      // 2. Cascade delete child session logs and stumbled words
      await Promise.all([
        supabaseAdmin.from("reading_sessions").delete().in("child_id", childIds),
        supabaseAdmin.from("stumbled_words_log").delete().in("child_id", childIds),
        supabaseAdmin.from("stumbled_words").delete().in("child_id", childIds),
        supabaseAdmin.from("generated_stories").delete().in("child_id", childIds),
        supabaseAdmin.from("mastered_words").delete().in("child_id", childIds),
      ]);

      // 3. Delete child profiles
      await supabaseAdmin.from("children").delete().eq("parent_id", parentId);
    }

    // 4. Delete parent subscription row
    await supabaseAdmin.from("parent_subscriptions").delete().eq("parent_id", parentId);

    // 5. Delete parent user from auth.users (allows email re-registration)
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(parentId);

    if (deleteUserError) {
      console.error("[DeleteAccount] Auth delete error:", deleteUserError);
      return NextResponse.json({ error: "Failed to purge user auth record" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error("[DeleteAccount] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}