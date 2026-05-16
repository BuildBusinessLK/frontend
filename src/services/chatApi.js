import { authHeaders } from './authApi';

const SPRING_BASE =
  process.env.REACT_APP_SPRING_BACKEND_BASE_URL || 'http://localhost:8083';

export async function fetchChatSessions(token) {
  const res = await fetch(`${SPRING_BASE}/api/chat/sessions`, {
    headers: { ...authHeaders(token) },
  });
  if (!res.ok) throw new Error('Failed to load chat sessions');
  return res.json();
}

export async function createChatSession(token, title) {
  const res = await fetch(`${SPRING_BASE}/api/chat/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(title ? { title } : {}),
  });
  if (!res.ok) throw new Error('Failed to create session');
  return res.json();
}

export async function fetchChatMessages(token, sessionId) {
  const res = await fetch(`${SPRING_BASE}/api/chat/sessions/${sessionId}/messages`, {
    headers: { ...authHeaders(token) },
  });
  if (!res.ok) throw new Error('Failed to load messages');
  return res.json();
}

export async function sendChatMessage(token, { sessionId, question }) {
  const res = await fetch(`${SPRING_BASE}/api/chat/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({ sessionId: sessionId ?? null, question }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || 'Chat failed');
  return data;
}
