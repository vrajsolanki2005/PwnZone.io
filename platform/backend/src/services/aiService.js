const { GoogleGenerativeAI } = require('@google/generative-ai');
const SYSTEM_PROMPT = require('../prompts/systemPrompt');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function chat(message, history = []) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  // Convert history to Gemini format
  const geminiHistory = history.map(h => ({
    role: h.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: h.text }],
  }));

  const chatSession = model.startChat({ history: geminiHistory });
  const result = await chatSession.sendMessage(message);
  return result.response.text();
}

module.exports = { chat };
