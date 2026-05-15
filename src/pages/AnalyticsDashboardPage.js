import React from 'react';
import {
  Box,
  Chip,
  Container,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import { useThemeMode } from '../contexts/ThemeContext';
import { alpha, brand, getThemeColors } from '../theme';

const placeholderMetrics = [
  { label: 'Engagement uplift (mock)', value: '+18%', progress: 62, tone: '#22C55E' },
  { label: 'Campaign completion', value: '72%', progress: 72, tone: '#F59E0B' },
  { label: '/ask conversation quality', value: 'Beta QA', progress: 40, tone: '#38BDF8' },
];

export default function AnalyticsDashboardPage() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const colors = getThemeColors(mode);

  return (
    <Container maxWidth="lg" disableGutters>
      <Stack spacing={3}>
        <Box>
          <Chip
            label="Signals"
            size="small"
            sx={{
              mb: 1.5,
              fontWeight: 700,
              color: '#FBBF24',
              background: alpha.amber[10],
            }}
          />
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <ShowChartRoundedIcon sx={{ color: brand.green.light, fontSize: 32 }} />
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.035em' }}>
              Analytics cockpit
            </Typography>
          </Stack>
          <Typography sx={{ color: theme.palette.text.secondary, maxWidth: 760, lineHeight: 1.75 }}>
            Real telemetry will arrive once SMEs feed performance data + marketing outcomes back into Phase 6 evaluation. Until then here is a calibrated placeholder surface that communicates intent to supervisors and testers.
          </Typography>
        </Box>

        <Stack spacing={2.25}>
          {placeholderMetrics.map((m) => (
            <Paper
              key={m.label}
              elevation={0}
              sx={{
                p: { xs: 2.25, md: 2.75 },
                borderRadius: 3,
                border: `1px solid ${colors.border.primary}`,
                background: mode === 'dark' ? alpha.white['04'] : colors.background.paper,
              }}
            >
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between">
                <Box>
                  <Typography variant="overline" sx={{ opacity: 0.55 }}>
                    TRACKING
                  </Typography>
                  <Typography sx={{ fontWeight: 750, mb: 0.5 }}>
                    {m.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: m.tone }}>
                    {m.value}
                  </Typography>
                </Box>
                <Box sx={{ flex: { md: 1 }, maxWidth: { md: 480 }, width: '100%' }}>
                  <LinearProgress
                    variant="determinate"
                    value={m.progress}
                    sx={{
                      height: 10,
                      borderRadius: 99,
                      backgroundColor: mode === 'dark' ? alpha.white['07'] : alpha.black['06'],
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 99,
                        background: m.tone,
                      },
                    }}
                  />
                </Box>
              </Stack>
            </Paper>
          ))}
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            border: `1px solid ${colors.border.primary}`,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            What plugs in later
          </Typography>
          <Divider sx={{ borderColor: colors.border.secondary, mb: 2 }} />
          <Stack component="ul" sx={{ m: 0, pl: 3, color: theme.palette.text.secondary, lineHeight: 1.8 }}>
            <li>Forecasting regressions from Coconut · Kithul · Palmyra datasets</li>
            <li>Feedback capture after each /ask dialogue for continual learning loops</li>
            <li>Marketing funnel metrics synced from social + email tooling</li>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
