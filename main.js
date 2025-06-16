import { setupLogin } from './components/login.js';
import { setupDashboard } from './components/dashboard.js';

const app = document.getElementById('app');

async function main() {
  const token = localStorage.getItem('user_token');
  if (token) {
    await setupDashboard(app);
  } else {
    await setupLogin(app);
  }
}

main();
