import { authHeaders } from './authApi';

const SPRING_BASE =
  process.env.REACT_APP_SPRING_BACKEND_BASE_URL || 'http://localhost:8083';

export async function generateWebsite(token, body) {
  const res = await fetch(`${SPRING_BASE}/api/websites/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || 'Generation failed');
  return data;
}

export async function publishWebsite(token, websiteId) {
  const res = await fetch(`${SPRING_BASE}/api/websites/${websiteId}/publish`, {
    method: 'POST',
    headers: { ...authHeaders(token) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || 'Publish failed');
  return data;
}

export async function fetchLatestWebsite(token, businessId) {
  const res = await fetch(`${SPRING_BASE}/api/websites/business/${businessId}/latest`, {
    headers: { ...authHeaders(token) },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to load website');
  return res.json();
}
