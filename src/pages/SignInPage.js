import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate, Navigate } from 'react-router-dom';
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

export default function SignInPage() {
  const { mode, toggleTheme } = useThemeMode();
  const { language, toggleLanguage } = useLanguage();
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const colors = getThemeColors(mode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const fromRaw = location.state?.from;
  const redirectTo =
    typeof fromRaw === 'string' && fromRaw.startsWith('/') ? fromRaw : '/dashboard';

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const em = email.trim();
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setError('Enter a valid email.');
      return;
    }
    if (!password.trim()) {
      setError('Password is required.');
      return;
    }
    setError('');
    signIn(em, password);
    navigate(redirectTo, { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 80px)',
        pt: { xs: 10, md: 12 },
        pb: 8,
        background:
          mode === 'dark'
            ? 'radial-gradient(ellipse 120% 90% at 70% -25%, rgba(255,107,53,0.22), transparent 52%), linear-gradient(180deg, #050A0D 0%, #070F12 100%)'
            : 'linear-gradient(185deg, #FFF7ED 0%, #F4FAF6 45%, #FFFFFF 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Stack direction={{ md: 'row' }} spacing={{ xs: 4, md: 6 }} alignItems="stretch">
          <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'center', pr: 4 }}>
            <Typography variant="overline" sx={{ letterSpacing: '0.28em', fontWeight: 700, color: colors.text.tertiary }}>
              BuildBusinessLK
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mt: 1.5, mb: 2, lineHeight: 1.1 }}>
              Continue your{' '}
              <Box component="span" sx={{ background: gradients.green, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SME growth journey
              </Box>
            </Typography>
            <Typography sx={{ color: colors.text.secondary, lineHeight: 1.75, maxWidth: 420 }}>
              Sign in to reach the workspace: AI agent on the /ask engine, marketing workflows, and analytics aligned with coconut, kithul, and palmyra value chains.
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
              background: mode === 'dark' ? alpha.white['04'] : 'rgba(255,255,255,0.94)',
              backdropFilter: 'blur(20px)',
              boxShadow: mode === 'dark' ? '0 28px 70px rgba(0,0,0,0.45)' : shadows.light.lg,
              position: 'relative',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '14px',
                    background: gradients.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: shadows.colored.amber,
                  }}
                >
                  <AutoAwesomeRoundedIcon sx={{ color: '#fff' }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 900, letterSpacing: '-0.03em' }}>Welcome back</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Access your dashboard
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
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
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
                  sx={{
                    mt: 1,
                    py: 1.4,
                    fontWeight: 800,
                    borderRadius: 50,
                    background: gradients.primary,
                    boxShadow: shadows.colored.amber,
                    '&:hover': {
                      background: gradients.warm,
                      boxShadow: shadows.colored.amberHover,
                    },
                  }}
                >
                  Sign in
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
              New here?{' '}
              <Link component={RouterLink} to="/sign-up" fontWeight={700} underline="hover">
                Create an account
              </Link>
            </Typography>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
