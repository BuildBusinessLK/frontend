import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Step,
  StepButton,
  Stepper,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';
import { alpha, getThemeColors, gradients, shadows } from '../theme';
import { generateSmeWebsite, publishSmeSite } from '../services/smeWebsiteApi';
import { ROUTES, hostedBusinessPath } from '../constants/routes';

const STORAGE_KEY = 'bbk-sme-site-draft-v1';

const STEPS = ['Profile', 'Catalog', 'Connect', 'Build'];

const EMPTY_PRODUCT = () => ({ name: '', description: '' });

const defaultState = () => ({
  businessName: '',
  tagline: '',
  industry: 'Coconut',
  about: '',
  products: [EMPTY_PRODUCT(), EMPTY_PRODUCT()],
  contact: { email: '', phone: '', address: '' },
  social: { facebook: '', instagram: '', youtube: '', linkedin: '', tiktok: '' },
  galleryText: '',
  theme: 'forest',
  useAi: true,
});

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const p = JSON.parse(raw);
    return {
      ...defaultState(),
      ...p,
      products: p.products?.length ? p.products : defaultState().products,
    };
  } catch {
    return defaultState();
  }
}

const THEMES = [
  { id: 'forest', title: 'Forest', hint: 'Fresh export-ready tone' },
  { id: 'ocean', title: 'Ocean', hint: 'Cool wholesale trust' },
  { id: 'amber', title: 'Amber', hint: 'Warm artisan retail' },
];

const INDUSTRIES = ['Coconut', 'Kithul', 'Palmyrah', 'Other'];

