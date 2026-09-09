import { supabase } from "./supabaseClient";

export async function ensureParentProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, parent_pin")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error loading profile:", error);
    return { data: null, error };
  }

  if (data) {
    return { data, error: null };
  }

  const { data: created, error: insertError } = await supabase
    .from("profiles")
    .insert({ id: userId })
    .select("id, parent_pin")
    .single();

  if (insertError) {
    console.error("Error creating profile:", insertError);
    return { data: null, error: insertError };
  }

  return { data: created, error: null };
}

export async function setParentPin(userId: string, pin: string) {
  const cleaned = pin.replace(/\D/g, "");
  if (cleaned.length !== 4) {
    return { error: { message: "Parent code must be exactly 4 digits" } };
  }

  await ensureParentProfile(userId);

  const { error } = await supabase
    .from("profiles")
    .update({ parent_pin: cleaned, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    console.error("Error setting parent PIN:", error);
    return { error };
  }

  return { error: null };
}

export async function verifyParentPin(userId: string, pin: string) {
  const cleaned = pin.replace(/\D/g, "");
  const { data, error } = await ensureParentProfile(userId);

  if (error || !data) {
    return { ok: false, error: error || { message: "Could not verify" } };
  }

  // No parent code set yet → allow entry, but dashboard should prompt setup
  if (!data.parent_pin) {
    return { ok: true, needsSetup: true, error: null };
  }

  if (data.parent_pin !== cleaned) {
    return {
      ok: false,
      needsSetup: false,
      error: { message: "That code doesn't match. Try again." },
    };
  }

  return { ok: true, needsSetup: false, error: null };
}

export async function getParentPinStatus(userId: string) {
  const { data, error } = await ensureParentProfile(userId);
  if (error || !data) {
    return { hasPin: false, error };
  }
  return {
    hasPin: !!(data.parent_pin && String(data.parent_pin).length === 4),
    error: null,
  };
}