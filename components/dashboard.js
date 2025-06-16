import { fetchProgress, saveProgress } from './api.js';
import { setupCoach } from './coach.js';

export function setupDashboard(container) {
  container.innerHTML = `
    <section id="dashboard">
      <h2>Welcome to Abs Tracker Pro</h2>
      <button id="logout-btn">Logout</button>

      <h3>Track Your Progress</h3>
      <form id="progress-form">
        <input type="number" id="weight" placeholder="Weight (kg)" step="0.1" required />
        <input type="number" id="waist" placeholder="Waist (cm)" step="0.1" required />
        <button type="submit">Save Progress</button>
      </form>

      <h3>Progress History</h3>
      <table id="history-table">
        <thead><tr><th>Date</th><th>Weight</th><th>Waist</th><th>Body Fat %</th></tr></thead>
        <tbody></tbody>
      </table>

      <div id="ai-coach-container"></div>
    </section>
  `;

  const logoutBtn = container.querySelector('#logout-btn');
  logoutBtn.onclick = () => location.reload();

  const form = container.querySelector('#progress-form');
  const tbody = container.querySelector('#history-table tbody');

  async function loadHistory() {
    const data = await fetchProgress();
    tbody.innerHTML = '';
    data.forEach(row => {
      tbody.innerHTML += `
        <tr>
          <td>${new Date(row.date).toLocaleDateString()}</td>
          <td>${row.weight.toFixed(1)}</td>
          <td>${row.waist.toFixed(1)}</td>
          <td>${row.body_fat.toFixed(1)}</td>
        </tr>
      `;
    });
  }

  form.onsubmit = async e => {
    e.preventDefault();
    const weight = parseFloat(form.weight.value);
    const waist = parseFloat(form.waist.value);
    await saveProgress(weight, waist);
    form.reset();
    await loadHistory();
  };

  loadHistory();
  setupCoach(container.querySelector('#ai-coach-container'));
}
