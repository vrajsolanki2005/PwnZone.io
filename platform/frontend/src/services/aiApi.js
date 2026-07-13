const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Sends a message (and optional history) to the AI Mentor backend.
 * @param {string} message
 * @param {Array<{role: 'user'|'assistant', text: string}>} history
 * @returns {Promise<string>} the AI's reply text
 */
export async function sendChatMessage(message, history = []) {
  const res = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Something went wrong talking to AI Mentor.");
  }

  const data = await res.json();
  return data.response;
}
