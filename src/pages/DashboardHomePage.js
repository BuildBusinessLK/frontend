import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import { useThemeMode } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';
import { alpha, getThemeColors, gradients, shadows, brand } from '../theme';
import { fetchBusinesses, fetchBusinessAnalytics } from '../services/businessApi';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const cards = [
  {
    title: 'AI assistant',
    body: 'Chat with our industry-grounded AI. Get advice on coconut, kithul, and palmyrah businesses tailored to your profile.',
    to: ROUTES.dashboardAi,
    icon: <SmartToyRoundedIcon />,
    accent: gradients.green,
    shadow: shadows.colored.green,
  },
  {
    title: 'Marketing',
    body: 'Generate your business website with AI, social media content, and email campaigns.',
    to: ROUTES.marketing.root,
    icon: <CampaignRoundedIcon />,
    accent: gradients.primary,
    shadow: shadows.colored.amber,
  },
  {
    title: 'Business profile',
    body: 'Manage your business details, product catalogue, and social links. AI uses this data to personalise responses.',
    to: ROUTES.businessProfile,
    icon: <PersonRoundedIcon />,
    accent: gradients.blue,
    shadow: shadows.light.md,
  },
];

export default function DashboardHomePage() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const { user, token } = useAuth();
  const colors = getThemeColors(mode);

  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noBusiness, setNoBusiness] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const businesses = await fetchBusinesses(token);
        if (!active) return;
        if (!businesses.length) {
          setNoBusiness(true);
          setLoading(false);
          return;
        }
        const b = businesses[0];
        const data = await fetchBusinessAnalytics(token, b.id);
        if (active) {
          setAnalyticsData(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load analytics', err);
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [token]);

  useEffect(() => {
    if (loading || noBusiness || !analyticsData.length || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    const labels = analyticsData.map(d => {
      try {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      } catch {
        return d.date;
      }
    });
    
    const whatsappData = analyticsData.map(d => d.whatsappClicks);
    const directionsData = analyticsData.map(d => d.directionsClicks);

    const isDark = mode === 'dark';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'WhatsApp Clicks',
            data: whatsappData,
            backgroundColor: '#10b981',
            borderRadius: 4,
            barPercentage: 0.8,
            categoryPercentage: 0.7,
          },
          {
            label: 'Directions Clicks',
            data: directionsData,
            backgroundColor: '#3b82f6',
            borderRadius: 4,
            barPercentage: 0.8,
            categoryPercentage: 0.7,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: textColor,
              font: {
                family: 'inherit',
                weight: '600',
                size: 12
              },
              boxWidth: 12,
              boxHeight: 12,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            padding: 12,
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            titleColor: isDark ? '#fff' : '#0f172a',
            bodyColor: isDark ? '#94a3b8' : '#475569',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            borderWidth: 1,
            titleFont: {
              family: 'inherit',
              weight: 'bold',
              size: 13
            },
            bodyFont: {
              family: 'inherit',
              size: 12
            },
            callbacks: {
              label: function(context) {
                return ` ${context.dataset.label}: ${context.raw}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: textColor,
              font: {
                family: 'inherit',
                size: 10
              },
              maxRotation: 45,
              minRotation: 0,
              autoSkip: true,
              maxTicksLimit: 10
            }
          },
          y: {
            grid: {
              color: gridColor
            },
            ticks: {
              color: textColor,
              font: {
                family: 'inherit',
                size: 11
              },
              precision: 0
            },
            beginAtZero: true
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [analyticsData, loading, noBusiness, mode]);

  return (
    <Container maxWidth="lg" disableGutters>
      <Stack spacing={3}>
        <Box>
          <Chip
            label="Workspace"
            size="small"
            sx={{
              mb: 1.5,
              fontWeight: 700,
              color: brand.green.light,
              background: alpha.green[10],
              border: `1px solid ${alpha.green[25]}`,
            }}
          />
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 1 }}>
            {user?.fullName || user?.name ? `Hi ${user.fullName || user.name}, momentum looks good.` : 'Welcome aboard.'}
          </Typography>
          <Typography sx={{ maxWidth: 720, color: theme.palette.text.secondary, lineHeight: 1.7 }}>
            This shell mirrors what you pitched: interactive AI counselling, modular marketing workflows, website creation, then continuous tracking layered on Coconut · Kithul · Palmyra domains.
          </Typography>
        </Box>

        <Grid container spacing={2.25}>
          {cards.map((c) => (
            <Grid key={c.title} size={{ xs: 12, sm: 4 }}>
              <Paper
                component={RouterLink}
                to={c.to}
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'block',
                  textDecoration: 'none',
                  p: 2.75,
                  borderRadius: 3,
                  border: `1px solid ${colors.border.primary}`,
                  background: mode === 'dark' ? alpha.white['04'] : colors.background.paper,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  color: theme.palette.text.primary,
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow:
                      mode === 'dark'
                        ? '0 24px 50px rgba(0,0,0,0.45)'
                        : '0 20px 50px rgba(15,118,110,0.12)',
                  },
                }}
              >
                <Stack spacing={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: c.accent,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: c.shadow,
                    }}
                  >
                    {c.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                    {c.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, flex: 1, lineHeight: 1.7 }}>
                    {c.body}
                  </Typography>
                  <Button
                    component="span"
                    endIcon={<ArrowForwardRoundedIcon />}
                    sx={{
                      alignSelf: 'flex-start',
                      px: 0,
                      fontWeight: 700,
                      color: brand.green.light,
                      '& .MuiButton-endIcon': { transition: 'transform 0.2s' },
                      '&:hover .MuiButton-endIcon': { transform: 'translateX(5px)' },
                    }}
                  >
                    Open module
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
 
        <Paper
          elevation={0}
          sx={{
            p: 3.5,
            borderRadius: 3,
            border: `1px solid ${colors.border.primary}`,
            background: mode === 'dark' ? alpha.white['04'] : colors.background.paper,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: gradients.green,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: shadows.colored.green,
              }}
            >
              <BarChartRoundedIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                Performance Metrics
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Customer interactions on your website over the last 30 days
              </Typography>
            </Box>
          </Stack>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280 }}>
              <Typography sx={{ color: 'text.secondary' }}>Loading analytics...</Typography>
            </Box>
          ) : noBusiness ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
              <Typography sx={{ color: 'text.secondary' }}>Create a business profile to view performance analytics.</Typography>
            </Box>
          ) : (
            <Box sx={{ height: 320, width: '100%', position: 'relative' }}>
              <canvas ref={chartRef} />
            </Box>
          )}
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            border: `1px dashed ${alpha.amber[30]}`,
            background: mode === 'dark' ? alpha.amber['04'] : alpha.amber[10],
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
            Pilot playbook
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2, lineHeight: 1.7 }}>
            Weeks 26–28 call for usability tests with SMEs; keep marketing tasks inside this workspace until Netlify/deploy flows reopen for production demos.
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to={ROUTES.dashboardAi}
            sx={{
              borderRadius: 50,
              background: gradients.primary,
              boxShadow: shadows.colored.amber,
              '&:hover': {
                background: gradients.warm,
                boxShadow: shadows.colored.amberHover,
              },
            }}
          >
            Jump into AI agent
          </Button>
        </Paper>
      </Stack>
    </Container>
  );
}
