import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Popover,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PublishIcon from '@mui/icons-material/Publish';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PaletteIcon from '@mui/icons-material/Palette';
import LinkIcon from '@mui/icons-material/Link';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';
import { useMarketingPageTopPadding } from '../hooks/useDashboardLayoutPadding';
import { fetchBusinesses } from '../services/businessApi';
import { fetchLatestWebsite, generateWebsite, publishWebsite } from '../services/websiteApi';

// ─── Status badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    PUBLISHED: { label: 'Published', color: 'success' },
    DRAFT: { label: 'Draft', color: 'warning' },
  };
  const cfg = map[status] || { label: status, color: 'default' };
  return <Chip label={cfg.label} color={cfg.color} size="small" sx={{ fontWeight: 700 }} />;
}

// ─── Colour swatch preview ────────────────────────────────────────────────────

const PRESET_COLORS = [
  '#0f766e',
  '#f59e0b',
  '#2563eb',
  '#16a34a',
  '#ca8a04',
  '#e11d48',
  '#7c3aed',
  '#f97316',
  '#facc15',
  '#f43f5e',
  '#1e293b',
  '#111827',
  '#22c55e',
  '#0ea5e9',
  '#6366f1',
  '#ec4899',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#14b8a6',
  '#64748b',
  '#334155',
  '#f97316',
  '#10b981',
  '#38bdf8',
  '#a855f7',
  '#fb7185',
  '#fdba74',
  '#f87171',
  '#60a5fa',
  '#22d3ee',
  '#4ade80',
  '#f472b6',
  '#fbbf24',
  '#f8b4d9',
  '#94a3b8',
];

