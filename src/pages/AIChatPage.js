import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
  CircularProgress,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import WebIcon from '@mui/icons-material/Web';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    text: 'Hi, I can help you understand the coconut industry trends, marketing, and business guidance. What would you like to know?',
  },
];

export default function AIChatPage() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  
  // Check if user came from template selection with intent to create website
  const websiteAction = location.state?.action;
  const selectedTemplate = location.state?.template;

  // Template info
  const templateNames = {
    web1: 'Modern Gradient',
    web2: 'Professional Business',
    web3: 'Creative Portfolio',
    web4: 'Minimalist Clean',
    web5: 'E-Commerce Store',
    web6: 'Content Hub',
  };
  
  const handleCreateWebsite = () => {
    // Navigate to the generated website page with template info
    navigate('/generated-website', { 
      state: { 
        template: selectedTemplate,
        templateName: templateNames[selectedTemplate]
      } 
    });
  };
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
  const text = draft.trim();
  if (!text) return;

  // Add user message first
  const userMessage = { role: 'user', text};
  setMessages((prev) => [...prev, userMessage]);

  setDraft('');

  try {
    const res = await fetch("http://127.0.0.1:5000/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    const botMessage = {
      role: 'assistant',
      text: data.response   // 👈 comes from Flask RAG
    };

    setMessages((prev) => [...prev, botMessage]);

  } catch (error) {
    console.error(error);

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        text: "Server not responding."
      }
    ]);
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
            ? 'radial-gradient(circle at top, rgba(34,197,94,0.12), transparent 40%), linear-gradient(180deg, #050A0D 0%, #071116 100%)'
            : 'linear-gradient(180deg, #F7FAF8 0%, #EEF6F1 100%)',
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Box>
            <Chip
              icon={<AutoAwesomeIcon sx={{ fontSize: 16, color: '#22C55E !important' }} />}
              label="AI Chat"
              sx={{
                mb: 2,
                background: mode === 'dark' ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.1)',
                color: mode === 'dark' ? '#86EFAC' : '#166534',
                fontWeight: 700,
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: theme.palette.text.primary,
                letterSpacing: '-0.04em',
                mb: 1,
              }}
            >
              BuildBusinessLK Assistant
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, maxWidth: 680 }}>
              Real-time insights and industry data powered by local market analysis.
            </Typography>
          </Box>

          {/* Website Creation Prompt - Show when user came from template selection */}
          {websiteAction === 'create-website' && selectedTemplate && (
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                border: '1px solid rgba(34,197,94,0.3)',
                background: mode === 'dark' 
                  ? 'rgba(34,197,94,0.08)' 
                  : 'rgba(34,197,94,0.08)',
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WebIcon sx={{ color: '#22C55E' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Create Website with AI
                    </Typography>
                  </Box>
                  <Typography sx={{ color: theme.palette.text.secondary }}>
                    You've selected the <strong>{templateNames[selectedTemplate]}</strong> template. 
                    Click below to provide your business details and generate a complete website using Google AI Studio.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      onClick={handleCreateWebsite}
                      sx={{
                        borderRadius: 999,
                        py: 1.5,
                        px: 3,
                        background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                        boxShadow: '0 14px 30px rgba(34,197,94,0.3)',
                      }}
                    >
                      Create My Website
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/marketing/website/templates')}
                      sx={{ borderRadius: 999, py: 1.5, px: 3 }}
                    >
                      Change Template
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}

          <Paper
            elevation={0}
            sx={{
              borderRadius: 5,
              overflow: 'hidden',
              border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              background: mode === 'dark' ? 'rgba(6,10,13,0.82)' : 'rgba(255,255,255,0.86)',
              backdropFilter: 'blur(24px)',
              boxShadow: mode === 'dark'
                ? '0 36px 80px rgba(0,0,0,0.55)'
                : '0 30px 70px rgba(15,23,42,0.12)',
            }}
          >
            <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack direction="row" spacing={1.2} alignItems="center">
                {['#EF4444', '#F59E0B', '#22C55E'].map((color) => (
                  <Box key={color} sx={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                ))}
              </Stack>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                AI Model Online
              </Typography>
            </Box>

            <Divider />

            <Box 
              ref={scrollRef}
              sx={{ p: { xs: 2, md: 3 }, height: 450, overflowY: 'auto', scrollBehavior: 'smooth' }}
            >
              <Stack spacing={2.2}>
                {messages.map((message) => {
                  const isUser = message.role === 'user';
                  return (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: isUser ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '85%',
                          px: 2.2,
                          py: 1.5,
                          whiteSpace: 'pre-line', // Maintains line breaks from API
                          borderRadius: isUser ? '18px 18px 6px 18px' : '18px 18px 18px 6px',
                          background: isUser
                            ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                            : mode === 'dark'
                              ? 'rgba(255,255,255,0.06)'
                              : 'rgba(0,0,0,0.04)',
                          border: isUser
                            ? 'none'
                            : mode === 'dark'
                              ? '1px solid rgba(34,197,94,0.12)'
                              : '1px solid rgba(34,197,94,0.15)',
                        }}
                      >
                        <Typography
                          sx={{
                            color: isUser ? '#FFFFFF' : theme.palette.text.primary,
                            lineHeight: 1.6,
                            fontSize: '0.92rem',
                          }}
                        >
                          {message.text}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
                {isLoading && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', pl: 1 }}>
                    <CircularProgress size={20} sx={{ color: '#22C55E' }} />
                  </Box>
                )}
              </Stack>
            </Box>

            <Divider />

            <Box sx={{ p: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <TextField
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={4}
                  value={draft}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Ask about coconut industry, exports, or market trends..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      background: mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSend}
                  disabled={isLoading || !draft.trim()}
                  endIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    minWidth: { xs: '100%', sm: 150 },
                    background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                    boxShadow: '0 10px 28px rgba(34,197,94,0.35)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4ADE80, #22C55E)',
                    },
                  }}
                >
                  {isLoading ? 'Thinking...' : 'Send'}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}