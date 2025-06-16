export async function askOpenAI(question) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_OPENAI_API_KEY',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful AI fitness coach.' },
        { role: 'user', content: question },
      ],
      max_tokens: 200,
      temperature: 0.7,
    }),
  });

  if (!response.ok) throw new Error('OpenAI API error');

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response';
}