function ColorInput({ label, value, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700 }}>
          {label}
        </Typography>
        <Button
          variant="outlined"
          onClick={handleOpen}
          sx={{
            textTransform: 'none',
            borderRadius: 3,
            minWidth: 170,
            justifyContent: 'space-between',
            px: 2,
            py: 1,
          }}
        >
          <Box
            sx={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: value || '#000',
              border: '1px solid rgba(0,0,0,0.12)',
              flexShrink: 0,
            }}
          />
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {value || 'Select colour'}
          </Typography>
        </Button>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { p: 1.5, minWidth: 260, borderRadius: 3 } }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 1.25 }}>
          {PRESET_COLORS.map((preset) => {
            const selected = preset.toLowerCase() === (value || '').toLowerCase();
            return (
              <Tooltip key={preset} title={preset} arrow>
                <Box
                  component="button"
                  type="button"
                  onClick={() => {
                    onChange({ target: { value: preset } });
                    handleClose();
                  }}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    border: selected ? '2px solid' : '2px solid transparent',
                    borderColor: selected ? 'primary.main' : 'transparent',
                    background: preset,
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, border-color 0.15s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
              </Tooltip>
            );
          })}
        </Box>
      </Popover>
    </>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ icon, children }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1.5 }}>
      {icon}
      <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.72rem', color: 'text.secondary' }}>
        {children}
      </Typography>
    </Stack>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function WebsiteMarketingPage() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const { token } = useAuth();
  const navigate = useNavigate();
  const pagePt = useMarketingPageTopPadding();

  // Business
  const [business, setBusiness] = useState(null);
  const [loadingBiz, setLoadingBiz] = useState(true);

  // Website record
  const [website, setWebsite] = useState(null);
  const [loadingWebsite, setLoadingWebsite] = useState(false);

  // Customisation form
  const [primaryColor, setPrimaryColor] = useState('#0f766e');
  const [secondaryColor, setSecondaryColor] = useState('#f59e0b');
  const [logoUrl, setLogoUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [intentMessage, setIntentMessage] = useState('');

  // Actions
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // ── Load business + latest website on mount ──────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingBiz(true);
      try {
        const list = await fetchBusinesses(token);
        if (cancelled || !list.length) return;
        const b = list[0];
        setBusiness(b);
        setIntentMessage(b.intentMessage || '');
        setLoadingWebsite(true);
        try {
          const w = await fetchLatestWebsite(token, b.id);
          if (!cancelled && w) {
            setWebsite(w);
            // Pre-fill form from saved website settings
            setPrimaryColor(w.primaryColor || '#0f766e');
            setSecondaryColor(w.secondaryColor || '#f59e0b');
            setLogoUrl(w.logoUrl || '');
            setCoverImageUrl(w.coverImageUrl || '');
            setContactEmail(w.contactEmail || '');
            setPhone(w.phone || '');
          }
        } finally {
          if (!cancelled) setLoadingWebsite(false);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not load your business data.');
      } finally {
        if (!cancelled) setLoadingBiz(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  // ── Generate ────────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!business) return;
    setError('');
    setGenerating(true);
    try {
      const w = await generateWebsite(token, {
        businessId: business.id,
        templateId: 'modern-business-v1',
        primaryColor: primaryColor || undefined,
        secondaryColor: secondaryColor || undefined,
        logoUrl: logoUrl || undefined,
        coverImageUrl: coverImageUrl || undefined,
        contactEmail: contactEmail || undefined,
        phone: phone || undefined,
        intentMessage: intentMessage || undefined,
      });
      setWebsite(w);
    } catch (e) {
      setError(e.message || 'Generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // ── Publish ─────────────────────────────────────────────────────────────────
  const handlePublish = async () => {
    if (!website?.id) return;
    setError('');
    setPublishing(true);
    try {
      const w = await publishWebsite(token, website.id);
      setWebsite(w);
    } catch (e) {
      setError(e.message || 'Publish failed. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  // ── Copy URL ────────────────────────────────────────────────────────────────
  const handleCopy = () => {
    if (!website?.publishedUrl) return;
    const copy = navigator.clipboard?.writeText
      ? navigator.clipboard.writeText(website.publishedUrl)
      : Promise.reject(new Error('Clipboard unavailable'));
    copy.then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => setError('Could not copy the URL. Please select and copy it manually.'));
  };

  // ─────────────────────────────────────────────────────────────────────────────

  const card = {
    elevation: 0,
    sx: {
      borderRadius: 4,
      border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.07)',
      background: mode === 'dark' ? 'rgba(6,10,13,0.72)' : '#fff',
      backdropFilter: 'blur(20px)',
    },
  };

  // ── No business guard ────────────────────────────────────────────────────────
  if (loadingBiz) {
    return (
      <Box sx={{ pt: pagePt, pb: 8 }}>
        <Container maxWidth="lg">
          <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2, mb: 2 }} />
          <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 3 }} />
        </Container>
      </Box>
    );
  }

  if (!business) {
    return (
      <Box sx={{ pt: pagePt, pb: 8 }}>
        <Container maxWidth="md">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(ROUTES.marketing.root)} sx={{ mb: 3 }}>
            Back to Marketing
          </Button>
          <Alert
            severity="warning"
            action={
              <Button size="small" variant="contained" onClick={() => navigate(ROUTES.businessProfile)}>
                Create profile
              </Button>
            }
          >
            You need to create a business profile before generating a website.
          </Alert>
        </Container>
      </Box>
    );
  }

  const isPublished = website?.status === 'PUBLISHED';
  const hasDraft = !!website;
  const hasProducts = (business.products || []).length > 0;
  const hasSocialLinks = (business.socialLinks || []).length > 0;
  const hasContact = Boolean(phone || contactEmail);
  const publicPath = `/business/${business.websiteSlug || 'your-slug'}`;
  const growthItems = [
    { label: 'Business profile', ready: Boolean(business.businessName && business.sector) },
    { label: 'Contact details', ready: hasContact },
    { label: 'Products or services', ready: hasProducts },
    { label: 'Social links', ready: hasSocialLinks },
  ];
  const readyCount = growthItems.filter((item) => item.ready).length;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: pagePt,
        pb: 8,
        background: mode === 'dark'
          ? 'linear-gradient(180deg,#07110f 0%,#111827 100%)'
          : 'linear-gradient(180deg,#F8FAFC 0%,#EEF8F5 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3.5}>

          {/* ── Page header ─────────────────────────────────────────────────── */}
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(ROUTES.marketing.root)}
              sx={{ mb: 2, color: 'text.secondary' }}
            >
              Back to Marketing
            </Button>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'flex-end' }} justifyContent="space-between" spacing={1}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mb: 0.5 }}>
                  Website Builder
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Start simple, then add products, socials, hours, and maps later.
                  </Typography>
                  {website && <StatusBadge status={website.status} />}
                </Stack>
              </Box>
              {business.websiteSlug && (
                <Chip
                  icon={<LinkIcon sx={{ fontSize: '0.85rem !important' }} />}
                  label={publicPath}
                  size="small"
                  sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.78rem' }}
                />
              )}
            </Stack>
          </Box>

          {/* ── Error banner ─────────────────────────────────────────────────── */}
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>

            {/* ── LEFT: Customisation form ───────────────────────────────────── */}
            <Grid item xs={12} md={5}>
              <Card {...card}>
                <CardContent sx={{ p: 3.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                    Customise
                  </Typography>

                  {/* Branding */}
                  <SectionLabel icon={<PaletteIcon sx={{ fontSize: 15, color: 'text.secondary' }} />}>
                    Brand Colours
                  </SectionLabel>
                  <Stack spacing={1.5} sx={{ mb: 3 }}>
                    <ColorInput
                      label="Primary colour"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                    />
                    <ColorInput
                      label="Secondary / accent colour"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                    />
                  </Stack>

                  <Divider sx={{ mb: 3 }} />

                  {/* Logo & cover */}
                  <SectionLabel icon={<LinkIcon sx={{ fontSize: 15, color: 'text.secondary' }} />}>
                    Optional media
                  </SectionLabel>
                  <Stack spacing={1.5} sx={{ mb: 3 }}>
                    <TextField
                      fullWidth size="small"
                      label="Logo image URL"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      helperText="Leave empty to use an initials mark."
                    />
                    <TextField
                      fullWidth size="small"
                      label="Cover / hero image URL"
                      value={coverImageUrl}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      placeholder="https://example.com/cover.jpg"
                      helperText="Leave empty to use the template's branded visual style."
                    />
                  </Stack>

                  <Divider sx={{ mb: 3 }} />

                  {/* Contact */}
                  <SectionLabel icon={<InfoOutlinedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />}>
                    Contact Details
                  </SectionLabel>
                  <Stack spacing={1.5} sx={{ mb: 3 }}>
                    <TextField
                      fullWidth size="small"
                      label="Contact email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="info@yourbusiness.lk"
                      type="email"
                    />
                    <TextField
                      fullWidth size="small"
                      label="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94 77 123 4567"
                    />
                    <TextField
                      fullWidth size="small"
                      label="Custom WhatsApp Message"
                      value={intentMessage}
                      onChange={(e) => setIntentMessage(e.target.value)}
                      placeholder="I am interested in buying..."
                      helperText="Default message sent when customers click WhatsApp button."
                    />
                  </Stack>

                  {/* AI note */}
                  <Alert severity="info" sx={{ borderRadius: 2, fontSize: '0.82rem', mb: 3 }}>
                    The template works with only your basic profile. Extra sections appear automatically when you add products, social links, hours, and map details later.
                  </Alert>

                  {/* Generate button */}
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={generating ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />}
                    disabled={generating || publishing}
                    onClick={handleGenerate}
                    sx={{
                      borderRadius: 3,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      background: `linear-gradient(135deg,${primaryColor || '#0f766e'},#0f766e)`,
                      boxShadow: '0 10px 24px rgba(15,118,110,0.24)',
                      '&:hover': { background: `linear-gradient(135deg,#0f766e,${primaryColor || '#0f766e'})` },
                    }}
                  >
                    {generating ? 'Generating…' : hasDraft ? 'Regenerate Website' : 'Generate Website'}
                  </Button>

                  {hasDraft && (
                    <Button
                      fullWidth
                      variant="text"
                      size="small"
                      startIcon={<RefreshIcon />}
                      disabled={generating}
                      onClick={handleGenerate}
                      sx={{ mt: 1, borderRadius: 2, color: 'text.secondary' }}
                    >
                      Re-generate with new settings
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* ── RIGHT: Preview + publish ───────────────────────────────────── */}
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>

                {/* Generated content preview */}
                <Card {...card}>
                  <CardContent sx={{ p: 3.5 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        AI-generated content
                      </Typography>
                      {loadingWebsite && <CircularProgress size={18} />}
                    </Stack>

                    {!hasDraft && !loadingWebsite ? (
                      <Box
                        sx={{
                          textAlign: 'center',
                          py: 6,
                          opacity: 0.45,
                          border: '2px dashed',
                          borderColor: 'divider',
                          borderRadius: 3,
                        }}
                      >
                        <AutoAwesomeIcon sx={{ fontSize: 48, mb: 1.5 }} />
                        <Typography variant="body2">
                          Fill in your customisation and click Generate to create your website.
                        </Typography>
                      </Box>
                    ) : loadingWebsite ? (
                      <Stack spacing={2}>
                        <Skeleton variant="text" width="60%" height={28} />
                        <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
                      </Stack>
                    ) : (
                      <Stack spacing={2}>
                        {/* Hero text */}
                        <Box>
                          <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.12em' }}>
                            Hero
                          </Typography>
                          <Box
                            sx={{
                              mt: 0.5,
                              p: 2,
                              borderRadius: 2,
                              background: primaryColor + '18',
                              borderLeft: `3px solid ${primaryColor || '#22C55E'}`,
                            }}
                          >
                            <Typography variant="body2" sx={{ fontStyle: 'italic', lineHeight: 1.7 }}>
                              {website?.heroText || '—'}
                            </Typography>
                          </Box>
                        </Box>

                        {/* About */}
                        <Box>
                          <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.12em' }}>
                            About
                          </Typography>
                          <Box
                            sx={{
                              mt: 0.5,
                              p: 2,
                              borderRadius: 2,
                              background: mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                            }}
                          >
                            <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                              {website?.aboutText || '—'}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Marketing */}
                        <Box>
                          <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.12em' }}>
                            Marketing / Why us
                          </Typography>
                          <Box
                            sx={{
                              mt: 0.5,
                              p: 2,
                              borderRadius: 2,
                              background: secondaryColor + '12',
                              borderLeft: `3px solid ${secondaryColor || '#f59e0b'}`,
                            }}
                          >
                            <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                              {website?.marketingText || '—'}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    )}
                  </CardContent>
                </Card>

                <Card {...card}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ sm: 'center' }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
                          Site readiness
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {readyCount} of {growthItems.length} content areas ready. Missing items stay hidden on the public site.
                        </Typography>
                      </Box>
                      <Chip
                        label={readyCount <= 2 ? 'Starter site' : readyCount === 3 ? 'Growing site' : 'Rich site'}
                        color={readyCount <= 2 ? 'default' : 'success'}
                        sx={{ fontWeight: 800, alignSelf: { xs: 'flex-start', sm: 'center' } }}
                      />
                    </Stack>
                    <Grid container spacing={1.25} sx={{ mt: 2 }}>
                      {growthItems.map((item) => (
                        <Grid item xs={12} sm={6} key={item.label}>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{
                              p: 1.25,
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: item.ready ? 'success.light' : 'divider',
                              bgcolor: item.ready ? 'success.main' + '10' : 'transparent',
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: 18, color: item.ready ? 'success.main' : 'text.disabled' }} />
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.label}</Typography>
                          </Stack>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>

                {/* Publish section */}
                {hasDraft && (
                  <Card
                    {...card}
                    sx={{
                      ...card.sx,
                      border: isPublished
                        ? `1px solid ${mode === 'dark' ? 'rgba(34,197,94,0.35)' : 'rgba(34,197,94,0.3)'}`
                        : card.sx.border,
                      background: isPublished
                        ? mode === 'dark'
                          ? 'rgba(34,197,94,0.07)'
                          : 'rgba(34,197,94,0.04)'
                        : card.sx.background,
                    }}
                  >
                    <CardContent sx={{ p: 3.5 }}>
                      {isPublished ? (
                        <Stack spacing={2}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <CheckCircleIcon sx={{ color: '#22C55E', fontSize: 24 }} />
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#22C55E' }}>
                              Your website is live!
                            </Typography>
                          </Stack>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Your site is publicly accessible at the URL below. Share it with customers.
                          </Typography>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              flexWrap: 'wrap',
                            }}
                          >
                            <Link
                              href={website.publishedUrl}
                              target="_blank"
                              rel="noreferrer"
                              sx={{
                                flex: 1,
                                fontFamily: 'monospace',
                                fontSize: '0.85rem',
                                color: '#22C55E',
                                wordBreak: 'break-all',
                                fontWeight: 600,
                              }}
                            >
                              {website.publishedUrl}
                            </Link>
                            <Stack direction="row" spacing={0.5}>
                              <Tooltip title={copied ? 'Copied!' : 'Copy URL'}>
                                <IconButton size="small" onClick={handleCopy}>
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Open site">
                                <IconButton
                                  size="small"
                                  onClick={() => window.open(website.publishedUrl, '_blank')}
                                >
                                  <OpenInNewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Box>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<RefreshIcon />}
                            disabled={publishing || generating}
                            onClick={handlePublish}
                            sx={{ alignSelf: 'flex-start', borderRadius: 2 }}
                          >
                            Re-publish (apply latest changes)
                          </Button>
                        </Stack>
                      ) : (
                        <Stack spacing={2}>
                          <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            Ready to publish
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Your website draft is ready. Click Publish to make it live on our platform. Your site will be accessible at:
                          </Typography>
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              background: mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                              fontFamily: 'monospace',
                              fontSize: '0.85rem',
                              color: 'text.secondary',
                            }}
                          >
                            {`[platform-url]${publicPath}`}
                          </Box>
                          <Button
                            variant="contained"
                            size="large"
                            startIcon={publishing ? <CircularProgress size={18} color="inherit" /> : <PublishIcon />}
                            disabled={publishing || generating}
                            onClick={handlePublish}
                            sx={{
                              borderRadius: 3,
                              py: 1.5,
                              fontWeight: 700,
                              background: 'linear-gradient(135deg,#0F766E,#0D9488)',
                              boxShadow: '0 10px 24px rgba(15,118,110,0.28)',
                              '&:hover': { background: 'linear-gradient(135deg,#0D9488,#0F766E)' },
                            }}
                          >
                            {publishing ? 'Publishing…' : 'Publish Website'}
                          </Button>
                        </Stack>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* How it works note */}
                <Card {...card}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>
                      How it works
                    </Typography>
                    <Stack spacing={1.5}>
                      {[
                        ['1', 'Generate with only your business profile and contact details.'],
                        ['2', 'Publish the starter site when the copy feels right.'],
                        ['3', 'Add products, social links, hours, and map details later from your business profile.'],
                        ['4', 'Regenerate and re-publish whenever the business changes.'],
                        ['5', 'Share the URL with customers, social pages, and packaging.'],
                      ].map(([num, text]) => (
                        <Stack key={num} direction="row" spacing={1.5} alignItems="flex-start">
                          <Box
                            sx={{
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg,#0F766E,#0D9488)',
                              color: '#fff',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              mt: 0.2,
                            }}
                          >
                            {num}
                          </Box>
                          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                            {text}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>

              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
