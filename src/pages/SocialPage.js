import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import LaunchIcon from '@mui/icons-material/Launch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import axios from 'axios';
import { useThemeMode } from '../contexts/ThemeContext';
import { useMarketingPageTopPadding } from '../hooks/useDashboardLayoutPadding';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5003';
const ADS_GENERATOR_URL = 'https://atxp.pics/chat';

const platformOptions = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'X / Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

const toneOptions = ['professional', 'friendly', 'urgent', 'luxury', 'fun'];

const normalizeHandle = (value) =>
  String(value || '')
    .trim()
    .replace(/^@/, '')
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');

const normalizeWhatsAppNumber = (value) => String(value || '').replace(/[^\d]/g, '');

const parseGroupLinks = (raw) =>
  String(raw || '')
    .split(/[\n,;\s]+/)
    .map((entry) => entry.trim())
    .filter((entry) => /^https?:\/\//i.test(entry));

const buildPostText = (post) => `${post.hook}\n\n${post.caption}\n\n${post.hashtags}`;

const escapeSvg = (value) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&apos;');

const buildPostSvg = (post, platform) => {
  const palette = {
    facebook: ['#1877F2', '#4267B2', '#0F2F7C'],
    instagram: ['#F58529', '#DD2A7B', '#8134AF'],
    twitter: ['#0ea5e9', '#0284c7', '#0f172a'],
    linkedin: ['#0A66C2', '#004182', '#0f172a'],
    whatsapp: ['#25D366', '#128C7E', '#075E54'],
    default: ['#ff9f43', '#ff6b6b', '#5b6cff'],
  };

  const [primary, secondary, accent] = palette[platform] || palette.default;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${primary}" />
          <stop offset="50%" stop-color="${secondary}" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <rect width="1080" height="1350" fill="url(#bg)" />
      <rect x="60" y="60" width="960" height="1230" rx="34" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.28)" />
      <text x="110" y="160" fill="#fff" font-family="Arial, sans-serif" font-size="42" font-weight="700">${escapeSvg(platform.toUpperCase())}</text>
      <foreignObject x="110" y="230" width="860" height="780">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial,sans-serif;color:#fff;line-height:1.3;">
          <div style="font-size:54px;font-weight:800;margin-bottom:24px;">${escapeSvg(post.hook)}</div>
          <div style="font-size:36px;font-weight:600;opacity:0.95;margin-bottom:26px;">${escapeSvg(post.caption)}</div>
          <div style="font-size:30px;opacity:0.88;">${escapeSvg(post.hashtags)}</div>
        </div>
      </foreignObject>
      <rect x="110" y="1080" rx="20" width="340" height="90" fill="rgba(255,255,255,0.92)" />
      <text x="145" y="1138" fill="#111827" font-family="Arial,sans-serif" font-size="34" font-weight="800">Post Now</text>
    </svg>`;
};

const buildPostPngDataUrl = async (post, platform) => {
  const svg = buildPostSvg(post, platform);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);

  try {
    const image = new Image();
    image.decoding = 'async';

    return await new Promise((resolve, reject) => {
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1350;
        const context = canvas.getContext('2d');

        if (!context) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      };

      image.onerror = () => reject(new Error('Failed to render post image'));
      image.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export default function SocialPage() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const pagePt = useMarketingPageTopPadding();

  const [adIdea, setAdIdea] = useState('');
  const [tone, setTone] = useState('professional');
  const [platform, setPlatform] = useState('facebook');
  const [ad, setAd] = useState(null);
  const [loadingAd, setLoadingAd] = useState(false);
  const [adError, setAdError] = useState('');

  const [postIdea, setPostIdea] = useState('');
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postsError, setPostsError] = useState('');

  const [socialAccounts, setSocialAccounts] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    whatsapp: '',
    whatsappGroups: '',
  });

  const selectedPlatforms = useMemo(() => {
    const configured = platformOptions
      .map((option) => option.value)
      .filter((key) => String(socialAccounts[key] || '').trim());

    return configured.length ? configured : platformOptions.map((option) => option.value);
  }, [socialAccounts]);

  const generateAd = async () => {
    if (!adIdea.trim()) {
      setAdError('Enter an ad idea first.');
      return;
    }

    setLoadingAd(true);
    setAdError('');

    try {
      const prompt = [
        'Create a creative business ad based on the following user idea.',
        `Idea: ${adIdea.trim()}`,
        `Tone: ${tone}`,
        `Platform: ${platform}`,
        'Write compelling copy, a strong headline, and a clear call to action.',
      ].join('\n');

      // Copy prompt to clipboard
      await navigator.clipboard.writeText(prompt);

      // Open external site in new window
      const externalUrl = `${ADS_GENERATOR_URL}?occasion=business`;
      window.open(externalUrl, '_blank', 'noopener,noreferrer');

      // Show confirmation
      setAd({
        headline: '✓ Prompt copied & generator opened',
        description: 'Your prompt has been automatically copied to clipboard. The ATXP ad generator opened in a new window.',
        cta: 'Paste your prompt in the generator',
        prompt,
      });
    } catch (error) {
      console.error(error);
      setAdError('Failed to copy prompt or open generator. Please try again.');
    } finally {
      setLoadingAd(false);
    }
  };

  const generatePosts = async () => {
    if (!postIdea.trim()) {
      setPostsError('Enter a post idea first.');
      return;
    }

    setLoadingPosts(true);
    setPostsError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/generate-posts`, {
        idea: postIdea,
        platforms: selectedPlatforms,
      });

      setPosts(response.data.posts || []);
    } catch (error) {
      console.error(error);
      setPostsError('Failed to generate posts. Check the backend endpoint and try again.');
    } finally {
      setLoadingPosts(false);
    }
  };

  const copyText = async (text) => {
    await navigator.clipboard.writeText(text);
  };

  const openShare = async (post, postPlatform) => {
    const account = normalizeHandle(socialAccounts[postPlatform]);
    const encoded = encodeURIComponent(buildPostText(post));

    await copyText(buildPostText(post));

    if (postPlatform === 'facebook') {
      const target = account ? `https://www.facebook.com/${account}` : 'https://www.facebook.com';
      window.open(target, '_blank', 'noopener,noreferrer');
      return;
    }

    if (postPlatform === 'twitter') {
      const via = account ? `&via=${encodeURIComponent(account)}` : '';
      window.open(`https://twitter.com/intent/tweet?text=${encoded}${via}`, '_blank', 'noopener,noreferrer');
      return;
    }

    if (postPlatform === 'whatsapp') {
      const number = normalizeWhatsAppNumber(socialAccounts.whatsapp);
      const waBase = number ? `https://wa.me/${number}` : 'https://wa.me/';
      window.open(`${waBase}?text=${encoded}`, '_blank', 'noopener,noreferrer');
      return;
    }

    if (postPlatform === 'linkedin') {
      const target = account ? `https://www.linkedin.com/in/${account}` : 'https://www.linkedin.com/feed/';
      window.open(target, '_blank', 'noopener,noreferrer');
      return;
    }

    if (postPlatform === 'instagram') {
      const target = account ? `https://www.instagram.com/${account}/` : 'https://www.instagram.com/';
      window.open(target, '_blank', 'noopener,noreferrer');
    }
  };

  const downloadPostImage = async (post, postPlatform) => {
    const dataUrl = await buildPostPngDataUrl(post, postPlatform);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${postPlatform}-post.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareWhatsAppAll = async (post) => {
    const encoded = encodeURIComponent(buildPostText(post));
    const number = normalizeWhatsAppNumber(socialAccounts.whatsapp);
    const groupLinks = parseGroupLinks(socialAccounts.whatsappGroups);

    await copyText(buildPostText(post));

    if (number) {
      window.open(`https://wa.me/${number}?text=${encoded}`, '_blank', 'noopener,noreferrer');
    }

    window.open(`https://wa.me/?text=${encoded}`, '_blank', 'noopener,noreferrer');

    groupLinks.slice(0, 3).forEach((link) => {
      window.open(link, '_blank', 'noopener,noreferrer');
    });

    window.open('https://web.whatsapp.com/', '_blank', 'noopener,noreferrer');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: pagePt,
        pb: 8,
        background:
          mode === 'dark'
            ? 'radial-gradient(circle at top, rgba(249,115,22,0.14), transparent 38%), linear-gradient(180deg, #060A0D 0%, #10151B 100%)'
            : 'linear-gradient(180deg, #FFF7ED 0%, #F7FAF8 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4} sx={{ py: 4 }}>
          <Box>
            <Chip
              label="Social Media Studio"
              icon={<AutoAwesomeIcon />}
              sx={{
                mb: 2,
                fontWeight: 700,
                color: mode === 'dark' ? '#FDBA74' : '#C2410C',
                background: mode === 'dark' ? 'rgba(249,115,22,0.12)' : 'rgba(249,115,22,0.1)',
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
              Ads, Posts, and Share Flows
            </Typography>
            <Typography sx={{ maxWidth: 760, color: theme.palette.text.secondary }}>
              Generate social ads and platform-specific post ideas, then copy, download, or open share links for Facebook,
              Instagram, X, LinkedIn, and WhatsApp.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems="stretch">
            <Card sx={{ flex: 1, borderRadius: 3, background: mode === 'dark' ? 'rgba(6,10,13,0.8)' : 'rgba(255,255,255,0.92)' }}>
              <CardContent sx={{ p: 3.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5 }}>
                  Generate Ad
                </Typography>
                <Stack spacing={2}>
                  <TextField label="Ad Idea" multiline rows={4} value={adIdea} onChange={(e) => setAdIdea(e.target.value)} />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField select label="Tone" value={tone} onChange={(e) => setTone(e.target.value)} fullWidth>
                      {toneOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField select label="Platform" value={platform} onChange={(e) => setPlatform(e.target.value)} fullWidth>
                      {platformOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                  {adError && <Alert severity="error">{adError}</Alert>}
                  <Button variant="contained" onClick={generateAd} disabled={loadingAd}>
                    {loadingAd ? 'Generating...' : 'Generate Ad'}
                  </Button>
                </Stack>

                {ad && (
                  <Paper sx={{ mt: 3, p: 2.5, borderRadius: 2, background: mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.82)' }}>
                    <Typography variant="overline" sx={{ letterSpacing: '0.2em' }}>
                      Ad Generator Status
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mt: 1, mb: 1 }}>
                      {ad.headline}
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.secondary, mb: 2 }}>{ad.description}</Typography>
                    <Chip label={ad.cta} color="primary" />
                    {ad.prompt && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                          Your Generated Prompt
                        </Typography>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.75)',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            {ad.prompt}
                          </Typography>
                        </Paper>
                      </Box>
                    )}
                  </Paper>
                )}
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, borderRadius: 3, background: mode === 'dark' ? 'rgba(6,10,13,0.8)' : 'rgba(255,255,255,0.92)' }}>
              <CardContent sx={{ p: 3.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5 }}>
                  Social Accounts
                </Typography>
                <Typography sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                  Optional. These help the share buttons open the right profile or chat.
                </Typography>
                <Stack spacing={1.5}>
                  {platformOptions.map((option) => (
                    <TextField
                      key={option.value}
                      label={`${option.label} username / page`}
                      value={socialAccounts[option.value]}
                      onChange={(e) => setSocialAccounts((current) => ({ ...current, [option.value]: e.target.value }))}
                    />
                  ))}
                  <TextField
                    label="WhatsApp group links"
                    helperText="Paste links separated by commas or new lines"
                    value={socialAccounts.whatsappGroups}
                    onChange={(e) => setSocialAccounts((current) => ({ ...current, whatsappGroups: e.target.value }))}
                    multiline
                    minRows={3}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          <Card sx={{ borderRadius: 3, background: mode === 'dark' ? 'rgba(6,10,13,0.8)' : 'rgba(255,255,255,0.92)' }}>
            <CardContent sx={{ p: 3.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5 }}>
                Generate Posts
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Post Idea"
                  multiline
                  minRows={4}
                  value={postIdea}
                  onChange={(e) => setPostIdea(e.target.value)}
                  placeholder="Describe the product, offer, campaign, or announcement"
                />
                {postsError && <Alert severity="error">{postsError}</Alert>}
                <Button variant="contained" onClick={generatePosts} disabled={loadingPosts}>
                  {loadingPosts ? 'Generating...' : 'Generate Posts'}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {posts.length > 0 && (
            <Stack spacing={2.5}>
              {posts.map((post, index) => (
                <Card key={`${post.platform}-${index}`} sx={{ borderRadius: 3, background: mode === 'dark' ? 'rgba(6,10,13,0.8)' : 'rgba(255,255,255,0.92)' }}>
                  <CardContent sx={{ p: 3.5 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                      <Box>
                        <Chip label={post.platform} sx={{ mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                          {post.hook}
                        </Typography>
                        <Typography sx={{ color: theme.palette.text.secondary, mb: 1.5 }}>{post.caption}</Typography>
                        <Typography sx={{ color: theme.palette.text.secondary }}>{post.hashtags}</Typography>
                      </Box>

                      <Stack spacing={1.25} sx={{ minWidth: 220 }}>
                        <Button
                          variant="outlined"
                          startIcon={<ContentCopyIcon />}
                          onClick={() => copyText(buildPostText(post))}
                        >
                          Copy Text
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<LaunchIcon />}
                          onClick={() => openShare(post, post.platform)}
                        >
                          Open Share
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<DownloadIcon />}
                          onClick={() => downloadPostImage(post, post.platform)}
                        >
                          Download Image
                        </Button>
                        {post.platform === 'whatsapp' && (
                          <Button variant="contained" onClick={() => shareWhatsAppAll(post)}>
                            WhatsApp All
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}

          <Divider />
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Backend endpoint: {API_BASE_URL}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
