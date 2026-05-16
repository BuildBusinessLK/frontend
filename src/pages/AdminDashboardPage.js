import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { fetchAdminStats } from '../services/adminApi';
import { useChatPageTopPadding } from '../hooks/useDashboardLayoutPadding';

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const topPad = useChatPageTopPadding();
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const s = await fetchAdminStats(token);
        if (!c) setStats(s);
      } catch (e) {
        if (!c) setErr(e.message || 'Failed');
      }
    })();
    return () => {
      c = true;
    };
  }, [token]);

  const items = stats
    ? [
        { label: 'Users', value: stats.totalUsers },
        { label: 'Businesses', value: stats.totalBusinesses },
        { label: 'Websites', value: stats.totalGeneratedWebsites },
        { label: 'Chat messages', value: stats.totalChatMessages },
        { label: 'Knowledge sources', value: stats.totalKnowledgeSources },
      ]
    : [];

  return (
    <Box sx={{ ...topPad }}>
      <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 2 }}>
        Admin
      </Typography>
      {err && (
        <Typography color="error" sx={{ mb: 2 }}>
          {err}
        </Typography>
      )}
      <Grid container spacing={2}>
        {items.map((it) => (
          <Grid item xs={12} sm={6} md={4} key={it.label}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  {it.label}
                </Typography>
                <Typography variant="h4" fontWeight={900}>
                  {it.value ?? '—'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
