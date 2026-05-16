const SPRING_BASE =
  process.env.REACT_APP_SPRING_BACKEND_BASE_URL || 'http://localhost:8083';

export async function fetchPublicBusiness(slug) {
  const res = await fetch(`${SPRING_BASE}/api/public/business/${encodeURIComponent(slug)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Not found');
  }
  return data;
}
