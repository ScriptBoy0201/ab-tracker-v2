import { showToast } from '../utils/toast.js';

const OPENAI_API_KEY = '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'; // replace with your key

export function setupCoach(container) {
  container.innerHTML = `
    <h3>Your AI Coach</h3>
    <textarea id="coach-prompt" rows="4" placeholder="Ask your AI coach anything about abs, body fat, diet, or training..."></textarea>
    <button id="coach-submit">Ask Coach</button>
    <pre id="coach-response"></pre>
  `;

  const promptInput = container.querySelector('#coach-prompt');
  const submitBtn = container.querySelector('#coach-submit');
  const responsePre = container.querySelector('#coach-response');

  submitBtn.onclick = async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      showToast('Please enter a question.', 'error');
      return;
    }
    submitBtn.disabled = true;
    responsePre.textContent = 'Thinking...';

    try {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 200,
          temperature: 0.7,
        }),
      });
      if (!resp.ok) throw new Error('OpenAI request failed');
      const data = await resp.json();
      const answer = data.choices?.[0]?.message?.content || 'No answer';
      responsePre.textContent = answer;
    } catch (e) {
      responsePre.textContent = 'Error fetching AI response.';
    } finally {
      submitBtn.disabled = false;
    }
  };
}
