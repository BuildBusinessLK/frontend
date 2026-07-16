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
  Chip,
  Paper,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import { useThemeMode } from '../contexts/ThemeContext';
import { useMarketingPageTopPadding } from '../hooks/useDashboardLayoutPadding';
import axios from 'axios';
import { authHeaders } from '../services/authApi';

const API_BASE_URL = process.env.REACT_APP_SPRING_BACKEND_BASE_URL || 'http://localhost:8083';

const getApiErrorMessage = (error, fallbackMessage) => {
  if (error.response?.data?.error) return error.response.data.error;
  if (error.code === 'ERR_NETWORK') {
    return `Cannot reach backend at ${API_BASE_URL}. Check server URL, CORS, and that backend is running.`;
  }
  return fallbackMessage;
};

export default function EmailPage() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const pagePt = useMarketingPageTopPadding();
  
  // Email generation state
  const [emailIdea, setEmailIdea] = useState('');
  const [email, setEmail] = useState(null);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  // Email sending state
  const [recipientGroups, setRecipientGroups] = useState([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendSuccess, setSendSuccess] = useState('');
  const [sendError, setSendError] = useState('');
  
  // Copy state
  const [copied, setCopied] = useState(false);

  // Seeding state
  const [seedingCustomers, setSeedingCustomers] = useState(false);
  const [seedSuccessMsg, setSeedSuccessMsg] = useState('');

  const seedSampleCustomers = async () => {
    setSeedingCustomers(true);
    setSeedSuccessMsg('');
    setSendError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/customers/seed`, {}, { headers: authHeaders() });
      setSeedSuccessMsg(`Generated ${res.data.count} realistic customers matching your ${res.data.sector} sector!`);
      setLoadingGroups(true);
      const groupsRes = await axios.get(`${API_BASE_URL}/email-recipient-groups`, { headers: authHeaders() });
      setRecipientGroups(groupsRes.data || []);
    } catch (error) {
      setSendError(getApiErrorMessage(error, 'Could not seed sample customers. Please fill in your Business Profile first.'));
    } finally {
      setSeedingCustomers(false);
      setLoadingGroups(false);
    }
  };

  useEffect(() => {
    const loadRecipientGroups = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/email-recipient-groups`, { headers: authHeaders() });
        setRecipientGroups(res.data || []);
      } catch (error) {
        setSendError(getApiErrorMessage(error, 'Could not load recipient groups.'));
      } finally {
        setLoadingGroups(false);
      }
    };
    loadRecipientGroups();
  }, []);

  const toggleGroup = (groupId) => {
    setSelectedGroupIds((current) => (
      current.includes(groupId) ? current.filter((id) => id !== groupId) : [...current, groupId]
    ));
  };

  const generateEmail = async () => {
    if (!emailIdea.trim()) {
      setEmailError('Please enter an email idea');
      return;
    }

    setLoadingEmail(true);
    setEmailError('');
    setEmail(null);

    try {
      const res = await axios.post(`${API_BASE_URL}/generate-email`, {
        idea: emailIdea,
      }, { headers: authHeaders() });

      setEmail(res.data.email || { subject: res.data.subject, body: res.data.body });
      setEmailError('');
    } catch (error) {
      console.error('Email generation error:', error);
      setEmailError(getApiErrorMessage(error, `Failed to generate email from ${API_BASE_URL}`));
    } finally {
      setLoadingEmail(false);
    }
  };

  const sendEmails = async () => {
    if (selectedGroupIds.length === 0) {
      setSendError('Please select at least one recipient group');
      return;
    }

    if (!email) {
      setSendError('Please generate an email first');
      return;
    }

    setSendingEmail(true);
    setSendError('');
    setSendSuccess('');

    try {
      const res = await axios.post(`${API_BASE_URL}/send-email`, {
        groupIds: selectedGroupIds,
        subject: email.subject,
        body: email.body,
      }, { headers: authHeaders() });

      setSelectedGroupIds([]);
      setSendSuccess(`Emails sent successfully to ${res.data.count} recipient(s).`);
      setEmail(null);
      setEmailIdea('');
    } catch (error) {
      console.error('Email sending error:', error);
      setSendError(getApiErrorMessage(error, 'Failed to send emails. Check backend configuration.'));
    } finally {
      setSendingEmail(false);
    }
  };

  const handleCopyEmail = () => {
    if (email) {
      const fullEmail = `Subject: ${email.subject}\n\n${email.body}`;
      navigator.clipboard.writeText(fullEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
            ? 'radial-gradient(circle at top, rgba(56,189,248,0.14), transparent 38%), linear-gradient(180deg, #060A0D 0%, #10151B 100%)'
            : 'linear-gradient(180deg, #F0F9FF 0%, #F7FAF8 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4} sx={{ py: 4 }}>
          {/* Header */}
          <Box>
            <Chip
              label="Email Marketing"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: mode === 'dark' ? '#87CEEB' : '#0369A1',
                background: mode === 'dark' ? 'rgba(56,189,248,0.12)' : 'rgba(56,189,248,0.1)',
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
              AI Email Generator
            </Typography>
            <Typography sx={{ maxWidth: 720, color: theme.palette.text.secondary }}>
              Generate personalized emails and send them to your customers with AI assistance.
            </Typography>
          </Box>

          {/* Generation Section */}
          <Card
            sx={{
              borderRadius: 3,
              border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              background: mode === 'dark' ? 'rgba(6,10,13,0.78)' : 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(18px)',
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5, color: theme.palette.text.primary }}>
                Generate Email
              </Typography>
              <Stack spacing={2.5}>
                <TextField
                  label="Email Idea or Purpose"
                  placeholder="e.g., Welcome new customers to our service"
                  value={emailIdea}
                  onChange={(e) => setEmailIdea(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                
                {emailError && (
                  <Alert severity="error">{emailError}</Alert>
                )}

                <Button
                  variant="contained"
                  onClick={generateEmail}
                  disabled={loadingEmail}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #22D3EE, #06B6D4)',
                    },
                  }}
                >
                  {loadingEmail ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Generating...
                    </>
                  ) : (
                    'Generate Email'
                  )}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Generated Email Display */}
          {email && (
            <Card
              sx={{
                borderRadius: 3,
                border: mode === 'dark' ? '1px solid rgba(56,189,248,0.2)' : '1px solid rgba(56,189,248,0.2)',
                background: mode === 'dark' ? 'rgba(6,10,13,0.9)' : 'rgba(240,249,255,0.8)',
                backdropFilter: 'blur(18px)',
              }}
            >
              <CardContent sx={{ p: 3.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
                    Generated Email
                  </Typography>
                  <Button
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopyEmail}
                    variant={copied ? 'contained' : 'outlined'}
                    sx={{ borderRadius: 2 }}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </Stack>

                {/* Subject */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      letterSpacing: '0.2em',
                      color: theme.palette.text.secondary,
                      fontWeight: 700,
                    }}
                  >
                    Subject
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)',
                      border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                      color: theme.palette.text.primary,
                    }}
                  >
                    {email.subject}
                  </Paper>
                </Box>

                {/* Body */}
                <Box>
                  <Typography
                    variant="overline"
                    sx={{
                      letterSpacing: '0.2em',
                      color: theme.palette.text.secondary,
                      fontWeight: 700,
                    }}
                  >
                    Body
                  </Typography>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)',
                      border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      color: theme.palette.text.primary,
                      overflowX: 'auto',
                      maxHeight: 400,
                      overflow: 'auto',
                    }}
                  >
                    {email.body}
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Send Email Section */}
          {email && (
            <Card
              sx={{
                borderRadius: 3,
                border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                background: mode === 'dark' ? 'rgba(6,10,13,0.78)' : 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(18px)',
              }}
            >
              <CardContent sx={{ p: 3.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5, color: theme.palette.text.primary }}>
                  Send Email
                </Typography>
                <Stack spacing={2.5}>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                          Choose recipient groups
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Select one or more recipient groups for bulk email delivery.
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        onClick={seedSampleCustomers}
                        disabled={seedingCustomers}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 700,
                          border: mode === 'dark' ? '1px solid rgba(56,189,248,0.3)' : '1px solid rgba(3,105,161,0.3)',
                          color: mode === 'dark' ? '#87CEEB' : '#0369A1',
                          '&:hover': {
                            background: mode === 'dark' ? 'rgba(56,189,248,0.08)' : 'rgba(3,105,161,0.05)',
                          }
                        }}
                      >
                        {seedingCustomers ? (
                          <>
                            <CircularProgress size={14} sx={{ mr: 1 }} />
                            Generating...
                          </>
                        ) : 'Generate Sample Customers'}
                      </Button>
                    </Stack>

                    {seedSuccessMsg && (
                      <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{seedSuccessMsg}</Alert>
                    )}

                    {loadingGroups ? (
                      <CircularProgress size={22} sx={{ display: 'block', mt: 2 }} />
                    ) : recipientGroups.length === 0 ? (
                      <Box sx={{ mt: 1.5 }}>
                        <Alert severity="info" sx={{ borderRadius: 2 }}>
                          No customer groups are available. Click <strong>Generate Sample Customers</strong> above to instantly populate the database with realistic customer segments matching your business profile!
                        </Alert>
                      </Box>
                    ) : (
                      <FormGroup sx={{ mt: 1.25 }}>
                        {recipientGroups.map((group) => (
                          <FormControlLabel
                            key={group.id}
                            control={<Checkbox checked={selectedGroupIds.includes(group.id)} onChange={() => toggleGroup(group.id)} />}
                            label={`${group.label} (${group.recipientCount} recipient${group.recipientCount === 1 ? '' : 's'})`}
                          />
                        ))}
                      </FormGroup>
                    )}
                  </Box>

                  {sendError && (
                    <Alert severity="error">{sendError}</Alert>
                  )}

                  {sendSuccess && (
                    <Alert severity="success">{sendSuccess}</Alert>
                  )}

                  <Button
                    variant="contained"
                    onClick={sendEmails}
                    disabled={sendingEmail || !email}
                    startIcon={<SendIcon />}
                    sx={{
                      borderRadius: 2,
                      py: 1.2,
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669, #047857)',
                      },
                    }}
                  >
                    {sendingEmail ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Sending...
                      </>
                    ) : (
                      'Send Email'
                    )}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
