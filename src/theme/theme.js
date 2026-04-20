import { createTheme } from '@mui/material/styles';
import { brand, dark, light } from './colors';

/**
 * Create MUI theme with centralized colors
 * @param {string} mode - 'dark' or 'light'
 * @returns {object} - MUI theme object
 */
export const createAppTheme = (mode = 'dark') => {
  const colors = mode === 'dark' ? dark : light;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: brand.green.primary,
        light: brand.green.light,
        dark: brand.green.dark,
      },
      secondary: {
        main: brand.amber.primary,
        light: brand.amber.light,
        dark: brand.amber.dark,
      },
      success: {
        main: brand.green.primary,
        light: brand.green.light,
        dark: brand.green.dark,
      },
      info: {
        main: brand.blue.primary,
        light: brand.blue.light,
        dark: brand.blue.dark,
      },
      warning: {
        main: brand.amber.primary,
        light: brand.amber.light,
        dark: brand.amber.dark,
      },
      background: {
        default: colors.background.primary,
        paper: colors.background.paper,
      },
      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
      },
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h1: { fontWeight: 900, letterSpacing: '-0.03em' },
      h2: { fontWeight: 800, letterSpacing: '-0.025em' },
      h3: { fontWeight: 700, letterSpacing: '-0.015em' },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
    },
    shape: { borderRadius: 16 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 50,
            padding: '12px 28px',
            fontSize: '0.95rem',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: colors.background.paper,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${colors.border.primary}`,
          },
        },
      },
    },
  });
};

// Export default dark theme for backward compatibility
const theme = createAppTheme('dark');

export default theme;
