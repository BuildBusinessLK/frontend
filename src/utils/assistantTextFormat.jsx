import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/**
 * Renders assistant replies with readable structure: paragraphs, numbered lists,
 * bullets, and **bold** / *emphasis* — without showing raw markdown markers.
 */
function parseInlineSegments(line) {
  if (!line) {
    return [{ type: 'text', value: '' }];
  }

  const segments = [];
  let cursor = 0;
  const pushText = (value) => {
    if (value) {
      segments.push({ type: 'text', value });
    }
  };

  while (cursor < line.length) {
    const boldStart = line.indexOf('**', cursor);
    const em = line.indexOf('*', cursor);

    let kind = null;
    if (boldStart !== -1 && (em === -1 || boldStart <= em)) {
      kind = 'bold';
    } else if (em !== -1) {
      const afterStar = line.slice(em + 1);
      const close = afterStar.indexOf('*');
      if (close > 0 && !afterStar.startsWith('*')) {
        next = em;
        kind = 'emph';
      }
    }

    if (kind === 'bold') {
      pushText(line.slice(cursor, boldStart));
      const afterOpen = boldStart + 2;
      const closeIdx = line.indexOf('**', afterOpen);
      if (closeIdx === -1) {
        pushText(line.slice(boldStart));
        break;
      }
      segments.push({ type: 'bold', value: line.slice(afterOpen, closeIdx) });
      cursor = closeIdx + 2;
      continue;
    }

    if (kind === 'emph') {
      pushText(line.slice(cursor, em));
      const afterOpen = em + 1;
      const closeIdx = line.indexOf('*', afterOpen);
      if (closeIdx === -1) {
        pushText(line.slice(em));
        break;
      }
      segments.push({ type: 'emph', value: line.slice(afterOpen, closeIdx) });
      cursor = closeIdx + 1;
      continue;
    }

    pushText(line.slice(cursor));
    break;
  }

  return segments.length ? segments : [{ type: 'text', value: line }];
}

function InlineParts({ parts, isUser }) {
  return parts.map((part, index) => {
    if (part.type === 'bold') {
      return (
        <Box component="span" key={index} sx={{ fontWeight: 700 }}>
          {part.value}
        </Box>
      );
    }
    if (part.type === 'emph') {
      return (
        <Box
          component="span"
          key={index}
          sx={{ fontStyle: 'italic', opacity: isUser ? 0.95 : 0.92 }}
        >
          {part.value}
        </Box>
      );
    }
    return <React.Fragment key={index}>{part.value}</React.Fragment>;
  });
}

function normalizeAssistantText(raw) {
  if (!raw || typeof raw !== 'string') {
    return '';
  }
  let t = raw.replace(/\r\n/g, '\n').trim();
  // Collapse odd Unicode bullets like "1.⁠ ⁠*Title*" (word joiner / narrow spaces after numbers)
  t = t.replace(/^(\d+)\.\s*[\u2060\u200B\uFEFF\s]*/gm, '$1. ');
  return t;
}

function stripLeadingHeadingMarkers(line) {
  return line.replace(/^#{1,6}\s+/, '').replace(/^\*\s+/, '');
}

/**
 * @param {object} props
 * @param {string} props.text
 * @param {boolean} [props.isUser]
 * @param {import('@mui/material').Theme} [props.theme] — optional override; defaults to useTheme()
 */
export function AssistantFormattedText({ text, isUser = false, theme: themeProp }) {
  const themeFromContext = useTheme();
  const theme = themeProp ?? themeFromContext;

  const body = normalizeAssistantText(text);
  if (!body) {
    return null;
  }

  const blocks = [];
  const paragraphs = body.split(/\n\s*\n/);

  paragraphs.forEach((para, paragraphIndex) => {
    const lines = para
      .split('\n')
      .map((l) => stripLeadingHeadingMarkers(l.trimEnd()))
      .filter((l) => l.length > 0);

    if (!lines.length) {
      return;
    }

    const isOrdered = lines.every((l) => /^\d+\./.test(l.trim()));
    const isBullets =
      !isOrdered &&
      lines.every((l) => /^[-•]\s+/.test(l) || /^\*\s+/.test(l));

    if (isOrdered) {
      blocks.push(
        <Box
          key={`ol-${paragraphIndex}`}
          component="ol"
          sx={{
            pl: 2.25,
            my: 0,
            listStylePosition: 'outside',
            '& li': { mb: 1 },
          }}
        >
          {lines.map((line, i) => {
            const content = line.replace(/^\d+\.[\s\u200B\u2060\uFEFF]*/, '');
            return (
              <Typography
                key={i}
                component="li"
                sx={{
                  color: isUser ? '#FFFFFF' : theme.palette.text.primary,
                  lineHeight: 1.65,
                  fontSize: '0.92rem',
                  display: 'list-item',
                }}
              >
                <InlineParts
                  parts={parseInlineSegments(content)}
                  isUser={isUser}
                />
              </Typography>
            );
          })}
        </Box>
      );
      return;
    }

    if (isBullets) {
      blocks.push(
        <Box
          key={`ul-${paragraphIndex}`}
          component="ul"
          sx={{
            pl: 2.25,
            my: 0,
            listStyle: 'disc',
            listStylePosition: 'outside',
            '& li': { mb: 1 },
          }}
        >
          {lines.map((line, i) => {
            const content = line.replace(/^[-•]\s+/, '').replace(/^\*\s+/, '');
            return (
              <Typography
                key={i}
                component="li"
                sx={{
                  color: isUser ? '#FFFFFF' : theme.palette.text.primary,
                  lineHeight: 1.65,
                  fontSize: '0.92rem',
                  display: 'list-item',
                }}
              >
                <InlineParts
                  parts={parseInlineSegments(content)}
                  isUser={isUser}
                />
              </Typography>
            );
          })}
        </Box>
      );
      return;
    }

    blocks.push(
      <Typography
        key={`p-${paragraphIndex}`}
        sx={{
          color: isUser ? '#FFFFFF' : theme.palette.text.primary,
          lineHeight: 1.65,
          fontSize: '0.92rem',
          mb: 1.25,
          whiteSpace: 'pre-wrap',
        }}
      >
        {lines.map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {lineIndex > 0 ? <br /> : null}
            <InlineParts
              parts={parseInlineSegments(line)}
              isUser={isUser}
            />
          </React.Fragment>
        ))}
      </Typography>
    );
  });

  return <Box sx={{ '&:last-child .MuiTypography-root': { mb: 0 } }}>{blocks}</Box>;
}
