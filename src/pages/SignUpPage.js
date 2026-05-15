import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, Navigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
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
import { useThemeMode } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { gradients, getThemeColors, shadows, alpha, brand } from '../theme';

export default function SignUpPage() {
  const { mode, toggleTheme } = useThemeMode();
  const { language, toggleLanguage } = useLanguage();
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const colors = getThemeColors(mode);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const n = name.trim();
    const em = email.trim();
    if (!n) {
      setError('Enter your name.');
      return;
    }
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setError('Enter a valid email.');
      return;
    }
    if (password.length < 8) {
      setError('Use at least 8 characters for your password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signUp(n, em, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Could not create account.');
    } finally {
      setLoading(false);
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
              Built around Sri Lanka{' '}
              <Box component="span" sx={{ background: gradients.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                rural innovators
              </Box>
            </Typography>
            <Typography sx={{ color: colors.text.secondary, lineHeight: 1.75, maxWidth: 440 }}>
              Coconut · Kithul · Palmyra-first dashboards combine conversational coaching (/ask), focused campaigns, and analytics placeholders tuned for SME rollout timelines your consortium pitched on timeline phases four-six.
            </Typography>
            <Stack direction="row" spacing={3} sx={{ mt: 5 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: brand.green.light }}>
                  / ask
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.muted }}>
                  Spring → Python
                </Typography>
              </Box>
              <Box sx={{ width: 1, bgcolor: colors.border.primary }} />
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  30 wk
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.muted }}>
                  Pilot horizon
                </Typography>
              </Box>
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
              background: mode === 'dark' ? alpha.white['04'] : 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(20px)',
              boxShadow: mode === 'dark' ? '0 28px 70px rgba(0,0,0,0.45)' : shadows.light.lg,
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
                  <Typography sx={{ fontWeight: 900, letterSpacing: '-0.03em' }}>Create workspace</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Secure account · Spring Boot + MySQL
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

            <Divider sx={{ borderColor: colors.border.secondary, mb: 3 }} />

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
                  {loading ? 'Creating account…' : 'Sign up & enter workspace'}
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
    </Box>
  );
}
