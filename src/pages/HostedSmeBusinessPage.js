import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { fetchPublicSmeSite } from '../services/smeWebsiteApi';

/**
 * Loads HTML snapshot from Spring and shows it full-viewport (no marketing chrome).
 */
export default function HostedSmeBusinessPage() {
  const { slug } = useParams();
  const [html, setHtml] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setErr(null);
      setHtml(null);
      if (!slug) {
        setErr('Missing site');
        return;
      }
      try {
        const data = await fetchPublicSmeSite(slug);
        if (!cancelled) {
          setHtml(data.html || '');
        }
      } catch (e) {
        if (!cancelled) {
          setErr(e.message || 'Could not load site');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (err) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Typography color="text.secondary">{err}</Typography>
      </Box>
    );
  }

  if (html == null) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', bgcolor: '#fff' }}>
      <iframe title="Hosted business site" srcDoc={html} sandbox="allow-scripts allow-same-origin" style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }} />
    </Box>
  );
}
