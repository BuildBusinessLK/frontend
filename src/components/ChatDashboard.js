import React from 'react';
import { Box, Container, Typography, Grid, Stack, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { useThemeMode } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

export default function ChatDashboard() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <Box sx={{ py: 8, background: theme.palette.background.default }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 680 }}>
            {/* Main card */}
            <Box
              sx={{
                background:
                  mode === 'dark' ? 'rgba(6,10,13,0.75)' : 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(34,197,94,0.15)',
                borderRadius: '28px',
                p: 4,
                boxShadow:
                  mode === 'dark'
                    ? '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,197,94,0.08)'
                    : '0 40px 100px rgba(0,0,0,0.15), 0 0 0 1px rgba(34,197,94,0.08)',
              }}
            >
              {/* Window dots */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                {['#EF4444', '#F59E0B', '#22C55E'].map((c) => (
                  <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                ))}
                <Typography
                  sx={{
                    ml: 1.5,
                    color: mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                    fontSize: language === 'si' ? '0.68rem' : '0.72rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  {t.dashboard.title}
                </Typography>
              </Box>

              {/* Chat messages */}
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                      borderRadius: '16px 16px 4px 16px',
                      px: 2.5,
                      py: 1.5,
                      maxWidth: '78%',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: language === 'si' ? '0.9rem' : '0.95rem',
                        color: '#fff',
                        fontWeight: 500,
                      }}
                    >
                      {t.dashboard.userMessage}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #22C55E, #15803D)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: '#fff' }} />
                  </Box>
                  <Box
                    sx={{
                      background:
                        mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                      border:
                        mode === 'dark'
                          ? '1px solid rgba(34,197,94,0.12)'
                          : '1px solid rgba(34,197,94,0.15)',
                      borderRadius: '4px 16px 16px 16px',
                      px: 2.5,
                      py: 1.5,
                      maxWidth: '80%',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: language === 'si' ? '0.9rem' : '0.95rem',
                        color:
                          mode === 'dark'
                            ? 'rgba(255,255,255,0.82)'
                            : 'rgba(0,0,0,0.82)',
                        lineHeight: 1.7,
                      }}
                    >
                      {t.dashboard.aiResponse}
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              {/* Mini metric cards */}
              <Grid container spacing={2}>
                {[
                  {
                    icon: <TrendingUpIcon sx={{ fontSize: 20 }} />,
                    label: t.dashboard.metrics.revenue,
                    value: '+28%',
                    color: '#22C55E',
                  },
                  {
                    icon: <AutoGraphIcon sx={{ fontSize: 20 }} />,
                    label: t.dashboard.metrics.demand,
                    value: t.dashboard.metrics.demandValue,
                    color: '#F59E0B',
                  },
                  {
                    icon: <ChatBubbleOutlineIcon sx={{ fontSize: 20 }} />,
                    label: t.dashboard.metrics.insights,
                    value: t.dashboard.metrics.insightsValue,
                    color: '#38BDF8',
                  },
                ].map((m) => (
                  <Grid size={{ xs: 4 }} key={m.label}>
                    <Box
                      sx={{
                        background:
                          mode === 'dark'
                            ? 'rgba(255,255,255,0.04)'
                            : 'rgba(0,0,0,0.03)',
                        border:
                          mode === 'dark'
                            ? '1px solid rgba(255,255,255,0.07)'
                            : '1px solid rgba(0,0,0,0.07)',
                        borderRadius: '14px',
                        p: 2,
                        textAlign: 'center',
                      }}
                    >
                      <Box sx={{ color: m.color, mb: 0.5 }}>{m.icon}</Box>
                      <Typography
                        sx={{
                          fontSize: language === 'si' ? '0.7rem' : '0.75rem',
                          color:
                            mode === 'dark'
                              ? 'rgba(255,255,255,0.38)'
                              : 'rgba(0,0,0,0.38)',
                        }}
                      >
                        {m.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: language === 'si' ? '0.95rem' : '1rem',
                          fontWeight: 700,
                          color: m.color,
                          mt: 0.5,
                        }}
                      >
                        {m.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Floating badge — AI online */}
            <Box
              sx={{
                position: 'absolute',
                top: -18,
                right: -14,
                background: 'rgba(34,197,94,0.12)',
                border: '1px solid rgba(34,197,94,0.3)',
                backdropFilter: 'blur(16px)',
                borderRadius: '14px',
                px: 2.5,
                py: 1.2,
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#22C55E',
                  boxShadow: '0 0 8px #22C55E',
                }}
              />
              <Typography
                sx={{
                  fontSize: language === 'si' ? '0.75rem' : '0.8rem',
                  color: '#4ADE80',
                  fontWeight: 700,
                }}
              >
                {t.dashboard.badges.aiActive}
              </Typography>
            </Box>

            {/* Floating badge — data */}
            <Box
              sx={{
                position: 'absolute',
                bottom: -18,
                left: -14,
                background: mode === 'dark' ? 'rgba(6,10,13,0.8)' : 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(245,158,11,0.25)',
                backdropFilter: 'blur(16px)',
                borderRadius: '14px',
                px: 2.5,
                py: 1.2,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              <Typography
                sx={{
                  fontSize: language === 'si' ? '0.75rem' : '0.8rem',
                  color: '#FCD34D',
                  fontWeight: 700,
                }}
              >
                {t.dashboard.badges.industryData}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
