import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://YOUR_PROJECT.supabase.co';
const supabaseKey = 'YOUR_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

export function setupAuth(container, onLogin) {
  container.innerHTML = `
    <section id="auth-section">
      <input type="email" id="email" placeholder="Email" />
      <input type="password" id="password" placeholder="Password" />
      <button id="login-btn">Login</button>
      <button id="signup-btn">Sign Up</button>
      <div id="auth-msg"></div>
    </section>
  `;

  const emailInput = container.querySelector('#email');
  const passwordInput = container.querySelector('#password');
  const loginBtn = container.querySelector('#login-btn');
  const signupBtn = container.querySelector('#signup-btn');
  const authMsg = container.querySelector('#auth-msg');

  loginBtn.onclick = async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      authMsg.textContent = `Error: ${error.message}`;
    } else {
      authMsg.textContent = 'Login successful!';
      onLogin();
    }
  };

  signupBtn.onclick = async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      authMsg.textContent = `Error: ${error.message}`;
    } else {
      authMsg.textContent = 'Sign up successful! Please verify your email and login.';
    }
  };
}
