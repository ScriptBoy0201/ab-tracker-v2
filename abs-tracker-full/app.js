import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://YOUR_PROJECT.supabase.co';
const supabaseKey = 'YOUR_PUBLIC_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

let currentUser = null;

// AUTH
async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (data?.user) {
    currentUser = data.user;
    document.getElementById('app').style.display = 'block';
    loadHistory();
  }
}

async function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (data?.user) alert('Signed up! Please log in.');
}

async function logout() {
  await supabase.auth.signOut();
  currentUser = null;
  document.getElementById('app').style.display = 'none';
}

// PROGRESS
async function saveProgress() {
  const weight = parseFloat(document.getElementById('weight').value);
  const waist = parseFloat(document.getElementById('waist').value);
  const bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - weight * 0.22) + 0.15456 * Math.log10(weight)) - 450;
  document.getElementById('output').innerText = `Body Fat %: ${bf.toFixed(1)}`;

  await supabase.from('progress').insert({
    user_id: currentUser.id,
    weight,
    waist,
    body_fat: bf,
    date: new Date().toISOString()
  });

  loadHistory();
}

async function loadHistory() {
  const { data } = await supabase.from('progress').select('*').eq('user_id', currentUser.id).order('date', { ascending: false });
  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML = '';
  data.forEach(row => {
    tbody.innerHTML += `<tr><td>${new Date(row.date).toLocaleDateString()}</td><td>${row.weight}</td><td>${row.waist}</td><td>${row.body_fat.toFixed(1)}</td></tr>`;
  });
}

// AI COACH
async function askAI() {
  const input = document.getElementById('userInput').value;
  const resBox = document.getElementById('aiResponse');
  resBox.innerHTML = 'Thinking...';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_OPENAI_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful AI fitness coach.' },
        { role: 'user', content: input }
      ]
    })
  });

  const json = await response.json();
  resBox.innerHTML = json.choices?.[0]?.message?.content || 'Error';
}

window.login = login;
window.signup = signup;
window.logout = logout;
window.saveProgress = saveProgress;
window.askAI = askAI;