export default function SmeWebsiteStudioPage() {
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const colors = getThemeColors(mode);

  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(() => loadDraft());
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [result, setResult] = useState(null);

  const [publishSlug, setPublishSlug] = useState('');
  const [publishBusy, setPublishBusy] = useState(false);
  const [publishErr, setPublishErr] = useState(null);
  const [publishedUrl, setPublishedUrl] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }, 350);
    return () => clearTimeout(t);
  }, [form]);

  useEffect(() => {
    if (result?.suggestedSubdomain) {
      setPublishSlug(result.suggestedSubdomain);
      setPublishedUrl(null);
      setPublishErr(null);
    }
  }, [result]);

  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setContact = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, contact: { ...prev.contact, [key]: value } }));
  }, []);

  const setSocial = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, social: { ...prev.social, [key]: value } }));
  }, []);

  const updateProduct = useCallback((idx, field, value) => {
    setForm((prev) => {
      const products = prev.products.map((row, i) => (i === idx ? { ...row, [field]: value } : row));
      return { ...prev, products };
    });
  }, []);

  const addProduct = useCallback(() => {
    setForm((prev) => ({ ...prev, products: [...prev.products, EMPTY_PRODUCT()] }));
  }, []);

  const removeProduct = useCallback((idx) => {
    setForm((prev) => {
      const next = prev.products.filter((_, i) => i !== idx);
      return { ...prev, products: next.length ? next : [EMPTY_PRODUCT()] };
    });
  }, []);

  const galleryUrls = useMemo(
    () =>
      form.galleryText
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean),
    [form.galleryText],
  );

  const payload = useMemo(() => {
    const products = form.products
      .filter((p) => (p.name && p.name.trim()) || (p.description && p.description.trim()))
      .map((p) => ({ name: p.name?.trim() || '', description: p.description?.trim() || '' }));
    return {
      businessName: form.businessName.trim(),
      tagline: form.tagline.trim(),
      industry: form.industry,
      about: form.about.trim(),
      products,
      contact: {
        email: form.contact.email?.trim() || '',
        phone: form.contact.phone?.trim() || '',
        address: form.contact.address?.trim() || '',
      },
      social: {
        facebook: form.social.facebook?.trim() || '',
        instagram: form.social.instagram?.trim() || '',
        youtube: form.social.youtube?.trim() || '',
        linkedin: form.social.linkedin?.trim() || '',
        tiktok: form.social.tiktok?.trim() || '',
      },
      galleryImageUrls: galleryUrls,
      theme: form.theme,
      useAi: form.useAi,
      useFallback: false,
    };
  }, [form, galleryUrls]);

  const runGenerate = async () => {
    setErr(null);
    if (!payload.businessName) {
      setErr('Add your business name on step 1.');
      setActiveStep(0);
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      const data = await generateSmeWebsite(payload);
      setResult(data);
    } catch (e) {
      setErr(e.message || 'Could not generate');
    } finally {
      setBusy(false);
    }
  };

  const downloadHtml = () => {
    if (!result?.previewHtml) return;
    const blob = new Blob([result.previewHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyHostHint = async () => {
    if (!result?.suggestedSubdomain) return;
    const line = `${result.suggestedSubdomain}.yourplatform.example`;
    try {
      await navigator.clipboard.writeText(line);
    } catch {
      /* ignore */
    }
  };

  const publicUrlPreview = useMemo(() => {
    const s = (publishSlug || '').trim() || 'your-slug';
    if (typeof window === 'undefined') {
      return `/business/${encodeURIComponent(s)}`;
    }
    return `${window.location.origin}${hostedBusinessPath(s)}`;
  }, [publishSlug]);

  const runPublish = async () => {
    setPublishErr(null);
    setPublishedUrl(null);
    if (!result?.previewHtml) {
      setPublishErr('Generate a site first.');
      return;
    }
    const slug = (publishSlug || '').trim();
    if (slug.length < 2) {
      setPublishErr('Choose a URL slug (at least 2 characters).');
      return;
    }
    setPublishBusy(true);
    try {
      const data = await publishSmeSite({
        slug,
        previewHtml: result.previewHtml,
        templateKey: form.theme,
        manifest: result.manifest,
        businessName: form.businessName,
      });
      const path = hostedBusinessPath(data.slug);
      const full = `${window.location.origin}${path}`;
      setPublishedUrl(full);
      window.open(path, '_blank', 'noopener,noreferrer');
    } catch (e) {
      setPublishErr(e.message || 'Publish failed');
    } finally {
      setPublishBusy(false);
    }
  };

  const shellCard = {
    borderRadius: 3,
    border: `1px solid ${colors.border.secondary}`,
    bgcolor: mode === 'dark' ? alpha.white['04'] : colors.surface?.primary || '#fff',
  };

  return (
    <Box sx={{ maxWidth: 1040, mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
            Website studio
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
            Structured brief → Gemini layout when configured, otherwise an instant on-brand static page.
          </Typography>
        </Box>
        <Button variant="text" size="small" onClick={() => navigate(ROUTES.marketing2.root)} sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}>
          Hub
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ ...shellCard, p: { xs: 1.5, sm: 2 }, mb: 2 }}>
        <Stepper nonLinear activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
          {STEPS.map((label, i) => (
            <Step key={label} completed={i < activeStep}>
              <StepButton color="inherit" onClick={() => setActiveStep(i)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Business name" required fullWidth value={form.businessName} onChange={(e) => setField('businessName', e.target.value)} />
            <TextField
              label="Tagline"
              fullWidth
              value={form.tagline}
              onChange={(e) => setField('tagline', e.target.value)}
              placeholder="Cold-pressed oil · bulk & retail"
            />
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: colors.text.secondary, display: 'block', mb: 0.75 }}>
                Primary industry
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.75}>
                {INDUSTRIES.map((ind) => (
                  <Chip
                    key={ind}
                    label={ind}
                    onClick={() => setField('industry', ind)}
                    color={form.industry === ind ? 'primary' : 'default'}
                    variant={form.industry === ind ? 'filled' : 'outlined'}
                    sx={{ fontWeight: 600 }}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="About" fullWidth multiline minRows={3} value={form.about} onChange={(e) => setField('about', e.target.value)} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 700 }}>Products &amp; services</Typography>
              <Button startIcon={<AddRoundedIcon />} size="small" onClick={addProduct}>
                Add row
              </Button>
            </Box>
            {form.products.map((row, idx) => (
              <Paper key={idx} variant="outlined" sx={{ p: 1.5, borderColor: colors.border.secondary, borderRadius: 2 }}>
                <Stack spacing={1.25}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: '0.06em', color: colors.text.secondary }}>
                      ITEM {idx + 1}
                    </Typography>
                    <IconButton aria-label="Remove" size="small" onClick={() => removeProduct(idx)} disabled={form.products.length <= 1}>
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <TextField label="Name" size="small" fullWidth value={row.name} onChange={(e) => updateProduct(idx, 'name', e.target.value)} />
                  <TextField
                    label="Description"
                    size="small"
                    fullWidth
                    multiline
                    minRows={2}
                    value={row.description}
                    onChange={(e) => updateProduct(idx, 'description', e.target.value)}
                  />
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}

        {activeStep === 2 && (
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography sx={{ fontWeight: 700 }}>Contact</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Email" fullWidth value={form.contact.email} onChange={(e) => setContact('email', e.target.value)} />
              <TextField label="Phone" fullWidth value={form.contact.phone} onChange={(e) => setContact('phone', e.target.value)} />
            </Stack>
            <TextField label="Address" fullWidth multiline minRows={2} value={form.contact.address} onChange={(e) => setContact('address', e.target.value)} />
            <Typography sx={{ fontWeight: 700, pt: 1 }}>Social</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Facebook URL" fullWidth value={form.social.facebook} onChange={(e) => setSocial('facebook', e.target.value)} size="small" />
              <TextField label="Instagram URL" fullWidth value={form.social.instagram} onChange={(e) => setSocial('instagram', e.target.value)} size="small" />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="YouTube URL" fullWidth value={form.social.youtube} onChange={(e) => setSocial('youtube', e.target.value)} size="small" />
              <TextField label="LinkedIn URL" fullWidth value={form.social.linkedin} onChange={(e) => setSocial('linkedin', e.target.value)} size="small" />
            </Stack>
            <TextField label="TikTok URL" fullWidth value={form.social.tiktok} onChange={(e) => setSocial('tiktok', e.target.value)} size="small" />
            <TextField
              label="Gallery image URLs (one per line)"
              fullWidth
              multiline
              minRows={3}
              value={form.galleryText}
              onChange={(e) => setField('galleryText', e.target.value)}
              placeholder={'https://…\nhttps://…'}
            />
          </Stack>
        )}

        {activeStep === 3 && (
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography sx={{ fontWeight: 700 }}>Theme</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              {THEMES.map((t) => (
                <Paper
                  key={t.id}
                  onClick={() => setField('theme', t.id)}
                  elevation={0}
                  sx={{
                    flex: 1,
                    p: 2,
                    cursor: 'pointer',
                    borderRadius: 3,
                    border: `2px solid ${form.theme === t.id ? brandBorder(mode) : colors.border.secondary}`,
                    background:
                      form.theme === t.id
                        ? mode === 'dark'
                          ? alpha.green['10']
                          : alpha.green['05']
                        : mode === 'dark'
                          ? alpha.white['04']
                          : alpha.black['02'],
                  }}
                >
                  <Typography sx={{ fontWeight: 800 }}>{t.title}</Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    {t.hint}
                  </Typography>
                </Paper>
              ))}
            </Stack>
            <FormControlLabel
              control={<Switch checked={form.useAi} onChange={(e) => setField('useAi', e.target.checked)} color="primary" />}
              label="Use AI for layout & copy (Gemini via backend)"
            />

            {busy && <LinearProgress sx={{ borderRadius: 999 }} />}

            {err && (
              <Alert severity="error" onClose={() => setErr(null)}>
                {err}
              </Alert>
            )}

            <Button
              variant="contained"
              size="large"
              startIcon={<AutoAwesomeRoundedIcon />}
              onClick={runGenerate}
              disabled={busy}
              sx={{ borderRadius: 999, alignSelf: 'flex-start', px: 3, fontWeight: 800, background: gradients.primary, boxShadow: shadows.colored.amber }}
            >
              Generate site
            </Button>

            {result && (
              <Stack spacing={2} sx={{ pt: 1 }}>
                <Alert severity={result.source === 'ai' ? 'success' : 'info'}>
                  <strong>{result.source === 'ai' ? 'AI layout ready' : 'Template render'}</strong>
                  {result.suggestedSubdomain ? (
                    <>
                      {' · '}
                      <Typography component="span" variant="body2" sx={{ fontFamily: 'ui-monospace, monospace' }}>
                        {result.suggestedSubdomain}.yourplatform.example
                      </Typography>
                    </>
                  ) : null}
                  {result.message ? (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {result.message}
                    </Typography>
                  ) : null}
                </Alert>
                {publishErr && (
                  <Alert severity="error" onClose={() => setPublishErr(null)}>
                    {publishErr}
                  </Alert>
                )}
                {publishedUrl && (
                  <Alert severity="success" onClose={() => setPublishedUrl(null)}>
                    Live at{' '}
                    <Typography component="a" href={publishedUrl} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 700 }}>
                      {publishedUrl}
                    </Typography>
                  </Alert>
                )}
                <TextField
                  label="URL slug (hosted path)"
                  size="small"
                  value={publishSlug}
                  onChange={(e) => setPublishSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'))}
                  helperText={publicUrlPreview}
                  sx={{ maxWidth: 520 }}
                />
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  <Button variant="outlined" startIcon={<DownloadRoundedIcon />} onClick={downloadHtml} sx={{ borderRadius: 999 }}>
                    Download index.html
                  </Button>
                  <Button variant="outlined" startIcon={<ContentCopyRoundedIcon />} onClick={copyHostHint} sx={{ borderRadius: 999 }}>
                    Copy host pattern
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<OpenInBrowserRoundedIcon />}
                    onClick={runPublish}
                    disabled={publishBusy || !result.previewHtml}
                    sx={{ borderRadius: 999, fontWeight: 800, background: gradients.primary, boxShadow: shadows.colored.green }}
                  >
                    {publishBusy ? 'Publishing…' : 'Host on BuildBusinessLK'}
                  </Button>
                </Stack>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                  Publishing stores HTML + manifest in MySQL and opens{' '}
                  <Typography component="span" sx={{ fontFamily: 'ui-monospace, monospace' }}>
                    /business/…
                  </Typography>{' '}
                  on this app. Re-publish updates the same slug. Later you can render from manifest + fixed templates only.
                </Typography>
                <Box
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: `1px solid ${colors.border.secondary}`,
                    height: { xs: 420, md: 520 },
                    bgcolor: '#fff',
                  }}
                >
                  {result.previewHtml ? (
                    <iframe
                      title="Preview"
                      srcDoc={result.previewHtml}
                      sandbox="allow-scripts allow-same-origin"
                      style={{ width: '100%', height: '100%', border: 'none' }}
                    />
                  ) : (
                    <Box sx={{ p: 3 }}>
                      <Typography>No preview HTML in response.</Typography>
                    </Box>
                  )}
                </Box>
              </Stack>
            )}
          </Stack>
        )}

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 3, pt: 2, borderTop: `1px solid ${colors.border.secondary}` }}>
          <Button
            startIcon={<ChevronLeftRoundedIcon />}
            disabled={activeStep === 0}
            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
            sx={{ borderRadius: 999 }}
          >
            Back
          </Button>
          <Button
            endIcon={<ChevronRightRoundedIcon />}
            disabled={activeStep >= STEPS.length - 1}
            onClick={() => setActiveStep((s) => Math.min(STEPS.length - 1, s + 1))}
            variant="contained"
            sx={{ borderRadius: 999, background: gradients.primary }}
          >
            Next
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

function brandBorder(mode) {
  return mode === 'dark' ? 'rgba(74,222,128,0.55)' : 'rgba(21,128,61,0.45)';
}
