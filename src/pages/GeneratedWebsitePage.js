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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  LinearProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GetAppIcon from '@mui/icons-material/GetApp';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';
import {
  isNetlifyAuthenticated,
  getNetlifyAuthUrl,
  deployToNetlify,
  getNetlifyUser,
  clearNetlifyToken,
} from '../services/netlifyService';

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
  const [isFallback, setIsFallback] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const [isNetlifyConnected, setIsNetlifyConnected] = useState(false);
  const [netlifyUser, setNetlifyUser] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState(null);
  const [deploymentProgress, setDeploymentProgress] = useState('');
  
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

  // Check Netlify authentication on mount
  useEffect(() => {
    if (isNetlifyAuthenticated()) {
      setIsNetlifyConnected(true);
      // Fetch user info
      getNetlifyUser()
        .then(user => setNetlifyUser(user))
        .catch(err => console.error('Failed to fetch Netlify user:', err));
    }
  }, []);

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

  const generateWebsite = async (useFallback = false) => {
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
          prompt: prompt,
          useFallback: useFallback
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Check if it's a quota or connection error
        if (response.status === 429 || errorData.code === 429 || 
            (errorData.message && errorData.message.includes('quota'))) {
          setError('API quota exceeded. Using fallback template generator...');
          setIsFallback(true);
          // Retry with fallback enabled
          setTimeout(() => generateWebsite(true), 1000);
          return;
        }
        
        throw new Error(errorData.message || 'Failed to generate website. Please try again.');
      }

      const data = await response.json();
      
      // Check if fallback was used
      if (data.fallback) {
        setIsFallback(true);
        if (data.message) {
          setError(data.message);
        }
      } else {
        setIsFallback(false);
      }
      
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
      
      // If API fails, automatically fallback
      if (!useFallback && retryAttempt < 1) {
        setRetryAttempt(retryAttempt + 1);
        setError('API unavailable. Generating with template...');
        setTimeout(() => generateWebsite(true), 500);
      } else {
        setError(err.message || 'Failed to generate website. Please try again.');
      }
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

  // Download website files
  const downloadWebsite = () => {
    if (!generatedCode) return;

    try {
      // Create a simple text file with all code
      const fileContent = `
WEBSITE FILES - Generated on ${new Date().toLocaleString()}
================================================================================

FILE 1: index.html
${generatedCode['index.html']}

================================================================================

FILE 2: style.css
${generatedCode['style.css']}

================================================================================

FILE 3: script.js
${generatedCode['script.js']}

================================================================================
DEPLOYMENT INSTRUCTIONS FOR NETLIFY:

1. Create three separate files with the content below:
   - index.html
   - style.css
   - script.js

2. Go to https://app.netlify.com
3. Drag and drop the folder containing these files
4. Your website is now live!

See NETLIFY_DEPLOYMENT.md for detailed instructions.
`;

      // Create blob and download
      const blob = new Blob([fileContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `website-${formData.businessName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Also download individual files
      setTimeout(() => downloadIndividualFiles(), 500);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download website files');
    }
  };

  // Download individual files
  const downloadIndividualFiles = () => {
    if (!generatedCode) return;

    // Download HTML
    const htmlBlob = new Blob([generatedCode['index.html']], { type: 'text/html' });
    const htmlUrl = window.URL.createObjectURL(htmlBlob);
    const htmlLink = document.createElement('a');
    htmlLink.href = htmlUrl;
    htmlLink.download = 'index.html';
    document.body.appendChild(htmlLink);
    htmlLink.click();
    window.URL.revokeObjectURL(htmlUrl);
    document.body.removeChild(htmlLink);

    setTimeout(() => {
      // Download CSS
      const cssBlob = new Blob([generatedCode['style.css']], { type: 'text/css' });
      const cssUrl = window.URL.createObjectURL(cssBlob);
      const cssLink = document.createElement('a');
      cssLink.href = cssUrl;
      cssLink.download = 'style.css';
      document.body.appendChild(cssLink);
      cssLink.click();
      window.URL.revokeObjectURL(cssUrl);
      document.body.removeChild(cssLink);
    }, 200);

    setTimeout(() => {
      // Download JS
      const jsBlob = new Blob([generatedCode['script.js']], { type: 'text/javascript' });
      const jsUrl = window.URL.createObjectURL(jsBlob);
      const jsLink = document.createElement('a');
      jsLink.href = jsUrl;
      jsLink.download = 'script.js';
      document.body.appendChild(jsLink);
      jsLink.click();
      window.URL.revokeObjectURL(jsUrl);
      document.body.removeChild(jsLink);
    }, 400);
  };

  // Connect to Netlify
  const handleConnectNetlify = () => {
    sessionStorage.setItem('netlify_redirect', window.location.pathname);
    window.location.href = getNetlifyAuthUrl();
  };

  // Deploy to Netlify
  const handleDeployToNetlify = async () => {
    if (!generatedCode) return;
    if (!isNetlifyConnected) {
      setError('Please connect to Netlify first');
      return;
    }

    setIsDeploying(true);
    setDeploymentStatus(null);
    setError(null);

    try {
      const siteName = `${formData.businessName.replace(/\s+/g, '-')}-${Date.now()}`;

      await deployToNetlify(siteName, generatedCode, (progress) => {
        setDeploymentProgress(progress.message);
        setDeploymentStatus(progress.status);

        if (progress.status === 'success') {
          setDeploymentStatus({
            success: true,
            url: progress.url,
            site: progress.site,
            deploy: progress.deploy,
          });
          setError(null);
        } else if (progress.status === 'error') {
          setError(progress.message);
        }
      });
    } catch (err) {
      console.error('Deployment error:', err);
      setError(err.message || 'Failed to deploy to Netlify');
      setDeploymentStatus(null);
    } finally {
      setIsDeploying(false);
    }
  };

  // Disconnect from Netlify
  const handleDisconnectNetlify = () => {
    clearNetlifyToken();
    setIsNetlifyConnected(false);
    setNetlifyUser(null);
    setError('Disconnected from Netlify');
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate form
      if (!formData.businessName || !formData.industry) {
        setError('Please fill in required fields');
        return;
      }
      setError(null);
      setIsFallback(false);
      setRetryAttempt(0);
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
            <Alert 
              severity={isFallback ? "warning" : "error"} 
              onClose={() => {
                setError(null);
                if (isFallback) setIsFallback(false);
              }}
            >
              <Typography sx={{ fontWeight: 500 }}>
                {error}
              </Typography>
              {isFallback && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Your website has been generated using our template generator. You can download and customize it further!
                </Typography>
              )}
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
                        placeholder="e.g., coconut,kithul palm,palmyra palm"
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
                        placeholder="e.g.,international buyers, sellers"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Website Goal"
                        value={formData.websiteGoal}
                        onChange={handleInputChange('websiteGoal')}
                        placeholder="e.g.,  Sell products,Generate leads"
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
                        {isFallback ? 'Generating Website Template' : 'Generating Your Website'}
                      </Typography>
                      <Typography sx={{ color: theme.palette.text.secondary, maxWidth: 500, mx: 'auto' }}>
                        {isFallback 
                          ? 'Using our fast template generator to create your website...'
                          : 'Our AI is creating a custom website based on your template and business details. This may take a few moments...'}
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
                      {isFallback && (
                        <Typography sx={{ color: '#f59e0b', mb: 2, fontSize: '0.9rem' }}>
                          ⓘ Using template generator due to API availability
                        </Typography>
                      )}
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
                      {isFallback ? 'Template-generated website' : 'AI-generated website'} - Preview your website below.
                    </Typography>
                  </Box>

                  {isFallback && (
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>Template Generator:</strong> Your website was generated using our fast template system. 
                        It's fully functional and ready to customize!
                      </Typography>
                    </Alert>
                  )}

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
                        setIsFallback(false);
                        setRetryAttempt(0);
                      }}
                      sx={{ borderRadius: 999 }}
                    >
                      Start Over
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<GetAppIcon />}
                      onClick={() => {
                        downloadWebsite();
                        setShowDeployDialog(true);
                      }}
                      sx={{
                        borderRadius: 999,
                        background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                      }}
                    >
                      Download & Deploy
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

          {/* Deployment Dialog */}
          <Dialog open={showDeployDialog} onClose={() => setShowDeployDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, color: '#22C55E' }}>
              {deploymentStatus && deploymentStatus.success
                ? '✓ Website Deployed Successfully!'
                : isDeploying
                ? '⏳ Deploying to Netlify...'
                : isNetlifyConnected
                ? '✓ Connected to Netlify - Ready to Deploy!'
                : '✓ Website Downloaded - Ready to Deploy!'}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3} sx={{ mt: 2 }}>
                {/* Deployment Success */}
                {deploymentStatus && deploymentStatus.success && (
                  <>
                    <Alert severity="success">
                      Your website is now live! 🎉
                    </Alert>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Your website is live at:
                      </Typography>
                      <Link
                        href={deploymentStatus.url}
                        target="_blank"
                        rel="noopener"
                        sx={{
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          color: '#22C55E',
                          wordBreak: 'break-all',
                        }}
                      >
                        {deploymentStatus.url}
                      </Link>
                      <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                        Site: {deploymentStatus.site.name}
                      </Typography>
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<OpenInNewIcon />}
                      onClick={() => window.open(deploymentStatus.url, '_blank')}
                      sx={{
                        background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                        py: 1.5,
                      }}
                    >
                      Visit Your Website
                    </Button>
                  </>
                )}

                {/* Deployment in Progress */}
                {isDeploying && (
                  <>
                    <LinearProgress
                      variant="indeterminate"
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          backgroundColor: '#22C55E',
                        },
                      }}
                    />
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {deploymentProgress}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                        This usually takes 30-60 seconds...
                      </Typography>
                    </Box>
                  </>
                )}

                {/* Deployment Error */}
                {deploymentStatus && deploymentStatus === 'error' && (
                  <Alert severity="error">
                    {deploymentProgress || 'Deployment failed'}
                  </Alert>
                )}

                {/* Automatic Deployment with Netlify */}
                {!isDeploying && !deploymentStatus && (
                  <>
                    <Alert severity="info">
                      Your website files have been downloaded. Choose your deployment method below.
                    </Alert>

                    {!isNetlifyConnected ? (
                      <Box
                        sx={{
                          p: 2.5,
                          border: '2px solid #22C55E',
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, rgba(34,197,94,0.05), transparent)',
                        }}
                      >
                        <Stack spacing={2}>
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                            >
                              <CloudDoneIcon sx={{ color: '#22C55E' }} />
                              Automatic Deployment (Fastest)
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                              Connect your Netlify account and deploy in one click - no file management needed!
                            </Typography>
                          </Box>
                          <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleConnectNetlify}
                            sx={{
                              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                              py: 1.5,
                              fontWeight: 600,
                            }}
                          >
                            Connect Netlify Account
                          </Button>
                        </Stack>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          p: 2.5,
                          border: '2px solid #22C55E',
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, rgba(34,197,94,0.05), transparent)',
                        }}
                      >
                        <Stack spacing={2}>
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                            >
                              <CloudDoneIcon sx={{ color: '#22C55E' }} />
                              Automatic Deployment
                            </Typography>
                            {netlifyUser && (
                              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                Connected as: <strong>{netlifyUser.email}</strong>
                              </Typography>
                            )}
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                              Click deploy to automatically upload and publish your website to Netlify.
                            </Typography>
                          </Box>
                          <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={isDeploying}
                            onClick={handleDeployToNetlify}
                            sx={{
                              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                              py: 1.5,
                              fontWeight: 600,
                            }}
                          >
                            Deploy Now
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            onClick={handleDisconnectNetlify}
                          >
                            Disconnect Netlify
                          </Button>
                        </Stack>
                      </Box>
                    )}

                    <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Manual Deployment (Alternative)
                      </Typography>
                      <Stack spacing={1} sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          <strong>Step 1:</strong> Go to <Link href="https://app.netlify.com" target="_blank" rel="noopener">
                            app.netlify.com
                          </Link>
                        </Typography>
                        <Typography variant="body2">
                          <strong>Step 2:</strong> Sign up with GitHub, GitLab, or Email
                        </Typography>
                        <Typography variant="body2">
                          <strong>Step 3:</strong> Click "Add new site" → "Deploy manually"
                        </Typography>
                        <Typography variant="body2">
                          <strong>Step 4:</strong> Drag & drop the folder with your website files
                        </Typography>
                      </Stack>
                      <Button
                        fullWidth
                        variant="outlined"
                        endIcon={<OpenInNewIcon />}
                        onClick={() => window.open('https://app.netlify.com', '_blank')}
                        sx={{ borderRadius: 2, py: 1.5 }}
                      >
                        Manual Deploy to Netlify
                      </Button>
                    </Box>

                    <Box sx={{ background: '#f5f5f5', p: 2, borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        📁 Your Downloaded Files:
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', fontFamily: 'monospace', mb: 0.5 }}>
                        📄 index.html
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', fontFamily: 'monospace', mb: 0.5 }}>
                        🎨 style.css
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', fontFamily: 'monospace' }}>
                        ⚙️ script.js
                      </Typography>
                    </Box>
                  </>
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDeployDialog(false)}>
                {deploymentStatus && deploymentStatus.success ? 'Done' : 'Close'}
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
      </Container>
    </Box>
  );
}