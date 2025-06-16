const API_URL = 'https://your-supabase-url.supabase.co'; // replace with your Supabase URL
const API_KEY = 'your-anon-key'; // replace with your Supabase anon key

export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || 'Login failed');
  return data.access_token;
}

export async function signupUser(email, password) {
  const res = await fetch(`${API_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      apikey: API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || 'Signup failed');
  return data;
}

export async function fetchProgress() {
  const token = localStorage.getItem('user_token');
  const res = await fetch(`${API_URL}/rest/v1/progress?order=date.asc`, {
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch progress');
  return res.json();
}

export async function saveProgress(weight, waist) {
  const token = localStorage.getItem('user_token');
  // calculate body fat percentage (simplified)
  // For demo, just random in 10–20%
  const body_fat = 10 + Math.random() * 10;
  const res = await fetch(`${API_URL}/rest/v1/progress`, {
    method: 'POST',
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      date: new Date().toISOString(),
      weight,
      waist,
      body_fat,
    }),
  });
  if (!res.ok) throw new Error('Failed to save progress');
  return res.json();
}
