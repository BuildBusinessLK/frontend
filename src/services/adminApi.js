import { authHeaders } from './authApi';

const SPRING_BASE =
  process.env.REACT_APP_SPRING_BACKEND_BASE_URL || 'http://localhost:8083';

export async function fetchAdminStats(token) {
  const res = await fetch(`${SPRING_BASE}/api/admin/stats`, { headers: { ...authHeaders(token) } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || 'Admin access denied');
  return data;
}
