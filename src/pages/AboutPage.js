import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PeopleIcon from '@mui/icons-material/People';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

const values = [
  {
    icon: <RocketLaunchIcon sx={{ fontSize: 40 }} />,
    title: 'Innovation',
    description: 'We push the boundaries of AI technology to deliver cutting-edge solutions.',
  },
  {
    icon: <PeopleIcon sx={{ fontSize: 40 }} />,
    title: 'Customer-Centric',
    description: 'Your success is our success. We build solutions tailored to your needs.',
  },
  {
    icon: <EmojiObjectsIcon sx={{ fontSize: 40 }} />,
    title: 'Excellence',
    description: 'We strive for excellence in every aspect of our platform and service.',
  },
];

export default function AboutPage() {
  return (
    <Box sx={{ py: 12, minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: '#fff',
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            About Us
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 800,
              mx: 'auto',
              mb: 6,
              lineHeight: 1.8,
            }}
          >
            We're on a mission to revolutionize how businesses operate by making AI agents
            accessible, powerful, and easy to use. Our platform empowers companies of all sizes
            to automate workflows, boost productivity, and scale faster than ever before.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {values.map((value, idx) => (
            <Grid size={{ xs: 12, md: 4 }} key={idx}>
              <Card
                sx={{
                  height: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    border: '1px solid rgba(124, 58, 237, 0.5)',
                  },
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      color: '#7C3AED',
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {value.icon}
                  </Box>
                  <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>
                    {value.title}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            background: 'rgba(124, 58, 237, 0.1)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: 3,
            p: 6,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>
            Our Story
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.8)',
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: '1.1rem',
            }}
          >
            Founded in 2024, buildbusinesslk emerged from a simple observation: businesses were
            struggling to keep up with the rapid pace of digital transformation. We saw an
            opportunity to bridge this gap with AI-powered automation that's both powerful and
            accessible. Today, we're proud to serve businesses across multiple industries,
            helping them achieve more with less effort.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
