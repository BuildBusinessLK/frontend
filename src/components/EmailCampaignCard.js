import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Chip,
  useTheme,
  Divider,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SendIcon from '@mui/icons-material/Send';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';

export default function EmailCampaignCard({ emailCampaign, actions = [] }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  if (!emailCampaign) return null;

  const {
    goal = 'GENERAL_ANNOUNCEMENT',
    sector = 'COCONUT',
    subject = '',
    body = '',
    targetAudience = '',
    suggestedCallToAction = '',
  } = emailCampaign;

  const handleCopy = () => {
    const fullText = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenStudio = () => {
    navigate('/dashboard/marketing/email', {
      state: {
        prefill: {
          goal,
          sector,
          subject,
          body,
          targetAudience,
          suggestedCallToAction,
        },
      },
    });
  };

  const goalLabels = {
    WHOLESALE_PITCH: 'Wholesale Pitch',
    EXPORTER_SAMPLE_OFFER: 'Exporter Sample Offer',
    RETAIL_DISCOUNT: 'Retail Discount',
    HARVEST_ANNOUNCEMENT: 'Harvest Announcement',
    GENERAL_ANNOUNCEMENT: 'Commercial Announcement',
  };

  return (
    <Card
      sx={{
        mt: 2,
        mb: 2,
        borderRadius: 3,
        border: theme.palette.mode === 'dark' ? '1px solid rgba(56,189,248,0.25)' : '1px solid #bae6fd',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, rgba(6,10,13,0.95) 0%, rgba(14,23,34,0.95) 100%)'
            : 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)',
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(56,189,248,0.1)'
            : '0 10px 25px rgba(14,165,233,0.1)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          background:
            theme.palette.mode === 'dark'
              ? 'rgba(56,189,248,0.12)'
              : 'rgba(56,189,248,0.08)',
          borderBottom:
            theme.palette.mode === 'dark'
              ? '1px solid rgba(56,189,248,0.15)'
              : '1px solid #e0f2fe',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <MailOutlineIcon sx={{ color: '#0284c7', fontSize: '1.25rem' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
            AI Email Campaign Draft
          </Typography>
          <Chip
            size="small"
            label={goalLabels[goal] || goal}
            sx={{
              fontWeight: 700,
              fontSize: '0.7rem',
              height: 22,
              background: '#0284c7',
              color: '#ffffff',
            }}
          />
          {sector && (
            <Chip
              size="small"
              variant="outlined"
              label={sector}
              sx={{ fontWeight: 600, fontSize: '0.7rem', height: 22 }}
            />
          )}
        </Stack>

        <Chip
          size="small"
          label="Safe Mock Mode"
          variant="outlined"
          sx={{
            fontSize: '0.68rem',
            color: '#10b981',
            borderColor: 'rgba(16,185,129,0.3)',
            fontWeight: 700,
          }}
        />
      </Box>

      <CardContent sx={{ p: 2.5 }}>
        {/* Subject */}
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
            Subject Line
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 800, color: theme.palette.text.primary, mt: 0.25 }}>
            {subject}
          </Typography>
        </Box>

        {targetAudience && (
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Target Audience: <strong>{targetAudience}</strong>
            </Typography>
          </Box>
        )}

        {/* Body Preview */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background:
              theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.35)' : 'rgba(248,250,252,0.95)',
            border:
              theme.palette.mode === 'dark'
                ? '1px solid rgba(255,255,255,0.06)'
                : '1px solid rgba(0,0,0,0.06)',
            maxHeight: 220,
            overflowY: 'auto',
            fontFamily: 'inherit',
            fontSize: '0.86rem',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            color: theme.palette.text.primary,
          }}
        >
          {body}
        </Box>

        {suggestedCallToAction && (
          <Box sx={{ mt: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              Recommended Call-to-Action:{' '}
              <strong style={{ color: '#0284c7' }}>{suggestedCallToAction}</strong>
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Action Buttons */}
        <Stack direction="row" spacing={1.5} justifyContent="space-between" flexWrap="wrap" useFlexGap>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopy}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            {copied ? 'Copied to Clipboard!' : 'Copy Email'}
          </Button>

          <Button
            size="small"
            variant="contained"
            endIcon={<OpenInNewIcon />}
            onClick={handleOpenStudio}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0369a1, #075985)',
              },
            }}
          >
            Open in Email Studio & Send
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
