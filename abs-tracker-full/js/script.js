function calculate() {
  const weight = parseFloat(document.getElementById('weight').value);
  const waist = parseFloat(document.getElementById('waist').value);
  const height = parseFloat(document.getElementById('height').value);
  const date = new Date().toLocaleDateString();

  const bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - height * 0.22) + 0.15456 * Math.log10(height)) - 450;
  const bfRounded = bf.toFixed(1);
  document.getElementById('output').innerHTML = `<strong>Estimated Body Fat %:</strong> ${bfRounded}%`;

  const file = document.getElementById('photo').files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('imgPreview').innerHTML = `<img src="${e.target.result}" alt="Progress Photo" />`;
    };
    reader.readAsDataURL(file);
  }

  const entry = { date, weight, waist, bf: bfRounded };
  let history = JSON.parse(localStorage.getItem('progressHistory') || '[]');
  history.push(entry);
  localStorage.setItem('progressHistory', JSON.stringify(history));
  renderHistory();
  updateChart();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem('progressHistory') || '[]');
  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML = '';
  history.forEach(entry => {
    const row = `<tr><td>${entry.date}</td><td>${entry.weight}</td><td>${entry.waist}</td><td>${entry.bf}%</td></tr>`;
    tbody.innerHTML += row;
  });
}

function updateChart() {
  const history = JSON.parse(localStorage.getItem('progressHistory') || '[]');
  const labels = history.map(e => e.date);
  const data = history.map(e => parseFloat(e.bf));

  if (window.myChart) window.myChart.destroy();
  const ctx = document.getElementById('progressChart').getContext('2d');
  window.myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Body Fat %',
        data: data,
        borderColor: '#00d084',
        fill: false,
        tension: 0.2
      }]
    }
  });
}

document.getElementById('toggleTheme').onclick = () => {
  document.body.classList.toggle('light');
};

renderHistory();
updateChart();