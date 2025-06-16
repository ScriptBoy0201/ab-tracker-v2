import { loginUser, signupUser } from './api.js';
import { showToast } from '../utils/toast.js';
import { setupDashboard } from './dashboard.js';

export async function setupLogin(container) {
  container.innerHTML = `
    <section id="login-section">
      <h2>Login or Sign Up</h2>
      <form id="login-form">
        <input type="email" id="email" placeholder="Email" required />
        <input type="password" id="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <button id="signup-btn">Sign Up</button>
    </section>
  `;

  const loginForm = container.querySelector('#login-form');
  loginForm.onsubmit = async e => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    try {
      const token = await loginUser(email, password);
      localStorage.setItem('user_token', token);
      showToast('Login successful!', 'success');
      await setupDashboard(container);
    } catch (err) {
      showToast('Login failed', 'error');
    }
  };

  container.querySelector('#signup-btn').onclick = () => setupSignup(container);
}

function setupSignup(container) {
  container.innerHTML = `
    <section id="signup-section">
      <h2>Create Account</h2>
      <form id="signup-form">
        <input type="email" id="email" placeholder="Email" required />
        <input type="password" id="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
      <button id="back-login-btn">Back to Login</button>
    </section>
  `;

  const signupForm = container.querySelector('#signup-form');
  signupForm.onsubmit = async e => {
    e.preventDefault();
    const email = signupForm.email.value;
    const password = signupForm.password.value;
    try {
      await signupUser(email, password);
      showToast('Signup successful! Please login.', 'success');
      setupLogin(container);
    } catch (err) {
      showToast('Signup failed', 'error');
    }
  };

  container.querySelector('#back-login-btn').onclick = () => setupLogin(container);
}
