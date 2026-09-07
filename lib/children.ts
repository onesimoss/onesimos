import { supabase } from "./supabaseClient";

export type Curriculum =
  | "nigerian"
  | "british"
  | "american"
  | "ghanaian"
  | "international"
  | "other";

export interface ChildProfile {
  id: string;
  parent_id: string;
  name: string;
  age: number;
  avatar_id: string;
  reading_level: number;
  curriculum: Curriculum;
  interests: string[];
  session_minutes: 20 | 30 | 45;
  cultural_context: string;
  onboarding_completed: boolean;
  created_at?: string;
}

export interface CreateChildInput {
  name: string;
  age: number;
  avatar_id: string;
  reading_level: number;
  curriculum: Curriculum;
  interests: string[];
  session_minutes: 20 | 30 | 45;
  cultural_context?: string;
}

export async function getChildrenForParent(parentId: string) {
  const { data, error } = await supabase
    .from("children")
    .select("*")
    .eq("parent_id", parentId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching children:", error);
    return { data: [] as ChildProfile[], error };
  }

  return { data: (data || []) as ChildProfile[], error: null };
}

export async function createChild(parentId: string, input: CreateChildInput) {
  const { data, error } = await supabase
    .from("children")
    .insert({
      parent_id: parentId,
      name: input.name.trim(),
      age: input.age,
      avatar_id: input.avatar_id,
      reading_level: input.reading_level,
      curriculum: input.curriculum,
      interests: input.interests,
      session_minutes: input.session_minutes,
      cultural_context: input.cultural_context || "general",
      onboarding_completed: true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating child:", error);
    return { data: null, error };
  }

  return { data: data as ChildProfile, error: null };
}

export async function hasAnyChildren(parentId: string) {
  const { data, error } = await supabase
    .from("children")
    .select("id")
    .eq("parent_id", parentId)
    .limit(1);

  if (error) {
    console.error("Error checking children:", error);
    return false;
  }

  return (data?.length || 0) > 0;
}

/** Rough default reading level from age (can refine later with real assessment) */
export function defaultReadingLevelFromAge(age: number): number {
  if (age <= 4) return 1;
  if (age === 5) return 2;
  if (age === 6) return 3;
  if (age === 7) return 4;
  if (age === 8) return 6;
  if (age === 9) return 7;
  return Math.min(age - 2, 12);
}