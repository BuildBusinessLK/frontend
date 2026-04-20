/**
 * Centralized color system for buildbusinesslk
 * Import and use these constants throughout the app for consistency
 */

// ============================================================================
// BRAND COLORS
// ============================================================================

export const brand = {
  orange: {
    primary: '#FF6B35',
    light: '#FF8C5E',
    dark: '#E85A24',
  },
  amber: {
    primary: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
  },
  green: {
    primary: '#22C55E',
    light: '#4ADE80',
    lighter: '#86EFAC',
    dark: '#16A34A',
    darker: '#15803D',
  },
  blue: {
    primary: '#38BDF8',
    light: '#7DD3FC',
    dark: '#0EA5E9',
  },
  purple: {
    primary: '#A78BFA',
    light: '#C4B5FD',
    dark: '#8B5CF6',
  },
};

// ============================================================================
// GRADIENTS
// ============================================================================

export const gradients = {
  primary: 'linear-gradient(135deg, #FF6B35, #F59E0B)',
  primaryAlt: 'linear-gradient(90deg, #FF6B35, #F59E0B)',
  green: 'linear-gradient(135deg, #22C55E, #16A34A)',
  greenLight: 'linear-gradient(90deg, #22C55E, #86EFAC)',
  greenAlt: 'linear-gradient(135deg, #4ADE80, #22C55E)',
  blue: 'linear-gradient(90deg, #38BDF8, #818CF8)',
  purple: 'linear-gradient(90deg, #A78BFA, #38BDF8)',
  warm: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
};

// ============================================================================
// THEME COLORS (Dark Mode)
// ============================================================================

export const dark = {
  background: {
    primary: '#060A0D',
    secondary: '#081410',
    tertiary: '#060D0A',
    paper: 'rgba(255,255,255,0.03)',
    hover: 'rgba(255,255,255,0.05)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255,255,255,0.7)',
    tertiary: 'rgba(255,255,255,0.5)',
    muted: 'rgba(255,255,255,0.4)',
    disabled: 'rgba(255,255,255,0.3)',
  },
  border: {
    primary: 'rgba(255,255,255,0.07)',
    secondary: 'rgba(255,255,255,0.06)',
    hover: 'rgba(255,255,255,0.15)',
  },
  overlay: {
    light: 'rgba(6,10,13,0.35)',
    medium: 'rgba(6,10,13,0.68)',
    heavy: 'rgba(6,10,13,0.86)',
  },
};

// ============================================================================
// THEME COLORS (Light Mode)
// ============================================================================

export const light = {
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
    paper: '#FFFFFF',
    hover: 'rgba(0,0,0,0.02)',
  },
  text: {
    primary: '#111827',
    secondary: 'rgba(17,24,39,0.8)',
    tertiary: 'rgba(17,24,39,0.7)',
    muted: 'rgba(17,24,39,0.6)',
    disabled: 'rgba(17,24,39,0.5)',
  },
  border: {
    primary: 'rgba(0,0,0,0.08)',
    secondary: 'rgba(0,0,0,0.06)',
    hover: 'rgba(0,0,0,0.12)',
  },
  overlay: {
    light: 'rgba(255,255,255,0.63)',
    medium: 'rgba(255,255,255,0.8)',
    heavy: 'rgba(255,255,255,0.95)',
  },
};

// ============================================================================
// ACCENT COLORS WITH OPACITY
// ============================================================================

