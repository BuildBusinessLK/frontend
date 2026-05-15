import React, { useState, useRef, useEffect } from 'react';
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
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import WebIcon from '@mui/icons-material/Web';
import PsychologyIcon from '@mui/icons-material/Psychology';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';
import { AssistantFormattedText } from '../utils/assistantTextFormat';
import { ROUTES } from '../constants/routes';
import { useChatPageTopPadding } from '../hooks/useDashboardLayoutPadding';
import { authHeaders } from '../services/authApi';

const SPRING_BACKEND_BASE_URL =
  process.env.REACT_APP_SPRING_BACKEND_BASE_URL || 'http://localhost:8083';

const CHAT_COLUMN_PX = 720;

const ENGINE = {
  id: 'ask',
  title: 'Llama 3 Knowledge Engine',
  shortName: 'Llama · /ask',
  endpoint: `${SPRING_BACKEND_BASE_URL}/ask`,
  endpointLabel: '/ask',
  model: 'Ollama llama3',
  gradientFrom: '#16A34A',
  gradientTo: '#22C55E',
  accent: 'linear-gradient(135deg, #22C55E, #16A34A)',
  avatarLabel: 'L3',
  icon: <PsychologyIcon fontSize="small" />,
  intro:
    'You are using the knowledge engine backed by POST /ask (Spring Boot → Python). Ask about exports, marketing, or business support for coconut, kithul, and palmyra value chains.',
  description: 'Single-engine chat: only the /ask integration is wired from this UI — no /ai proxy.',
  placeholder: 'Ask about exports, marketing, pricing, or business support…',
  suggestions: [
    { label: 'Export process', query: 'Explain the coconut export process' },
    { label: 'Marketing channels', query: 'What marketing channels work best for rural SMEs?' },
    { label: 'Business support', query: 'What business support programs are available?' },
    { label: 'My website', query: 'I want to create a simple website for my SME' },
  ],
  requestBody: (text, conversationId) => ({ question: text, conversationId }),
  getAnswer: (data) => {
    if (data.success === false) {
      throw new Error(data.message || 'The /ask engine returned an error.');
    }
    return data.answer || data.response || data.message;
  },
};

const createInitialMessages = () => [{ id: 'ask-intro', role: 'assistant', text: ENGINE.intro }];

const createConversationId = () =>
  window.crypto?.randomUUID?.() ||
  `conversation-${Date.now()}-${Math.random().toString(16).slice(2)}`;

function messageSuggestsWebsite(text) {
  if (!text || typeof text !== 'string') return false;
  return /(website|web\s*site|landing\s*page|create\s+(a\s+)?site|build\s+(a\s+)?site|business\s+site|online\s+presence|need\s+a\s+site)/i.test(
    text,
  );
}

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/* ─── Typing indicator ─────────────────────────────────── */
function TypingIndicator({ mode }) {
  const dotStyle = (delay) => ({
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: mode === 'dark' ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.25)',
    animation: 'aiChatBlink 1.4s infinite both',
    animationDelay: delay,
  });

  return (
    <>
      <style>{`
        @keyframes aiChatBlink {
          0%,80%,100% { opacity: .2; transform: translateY(0); }
          40%          { opacity: 1;  transform: translateY(-3px); }
        }
      `}</style>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Box sx={dotStyle('0s')} />
        <Box sx={dotStyle('0.2s')} />
        <Box sx={dotStyle('0.4s')} />
      </Box>
    </>
  );
}

