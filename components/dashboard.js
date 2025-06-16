export function setupDashboard(container) {
  container.innerHTML = `
    <section id="dashboard">
      <h2>Welcome to Abs Tracker Pro</h2>
      <p>Your AI-powered fitness assistant awaits...</p>
      <button id="logout-btn">Logout</button>
      <div id="content-area"></div>
    </section>
  `;

  const logoutBtn = container.querySelector('#logout-btn');
  logoutBtn.onclick = () => {
    location.reload();
  };
}
