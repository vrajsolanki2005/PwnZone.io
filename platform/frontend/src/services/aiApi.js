import api from './api';

export async function sendChatMessage(message, history = []) {
  const res = await api.post('/ai/chat', { message, history });
  return res.data.response;
}
