import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../contexts/AuthContext';
import { useMarketingPageTopPadding } from '../hooks/useDashboardLayoutPadding';
import { fetchBusinesses } from '../services/businessApi';
import { fetchLatestWebsite, generateWebsite, publishWebsite } from '../services/websiteApi';

const websiteFeatures = [
  {
    title: 'High-Converting Landing Pages',
    description: 'Design clean, attractive landing pages that highlight the uniqueness of your palm products. Capture attention instantly and turn visitors into buyers with a layout built for trust and engagement.',
  },
  {
    title: 'Persuasive Conversion Copy',
    description: 'Use AI-powered content to craft compelling product descriptions and marketing messages tailored to your target audience. Showcase the natural quality, heritage, and value of your coconut, kithul, and palmyra products to boost sales.',
  },
  {
    title: 'Lead Capture & Customer Growth',
    description: 'Create effective contact forms and lead capture systems to collect customer inquiries and orders. Build lasting relationships with follow-up messages and grow your customer base both locally and internationally.',
  },
  {
    title: 'Expand Beyond Borders',
    description: 'Take your palm-based business to the global market. Reach international customers, promote your products online, and scale your business with a modern, conversion-focused website.',
  },
];

export default function WebsiteMarketingPage() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const { token } = useAuth();
  const navigate = useNavigate();
  const pagePt = useMarketingPageTopPadding();
  const [businessId, setBusinessId] = useState(null);
  const [slug, setSlug] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#15803d');
  const [secondaryColor, setSecondaryColor] = useState('#ca8a04');
  const [logoUrl, setLogoUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const list = await fetchBusinesses(token);
        if (c || !list.length) return;
        const b = list[0];
        setBusinessId(b.id);
        setSlug(b.websiteSlug || '');
        const w = await fetchLatestWebsite(token, b.id);
        if (!c && w) {
          setWebsite(w);
          setPrimaryColor(w.primaryColor || '#15803d');
          setSecondaryColor(w.secondaryColor || '#ca8a04');
          setLogoUrl(w.logoUrl || '');
          setCoverImageUrl(w.coverImageUrl || '');
          setContactEmail(w.contactEmail || '');
          setPhone(w.phone || '');
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      c = true;
    };
  }, [token]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: pagePt,
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
              onClick={() => navigate(ROUTES.marketing.root)}
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
              Build a powerful online presence for your palm-based products—whether it’s coconut, kithul, or palmyra—and connect with customers locally and globally. Create a professional website that tells your story, showcases your products, and drives real business growth.
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
              Use one template for now: AI fills hero, about, and marketing copy from your business profile. Publish opens the
              Next.js public site at <strong>/business/{slug || 'your-slug'}</strong>.
            </Typography>
            {!businessId && (
              <Typography color="error" sx={{ mb: 2 }}>
                Create your business profile first.
              </Typography>
            )}
            <Stack spacing={2} sx={{ maxWidth: 480, mx: 'auto', textAlign: 'left', mb: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <TextField label="Primary color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} fullWidth size="small" />
                <TextField label="Secondary color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} fullWidth size="small" />
              </Stack>
              <TextField label="Logo URL" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} fullWidth size="small" />
              <TextField label="Cover image URL" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} fullWidth size="small" />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <TextField label="Contact email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} fullWidth size="small" />
                <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth size="small" />
              </Stack>
            </Stack>
            {msg && (
              <Typography variant="body2" sx={{ mb: 2, color: 'success.main' }}>
                {msg}
              </Typography>
            )}
            {website?.publishedUrl && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                Published:{' '}
                <a href={website.publishedUrl} target="_blank" rel="noreferrer">
                  {website.publishedUrl}
                </a>
              </Typography>
            )}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
              <Button
                variant="contained"
                size="large"
                disabled={!businessId || busy}
                onClick={async () => {
                  setMsg('');
                  setBusy(true);
                  try {
                    const w = await generateWebsite(token, {
                      businessId,
                      templateId: 'modern-business-v1',
                      primaryColor,
                      secondaryColor,
                      logoUrl: logoUrl || undefined,
                      coverImageUrl: coverImageUrl || undefined,
                      contactEmail: contactEmail || undefined,
                      phone: phone || undefined,
                    });
                    setWebsite(w);
                    setMsg('Draft generated. Preview on the template site after publish.');
                  } catch (e) {
                    // eslint-disable-next-line no-alert
                    window.alert(e.message || 'Failed');
                  } finally {
                    setBusy(false);
                  }
                }}
                sx={{
                  borderRadius: 999,
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                  boxShadow: '0 14px 30px rgba(34,197,94,0.3)',
                }}
              >
                {busy ? 'Working…' : 'Generate website'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                disabled={!website?.id || busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    const w = await publishWebsite(token, website.id);
                    setWebsite(w);
                    setMsg('Published.');
                  } catch (e) {
                    // eslint-disable-next-line no-alert
                    window.alert(e.message || 'Publish failed');
                  } finally {
                    setBusy(false);
                  }
                }}
                sx={{ borderRadius: 999, px: 4, py: 1.5 }}
              >
                Publish
              </Button>
              <Button size="large" onClick={() => navigate(ROUTES.marketing.root)} sx={{ borderRadius: 999 }}>
                Back
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
