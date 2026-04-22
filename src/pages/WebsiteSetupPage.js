import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
  useTheme,
  FormControlLabel,
  Checkbox,
  LinearProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';

export default function WebsiteSetupPage() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    industry: '',
    targetAudience: '',
    websiteGoal: '',
    currentWebsite: '',
    features: {
      contactForm: false,
      productShowcase: false,
      blog: false,
      ecommerce: false,
      newsletter: false,
    },
    additionalNotes: '',
  });

  const [completed, setCompleted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save form data (could be to localStorage or API)
    localStorage.setItem('websiteSetup', JSON.stringify(formData));
    setCompleted(true);
    
    // Redirect after 2 seconds
    setTimeout(() => {
      navigate('/ai-chat');
    }, 2000);
  };

  const progress = Math.round(
    ((formData.businessName ? 1 : 0) +
      (formData.businessDescription ? 1 : 0) +
      (formData.industry ? 1 : 0) +
      (formData.targetAudience ? 1 : 0) +
      (formData.websiteGoal ? 1 : 0)) /
      5 * 100
  );

  if (completed) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pt: { xs: 12, md: 14 },
          pb: 8,
          background:
            mode === 'dark'
              ? 'radial-gradient(circle at top, rgba(34,197,94,0.14), transparent 38%), linear-gradient(180deg, #060A0D 0%, #10151B 100%)'
              : 'linear-gradient(180deg, #F0FDF4 0%, #F7FAF8 100%)',
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 20px 40px rgba(34,197,94,0.3)',
              }}
            >
              <CheckIcon sx={{ fontSize: 48, color: '#FFFFFF' }} />
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Perfect!
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, mb: 3, fontSize: '1.1rem' }}>
              Your website information has been saved. Let's create your website with AI assistance.
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.9rem' }}>
              Redirecting to AI chat...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: { xs: 12, md: 14 },
        pb: 8,
        background:
          mode === 'dark'
            ? 'radial-gradient(circle at top, rgba(34,197,94,0.14), transparent 38%), linear-gradient(180deg, #060A0D 0%, #10151B 100%)'
            : 'linear-gradient(180deg, #F0FDF4 0%, #F7FAF8 100%)',
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4}>
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/marketing/website')}
              sx={{
                mb: 2,
                color: theme.palette.text.secondary,
                '&:hover': {
                  background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                },
              }}
            >
              Back to Website Marketing
            </Button>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Website Setup
            </Typography>
            <Typography sx={{ maxWidth: 720, color: theme.palette.text.secondary, fontSize: '1.1rem' }}>
              Tell us about your business and website goals. This helps our AI create the perfect landing page and content for you.
            </Typography>
          </Box>

          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              background: mode === 'dark' ? 'rgba(6,10,13,0.7)' : 'rgba(255,255,255,0.86)',
              backdropFilter: 'blur(18px)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ mb: 1.5, color: theme.palette.text.secondary, fontSize: '0.9rem', fontWeight: 600 }}>
                  Progress: {progress}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    borderRadius: 2,
                    height: 6,
                    background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 2,
                      background: 'linear-gradient(90deg, #22C55E, #16A34A)',
                    },
                  }}
                />
              </Box>

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  {/* Business Information */}
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: theme.palette.text.primary,
                        mb: 2,
                      }}
                    >
                      Business Information
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Business Name"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="Enter your brand name"
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Industry/Business Type"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        placeholder="e.g., coconut,kithul palm,palmyra palm"
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Business Description"
                        name="businessDescription"
                        value={formData.businessDescription}
                        onChange={handleInputChange}
                        placeholder="What does your business do? What are the benefits?"
                        multiline
                        rows={3}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* Target Audience */}
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: theme.palette.text.primary,
                        mb: 2,
                      }}
                    >
                      Target Audience & Goals
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Target Audience"
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleInputChange}
                        placeholder="e.g., Small business owners, Startups, Enterprise companies"
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Main Website Goal"
                        name="websiteGoal"
                        value={formData.websiteGoal}
                        onChange={handleInputChange}
                        placeholder="e.g., Generate leads, Sell products, Build brand awareness"
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* Website Features */}
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: theme.palette.text.primary,
                        mb: 2,
                      }}
                    >
                      Website Features
                    </Typography>
                    <Box sx={{ p: 2, borderRadius: 2, background: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                      <Stack spacing={1.5}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="contactForm"
                              checked={formData.features.contactForm}
                              onChange={handleFeatureChange}
                            />
                          }
                          label="Contact Form"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="productShowcase"
                              checked={formData.features.productShowcase}
                              onChange={handleFeatureChange}
                            />
                          }
                          label="Product/Service Showcase"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="blog"
                              checked={formData.features.blog}
                              onChange={handleFeatureChange}
                            />
                          }
                          label="Blog Section"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="ecommerce"
                              checked={formData.features.ecommerce}
                              onChange={handleFeatureChange}
                            />
                          }
                          label="E-commerce/Shopping"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="newsletter"
                              checked={formData.features.newsletter}
                              onChange={handleFeatureChange}
                            />
                          }
                          label="Newsletter Signup"
                        />
                      </Stack>
                    </Box>
                  </Box>

                  {/* Additional Information */}
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: theme.palette.text.primary,
                        mb: 2,
                      }}
                    >
                      Additional Information
                    </Typography>
                    <TextField
                      fullWidth
                      label="Current Website or Competitors (Optional)"
                      name="currentWebsite"
                      value={formData.currentWebsite}
                      onChange={handleInputChange}
                      placeholder="Share URLs or describe what you like/dislike"
                      multiline
                      rows={2}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Any Additional Notes (Optional)"
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      placeholder="Anything else we should know?"
                      multiline
                      rows={2}
                      sx={{
                        mt: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>

                  {/* Submit Button */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate('/marketing/website')}
                      sx={{
                        borderRadius: 999,
                        py: 1.5,
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      type="submit"
                      sx={{
                        borderRadius: 999,
                        py: 1.5,
                        background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                        boxShadow: '0 14px 30px rgba(34,197,94,0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #16A34A, #15803D)',
                        },
                      }}
                    >
                      Create Website
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