export const alpha = {
  orange: {
    10: 'rgba(255,107,53,0.1)',
    15: 'rgba(255,107,53,0.15)',
    18: 'rgba(255,107,53,0.18)',
    25: 'rgba(255,107,53,0.25)',
    30: 'rgba(255,107,53,0.3)',
    35: 'rgba(255,107,53,0.35)',
    50: 'rgba(255,107,53,0.5)',
  },
  amber: {
    '04': 'rgba(245,158,11,0.04)',
    10: 'rgba(245,158,11,0.1)',
    15: 'rgba(245,158,11,0.15)',
    18: 'rgba(245,158,11,0.18)',
    25: 'rgba(245,158,11,0.25)',
    30: 'rgba(245,158,11,0.3)',
    40: 'rgba(245,158,11,0.4)',
    50: 'rgba(245,158,11,0.5)',
    60: 'rgba(245,158,11,0.6)',
  },
  green: {
    '04': 'rgba(34,197,94,0.04)',
    '05': 'rgba(34,197,94,0.05)',
    '06': 'rgba(34,197,94,0.06)',
    '07': 'rgba(34,197,94,0.07)',
    '08': 'rgba(34,197,94,0.08)',
    10: 'rgba(34,197,94,0.1)',
    15: 'rgba(34,197,94,0.15)',
    18: 'rgba(34,197,94,0.18)',
    25: 'rgba(34,197,94,0.25)',
    30: 'rgba(34,197,94,0.3)',
    35: 'rgba(34,197,94,0.35)',
    40: 'rgba(34,197,94,0.4)',
    50: 'rgba(34,197,94,0.5)',
    55: 'rgba(34,197,94,0.55)',
  },
  blue: {
    '04': 'rgba(56,189,248,0.04)',
    '08': 'rgba(56,189,248,0.08)',
    10: 'rgba(56,189,248,0.1)',
    15: 'rgba(56,189,248,0.15)',
    25: 'rgba(56,189,248,0.25)',
  },
  purple: {
    '04': 'rgba(167,139,250,0.04)',
    10: 'rgba(167,139,250,0.1)',
    15: 'rgba(167,139,250,0.15)',
    25: 'rgba(167,139,250,0.25)',
  },
  // Generic white and black for common UI elements
  white: {
    '04': 'rgba(255,255,255,0.04)',
    '07': 'rgba(255,255,255,0.07)',
    10: 'rgba(255,255,255,0.1)',
    20: 'rgba(255,255,255,0.2)',
    40: 'rgba(255,255,255,0.4)',
    50: 'rgba(255,255,255,0.5)',
    62: 'rgba(255,255,255,0.62)',
    80: 'rgba(255,255,255,0.8)',
    85: 'rgba(255,255,255,0.85)',
  },
  black: {
    '02': 'rgba(0,0,0,0.02)',
    '04': 'rgba(0,0,0,0.04)',
    '05': 'rgba(0,0,0,0.05)',
    '06': 'rgba(0,0,0,0.06)',
    '07': 'rgba(0,0,0,0.07)',
    12: 'rgba(0,0,0,0.12)',
    15: 'rgba(0,0,0,0.15)',
    20: 'rgba(0,0,0,0.2)',
    30: 'rgba(0,0,0,0.3)',
    40: 'rgba(0,0,0,0.4)',
    80: 'rgba(0,0,0,0.8)',
  },
  // Dark text color (specific to light mode text)
  gray: {
    65: 'rgba(17,24,39,0.65)',
    70: 'rgba(17,24,39,0.7)',
    75: 'rgba(17,24,39,0.75)',
    85: 'rgba(17,24,39,0.85)',
  },
};

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  light: {
    sm: '0 2px 8px rgba(0,0,0,0.04)',
    md: '0 4px 12px rgba(0,0,0,0.06)',
    lg: '0 8px 32px rgba(0,0,0,0.06)',
    xl: '0 24px 60px rgba(0,0,0,0.12)',
  },
  dark: {
    sm: '0 2px 8px rgba(0,0,0,0.2)',
    md: '0 4px 12px rgba(0,0,0,0.3)',
    lg: '0 8px 32px rgba(0,0,0,0.35)',
    xl: '0 24px 60px rgba(0,0,0,0.35)',
    text: {
      glow: '0 0 20px rgba(245,158,11,0.5)',
      subtle: '0 2px 8px rgba(0,0,0,0.2)',
    },
  },
  colored: {
    orange: '0 8px 32px rgba(255,107,53,0.4)',
    orangeHover: '0 12px 40px rgba(255,107,53,0.55)',
    amber: '0 8px 32px rgba(245,158,11,0.4)',
    amberHover: '0 12px 40px rgba(245,158,11,0.6)',
    green: '0 8px 32px rgba(34,197,94,0.4)',
    greenHover: '0 12px 40px rgba(34,197,94,0.55)',
    // Combined shadows (for complex effects)
    amberOrange: '0 8px 32px rgba(245,158,11,0.4), 0 0 60px rgba(255,107,53,0.3)',
    amberOrangeHover: '0 12px 40px rgba(245,158,11,0.6), 0 0 80px rgba(255,107,53,0.5)',
  },
};

// ============================================================================
// HELPER FUNCTION - Get theme colors based on mode
// ============================================================================

/**
 * Get colors object based on current theme mode
 * @param {string} mode - 'dark' or 'light'
 * @returns {object} - Theme colors object
 */
export const getThemeColors = (mode) => {
  return mode === 'dark' ? dark : light;
};

/**
 * Get shadows based on current theme mode
 * @param {string} mode - 'dark' or 'light'
 * @returns {object} - Shadow styles object
 */
export const getThemeShadows = (mode) => {
  return mode === 'dark' ? shadows.dark : shadows.light;
};
