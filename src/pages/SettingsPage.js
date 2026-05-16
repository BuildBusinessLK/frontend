import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import TranslateIcon from '@mui/icons-material/Translate';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { useThemeMode } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useChatPageTopPadding } from '../hooks/useDashboardLayoutPadding';
import ProfileDialog from '../components/ProfileDialog';
import { ROUTES } from '../constants/routes';

export default function SettingsPage() {
  const topPad = useChatPageTopPadding();
  const [profileOpen, setProfileOpen] = useState(false);
  const { mode, toggleTheme } = useThemeMode();
  const { language, toggleLanguage } = useLanguage();

  return (
    <Box sx={{ ...topPad, maxWidth: 600 }}>
      <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 3 }}>
        Settings
      </Typography>

      <Stack spacing={2.5}>
        {/* Account */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography
              variant="overline"
              sx={{ letterSpacing: '0.15em', color: 'text.secondary', fontWeight: 700 }}
            >
              Account
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mt: 0.5, mb: 2 }}>
              Profile & Personal Details
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AccountCircleRoundedIcon />}
              onClick={() => setProfileOpen(true)}
              sx={{ borderRadius: 2 }}
            >
              Edit profile
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography
              variant="overline"
              sx={{ letterSpacing: '0.15em', color: 'text.secondary', fontWeight: 700 }}
            >
              Appearance
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mt: 0.5, mb: 0.5 }}>
              Theme & Language
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Current: <strong>{mode === 'dark' ? 'Dark' : 'Light'} mode</strong> ·{' '}
              <strong>{language || 'English'}</strong>
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                startIcon={mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
                onClick={toggleTheme}
                sx={{ borderRadius: 2 }}
              >
                {mode === 'dark' ? 'Light mode' : 'Dark mode'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<TranslateIcon />}
                onClick={toggleLanguage}
                sx={{ borderRadius: 2 }}
              >
                Toggle language
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Divider />

        <Button
          component={RouterLink}
          to={ROUTES.dashboard}
          variant="text"
          sx={{ alignSelf: 'flex-start', borderRadius: 2 }}
        >
          ← Back to dashboard
        </Button>
      </Stack>

      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
    </Box>
  );
}
