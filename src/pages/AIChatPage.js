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
import EmailIcon from '@mui/icons-material/Email';
import CampaignIcon from '@mui/icons-material/Campaign';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';
import { AssistantFormattedText } from '../utils/assistantTextFormat.jsx';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';
import { useChatPageTopPadding } from '../hooks/useDashboardLayoutPadding';
import {
  deleteChatSession,
  fetchChatMessages,
  fetchChatSessions,
  sendChatMessage,
  getBusinessRecommendation,
} from '../services/chatApi';
import { fetchBusinesses } from '../services/businessApi';
import BusinessRecommendationDialog from '../components/BusinessRecommendationDialog';
import MLRecommendationCard from '../components/MLRecommendationCard';
import EmailCampaignCard from '../components/EmailCampaignCard';

const SUGGESTION_CATEGORIES = [
  {
    category: '🥥 Exports',
    queries: [
      'Explain the coconut export registration process via the Coconut Development Authority (CDA).',
      'What certifications are required to export kithul treacle to European and Middle Eastern markets?',
      'How do I calculate freight and export packaging costs for palmyrah handicraft exports?',
      'What are the mandatory quality standards for exporting virgin coconut oil (VCO)?',
    ],
  },
  {
    category: '📢 Marketing',
    queries: [
      'What low-cost digital marketing ideas work best for rural kithul producers?',
      'How can I brand my organic coconut products to appeal to urban Sri Lankan consumers?',
      'What are effective social media campaign ideas for launching a palmyrah jaggery line?',
      'How do I create local retailer partnerships and grocery distribution in Colombo?',
    ],
  },
  {
    category: '🌐 Website & Store',
    queries: [
      'How can I build an online store for my coconut and kithul value-added products?',
      'What key sections and trust badges should my SME business website include?',
      'How can I use BuildBusinessLK to launch a professional website for my business?',
      'How do I integrate WhatsApp ordering and direct delivery on my product website?',
    ],
  },
  {
    category: '🏛️ Support & Grants',
    queries: [
      'What government grants and subsidies exist for coconut and palmyrah processors in Sri Lanka?',
      'How does the Palmyrah Development Board (PDB) support small manufacturing businesses?',
      'What low-interest SME bank loans are available for agro-processing machinery?',
      'How do I register my enterprise with the Export Development Board (EDB)?',
    ],
  },
  {
    category: '💰 Pricing & Profit',
    queries: [
      'What are typical wholesale and retail price ranges for pure kithul syrup in Sri Lanka?',
      'How should I calculate profit margins when selling coconut oil in 500ml glass jars?',
      'What is the initial capital investment required for a small-scale palmyrah sweet workshop?',
      'How can I reduce packaging and glass bottle costs for small batch production?',
    ],
  },
  {
    category: '⚙️ Quality & Fit',
    queries: [
      'How do I prevent fermentation and extend the shelf life of pure kithul treacle?',
      'What machinery is required for small-scale desiccated coconut processing?',
      'How can I test moisture content and purity in coconut copra and oil?',
      'What are good manufacturing practices (GMP) for artisanal agro-food producers?',
    ],
  },
];

