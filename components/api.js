import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://YOUR_PROJECT.supabase.co';
const supabaseKey = 'YOUR_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Calculate body fat % from weight and waist (US Navy method simplified)
function calculateBodyFat(weight, waist) {
  // Simple formula (replace with better one if you want)
  // Just a placeholder: BF% = 495/(1.0324 - 0.19077*log10(waist - weight*0.22) + 0.15456*log10(height)) - 450
  // Without height, we'll use a simplified proxy (not accurate, but demo ready)
  return 495 / (1.0324 - 0.19077 * Math.log10(waist - weight * 0.22) + 0.15456 * Math.log10(weight)) - 450;
}

export async function fetchProgress() {
  const user = supabase.auth.user();
  if (!user) return [];
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });
  if (error) {
    console.error('Error fetching progress:', error);
    return [];
  }
  return data || [];
}

export async function saveProgress(weight, waist) {
  const user = supabase.auth.user();
  if (!user) throw new Error('User not logged in');
  const body_fat = calculateBodyFat(weight, waist);
  const { error } = await supabase.from('progress').insert({
    user_id: user.id,
    weight,
    waist,
    body_fat,
    date: new Date().toISOString(),
  });
  if (error) {
    console.error('Error saving progress:', error);
  }
}
