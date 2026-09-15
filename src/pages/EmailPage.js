import React, { useEffect, useState, useMemo } from 'react';
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
  Chip,
  Paper,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Grid,
  Divider,
  LinearProgress,
  Tooltip,
  IconButton,
  MenuItem,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PublicIcon from '@mui/icons-material/Public';
import GroupsIcon from '@mui/icons-material/Groups';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MailIcon from '@mui/icons-material/Mail';
import SearchIcon from '@mui/icons-material/Search';

import { useThemeMode } from '../contexts/ThemeContext';
import { useMarketingPageTopPadding } from '../hooks/useDashboardLayoutPadding';
import axios from 'axios';
import { authHeaders } from '../services/authApi';
import { useLocation } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_SPRING_BACKEND_BASE_URL || 'http://localhost:8083';

const CAMPAIGN_GOALS = [
  { key: 'WHOLESALE_PITCH', label: 'Wholesale Supply Pitch', desc: 'Direct supply proposal for commercial volume buyers' },
  { key: 'EXPORTER_SAMPLE_OFFER', label: 'Exporter Sample Offer', desc: 'Offer certified product samples to registered exporters' },
  { key: 'RETAIL_DISCOUNT', label: 'Retail Promotional Discount', desc: 'Volume discount or seasonal promotional sale' },
  { key: 'HARVEST_ANNOUNCEMENT', label: 'Fresh Harvest Announcement', desc: 'New farmgate harvest ready for shipment or processing' },
  { key: 'GENERAL_ANNOUNCEMENT', label: 'Commercial Announcement', desc: 'Company updates, catalog launches, or business notices' },
];

const SECTOR_OPTIONS = [
  { value: 'COCONUT', label: 'Coconut & Kernels' },
  { value: 'KITHUL', label: 'Kithul & Jaggery' },
  { value: 'PALMYRAH', label: 'Palmyrah & Distillates' },
  { value: 'FOOD_BEVERAGE', label: 'Food & Beverage' },
  { value: 'AGRICULTURE', label: 'Agriculture & Spices' },
  { value: 'HANDICRAFTS', label: 'Handicrafts & Decor' },
];

const TONE_OPTIONS = [
  { value: 'Professional B2B Export', label: 'Professional B2B Export (Recommended)' },
  { value: 'Formal Commercial', label: 'Formal Commercial' },
  { value: 'Warm & Artisanal', label: 'Warm & Artisanal Producer' },
  { value: 'Promotional / Urgent', label: 'Promotional / Special Offer' },
];

