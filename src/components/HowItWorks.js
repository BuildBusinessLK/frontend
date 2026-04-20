import React from 'react';
import { Box, Container, Typography, Grid, Chip } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import StorageIcon from '@mui/icons-material/Storage';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useThemeMode } from '../contexts/ThemeContext';
import { brand, alpha, gradients, getThemeColors } from '../theme';

const steps = [
  {
    number: '01', icon: <PersonAddIcon sx={{ fontSize: 28 }} />,
    title: 'Create Your Profile',
    description: 'Sign up in 2 minutes. Tell us your business type, what products you make, your region, and your goals. No technical skills needed.',
    color: brand.green.primary,
  },
  {
    number: '02', icon: <StorageIcon sx={{ fontSize: 28 }} />,
    title: 'Connect Your Data',
    description: 'Link your social media pages and enter basic business info. Our AI pulls real market data from CDA, PDB, EDB, and DCS automatically.',
    color: brand.amber.primary,
  },
  {
    number: '03', icon: <RocketLaunchIcon sx={{ fontSize: 28 }} />,
    title: 'Let AI Work for You',
    description: 'Your AI assistant starts working immediately — generating insights, running marketing, guiding growth, and learning from your results.',
    color: brand.blue.primary,
  },
];

export default function HowItWorks() {
  const { mode } = useThemeMode();
  const colors = getThemeColors(mode);
  
  return (
    <Box sx={{ 
      py: { xs: 10, md: 14 }, 
      background: mode === 'dark' ? colors.background.primary : `linear-gradient(180deg, ${colors.background.primary} 0%, ${colors.background.secondary} 100%)`, 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 7, md: 9 } }}>
          <Chip 
            label="How It Works" 
            sx={{ 
              background: mode === 'dark' ? alpha.blue[10] : alpha.amber[10], 
              border: mode === 'dark' ? `1px solid ${alpha.blue[25]}` : `1px solid ${alpha.amber[25]}`, 
              color: mode === 'dark' ? brand.blue.primary : brand.amber.primary, 
              fontWeight: 600, 
              fontSize: '0.75rem', 
              mb: 2.5 
            }} 
          />
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, color: colors.text.primary, mb: 2 }}>
            Up and Running in{' '}
            <Box component="span" sx={{ background: gradients.primaryAlt, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>3 Simple Steps</Box>
          </Typography>
          <Typography variant="body1" sx={{ color: mode === 'dark' ? colors.text.tertiary : alpha.gray[75], maxWidth: 440, mx: 'auto', lineHeight: 1.7, fontSize: '1.05rem' }}>
            If you can use a smartphone, you can use buildbusinesslk. Designed to be simple for every entrepreneur.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {steps.map((step) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={step.number}>
              <Box sx={{ 
                textAlign: 'center', 
                p: { xs: 3.5, md: 4 }, 
                borderRadius: '24px', 
                background: colors.background.paper, 
                border: `1px solid ${colors.border.secondary}`, 
                position: 'relative', 
                transition: 'all 0.3s ease', 
                boxShadow: mode === 'dark' ? 'none' : `0 2px 8px ${alpha.black['04']}`,
                '&:hover': { 
                  background: colors.background.hover, 
                  border: `1px solid ${step.color}35`, 
                  transform: 'translateY(-5px)', 
                  boxShadow: mode === 'dark'
                    ? `0 24px 60px ${alpha.black[30]}, 0 0 0 1px ${step.color}18`
                    : `0 24px 60px ${alpha.black[12]}, 0 0 0 1px ${step.color}18` 
                } 
              }}>
                <Typography sx={{ 
                  fontSize: '4.5rem', 
                  fontWeight: 900, 
                  lineHeight: 1, 
                  color: mode === 'dark' ? `${step.color}12` : `${step.color}08`, 
                  position: 'absolute', 
                  top: 12, 
                  right: 20, 
                  letterSpacing: '-0.04em', 
                  userSelect: 'none' 
                }}>
                  {step.number}
                </Typography>
                <Box sx={{ width: 72, height: 72, borderRadius: '20px', background: `${step.color}15`, border: `1.5px solid ${step.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5, color: step.color, boxShadow: `0 0 28px ${step.color}1A` }}>
                  {step.icon}
                </Box>
                <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 700, mb: 1.5 }}>{step.title}</Typography>
                <Typography variant="body2" sx={{ color: mode === 'dark' ? colors.text.tertiary : alpha.gray[65], lineHeight: 1.75, fontSize: '0.9rem' }}>{step.description}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
