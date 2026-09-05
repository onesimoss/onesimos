import { supabase } from "./supabaseClient";

export async function getTodayProgress(childId: string) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('daily_progress')
    .select('*')
    .eq('child_id', childId)
    .eq('date', today)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching daily progress:', error);
    return { error };
  }

  return { data, error: null };
}

export async function hasCompletedToday(childId: string) {
  const result = await getTodayProgress(childId);
  return result.data !== null && result.data !== undefined;
}

export async function saveDailyProgress({
  childId,
  storyId,
  wordsRead,
  comprehensionScore,
  badgesEarned = [],
}: {
  childId: string;
  storyId?: string;
  wordsRead: number;
  comprehensionScore: number;
  badgesEarned?: string[];
}) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('daily_progress')
    .upsert({
      child_id: childId,
      date: today,
      story_id: storyId,
      words_read: wordsRead,
      comprehension_score: comprehensionScore,
      badges_earned: badgesEarned,
      completed_at: new Date().toISOString(),
    }, { onConflict: 'child_id,date' })
    .select()
    .single();

  if (error) {
    console.error('Error saving daily progress:', error);
    return { error };
  }

  return { data, error: null };
}

// 🔥 FIX: Mark phonics as passed - uses upsert
export async function markPhonicsPassed(childId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  
  const { error } = await supabase
    .from('daily_progress')
    .upsert({
      child_id: childId,
      date: today,
      phonics_passed: true,
      completed_at: new Date().toISOString(),
    }, { onConflict: 'child_id,date' });

  if (error) {
    console.error('Error marking phonics passed:', error);
  }
}

// 🔥 FIX: Check if phonics is passed - looks for the most recent record
export async function hasPassedPhonics(childId: string): Promise<boolean> {
  try {
    // Get the most recent daily_progress record for this child
    const { data, error } = await supabase
      .from('daily_progress')
      .select('phonics_passed')
      .eq('child_id', childId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // If no record found, return false
      if (error.code === 'PGRST116') {
        return false;
      }
      console.error('Error checking phonics passed:', error);
      return false;
    }

    return data?.phonics_passed === true;
  } catch (error) {
    console.error('Error in hasPassedPhonics:', error);
    return false;
  }
}

export async function getChildStreak(childId: string) {
  const { data, error } = await supabase
    .from('daily_progress')
    .select('date')
    .eq('child_id', childId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching streak:', error);
    return { streak: 0 };
  }

  if (!data || data.length === 0) return { streak: 0 };

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const record of data) {
    const recordDate = new Date(record.date);
    recordDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currentDate.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (diffDays === 1) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return { streak };
}

export async function saveStumbledWord(childId: string, word: string, sessionId?: string) {
  const { error } = await supabase
    .from('stumbled_words_log')
    .insert({
      child_id: childId,
      word: word.toLowerCase().trim(),
      session_id: sessionId,
    });

  if (error) {
    console.error('Error saving stumbled word:', error);
    return { error };
  }

  return { error: null };
}

export async function getStumbledWords(childId: string) {
  const { data, error } = await supabase
    .from('stumbled_words_log')
    .select('word, occurred_at')
    .eq('child_id', childId)
    .order('occurred_at', { ascending: false });

  if (error) {
    console.error('Error fetching stumbled words:', error);
    return { error };
  }

  const wordCount: Record<string, number> = {};
  data?.forEach((item: { word: string }) => {
    wordCount[item.word] = (wordCount[item.word] || 0) + 1;
  });

  const sortedWords = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({ word, count }));

  return { data: sortedWords, error: null };
}

// 🔥 NEW: Get child's reading level
export async function getChildReadingLevel(childId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('children')
      .select('reading_level, age')
      .eq('id', childId)
      .single();

    if (error) {
      console.error('Error fetching child reading level:', error);
      return 7; // Default
    }

    // If reading_level is set, use it; otherwise use age
    if (data?.reading_level) {
      return data.reading_level;
    }
    // Fallback: use age (capped at 12, minimum 3)
    return Math.min(Math.max(data?.age || 7, 3), 12);
  } catch (error) {
    console.error('Error in getChildReadingLevel:', error);
    return 7;
  }
}