export default function EmailPage() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const pagePt = useMarketingPageTopPadding();
  const location = useLocation();

  // Strategy & AI Generation State
  const [goal, setGoal] = useState('WHOLESALE_PITCH');
  const [sector, setSector] = useState('COCONUT');
  const [productName, setProductName] = useState('Virgin Coconut Oil (Export Grade)');
  const [tone, setTone] = useState('Professional B2B Export');
  const [emailIdea, setEmailIdea] = useState(
    'Announce 100% cold-pressed virgin coconut oil batch with SLS certification ready for container shipment.'
  );
  const [targetAudienceText, setTargetAudienceText] = useState('EDB Registered Exporters & Wholesale Aggregators');
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Draft State
  const [email, setEmail] = useState(null);
  const [campaignTitle, setCampaignTitle] = useState('Q4 Exporter Outreach Campaign');
  const [copied, setCopied] = useState(false);

  // Audience & Groups State
  const [audienceTab, setAudienceTab] = useState(0); // 0 = B2B Exporters, 1 = Retail Customers
  const [recipientGroups, setRecipientGroups] = useState([]);
  const [selectedGroupKeys, setSelectedGroupKeys] = useState(['edb_coconut']);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Recipient Preview Dialog State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewRecipients, setPreviewRecipients] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewPage, setPreviewPage] = useState(0);
  const [previewRowsPerPage, setPreviewRowsPerPage] = useState(10);
  const [previewSearch, setPreviewSearch] = useState('');

  // Simulation & Dispatch State
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [testSending, setTestSending] = useState(false);
  const [testSendSuccess, setTestSendSuccess] = useState('');
  const [testSendError, setTestSendError] = useState('');

  // Campaign History State
  const [campaigns, setCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [selectedHistoryCampaign, setSelectedHistoryCampaign] = useState(null);
  const [historyDetailOpen, setHistoryDetailOpen] = useState(false);
  const [historyRecipients, setHistoryRecipients] = useState([]);

  // Seeding State
  const [seedingCustomers, setSeedingCustomers] = useState(false);
  const [seedSuccessMsg, setSeedSuccessMsg] = useState('');
  const [importingEdb, setImportingEdb] = useState(false);
  const [importEdbMsg, setImportEdbMsg] = useState('');

  // Check for prefilled data from AIChatPage
  useEffect(() => {
    if (location.state?.prefill) {
      const p = location.state.prefill;
      if (p.goal) setGoal(p.goal);
      if (p.sector) setSector(p.sector.toUpperCase());
      if (p.subject && p.body) {
        setEmail({
          subject: p.subject,
          body: p.body,
          suggestedCallToAction: p.suggestedCallToAction || '',
          targetAudienceNotes: p.targetAudience || '',
        });
      }
      if (p.targetAudience) setTargetAudienceText(p.targetAudience);
      if (p.subject) setCampaignTitle(p.subject.substring(0, 45));
    }
  }, [location.state]);

  // Load Recipient Groups
  const loadRecipientGroups = async () => {
    setLoadingGroups(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/email/recipient-groups`, {
        headers: authHeaders(),
      });
      setRecipientGroups(res.data || []);
    } catch (error) {
      console.warn('Falling back to legacy groups:', error);
      try {
        const legacyRes = await axios.get(`${API_BASE_URL}/email-recipient-groups`, {
          headers: authHeaders(),
        });
        const mapped = (legacyRes.data || []).map((g) => ({
          id: g.id,
          groupKey: g.id,
          name: g.label,
          type: g.id.startsWith('edb') ? 'EDB_COCONUT_EXPORTERS' : 'RETAIL_CUSTOMERS',
          sector: 'COCONUT',
          description: g.label,
          recipientCount: g.recipientCount || 0,
          isSystem: true,
        }));
        setRecipientGroups(mapped);
      } catch (e) {
        console.error('Failed to load groups:', e);
      }
    } finally {
      setLoadingGroups(false);
    }
  };

  // Load Campaigns History
  const loadCampaigns = async () => {
    setLoadingCampaigns(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/email/campaigns`, {
        headers: authHeaders(),
      });
      setCampaigns(res.data || []);
    } catch (error) {
      console.warn('Could not load campaign history:', error);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  useEffect(() => {
    loadRecipientGroups();
    loadCampaigns();
  }, []);

  // Filter groups by tab
  const b2bGroups = useMemo(() => {
    return recipientGroups.filter(
      (g) => g.groupKey?.startsWith('edb_') || g.type?.startsWith('EDB_')
    );
  }, [recipientGroups]);

  const retailGroups = useMemo(() => {
    return recipientGroups.filter(
      (g) => !g.groupKey?.startsWith('edb_') && !g.type?.startsWith('EDB_')
    );
  }, [recipientGroups]);

  const activeTabGroups = audienceTab === 0 ? b2bGroups : retailGroups;

  // Compute total selected recipients
  const totalSelectedRecipients = useMemo(() => {
    return recipientGroups
      .filter((g) => selectedGroupKeys.includes(g.groupKey))
      .reduce((sum, g) => sum + (g.recipientCount || 0), 0);
  }, [recipientGroups, selectedGroupKeys]);

  const toggleGroupKey = (key) => {
    setSelectedGroupKeys((curr) =>
      curr.includes(key) ? curr.filter((k) => k !== key) : [...curr, key]
    );
  };

  const handleSelectAllInTab = () => {
    const tabKeys = activeTabGroups.map((g) => g.groupKey);
    const allSelected = tabKeys.every((k) => selectedGroupKeys.includes(k));
    if (allSelected) {
      setSelectedGroupKeys((curr) => curr.filter((k) => !tabKeys.includes(k)));
    } else {
      setSelectedGroupKeys((curr) => Array.from(new Set([...curr, ...tabKeys])));
    }
  };

  // Generate AI Email
  const generateAiEmail = async () => {
    setLoadingEmail(true);
    setEmailError('');
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/email/generate`,
        {
          goal,
          sector,
          productName,
          targetAudience: targetAudienceText,
          tone,
          keyOffer: emailIdea,
          idea: emailIdea,
        },
        { headers: authHeaders() }
      );

      setEmail({
        subject: res.data.subject,
        body: res.data.body,
        suggestedCallToAction: res.data.suggestedCallToAction,
        targetAudienceNotes: res.data.targetAudienceNotes,
      });
      setCampaignTitle(`${productName} – ${goal.replace(/_/g, ' ')}`);
    } catch (error) {
      console.error('Generation error:', error);
      setEmailError('Could not generate AI draft. Please ensure backend is running.');
    } finally {
      setLoadingEmail(false);
    }
  };

  // Copy Email to Clipboard
  const handleCopyEmail = () => {
    if (email) {
      const fullText = `Subject: ${email.subject}\n\n${email.body}`;
      navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Open Recipient Preview Modal
  const handleOpenPreview = async () => {
    setPreviewOpen(true);
    setPreviewLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/email/recipients?size=50`, {
        headers: authHeaders(),
      });
      setPreviewRecipients(res.data?.content || []);
    } catch (error) {
      console.error('Error fetching preview recipients:', error);
    } finally {
      setPreviewLoading(false);
    }
  };

  // Safe Test Send (Strictly routes to authorized test mailboxes)
  const handleTestSend = async () => {
    let currentEmail = email;
    if (!currentEmail) {
      currentEmail = {
        subject: `Commercial Supply Inquiry: Export-Grade ${productName} – Lanka Value Agribusiness`,
        body: `Dear Commercial Partner,\n\nI hope this email finds you well.\n\nI am writing to you on behalf of Lanka Value Agribusiness, an established Sri Lankan producer operating in the ${sector} value chain. We are currently offering our latest harvest batch of ${productName}, processed to meet stringent commercial export grading criteria.\n\nCommercial Specification Highlights:\n• 100% authentic Sri Lankan farmgate origin with full batch traceability\n• Clean, hygienic processing complying with standard moisture, aroma, and grading benchmarks\n• Flexible packaging formats and private label availability\n• Low initial Minimum Order Quantity (MOQ) for commercial evaluation\n\nWe would welcome the opportunity to courier a complimentary evaluation sample pack and our wholesale specification sheet to your team.\n\nCould we connect for a brief 5-minute introductory call this week, or may I dispatch our product specifications for your review?\n\nThank you for your valuable time and consideration.\n\nWarm regards,\n\nCommercial Sales Director\nLanka Value Agribusiness\nPhone: +94 77 123 4567\nEmail: havindufonseka@gmail.com`,
      };
      setEmail(currentEmail);
    }

    setTestSending(true);
    setTestSendSuccess('');
    setTestSendError('');

    try {
      // 1. Create Campaign
      const createRes = await axios.post(
        `${API_BASE_URL}/api/email/campaigns`,
        {
          title: campaignTitle || `Test Dispatch: ${productName}`,
          goal,
          targetSector: sector,
          targetAudienceSummary: targetAudienceText,
          subject: currentEmail.subject,
          body: currentEmail.body,
          groupKeys: selectedGroupKeys,
          isMock: true,
        },
        { headers: authHeaders() }
      );

      const campaignId = createRes.data.id;

      // 2. Dispatch Safe Test Send
      const sendRes = await axios.post(
        `${API_BASE_URL}/api/email/campaigns/${campaignId}/test-send`,
        {},
        { headers: authHeaders() }
      );

      setTestSendSuccess(
        sendRes.data.message ||
          'Live test email dispatched successfully to your 2 inboxes: havindufonseka@gmail.com and havinduhesara21@gmail.com!'
      );
      loadCampaigns();
    } catch (error) {
      console.error('Test send error:', error);
      setTestSendError(error.response?.data?.message || 'Failed to dispatch test email.');
    } finally {
      setTestSending(false);
    }
  };

  // Launch Realistic Mock Campaign Simulation
  const handleSimulateCampaign = async () => {
    if (!email) {
      setTestSendError('Please generate an email draft before simulating.');
      return;
    }
    if (selectedGroupKeys.length === 0) {
      setTestSendError('Please select at least one recipient group.');
      return;
    }

    setSimulating(true);
    setSimulationResult(null);
    setTestSendSuccess('');
    setTestSendError('');

    try {
      // 1. Create Campaign Record
      const createRes = await axios.post(
        `${API_BASE_URL}/api/email/campaigns`,
        {
          title: campaignTitle || 'Broadcast Campaign',
          goal,
          targetSector: sector,
          targetAudienceSummary: targetAudienceText,
          subject: email.subject,
          body: email.body,
          groupKeys: selectedGroupKeys,
          isMock: true,
        },
        { headers: authHeaders() }
      );

      const campaignId = createRes.data.id;

      // 2. Run stochastic simulation
      const simRes = await axios.post(
        `${API_BASE_URL}/api/email/campaigns/${campaignId}/simulate`,
        {},
        { headers: authHeaders() }
      );

      setSimulationResult(simRes.data);
      loadCampaigns();
    } catch (error) {
      console.error('Simulation error:', error);
      setTestSendError(error.response?.data?.message || 'Failed to execute campaign simulation.');
    } finally {
      setSimulating(false);
    }
  };

  // Seed sample retail customers
  const seedSampleCustomers = async () => {
    setSeedingCustomers(true);
    setSeedSuccessMsg('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/customers/seed`, {}, { headers: authHeaders() });
      setSeedSuccessMsg(`Generated ${res.data.count} realistic customer profiles in the ${res.data.sector} sector!`);
      loadRecipientGroups();
    } catch (error) {
      console.error('Seed error:', error);
    } finally {
      setSeedingCustomers(false);
    }
  };

  // Import / Re-sync EDB Directory
  const handleImportEdb = async () => {
    setImportingEdb(true);
    setImportEdbMsg('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/email/recipients/import-edb`, {}, { headers: authHeaders() });
      setImportEdbMsg(res.data.message || 'Successfully synced official EDB exporters directory.');
      loadRecipientGroups();
    } catch (error) {
      console.error('Import EDB error:', error);
    } finally {
      setImportingEdb(false);
    }
  };

  // Open Campaign Details Modal
  const handleOpenCampaignDetails = async (camp) => {
    setSelectedHistoryCampaign(camp);
    setHistoryDetailOpen(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/email/campaigns/${camp.id}/recipients`, {
        headers: authHeaders(),
      });
      setHistoryRecipients(res.data || []);
    } catch (err) {
      console.error('Error fetching campaign recipients:', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: pagePt,
        pb: 10,
        background:
          mode === 'dark'
            ? 'radial-gradient(circle at top, rgba(56,189,248,0.14), transparent 45%), linear-gradient(180deg, #060A0D 0%, #10151B 100%)'
            : 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4} sx={{ py: 3 }}>
          {/* Header & Badges */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }} flexWrap="wrap">
              <Chip
                icon={<AutoAwesomeIcon sx={{ fontSize: '1rem !important' }} />}
                label="AI Email Studio"
                sx={{
                  fontWeight: 800,
                  color: mode === 'dark' ? '#87CEEB' : '#0369A1',
                  background: mode === 'dark' ? 'rgba(56,189,248,0.12)' : 'rgba(56,189,248,0.1)',
                }}
              />
              <Chip
                icon={<SecurityIcon sx={{ fontSize: '1rem !important', color: '#10b981 !important' }} />}
                label="Safe Sandbox Mode Active"
                variant="outlined"
                sx={{
                  fontWeight: 700,
                  color: '#10b981',
                  borderColor: 'rgba(16,185,129,0.35)',
                  background: mode === 'dark' ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.04)',
                }}
              />
              <Chip
                icon={<PublicIcon sx={{ fontSize: '1rem !important' }} />}
                label="219 EDB Exporters Directory"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Stack>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Commercial Email Campaign Studio
            </Typography>
            <Typography sx={{ maxWidth: 780, color: theme.palette.text.secondary, fontSize: '1rem' }}>
              Draft, customize, and simulate high-impact commercial outreach to Sri Lanka Export Development Board (EDB) registered exporters, wholesale bulk buyers, and retail customer segments.
            </Typography>

            {/* Sandbox Security Notice Alert */}
            <Alert
              severity="info"
              icon={<SecurityIcon />}
              sx={{
                mt: 2.5,
                borderRadius: 2.5,
                background: mode === 'dark' ? 'rgba(56,189,248,0.08)' : '#e0f2fe',
                borderColor: mode === 'dark' ? 'rgba(56,189,248,0.2)' : '#bae6fd',
                color: mode === 'dark' ? '#e0f2fe' : '#0369a1',
              }}
            >
              <strong>Production Safety Isolation:</strong> Real external third parties are never contacted.
              Test sends are dispatched strictly to your verified tester inboxes (<code>havindufonseka@gmail.com</code> &amp; <code>havinduhesara21@gmail.com</code>). Full campaigns run high-fidelity stochastic delivery and engagement simulations.
            </Alert>
          </Box>

          {/* Step 1: Campaign Brief & AI Generator */}
          <Card
            sx={{
              borderRadius: 3,
              border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              background: mode === 'dark' ? 'rgba(6,10,13,0.85)' : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(18px)',
              boxShadow: mode === 'dark' ? '0 10px 30px rgba(0,0,0,0.4)' : '0 10px 25px rgba(0,0,0,0.03)',
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: theme.palette.text.primary }}>
                Step 1: Campaign Strategy &amp; AI Generator
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                Select a commercial objective, specify your value proposition, and let our Sri Lankan agribusiness AI craft an authentic, high-converting draft.
              </Typography>

              {/* Goal Presets */}
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary', display: 'block', mb: 1 }}>
                Choose Campaign Objective
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                {CAMPAIGN_GOALS.map((g) => (
                  <Chip
                    key={g.key}
                    label={g.label}
                    onClick={() => setGoal(g.key)}
                    color={goal === g.key ? 'primary' : 'default'}
                    variant={goal === g.key ? 'filled' : 'outlined'}
                    clickable
                    sx={{
                      fontWeight: 700,
                      borderRadius: 2,
                      py: 2,
                      px: 0.5,
                      fontSize: '0.82rem',
                    }}
                  />
                ))}
              </Stack>

              {/* Sector, Product, Tone Grid */}
              <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    fullWidth
                    label="Value Chain / Sector"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  >
                    {SECTOR_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Product Name / Spec"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Pure Kithul Treacle (SLS 772)"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    fullWidth
                    label="Voice & Tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  >
                    {TONE_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              {/* Campaign Key Offer / Brief */}
              <Stack spacing={2.5}>
                <TextField
                  label="Campaign Message / Key Commercial Offer"
                  placeholder="e.g. Announcing new certified organic batch with full traceability. Flexible MOQs and private label packaging ready for export."
                  value={emailIdea}
                  onChange={(e) => setEmailIdea(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                {emailError && <Alert severity="error">{emailError}</Alert>}

                <Button
                  variant="contained"
                  onClick={generateAiEmail}
                  disabled={loadingEmail}
                  startIcon={loadingEmail ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <AutoAwesomeIcon />}
                  sx={{
                    borderRadius: 2,
                    py: 1.3,
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    background: 'linear-gradient(135deg, #0284C7, #0EA5E9)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0369A1, #0284C7)',
                    },
                  }}
                >
                  {loadingEmail ? 'Crafting Commercial AI Draft…' : 'Generate AI Campaign Draft'}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Step 2: Review & Customize AI Draft */}
          {email && (
            <Card
              sx={{
                borderRadius: 3,
                border: mode === 'dark' ? '1px solid rgba(56,189,248,0.25)' : '1px solid #bae6fd',
                background: mode === 'dark' ? 'rgba(6,10,13,0.92)' : 'rgba(240,249,255,0.7)',
                backdropFilter: 'blur(18px)',
              }}
            >
              <CardContent sx={{ p: 3.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }} flexWrap="wrap" gap={1.5}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
                      Step 2: Review &amp; Refine Email Copy
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Fine-tune the subject line and body text. Recommended for B2B exporters and wholesale traders.
                    </Typography>
                  </Box>

                  <Button
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopyEmail}
                    variant={copied ? 'contained' : 'outlined'}
                    color={copied ? 'success' : 'primary'}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                  >
                    {copied ? 'Copied to Clipboard!' : 'Copy Email Text'}
                  </Button>
                </Stack>

                {/* Campaign Title & Subject Line */}
                <Grid container spacing={2} sx={{ mb: 2.5 }}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Internal Campaign Name"
                      fullWidth
                      value={campaignTitle}
                      onChange={(e) => setCampaignTitle(e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={8}>
                    <TextField
                      label={`Email Subject Line (${email.subject?.length || 0} chars)`}
                      fullWidth
                      value={email.subject}
                      onChange={(e) => setEmail({ ...email, subject: e.target.value })}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontWeight: 700 } }}
                    />
                  </Grid>
                </Grid>

                {/* Body Textarea */}
                <TextField
                  label="Email Body Content"
                  fullWidth
                  multiline
                  rows={10}
                  value={email.body}
                  onChange={(e) => setEmail({ ...email, body: e.target.value })}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontFamily: 'inherit',
                      fontSize: '0.92rem',
                      lineHeight: 1.6,
                    },
                  }}
                />

                {email.suggestedCallToAction && (
                  <Chip
                    size="small"
                    label={`Recommended CTA: ${email.suggestedCallToAction}`}
                    sx={{
                      fontWeight: 600,
                      background: mode === 'dark' ? 'rgba(56,189,248,0.1)' : '#e0f2fe',
                      color: mode === 'dark' ? '#87CEEB' : '#0369A1',
                    }}
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Audience Segmentation & Recipient Selector */}
          <Card
            sx={{
              borderRadius: 3,
              border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              background: mode === 'dark' ? 'rgba(6,10,13,0.85)' : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(18px)',
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }} flexWrap="wrap" gap={1.5}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
                    Step 3: Audience Segmentation &amp; Recipient Target
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose which export directory segments or retail customer groups will receive this broadcast.
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1.5}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={handleOpenPreview}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                  >
                    Preview Recipients
                  </Button>

                  {audienceTab === 0 ? (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={handleImportEdb}
                      disabled={importingEdb}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                    >
                      {importingEdb ? 'Syncing...' : 'Re-sync EDB Directory'}
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={seedSampleCustomers}
                      disabled={seedingCustomers}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                    >
                      {seedingCustomers ? 'Generating...' : 'Seed Sample Customers'}
                    </Button>
                  )}
                </Stack>
              </Stack>

              {importEdbMsg && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{importEdbMsg}</Alert>}
              {seedSuccessMsg && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{seedSuccessMsg}</Alert>}

              {/* Audience Tabs: B2B Exporters vs Retail Customers */}
              <Tabs
                value={audienceTab}
                onChange={(_, v) => setAudienceTab(v)}
                sx={{
                  mb: 2.5,
                  borderBottom: 1,
                  borderColor: 'divider',
                  '& .MuiTab-root': { fontWeight: 800, textTransform: 'none', fontSize: '0.92rem' },
                }}
              >
                <Tab icon={<PublicIcon />} iconPosition="start" label={`B2B Sri Lankan Exporters (${b2bGroups.reduce((acc, g) => acc + (g.recipientCount || 0), 0)})`} />
                <Tab icon={<GroupsIcon />} iconPosition="start" label={`Retail Customers & Leads (${retailGroups.reduce((acc, g) => acc + (g.recipientCount || 0), 0)})`} />
              </Tabs>

              {/* Select All Toggle Bar */}
              <Box
                sx={{
                  p: 1.5,
                  px: 2,
                  mb: 2,
                  borderRadius: 2,
                  background: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Button
                  size="small"
                  onClick={handleSelectAllInTab}
                  sx={{ textTransform: 'none', fontWeight: 700 }}
                >
                  {activeTabGroups.every((g) => selectedGroupKeys.includes(g.groupKey))
                    ? 'Deselect All in This Tab'
                    : 'Select All in This Tab'}
                </Button>

                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0284c7' }}>
                  Total Selected: {totalSelectedRecipients} recipient{totalSelectedRecipients === 1 ? '' : 's'}
                </Typography>
              </Box>

              {/* Recipient Groups List */}
              {loadingGroups ? (
                <CircularProgress size={24} sx={{ display: 'block', my: 3 }} />
              ) : activeTabGroups.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  {audienceTab === 0
                    ? 'No EDB exporter groups found. Click "Re-sync EDB Directory" above to load the official profiles.'
                    : 'No customer segments found for your business. Click "Seed Sample Customers" above to generate realistic local customer segments.'}
                </Alert>
              ) : (
                <Grid container spacing={2}>
                  {activeTabGroups.map((group) => {
                    const isChecked = selectedGroupKeys.includes(group.groupKey);
                    return (
                      <Grid item xs={12} sm={6} key={group.groupKey}>
                        <Paper
                          onClick={() => toggleGroupKey(group.groupKey)}
                          sx={{
                            p: 2,
                            borderRadius: 2.5,
                            cursor: 'pointer',
                            border: isChecked
                              ? '1.5px solid #0284c7'
                              : mode === 'dark'
                              ? '1px solid rgba(255,255,255,0.06)'
                              : '1px solid rgba(0,0,0,0.08)',
                            background: isChecked
                              ? mode === 'dark'
                                ? 'rgba(56,189,248,0.1)'
                                : '#f0f9ff'
                              : mode === 'dark'
                              ? 'rgba(0,0,0,0.2)'
                              : '#ffffff',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: '#0284c7',
                            },
                          }}
                        >
                          <Stack direction="row" spacing={1.5} alignItems="flex-start">
                            <Checkbox
                              checked={isChecked}
                              onChange={() => toggleGroupKey(group.groupKey)}
                              sx={{ p: 0.25 }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                  {group.name}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={`${group.recipientCount || 0} leads`}
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: '0.72rem',
                                    height: 22,
                                    background: isChecked ? '#0284c7' : undefined,
                                    color: isChecked ? '#ffffff' : undefined,
                                  }}
                                />
                              </Stack>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                {group.description}
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </CardContent>
          </Card>

          {/* Step 4: Dispatch & Simulation Studio */}
          <Card
            sx={{
              borderRadius: 3,
              border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              background: mode === 'dark' ? 'rgba(6,10,13,0.85)' : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(18px)',
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: theme.palette.text.primary }}>
                Step 4: Dispatch &amp; Simulation Studio
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Test your campaign safely or launch a full stochastic delivery simulation to measure expected open rates and commercial engagement.
              </Typography>

              {testSendSuccess && <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }}>{testSendSuccess}</Alert>}
              {testSendError && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{testSendError}</Alert>}

              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleTestSend}
                  disabled={testSending || simulating}
                  startIcon={testSending ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <MailIcon />}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    px: 3,
                    fontWeight: 800,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0369a1, #075985)',
                    },
                  }}
                >
                  {testSending
                    ? 'Dispatching to havindufonseka@gmail.com & havinduhesara21@gmail.com…'
                    : 'Send Live Test Email (to havindufonseka@gmail.com & havinduhesara21@gmail.com)'}
                </Button>

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSimulateCampaign}
                  disabled={simulating || testSending || !email || totalSelectedRecipients === 0}
                  startIcon={simulating ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <PlayArrowIcon />}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    px: 3.5,
                    fontWeight: 800,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669, #047857)',
                    },
                  }}
                >
                  {simulating
                    ? `Simulating Broadcast to ${totalSelectedRecipients} Recipients…`
                    : `Simulate Campaign Broadcast (${totalSelectedRecipients} Recipients)`}
                </Button>
              </Stack>

              {/* Progress Indicator */}
              {simulating && (
                <Box sx={{ my: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                    Simulating stochastic open and click distributions across selected exporter profiles…
                  </Typography>
                  <LinearProgress sx={{ borderRadius: 1.5, height: 8 }} />
                </Box>
              )}

              {/* Simulation Result Metric Cards */}
              {simulationResult && (
                <Box
                  sx={{
                    mt: 3,
                    p: 3,
                    borderRadius: 3,
                    background: mode === 'dark' ? 'rgba(16,185,129,0.08)' : '#f0fdf4',
                    border: '1px solid rgba(16,185,129,0.25)',
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <CheckCircleIcon sx={{ color: '#10b981' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
                      Campaign Simulation Results (#CAM-{simulationResult.campaignId})
                    </Typography>
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                          TOTAL RECIPIENTS
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5, color: '#0284c7' }}>
                          {simulationResult.totalRecipients}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">100% simulated</Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                          DELIVERED
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5, color: '#10b981' }}>
                          {simulationResult.deliveryRate}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{simulationResult.deliveredCount} delivered</Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                          OPEN RATE
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5, color: '#8b5cf6' }}>
                          {simulationResult.openRate}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{simulationResult.openedCount} opened</Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={6} sm={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                          CLICK RATE
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5, color: '#f59e0b' }}>
                          {simulationResult.clickRate}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{simulationResult.clickedCount} inquiry clicks</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Step 5: Campaign History & Analytics */}
          <Card
            sx={{
              borderRadius: 3,
              border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              background: mode === 'dark' ? 'rgba(6,10,13,0.85)' : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(18px)',
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }} flexWrap="wrap">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
                    Campaign History &amp; Engagement Logs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Review past campaign broadcasts, open telemetry, and recipient delivery status snapshots.
                  </Typography>
                </Box>

                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={loadCampaigns}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                >
                  Refresh History
                </Button>
              </Stack>

              {loadingCampaigns ? (
                <CircularProgress size={24} sx={{ display: 'block', my: 2 }} />
              ) : campaigns.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  No previous campaigns found. Generate and simulate a campaign above to view telemetry reports here.
                </Alert>
              ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ background: mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' }}>
                        <TableCell sx={{ fontWeight: 800 }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Title &amp; Goal</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Sector</TableCell>
                        <TableCell sx={{ fontWeight: 800 }} align="center">Recipients</TableCell>
                        <TableCell sx={{ fontWeight: 800 }} align="center">Delivered</TableCell>
                        <TableCell sx={{ fontWeight: 800 }} align="center">Open %</TableCell>
                        <TableCell sx={{ fontWeight: 800 }} align="center">Click %</TableCell>
                        <TableCell sx={{ fontWeight: 800 }} align="center">Status</TableCell>
                        <TableCell sx={{ fontWeight: 800 }} align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {campaigns.map((camp) => (
                        <TableRow key={camp.id} hover>
                          <TableCell sx={{ fontWeight: 700 }}>#{camp.id}</TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>
                              {camp.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {camp.subject?.substring(0, 40)}…
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip size="small" label={camp.targetSector || 'Agri'} sx={{ fontSize: '0.72rem', height: 22 }} />
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700 }}>{camp.totalRecipients}</TableCell>
                          <TableCell align="center">{camp.deliveredCount}</TableCell>
                          <TableCell align="center" sx={{ color: '#8b5cf6', fontWeight: 700 }}>
                            {camp.openRate ? `${camp.openRate}%` : '—'}
                          </TableCell>
                          <TableCell align="center" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                            {camp.clickRate ? `${camp.clickRate}%` : '—'}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              size="small"
                              label={camp.status}
                              color={camp.status === 'COMPLETED' ? 'success' : 'default'}
                              sx={{ fontWeight: 700, fontSize: '0.7rem', height: 22 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenCampaignDetails(camp)}
                              title="View Snapshot & Recipient Report"
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Container>

      {/* Recipient Preview Modal */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          EDB Registered Exporter Directory Preview
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2.5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Official registered Sri Lankan exporters with company details, districts, and mock-safe routing.
          </Typography>

          {previewLoading ? (
            <CircularProgress size={30} sx={{ display: 'block', mx: 'auto', my: 4 }} />
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Company Name</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Sector</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>District</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Mock Safe Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewRecipients.map((rec) => (
                    <TableRow key={rec.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{rec.companyName || rec.name}</TableCell>
                      <TableCell>
                        <Chip size="small" label={rec.sector} sx={{ fontSize: '0.7rem', height: 22 }} />
                      </TableCell>
                      <TableCell>{rec.district || 'Colombo'}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#0284c7' }}>
                        {rec.email}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPreviewOpen(false)} sx={{ fontWeight: 700 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Campaign Details & Recipient Snapshot Modal */}
      <Dialog
        open={historyDetailOpen}
        onClose={() => setHistoryDetailOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          Campaign Report: {selectedHistoryCampaign?.title}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedHistoryCampaign && (
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary' }}>
                  Subject Line
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800 }}>
                  {selectedHistoryCampaign.subject}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary' }}>
                  Email Message Body
                </Typography>
                <Paper
                  sx={{
                    p: 2,
                    mt: 0.5,
                    borderRadius: 2,
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.86rem',
                    background: mode === 'dark' ? 'rgba(0,0,0,0.3)' : '#f8fafc',
                    maxHeight: 180,
                    overflowY: 'auto',
                  }}
                >
                  {selectedHistoryCampaign.body}
                </Paper>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary', mb: 1, display: 'block' }}>
                  Recipient Delivery &amp; Open Telemetry ({historyRecipients.length} snapshots)
                </Typography>

                <TableContainer component={Paper} sx={{ borderRadius: 2, maxHeight: 220 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800 }}>Recipient / Company</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Opened At</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Clicked At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {historyRecipients.map((hr) => (
                        <TableRow key={hr.id}>
                          <TableCell sx={{ fontWeight: 600 }}>{hr.companyName || hr.recipientName}</TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={hr.status}
                              color={
                                hr.status === 'CLICKED'
                                  ? 'warning'
                                  : hr.status === 'OPENED'
                                  ? 'secondary'
                                  : hr.status === 'DELIVERED'
                                  ? 'success'
                                  : 'default'
                              }
                              sx={{ fontSize: '0.7rem', height: 22, fontWeight: 700 }}
                            />
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.78rem' }}>{hr.openedAt ? hr.openedAt.substring(11, 16) : '—'}</TableCell>
                          <TableCell sx={{ fontSize: '0.78rem' }}>{hr.clickedAt ? hr.clickedAt.substring(11, 16) : '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setHistoryDetailOpen(false)} sx={{ fontWeight: 700 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
