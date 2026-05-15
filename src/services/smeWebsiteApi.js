import { authHeaders } from './authApi';

const SPRING_BASE =
  process.env.REACT_APP_SPRING_BACKEND_BASE_URL || 'http://localhost:8083';

/**
 * @param {Record<string, unknown>} payload SmeWebsiteGenerateRequest shape
 * @returns {Promise<{
 *   manifest: object,
 *   bundle: Record<string, string>,
 *   previewHtml: string,
 *   suggestedSubdomain: string,
 *   source: string,
 *   fallback: boolean,
 *   message?: string
 * }>}
 */
export async function generateSmeWebsite(payload) {
  const res = await fetch(`${SPRING_BASE}/api/sme-website/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `Generation failed (${res.status})`);
  }
  return data;
}

export function publicSmeSiteApiUrl(slug) {
  return `${SPRING_BASE}/api/public/sme-sites/${encodeURIComponent(slug)}`;
}

/**
 * @param {{
 *   slug: string,
 *   previewHtml: string,
 *   templateKey?: string,
 *   manifest?: object,
 *   businessName?: string
 * }} payload
 */
export async function publishSmeSite(payload) {
  const res = await fetch(`${SPRING_BASE}/api/sme-website/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `Publish failed (${res.status})`);
  }
  return data;
}

/**
 * @returns {Promise<{ slug: string, businessName: string, templateKey: string, html: string }>}
 */
export async function fetchPublicSmeSite(slug) {
  const res = await fetch(`${SPRING_BASE}/api/public/sme-sites/${encodeURIComponent(slug)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Not found (${res.status})`);
  }
  return data;
}
