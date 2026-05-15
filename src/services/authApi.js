const SPRING_BASE =
  process.env.REACT_APP_SPRING_BACKEND_BASE_URL || 'http://localhost:8083';

export const AUTH_SESSION_KEY = 'bb_auth_session';

/** @typedef {{ token: string, user: Record<string, unknown> }} AuthSession */

/** @returns {AuthSession | null} */
export function readStoredSession() {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.token || !data?.user?.email) return null;
    return data;
  } catch {
    return null;
  }
}

export function writeStoredSession(session) {
  if (!session) {
    localStorage.removeItem(AUTH_SESSION_KEY);
    return;
  }
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function getStoredToken() {
  return readStoredSession()?.token ?? null;
}

export function authHeaders(token) {
  const t = token ?? getStoredToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

/**
 * @param {{ fullName: string, email: string, password: string }} body
 * @returns {Promise<AuthSession>}
 */
export async function apiRegister(body) {
  const res = await fetch(`${SPRING_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Registration failed (${res.status})`);
  }
  return { token: data.token, user: data.user };
}

/**
 * @param {{ email: string, password: string }} body
 * @returns {Promise<AuthSession>}
 */
export async function apiLogin(body) {
  const res = await fetch(`${SPRING_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Sign in failed (${res.status})`);
  }
  return { token: data.token, user: data.user };
}

/**
 * @param {string} token
 */
export async function apiFetchMe(token) {
  const res = await fetch(`${SPRING_BASE}/api/users/me`, {
    headers: { ...authHeaders(token) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Could not load profile');
  }
  return data;
}

/**
 * @param {string} token
 * @param {Record<string, string | undefined>} patch
 */
export async function apiPatchProfile(token, patch) {
  const res = await fetch(`${SPRING_BASE}/api/users/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(patch),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Could not save profile');
  }
  return data;
}
