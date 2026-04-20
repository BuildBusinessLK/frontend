import React from 'react';
import { Box, Container, Typography, Grid, IconButton, Divider, Stack } from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SchoolIcon from '@mui/icons-material/School';

const footerLinks = {
  Product: ['Features', 'Industries', 'Pricing', 'Roadmap'],
  Company: ['About Us', 'Our Research', 'Team', 'Contact Us'],
  Support: ['Help Center', 'Getting Started', 'Privacy Policy', 'Terms of Service'],
};

export default function Footer() {
  return (
    <Box sx={{ background: '#030608', borderTop: '1px solid rgba(34,197,94,0.1)', pt: { xs: 8, md: 10 }, pb: 4 }}>
      <Container maxWidth="xl">
        <Grid container spacing={5} sx={{ mb: 7 }}>
          {/* Brand col */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
              <Box sx={{ width: 38, height: 38, borderRadius: '11px', background: 'linear-gradient(135deg, #22C55E, #16A34A)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(34,197,94,0.3)' }}>
                <SpaIcon sx={{ fontSize: 20, color: '#fff' }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 900, color: '#fff', fontSize: '1.05rem', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  buildbusiness<Box component="span" sx={{ background: 'linear-gradient(90deg, #22C55E, #86EFAC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>lk</Box>
                </Typography>
                <Typography sx={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>AI GROWTH ASSISTANT</Typography>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.38)', lineHeight: 1.75, maxWidth: 300, mb: 2.5, fontSize: '0.88rem' }}>
              An AI-powered business growth platform built for Sri Lanka's Coconut, Kithul, and Palmyra palm entrepreneurs. Empowering SMEs with data-driven intelligence.
            </Typography>

            {/* University badge */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: '10px', px: 1.5, py: 1, width: 'fit-content' }}>
              <SchoolIcon sx={{ fontSize: 15, color: '#22C55E' }} />
              <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>University of Kelaniya · CSCI 23072 · Group 7</Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              {[
                { icon: <FacebookIcon />, color: '#1877F2', label: 'Facebook' },
                { icon: <InstagramIcon />, color: '#E4405F', label: 'Instagram' },
                { icon: <WhatsAppIcon />, color: '#25D366', label: 'WhatsApp' },
                { icon: <LinkedInIcon />, color: '#0A66C2', label: 'LinkedIn' },
              ].map((s) => (
                <IconButton key={s.label} size="small" aria-label={s.label}
                  sx={{ color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', width: 36, height: 36,
                    '&:hover': { color: s.color, background: `${s.color}15`, border: `1px solid ${s.color}35` }, transition: 'all 0.2s ease' }}>
                  {s.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Link cols */}
          {Object.entries(footerLinks).map(([cat, links]) => (
            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={cat} sx={{ ml: { md: 'auto' } }}>
              <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.28)', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.1em', display: 'block', mb: 2 }}>{cat}</Typography>
              <Stack spacing={1.2}>
                {links.map((link) => (
                  <Typography key={link} component="a" href="#" variant="body2"
                    sx={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.86rem', display: 'block', transition: 'color 0.2s', '&:hover': { color: '#4ADE80' } }}>
                    {link}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem' }}>
            © 2026 buildbusinesslk. All rights reserved. Made with ❤️ in Sri Lanka.
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
            Supervisors: Dr. Muditha Tisera · Mr. Kesavan Selvaraj
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