function getRandomSuggestions() {
  return SUGGESTION_CATEGORIES.map((cat) => ({
    label: cat.category,
    query: cat.queries[Math.floor(Math.random() * cat.queries.length)],
  }));
}

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
  const [showRecommendationDialog, setShowRecommendationDialog] = useState(false);
  const [recDialogError, setRecDialogError] = useState('');
  const [businessSector, setBusinessSector] = useState('coconut');
  const [suggestions, setSuggestions] = useState(() => getRandomSuggestions());
  const [recommendationResult, setRecommendationResult] = useState(null);
  const abortControllerRef = useRef(null);
  const [copiedId, setCopiedId] = useState(null);
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

  // Instant New Chat with 0ms network latency — lazily creates session on 1st message
  const onNewChat = () => {
    setSendError('');
    setSessionId(null);
    setMessages([]);
    setSuggestions(getRandomSuggestions());
    inputRef.current?.focus();
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

  const onStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
  };

  const onSend = async (text) => {
    const q = (text ?? input).trim();
    if (!q || loading || !token) return;
    setInput('');
    setSendError('');
    setLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

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
      const res = await sendChatMessage(token, { sessionId, question: q }, controller.signal);
      const sid = res.sessionId || sessionId;
      if (res.sessionId && res.sessionId !== sessionId) setSessionId(res.sessionId);
      const fresh = await fetchChatMessages(token, sid);
      if (res.recommendation && fresh && fresh.length > 0) {
        const updated = [...fresh];
        const lastIdx = updated.length - 1;
        if (updated[lastIdx].sender === 'AI') {
          updated[lastIdx] = {
            ...updated[lastIdx],
            recommendation: res.recommendation,
            type: res.type,
          };
        }
        setMessages(updated);
      } else {
        setMessages(fresh);
      }
      await loadSessions();
    } catch (e) {
      if (e.name === 'AbortError') {
        // Stop requested by user; preserve optimistic prompt
        return;
      }
      setMessages((prev) => prev.filter((m) => !String(m.id).startsWith('tmp-')));
      setSendError(e.message || 'Message failed. Please try again.');
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleQuickAction = (actionText) => {
    onSend(actionText);
  };

  const handleCopyMessage = async (msgId, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleRetry = (aiMsgIndex) => {
    // Find the closest preceding user message
    for (let i = aiMsgIndex - 1; i >= 0; i--) {
      if (messages[i]?.sender === 'USER') {
        onSend(messages[i].message);
        break;
      }
    }
  };

  const onGetRecommendation = async () => {
    if (!token) {
      setSendError('You must be signed in to get a recommendation.');
      return;
    }
    try {
      const businesses = await fetchBusinesses(token);
      if (businesses && businesses.length > 0) {
        setBusinessSector(businesses[0].sector?.toLowerCase() || 'coconut');
      }
    } catch {
      setBusinessSector('coconut');
    }
    setRecDialogError('');
    setShowRecommendationDialog(true);
  };

  const onRecommendationSubmit = async (profileData) => {
    if (!token) return;
    setLoading(true);
    setRecDialogError('');
    try {
      const rec = await getBusinessRecommendation(token, sessionId, null, profileData);
      if (rec.message && !rec.recommendedBusiness && (!rec.recommendations || !rec.recommendations.length)) {
        setRecDialogError(rec.message);
        setLoading(false);
        return;
      }
      setShowRecommendationDialog(false);
      setRecommendationResult(rec);
      const sid = rec.sessionId || sessionId;
      if (sid) {
        setSessionId(sid);
        const fresh = await fetchChatMessages(token, sid);
        if (fresh && fresh.length > 0) {
          const updated = [...fresh];
          const lastIdx = updated.length - 1;
          if (updated[lastIdx].sender === 'AI') {
            updated[lastIdx] = {
              ...updated[lastIdx],
              recommendation: rec,
            };
          }
          setMessages(updated);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: `rec-user-${Date.now()}`,
              sender: 'USER',
              message: 'Which product suits my business profile best?',
              createdAt: new Date().toISOString(),
            },
            {
              id: `rec-ai-${Date.now() + 1}`,
              sender: 'AI',
              message: `Here is your AI product match based on your business profile:`,
              recommendation: rec,
              createdAt: new Date().toISOString(),
            },
          ]);
        }
      }
      await loadSessions();
    } catch (e) {
      setRecDialogError(e.message || 'Failed to get recommendation.');
    } finally {
      setLoading(false);
    }
  };

  const sessionTitle = useMemo(() => {
    if (!sessionId) return 'New chat';
    const found = sessions.find((s) => s.id === sessionId);
    return found?.title || 'Chat session';
  }, [sessions, sessionId]);

  const hasMessages = messages.length > 0;

  return (
    <Box
      sx={{
        ...topPad,
        maxWidth: 1400,
        mx: 'auto',
        height: { xs: 'auto', md: 'calc(100vh - 105px)' },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 1.5, flexShrink: 0 }}>
        AI Assistant
      </Typography>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems="stretch"
        sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}
      >
        {/* Sidebar — sessions list */}
        <Card
          sx={{
            width: { xs: '100%', md: 280 },
            flexShrink: 0,
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 2, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
                flexShrink: 0,
              }}
            >
              New chat
            </Button>
            <Divider sx={{ mb: 1, flexShrink: 0 }} />
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
              <List dense disablePadding sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
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
        <Card sx={{ flex: 1, height: '100%', minHeight: 0, borderRadius: 3, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <CardContent
            sx={{
              p: { xs: 2, sm: 2.5 },
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minHeight: 0,
              overflow: 'hidden',
            }}
          >
            {/* Session title header */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 1.5, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}
            >
              <SmartToyRoundedIcon sx={{ color: '#22C55E', fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                {sessionTitle}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 'auto' }}>
                <Chip
                  label="Coconut · Kithul · Palmyrah"
                  size="small"
                  sx={{
                    display: { xs: 'none', md: 'inline-flex' },
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    color: '#22C55E',
                    background: 'rgba(34,197,94,0.1)',
                  }}
                />
                <Tooltip title="Find the best product to start based on your budget, raw material, and team">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={onGetRecommendation}
                    disabled={loading}
                    startIcon={<AutoAwesomeIcon sx={{ fontSize: 15 }} />}
                    sx={{
                      borderRadius: 999,
                      fontSize: '0.78rem',
                      textTransform: 'none',
                      background: 'linear-gradient(135deg,#22C55E,#16A34A)',
                      boxShadow: '0 3px 10px rgba(34,197,94,0.3)',
                      fontWeight: 700,
                      px: 1.75,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ✨ Match My Business
                  </Button>
                </Tooltip>
              </Stack>
            </Stack>

            {/* Suggestions banner when no messages */}
            {!hasMessages && !loading && (
              <Box sx={{ mb: 2, flexShrink: 0 }}>
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1.25 }}>
                  <AutoAwesomeIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Suggested questions (select to ask instantly)
                  </Typography>
                </Stack>
                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 1.5 }}>
                  {suggestions.map((s) => (
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
                <Button
                  variant="contained"
                  size="small"
                  onClick={onGetRecommendation}
                  disabled={loading}
                  sx={{
                    borderRadius: 999,
                    fontSize: '0.8rem',
                    background: 'linear-gradient(135deg,#22C55E,#16A34A)',
                    boxShadow: '0 4px 14px rgba(34,197,94,0.3)',
                    fontWeight: 700,
                  }}
                >
                  ✨ Find My Best Product Match
                </Button>
              </Box>
            )}

            {/* Empty state icon */}
            {!hasMessages && !loading && (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.45,
                  pb: 2,
                }}
              >
                <SmartToyRoundedIcon sx={{ fontSize: 48, mb: 1.5 }} />
                <Typography variant="body2" textAlign="center">
                  Ask about coconut, kithul, or palmyrah businesses, marketing, export rules, or website creation
                </Typography>
              </Box>
            )}

            {/* Messages list with independent scroll */}
            <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pr: 0.5 }}>
              {messages.map((m, idx) => {
                const isUser = m.sender === 'USER';
                const isLastAi = !isUser && idx === messages.length - 1;
                return (
                  <Box
                    key={m.id || idx}
                    sx={{
                      mb: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: { xs: '92%', md: '84%' },
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
                        <>
                          <AssistantFormattedText text={m.message || ''} />
                          {m.recommendation && (
                            <MLRecommendationCard
                              recommendation={m.recommendation}
                              onActionClick={handleQuickAction}
                            />
                          )}
                          {m.emailCampaign && (
                            <EmailCampaignCard
                              emailCampaign={m.emailCampaign}
                              actions={m.actions}
                            />
                          )}
                        </>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: 'pre-wrap', color: '#FFFFFF', fontWeight: 500 }}
                        >
                          {m.message}
                        </Typography>
                      )}

                      {/* Action buttons suggested by AI */}
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
                      {m.sender === 'AI' && m.action === 'EMAIL_CAMPAIGN' && (
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<EmailIcon />}
                          onClick={() => navigate(ROUTES.marketing.email)}
                          sx={{
                            mt: 1.5,
                            borderRadius: 999,
                            fontSize: '0.78rem',
                            background: 'linear-gradient(135deg,#38BDF8,#0EA5E9)',
                            boxShadow: '0 4px 12px rgba(14,165,233,0.3)',
                          }}
                        >
                          Create email campaign
                        </Button>
                      )}
                      {m.sender === 'AI' && m.action === 'SOCIAL_MARKETING' && (
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<CampaignIcon />}
                          onClick={() => navigate(ROUTES.marketing.social)}
                          sx={{
                            mt: 1.5,
                            borderRadius: 999,
                            fontSize: '0.78rem',
                            background: 'linear-gradient(135deg,#F59E0B,#F97316)',
                            boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
                          }}
                        >
                          Create ad campaign
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

                      {/* AI utility action bar: Copy & Retry */}
                      {m.sender === 'AI' && (
                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1, pt: 0.75, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <Tooltip title={copiedId === m.id ? 'Copied!' : 'Copy response'}>
                            <IconButton
                              size="small"
                              onClick={() => handleCopyMessage(m.id, m.message)}
                              sx={{ color: copiedId === m.id ? '#22C55E' : 'text.secondary', p: 0.5 }}
                            >
                              {copiedId === m.id ? <CheckRoundedIcon sx={{ fontSize: 15 }} /> : <ContentCopyRoundedIcon sx={{ fontSize: 15 }} />}
                            </IconButton>
                          </Tooltip>
                          {isLastAi && (
                            <Tooltip title="Regenerate / Retry response">
                              <IconButton
                                size="small"
                                onClick={() => handleRetry(idx)}
                                disabled={loading}
                                sx={{ color: 'text.secondary', p: 0.5 }}
                              >
                                <ReplayRoundedIcon sx={{ fontSize: 15 }} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      )}
                    </Box>
                  </Box>
                );
              })}

              {loading && <TypingIndicator mode={mode} />}
              {sendError && (
                <Typography variant="caption" sx={{ color: 'error.main', display: 'block', mb: 1 }}>
                  {sendError}
                </Typography>
              )}
              <div ref={listEndRef} />
            </Box>

            {/* Input form — flexShrink: 0 */}
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                onSend();
              }}
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                pt: 1.5,
                borderTop: '1px solid',
                borderColor: 'divider',
                flexShrink: 0,
              }}
            >
              <Tooltip title="Find the best product match based on your budget, raw material, and team size">
                <Button
                  size="small"
                  onClick={onGetRecommendation}
                  disabled={loading}
                  startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    borderRadius: 999,
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    px: 1.5,
                    py: 0.6,
                    color: '#22C55E',
                    bgcolor: mode === 'dark' ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.08)',
                    border: '1px solid',
                    borderColor: 'rgba(34,197,94,0.3)',
                    '&:hover': {
                      bgcolor: 'rgba(34,197,94,0.18)',
                    },
                    display: { xs: 'none', sm: 'inline-flex' },
                  }}
                >
                  ✨ Match My Business
                </Button>
              </Tooltip>
              <TextField
                inputRef={inputRef}
                fullWidth
                size="small"
                placeholder="Ask about coconut, kithul, or palmyrah..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 999,
                    background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  },
                }}
              />
              {loading ? (
                <Tooltip title="Stop generating">
                  <IconButton
                    type="button"
                    onClick={onStop}
                    sx={{
                      background: 'linear-gradient(135deg,#EF4444,#DC2626)',
                      color: '#fff',
                      borderRadius: 999,
                      p: 1.25,
                      boxShadow: '0 4px 14px rgba(239,68,68,0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg,#DC2626,#B91C1C)',
                      },
                    }}
                  >
                    <StopRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ) : (
                <IconButton
                  type="submit"
                  disabled={!input.trim()}
                  sx={{
                    background: 'linear-gradient(135deg,#22C55E,#16A34A)',
                    color: '#fff',
                    borderRadius: 999,
                    p: 1.25,
                    '&:hover': {
                      background: 'linear-gradient(135deg,#16A34A,#15803D)',
                    },
                    '&.Mui-disabled': {
                      background: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      color: mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                    },
                  }}
                >
                  <SendRoundedIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* Product Fit / Recommendation Dialog */}
      <BusinessRecommendationDialog
        open={showRecommendationDialog}
        onClose={() => setShowRecommendationDialog(false)}
        onSubmit={onRecommendationSubmit}
        isLoading={loading}
        error={recDialogError}
        businessSector={businessSector}
      />
    </Box>
  );
}
