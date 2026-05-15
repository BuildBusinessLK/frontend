export const MARKETING_BASE = '/dashboard/marketing';

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
  generatedWebsite: '/dashboard/generated-website',
};
