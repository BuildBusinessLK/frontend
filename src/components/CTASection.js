import React from 'react';
import { Box, Container, Typography, Button, Stack, Chip } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useThemeMode } from '../contexts/ThemeContext';

const perks = ['Free trial — no credit card required', 'Cancel anytime, no lock-in', 'Sinhala language support coming soon'];

export default function CTASection() {
  const { mode } = useThemeMode();
  
  return (
    <Box sx={{ 
      py: { xs: 10, md: 14 }, 
      background: mode === 'dark' ? '#060A0D' : 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)', 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      <Box sx={{ 
        position: 'absolute', 
        inset: 0, 
        background: mode === 'dark'
          ? 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(34,197,94,0.09) 0%, transparent 70%)'
          : 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,107,53,0.08) 0%, transparent 70%)', 
        pointerEvents: 'none' 
      }} />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ 
          textAlign: 'center', 
          background: mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#FFFFFF', 
          border: mode === 'dark' ? '1px solid rgba(34,197,94,0.15)' : '1px solid rgba(255,107,53,0.15)', 
          borderRadius: '32px', 
          p: { xs: 5, md: 8 }, 
          backdropFilter: 'blur(20px)', 
          position: 'relative', 
          overflow: 'hidden',
          boxShadow: mode === 'dark' ? 'none' : '0 8px 32px rgba(0,0,0,0.06)'
        }}>
          <Box sx={{ 
            position: 'absolute', 
            top: '-60%', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            width: '60%', 
            height: '100%', 
            background: mode === 'dark'
              ? 'radial-gradient(ellipse, rgba(34,197,94,0.12) 0%, transparent 70%)'
              : 'radial-gradient(ellipse, rgba(255,107,53,0.08) 0%, transparent 70%)', 
            pointerEvents: 'none' 
          }} />

          <Chip 
            label="Join the Movement" 
            sx={{ 
              background: mode === 'dark' ? 'rgba(34,197,94,0.1)' : 'rgba(255,107,53,0.1)', 
              border: mode === 'dark' ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,107,53,0.25)', 
              color: mode === 'dark' ? '#4ADE80' : '#FF6B35', 
              fontWeight: 600, 
              fontSize: '0.75rem', 
              mb: 3 
            }} 
          />

          <Typography variant="h2" sx={{ fontSize: { xs: '1.9rem', md: '2.8rem' }, color: mode === 'dark' ? '#fff' : '#111827', mb: 2, position: 'relative' }}>
            Ready to Grow Your<br />
            <Box component="span" sx={{ background: mode === 'dark' ? 'linear-gradient(90deg, #22C55E, #86EFAC)' : 'linear-gradient(90deg, #FF6B35, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Traditional Business?
            </Box>
          </Typography>

          <Typography variant="body1" sx={{ color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(17,24,39,0.7)', maxWidth: 420, mx: 'auto', lineHeight: 1.75, mb: 4, fontSize: '1.05rem' }}>
            Join Sri Lankan entrepreneurs in the Coconut, Kithul, and Palmyra industries already using AI to make smarter business decisions.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 4 }}>
            {perks.map((p) => (
              <Box key={p} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, justifyContent: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 16, color: mode === 'dark' ? '#22C55E' : '#FF6B35' }} />
                <Typography variant="caption" sx={{ color: mode === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(17,24,39,0.6)', fontSize: '0.8rem' }}>{p}</Typography>
              </Box>
            ))}
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />}
              sx={{ 
                background: mode === 'dark' 
                  ? 'linear-gradient(135deg, #22C55E, #16A34A)' 
                  : 'linear-gradient(135deg, #FF6B35, #F59E0B)', 
                boxShadow: mode === 'dark'
                  ? '0 8px 32px rgba(34,197,94,0.4)'
                  : '0 8px 32px rgba(255,107,53,0.4)', 
                py: 1.7, 
                px: 4, 
                fontSize: '1rem', 
                color: '#fff', 
                fontWeight: 700,
                '&:hover': { 
                  background: mode === 'dark'
                    ? 'linear-gradient(135deg, #4ADE80, #22C55E)'
                    : 'linear-gradient(135deg, #F59E0B, #D97706)', 
                  boxShadow: mode === 'dark'
                    ? '0 12px 40px rgba(34,197,94,0.55)'
                    : '0 12px 40px rgba(255,107,53,0.55)', 
                  transform: 'translateY(-2px)' 
                }, 
                transition: 'all 0.25s ease' 
              }}>
              Start Free Trial
            </Button>
            <Button variant="outlined" size="large"
              sx={{ 
                borderColor: mode === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(17,24,39,0.2)', 
                color: mode === 'dark' ? 'rgba(255,255,255,0.75)' : 'rgba(17,24,39,0.8)', 
                py: 1.7, 
                px: 4, 
                fontSize: '1rem',
                '&:hover': { 
                  borderColor: mode === 'dark' ? 'rgba(34,197,94,0.45)' : 'rgba(255,107,53,0.45)', 
                  background: mode === 'dark' ? 'rgba(34,197,94,0.07)' : 'rgba(255,107,53,0.07)', 
                  color: mode === 'dark' ? '#4ADE80' : '#FF6B35' 
                }, 
                transition: 'all 0.25s ease' 
              }}>
              View Pricing Plans
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
