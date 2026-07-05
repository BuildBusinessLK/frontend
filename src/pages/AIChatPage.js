import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AddCommentRoundedIcon from '@mui/icons-material/AddCommentRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import WebIcon from '@mui/icons-material/Web';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';
import { AssistantFormattedText } from '../utils/assistantTextFormat.jsx';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';
import { useChatPageTopPadding } from '../hooks/useDashboardLayoutPadding';
import {
  createChatSession,
  deleteChatSession,
  fetchChatMessages,
  fetchChatSessions,
  sendChatMessage,
} from '../services/chatApi';

const SUGGESTIONS = [
  { label: '🥥 Exports', query: 'Explain the coconut export process for a small Sri Lankan SME.' },
  { label: '📢 Marketing', query: 'What low-cost marketing ideas fit rural kithul producers?' },
  { label: '🏛️ Support', query: 'What government institutions support coconut SMEs in Sri Lanka?' },
  { label: '🌐 Website', query: 'How can I build an online presence for my palmyrah business?' },
  { label: '💰 Pricing', query: 'What are typical price ranges for coconut oil exports from Sri Lanka?' },
];

const fmtTime = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

function TypingIndicator({ mode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        py: 1,
        borderRadius: 2,
        background: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        width: 'fit-content',
        mb: 1.5,
      }}
    >
      <SmartToyRoundedIcon sx={{ fontSize: 16, color: '#22C55E', opacity: 0.8 }} />
      <Stack direction="row" spacing={0.5} alignItems="center">
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#22C55E',
              animation: 'bounce 1.2s infinite',
              animationDelay: `${i * 0.2}s`,
              '@keyframes bounce': {
                '0%, 80%, 100%': { transform: 'translateY(0)' },
                '40%': { transform: 'translateY(-5px)' },
              },
            }}
          />
        ))}
      </Stack>
      <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
        Thinking…
      </Typography>
    </Box>
  );
}

