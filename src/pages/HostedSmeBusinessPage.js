import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { fetchPublicBusiness } from '../services/publicBusinessApi';

/**
 * Lightweight public preview served from the React app (same API as the Next.js template).
 */
export default function HostedSmeBusinessPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setErr(null);
      setData(null);
      if (!slug) {
        setErr('Missing site');
        return;
      }
      try {
        const d = await fetchPublicBusiness(slug);
        if (!cancelled) setData(d);
      } catch (e) {
        if (!cancelled) setErr(e.message || 'Could not load site');
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

  if (!data) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const primary = data.primaryColor || '#15803d';
  const secondary = data.secondaryColor || '#ca8a04';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      {data.coverImageUrl && (
        <CardMedia component="img" height="280" image={data.coverImageUrl} alt="" sx={{ objectFit: 'cover' }} />
      )}
      <Box sx={{ bgcolor: primary, color: '#fff', py: 6 }}>
        <Container maxWidth="md">
          <Stack direction="row" spacing={2} alignItems="center">
            {data.logoUrl && (
              <Box component="img" src={data.logoUrl} alt="" sx={{ width: 72, height: 72, borderRadius: 2, objectFit: 'cover' }} />
            )}
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 900 }}>
                {data.businessName}
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                {data.sector} · Sri Lanka
              </Typography>
            </Box>
          </Stack>
          {data.heroText && (
            <Typography variant="h6" sx={{ mt: 3, maxWidth: 720, lineHeight: 1.5 }}>
              {data.heroText}
            </Typography>
          )}
        </Container>
      </Box>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {data.aboutText && (
          <Card sx={{ mb: 3, borderTop: `4px solid ${secondary}` }}>
            <CardContent>
              <Typography variant="h5" fontWeight={800} gutterBottom>
                About
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>{data.aboutText}</Typography>
            </CardContent>
          </Card>
        )}
        {data.marketingText && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" fontWeight={800} gutterBottom>
                Why choose us
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>{data.marketingText}</Typography>
            </CardContent>
          </Card>
        )}
        {data.products?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight={800} gutterBottom>
              Products
            </Typography>
            <Grid container spacing={2}>
              {data.products.map((p) => (
                <Grid item xs={12} sm={6} md={4} key={p.id || p.name}>
                  <Card>
                    {p.imageUrl && <CardMedia component="img" height="140" image={p.imageUrl} alt={p.name} />}
                    <CardContent>
                      <Typography fontWeight={800}>{p.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {p.description}
                      </Typography>
                      {p.price != null && (
                        <Typography variant="body2" sx={{ mt: 1 }} fontWeight={700}>
                          LKR {p.price}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        <Card>
          <CardContent>
            <Typography variant="h5" fontWeight={800} gutterBottom>
              Contact
            </Typography>
            {data.contactEmail && <Typography>Email: {data.contactEmail}</Typography>}
            {data.phone && <Typography>Phone: {data.phone}</Typography>}
            {data.socialLinks?.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
                {data.socialLinks.map((s) => {
                  const url = s.url?.trim();
                  if (!url) return null;
                  const platform = String(s.platform || '').toLowerCase();
                  let icon = null;
                  if (platform.includes('facebook')) icon = <FacebookIcon />;
                  else if (platform.includes('instagram')) icon = <InstagramIcon />;
                  else if (platform.includes('whatsapp')) icon = <WhatsAppIcon />;
                  return (
                    <Button
                      key={`${s.platform}-${s.url}`}
                      size="small"
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      variant="outlined"
                      startIcon={icon}
                    >
                      {s.platform}
                    </Button>
                  );
                })}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
