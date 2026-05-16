import React from 'react';
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
import { useThemeMode } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';
import { alpha, getThemeColors, gradients, shadows, brand } from '../theme';

const cards = [
  {
    title: 'AI assistant',
    body: 'Chat with industry-grounded RAG plus your business context.',
    to: ROUTES.dashboardAi,
    icon: <SmartToyRoundedIcon />,
    accent: gradients.green,
    shadow: shadows.colored.green,
  },
  {
    title: 'Marketing',
    body: 'Website generation, social, and email placeholders.',
    to: ROUTES.marketing.root,
    icon: <CampaignRoundedIcon />,
    accent: gradients.primary,
    shadow: shadows.colored.amber,
  },
  {
    title: 'Business profile',
    body: 'Products, social links, and sector for AI + public site.',
    to: ROUTES.businessProfile,
    icon: <PersonRoundedIcon />,
    accent: gradients.blue,
    shadow: shadows.light.md,
  },
];

export default function DashboardHomePage() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const { user } = useAuth();
  const colors = getThemeColors(mode);

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
