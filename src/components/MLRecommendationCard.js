import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Stack,
  Divider,
  Grid,
  useTheme,
  Button,
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';

export default function MLRecommendationCard({
  recommendation,
  onActionClick,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!recommendation) return null;

  const {
    modelVersion = 'product-recommender-v1',
    recommendedBusiness,
    recommendations = [],
    feasibility = { capitalFit: 85, yieldFit: 80, staffingFit: 85 },
    guidance,
    actions = [],
  } = recommendation;

  const topMatch = recommendations[0] || {
    product: recommendedBusiness || 'Value-Added Production',
    confidence: 90.0,
  };
  const alternatives = recommendations.slice(1);

  const getActionIcon = (actionText) => {
    const lower = actionText.toLowerCase();
    if (lower.includes('machinery') || lower.includes('equipment')) {
      return <BuildRoundedIcon fontSize="small" />;
    }
    if (lower.includes('plan')) {
      return <DescriptionRoundedIcon fontSize="small" />;
    }
    if (lower.includes('margin') || lower.includes('profit')) {
      return <TrendingUpRoundedIcon fontSize="small" />;
    }
    if (lower.includes('export')) {
      return <LocalShippingRoundedIcon fontSize="small" />;
    }
    return <AutoAwesomeRoundedIcon fontSize="small" />;
  };

  return (
    <Card
      elevation={0}
      sx={{
        mt: 1.5,
        mb: 1.5,
        maxWidth: 620,
        borderRadius: 3,
        border: '1px solid',
        borderColor: isDark ? 'rgba(34,197,94,0.3)' : 'rgba(34,197,94,0.35)',
        background: isDark
          ? 'linear-gradient(145deg, rgba(18,24,38,0.95), rgba(15,23,42,0.9))'
          : 'linear-gradient(145deg, #f8fdf9, #ffffff)',
        boxShadow: isDark
          ? '0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(34,197,94,0.1)'
          : '0 8px 24px rgba(34,197,94,0.08), 0 2px 6px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}
    >
      {/* Top Banner */}
      <Box
        sx={{
          px: 2.5,
          py: 1.25,
          background: isDark
            ? 'linear-gradient(90deg, rgba(34,197,94,0.2), rgba(16,185,129,0.05))'
            : 'linear-gradient(90deg, rgba(34,197,94,0.12), rgba(16,185,129,0.04))',
          borderBottom: '1px solid',
          borderColor: isDark ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <AutoAwesomeRoundedIcon sx={{ color: '#22C55E', fontSize: 19 }} />
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: isDark ? '#4ade80' : '#15803d',
              letterSpacing: 0.3,
            }}
          >
            ✨ AI-Matched Products for Your Business
          </Typography>
        </Stack>
        <Chip
          label={modelVersion}
          size="small"
          sx={{
            height: 20,
            fontSize: '0.68rem',
            fontWeight: 600,
            bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
            color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
          }}
        />
      </Box>

      <CardContent sx={{ p: 2.5 }}>
        {/* Primary Match */}
        <Box sx={{ mb: 2.5 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="baseline"
            sx={{ mb: 0.75 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: isDark ? '#ffffff' : '#0f172a',
                fontSize: '1.25rem',
              }}
            >
              {topMatch.product}
            </Typography>
            <Chip
              label={`${Math.round(topMatch.confidence)}% Match`}
              sx={{
                fontWeight: 800,
                fontSize: '0.82rem',
                bgcolor: isDark ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.15)',
                color: isDark ? '#4ade80' : '#15803d',
                border: '1px solid',
                borderColor: '#22C55E',
              }}
            />
          </Stack>

          <LinearProgress
            variant="determinate"
            value={Math.min(100, Math.max(10, topMatch.confidence))}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(90deg, #22C55E, #10B981)',
              },
            }}
          />
        </Box>

        {/* Feasibility Breakdown */}
        <Box
          sx={{
            p: 1.75,
            mb: 2.5,
            borderRadius: 2.5,
            bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
              display: 'block',
              mb: 0.5,
            }}
          >
            Business Feasibility Fit
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mb: 1.25,
              color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)',
            }}
          >
            How well your budget, raw material, and team match this product's requirements.
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Stack spacing={0.5}>
                <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                  Capital Fit
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {feasibility.capitalFit}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={feasibility.capitalFit}
                  sx={{
                    height: 5,
                    borderRadius: 3,
                    bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                    '& .MuiLinearProgress-bar': { bgcolor: '#3b82f6' },
                  }}
                />
              </Stack>
            </Grid>

            <Grid item xs={4}>
              <Stack spacing={0.5}>
                <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                  Yield Fit
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {feasibility.yieldFit}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={feasibility.yieldFit}
                  sx={{
                    height: 5,
                    borderRadius: 3,
                    bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                    '& .MuiLinearProgress-bar': { bgcolor: '#10b981' },
                  }}
                />
              </Stack>
            </Grid>

            <Grid item xs={4}>
              <Stack spacing={0.5}>
                <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                  Staffing Fit
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {feasibility.staffingFit}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={feasibility.staffingFit}
                  sx={{
                    height: 5,
                    borderRadius: 3,
                    bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                    '& .MuiLinearProgress-bar': { bgcolor: '#8b5cf6' },
                  }}
                />
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Alternative Product Options */}
        {alternatives.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                display: 'block',
                mb: 0.25,
              }}
            >
              Other Good Options
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mb: 1,
                color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)',
              }}
            >
              Other viable products ranked by how well they fit your profile.
            </Typography>

            <Stack spacing={1}>
              {alternatives.map((alt) => (
                <Stack
                  key={alt.product}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    p: 1,
                    px: 1.5,
                    borderRadius: 2,
                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    #{alt.rank} {alt.product}
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: 140 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, Math.max(5, alt.confidence))}
                      sx={{
                        flex: 1,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: isDark ? '#64748b' : '#94a3b8',
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: isDark ? '#94a3b8' : '#64748b',
                        width: 32,
                        textAlign: 'right',
                      }}
                    >
                      {Math.round(alt.confidence)}%
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}

        {/* Quick Action Chips */}
        {actions.length > 0 && onActionClick && (
          <Box sx={{ mt: 2.5 }}>
            <Divider sx={{ mb: 1.75, opacity: 0.4 }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                display: 'block',
                mb: 1,
              }}
            >
              Suggested Next Steps:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {actions.map((act) => (
                <Chip
                  key={act}
                  label={act}
                  size="small"
                  clickable
                  icon={getActionIcon(act)}
                  onClick={() => onActionClick(act)}
                  sx={{
                    borderRadius: 999,
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    py: 1.8,
                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                    '&:hover': {
                      bgcolor: isDark ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.1)',
                      borderColor: '#22C55E',
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
