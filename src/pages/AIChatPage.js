import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
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
import PsychologyIcon from '@mui/icons-material/Psychology';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';
import { AssistantFormattedText } from '../utils/assistantTextFormat';

const SPRING_BACKEND_BASE_URL = process.env.REACT_APP_SPRING_BACKEND_BASE_URL || 'http://localhost:8083';
const GROQ_ENGINE_URL = process.env.REACT_APP_GROQ_ENGINE_URL || 'http://127.0.0.1:5000/ai';

const engines = {
  groq: {
    id: 'groq',
    title: 'Groq Cloud AI',
    shortName: 'Groq API',
    owner: 'Hiumie',
    endpoint: GROQ_ENGINE_URL,
    endpointLabel: '/ai',
    model: 'Groq Cloud API LLM',
    accent: 'linear-gradient(135deg, #2563EB, #7C3AED)',
    icon: <CloudQueueIcon fontSize="inherit" />,
    intro:
      'You are now using the Groq Cloud AI engine. Ask for fast market insights, business ideas, or knowledge-base answers.',
    description:
      'Fast cloud-hosted LLM pipeline for knowledge-base answers, business guidance, and review demos.',
    placeholder: 'Ask the Groq engine about coconut industry, business ideas, or market trends...',
    requestBody: (text) => ({ message: text }),
    getAnswer: (data) => data.response || data.answer || data.message,
    tools: [
      'Framework: Flask / FastAPI',
      'AI Orchestration: LangChain',
      'Vector DB: FAISS',
      'Embeddings: HuggingFace all-MiniLM-L6-v2',
      'LLM: Groq Cloud API LLM',
      'Knowledge Base: TXT, PDF, CSV',
      'Communication: REST API',
    ],
  },
  ask: {
    id: 'ask',
    title: 'Llama 3 Knowledge Engine',
    shortName: 'Ollama Llama3',
    owner: 'Havindu',
    endpoint: `${SPRING_BACKEND_BASE_URL}/ask`,
    endpointLabel: '/ask',
    model: 'Ollama llama3',
    accent: 'linear-gradient(135deg, #22C55E, #16A34A)',
    icon: <PsychologyIcon fontSize="inherit" />,
    intro:
      'You are now using the Llama 3 knowledge engine. Ask questions from the connected business knowledge base.',
    description:
      'Spring Boot to Python RAG flow using local Llama 3 for structured knowledge-base responses.',
    placeholder: 'Ask the Llama 3 engine about exports, marketing, or business support...',
    requestBody: (text, conversationId) => ({ question: text, conversationId }),
    getAnswer: (data) => {
      if (data.success === false) {
        throw new Error(data.message || 'The /ask engine returned an error.');
      }
      return data.answer || data.response || data.message;
    },
    tools: [
      'Frameworks: FastAPI (Python), Spring Boot (Java)',
      'AI Orchestration: LangChain',
      'Vector DB: FAISS',
      'Embeddings: HuggingFace all-MiniLM-L6-v2',
      'LLM: Ollama llama3',
      'Communication: RestTemplate Java to Python',
    ],
  },
};

const createInitialMessages = (engine) => [
  {
    id: `${engine.id}-intro`,
    role: 'assistant',
    text: engine.intro,
  },
];

