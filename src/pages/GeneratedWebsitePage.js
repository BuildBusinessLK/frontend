import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
  useTheme,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';

const steps = ['Business Details', 'AI Generation', 'Preview & Publish'];

// Backend endpoint for AI generation
const AI_API_ENDPOINT = 'http://localhost/campus/project/frontend/generate-website.php';

const templatePrompts = {
  web1: 'Modern gradient design with vibrant gradients and smooth animations',
  web2: 'Professional corporate business design focused on trust and professionalism',
  web3: 'Creative portfolio design with bold and artistic layout',
  web4: 'Minimalist clean design with maximum whitespace',
  web5: 'E-commerce store design optimized for selling products',
  web6: 'Content hub design for blog and content-focused websites',
};

export default function GeneratedWebsitePage() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeStep, setActiveStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [error, setError] = useState(null);
  
  // Business details form
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    businessDescription: '',
    targetAudience: '',
    websiteGoal: '',
    currentWebsite: '',
    contactForm: 'YES',
    productShowcase: 'NO',
    blogSection: 'NO',
    ecommerce: 'NO',
    newsletter: 'NO',
    additionalNotes: '',
  });

  const selectedTemplate = location.state?.template || localStorage.getItem('selectedTemplate') || 'web1';

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleCheckboxChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked ? 'YES' : 'NO'
    }));
  };

  const generateWebsite = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Get the template prompt
      const templateStyle = templatePrompts[selectedTemplate] || templatePrompts.web1;
      
      // Build the prompt for Google AI Studio
      const prompt = `Create a complete website based on the following details:
      
Business Name: ${formData.businessName}
Industry: ${formData.industry}
Business Description: ${formData.businessDescription}
Target Audience: ${formData.targetAudience}
Website Goal: ${formData.websiteGoal}
Current Website: ${formData.currentWebsite || 'NONE'}

Features Required:
- Contact Form: ${formData.contactForm}
- Product Showcase: ${formData.productShowcase}
- Blog Section: ${formData.blogSection}
- E-commerce Functionality: ${formData.ecommerce}
- Newsletter Signup: ${formData.newsletter}

Additional Notes: ${formData.additionalNotes}

Template Style: ${templateStyle}

IMPORTANT REQUIREMENTS:
- Use the template image as visual inspiration for layout, spacing, colors, and structure.
- Do NOT copy it exactly — reinterpret it into a clean, modern, professional design.
- The final output must be ready to deploy (no placeholders, no incomplete sections).
- Use clean, well-structured code.

TECH STACK:
- HTML5, CSS3 (or Tailwind CSS), JavaScript
- Include responsive design (mobile, tablet, desktop)
- Include basic backend simulation using JavaScript or simple API placeholders

OUTPUT REQUIREMENTS:
1. WEBSITE STRUCTURE:
- Home Page
- About Page
- Services/Products Page
- Blog Page (if enabled)
- Shop Page (if e-commerce enabled)
- Contact Page

2. DESIGN:
- Modern, clean UI based on template inspiration
- Consistent color palette and typography
- Smooth scrolling and subtle animations
- Professional hero section with CTA

3. FUNCTIONALITY:
- Fully working contact form (with validation)
- Responsive navigation bar (mobile-friendly menu)
- Product cards with pricing (if enabled)
- Blog layout with sample posts (if enabled)
- Newsletter signup section (if enabled)

4. SEO & PERFORMANCE:
- Meta tags (title, description, keywords)
- Semantic HTML structure
- Fast-loading optimized layout

5. CODE OUTPUT FORMAT:
- Provide ALL files separately:
  - index.html
  - style.css (or Tailwind CDN)
  - script.js
- Clearly label each file
- Ensure code is clean and commented

6. EXTRA:
- Include placeholder images from free sources (like Unsplash)
- Use realistic sample content (not lorem ipsum)
- Make it look like a real business website ready to launch

Generate the complete website code now.`;

      // Call backend API endpoint
      const response = await fetch(AI_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate website. Please check your API key or try again.');
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]) {
        const generatedContent = data.candidates[0].content.parts[0].text;
        
        // Parse the generated content to extract code files
        const code = parseGeneratedCode(generatedContent);
        setGeneratedCode(code);
        setActiveStep(2);
      } else {
        throw new Error('No response from AI');
      }

    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate website');
    } finally {
      setIsGenerating(false);
    }
  };

  // Parse the AI response to extract code files
  const parseGeneratedCode = (content) => {
    // This is a simplified parser - in production, you'd want more robust parsing
    const files = {
      'index.html': '',
      'style.css': '',
      'script.js': ''
    };

    // Try to extract HTML
    const htmlMatch = content.match(/```html([\s\S]*?)```/);
    if (htmlMatch) {
      files['index.html'] = htmlMatch[1];
    }

    // Try to extract CSS
    const cssMatch = content.match(/```css([\s\S]*?)```/);
    if (cssMatch) {
      files['style.css'] = cssMatch[1];
    }

    // Try to extract JS
    const jsMatch = content.match(/```javascript([\s\S]*?)```/);
    if (jsMatch) {
      files['script.js'] = jsMatch[1];
    }

    return files;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate form
      if (!formData.businessName || !formData.industry) {
        setError('Please fill in required fields');
        return;
      }
      setError(null);
      setActiveStep(1);
      generateWebsite();
    } else if (activeStep === 1) {
      if (generatedCode) {
        setActiveStep(2);
      }
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    } else {
      navigate(-1);
    }
  };

  const templateName = {
    web1: 'Modern Gradient',
    web2: 'Professional Business',
    web3: 'Creative Portfolio',
    web4: 'Minimalist Clean',
    web5: 'E-Commerce Store',
    web6: 'Content Hub',
  }[selectedTemplate];

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
          {/* Header */}
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
              variant="h3"
              sx={{
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Create Your Website
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: '1.1rem', maxWidth: 720 }}>
              Selected template: <strong>{templateName}</strong>. Fill in your business details and let AI create your website.
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Step Content */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              background: mode === 'dark' ? 'rgba(6,10,13,0.7)' : 'rgba(255,255,255,0.86)',
              backdropFilter: 'blur(18px)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Step 0: Business Details Form */}
              {activeStep === 0 && (
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                      Business Information
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.secondary }}>
                      Tell us about your business to help AI create the perfect website.
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Business Name *"
                        value={formData.businessName}
                        onChange={handleInputChange('businessName')}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Industry *"
                        value={formData.industry}
                        onChange={handleInputChange('industry')}
                        placeholder="e.g., Restaurant, Technology, Healthcare"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Business Description"
                        value={formData.businessDescription}
                        onChange={handleInputChange('businessDescription')}
                        placeholder="Describe what your business does..."
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Target Audience"
                        value={formData.targetAudience}
                        onChange={handleInputChange('targetAudience')}
                        placeholder="e.g., Young professionals, Families"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Website Goal"
                        value={formData.websiteGoal}
                        onChange={handleInputChange('websiteGoal')}
                        placeholder="e.g., Generate leads, Sell products"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Website (if any)"
                        value={formData.currentWebsite}
                        onChange={handleInputChange('currentWebsite')}
                        placeholder="https://your-current-website.com"
                      />
                    </Grid>
                  </Grid>

                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                      Features Required
                    </Typography>
                    <Grid container spacing={2}>
                      {[
                        { key: 'contactForm', label: 'Contact Form' },
                        { key: 'productShowcase', label: 'Product Showcase' },
                        { key: 'blogSection', label: 'Blog Section' },
                        { key: 'ecommerce', label: 'E-commerce' },
                        { key: 'newsletter', label: 'Newsletter Signup' },
                      ].map((feature) => (
                        <Grid item xs={6} md={4} key={feature.key}>
                          <Box
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              [feature.key]: prev[feature.key] === 'YES' ? 'NO' : 'YES'
                            }))}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: formData[feature.key] === 'YES'
                                ? '#22C55E'
                                : mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                              background: formData[feature.key] === 'YES'
                                ? mode === 'dark' ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.05)'
                                : 'transparent',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <CheckCircleIcon
                              sx={{
                                color: formData[feature.key] === 'YES' ? '#22C55E' : 'transparent',
                                fontSize: 20,
                              }}
                            />
                            <Typography>{feature.label}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Additional Notes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange('additionalNotes')}
                    placeholder="Any specific requirements or preferences..."
                  />
                </Stack>
              )}

              {/* Step 1: Generating */}
              {activeStep === 1 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  {isGenerating ? (
                    <>
                      <CircularProgress
                        size={80}
                        sx={{
                          color: '#22C55E',
                          mb: 4,
                        }}
                      />
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        Generating Your Website
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary, maxWidth: 500, mx: 'auto' }}>
                        Our AI is creating a custom website based on your template and business details. This may take a few moments...
                      </Typography>
                    </>
                  ) : (
                    <>
                      <AutoAwesomeIcon sx={{ fontSize: 80, color: '#22C55E', mb: 4 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        Generation Complete!
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary, mb: 4 }}>
                        Your website has been generated. Click continue to preview it.
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(2)}
                        sx={{
                          borderRadius: 999,
                          px: 4,
                          py: 1.5,
                          background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                        }}
                      >
                        View Generated Website
                      </Button>
                    </>
                  )}
                </Box>
              )}

              {/* Step 2: Preview */}
              {activeStep === 2 && (
                <Stack spacing={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CheckCircleIcon sx={{ fontSize: 60, color: '#22C55E', mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Your Website is Ready!
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.secondary }}>
                      Preview your generated website below.
                    </Typography>
                  </Box>

                  {generatedCode ? (
                    <Box
                      sx={{
                        border: '1px solid',
                        borderColor: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}
                    >
                      <Box sx={{ p: 2, background: mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Generated Files:
                        </Typography>
                      </Box>
                      <Box sx={{ p: 3 }}>
                        <Stack spacing={2}>
                          {Object.keys(generatedCode).map((filename) => (
                            <Box
                              key={filename}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                background: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                              }}
                            >
                              <Typography sx={{ fontWeight: 600, mb: 1 }}>{filename}</Typography>
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                {generatedCode[filename].length} characters
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    </Box>
                  ) : (
                    <Alert severity="info">
                      No code generated yet. Please go back and try again.
                    </Alert>
                  )}

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setActiveStep(0);
                        setGeneratedCode(null);
                      }}
                      sx={{ borderRadius: 999 }}
                    >
                      Start Over
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        borderRadius: 999,
                        background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                      }}
                    >
                      Download Website
                    </Button>
                  </Stack>
                </Stack>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          {activeStep < 2 && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{ borderRadius: 999, py: 1.5 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={activeStep === 1 && isGenerating}
                sx={{
                  borderRadius: 999,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                  boxShadow: '0 14px 30px rgba(34,197,94,0.3)',
                }}
              >
                {activeStep === 0 ? 'Generate Website' : 'Continue'}
              </Button>
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}