import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';

const websiteFeatures = [
  {
    title: 'Landing Pages',
    description: 'Create compelling landing pages that capture visitor attention and drive conversions.',
  },
  {
    title: 'Conversion Copy',
    description: 'Generate persuasive copy tailored to your audience that converts visitors into customers.',
  },
  {
    title: 'Lead Capture',
    description: 'Build effective lead capture forms and follow-up sequences to nurture your prospects.',
  },
];

export default function WebsiteMarketingPage() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const navigate = useNavigate();

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
        <Stack spacing={4}>
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/marketing')}
              sx={{
                mb: 2,
                color: theme.palette.text.secondary,
                '&:hover': {
                  background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                },
              }}
            >
              Back to Marketing
            </Button>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Website Marketing
            </Typography>
            <Typography sx={{ maxWidth: 720, color: theme.palette.text.secondary, fontSize: '1.1rem' }}>
              Create a clean landing page, product story, and contact flow that converts visitors into customers. 
              AI-powered insights and copy generation to maximize your online presence.
            </Typography>
          </Box>

          <Stack spacing={2.5}>
            {websiteFeatures.map((feature, index) => (
              <Card
                key={index}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: mode === 'dark' ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(34,197,94,0.15)',
                  background:
                    mode === 'dark'
                      ? 'rgba(34,197,94,0.05)'
                      : 'rgba(34,197,94,0.03)',
                  backdropFilter: 'blur(18px)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: mode === 'dark' ? 'rgba(34,197,94,0.4)' : 'rgba(34,197,94,0.25)',
                    boxShadow: '0 20px 40px rgba(34,197,94,0.1)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <CheckCircleOutlineIcon
                      sx={{
                        color: '#22C55E',
                        fontSize: 28,
                        flexShrink: 0,
                        mt: 0.5,
                      }}
                    />
                    <Stack>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 800,
                          color: theme.palette.text.primary,
                          mb: 0.5,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary, lineHeight: 1.7 }}>
                        {feature.description}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>

          <Box
            sx={{
              borderRadius: 4,
              p: { xs: 3, md: 4 },
              border: mode === 'dark' ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(34,197,94,0.15)',
              background:
                mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.05))'
                  : 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.03))',
              backdropFilter: 'blur(18px)',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: theme.palette.text.primary,
                mb: 2,
              }}
            >
              Ready to create your website?
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, mb: 3, maxWidth: 600, mx: 'auto' }}>
              Let our AI assistant generate landing pages, conversion copy, and lead capture flows tailored to your business.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/marketing/website/templates')}
              sx={{
                borderRadius: 999,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                boxShadow: '0 14px 30px rgba(34,197,94,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #16A34A, #15803D)',
                },
              }}
            >
              Start Creating
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
