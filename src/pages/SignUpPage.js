import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, Navigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LanguageIcon from '@mui/icons-material/Language';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import CloseIcon from '@mui/icons-material/Close';
import { useThemeMode } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { apiVerifyOtp, apiResendOtp } from '../services/authApi';
import { gradients, getThemeColors, shadows, brand } from '../theme';

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function SignUpPage() {
  const { mode, toggleTheme } = useThemeMode();
  const { language, toggleLanguage } = useLanguage();
  const { signUp, googleSignIn, user } = useAuth();
  const navigate = useNavigate();
  const colors = getThemeColors(mode);

  const GOOGLE_CLIENT_ID =
    process.env.REACT_APP_GOOGLE_CLIENT_ID ||
    '558034937251-f6ii8p6fb0iar9gmkm9rqdic27mesas1.apps.googleusercontent.com';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const scriptId = 'google-gsi-client';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Verification Modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');

  if (user && !showOtpModal) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const n = name.trim();
    const em = email.trim();
    if (!n) {
      setError('Enter your full name.');
      return;
    }
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signUp(n, em, password);
      // Registration complete, show OTP modal
      setShowOtpModal(true);
    } catch (err) {
      setError(err.message || 'Could not create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setError('');

    // Method 1: Google OAuth2 popup token client (Recommended for custom buttons, avoids FedCM restrictions)
    if (window.google?.accounts?.oauth2) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse?.access_token) {
              setLoading(true);
              try {
                await googleSignIn(tokenResponse.access_token, true);
                navigate('/dashboard', { replace: true });
              } catch (err) {
                setError(err.message || 'Google authentication failed.');
              } finally {
                setLoading(false);
              }
            } else if (tokenResponse?.error) {
              setError(tokenResponse.error_description || 'Google sign-up was cancelled.');
            }
          },
        });
        tokenClient.requestAccessToken({ prompt: 'consent' });
        return;
      } catch (err) {
        console.warn('OAuth2 token client failed, falling back to ID prompt:', err);
      }
    }

    // Method 2: Google ID One-Tap fallback with FedCM flag disabled
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          use_fedcm_for_prompt: false,
          callback: async (res) => {
            if (res?.credential) {
              setLoading(true);
              try {
                await googleSignIn(res.credential, true);
                navigate('/dashboard', { replace: true });
              } catch (err) {
                setError(err.message || 'Google authentication failed.');
              } finally {
                setLoading(false);
              }
            }
          },
        });
        window.google.accounts.id.prompt();
        return;
      } catch (err) {
        console.warn('Google ID prompt error:', err);
      }
    }

    setError('Google authentication is still loading. Please click again in a moment.');
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpValue.trim()) {
      setOtpError('Enter the 6-digit verification code.');
      return;
    }
    setOtpLoading(true);
    setOtpError('');
    try {
      await apiVerifyOtp(email, otpValue);
      setShowOtpModal(false);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setOtpError(err.message || 'Invalid verification code.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpLoading(true);
    setOtpError('');
    setOtpSuccessMsg('');
    try {
      const res = await apiResendOtp(email);
      setOtpSuccessMsg(res.message || 'New verification code sent to your email.');
    } catch (err) {
      setOtpError(err.message || 'Failed to resend code.');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 80px)',
        pt: { xs: 10, md: 12 },
        pb: 8,
        background:
          mode === 'dark'
            ? 'radial-gradient(ellipse 120% 90% at -10% -15%, rgba(34,197,94,0.32), transparent 45%), linear-gradient(185deg, #05090E 0%, #081418 100%)'
            : 'linear-gradient(185deg, #EFFBF5 0%, #FFFDF8 55%, #FFFFFF 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Stack direction={{ md: 'row-reverse' }} spacing={{ xs: 4, md: 6 }} alignItems="stretch">
          <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'center', pl: 4 }}>
            <Typography variant="overline" sx={{ letterSpacing: '0.28em', fontWeight: 700, color: colors.text.tertiary }}>
              Grow sustainably
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mt: 1.5, mb: 2, lineHeight: 1.1 }}>
              Built for Sri Lanka's{' '}
              <Box component="span" sx={{ background: gradients.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Rural Innovators
              </Box>
            </Typography>
            <Typography sx={{ color: colors.text.secondary, lineHeight: 1.75, maxWidth: 440 }}>
              Join BuildBusinessLK to unlock AI-powered business guidance, export insights, marketing support, and personalized recommendations for Coconut, Kithul, and Palmyrah enterprises.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              {[brand.green.primary, brand.amber.primary, brand.blue.primary].map((c) => (
                <Box key={c} sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: c, boxShadow: `0 0 16px ${c}66` }} />
              ))}
            </Stack>
          </Box>

          <Paper
            elevation={0}
            sx={{
              flex: 1,
              maxWidth: { md: 480 },
              mx: { xs: 'auto', md: 0 },
              width: '100%',
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              border: `1px solid ${colors.border.primary}`,
              background: mode === 'dark' ? '#111827' : 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(20px)',
              boxShadow: mode === 'dark' ? '0 28px 70px rgba(0,0,0,0.6)' : shadows.light.lg,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '14px',
                    background: gradients.green,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: shadows.colored.green,
                  }}
                >
                  <AutoAwesomeRoundedIcon sx={{ color: '#fff' }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 900, letterSpacing: '-0.03em' }}>Create An Account</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Coconut • Kithul • Palmyrah
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
                  <IconButton onClick={toggleTheme} size="small" sx={{ color: colors.text.secondary }}>
                    {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
                  </IconButton>
                </Tooltip>
                <Tooltip title={language === 'en' ? 'සිංහල' : 'English'}>
                  <IconButton onClick={toggleLanguage} size="small" sx={{ color: colors.text.secondary }}>
                    <LanguageIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>

            {/* Google Sign Up */}
            <Button
              variant="outlined"
              fullWidth
              onClick={handleGoogleSignUp}
              startIcon={<GoogleIcon />}
              sx={{
                py: 1.2,
                mt: 1,
                mb: 2.5,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                color: mode === 'dark' ? '#f3f4f6' : '#1f2937',
                borderColor: mode === 'dark' ? 'rgba(255,255,255,0.18)' : '#e5e7eb',
                background: mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#ffffff',
                '&:hover': {
                  borderColor: mode === 'dark' ? 'rgba(255,255,255,0.35)' : '#d1d5db',
                  background: mode === 'dark' ? 'rgba(255,255,200,0.06)' : '#f9fafb',
                },
              }}
            >
              Sign up with Google
            </Button>

            <Divider sx={{ borderColor: colors.border.secondary, mb: 2.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', px: 1 }}>
                or register with email
              </Typography>
            </Divider>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2.25}>
                <TextField
                  label="Full name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  helperText="Minimum 8 characters."
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPw((s) => !s)} edge="end" aria-label="toggle password">
                          {showPw ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Alert
                  icon={<MarkEmailReadIcon fontSize="inherit" />}
                  severity="info"
                  sx={{
                    py: 0.5,
                    px: 1.5,
                    fontSize: '0.8rem',
                    borderRadius: 2,
                    backgroundColor: mode === 'dark' ? 'rgba(14,165,233,0.12)' : '#f0f9ff',
                    borderColor: mode === 'dark' ? 'rgba(14,165,233,0.3)' : '#bae6fd',
                    color: mode === 'dark' ? '#bae6fd' : '#0369a1',
                  }}
                >
                  Verification instructions and account status updates will be sent to your email.
                </Alert>

                {error && (
                  <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>
                    {error}
                  </Typography>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 1,
                    py: 1.4,
                    fontWeight: 800,
                    borderRadius: 50,
                    background: gradients.green,
                    boxShadow: shadows.colored.green,
                    '&:hover': {
                      background: gradients.greenAlt,
                      boxShadow: shadows.colored.greenHover,
                    },
                  }}
                >
                  {loading ? 'Creating account…' : 'Sign up'}
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
              Already have access?{' '}
              <Link component={RouterLink} to="/sign-in" fontWeight={700} underline="hover">
                Sign in
              </Link>
            </Typography>
          </Paper>
        </Stack>
      </Container>

      {/* Email OTP Verification Modal */}
      <Dialog
        open={showOtpModal}
        onClose={() => {}}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            backgroundColor: mode === 'dark' ? '#111827' : '#ffffff',
            backgroundImage: 'none',
            border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65)',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={800}>Verify Your Email</Typography>
          <IconButton size="small" onClick={() => navigate('/dashboard')} disabled={otpLoading}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: colors.border.secondary }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            We dispatched a 6-digit verification code to <strong>{email}</strong>. Enter it below to activate all features.
          </Typography>
          {otpSuccessMsg && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {otpSuccessMsg}
            </Alert>
          )}
          {otpError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {otpError}
            </Alert>
          )}
          <TextField
            label="6-Digit Verification Code"
            fullWidth
            autoFocus
            value={otpValue}
            onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
            disabled={otpLoading}
            placeholder="123456"
            inputProps={{ style: { letterSpacing: '0.25em', fontSize: '1.2rem', textAlign: 'center' } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
          <Button onClick={handleResendOtp} disabled={otpLoading} size="small" sx={{ textTransform: 'none' }}>
            Resend Code
          </Button>
          <Button
            variant="contained"
            onClick={handleVerifyOtp}
            disabled={otpLoading || otpValue.length < 6}
            sx={{
              background: gradients.green,
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            {otpLoading ? <CircularProgress size={20} color="inherit" /> : 'Verify Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
