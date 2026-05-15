import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { useThemeMode } from '../contexts/ThemeContext';
import { AssistantFormattedText } from '../utils/assistantTextFormat';

const SPRING_BACKEND_BASE_URL =
  process.env.REACT_APP_SPRING_BACKEND_BASE_URL || 'http://localhost:8083';

const CHAT_COLUMN_PX = 720;

const ENGINE_ACCENT = 'linear-gradient(135deg, #16A34A, #22C55E)';
const ENGINE_FROM = '#16A34A';
const ENGINE_TO = '#22C55E';

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    text: 'Hi, I can help you understand the coconut industry trends, marketing, and business guidance. What would you like to know?',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

const SUGGESTIONS = [
  { label: 'Export process', query: 'Explain the coconut export process' },
  { label: 'Marketing channels', query: 'What marketing channels work best for coconut products?' },
  { label: 'Industry trends', query: 'What are the latest coconut industry trends?' },
  { label: 'Business support', query: 'What business support schemes are available for exporters?' },
];

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/* ─── Typing dots ─────────────────────────────────────── */
function TypingIndicator({ mode }) {
  const dotStyle = (delay) => ({
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: mode === 'dark' ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.25)',
    animation: 'havChatBlink 1.4s infinite both',
    animationDelay: delay,
  });
  return (
    <>
      <style>{`
        @keyframes havChatBlink {
          0%,80%,100% { opacity:.2; transform:translateY(0); }
          40%          { opacity:1;  transform:translateY(-3px); }
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

/* ─── Avatar ──────────────────────────────────────────── */
function Avatar({ isUser, mode }) {
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
          : ENGINE_ACCENT,
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
      {isUser ? 'You' : 'L3'}
    </Box>
  );
}

/* ─── Main Page ───────────────────────────────────────── */
export default function AIChatPageHavindu() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  /* auto-scroll */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const surfaceBg = isDark
    ? 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)'
    : 'rgba(255,255,255,0.90)';

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || isLoading) return;

    const userMsg = { id: Date.now(), role: 'user', text, time: getTime() };
    setMessages((cur) => [...cur, userMsg]);
    setDraft('');
    setIsLoading(true);

    try {
      const response = await fetch(`${SPRING_BACKEND_BASE_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });
      const data = await response.json();

      if (data.success) {
        setMessages((cur) => [
          ...cur,
          { id: Date.now() + 1, role: 'assistant', text: data.answer, time: getTime() },
        ]);
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch {
      setMessages((cur) => [
        ...cur,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
          time: getTime(),
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
        background: isDark
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
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* ── Header ── */}
        <Box
          sx={{
            mb: 2,
            p: { xs: 1.75, sm: 2.25 },
            borderRadius: 3,
            border: `0.5px solid ${borderColor}`,
            background: surfaceBg,
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            spacing={1}
          >
            <Box>
              <Typography
                sx={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', color: theme.palette.text.primary }}
              >
                AI Assistant
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary, display: 'block', mt: 0.25, lineHeight: 1.4 }}
              >
                Ask for coconut industry insights, marketing ideas, and business guidance.
              </Typography>
            </Box>

            {/* Engine badge + live pill */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  px: 1.5,
                  py: '6px',
                  borderRadius: 999,
                  border: `0.5px solid ${isDark ? `${ENGINE_TO}55` : `${ENGINE_TO}66`}`,
                  background: isDark
                    ? `linear-gradient(135deg, ${ENGINE_FROM}22, ${ENGINE_TO}22)`
                    : `linear-gradient(135deg, ${ENGINE_FROM}12, ${ENGINE_TO}12)`,
                  fontSize: '12px',
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: ENGINE_ACCENT,
                    flexShrink: 0,
                  }}
                />
                <PsychologyIcon sx={{ fontSize: 14, color: ENGINE_FROM }} />
                Llama 3
              </Box>

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
                    '@keyframes havLivePulse': {
                      '0%,100%': { opacity: 1 },
                      '50%': { opacity: 0.35 },
                    },
                    animation: 'havLivePulse 2s infinite',
                  }}
                />
                Live
              </Box>
            </Stack>
          </Stack>
        </Box>

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
              '&::-webkit-scrollbar-thumb': { background: borderColor, borderRadius: '99px' },
            }}
          >
            <Box sx={{ maxWidth: CHAT_COLUMN_PX, mx: 'auto' }}>
              {/* Date divider */}
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                <Box sx={{ flex: 1, height: '0.5px', background: borderColor }} />
                <Typography sx={{ fontSize: '11px', color: theme.palette.text.disabled, whiteSpace: 'nowrap' }}>
                  Today
                </Typography>
                <Box sx={{ flex: 1, height: '0.5px', background: borderColor }} />
              </Stack>

              {/* Intro banner with suggestion chips */}
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
                    background: ENGINE_ACCENT,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#fff',
                  }}
                >
                  <PsychologyIcon fontSize="small" />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{ fontSize: '13px', fontWeight: 600, color: theme.palette.text.primary, mb: 0.5 }}
                  >
                    Llama 3 Knowledge Engine
                  </Typography>
                  <Typography sx={{ fontSize: '12.5px', color: theme.palette.text.secondary, lineHeight: 1.55 }}>
                    You are connected to the Llama 3 knowledge engine via Spring Boot. Ask questions from the connected business knowledge base.
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1.25 }}>
                    {SUGGESTIONS.map((s) => (
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
                            borderColor: isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.18)',
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
                        {!isUser && <Avatar isUser={false} mode={mode} />}

                        <Box
                          sx={{
                            maxWidth: { xs: '88%', sm: '74%' },
                            px: 1.75,
                            py: 1.25,
                            borderRadius: isUser
                              ? '14px 4px 14px 14px'
                              : '4px 14px 14px 14px',
                            background: isUser
                              ? ENGINE_ACCENT
                              : isDark
                              ? 'rgba(255,255,255,0.06)'
                              : '#fff',
                            border: isUser ? 'none' : `0.5px solid ${borderColor}`,
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

                        {isUser && <Avatar isUser mode={mode} />}
                      </Box>

                      {/* Timestamp */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: isUser ? 'flex-end' : 'flex-start',
                          px: '38px',
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
                    <Avatar isUser={false} mode={mode} />
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
              {/* Unified input box */}
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
                <Box
                  component="textarea"
                  inputRef={inputRef}
                  value={draft}
                  disabled={isLoading}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask about coconut industry, exports, or market trends…"
                  rows={1}
                  sx={{
                    flex: 1,
                    fontFamily: 'inherit',
                    fontSize: '13.5px',
                    color: theme.palette.text.primary,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    lineHeight: 1.55,
                    maxHeight: '110px',
                    overflowY: 'auto',
                    py: '3px',
                    '&::placeholder': { color: theme.palette.text.disabled },
                    '&::-webkit-scrollbar': { width: '3px' },
                    '&::-webkit-scrollbar-thumb': { background: borderColor, borderRadius: '99px' },
                  }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 110) + 'px';
                  }}
                />

                <Box
                  component="button"
                  onClick={handleSend}
                  disabled={isLoading || !draft.trim()}
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '10px',
                    border: 'none',
                    background: ENGINE_ACCENT,
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

              {/* Footer */}
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
                      background: ENGINE_ACCENT,
                      flexShrink: 0,
                    }}
                  />
                  Ollama Llama 3
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}