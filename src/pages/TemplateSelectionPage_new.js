import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  useTheme,
  Grid,
  Dialog,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';

import web1 from '../assets/web1.jpg';
import web2 from '../assets/web2.jpg';
import web3 from '../assets/web3.jpg';
import web4 from '../assets/web4.jpg';
import web5 from '../assets/web5.jpg';
import web6 from '../assets/web6.jpg';

const templates = [
  {
    id: 'web1',
    name: 'Modern Gradient',
    description: 'Contemporary design with vibrant gradients and smooth animations. Perfect for showcasing your products or services with a modern, eye-catching appearance.',
    image: web1,
  },
  {
    id: 'web2',
    name: 'Professional Business',
    description: 'Clean corporate design focused on trust and professionalism. Ideal for B2B companies, consulting firms, and enterprise businesses.',
    image: web2,
  },
  {
    id: 'web3',
    name: 'Creative Portfolio',
    description: 'Bold and artistic layout perfect for showcasing creative work, portfolios, and galleries with stunning visuals and unique typography.',
    image: web3,
  },
  {
    id: 'web4',
    name: 'Minimalist Clean',
    description: 'Simple and elegant design with maximum whitespace. Lets your content shine with a distraction-free, minimalist aesthetic.',
    image: web4,
  },
  {
    id: 'web5',
    name: 'E-Commerce Store',
    description: 'Optimized for selling products with product catalogs, shopping features, and conversion-focused design elements.',
    image: web5,
  },
  {
    id: 'web6',
    name: 'Content Hub',
    description: 'Blog and content-focused design with excellent readability, category organization, and strong typography for article-heavy websites.',
    image: web6,
  },
];

export default function TemplateSelectionPage() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);
  const [fullImageTemplate, setFullImageTemplate] = React.useState(null);

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    setFullImageTemplate(templateId);
  };

  const handleCloseFullImage = () => {
    setFullImageTemplate(null);
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      localStorage.setItem('selectedTemplate', selectedTemplate);
      navigate('/ai-chat');
    }
  };

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
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{
                mb: 2,
                color: theme.palette.text.secondary,
                '&:hover': {
                  background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                },
              }}
            >
              Back
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
              Choose Your Website Template
            </Typography>
            <Typography sx={{ maxWidth: 720, color: theme.palette.text.secondary, fontSize: '1.1rem' }}>
              Select a template that best matches your brand style. You can customize it later with AI assistance.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {templates.map((template) => (
              <Grid item xs={12} sm={6} md={6} key={template.id} sx={{ display: 'flex' }}>
                <Card
                  elevation={0}
                  onClick={() => handleSelectTemplate(template.id)}
                  sx={{
                    borderRadius: 3,
                    border:
                      selectedTemplate === template.id
                        ? '3px solid #22C55E'
                        : mode === 'dark'
                          ? '1px solid rgba(255,255,255,0.08)'
                          : '1px solid rgba(0,0,0,0.06)',
                    background:
                      selectedTemplate === template.id
                        ? mode === 'dark'
                          ? 'rgba(34,197,94,0.08)'
                          : 'rgba(34,197,94,0.05)'
                        : mode === 'dark'
                          ? 'rgba(6,10,13,0.7)'
                          : 'rgba(255,255,255,0.86)',
                    backdropFilter: 'blur(18px)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    aspectRatio: '20 / 9',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: mode === 'dark' ? 'rgba(34,197,94,0.4)' : 'rgba(34,197,94,0.25)',
                      boxShadow: '0 24px 48px rgba(34,197,94,0.15)',
                    },
                  }}
                >
                  {selectedTemplate === template.id && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: '#22C55E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        boxShadow: '0 4px 12px rgba(34,197,94,0.4)',
                      }}
                    >
                      <CheckIcon sx={{ fontSize: 24, color: 'white' }} />
                    </Box>
                  )}
                  <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Stack spacing={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box
                        component="img"
                        src={template.image}
                        alt={template.name}
                        onClick={() => handleSelectTemplate(template.id)}
                        sx={{
                          width: '100%',
                          height: 300,
                          objectFit: 'contain',
                          backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          flexShrink: 0,
                          '&:hover': {
                            backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)',
                          },
                        }}
                      />

                      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            color: theme.palette.text.primary,
                            mb: 0.5,
                            fontSize: '0.95rem',
                            height: '24px',
                            overflow: 'hidden',
                          }}
                        >
                          {template.name}
                        </Typography>
                        <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.75rem', lineHeight: 1.3, height: '48px', overflow: 'hidden' }}>
                          {template.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate(-1)}
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
              disabled={!selectedTemplate}
              onClick={handleContinue}
              sx={{
                borderRadius: 999,
                py: 1.5,
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                boxShadow: '0 14px 30px rgba(34,197,94,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #16A34A, #15803D)',
                },
                '&:disabled': {
                  opacity: 0.6,
                  cursor: 'not-allowed',
                },
              }}
            >
              Continue with {selectedTemplate ? templates.find((t) => t.id === selectedTemplate)?.name : 'Template'}
            </Button>
          </Stack>

          <Dialog
            open={!!fullImageTemplate}
            onClose={handleCloseFullImage}
            maxWidth="lg"
            fullWidth
            sx={{
              '& .MuiDialog-paper': {
                borderRadius: 3,
                background: mode === 'dark' ? 'rgba(6,10,13,0.95)' : 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(18px)',
                border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              },
            }}
          >
            <Box sx={{ position: 'relative' }}>
              {fullImageTemplate && (
                <>
                  <IconButton
                    onClick={handleCloseFullImage}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      background: mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)',
                      zIndex: 10,
                      '&:hover': {
                        background: mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    <CloseIcon sx={{ color: 'white' }} />
                  </IconButton>

                  <Box
                    component="img"
                    src={templates.find((t) => t.id === fullImageTemplate)?.image}
                    alt={templates.find((t) => t.id === fullImageTemplate)?.name}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                      maxHeight: '80vh',
                    }}
                  />

                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        color: theme.palette.text.primary,
                        mb: 1,
                      }}
                    >
                      {templates.find((t) => t.id === fullImageTemplate)?.name}
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.secondary, mb: 3 }}>
                      {templates.find((t) => t.id === fullImageTemplate)?.description}
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'center' }}>
                      <Button
                        variant="outlined"
                        onClick={handleCloseFullImage}
                        sx={{ borderRadius: 999 }}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setSelectedTemplate(fullImageTemplate);
                          handleCloseFullImage();
                        }}
                        sx={{
                          borderRadius: 999,
                          background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                          boxShadow: '0 14px 30px rgba(34,197,94,0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #16A34A, #15803D)',
                          },
                        }}
                      >
                        Select This Template
                      </Button>
                    </Stack>
                  </Box>
                </>
              )}
            </Box>
          </Dialog>
        </Stack>
      </Container>
    </Box>
  );
}
