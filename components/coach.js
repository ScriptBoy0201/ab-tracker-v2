import { askOpenAI } from '../utils/api.js';

export function setupCoach(container) {
  container.innerHTML = `
    <h3>AI Coach</h3>
    <textarea id="coach-input" placeholder="Ask your AI coach fitness questions..." rows="4"></textarea>
    <button id="coach-ask-btn">Ask</button>
    <div id="coach-response"></div>
  `;

  const input = container.querySelector('#coach-input');
  const askBtn = container.querySelector('#coach-ask-btn');
  const responseDiv = container.querySelector('#coach-response');

  askBtn.onclick = async () => {
    const question = input.value.trim();
    if (!question) return;
    responseDiv.textContent = 'Thinking...';
    try {
      const answer = await askOpenAI(question);
      responseDiv.textContent = answer;
    } catch (err) {
      responseDiv.textContent = 'Error getting AI response.';
      console.error(err);
    }
  };
}
