import { authHeaders } from './authApi';

const SPRING_BASE =
  process.env.REACT_APP_SPRING_BACKEND_BASE_URL || 'http://localhost:8083';

const GENERATE_TIMEOUT_MS = 12000;

export async function generateWebsite(token, body) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GENERATE_TIMEOUT_MS);

  try {
    const res = await fetch(`${SPRING_BASE}/api/websites/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || 'Generation failed');
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Generation timed out. Please try again or check your backend service.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
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

export async function updateWebsite(token, websiteId, body) {
  const res = await fetch(`${SPRING_BASE}/api/websites/${websiteId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || 'Update failed');
  return data;
}
