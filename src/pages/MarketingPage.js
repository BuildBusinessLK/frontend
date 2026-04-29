import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import ShareIcon from '@mui/icons-material/Share';
import EmailIcon from '@mui/icons-material/Email';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';

const marketingCards = [
  {
    id: 'website',
    title: 'Website',
    description: 'Create a clean landing page, product story, and contact flow that converts visitors.',
    icon: <LanguageIcon fontSize="inherit" />,
    accent: 'linear-gradient(135deg, #22C55E, #16A34A)',
    stats: ['Landing pages', 'Conversion copy', 'Lead capture'],
  },
  {
    id: 'social',
    title: 'Social Media',
    description: 'Plan content pillars, post ideas, and short-form visuals for consistent reach.',
    icon: <ShareIcon fontSize="inherit" />,
    accent: 'linear-gradient(135deg, #F59E0B, #F97316)',
    stats: ['Post calendar', 'Short video', 'Audience growth'],
  },
  {
    id: 'ads',
    title: 'Ad Generator',
    description: 'Write ad copy from a prompt or your saved shop details, then preview a polished campaign visual.',
    icon: <CampaignIcon fontSize="inherit" />,
    accent: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
    stats: ['Prompt mode', 'Shop details', 'JPG preview'],
  },
  {
    id: 'email',
    title: 'Email',
    description: 'Build welcome sequences, promotions, and follow-ups that keep customers engaged.',
    icon: <EmailIcon fontSize="inherit" />,
    accent: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
    stats: ['Welcome flows', 'Promotions', 'Retention'],
  },
];

export default function MarketingPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const [selectedCard, setSelectedCard] = useState(marketingCards[0].id);

  const activeCard = useMemo(
    () => marketingCards.find((card) => card.id === selectedCard) ?? marketingCards[0],
    [selectedCard]
  );

  const handleStart = () => {
    if (activeCard.id === 'ads') {
      navigate('/marketing/ad-generator/setup');
      return;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: { xs: 12, md: 14 },
        pb: 8,
        background:
          mode === 'dark'
            ? 'radial-gradient(circle at top, rgba(245,158,11,0.14), transparent 38%), linear-gradient(180deg, #060A0D 0%, #10151B 100%)'
            : 'linear-gradient(180deg, #FFF8EE 0%, #F7FAF8 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3.5}>
          <Box>
            <Chip
              label="Marketing"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: mode === 'dark' ? '#FDE68A' : '#92400E',
                background: mode === 'dark' ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.1)',
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Choose a marketing channel
            </Typography>
            <Typography sx={{ maxWidth: 720, color: theme.palette.text.secondary }}>
              Click a card to explore a focused starting point for your website, social media, or email marketing.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5}>
            {marketingCards.map((card) => {
              const isActive = card.id === selectedCard;
              return (
                <Card
                  key={card.id}
                  elevation={0}
                  sx={{
                    flex: 1,
                    borderRadius: 4,
                    border: isActive
                      ? '1px solid rgba(34,197,94,0.35)'
                      : mode === 'dark'
                        ? '1px solid rgba(255,255,255,0.08)'
                        : '1px solid rgba(0,0,0,0.08)',
                    background: isActive
                      ? mode === 'dark'
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(255,255,255,0.92)'
                      : mode === 'dark'
                        ? 'rgba(6,10,13,0.78)'
                        : 'rgba(255,255,255,0.84)',
                    backdropFilter: 'blur(18px)',
                    boxShadow: isActive
                      ? '0 30px 60px rgba(34,197,94,0.14)'
                      : mode === 'dark'
                        ? '0 18px 42px rgba(0,0,0,0.35)'
                        : '0 18px 42px rgba(15,23,42,0.08)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                    transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => setSelectedCard(card.id)}
                    sx={{ height: '100%', p: 0 }}
                  >
                    <CardContent sx={{ p: 3.5 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          color: '#FFFFFF',
                          background: card.accent,
                          boxShadow: '0 16px 30px rgba(0,0,0,0.18)',
                          fontSize: 26,
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: theme.palette.text.primary }}>
                        {card.title}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary, lineHeight: 1.7 }}>
                        {card.description}
                      </Typography>

                      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2.5 }}>
                        {card.stats.map((stat) => (
                          <Chip
                            key={stat}
                            label={stat}
                            size="small"
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                              background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                            }}
                          />
                        ))}
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              );
            })}
          </Stack>

          <Box
            sx={{
              borderRadius: 4,
              p: { xs: 3, md: 4 },
              border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              background: mode === 'dark' ? 'rgba(6,10,13,0.7)' : 'rgba(255,255,255,0.86)',
              backdropFilter: 'blur(18px)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 2,
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: '0.2em', color: theme.palette.text.secondary }}>
                Selected channel
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.text.primary, mb: 1 }}>
                {activeCard.title}
              </Typography>
              <Typography sx={{ maxWidth: 720, color: theme.palette.text.secondary, lineHeight: 1.8 }}>
                {activeCard.description} Use this track to plan copy, visuals, and follow-up steps with a clear focus.
              </Typography>
            </Box>

            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={handleStart}
              sx={{
                borderRadius: 999,
                px: 3,
                py: 1.2,
                background: activeCard.accent,
                boxShadow: '0 14px 30px rgba(0,0,0,0.18)',
                '&:hover': {
                  background: activeCard.accent,
                },
              }}
            >
              {activeCard.id === 'ads' ? 'Generate Ad' : `Start with ${activeCard.title}`}
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
