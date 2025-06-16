import { setupAuth } from './components/auth.js';
import { setupDashboard } from './components/dashboard.js';

const appRoot = document.getElementById('app-root');
const themeBtn = document.getElementById('toggle-theme');
const themeStyle = document.getElementById('theme-style');

themeBtn.onclick = () => {
  if(themeStyle.href.includes('light.css')) {
    themeStyle.href = 'assets/dark.css';
    localStorage.setItem('theme', 'dark');
  } else {
    themeStyle.href = 'assets/light.css';
    localStorage.setItem('theme', 'light');
  }
};

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme === 'dark') themeStyle.href = 'assets/dark.css';

  setupAuth(appRoot, () => {
    setupDashboard(appRoot);
  });
});
