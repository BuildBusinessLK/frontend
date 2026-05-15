import React from 'react';
import { Box, Container, Typography, Grid, Stack, Chip } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CampaignIcon from '@mui/icons-material/Campaign';
import InsightsIcon from '@mui/icons-material/Insights';
import RouteIcon from '@mui/icons-material/Route';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useThemeMode } from '../contexts/ThemeContext';
import { brand, alpha, gradients, getThemeColors } from '../theme';

const features = [
  {
    icon: <SmartToyIcon sx={{ fontSize: 30 }} />,
    title: 'AI Business Chat',
    description: 'Talk to your personal business advisor anytime. Describe your coconut, kithul, or palmyra business and receive data-backed recommendations on pricing, growth, and strategy.',
    color: brand.green.primary,
    gradient: `linear-gradient(135deg, ${alpha.green[15]}, ${alpha.green['04']})`,
    border: alpha.green[25],
    bullets: ['Natural language Q&A', 'Industry-specific advice', 'Pricing & demand guidance'],
    badge: 'Core Feature',
  },
  {
    icon: <CampaignIcon sx={{ fontSize: 30 }} />,
    title: 'Automated Marketing',
    description: 'Launch social media campaigns in minutes. AI writes your product promotions, picks optimal posting times, and generates materials for Facebook, Instagram, and WhatsApp.',
    color: brand.amber.primary,
    gradient: `linear-gradient(135deg, ${alpha.amber[15]}, ${alpha.amber['04']})`,
    border: alpha.amber[25],
    bullets: ['AI ad copywriting', 'Auto-scheduled posting', 'WhatsApp broadcast tools'],
    badge: 'Save Time',
  },
  {
    icon: <InsightsIcon sx={{ fontSize: 30 }} />,
    title: 'Real Business Insights',
    description: 'Powered by data from CDA, PDB, EDB, and DCS. See real market demand, production trends, pricing benchmarks, and identify new revenue opportunities in your sector.',
    color: brand.blue.primary,
    gradient: `linear-gradient(135deg, ${alpha.blue[15]}, ${alpha.blue['04']})`,
    border: alpha.blue[25],
    bullets: ['Government data sources', 'Market demand forecasting', 'Competitor benchmarking'],
    badge: 'Data-Driven',
  },
  {
    icon: <RouteIcon sx={{ fontSize: 30 }} />,
    title: 'Continuous Guidance',
    description: 'Never feel stuck. Your AI creates a personalized growth roadmap with weekly action steps, tracks your progress, and adapts its advice based on your business performance.',
    color: brand.purple.primary,
    gradient: `linear-gradient(135deg, ${alpha.purple[15]}, ${alpha.purple['04']})`,
    border: alpha.purple[25],
    bullets: ['Weekly action plans', 'Business health score', 'Performance-based learning'],
    badge: 'Always Learning',
  },
];

export default function Features() {
  const { mode } = useThemeMode();
  const colors = getThemeColors(mode);
  
  return (
    <Box
      id="features"
      sx={{
      py: { xs: 10, md: 14 }, 
      background: mode === 'dark' 
        ? `linear-gradient(180deg, ${colors.background.primary} 0%, ${colors.background.secondary} 50%, ${colors.background.primary} 100%)` 
        : `linear-gradient(180deg, ${colors.background.primary} 0%, ${colors.background.secondary} 50%, ${colors.background.primary} 100%)`, 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      <Box sx={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: '70%', 
        height: '50%', 
        background: mode === 'dark'
          ? `radial-gradient(ellipse, ${alpha.green['05']} 0%, transparent 70%)`
          : `radial-gradient(ellipse, ${alpha.orange['08']} 0%, transparent 70%)`, 
        pointerEvents: 'none' 
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 7, md: 9 } }}>
          <Chip 
            label="Platform Features" 
            sx={{ 
              background: mode === 'dark' ? alpha.green[10] : alpha.orange[10], 
              border: mode === 'dark' ? `1px solid ${alpha.green[25]}` : `1px solid ${alpha.orange[25]}`, 
              color: mode === 'dark' ? brand.green.light : brand.orange.primary, 
              fontWeight: 600, 
              fontSize: '0.75rem', 
              mb: 2.5 
            }} 
          />
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, color: colors.text.primary, mb: 2 }}>
            Four Pillars of{' '}
            <Box component="span" sx={{ background: gradients.primaryAlt, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Business Growth
            </Box>
          </Typography>
          <Typography variant="body1" sx={{ color: mode === 'dark' ? colors.text.tertiary : alpha.gray[75], maxWidth: 500, mx: 'auto', lineHeight: 1.75, fontSize: '1.05rem' }}>
            Designed specifically for Sri Lanka's Coconut, Kithul palm, and Palmyra palm entrepreneurs — combining AI intelligence with real local industry data.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((f, i) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={f.title}>
              <Box
                sx={{ 
                  background: mode === 'dark' ? f.gradient : `${f.color}08`, 
                  border: mode === 'dark' ? `1px solid ${f.border}` : `1px solid ${f.color}20`, 
                  borderRadius: '24px', 
                  p: 3.5, 
                  height: '100%', 
                  position: 'relative', 
                  transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)', 
                  backdropFilter: 'blur(20px)', 
                  cursor: 'default',
                  '&:hover': { 
                    transform: 'translateY(-8px)', 
                    boxShadow: mode === 'dark'
                      ? `0 30px 70px ${alpha.black[40]}, 0 0 0 1px ${f.color}55`
                      : `0 30px 70px ${alpha.black[15]}, 0 0 0 1px ${f.color}55`, 
                    borderColor: f.color 
                  } 
                }}
              >
                <Chip label={f.badge} size="small" sx={{ position: 'absolute', top: 20, right: 20, background: `${f.color}18`, border: `1px solid ${f.color}44`, color: f.color, fontWeight: 700, fontSize: '0.66rem', height: 22 }} />

                <Box sx={{ width: 62, height: 62, borderRadius: '18px', background: `${f.color}18`, border: `1.5px solid ${f.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5, color: f.color, boxShadow: `0 0 24px ${f.color}18` }}>
                  {f.icon}
                </Box>

                <Typography variant="h6" sx={{ color: colors.text.primary, mb: 1.2, fontWeight: 700, fontSize: '1.05rem' }}>{f.title}</Typography>
                <Typography variant="body2" sx={{ color: mode === 'dark' ? colors.text.tertiary : alpha.gray[65], lineHeight: 1.75, mb: 2.5, fontSize: '0.88rem' }}>{f.description}</Typography>

                <Stack spacing={1} sx={{ mb: 2.5 }}>
                  {f.bullets.map((b) => (
                    <Box key={b} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 15, color: f.color, flexShrink: 0 }} />
                      <Typography variant="caption" sx={{ color: mode === 'dark' ? alpha.white[62] : alpha.gray[70], fontSize: '0.82rem' }}>{b}</Typography>
                    </Box>
                  ))}
                </Stack>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: f.color, cursor: 'pointer' }}>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>Learn more</Typography>
                  <ArrowForwardIcon sx={{ fontSize: 14 }} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
