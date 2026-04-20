import React from 'react';
import { Box, Container, Typography, Grid, Chip, Stack } from '@mui/material';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import NatureIcon from '@mui/icons-material/Nature';
import SpaIcon from '@mui/icons-material/Spa';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useThemeMode } from '../contexts/ThemeContext';

const industries = [
  {
    icon: <NatureIcon sx={{ fontSize: 34 }} />,
    name: 'Coconut Industry',
    tagline: 'CDA · Export · Processing',
    description: 'From virgin coconut oil to coconut milk and desiccated coconut — get pricing guidance, export channel access, and demand forecasting powered by CDA data.',
    products: ['Virgin Coconut Oil', 'Desiccated Coconut', 'Coconut Milk', 'Coconut Shell Products'],
    color: '#22C55E',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0.03) 100%)',
    border: 'rgba(34,197,94,0.2)',
  },
  {
    icon: <AgricultureIcon sx={{ fontSize: 34 }} />,
    name: 'Kithul Palm Industry',
    tagline: 'Rural · Artisan · Traditional',
    description: 'Kithul treacle, jaggery, and flour have massive premium market potential. Our AI helps you reach the right buyers and set competitive prices using real market data.',
    products: ['Kithul Treacle', 'Kithul Jaggery', 'Kithul Flour', 'Artisan Products'],
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.03) 100%)',
    border: 'rgba(245,158,11,0.2)',
  },
  {
    icon: <SpaIcon sx={{ fontSize: 34 }} />,
    name: 'Palmyra Palm Industry',
    tagline: 'PDB · Jaffna · Export',
    description: 'Access PDB-powered insights on Palmyra product demand, seasonal pricing, and growing export markets in Europe and India for your Palmyra products.',
    products: ['Palmyra Jaggery', 'Palmyra Sprouts', 'Palmyra Handicrafts', 'Palmyra Sap Products'],
    color: '#A78BFA',
    gradient: 'linear-gradient(135deg, rgba(167,139,250,0.12) 0%, rgba(167,139,250,0.03) 100%)',
    border: 'rgba(167,139,250,0.2)',
  },
];

const dataSources = ['Coconut Development Authority (CDA)', 'Palmyrah Development Board (PDB)', 'Export Development Board (EDB)', 'Dept. of Census & Statistics (DCS)', 'Industrial Development Board (IDB)'];

export default function Industries() {
  const { mode } = useThemeMode();
  
  return (
    <Box sx={{ 
      py: { xs: 10, md: 14 }, 
      background: mode === 'dark'
        ? 'linear-gradient(180deg, #060A0D 0%, #060D0A 100%)'
        : 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)', 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        width: '40%', 
        height: '100%', 
        background: mode === 'dark'
          ? 'radial-gradient(ellipse at right, rgba(34,197,94,0.04) 0%, transparent 60%)'
          : 'radial-gradient(ellipse at right, rgba(255,107,53,0.06) 0%, transparent 60%)', 
        pointerEvents: 'none' 
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 7, md: 9 } }}>
          <Chip 
            label="Target Industries" 
            sx={{ 
              background: mode === 'dark' ? 'rgba(167,139,250,0.1)' : 'rgba(245,158,11,0.1)', 
              border: mode === 'dark' ? '1px solid rgba(167,139,250,0.25)' : '1px solid rgba(245,158,11,0.25)', 
              color: mode === 'dark' ? '#C4B5FD' : '#F59E0B', 
              fontWeight: 600, 
              fontSize: '0.75rem', 
              mb: 2.5 
            }} 
          />
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, color: mode === 'dark' ? '#fff' : '#111827', mb: 2 }}>
            Built for Sri Lanka's{' '}
            <Box component="span" sx={{ background: 'linear-gradient(90deg, #FF6B35, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Traditional Industries</Box>
          </Typography>
          <Typography variant="body1" sx={{ color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(17,24,39,0.7)', maxWidth: 520, mx: 'auto', lineHeight: 1.75, fontSize: '1.05rem' }}>
            Starting with three pillars of rural Sri Lankan economy. Deeply domain-specific AI trained on real government industry data — not generic business advice.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          {industries.map((ind) => (
            <Grid size={{ xs: 12, md: 4 }} key={ind.name}>
              <Box sx={{ 
                background: mode === 'dark' ? ind.gradient : `${ind.color}06`, 
                border: mode === 'dark' ? `1px solid ${ind.border}` : `1px solid ${ind.color}18`, 
                borderRadius: '24px', 
                p: 4, 
                height: '100%', 
                transition: 'all 0.3s ease', 
                backdropFilter: 'blur(20px)', 
                '&:hover': { 
                  transform: 'translateY(-6px)', 
                  borderColor: ind.color, 
                  boxShadow: mode === 'dark'
                    ? `0 24px 60px rgba(0,0,0,0.35)`
                    : `0 24px 60px rgba(0,0,0,0.12)` 
                } 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                  <Box sx={{ width: 58, height: 58, borderRadius: '16px', background: `${ind.color}18`, border: `1.5px solid ${ind.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ind.color }}>
                    {ind.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, color: mode === 'dark' ? '#fff' : '#111827', fontSize: '1rem', lineHeight: 1.2 }}>{ind.name}</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: ind.color, fontWeight: 600, letterSpacing: '0.04em' }}>{ind.tagline}</Typography>
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(17,24,39,0.65)', lineHeight: 1.75, mb: 3, fontSize: '0.88rem' }}>
                  {ind.description}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {ind.products.map((p) => (
                    <Chip key={p} label={p} size="small" sx={{ background: `${ind.color}10`, border: `1px solid ${ind.color}25`, color: mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(17,24,39,0.7)', fontSize: '0.72rem', height: 24 }} />
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Data sources strip */}
        <Box sx={{ 
          background: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,107,53,0.05)', 
          border: mode === 'dark' ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(255,107,53,0.15)', 
          borderRadius: '18px', 
          p: 3, 
          textAlign: 'center' 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', mb: 2 }}>
            <StorefrontIcon sx={{ fontSize: 18, color: mode === 'dark' ? '#22C55E' : '#FF6B35' }} />
            <Typography sx={{ fontSize: '0.78rem', color: mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(17,24,39,0.5)', fontWeight: 600, letterSpacing: '0.08em' }}>REAL DATA FROM</Typography>
          </Box>
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1.5}>
            {dataSources.map((ds) => (
              <Chip key={ds} label={ds} size="small" sx={{ 
                background: mode === 'dark' ? 'rgba(34,197,94,0.08)' : 'rgba(255,107,53,0.08)', 
                border: mode === 'dark' ? '1px solid rgba(34,197,94,0.18)' : '1px solid rgba(255,107,53,0.18)', 
                color: mode === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(17,24,39,0.65)', 
                fontSize: '0.72rem', 
                height: 26 
              }} />
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
