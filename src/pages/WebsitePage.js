import React from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
} from '@mui/material';
import { useThemeMode } from '../contexts/ThemeContext';

export default function WebsitePage() {
  const theme = useTheme();
  const { mode } = useThemeMode();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: { xs: 12, md: 14 },
        pb: 8,
        background:
          mode === 'dark'
            ? 'radial-gradient(circle at top, rgba(34,197,94,0.14), transparent 38%), linear-gradient(180deg, #060A0D 0%, #10151B 100%)'
            : 'linear-gradient(180deg, #F0FDF4 0%, #F7FAF8 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: theme.palette.text.primary,
              mb: 2,
            }}
          >
            Website Builder
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.8,
            }}
          >
            Create a clean landing page, product story, and contact flow that converts visitors.
            Add your website generation code here.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
