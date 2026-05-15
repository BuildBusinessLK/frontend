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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `Generation failed (${res.status})`);
  }
  return data;
}
