import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
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
import { useThemeMode } from '../contexts/ThemeContext';
import { AssistantFormattedText } from '../utils/assistantTextFormat';

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    text: 'Hi, I can help you understand the coconut industry trends, marketing, and business guidance. What would you like to know?',
  },
];

const SPRING_BACKEND_BASE_URL = process.env.REACT_APP_SPRING_BACKEND_BASE_URL || 'http://localhost:8083';

export default function AIChatPageHavindu() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    const nextText = draft.trim();
    if (!nextText || isLoading) return;

    // 1. Add User Message to UI
    const userMessage = { id: Date.now(), role: 'user', text: nextText };
    setMessages((current) => [...current, userMessage]);
    setDraft('');
    setIsLoading(true);

    try {
      // 2. Call your local API
      const response = await fetch(`${SPRING_BACKEND_BASE_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: nextText }),
      });

      const data = await response.json();

      // 3. Add AI Response to UI
      if (data.success) {
        setMessages((current) => [
          ...current,
          {
            id: Date.now() + 1,
            role: 'assistant',
            text: data.answer,
          },
        ]);
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      // Handle Errors
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        pt: { xs: 9, md: 10 },
        pb: { xs: 2, md: 3 },
        background:
          mode === 'dark'
            ? 'radial-gradient(ellipse 120% 80% at 50% -20%, rgba(34,197,94,0.14), transparent 50%), linear-gradient(180deg, #050A0D 0%, #071116 100%)'
            : 'linear-gradient(180deg, #F8FBF9 0%, #EEF6F1 55%, #E8F5EC 100%)',
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          width: '100%',
          px: { xs: 2, sm: 3 },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2, flexShrink: 0 }} flexWrap="wrap">
          <Chip
            icon={<AutoAwesomeIcon sx={{ fontSize: 16, color: '#22C55E !important' }} />}
            label="AI Chat"
            size="small"
            sx={{
              background: mode === 'dark' ? 'rgba(34,197,94,0.14)' : 'rgba(34,197,94,0.1)',
              color: mode === 'dark' ? '#86EFAC' : '#166534',
              fontWeight: 700,
              border: mode === 'dark' ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(34,197,94,0.18)',
            }}
          />
          <Box>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2 }}>
              BuildBusinessLK Assistant
            </Typography>
            <Typography variant="caption" color="text.secondary">
              RAG · Spring Boot · /ask
            </Typography>
          </Box>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            minHeight: { xs: 400, sm: 480 },
            height: { xs: 'calc(100dvh - 11rem)', sm: 'calc(100dvh - 10rem)' },
            maxHeight: 920,
            overflow: 'hidden',
            borderRadius: 3,
            border: mode === 'dark' ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(0,0,0,0.07)',
            background: mode === 'dark' ? 'rgba(8,14,18,0.78)' : 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(20px)',
            boxShadow: mode === 'dark'
              ? '0 4px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)'
              : '0 4px 40px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.85)',
          }}
        >
          <Box
            sx={{
              px: 2.5,
              py: 1.25,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              bgcolor: mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              {['#FB7185', '#FBBF24', '#4ADE80'].map((color) => (
                <Box key={color} sx={{ width: 9, height: 9, borderRadius: '50%', background: color, opacity: 0.9 }} />
              ))}
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
                Conversation
              </Typography>
            </Stack>
            <Chip label="Online" size="small" color="success" variant="outlined" sx={{ fontWeight: 600, height: 24 }} />
          </Box>

          <Box
            ref={scrollRef}
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              scrollBehavior: 'smooth',
              p: { xs: 2, md: 2.75 },
            }}
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
                        maxWidth: { xs: '92%', sm: '88%' },
                        px: 2.2,
                        py: 1.6,
                        whiteSpace: isUser ? 'pre-line' : 'normal',
                        borderRadius: isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                        background: isUser
                          ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                          : mode === 'dark'
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(0,0,0,0.035)',
                        border: isUser
                          ? 'none'
                          : mode === 'dark'
                            ? '1px solid rgba(34,197,94,0.14)'
                            : '1px solid rgba(34,197,94,0.12)',
                        boxShadow: isUser ? '0 8px 24px rgba(34,197,94,0.22)' : undefined,
                      }}
                    >
                      {isUser ? (
                        <Typography
                          sx={{
                            color: '#FFFFFF',
                            lineHeight: 1.65,
                            fontSize: '0.9375rem',
                          }}
                        >
                          {message.text}
                        </Typography>
                      ) : (
                        <AssistantFormattedText text={message.text} theme={theme} />
                      )}
                    </Box>
                  </Box>
                );
              })}
              {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', pl: 1 }}>
                  <CircularProgress size={22} sx={{ color: '#22C55E' }} />
                </Box>
              )}
            </Stack>
          </Box>

          <Divider flexItem sx={{ borderColor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : undefined }} />

          <Box sx={{ p: 2, pt: 1.75, flexShrink: 0, bgcolor: mode === 'dark' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.5)' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                fullWidth
                multiline
                minRows={1}
                maxRows={5}
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
                    borderRadius: 2.5,
                    background: mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSend}
                disabled={isLoading || !draft.trim()}
                endIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                sx={{
                  borderRadius: 2.5,
                  px: 3,
                  py: 1.25,
                  minWidth: { xs: '100%', sm: 152 },
                  background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                  boxShadow: '0 8px 24px rgba(34,197,94,0.28)',
                  fontWeight: 700,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4ADE80, #22C55E)',
                  },
                }}
              >
                {isLoading ? 'Thinking…' : 'Send'}
              </Button>
            </Stack>
          </Box>
        </Paper>

        <Card
          elevation={0}
          sx={{
            mt: 2,
            flexShrink: 0,
            borderRadius: 3,
            border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
            background: mode === 'dark' ? 'rgba(6,10,13,0.45)' : 'rgba(255,255,255,0.72)',
          }}
        >
          <Box sx={{ p: 2.25 }}>
            <Typography variant="overline" sx={{ color: theme.palette.text.secondary, letterSpacing: '0.12em', fontWeight: 700 }}>
              Stack
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
              {['Llama 3 · Ollama', 'FastAPI RAG', 'FAISS', 'Spring /ask'].map((label) => (
                <Chip
                  key={label}
                  label={label}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    background: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(34,197,94,0.08)',
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}