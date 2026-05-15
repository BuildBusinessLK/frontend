import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Typography } from '@mui/material';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { ROUTES } from '../constants/routes';
import { useThemeMode } from '../contexts/ThemeContext';
import { alpha, getThemeColors, getThemeShadows, gradients, shadows } from '../theme';

export default function Marketing2HubPage() {
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const colors = getThemeColors(mode);
  const elev = getThemeShadows(mode);

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', pt: { xs: 1, md: 0 } }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          letterSpacing: '-0.03em',
          mb: 0.5,
          color: colors.text.primary,
        }}
      >
        SME website studio
      </Typography>
      <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 3 }}>
        One focused flow: your details → AI or instant template → live preview.
      </Typography>

      <Paper
        elevation={0}
        onClick={() => navigate(ROUTES.marketing2.studio)}
        sx={{
          cursor: 'pointer',
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: 4,
          border: `1px solid ${colors.border.secondary}`,
          background:
            mode === 'dark'
              ? `linear-gradient(135deg, ${alpha.amber['10']}, ${alpha.green['08']})`
              : `linear-gradient(135deg, rgba(255,107,53,0.08), rgba(34,197,94,0.06))`,
          boxShadow: mode === 'dark' ? elev.lg : elev.xl,
          transition: 'transform 0.18s ease, box-shadow 0.18s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: mode === 'dark' ? elev.xl : shadows.light.xl,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '18px',
              background: gradients.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: shadows.colored.amber,
            }}
          >
            <RocketLaunchRoundedIcon sx={{ color: '#fff', fontSize: 30 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', mb: 0.5 }}>
              Create your personalized website
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2 }}>
              Built for Coconut, Kithul, and Palmyrah SMEs — contact block, catalog, gallery, and inquiry form
              in a lightweight static page.
            </Typography>
            <Button
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(ROUTES.marketing2.studio);
              }}
              sx={{
                borderRadius: 999,
                px: 2.5,
                py: 1,
                fontWeight: 700,
                background: gradients.primary,
                boxShadow: shadows.colored.amber,
              }}
            >
              Open studio
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
