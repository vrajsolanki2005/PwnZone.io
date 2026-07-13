const { chat } = require('../services/aiService');

const chatHandler = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message is required.' });

    const response = await chat(message.trim(), history);
    res.json({ response });
  } catch (err) {
    console.error('[AI]', err.message);
    res.status(500).json({ error: 'AI service unavailable. Please try again.' });
  }
};

module.exports = { chatHandler };
