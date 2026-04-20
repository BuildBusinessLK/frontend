import React from 'react';
import { Box, Container, Typography, Grid, Chip, Avatar } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import StarIcon from '@mui/icons-material/Star';
import { useThemeMode } from '../contexts/ThemeContext';

const testimonials = [
  {
    name: 'Suresh Rajapaksa',
    role: 'Coconut Oil Producer, Kurunegala',
    initials: 'SR',
    quote: 'The AI showed me exactly which export markets to target and the best pricing for my virgin coconut oil. My income increased by 35% in just two months.',
    color: '#22C55E',
    industry: 'Coconut',
  },
  {
    name: 'Anoji Perera',
    role: 'Kithul Treacle Maker, Kandy',
    initials: 'AP',
    quote: 'I never knew how to use social media for my business. Now the AI creates posts for me automatically. My WhatsApp orders have tripled since I started.',
    color: '#F59E0B',
    industry: 'Kithul',
  },
  {
    name: 'Varathan Selvam',
    role: 'Palmyra Products, Jaffna',
    initials: 'VS',
    quote: 'The market insights from PDB data helped me understand demand patterns. I now know when to produce more and when to diversify. This platform is a game changer.',
    color: '#38BDF8',
    industry: 'Palmyra',
  },
];

export default function Testimonials() {
  const { mode } = useThemeMode();
  
  return (
    <Box sx={{ 
      py: { xs: 10, md: 13 }, 
      background: mode === 'dark' 
        ? 'linear-gradient(180deg, #060A0D 0%, #081410 100%)' 
        : 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)', 
      overflow: 'hidden', 
      position: 'relative' 
    }}>
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 7, md: 9 } }}>
          <Chip 
            label="Success Stories" 
            sx={{ 
              background: mode === 'dark' ? 'rgba(245,158,11,0.1)' : 'rgba(255,107,53,0.1)', 
              border: mode === 'dark' ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(255,107,53,0.25)', 
              color: mode === 'dark' ? '#FCD34D' : '#FF6B35', 
              fontWeight: 600, 
              fontSize: '0.75rem', 
              mb: 2.5 
            }} 
          />
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, color: mode === 'dark' ? '#fff' : '#111827', mb: 2 }}>
            Real Entrepreneurs.{' '}
            <Box component="span" sx={{ background: 'linear-gradient(90deg, #FF6B35, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Real Growth.</Box>
          </Typography>
          <Typography variant="body1" sx={{ color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(17,24,39,0.7)', maxWidth: 440, mx: 'auto', lineHeight: 1.7, fontSize: '1.05rem' }}>
            Sri Lankan SME owners in the Coconut, Kithul, and Palmyra industries are already growing smarter.
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {testimonials.map((t) => (
            <Grid size={{ xs: 12, md: 4 }} key={t.name}>
              <Box sx={{ 
                background: mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#FFFFFF', 
                border: mode === 'dark' ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.08)', 
                borderRadius: '24px', 
                p: 4, 
                height: '100%', 
                position: 'relative', 
                transition: 'all 0.3s ease', 
                backdropFilter: 'blur(20px)', 
                boxShadow: mode === 'dark' ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
                '&:hover': { 
                  transform: 'translateY(-6px)', 
                  border: `1px solid ${t.color}33`, 
                  boxShadow: mode === 'dark'
                    ? `0 24px 60px rgba(0,0,0,0.35)`
                    : `0 24px 60px rgba(0,0,0,0.12)` 
                } 
              }}>
                <FormatQuoteIcon sx={{ fontSize: 44, color: mode === 'dark' ? `${t.color}25` : `${t.color}15`, position: 'absolute', top: 20, right: 22 }} />

                {/* Industry badge */}
                <Chip label={t.industry} size="small" sx={{ background: `${t.color}15`, border: `1px solid ${t.color}30`, color: t.color, fontWeight: 700, fontSize: '0.68rem', mb: 2, height: 22 }} />

                {/* Stars */}
                <Box sx={{ display: 'flex', gap: 0.3, mb: 2 }}>
                  {[1,2,3,4,5].map(s => <StarIcon key={s} sx={{ fontSize: 16, color: '#F59E0B' }} />)}
                </Box>

                <Typography variant="body1" sx={{ color: mode === 'dark' ? 'rgba(255,255,255,0.72)' : 'rgba(17,24,39,0.7)', lineHeight: 1.75, mb: 3.5, fontSize: '0.93rem', fontStyle: 'italic' }}>
                  "{t.quote}"
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`, width: 44, height: 44, fontWeight: 700, fontSize: '0.95rem' }}>
                    {t.initials}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: mode === 'dark' ? '#fff' : '#111827', fontSize: '0.9rem' }}>{t.name}</Typography>
                    <Typography sx={{ color: mode === 'dark' ? 'rgba(255,255,255,0.38)' : 'rgba(17,24,39,0.5)', fontSize: '0.76rem' }}>{t.role}</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
