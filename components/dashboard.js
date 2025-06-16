import { fetchProgress, saveProgress } from './api.js';
import { setupCoach } from './coach.js';
import { showToast } from '../utils/toast.js';

export async function setupDashboard(container) {
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

      <div id="charts-container">
        <canvas id="progress-chart" width="400" height="200"></canvas>
      </div>

      <h3>Calendar Heatmap</h3>
      <div id="calendar-heatmap"></div>

      <h3>Progress Streak</h3>
      <p id="streak-counter"></p>

      <h3>Export Data</h3>
      <button id="export-btn">Export CSV</button>

      <div id="ai-coach-container"></div>
    </section>
  `;

  const logoutBtn = container.querySelector('#logout-btn');
  logoutBtn.onclick = () => {
    localStorage.removeItem('user_token');
    location.reload();
  };

  const form = container.querySelector('#progress-form');
  form.onsubmit = async e => {
    e.preventDefault();
    const weight = parseFloat(form.weight.value);
    const waist = parseFloat(form.waist.value);
    if (isNaN(weight) || isNaN(waist)) {
      showToast('Please enter valid numbers', 'error');
      return;
    }
    try {
      await saveProgress(weight, waist);
      showToast('Progress saved!', 'success');
      form.reset();
      await loadAndRender();
    } catch (e) {
      showToast('Failed to save progress', 'error');
    }
  };

  async function loadAndRender() {
    const data = await fetchProgress();
    renderChart(data);
    renderCalendarHeatmap(data);
    renderStreak(data);
  }

  function renderChart(data) {
    const ctx = container.querySelector('#progress-chart').getContext('2d');
    const labels = data.map(d => new Date(d.date).toLocaleDateString()).reverse();
    const weights = data.map(d => d.weight).reverse();
    const waists = data.map(d => d.waist).reverse();
    const bodyFats = data.map(d => d.body_fat).reverse();

    if (window.myChart) window.myChart.destroy();
    window.myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Weight (kg)', data: weights, borderColor: 'blue', fill: false },
          { label: 'Waist (cm)', data: waists, borderColor: 'green', fill: false },
          { label: 'Body Fat %', data: bodyFats, borderColor: 'red', fill: false },
        ]
      },
      options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        stacked: false,
        scales: {
          y: { beginAtZero: false }
        }
      }
    });
  }

  function renderCalendarHeatmap(data) {
    const heatmapDiv = container.querySelector('#calendar-heatmap');
    heatmapDiv.innerHTML = '';
    const datesLogged = new Set(data.map(d => d.date.slice(0, 10)));
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - 1);

    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dayStr = d.toISOString().slice(0, 10);
      const cell = document.createElement('div');
      cell.style.width = '20px';
      cell.style.height = '20px';
      cell.style.margin = '2px';
      cell.style.display = 'inline-block';
      cell.style.borderRadius = '4px';
      cell.title = dayStr;
      if (datesLogged.has(dayStr)) {
        cell.style.backgroundColor = '#4caf50';
      } else {
        cell.style.backgroundColor = '#eee';
      }
      heatmapDiv.appendChild(cell);
    }
  }

  function renderStreak(data) {
    const streakEl = container.querySelector('#streak-counter');
    if (data.length === 0) {
      streakEl.textContent = 'No data yet.';
      return;
    }
    const dates = data.map(d => new Date(d.date).toISOString().slice(0, 10)).sort();

    let streak = 1;
    for (let i = dates.length - 1; i > 0; i--) {
      const diff = (new Date(dates[i]) - new Date(dates[i - 1])) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }
    streakEl.textContent = `Current streak: ${streak} day${streak > 1 ? 's' : ''}`;
  }

  container.querySelector('#export-btn').onclick = async () => {
    const data = await fetchProgress();
    const csvRows = [
      ['Date', 'Weight', 'Waist', 'Body Fat %'],
      ...data.map(d => [
        new Date(d.date).toLocaleDateString(),
        d.weight,
        d.waist,
        d.body_fat.toFixed(2)
      ])
    ];
    const csvContent = csvRows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'abs_tracker_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  setupCoach(container.querySelector('#ai-coach-container'));

  await loadAndRender();
}
