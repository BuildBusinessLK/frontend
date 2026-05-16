import React, { useState } from 'react';
import { useThemeMode } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function SettingsPage() {
  const topPad = useChatPageTopPadding();
  const [profileOpen, setProfileOpen] = useState(false);
  const { mode, toggleTheme } = useThemeMode();
  const { language, toggleLanguage } = useLanguage();

  return (
    <Box sx={{ ...topPad, maxWidth: 640 }}>
      <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 2 }}>
        Settings
      </Typography>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={800}>
              Account
            </Typography>
            <Button variant="outlined" onClick={() => setProfileOpen(true)} sx={{ alignSelf: 'flex-start', borderRadius: 2 }}>
              Edit profile
            </Button>
            <Typography variant="subtitle1" fontWeight={800}>
              Appearance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Theme: {mode} · Language: {language}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={toggleTheme} sx={{ borderRadius: 2 }}>
                Toggle theme
              </Button>
              <Button variant="outlined" onClick={toggleLanguage} sx={{ borderRadius: 2 }}>
                Toggle language
              </Button>
            </Stack>
            <Button component={RouterLink} to={ROUTES.dashboard} variant="text" sx={{ alignSelf: 'flex-start' }}>
              Back to dashboard
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
    </Box>
  );
}
