import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import WebIcon from '@mui/icons-material/Web';
import AddCommentRoundedIcon from '@mui/icons-material/AddCommentRounded';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';
import { AssistantFormattedText } from '../utils/assistantTextFormat';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';
import { useChatPageTopPadding } from '../hooks/useDashboardLayoutPadding';
import {
  createChatSession,
  fetchChatMessages,
  fetchChatSessions,
  sendChatMessage,
} from '../services/chatApi';

const SUGGESTIONS = [
  { label: 'Exports', query: 'Explain the coconut export process for a small Sri Lankan SME.' },
  { label: 'Marketing', query: 'What low-cost marketing ideas fit rural kithul producers?' },
  { label: 'Support', query: 'What institutions support coconut sector SMEs in Sri Lanka?' },
  { label: 'Website', query: 'How can I improve my online presence with a simple website?' },
];

const fmtTime = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

export default function AIAssistantPage() {
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
  const listEndRef = useRef(null);

  const scrollToBottom = () => listEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  const loadSessions = useCallback(async () => {
    const list = await fetchChatSessions(token);
    setSessions(list);
    return list;
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBootLoading(true);
      try {
        const list = await loadSessions();
        if (cancelled) return;
        if (list.length) {
          setSessionId((prev) => prev ?? list[0].id);
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setBootLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadSessions]);

  useEffect(() => {
    if (!sessionId || !token) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const m = await fetchChatMessages(token, sessionId);
        if (!cancelled) setMessages(m);
      } catch {
        if (!cancelled) setMessages([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const onNewChat = async () => {
    const s = await createChatSession(token, 'New chat');
    await loadSessions();
    setSessionId(s.id);
    setMessages([]);
  };

  const onSend = async (text) => {
    const q = (text ?? input).trim();
    if (!q || loading || !token) return;
    setInput('');
    setLoading(true);
    const optimistic = [...messages, { id: `tmp-${Date.now()}`, sender: 'USER', message: q, createdAt: new Date().toISOString() }];
    setMessages(optimistic);
    try {
      const res = await sendChatMessage(token, { sessionId, question: q });
      const sid = res.sessionId || sessionId;
      if (res.sessionId && res.sessionId !== sessionId) {
        setSessionId(res.sessionId);
      }
      const fresh = await fetchChatMessages(token, sid);
      setMessages(fresh);
      await loadSessions();
    } catch (e) {
      setMessages((prev) => prev.filter((m) => !String(m.id).startsWith('tmp-')));
      // eslint-disable-next-line no-alert
      window.alert(e.message || 'Chat failed');
    } finally {
      setLoading(false);
    }
  };

  const sessionTitle = useMemo(() => {
    const s = sessions.find((x) => x.id === sessionId);
    return s?.title || 'AI assistant';
  }, [sessions, sessionId]);

  return (
    <Box sx={{ ...topPad, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 2 }}>
        AI assistant
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
        <Card sx={{ width: { xs: '100%', md: 260 }, flexShrink: 0, borderRadius: 3 }}>
          <CardContent sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddCommentRoundedIcon />}
              onClick={onNewChat}
              sx={{ mb: 1, borderRadius: 2, fontWeight: 700 }}
            >
              New chat
            </Button>
            <Divider sx={{ my: 1 }} />
            {bootLoading ? (
              <CircularProgress size={24} />
            ) : (
              <List dense sx={{ maxHeight: 360, overflow: 'auto' }}>
                {sessions.map((s) => (
                  <ListItemButton
                    key={s.id}
                    selected={s.id === sessionId}
                    onClick={() => {
                      setSessionId(s.id);
                    }}
                  >
                    <ListItemText primary={s.title || `Session ${s.id}`} secondary={fmtTime(s.createdAt)} />
                  </ListItemButton>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 2.5 }, display: 'flex', flexDirection: 'column', minHeight: 480 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
              {sessionTitle}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
              {SUGGESTIONS.map((s) => (
                <Button
                  key={s.label}
                  size="small"
                  variant="outlined"
                  onClick={() => onSend(s.query)}
                  disabled={loading}
                  sx={{ borderRadius: 999, textTransform: 'none' }}
                >
                  {s.label}
                </Button>
              ))}
            </Stack>

            <Box sx={{ flex: 1, overflow: 'auto', pr: 0.5, mb: 2 }}>
              {messages.map((m) => (
                <Box
                  key={m.id}
                  sx={{
                    mb: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: m.sender === 'USER' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '92%',
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      bgcolor:
                        m.sender === 'USER'
                          ? mode === 'dark'
                            ? 'rgba(34,197,94,0.15)'
                            : 'rgba(34,197,94,0.12)'
                          : mode === 'dark'
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(0,0,0,0.04)',
                    }}
                  >
                    <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mb: 0.25 }}>
                      {m.sender === 'USER' ? 'You' : 'Assistant'} · {fmtTime(m.createdAt)}
                    </Typography>
                    {m.sender === 'AI' ? (
                      <AssistantFormattedText text={m.message || ''} />
                    ) : (
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {m.message}
                      </Typography>
                    )}
                    {m.sender === 'AI' && m.action === 'GENERATE_WEBSITE' && (
                      <Button
                        size="small"
                        variant="contained"
                        sx={{ mt: 1, borderRadius: 2 }}
                        startIcon={<WebIcon />}
                        onClick={() => navigate(ROUTES.marketing.website)}
                      >
                        Generate website
                      </Button>
                    )}
                  </Box>
                </Box>
              ))}
              {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
                  <CircularProgress size={18} />
                  <Typography variant="body2" color="text.secondary">
                    Thinking…
                  </Typography>
                </Box>
              )}
              <div ref={listEndRef} />
            </Box>

            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                placeholder="Ask about coconut, kithul, or palmyrah SMEs…"
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
                maxRows={4}
              />
              <Button
                variant="contained"
                onClick={() => onSend()}
                disabled={loading || !input.trim()}
                sx={{ minWidth: 48, px: 2, borderRadius: 2 }}
              >
                <SendIcon />
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