const createConversationId = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `conversation-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export default function AIChatPage() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedEngine, setSelectedEngine] = useState('groq');
  const activeEngine = engines[selectedEngine];
  const [messagesByEngine, setMessagesByEngine] = useState(() => ({
    groq: createInitialMessages(engines.groq),
    ask: createInitialMessages(engines.ask),
  }));
  const [conversationIds, setConversationIds] = useState(() => ({
    ask: createConversationId(),
  }));
  const [draft, setDraft] = useState('');

  // Check if user came from template selection with intent to create website
  const websiteAction = location.state?.action;
  const selectedTemplate = location.state?.template;
  const messages = messagesByEngine[selectedEngine];

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
  const [loadingEngine, setLoadingEngine] = useState(null);
  const isLoading = loadingEngine === selectedEngine;
  const scrollRef = useRef(null);
  const activeTools = useMemo(() => activeEngine.tools, [activeEngine]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const updateEngineMessages = (engineId, updater) => {
    setMessagesByEngine((current) => ({
      ...current,
      [engineId]: updater(current[engineId]),
    }));
  };

  const handleSelectEngine = (engineId) => {
    setSelectedEngine(engineId);
    setDraft('');
  };

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || isLoading) return;

    const engine = activeEngine;
    const userMessage = { id: Date.now(), role: 'user', text };
    updateEngineMessages(engine.id, (current) => [...current, userMessage]);
    setDraft('');
    setLoadingEngine(engine.id);

    try {
      const response = await fetch(engine.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(engine.requestBody(text, conversationIds[engine.id])),
      });

      const data = await response.json();
      const answer = engine.getAnswer(data);
      if (data.conversationId) {
        setConversationIds((current) => ({
          ...current,
          [engine.id]: data.conversationId,
        }));
      }

      if (!answer) {
        throw new Error('Empty AI response.');
      }

      updateEngineMessages(engine.id, (current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: answer,
        },
      ]);
    } catch (error) {
      updateEngineMessages(engine.id, (current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: `The ${engine.endpointLabel} engine is not responding right now. Please check the backend server and try again.`,
        },
      ]);
    } finally {
      setLoadingEngine(null);
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
        maxWidth="lg"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          width: '100%',
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Slim header — conversation-first */}
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 1.5,
            mb: 2,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            <Chip
              icon={<AutoAwesomeIcon sx={{ fontSize: 16, color: '#22C55E !important' }} />}
              label="AI Workspace"
              size="small"
              sx={{
                background: mode === 'dark' ? 'rgba(34,197,94,0.14)' : 'rgba(34,197,94,0.1)',
                color: mode === 'dark' ? '#86EFAC' : '#166534',
                fontWeight: 700,
                border: mode === 'dark' ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(34,197,94,0.18)',
              }}
            />
            <Box>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: theme.palette.text.primary,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.2,
                }}
              >
                One assistant · Two engines
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mt: 0.25 }}>
                Active: {activeEngine.shortName} ({activeEngine.endpointLabel})
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Primary chat surface — fills viewport minus header + bottom panels */}
        <Paper
          elevation={0}
          sx={{
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            minHeight: { xs: 400, sm: 480 },
            height: { xs: 'calc(100dvh - 11rem)', sm: 'calc(100dvh - 10rem)', md: 'calc(100dvh - 9.5rem)' },
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
              gap: 2,
              flexShrink: 0,
              borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              bgcolor: mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              {['#FB7185', '#FBBF24', '#4ADE80'].map((color) => (
                <Box key={color} sx={{ width: 9, height: 9, borderRadius: '50%', background: color, opacity: 0.9 }} />
              ))}
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 600, letterSpacing: '0.02em' }}>
                Session
              </Typography>
            </Stack>
            <Chip
              label={`${activeEngine.endpointLabel} · ${activeEngine.model}`}
              size="small"
              sx={{
                fontWeight: 600,
                maxWidth: '58%',
                '& .MuiChip-label': { display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
                background: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(34,197,94,0.09)',
                border: mode === 'dark' ? 'none' : '1px solid rgba(34,197,94,0.12)',
              }}
            />
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
                        maxWidth: { xs: '92%', sm: '86%' },
                        px: 2.2,
                        py: 1.6,
                        whiteSpace: isUser ? 'pre-line' : 'normal',
                        borderRadius: isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                        background: isUser
                          ? activeEngine.accent
                          : mode === 'dark'
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(0,0,0,0.035)',
                        border: isUser
                          ? 'none'
                          : mode === 'dark'
                            ? '1px solid rgba(34,197,94,0.14)'
                            : '1px solid rgba(34,197,94,0.12)',
                        boxShadow: isUser
                          ? '0 8px 24px rgba(34,197,94,0.25)'
                          : mode === 'dark'
                            ? 'none'
                            : '0 2px 12px rgba(0,0,0,0.04)',
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
                placeholder={activeEngine.placeholder}
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
                  background: activeEngine.accent,
                  boxShadow: '0 8px 24px rgba(34,197,94,0.28)',
                  fontWeight: 700,
                  '&:hover': {
                    background: activeEngine.accent,
                    filter: 'brightness(1.05)',
                  },
                }}
              >
                {isLoading ? 'Thinking…' : 'Send'}
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* Bottom: secondary info & controls (scrolls in on small viewports) */}
        <Stack spacing={2} sx={{ mt: 2.5, flexShrink: 0, pb: 1 }}>
          {websiteAction === 'create-website' && selectedTemplate && (
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid rgba(34,197,94,0.28)',
                background: mode === 'dark' ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.06)',
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WebIcon sx={{ color: '#22C55E', fontSize: 22 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Create website with AI
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Template: <strong>{templateNames[selectedTemplate]}</strong>. Continue to generate your site.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                    <Button
                      variant="contained"
                      onClick={handleCreateWebsite}
                      sx={{
                        borderRadius: 999,
                        py: 1.25,
                        px: 2.5,
                        background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                        boxShadow: '0 10px 26px rgba(34,197,94,0.28)',
                      }}
                    >
                      Create my website
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/marketing/website/templates')} sx={{ borderRadius: 999 }}>
                      Change template
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          )}

          <Box>
            <Typography
              variant="overline"
              sx={{ color: theme.palette.text.secondary, letterSpacing: '0.14em', fontWeight: 700, display: 'block', mb: 1.25 }}
            >
              Engines & setup
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              {Object.values(engines).map((engine) => {
                const isActive = engine.id === selectedEngine;
                return (
                  <Card
                    key={engine.id}
                    elevation={0}
                    sx={{
                      flex: 1,
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: isActive
                        ? '1px solid rgba(34,197,94,0.45)'
                        : mode === 'dark'
                          ? '1px solid rgba(255,255,255,0.08)'
                          : '1px solid rgba(0,0,0,0.06)',
                      background: isActive
                        ? mode === 'dark'
                          ? 'rgba(34,197,94,0.1)'
                          : 'rgba(255,255,255,0.98)'
                        : mode === 'dark'
                          ? 'rgba(6,10,13,0.5)'
                          : 'rgba(255,255,255,0.75)',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      boxShadow: isActive ? '0 8px 32px rgba(34,197,94,0.12)' : 'none',
                    }}
                  >
                    <CardActionArea onClick={() => handleSelectEngine(engine.id)} sx={{ py: 0.5 }}>
                      <CardContent sx={{ p: 2.25 }}>
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                              fontSize: 24,
                              background: engine.accent,
                              flexShrink: 0,
                              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                            }}
                          >
                            {engine.icon}
                          </Box>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
                              {engine.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                              {engine.endpointLabel} · {engine.owner}
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.75, lineHeight: 1.55 }}>
                              {engine.description}
                            </Typography>
                            <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" sx={{ mt: 1.25 }}>
                              {[engine.model, isActive ? 'Active' : 'Select'].map((label) => (
                                <Chip
                                  key={label}
                                  label={label}
                                  size="small"
                                  sx={{
                                    height: 22,
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    background: isActive
                                      ? 'rgba(34,197,94,0.2)'
                                      : mode === 'dark'
                                        ? 'rgba(255,255,255,0.06)'
                                        : 'rgba(0,0,0,0.05)',
                                  }}
                                />
                              ))}
                            </Stack>
                          </Box>
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                );
              })}
            </Stack>
          </Box>

          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              background: mode === 'dark' ? 'rgba(6,10,13,0.45)' : 'rgba(255,255,255,0.72)',
            }}
          >
            <CardContent sx={{ p: 2.25, '&:last-child': { pb: 2.25 } }}>
              <Typography variant="overline" sx={{ color: theme.palette.text.secondary, letterSpacing: '0.12em' }}>
                Active pipeline
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                {activeEngine.title}
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {activeTools.map((tool) => (
                  <Chip
                    key={tool}
                    label={tool}
                    size="small"
                    sx={{
                      borderRadius: 1.5,
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      background: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(34,197,94,0.08)',
                      color: theme.palette.text.primary,
                    }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}