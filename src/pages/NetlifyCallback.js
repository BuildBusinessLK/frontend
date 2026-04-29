import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Container, Alert } from '@mui/material';
import { setNetlifyToken } from '../services/netlifyService';

/**
 * OAuth Callback page for Netlify authentication
 * This page receives the auth token after user authorizes the app
 */
export default function NetlifyCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get token from URL hash
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    const errorMsg = params.get('error');
    const errorDesc = params.get('error_description');

    if (errorMsg) {
      setError(`${errorMsg}: ${errorDesc}`);
      setStatus('error');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    if (token) {
      try {
        // Store token
        setNetlifyToken(token);
        setStatus('success');

        // Redirect back to previous page or home
        setTimeout(() => {
          const redirectUrl = sessionStorage.getItem('netlify_redirect') || '/';
          sessionStorage.removeItem('netlify_redirect');
          navigate(redirectUrl);
        }, 1500);
      } catch (err) {
        setError('Failed to save authentication');
        setStatus('error');
        setTimeout(() => navigate('/'), 3000);
      }
    } else {
      setError('No token received from Netlify');
      setStatus('error');
      setTimeout(() => navigate('/'), 3000);
    }
  }, [navigate]);

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        {status === 'processing' && (
          <>
            <CircularProgress sx={{ mb: 2, color: '#22C55E' }} />
            <Typography variant="h6">Connecting to Netlify...</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Please wait while we authorize your account
            </Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <Box sx={{ fontSize: 48, mb: 2 }}>✅</Box>
            <Typography variant="h6">Connected to Netlify!</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              You're all set. Redirecting...
            </Typography>
          </>
        )}

        {status === 'error' && (
          <>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || 'Authentication failed'}
            </Alert>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Redirecting you back in a moment...
            </Typography>
          </>
        )}
      </Box>
    </Container>
  );
}
