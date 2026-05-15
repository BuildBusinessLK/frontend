export const MARKETING_BASE = '/dashboard/marketing';
export const MARKETING2_BASE = '/dashboard/marketing-2';

export const ROUTES = {
  dashboard: '/dashboard',
  dashboardAi: '/dashboard/ai-agent',
  dashboardAnalytics: '/dashboard/analytics',
  marketing: {
    root: MARKETING_BASE,
    website: `${MARKETING_BASE}/website`,
    websiteTemplates: `${MARKETING_BASE}/website/templates`,
    social: `${MARKETING_BASE}/social`,
    email: `${MARKETING_BASE}/email`,
    adSetup: `${MARKETING_BASE}/ad-generator/setup`,
    adGenerator: `${MARKETING_BASE}/ad-generator`,
  },
  marketing2: {
    root: MARKETING2_BASE,
    studio: `${MARKETING2_BASE}/studio`,
  },
  generatedWebsite: '/dashboard/generated-website',
};

/** Public hosted SME site: /business/:slug (e.g. http://localhost:3000/business/koko-lanka) */
export function hostedBusinessPath(slug) {
  return `/business/${encodeURIComponent(slug)}`;
}
