import { authHeaders } from './authApi';

const SPRING_BASE =
  process.env.REACT_APP_SPRING_BACKEND_BASE_URL || 'http://localhost:8083';

async function parseJsonError(res, fallbackMessage) {
  const data = await res.json().catch(() => ({}));
  return data.message || data.error || fallbackMessage;
}

export async function fetchChatSessions(token) {
  const res = await fetch(`${SPRING_BASE}/api/chat/sessions`, {
    headers: { ...authHeaders(token) },
  });
  if (!res.ok) throw new Error(await parseJsonError(res, 'Failed to load chat sessions'));
  return res.json();
}

export async function createChatSession(token, title) {
  const res = await fetch(`${SPRING_BASE}/api/chat/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(title ? { title } : {}),
  });
  if (!res.ok) throw new Error(await parseJsonError(res, 'Failed to create session'));
  return res.json();
}

export async function fetchChatMessages(token, sessionId) {
  const res = await fetch(`${SPRING_BASE}/api/chat/sessions/${sessionId}/messages`, {
    headers: { ...authHeaders(token) },
  });
  if (!res.ok) throw new Error(await parseJsonError(res, 'Failed to load messages'));
  return res.json();
}

export async function deleteChatSession(token, sessionId) {
  const res = await fetch(`${SPRING_BASE}/api/chat/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: { ...authHeaders(token) },
  });
  if (!res.ok) throw new Error(await parseJsonError(res, 'Failed to delete chat'));
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
