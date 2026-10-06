import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeMode } from '../contexts/ThemeContext';
import { useMarketingPageTopPadding } from '../hooks/useDashboardLayoutPadding';
import { fetchBusinesses } from '../services/businessApi';
import {
  disconnectInstagram,
  generateSocialPost,
  getInstagramConnectUrl,
  getInstagramStatus,
  getSocialPostHistory,
  publishToInstagram,
  publishToFacebook,
  updateSocialPost,
} from '../services/socialApi';

const platformOptions = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'X / Twitter' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly & Warm' },
  { value: 'urgent', label: 'Urgent / Limited Offer' },
  { value: 'luxury', label: 'Luxury & Premium' },
  { value: 'fun', label: 'Fun & Casual' },
];

export default function SocialPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const { token } = useAuth();
  const pagePt = useMarketingPageTopPadding();
  const [searchParams] = useSearchParams();

  // Business Context State
  const [business, setBusiness] = useState(null);

  // Form State
  const [platform, setPlatform] = useState('instagram');
  const [tone, setTone] = useState('professional');
  const [prompt, setPrompt] = useState('');
  const [generateImage, setGenerateImage] = useState(true);

  // Post State
  const [activePost, setActivePost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedHeadline, setEditedHeadline] = useState('');
  const [editedCaption, setEditedCaption] = useState('');
  const [editedCta, setEditedCta] = useState('');
  const [editedHashtags, setEditedHashtags] = useState('');

  // History State
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Instagram Connection State
  const [igStatus, setIgStatus] = useState({
    configured: false,
    connected: false,
    instagramAccountId: null,
    instagramUsername: null,
    facebookPageName: null,
  });

  // UI Progress & Notification States
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishingFb, setPublishingFb] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Initial Load: Business info & Instagram Status
  useEffect(() => {
    if (!token) return;

    // Fetch business profile
    fetchBusinesses(token)
      .then((data) => {
        const found = Array.isArray(data) ? data[0] : data;
        if (found) setBusiness(found);
      })
      .catch((err) => console.warn('Could not load business context:', err));

    // Fetch Instagram status
    getInstagramStatus(token)
      .then((data) => setIgStatus(data))
      .catch((err) => console.warn('Could not fetch Instagram status:', err));

    // Fetch past posts history
    getSocialPostHistory(token)
      .then((posts) => {
        if (Array.isArray(posts) && posts.length > 0) {
          setHistory(posts);
          // Prefill first post if no active post yet
          const latest = posts[0];
          setActivePost({
            id: latest.id,
            platform: (latest.platform || 'instagram').toLowerCase(),
            headline: latest.headline || 'Quality Sri Lankan Products',
            caption: latest.caption || '',
            callToAction: latest.callToAction || '',
            hashtags: latest.hashtags ? latest.hashtags.split(/\s+/).filter(Boolean) : [],
            imageUrl: latest.imageUrl || null,
            status: latest.status || 'DRAFT',
            permalink: latest.permalink || null,
          });
        }
      })
      .catch((err) => console.warn('Could not load post history:', err));

    // Check OAuth return params
    if (searchParams.get('instagram_connected') === 'true') {
      setSnackbar({
        open: true,
        message: 'Instagram Professional account successfully connected!',
        severity: 'success',
      });
      // Refresh status
      getInstagramStatus(token).then((data) => setIgStatus(data));
    } else if (searchParams.get('instagram_error')) {
      setSnackbar({
        open: true,
        message: `Instagram connection failed: ${searchParams.get('instagram_error')}`,
        severity: 'error',
      });
    }
  }, [token, searchParams]);

  // Sync edit fields when activePost changes
  useEffect(() => {
    if (activePost) {
      setEditedHeadline(activePost.headline || '');
      setEditedCaption(activePost.caption || '');
      setEditedCta(activePost.callToAction || '');
      setEditedHashtags(Array.isArray(activePost.hashtags) ? activePost.hashtags.join(' ') : '');
    }
  }, [activePost]);

  // Handle Post Generation
  const handleGenerate = async () => {
    setLoading(true);
    setIsEditing(false);
    setLoadingStep('Analyzing business context & generating AI copy with Groq...');

    try {
      const response = await generateSocialPost(
        token,
        {
          prompt: prompt.trim(),
          platform,
          tone,
        },
        generateImage
      );

      setActivePost(response);

      // Refresh history list
      getSocialPostHistory(token).then((posts) => setHistory(posts));

      setSnackbar({
        open: true,
        message: response.imageUrl
          ? 'Marketing post and visual generated successfully!'
          : 'Marketing copy generated successfully.',
        severity: 'success',
      });
    } catch (error) {
      console.error('Post generation failed:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.response?.data?.error || 'Failed to generate post. Please check backend connection.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  // Save Inline Edits
  const handleSaveEdits = async () => {
    if (!activePost) return;

    const updated = {
      ...activePost,
      headline: editedHeadline,
      caption: editedCaption,
      callToAction: editedCta,
      hashtags: editedHashtags.split(/\s+/).filter(Boolean),
    };

    setActivePost(updated);
    setIsEditing(false);

    if (activePost.id) {
      try {
        await updateSocialPost(token, activePost.id, {
          headline: editedHeadline,
          caption: editedCaption,
          callToAction: editedCta,
          hashtags: editedHashtags,
        });
        setSnackbar({ open: true, message: 'Changes saved.', severity: 'success' });
      } catch (err) {
        console.warn('Could not update post draft in DB:', err);
      }
    }
  };

  // Copy Full Caption to Clipboard
  const handleCopyCaption = async () => {
    if (!activePost) return;
    const tags = Array.isArray(activePost.hashtags) ? activePost.hashtags.join(' ') : activePost.hashtags || '';
    const fullText = `${activePost.headline ? activePost.headline + '\n\n' : ''}${activePost.caption}\n\n👉 ${activePost.callToAction}\n\n${tags}`.trim();
    await navigator.clipboard.writeText(fullText);
    setSnackbar({ open: true, message: 'Caption copied to clipboard!', severity: 'success' });
  };

  // Download Generated Image
  const handleDownloadImage = () => {
    if (!activePost?.imageUrl) return;
    const a = document.createElement('a');
    a.href = activePost.imageUrl;
    a.download = `BuildBusinessLK-${platform}-ad.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setSnackbar({ open: true, message: 'Image download started!', severity: 'info' });
  };

// Connect to Instagram (Meta OAuth)
const handleConnectInstagram = async () => {
  try {
    const url = await getInstagramConnectUrl(token);
    if (url) {
      // Stay in the same tab
      window.location.href = url;
    }
  } catch (error) {
    setSnackbar({
      open: true,
      message: error.response?.data?.error || 'Meta OAuth is not configured. Please set META_APP_ID in backend.',
      severity: 'warning',
    });
  }
};

  // Quick Share to Facebook
  const handleShareFacebook = () => {
    if (!activePost) return;
    const shareUrl = activePost.imageUrl || window.location.href;
    const tags = Array.isArray(activePost.hashtags) ? activePost.hashtags.join(' ') : activePost.hashtags || '';
    const fullCaption = `${activePost.headline ? activePost.headline + '\n\n' : ''}${activePost.caption}\n\n👉 ${activePost.callToAction}\n\n${tags}`.trim();

    // Auto-copy caption to clipboard so it can be pasted (Cmd+V / Ctrl+V) directly into the Facebook post
    try {
      navigator.clipboard.writeText(fullCaption);
      setSnackbar({
        open: true,
        message: '📋 Caption copied to clipboard! Simply press Paste (Cmd+V) in the Facebook box.',
        severity: 'success',
      });
    } catch (err) {
      console.warn('Clipboard write error:', err);
    }

    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'width=650,height=650');
  };

  // Disconnect Instagram
  const handleDisconnectInstagram = async () => {
    try {
      await disconnectInstagram(token);
      setIgStatus((prev) => ({ ...prev, connected: false, instagramUsername: null }));
      setSnackbar({ open: true, message: 'Instagram account disconnected.', severity: 'info' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to disconnect account.', severity: 'error' });
    }
  };

  // Publish to Instagram
  const handlePublishInstagram = async () => {
    if (!activePost) return;
    if (!igStatus.connected) {
      setSnackbar({
        open: true,
        message: 'Please connect your Instagram Business account first, or use manual sharing below.',
        severity: 'warning',
      });
      return;
    }

    if (!activePost.imageUrl) {
      setSnackbar({
        open: true,
        message: 'An image creative is required for Instagram publishing.',
        severity: 'error',
      });
      return;
    }

    setPublishing(true);
    try {
      const tags = Array.isArray(activePost.hashtags) ? activePost.hashtags.join(' ') : activePost.hashtags || '';
      const fullCaption = `${activePost.headline ? activePost.headline + '\n\n' : ''}${activePost.caption}\n\n👉 ${activePost.callToAction}\n\n${tags}`.trim();

      const result = await publishToInstagram(token, {
        postId: activePost.id,
        caption: fullCaption,
        imageUrl: activePost.imageUrl,
      });

      setActivePost((prev) => ({
        ...prev,
        status: 'PUBLISHED',
        permalink: result.permalink,
      }));

      setSnackbar({
        open: true,
        message: '🎉 Successfully published directly to your Instagram Business account!',
        severity: 'success',
      });

      // Refresh history
      getSocialPostHistory(token).then((posts) => setHistory(posts));
    } catch (error) {
      console.error('Publishing failed:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Failed to publish to Instagram. Check Meta account permissions.',
        severity: 'error',
      });
    } finally {
      setPublishing(false);
    }
  };

  // Publish directly to connected Facebook Page
  const handlePublishFacebook = async () => {
    if (!activePost) return;
    if (!igStatus.connected || !igStatus.facebookPageName) {
      setSnackbar({
        open: true,
        message: 'Please connect your Facebook Page first.',
        severity: 'warning',
      });
      return;
    }

    setPublishingFb(true);
    try {
      const tags = Array.isArray(activePost.hashtags) ? activePost.hashtags.join(' ') : activePost.hashtags || '';
      const fullCaption = `${activePost.headline ? activePost.headline + '\n\n' : ''}${activePost.caption}\n\n👉 ${activePost.callToAction}\n\n${tags}`.trim();

      const result = await publishToFacebook(token, {
        postId: activePost.id,
        caption: fullCaption,
        imageUrl: activePost.imageUrl,
      });

      setActivePost((prev) => ({
        ...prev,
        status: 'PUBLISHED',
        permalink: result.permalink || prev.permalink,
      }));

      setSnackbar({
        open: true,
        message: `🎉 Successfully published directly to Facebook Page (${igStatus.facebookPageName})!`,
        severity: 'success',
      });

      getSocialPostHistory(token).then((posts) => setHistory(posts));
    } catch (error) {
      console.error('Facebook publishing failed:', error);
      const errMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to publish to Facebook Page. Check permissions.';
      setSnackbar({
        open: true,
        message: errMsg,
        severity: 'info',
      });
      // If direct Graph API is blocked by Meta App Review, seamlessly open Facebook Web Sharer!
      if (errMsg.toLowerCase().includes('pages_manage_posts') || errMsg.toLowerCase().includes('share on fb')) {
        setTimeout(() => {
          handleShareFacebook();
        }, 1200);
      }
    } finally {
      setPublishingFb(false);
    }
  };

  // Manual fallback: Open Instagram
  const handleOpenInstagram = () => {
    handleCopyCaption();
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: pagePt,
        pb: 8,
        background:
          mode === 'dark'
            ? 'radial-gradient(circle at top, rgba(245,158,11,0.12), transparent 40%), linear-gradient(180deg, #060A0D 0%, #10151B 100%)'
            : 'linear-gradient(180deg, #FFFDF8 0%, #F5F9F6 100%)',
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          {/* Header Navigation */}
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
            <Box>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/dashboard/marketing')}
                sx={{ mb: 1, color: theme.palette.text.secondary, textTransform: 'none' }}
              >
                Back to Marketing Channels
              </Button>
              <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.text.primary }}>
                Social Media Marketing Studio
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Generate authentic, AI-tailored captions and visual ads for Sri Lankan SMEs in Coconut, Kithul, and Palmyrah sectors.
              </Typography>
            </Box>

            {/* Meta Channels Connection Status Card */}
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                px: 2.5,
                borderRadius: 3.5,
                border: igStatus.connected ? '1px solid rgba(34,197,94,0.35)' : '1px solid rgba(245,158,11,0.3)',
                background: igStatus.connected
                  ? (mode === 'dark' ? 'rgba(34,197,94,0.06)' : '#F0FDF4')
                  : (mode === 'dark' ? 'rgba(245,158,11,0.06)' : '#FFFBEB'),
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
                boxShadow: igStatus.connected
                  ? '0 4px 20px rgba(34,197,94,0.08)'
                  : '0 4px 20px rgba(245,158,11,0.06)',
              }}
            >
              {igStatus.connected ? (
                <>
                  <Chip
                    size="small"
                    label="META CONNECTED"
                    sx={{
                      background: '#16A34A',
                      color: '#FFF',
                      fontWeight: 800,
                      fontSize: '0.68rem',
                      height: 22,
                    }}
                  />

                  <Divider orientation="vertical" flexItem sx={{ height: 28, my: 'auto', opacity: 0.3 }} />

                  {/* Facebook Page Channel */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: '#1877F2',
                        color: '#FFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FacebookIcon sx={{ fontSize: 18 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ display: 'block', color: theme.palette.text.secondary, fontSize: '0.65rem', fontWeight: 600, lineHeight: 1 }}>
                        FACEBOOK PAGE
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#1877F2' }}>
                        {igStatus.facebookPageName || 'Buildbiz'}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider orientation="vertical" flexItem sx={{ height: 28, my: 'auto', opacity: 0.3 }} />

                  {/* Instagram Channel */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #F58529, #DD2A7B, #8134AF)',
                        color: '#FFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <InstagramIcon sx={{ fontSize: 18 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ display: 'block', color: theme.palette.text.secondary, fontSize: '0.65rem', fontWeight: 600, lineHeight: 1 }}>
                        INSTAGRAM
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#E1306C' }}>
                        {igStatus.instagramUsername ? `@${igStatus.instagramUsername}` : 'Pending Link'}
                      </Typography>
                    </Box>
                  </Stack>

                  <Tooltip title="Disconnect Meta Accounts">
                    <IconButton size="small" onClick={handleDisconnectInstagram} sx={{ color: '#EF4444', ml: 'auto' }}>
                      <LinkOffIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FacebookIcon sx={{ color: '#1877F2', fontSize: 24, mr: -0.5 }} />
                      <InstagramIcon sx={{ color: '#E1306C', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: '#D97706' }}>
                        META CHANNELS NOT CONNECTED
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Connect to publish directly to Facebook & Instagram
                      </Typography>
                    </Box>
                  </Stack>
                  {igStatus.configured && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<FacebookIcon />}
                      onClick={handleConnectInstagram}
                      sx={{
                        ml: 'auto',
                        textTransform: 'none',
                        borderRadius: 2,
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #1877F2, #833AB4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #166FE5, #6B21A8)',
                        },
                      }}
                    >
                      Connect with Meta
                    </Button>
                  )}
                </>
              )}
            </Paper>
          </Stack>

          {/* Main Grid: Form Left, Preview Right */}
          <Grid container spacing={3}>
            {/* Left Column: Post Creator Form */}
            <Grid item xs={12} lg={5}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                  background: mode === 'dark' ? 'rgba(16,21,27,0.85)' : 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                }}
              >
                <CardContent sx={{ p: 3.5 }}>
                  <Stack spacing={2.5}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Create Post
                    </Typography>

                    {/* Business Context Hint */}
                    {business && (
                      <Alert severity="info" sx={{ borderRadius: 2, fontSize: '0.82rem' }}>
                        Connected Business: <strong>{business.businessName}</strong> ({business.sector})
                        {business.products?.length > 0 && ` • ${business.products.length} registered products loaded`}
                      </Alert>
                    )}

                    {/* Platform Selector */}
                    <FormControl fullWidth size="small">
                      <InputLabel>Target Platform</InputLabel>
                      <Select value={platform} label="Target Platform" onChange={(e) => setPlatform(e.target.value)}>
                        {platformOptions.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Tone Selector */}
                    <FormControl fullWidth size="small">
                      <InputLabel>Brand Voice & Tone</InputLabel>
                      <Select value={tone} label="Brand Voice & Tone" onChange={(e) => setTone(e.target.value)}>
                        {toneOptions.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Promotion Prompt */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        What would you like to promote? <span style={{ fontWeight: 400, color: theme.palette.text.secondary }}>(Optional)</span>
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder='e.g. "Promote our new virgin coconut oil targeting Australian export buyers. Emphasize purity and organic quality."'
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        helperText="Leave blank to auto-generate from your business profile & products."
                      />
                    </Box>

                    {/* Generate Image Toggle */}
                    <FormControlLabel
                      control={<Switch checked={generateImage} onChange={(e) => setGenerateImage(e.target.checked)} color="primary" />}
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Generate AI Marketing Visual
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            Creates a matching commercial product creative using AI Horde & Cloudinary
                          </Typography>
                        </Box>
                      }
                    />

                    {/* Submit Button */}
                    <Button
                      variant="contained"
                      size="large"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
                      onClick={handleGenerate}
                      sx={{
                        borderRadius: 3,
                        py: 1.5,
                        fontWeight: 800,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #F59E0B, #EA580C)',
                        boxShadow: '0 10px 25px rgba(234,88,12,0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #D97706, #C2410C)',
                        },
                      }}
                    >
                      {loading ? 'Generating Content...' : 'Generate Marketing Post'}
                    </Button>

                    {/* Progress Indicator */}
                    {loading && (
                      <Box sx={{ width: '100%', mt: 1 }}>
                        <LinearProgress color="warning" sx={{ borderRadius: 2, height: 6 }} />
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center', color: theme.palette.text.secondary }}>
                          {loadingStep || 'AI is crafting your marketing copy and visual...'}
                        </Typography>
                      </Box>
                    )}

                    {/* Post History Accordion Trigger */}
                    {history.length > 0 && (
                      <Button
                        size="small"
                        startIcon={<HistoryIcon />}
                        onClick={() => setShowHistory(!showHistory)}
                        sx={{ textTransform: 'none', alignSelf: 'flex-start', color: theme.palette.text.secondary }}
                      >
                        {showHistory ? 'Hide Post History' : `View Past Drafts (${history.length})`}
                      </Button>
                    )}

                    {showHistory && (
                      <Stack spacing={1} sx={{ maxHeight: 240, overflowY: 'auto', p: 1, border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2 }}>
                        {history.map((post) => (
                          <Paper
                            key={post.id}
                            elevation={0}
                            onClick={() => {
                              setActivePost({
                                id: post.id,
                                platform: (post.platform || 'instagram').toLowerCase(),
                                headline: post.headline,
                                caption: post.caption,
                                callToAction: post.callToAction,
                                hashtags: post.hashtags ? post.hashtags.split(/\s+/).filter(Boolean) : [],
                                imageUrl: post.imageUrl,
                                status: post.status,
                                permalink: post.permalink,
                              });
                            }}
                            sx={{
                              p: 1.5,
                              cursor: 'pointer',
                              borderRadius: 2,
                              border: activePost?.id === post.id ? '2px solid #F59E0B' : '1px solid rgba(0,0,0,0.06)',
                              '&:hover': { background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' },
                            }}
                          >
                            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
                              {post.headline || 'Untitled Post'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                              {post.caption}
                            </Typography>
                            <Chip label={post.status || 'DRAFT'} size="small" sx={{ mt: 0.5, height: 20, fontSize: '0.65rem' }} />
                          </Paper>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column: Interactive Post Preview */}
            <Grid item xs={12} lg={7}>
              {activePost ? (
                <Stack spacing={2.5}>
                  {/* Instagram Feed Mockup Card */}
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                      background: mode === 'dark' ? '#0B0F14' : '#FFFFFF',
                      boxShadow: '0 25px 50px rgba(0,0,0,0.08)',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Mockup Header */}
                    <Box sx={{ p: 2, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #F58529, #DD2A7B, #8134AF)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFF',
                            fontWeight: 800,
                            fontSize: '1rem',
                          }}
                        >
                          {(business?.businessName || 'B').charAt(0).toUpperCase()}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                            {business?.businessName || 'Your Business'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            {business?.sector ? `${business.sector} • Sponsored` : 'Sponsored'}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <Chip
                          label={activePost.status || 'DRAFT'}
                          size="small"
                          color={activePost.status === 'PUBLISHED' ? 'success' : 'default'}
                          sx={{ fontWeight: 700 }}
                        />
                      </Stack>
                    </Box>

                    {/* Mockup Creative Visual */}
                    {activePost.imageUrl ? (
                      <CardMedia
                        component="img"
                        image={activePost.imageUrl}
                        alt="Generated Marketing Visual"
                        sx={{
                          width: '100%',
                          maxHeight: 460,
                          objectFit: 'cover',
                          background: '#F3F4F6',
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 240,
                          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFF',
                          p: 3,
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                          {activePost.headline}
                        </Typography>
                      </Box>
                    )}

                    {/* Mockup Copy & Content */}
                    <CardContent sx={{ p: 3 }}>
                      {isEditing ? (
                        <Stack spacing={2}>
                          <TextField
                            label="Headline / Hook"
                            fullWidth
                            size="small"
                            value={editedHeadline}
                            onChange={(e) => setEditedHeadline(e.target.value)}
                          />
                          <TextField
                            label="Caption"
                            fullWidth
                            multiline
                            rows={5}
                            value={editedCaption}
                            onChange={(e) => setEditedCaption(e.target.value)}
                          />
                          <TextField
                            label="Call To Action"
                            fullWidth
                            size="small"
                            value={editedCta}
                            onChange={(e) => setEditedCta(e.target.value)}
                          />
                          <TextField
                            label="Hashtags (space-separated)"
                            fullWidth
                            size="small"
                            value={editedHashtags}
                            onChange={(e) => setEditedHashtags(e.target.value)}
                          />
                          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                            <Button size="small" onClick={() => setIsEditing(false)}>
                              Cancel
                            </Button>
                            <Button variant="contained" size="small" startIcon={<SaveIcon />} onClick={handleSaveEdits}>
                              Save Edits
                            </Button>
                          </Stack>
                        </Stack>
                      ) : (
                        <Stack spacing={2}>
                          {/* Headline */}
                          {activePost.headline && (
                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                              {activePost.headline}
                            </Typography>
                          )}

                          {/* Caption */}
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                            {activePost.caption}
                          </Typography>

                          {/* CTA Badge */}
                          {activePost.callToAction && (
                            <Box sx={{ display: 'inline-block' }}>
                              <Chip
                                label={`👉 ${activePost.callToAction}`}
                                sx={{ fontWeight: 700, borderRadius: 2, background: mode === 'dark' ? 'rgba(245,158,11,0.15)' : '#FEF3C7', color: '#B45309' }}
                              />
                            </Box>
                          )}

                          {/* Hashtags */}
                          {Array.isArray(activePost.hashtags) && activePost.hashtags.length > 0 && (
                            <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ pt: 1 }}>
                              {activePost.hashtags.map((tag, idx) => (
                                <Chip
                                  key={idx}
                                  label={tag}
                                  size="small"
                                  sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    background: mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#F3F4F6',
                                  }}
                                />
                              ))}
                            </Stack>
                          )}

                          {/* Post Live Link if published */}
                          {activePost.permalink && (
                            <Alert severity="success" sx={{ borderRadius: 2, mt: 1 }}>
                              View on Instagram:{' '}
                              <a href={activePost.permalink} target="_blank" rel="noreferrer" style={{ color: '#16A34A', fontWeight: 700 }}>
                                {activePost.permalink}
                              </a>
                            </Alert>
                          )}
                        </Stack>
                      )}
                    </CardContent>

                    <Divider />

                    {/* Post Action Toolbar */}
                    <Box sx={{ p: 2.5, px: 3, background: mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#F9FAFB' }}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<RefreshIcon />}
                            onClick={handleGenerate}
                            disabled={loading}
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                          >
                            Regenerate
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => setIsEditing(!isEditing)}
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                          >
                            {isEditing ? 'Close Editor' : 'Edit Copy'}
                          </Button>
                          {activePost.imageUrl && (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<DownloadIcon />}
                              onClick={handleDownloadImage}
                              sx={{ textTransform: 'none', borderRadius: 2 }}
                            >
                              Download Image
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ContentCopyIcon />}
                            onClick={handleCopyCaption}
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                          >
                            Copy Caption
                          </Button>
                        </Stack>

                        {/* Primary Publishing & Fallback Actions */}
                        <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<FacebookIcon sx={{ color: '#1877F2' }} />}
                            onClick={handleShareFacebook}
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                          >
                            Share on FB
                          </Button>

                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<OpenInNewIcon />}
                            onClick={handleOpenInstagram}
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                          >
                            Open IG
                          </Button>

                          {/* Direct Publish to Facebook Page */}
                          <Tooltip
                            title={
                              !igStatus.connected || !igStatus.facebookPageName
                                ? 'Connect your Meta account first.'
                                : !activePost.imageUrl
                                  ? 'An image creative is required for Facebook publishing.'
                                  : `Publish post directly to Facebook Page (${igStatus.facebookPageName})`
                            }
                          >
                            <span>
                              <Button
                                variant="contained"
                                size="small"
                                disabled={publishingFb || !igStatus.connected || !igStatus.facebookPageName || !activePost.imageUrl}
                                startIcon={publishingFb ? <CircularProgress size={16} color="inherit" /> : <FacebookIcon />}
                                onClick={handlePublishFacebook}
                                sx={{
                                  borderRadius: 2,
                                  fontWeight: 800,
                                  textTransform: 'none',
                                  background: '#1877F2',
                                  '&:hover': {
                                    background: '#166FE5',
                                  },
                                }}
                              >
                                {publishingFb ? 'Publishing...' : 'Publish to Facebook'}
                              </Button>
                            </span>
                          </Tooltip>

                          {/* Direct Publish to Instagram Profile */}
                          <Tooltip
                            title={
                              !igStatus.connected
                                ? 'Connect your Meta account first.'
                                : !igStatus.instagramUsername
                                  ? 'Link Instagram in Facebook Page Settings to publish to Instagram.'
                                  : !activePost.imageUrl
                                    ? 'An image creative is required for Instagram publishing.'
                                    : `Publish post directly to Instagram (@${igStatus.instagramUsername})`
                            }
                          >
                            <span>
                              <Button
                                variant="contained"
                                size="small"
                                disabled={publishing || !igStatus.connected || !igStatus.instagramUsername || !activePost.imageUrl}
                                startIcon={publishing ? <CircularProgress size={16} color="inherit" /> : <InstagramIcon />}
                                onClick={handlePublishInstagram}
                                sx={{
                                  borderRadius: 2,
                                  fontWeight: 800,
                                  textTransform: 'none',
                                  background: 'linear-gradient(135deg, #E1306C, #C13584)',
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #C13584, #833AB4)',
                                  },
                                }}
                              >
                                {publishing ? 'Publishing...' : 'Publish to Instagram'}
                              </Button>
                            </span>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </Box>
                  </Card>
                </Stack>
              ) : (
                /* Empty / Welcome State */
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 4,
                    border: '2px dashed rgba(0,0,0,0.1)',
                    background: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 4,
                      mx: 'auto',
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #F59E0B, #EA580C)',
                      color: '#FFF',
                      fontSize: 32,
                    }}
                  >
                    <InstagramIcon fontSize="inherit" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    No Post Generated Yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, maxWidth: 440, mx: 'auto', mb: 3 }}>
                    Enter an optional marketing prompt or click "Generate Marketing Post" on the left to have the AI write and design tailored content for your business.
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Stack>
      </Container>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 3, fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}