import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import { useThemeMode } from '../contexts/ThemeContext';

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    text: 'Hi, I can help you draft marketing ideas, answer customer questions, and plan campaigns.',
  },
  {
    id: 2,
    role: 'user',
    text: 'Can you help me grow my local business?',
  },
  {
    id: 3,
    role: 'assistant',
    text: 'Yes. Start with a simple landing page, consistent social posts, and an email follow-up flow.',
  },
];

export default function AIChatPage() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');

  const handleSend = () => {
    const nextText = draft.trim();
    if (!nextText) {
      return;
    }

    setMessages((current) => [
      ...current,
      { id: Date.now(), role: 'user', text: nextText },
      {
        id: Date.now() + 1,
        role: 'assistant',
        text: 'I can help with that. Try breaking it into a goal, an audience, and a simple next step.',
      },
    ]);
    setDraft('');
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
              Chat with the assistant
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, maxWidth: 680 }}>
              A simple ChatGPT-style workspace for quick prompts, follow-up ideas, and business guidance.
            </Typography>
          </Box>

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
                BuildBusinessLK Assistant
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ p: { xs: 2, md: 3 }, maxHeight: 520, overflowY: 'auto' }}>
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
                          maxWidth: '80%',
                          px: 2.2,
                          py: 1.5,
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
                            color: isUser
                              ? '#FFFFFF'
                              : theme.palette.text.primary,
                            lineHeight: 1.7,
                            fontSize: '0.98rem',
                          }}
                        >
                          {message.text}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
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
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Ask about marketing, content, or customer outreach..."
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
                  endIcon={<SendIcon />}
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
                  Send
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}