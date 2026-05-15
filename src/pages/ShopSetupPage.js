import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';
import { ROUTES } from '../constants/routes';
import { useMarketingPageTopPadding } from '../hooks/useDashboardLayoutPadding';
import { fetchShopProfile, saveShopProfile } from '../lib/marketingApi';

const initialForm = {
  ownerName: '',
  shopName: '',
  category: '',
  description: '',
  targetAudience: '',
  products: '',
  location: '',
  website: '',
  brandTone: '',
};

export default function ShopSetupPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const pagePt = useMarketingPageTopPadding();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadShopProfile() {
      try {
        const profile = await fetchShopProfile();
        if (!ignore) {
          setForm({
            ownerName: profile.ownerName ?? '',
            shopName: profile.shopName ?? '',
            category: profile.category ?? '',
            description: profile.description ?? '',
            targetAudience: profile.targetAudience ?? '',
            products: profile.products ?? '',
            location: profile.location ?? '',
            website: profile.website ?? '',
            brandTone: profile.brandTone ?? '',
          });
        }
      } catch (requestError) {
        if (!ignore) {
          setStatus('No saved shop profile yet. Fill this in once and reuse it for faster ad generation.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadShopProfile();

    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setStatus('');

    try {
      await saveShopProfile(form);
      navigate(ROUTES.marketing.adGenerator, {
        state: {
          successMessage: 'Shop details saved. You can now generate ads using your shop information.',
        },
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
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
            ? 'radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 34%), linear-gradient(180deg, #071018 0%, #101722 100%)'
            : 'linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3.5}>
          <Box>
            <Chip
              icon={<StorefrontIcon sx={{ color: '#2563EB !important' }} />}
              label="Shop Setup"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: mode === 'dark' ? '#BFDBFE' : '#1D4ED8',
                background: mode === 'dark' ? 'rgba(59,130,246,0.12)' : 'rgba(37,99,235,0.1)',
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
              Connect your shop details
            </Typography>
            <Typography sx={{ maxWidth: 760, color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              Save the essentials about your business once, then reuse them whenever you want the ad generator to write copy and build visuals around your shop.
            </Typography>
          </Box>

          <Paper
            component="form"
            onSubmit={handleSubmit}
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 5,
              border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.08)',
              background: mode === 'dark' ? 'rgba(7,16,24,0.82)' : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(18px)',
              boxShadow: mode === 'dark'
                ? '0 28px 60px rgba(0,0,0,0.4)'
                : '0 24px 48px rgba(15,23,42,0.08)',
            }}
          >
            <Stack spacing={2.5}>
              {status ? <Alert severity="info">{status}</Alert> : null}
              {error ? <Alert severity="error">{error}</Alert> : null}

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField label="Owner name" fullWidth value={form.ownerName} onChange={handleChange('ownerName')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Shop name" fullWidth value={form.shopName} onChange={handleChange('shopName')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Business category" fullWidth value={form.category} onChange={handleChange('category')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Location" fullWidth value={form.location} onChange={handleChange('location')} placeholder="Colombo, online, islandwide, etc." />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Shop description"
                    fullWidth
                    multiline
                    minRows={3}
                    value={form.description}
                    onChange={handleChange('description')}
                    placeholder="Describe what makes your shop special."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Products or services"
                    fullWidth
                    multiline
                    minRows={2}
                    value={form.products}
                    onChange={handleChange('products')}
                    placeholder="List what you sell or promote."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Target audience"
                    fullWidth
                    value={form.targetAudience}
                    onChange={handleChange('targetAudience')}
                    placeholder="Who should this ad speak to?"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Website or social link" fullWidth value={form.website} onChange={handleChange('website')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Brand tone" fullWidth value={form.brandTone} onChange={handleChange('brandTone')} placeholder="Elegant, playful, bold, minimal..." />
                </Grid>
              </Grid>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between">
                <Typography sx={{ color: theme.palette.text.secondary, maxWidth: 580 }}>
                  {isLoading ? 'Loading saved details...' : 'You can update these details anytime before generating a new ad.'}
                </Typography>
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  disabled={isSubmitting}
                  sx={{
                    borderRadius: 999,
                    px: 3,
                    py: 1.2,
                    background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                    boxShadow: '0 16px 30px rgba(37,99,235,0.24)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                    },
                  }}
                >
                  {isSubmitting ? 'Saving...' : 'Save and continue'}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
