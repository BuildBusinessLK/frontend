import axios from 'axios';

const SPRING_BASE =
  process.env.REACT_APP_SPRING_BACKEND_BASE_URL || 'http://localhost:8083';

export const AUTH_SESSION_KEY = 'bb_auth_session';

export function notifyUnauthorized() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }
}

// Global Axios 401 interceptor
if (axios && axios.interceptors) {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Do not auto-logout on sign-in failure endpoint itself
        const url = String(error.config?.url || '');
        if (!url.includes('/api/auth/login') && !url.includes('/api/auth/register')) {
          notifyUnauthorized();
        }
      }
      return Promise.reject(error);
    }
  );
}

/** @typedef {{ token: string, user: Record<string, unknown> }} AuthSession */

/** @returns {AuthSession | null} */
export function readStoredSession() {
  try {
    const raw =
      localStorage.getItem(AUTH_SESSION_KEY) ||
      sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.token || !data?.user?.email) return null;
    return data;
  } catch {
    return null;
  }
}

export function writeStoredSession(session, rememberMe = true) {
  if (!session) {
    try {
      localStorage.removeItem(AUTH_SESSION_KEY);
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    } catch {
      /* ignore storage errors */
    }
    return;
  }

  try {
    const serialized = JSON.stringify(session);
    if (rememberMe) {
      localStorage.setItem(AUTH_SESSION_KEY, serialized);
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    } else {
      sessionStorage.setItem(AUTH_SESSION_KEY, serialized);
      localStorage.removeItem(AUTH_SESSION_KEY);
    }
  } catch (err) {
    console.error('Failed to write session storage:', err);
  }
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
 * @param {string} email
 * @returns {Promise<{ message: string, status: string }>}
 */
export async function apiForgotPassword(email) {
  const res = await fetch(`${SPRING_BASE}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim() }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || 'Failed to send reset link.');
  }
  return data;
}

/**
 * @param {string} credential Google ID Token
 * @returns {Promise<AuthSession>}
 */
export async function apiGoogleLogin(credential) {
  const res = await fetch(`${SPRING_BASE}/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Google sign-in failed.');
  }
  return { token: data.token, user: data.user };
}

/**
 * @param {string} email
 * @param {string} otp
 * @returns {Promise<{ message: string, status: string }>}
 */
export async function apiVerifyOtp(email, otp) {
  const res = await fetch(`${SPRING_BASE}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Verification failed. Please check your code.');
  }
  return data;
}

/**
 * @param {string} email
 * @returns {Promise<{ message: string, status: string }>}
 */
export async function apiResendOtp(email) {
  const res = await fetch(`${SPRING_BASE}/api/auth/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim() }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to resend verification code.');
  }
  return data;
}

/**
 * @param {string} token
 */
export async function apiFetchMe(token) {
  const res = await fetch(`${SPRING_BASE}/api/auth/me`, {
    headers: { ...authHeaders(token) },
  });
  if (res.status === 401) {
    notifyUnauthorized();
  }
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
  const res = await fetch(`${SPRING_BASE}/api/users/me/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(patch),
  });
  if (res.status === 401) {
    notifyUnauthorized();
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || 'Could not save profile');
  }
  return data;
}