export default function AIChatPage() {
  const { mode } = useThemeMode();
  const { token } = useAuth();
  const navigate = useNavigate();
  const topPad = useChatPageTopPadding();

  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);
  const [sendError, setSendError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const listEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () =>
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  const loadSessions = useCallback(async () => {
    try {
      const list = await fetchChatSessions(token);
      setFetchError('');
      setSessions(list);
      return list;
    } catch (error) {
      setFetchError(error.message || 'Unable to load chat sessions.');
      setSessions([]);
      return [];
    }
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBootLoading(true);
      try {
        const list = await loadSessions();
        if (cancelled) return;
        if (list.length) setSessionId((prev) => prev ?? list[0].id);
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setBootLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [loadSessions]);

  useEffect(() => {
    if (!sessionId || !token) { setMessages([]); return; }
    let cancelled = false;
    (async () => {
      try {
        const m = await fetchChatMessages(token, sessionId);
        if (!cancelled) setMessages(m);
      } catch {
        if (!cancelled) setMessages([]);
      }
    })();
    return () => { cancelled = true; };
  }, [sessionId, token]);

  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  const onNewChat = async () => {
    setSendError('');
    try {
      const s = await createChatSession(token, 'New chat');
      await loadSessions();
      setSessionId(s.id);
      setMessages([]);
      inputRef.current?.focus();
    } catch (error) {
      setSendError(error.message || 'Unable to create chat session.');
    }
  };

  const onDeleteSession = async (event, chatId) => {
    event?.stopPropagation();
    if (!chatId || !token) return;
    setSendError('');
    try {
      await deleteChatSession(token, chatId);
      const refreshed = await loadSessions();
      const nextSession = refreshed[0]?.id ?? null;
      if (sessionId === chatId) {
        setSessionId(nextSession);
        setMessages([]);
      }
      if (!refreshed.length) {
        setSessionId(null);
        setMessages([]);
      }
    } catch (error) {
      setSendError(error.message || 'Unable to delete chat session.');
    }
  };

  const onSend = async (text) => {
    const q = (text ?? input).trim();
    if (!q || loading || !token) return;
    setInput('');
    setSendError('');
    setLoading(true);
    const optimistic = [
      ...messages,
      {
        id: `tmp-${Date.now()}`,
        sender: 'USER',
        message: q,
        createdAt: new Date().toISOString(),
      },
    ];
    setMessages(optimistic);
    try {
      const res = await sendChatMessage(token, { sessionId, question: q });
      const sid = res.sessionId || sessionId;
      if (res.sessionId && res.sessionId !== sessionId) setSessionId(res.sessionId);
      const fresh = await fetchChatMessages(token, sid);
      setMessages(fresh);
      await loadSessions();
    } catch (e) {
      setMessages((prev) => prev.filter((m) => !String(m.id).startsWith('tmp-')));
      setSendError(e.message || 'Message failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sessionTitle = useMemo(() => {
    const s = sessions.find((x) => x.id === sessionId);
    return s?.title || 'AI assistant';
  }, [sessions, sessionId]);

  const hasMessages = messages.length > 0;

  return (
    <Box sx={{ ...topPad, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 2 }}>
        AI Assistant
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
        {/* Sidebar — sessions */}
        <Card
          sx={{
            width: { xs: '100%', md: 260 },
            flexShrink: 0,
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddCommentRoundedIcon />}
              onClick={onNewChat}
              sx={{
                mb: 1.5,
                borderRadius: 2,
                fontWeight: 700,
                background: 'linear-gradient(135deg,#22C55E,#16A34A)',
              }}
            >
              New chat
            </Button>
            <Divider sx={{ mb: 1 }} />
            {fetchError ? (
              <Typography
                variant="caption"
                sx={{ color: 'error.main', textAlign: 'center', display: 'block', mb: 1 }}
              >
                {fetchError}
              </Typography>
            ) : null}
            {bootLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                <CircularProgress size={22} />
              </Box>
            ) : sessions.length === 0 ? (
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', textAlign: 'center', mt: 2, display: 'block' }}
              >
                No chats yet. Start a new one!
              </Typography>
            ) : (
              <List dense disablePadding sx={{ flex: 1, overflow: 'auto', maxHeight: 380 }}>
                {sessions.map((s) => (
                  <ListItemButton
                    key={s.id}
                    selected={s.id === sessionId}
                    onClick={() => setSessionId(s.id)}
                    sx={{ borderRadius: 2, mb: 0.5, pr: 1 }}
                  >
                    <ListItemText
                      primary={s.title || `Chat ${s.id}`}
                      secondary={fmtTime(s.createdAt)}
                      primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600, noWrap: true }}
                      secondaryTypographyProps={{ fontSize: '0.75rem' }}
                    />
                    <Tooltip title="Delete chat">
                      <span>
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={(event) => onDeleteSession(event, s.id)}
                          sx={{ ml: 0.5, color: 'text.secondary' }}
                        >
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </ListItemButton>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Main chat area */}
        <Card sx={{ flex: 1, borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
          <CardContent
            sx={{
              p: { xs: 2, sm: 3 },
              display: 'flex',
              flexDirection: 'column',
              minHeight: 520,
              flex: 1,
            }}
          >
            {/* Session title */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 2, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
            >
              <SmartToyRoundedIcon sx={{ color: '#22C55E', fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                {sessionTitle}
              </Typography>
              <Chip
                label="Coconut · Kithul · Palmyrah"
                size="small"
                sx={{
                  ml: 'auto',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  color: '#22C55E',
                  background: 'rgba(34,197,94,0.1)',
                }}
              />
            </Stack>

            {/* Suggestion chips — shown only when no messages */}
            {!hasMessages && !loading && (
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1.5 }}>
                  <AutoAwesomeIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Suggested questions
                  </Typography>
                </Stack>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {SUGGESTIONS.map((s) => (
                    <Chip
                      key={s.label}
                      label={s.label}
                      onClick={() => onSend(s.query)}
                      disabled={loading}
                      clickable
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        borderRadius: 999,
                        border: '1px solid',
                        borderColor:
                          mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
                        background:
                          mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                        '&:hover': {
                          background: 'rgba(34,197,94,0.1)',
                          borderColor: '#22C55E',
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Empty state */}
            {!hasMessages && !loading && (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.45,
                  pb: 4,
                }}
              >
                <SmartToyRoundedIcon sx={{ fontSize: 52, mb: 1.5 }} />
                <Typography variant="body2" textAlign="center">
                  Ask about coconut, kithul, or palmyrah businesses
                </Typography>
              </Box>
            )}

            {/* Messages */}
            <Box sx={{ flex: 1, overflow: 'auto', pr: 0.5 }}>
              {messages.map((m) => {
                const isUser = m.sender === 'USER';
                return (
                  <Box
                    key={m.id}
                    sx={{
                      mb: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '88%',
                        px: 2,
                        py: 1.25,
                        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: isUser
                          ? 'linear-gradient(135deg,#22C55E,#16A34A)'
                          : mode === 'dark'
                          ? 'rgba(255,255,255,0.07)'
                          : 'rgba(0,0,0,0.04)',
                        boxShadow: isUser
                          ? '0 4px 14px rgba(34,197,94,0.25)'
                          : '0 2px 8px rgba(0,0,0,0.06)',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          opacity: 0.7,
                          display: 'block',
                          mb: 0.5,
                          color: isUser ? 'rgba(255,255,255,0.85)' : 'text.secondary',
                        }}
                      >
                        {isUser ? 'You' : 'Assistant'} · {fmtTime(m.createdAt)}
                      </Typography>
                      {m.sender === 'AI' ? (
                        <AssistantFormattedText text={m.message || ''} />
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: 'pre-wrap', color: '#FFFFFF', fontWeight: 500 }}
                        >
                          {m.message}
                        </Typography>
                      )}
                      {m.sender === 'AI' && m.action === 'GENERATE_WEBSITE' && (
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<WebIcon />}
                          onClick={() => navigate(ROUTES.marketing.websiteTemplates)}
                          sx={{
                            mt: 1.5,
                            borderRadius: 999,
                            fontSize: '0.78rem',
                            background: 'linear-gradient(135deg,#22C55E,#16A34A)',
                            boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
                          }}
                        >
                          Create website
                        </Button>
                      )}
                      {m.sender === 'AI' && m.action === 'VIEW_PROFILE' && (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<PersonRoundedIcon />}
                          onClick={() => navigate(ROUTES.businessProfile)}
                          sx={{ mt: 1.5, borderRadius: 999, fontSize: '0.78rem' }}
                        >
                          Edit business profile
                        </Button>
                      )}
                    </Box>
                  </Box>
                );
              })}

              {loading && <TypingIndicator mode={mode} />}
              {sendError && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
                  {sendError}
                </Typography>
              )}
              <div ref={listEndRef} />
            </Box>

            {/* Input row */}
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                inputRef={inputRef}
                placeholder="Ask about coconut, kithul, or palmyrah…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSend();
                  }
                }}
                multiline
                minRows={1}
                maxRows={5}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
              <Tooltip title="Send (Enter)">
                <span>
                  <IconButton
                    color="primary"
                    onClick={() => onSend()}
                    disabled={loading || !input.trim()}
                    sx={{
                      width: 48,
                      height: 48,
                      background:
                        !loading && input.trim()
                          ? 'linear-gradient(135deg,#22C55E,#16A34A)'
                          : undefined,
                      color: !loading && input.trim() ? '#fff' : undefined,
                      borderRadius: 3,
                      '&:hover': {
                        background:
                          !loading && input.trim()
                            ? 'linear-gradient(135deg,#16A34A,#15803D)'
                            : undefined,
                      },
                      transition: 'all 0.18s',
                    }}
                  >
                    {loading ? <CircularProgress size={20} /> : <SendRoundedIcon />}
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
