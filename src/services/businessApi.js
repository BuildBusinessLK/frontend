import { authHeaders } from './authApi';

const SPRING_BASE =
  process.env.REACT_APP_SPRING_BACKEND_BASE_URL || 'http://localhost:8083';

export async function fetchBusinesses(token) {
  const res = await fetch(`${SPRING_BASE}/api/businesses`, { headers: { ...authHeaders(token) } });
  if (!res.ok) throw new Error('Failed to load businesses');
  return res.json();
}

export async function createBusiness(token, body) {
  const res = await fetch(`${SPRING_BASE}/api/businesses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || 'Save failed');
  return data;
}

export async function updateBusiness(token, id, body) {
  const res = await fetch(`${SPRING_BASE}/api/businesses/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || 'Update failed');
  return data;
}

export async function fetchBusinessAnalytics(token, id) {
  const res = await fetch(`${SPRING_BASE}/api/businesses/${id}/analytics`, {
    headers: { ...authHeaders(token) },
  });
  if (!res.ok) throw new Error('Failed to load business analytics');
  return res.json();
}
