export const MARKETING_BASE = '/dashboard/marketing';

export const ROUTES = {
  dashboard: '/dashboard',
  dashboardAi: '/dashboard/ai-assistant',
  businessProfile: '/dashboard/business-profile',
  marketing: {
    root: MARKETING_BASE,
    website: `${MARKETING_BASE}/website`,
    social: `${MARKETING_BASE}/social`,
    email: `${MARKETING_BASE}/email`,
  },
  settings: '/dashboard/settings',
  admin: '/dashboard/admin',
};

export function hostedBusinessPath(slug) {
  return `/business/${encodeURIComponent(slug)}`;
}