/* ─── Avatar ────────────────────────────────────────────── */
function Avatar({ label, gradient, isUser, mode }) {
  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.02em',
        background: isUser
          ? mode === 'dark'
            ? 'rgba(255,255,255,0.10)'
            : 'rgba(0,0,0,0.07)'
          : gradient,
        color: isUser
          ? mode === 'dark'
            ? 'rgba(255,255,255,0.5)'
            : 'rgba(0,0,0,0.4)'
          : '#fff',
        border: isUser
          ? `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'}`
          : 'none',
      }}
    >
      {label}
    </Box>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function AIChatPage() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();
  const contentTop = useChatPageTopPadding();

  const activeEngine = ENGINE;

  const [messages, setMessages] = useState(createInitialMessages);
  const [conversationId] = useState(createConversationId);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [websiteNudge, setWebsiteNudge] = useState(false);

  const isLoading = loading;
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const websiteAction = location.state?.action;
  const selectedTemplate = location.state?.template;
  const templateNames = {
    web1: 'Modern Gradient',
    web2: 'Professional Business',
    web3: 'Creative Portfolio',
    web4: 'Minimalist Clean',
    web5: 'E-Commerce Store',
    web6: 'Content Hub',
  };

  /* website-intent detection */
  useEffect(() => {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    setWebsiteNudge(lastUser ? messageSuggestsWebsite(lastUser.text) : false);
  }, [messages]);

  /* auto-scroll */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || isLoading) return;

    const engine = activeEngine;
    setMessages((cur) => [...cur, { id: Date.now(), role: 'user', text, time: getTime() }]);
    setDraft('');
    setLoading(true);

    try {
      const response = await fetch(engine.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(engine.requestBody(text, conversationId)),
      });
      const data = await response.json();
      const answer = engine.getAnswer(data);
      if (!answer) throw new Error('Empty AI response.');

      setMessages((cur) => [...cur, { id: Date.now() + 1, role: 'assistant', text: answer, time: getTime() }]);
    } catch {
      setMessages((cur) => [
        ...cur,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: `The ${engine.endpointLabel} engine is not responding right now. Please check the backend server and try again.`,
          time: getTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ── shared tokens ── */
  const isDark = mode === 'dark';
  const surfaceBg = isDark
    ? 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)'
    : 'rgba(255,255,255,0.90)';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        pt: contentTop,
        pb: { xs: 2, md: 3 },
        background: isDark
          ? 'radial-gradient(ellipse 120% 80% at 50% -20%, rgba(34,197,94,0.14), transparent 50%), linear-gradient(180deg, #050A0D 0%, #071116 100%)'
          : 'linear-gradient(180deg, #F8FBF9 0%, #EEF6F1 55%, #E8F5EC 100%)',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* ── Top bar ── */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            mb: 2,
            background: surfaceBg,
            border: `0.5px solid ${borderColor}`,
          }}
        >
          <CardContent sx={{ p: { xs: 1.75, sm: 2.25 }, '&:last-child': { pb: { xs: 1.75, sm: 2.25 } } }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
            >
              {/* Title + description */}
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', color: theme.palette.text.primary }}
                >
                  AI agent
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text.secondary, display: 'block', mt: 0.25, lineHeight: 1.4 }}
                >
                  {activeEngine.description}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 0 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    endIcon={<RocketLaunchRoundedIcon sx={{ fontSize: 16 }} />}
                    onClick={() => navigate(ROUTES.marketing2.studio)}
                    sx={{ mt: 1, borderRadius: 999, textTransform: 'none', fontSize: '12px', fontWeight: 700 }}
                  >
                    Website studio
                  </Button>
                </Stack>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
                {/* Live pill */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    px: 1.25,
                    py: '5px',
                    borderRadius: 999,
                    border: `0.5px solid ${borderColor}`,
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    fontSize: '11px',
                    color: theme.palette.text.secondary,
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#22C55E',
                      '@keyframes livePulse': {
                        '0%,100%': { opacity: 1 },
                        '50%': { opacity: 0.35 },
                      },
                      animation: 'livePulse 2s infinite',
                    }}
                  />
                  Live
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* ── Chat area ── */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Scroll area */}
          <Box
            ref={scrollRef}
            sx={{
              flex: 1,
              minHeight: { xs: 360, md: 420 },
              overflowY: 'auto',
              scrollBehavior: 'smooth',
              px: { xs: 2, sm: 2.5 },
              py: 2.5,
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': {
                background: borderColor,
                borderRadius: '99px',
              },
            }}
          >
            <Box sx={{ maxWidth: CHAT_COLUMN_PX, mx: 'auto' }}>
              {/* Date separator */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{ mb: 2.5 }}
              >
                <Box sx={{ flex: 1, height: '0.5px', background: borderColor }} />
                <Typography sx={{ fontSize: '11px', color: theme.palette.text.disabled, whiteSpace: 'nowrap' }}>
                  Today
                </Typography>
                <Box sx={{ flex: 1, height: '0.5px', background: borderColor }} />
              </Stack>

              {/* Intro banner */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'flex-start',
                  p: 2,
                  mb: 2.5,
                  borderRadius: 2.5,
                  border: `0.5px solid ${borderColor}`,
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)',
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: activeEngine.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#fff',
                  }}
                >
                  {activeEngine.icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: theme.palette.text.primary, mb: 0.5 }}>
                    {activeEngine.title}
                  </Typography>
                  <Typography sx={{ fontSize: '12.5px', color: theme.palette.text.secondary, lineHeight: 1.55 }}>
                    {activeEngine.intro}
                  </Typography>
                  {/* Suggestion chips */}
                  <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1.25 }}>
                    {activeEngine.suggestions.map((s) => (
                      <Box
                        key={s.label}
                        component="button"
                        onClick={() => {
                          setDraft(s.query);
                          inputRef.current?.focus();
                        }}
                        sx={{
                          px: 1.25,
                          py: '5px',
                          borderRadius: 999,
                          border: `0.5px solid ${borderColor}`,
                          background: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
                          fontSize: '11.5px',
                          color: theme.palette.text.secondary,
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          transition: 'all 0.15s',
                          '&:hover': {
                            color: theme.palette.text.primary,
                            borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.18)',
                          },
                        }}
                      >
                        {s.label}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>

              {/* Messages */}
              <Stack spacing={0.5}>
                {messages.map((message) => {
                  const isUser = message.role === 'user';
                  return (
                    <Box key={message.id}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: isUser ? 'flex-end' : 'flex-start',
                          alignItems: 'flex-end',
                          gap: 1,
                          mb: 0.25,
                        }}
                      >
                        {!isUser && (
                          <Avatar
                            label={activeEngine.avatarLabel}
                            gradient={activeEngine.accent}
                            isUser={false}
                            mode={mode}
                          />
                        )}

                        <Box
                          sx={{
                            maxWidth: { xs: '88%', sm: '74%' },
                            px: 1.75,
                            py: 1.25,
                            borderRadius: isUser
                              ? '14px 4px 14px 14px'
                              : '4px 14px 14px 14px',
                            background: isUser
                              ? activeEngine.accent
                              : isDark
                              ? 'rgba(255,255,255,0.06)'
                              : '#fff',
                            border: isUser
                              ? 'none'
                              : `0.5px solid ${borderColor}`,
                            color: isUser ? '#fff' : theme.palette.text.primary,
                            lineHeight: 1.65,
                            '& p': { mb: 0 },
                          }}
                        >
                          {isUser ? (
                            <Typography sx={{ fontSize: '13.5px', whiteSpace: 'pre-wrap' }}>
                              {message.text}
                            </Typography>
                          ) : (
                            <AssistantFormattedText text={message.text} theme={theme} />
                          )}
                        </Box>

                        {isUser && (
                          <Avatar label="You" isUser mode={mode} />
                        )}
                      </Box>

                      {/* Timestamp */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: isUser ? 'flex-end' : 'flex-start',
                          px: isUser ? '38px' : '38px',
                          mb: 1.5,
                        }}
                      >
                        <Typography sx={{ fontSize: '10px', color: theme.palette.text.disabled }}>
                          {message.time || ''}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}

                {/* Typing indicator */}
                {isLoading && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mb: 1.5 }}>
                    <Avatar
                      label={activeEngine.avatarLabel}
                      gradient={activeEngine.accent}
                      isUser={false}
                      mode={mode}
                    />
                    <Box
                      sx={{
                        px: 1.75,
                        py: 1.25,
                        borderRadius: '4px 14px 14px 14px',
                        border: `0.5px solid ${borderColor}`,
                        background: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
                      }}
                    >
                      <TypingIndicator mode={mode} />
                    </Box>
                  </Box>
                )}
              </Stack>
            </Box>
          </Box>

          {/* ── Composer ── */}
          <Box
            sx={{
              flexShrink: 0,
              px: { xs: 2, sm: 2.5 },
              pt: 1.5,
              pb: { xs: 2, sm: 2.25 },
              borderTop: `0.5px solid ${borderColor}`,
              background: isDark ? 'rgba(7,12,16,0.72)' : 'rgba(255,255,255,0.80)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <Box sx={{ maxWidth: CHAT_COLUMN_PX, mx: 'auto' }}>
              {websiteNudge && (
                <Card
                  elevation={0}
                  sx={{
                    mb: 1.25,
                    borderRadius: 2.5,
                    border: '1px solid rgba(34,197,94,0.35)',
                    background: isDark ? 'rgba(34,197,94,0.09)' : 'rgba(34,197,94,0.06)',
                  }}
                >
                  <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: '#fff',
                        }}
                      >
                        <WebIcon sx={{ fontSize: 22 }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '14px' }}>Create your business website</Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                          Open the SME studio — generate, preview, and host on BuildBusinessLK in a few steps.
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="medium"
                        endIcon={<ArrowForwardRoundedIcon />}
                        onClick={() => navigate(ROUTES.marketing2.studio)}
                        sx={{
                          flexShrink: 0,
                          borderRadius: 999,
                          px: 2,
                          fontWeight: 800,
                          fontSize: '12px',
                          background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                          boxShadow: '0 8px 20px rgba(34,197,94,0.25)',
                        }}
                      >
                        Open
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              )}
              {/* Input row */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 1,
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  border: `0.5px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'}`,
                  borderRadius: 2.5,
                  px: 1.5,
                  py: 1,
                  transition: 'border-color 0.15s',
                  '&:focus-within': {
                    borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.22)',
                  },
                }}
              >
                <TextField
                  inputRef={inputRef}
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={5}
                  value={draft}
                  disabled={isLoading}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={activeEngine.placeholder}
                  variant="standard"
                  sx={{
                    '& .MuiInput-root': {
                      fontSize: '13.5px',
                      color: theme.palette.text.primary,
                      '&:before': { display: 'none' },
                      '&:after': { display: 'none' },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: theme.palette.text.disabled,
                      opacity: 1,
                    },
                  }}
                />

                {/* Send button */}
                <Box
                  component="button"
                  onClick={handleSend}
                  disabled={isLoading || !draft.trim()}
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '10px',
                    border: 'none',
                    background: activeEngine.accent,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'opacity 0.15s, transform 0.1s',
                    opacity: isLoading || !draft.trim() ? 0.38 : 1,
                    '&:not(:disabled):active': { transform: 'scale(0.93)' },
                    '&:disabled': { cursor: 'default' },
                  }}
                >
                  <SendIcon sx={{ fontSize: 15, color: '#fff' }} />
                </Box>
              </Box>

              {/* Footer row */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mt: 1, px: 0.5 }}
              >
                <Typography sx={{ fontSize: '11px', color: theme.palette.text.disabled }}>
                  Enter to send · Shift+Enter for new line
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    px: 1.25,
                    py: '4px',
                    borderRadius: 999,
                    border: `0.5px solid ${borderColor}`,
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    fontSize: '11px',
                    color: theme.palette.text.secondary,
                  }}
                >
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: activeEngine.accent,
                      flexShrink: 0,
                    }}
                  />
                  {activeEngine.shortName}
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* ── Website CTA ── */}
        {websiteAction === 'create-website' && selectedTemplate && (
          <Card
            elevation={0}
            sx={{
              mt: 2,
              borderRadius: 3,
              border: '0.5px solid rgba(34,197,94,0.30)',
              background: isDark ? 'rgba(34,197,94,0.07)' : 'rgba(34,197,94,0.05)',
            }}
          >
            <CardContent sx={{ p: 2.25, '&:last-child': { pb: 2.25 } }}>
              <Stack spacing={1.25}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <WebIcon sx={{ color: '#22C55E', fontSize: 20 }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '13.5px' }}>
                    Create website with AI
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Template: <strong>{templateNames[selectedTemplate]}</strong>. Continue to generate your site.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate(ROUTES.generatedWebsite, {
                        state: { template: selectedTemplate, templateName: templateNames[selectedTemplate] },
                      })
                    }
                    sx={{
                      borderRadius: 999,
                      py: 1,
                      px: 2.5,
                      fontSize: '13px',
                      background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                      boxShadow: '0 8px 20px rgba(34,197,94,0.22)',
                    }}
                  >
                    Create my website
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(ROUTES.marketing.websiteTemplates)}
                    sx={{ borderRadius: 999, py: 1, fontSize: '13px' }}
                  >
                    Change template
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}