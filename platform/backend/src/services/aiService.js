const Groq = require('groq-sdk');
const SYSTEM_PROMPT = require('../prompts/systemPrompt');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function chat(message, history = []) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map(h => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: h.text })),
    { role: 'user', content: message },
  ];

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages,
    temperature: 0.7,
    max_tokens: 1024,
  });

  return completion.choices[0].message.content;
}

module.exports = { chat };
