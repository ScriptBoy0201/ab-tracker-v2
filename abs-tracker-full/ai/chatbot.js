function askAI() {
  const question = document.getElementById('userInput').value;
  const responseBox = document.getElementById('aiResponse');
  responseBox.innerHTML = "<em>Thinking...</em>";

  // Placeholder logic: fake response
  const keywords = {
    abs: "Try planks, leg raises, and hanging knee raises 3x per week.",
    diet: "Focus on high-protein, low-sugar meals and stay hydrated.",
    fat: "Consistent cardio and calorie deficit is key."
  };
  const found = Object.entries(keywords).find(([key]) => question.toLowerCase().includes(key));
  const answer = found ? keywords[found[0]] : "I'm still learning! Try rephrasing your question.";
  setTimeout(() => {
    responseBox.innerHTML = `<strong>ShredBot:</strong> ${answer}`;
  }, 800);
}