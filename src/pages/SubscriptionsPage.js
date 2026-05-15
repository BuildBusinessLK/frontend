import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const plans = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    features: ['1 AI Agent', 'Basic Analytics', 'Email Support', '5 Projects'],
  },
  {
    name: 'Professional',
    price: '$99',
    period: '/month',
    features: ['5 AI Agents', 'Advanced Analytics', 'Priority Support', 'Unlimited Projects', 'Custom Integrations'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$299',
    period: '/month',
    features: ['Unlimited AI Agents', 'Enterprise Analytics', '24/7 Support', 'Unlimited Projects', 'Custom Development', 'Dedicated Account Manager'],
  },
];

export default function SubscriptionsPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(ROUTES.marketing.websiteTemplates);
  };

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
            Choose Your Plan
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 600, mx: 'auto' }}
          >
            Select the perfect plan for your business needs
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {plans.map((plan) => (
            <Grid size={{ xs: 12, md: 4 }} key={plan.name}>
              <Card
                sx={{
                  height: '100%',
                  background: plan.popular
                    ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(245, 158, 11, 0.1))'
                    : 'rgba(255,255,255,0.05)',
                  border: plan.popular
                    ? '2px solid #7C3AED'
                    : '1px solid rgba(255,255,255,0.1)',
                  position: 'relative',
                }}
              >
                {plan.popular && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(90deg, #7C3AED, #F59E0B)',
                      px: 3,
                      py: 0.5,
                      borderRadius: 2,
                    }}
                  >
                    <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>
                      Most Popular
                    </Typography>
                  </Box>
                )}
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>
                    {plan.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                    <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800 }}>
                      {plan.price}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', ml: 1 }}>
                      {plan.period}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 4 }}>
                    {plan.features.map((feature, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CheckCircleIcon sx={{ color: '#10B981', mr: 1.5, fontSize: 20 }} />
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Button
                    onClick={handleGetStarted}
                    variant={plan.popular ? 'contained' : 'outlined'}
                    fullWidth
                    sx={{
                      py: 1.5,
                      background: plan.popular
                        ? 'linear-gradient(90deg, #7C3AED, #F59E0B)'
                        : 'transparent',
                      border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      fontWeight: 600,
                      '&:hover': {
                        background: plan.popular
                          ? 'linear-gradient(90deg, #6D28D9, #D97706)'
                          : 'rgba(255,255,255,0.05)',
                      },
                    }}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
