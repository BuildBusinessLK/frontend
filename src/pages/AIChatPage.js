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

const engines = {
  groq: {
    id: 'groq',
    title: 'Groq Cloud AI',
    shortName: 'Groq API',
    owner: 'Hiumie',
    endpoint: 'http://127.0.0.1:5000/ai',
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
    endpoint: 'http://localhost:8083/ask',
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
        pt: { xs: 12, md: 14 },
        pb: 8,
        background:
          mode === 'dark'
            ? 'radial-gradient(circle at top, rgba(34,197,94,0.12), transparent 40%), linear-gradient(180deg, #050A0D 0%, #071116 100%)'
            : 'linear-gradient(180deg, #F7FAF8 0%, #EEF6F1 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Box>
            <Chip
              icon={<AutoAwesomeIcon sx={{ fontSize: 16, color: '#22C55E !important' }} />}
              label="AI Assistant"
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
              One Assistant. Two AI Engines.
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, maxWidth: 680 }}>
              Select the engine you want to present, then chat with the matching backend, model, and knowledge pipeline.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5}>
            {Object.values(engines).map((engine) => {
              const isActive = engine.id === selectedEngine;
              return (
                <Card
                  key={engine.id}
                  elevation={0}
                  sx={{
                    flex: 1,
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: isActive
                      ? '1px solid rgba(34,197,94,0.42)'
                      : mode === 'dark'
                        ? '1px solid rgba(255,255,255,0.08)'
                        : '1px solid rgba(0,0,0,0.06)',
                    background: isActive
                      ? mode === 'dark'
                        ? 'rgba(34,197,94,0.08)'
                        : 'rgba(255,255,255,0.95)'
                      : mode === 'dark'
                        ? 'rgba(6,10,13,0.72)'
                        : 'rgba(255,255,255,0.82)',
                    boxShadow: isActive
                      ? '0 24px 58px rgba(34,197,94,0.16)'
                      : '0 16px 42px rgba(15,23,42,0.08)',
                    transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <CardActionArea onClick={() => handleSelectEngine(engine.id)} sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box
                            sx={{
                              width: 52,
                              height: 52,
                              borderRadius: 3,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                              fontSize: 27,
                              background: engine.accent,
                              boxShadow: '0 16px 34px rgba(0,0,0,0.18)',
                            }}
                          >
                            {engine.icon}
                          </Box>
                          <Box>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: theme.palette.text.primary }}>
                              {engine.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                              {engine.endpointLabel} · Built by {engine.owner}
                            </Typography>
                          </Box>
                        </Stack>

                        <Typography sx={{ color: theme.palette.text.secondary, lineHeight: 1.7 }}>
                          {engine.description}
                        </Typography>

                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                          {[engine.model, engine.shortName, isActive ? 'Selected' : 'Tap to use'].map((label) => (
                            <Chip
                              key={label}
                              label={label}
                              size="small"
                              sx={{
                                borderRadius: 2,
                                fontWeight: 700,
                                background: isActive
                                  ? 'rgba(34,197,94,0.14)'
                                  : mode === 'dark'
                                    ? 'rgba(255,255,255,0.06)'
                                    : 'rgba(0,0,0,0.04)',
                              }}
                            />
                          ))}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              );
            })}
          </Stack>

          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              background: mode === 'dark' ? 'rgba(6,10,13,0.7)' : 'rgba(255,255,255,0.86)',
              backdropFilter: 'blur(18px)',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="overline" sx={{ color: theme.palette.text.secondary, letterSpacing: '0.16em' }}>
                    Active Engine Stack
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: theme.palette.text.primary }}>
                    {activeEngine.title} · {activeEngine.endpointLabel}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {activeTools.map((tool) => (
                    <Chip
                      key={tool}
                      label={tool}
                      sx={{
                        borderRadius: 2,
                        fontWeight: 650,
                        background: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(34,197,94,0.08)',
                        color: theme.palette.text.primary,
                      }}
                    />
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>

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
                {activeEngine.endpointLabel} · {activeEngine.model}
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
                  placeholder={activeEngine.placeholder}
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
                    background: activeEngine.accent,
                    boxShadow: '0 10px 28px rgba(34,197,94,0.35)',
                    '&:hover': {
                      background: activeEngine.accent,
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