import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ImageIcon from '@mui/icons-material/Image';
import { Link, useLocation } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';
import { ROUTES } from '../constants/routes';
import { useMarketingPageTopPadding } from '../hooks/useDashboardLayoutPadding';
import { fetchShopProfile, generateAd } from '../lib/marketingApi';

export default function AdGeneratorPage() {
  const theme = useTheme();
  const location = useLocation();
  const { mode } = useThemeMode();
  const pagePt = useMarketingPageTopPadding();
  const [shopProfile, setShopProfile] = useState(null);
  const [useShopDetails, setUseShopDetails] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState(location.state?.successMessage ?? '');
  const [isLoadingShop, setIsLoadingShop] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAd, setGeneratedAd] = useState(null);
  const [generatedImage, setGeneratedImage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadShop() {
      try {
        const profile = await fetchShopProfile();
        if (!ignore) {
          setShopProfile(profile);
        }
      } catch (requestError) {
        if (!ignore) {
          setUseShopDetails(false);
          setInfo('No shop profile found yet. You can still generate an ad from a custom description, or add your shop details first.');
        }
      } finally {
        if (!ignore) {
          setIsLoadingShop(false);
        }
      }
    }

    loadShop();

    return () => {
      ignore = true;
    };
  }, []);

  const handleGenerate = async () => {
    setError('');
    setInfo('');
    setIsGenerating(true);

    try {
      const ad = await generateAd({
        prompt,
        useShopDetails,
      });
      setGeneratedAd(ad);
      setGeneratedImage(ad.imageDataUrl || '');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: pagePt,
        pb: 8,
        background:
          mode === 'dark'
            ? 'radial-gradient(circle at right top, rgba(249,115,22,0.16), transparent 34%), linear-gradient(180deg, #090B12 0%, #131C2A 100%)'
            : 'linear-gradient(180deg, #FFF7ED 0%, #F8FAFC 100%)',
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Box>
            <Chip
              icon={<AutoFixHighIcon sx={{ color: '#EA580C !important' }} />}
              label="Ad Generator"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: mode === 'dark' ? '#FED7AA' : '#9A3412',
                background: mode === 'dark' ? 'rgba(249,115,22,0.12)' : 'rgba(249,115,22,0.12)',
              }}
            />
            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', color: theme.palette.text.primary, mb: 1 }}>
              Build your next ad in one place
            </Typography>
            <Typography sx={{ maxWidth: 820, color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              Describe the ad you want, or switch to your stored shop details for faster generation. The right side shows copy output first and a real generated JPG ad underneath.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems="stretch">
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: { xs: 3, md: 4 },
                borderRadius: 5,
                border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.08)',
                background: mode === 'dark' ? 'rgba(9,11,18,0.8)' : 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(18px)',
              }}
            >
              <Stack spacing={2.5}>
                {info ? <Alert severity="info">{info}</Alert> : null}
                {error ? <Alert severity="error">{error}</Alert> : null}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={useShopDetails}
                        onChange={(event) => setUseShopDetails(event.target.checked)}
                        disabled={!shopProfile && isLoadingShop}
                      />
                    }
                    label="Create ad using my shop details"
                  />
                  <Button
                    component={Link}
                    to={ROUTES.marketing.adSetup}
                    startIcon={<StorefrontIcon />}
                    variant="outlined"
                    sx={{ borderRadius: 999, alignSelf: { xs: 'flex-start', sm: 'center' } }}
                  >
                    Edit shop details
                  </Button>
                </Stack>

                <TextField
                  fullWidth
                  multiline
                  minRows={9}
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  label="Describe the ad you want"
                  placeholder="Example: Create a bold Sinhala-English promo ad for my handmade jewelry shop with a Mother's Day offer and elegant gold visuals."
                />

                {shopProfile ? (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.2,
                      borderRadius: 4,
                      background: mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)',
                      border: mode === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(15,23,42,0.06)',
                    }}
                  >
                    <Stack spacing={0.8}>
                      <Typography sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
                        {shopProfile.shopName}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary }}>
                        {shopProfile.category} | {shopProfile.targetAudience}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary, lineHeight: 1.7 }}>
                        {shopProfile.description}
                      </Typography>
                    </Stack>
                  </Paper>
                ) : null}

                <Button
                  variant="contained"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  sx={{
                    alignSelf: 'flex-start',
                    borderRadius: 999,
                    px: 3,
                    py: 1.2,
                    background: 'linear-gradient(135deg, #F97316, #EA580C)',
                    boxShadow: '0 16px 30px rgba(249,115,22,0.28)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #FB923C, #F97316)',
                    },
                  }}
                >
                  {isGenerating ? 'Generating ad...' : 'Generate ad'}
                </Button>
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: { xs: 3, md: 4 },
                borderRadius: 5,
                border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.08)',
                background: mode === 'dark' ? 'rgba(9,11,18,0.8)' : 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(18px)',
              }}
            >
              <Stack spacing={2.5}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: theme.palette.text.primary }}>
                  Generated output
                </Typography>
                <Divider />

                {generatedAd ? (
                  <Stack spacing={2.5}>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <EditNoteIcon sx={{ color: '#F97316' }} />
                        <Typography sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
                          Text version
                        </Typography>
                      </Stack>
                      <Typography sx={{ fontWeight: 800, color: theme.palette.text.primary, mb: 1 }}>
                        {generatedAd.headline}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary, lineHeight: 1.8, mb: 1.5 }}>
                        {generatedAd.primaryText}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary }}>
                        <strong>CTA:</strong> {generatedAd.callToAction}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary, mt: 1 }}>
                        <strong>Visual direction:</strong> {generatedAd.visualDirection}
                      </Typography>
                      {generatedAd.imageSeed ? (
                        <Typography sx={{ color: theme.palette.text.secondary, mt: 1 }}>
                          <strong>Image seed:</strong> {generatedAd.imageSeed}
                        </Typography>
                      ) : null}
                    </Box>

                    <Divider />

                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                        <ImageIcon sx={{ color: '#2563EB' }} />
                        <Typography sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
                          JPG ad preview
                        </Typography>
                      </Stack>
                      {generatedImage ? (
                        <Box
                          component="img"
                          src={generatedImage}
                          alt="Generated ad preview"
                          sx={{
                            width: '100%',
                            borderRadius: 4,
                            border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.08)',
                            boxShadow: mode === 'dark'
                              ? '0 20px 40px rgba(0,0,0,0.4)'
                              : '0 18px 34px rgba(15,23,42,0.12)',
                          }}
                        />
                      ) : (
                        <Typography sx={{ color: theme.palette.text.secondary }}>
                          Your JPG-style ad preview will appear here after generation.
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                ) : (
                  <Typography sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
                    No ad generated yet. Use the panel on the left to describe the ad or switch on your stored shop details, then click Generate ad.
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
