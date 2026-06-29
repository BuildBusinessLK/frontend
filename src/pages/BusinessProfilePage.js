import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAuth } from '../contexts/AuthContext';
import { fetchBusinesses, createBusiness, updateBusiness } from '../services/businessApi';
import { useChatPageTopPadding } from '../hooks/useDashboardLayoutPadding';

const SECTORS = ['COCONUT', 'KITHUL', 'PALMYRAH'];

const emptyProduct = () => ({ name: '', description: '', price: '', category: '', imageUrl: '' });
const emptySocial = () => ({ platform: 'Facebook', url: '' });

export default function BusinessProfilePage() {
  const { token } = useAuth();
  const topPad = useChatPageTopPadding();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [businessId, setBusinessId] = useState(null);
  const [businessName, setBusinessName] = useState('');
  const [sector, setSector] = useState('COCONUT');
  const [websiteSlug, setWebsiteSlug] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlyProduction, setMonthlyProduction] = useState('');
  const [marketingGoals, setMarketingGoals] = useState('');
  const [businessHoursOpen, setBusinessHoursOpen] = useState('');
  const [businessHoursClose, setBusinessHoursClose] = useState('');
  const [workingDays, setWorkingDays] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [products, setProducts] = useState([emptyProduct()]);
  const [socialLinks, setSocialLinks] = useState([emptySocial()]);


  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await fetchBusinesses(token);
        if (cancelled) return;
        if (list.length) {
          const b = list[0];
          setBusinessId(b.id);
          setBusinessName(b.businessName || '');
          setSector(b.sector || 'COCONUT');
          setWebsiteSlug(b.websiteSlug || '');
          setBusinessDescription(b.businessDescription || '');
          setTargetMarket(b.targetMarket || '');
          setMonthlyIncome(b.monthlyIncome != null ? String(b.monthlyIncome) : '');
          setMonthlyProduction(b.monthlyProduction != null ? String(b.monthlyProduction) : '');
          setMarketingGoals(b.marketingGoals || '');
          setBusinessHoursOpen(b.businessHoursOpen || '');
          setBusinessHoursClose(b.businessHoursClose || '');
          setWorkingDays(b.workingDays || '');
          setGoogleMapsUrl(b.googleMapsUrl || '');
          if (b.products?.length) {

            setProducts(
              b.products.map((p) => ({
                name: p.name || '',
                description: p.description || '',
                price: p.price != null ? String(p.price) : '',
                category: p.category || '',
                imageUrl: p.imageUrl || '',
              })),
            );
          }
          if (b.socialLinks?.length) {
            setSocialLinks(
              b.socialLinks.map((s) => ({
                platform: s.platform || '',
                url: s.url || '',
              })),
            );
          }
        }
      } catch (e) {
        if (!cancelled) setErr(e.message || 'Load failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const buildPayload = () => ({
    businessName: businessName.trim(),
    sector,
    websiteSlug: websiteSlug.trim() || undefined,
    businessDescription: businessDescription.trim() || undefined,
    targetMarket: targetMarket.trim() || undefined,
    monthlyIncome: monthlyIncome.trim() ? Number(monthlyIncome) : undefined,
    monthlyProduction: monthlyProduction.trim() ? Number(monthlyProduction) : undefined,
    marketingGoals: marketingGoals.trim() || undefined,
    businessHoursOpen: businessHoursOpen.trim() || undefined,
    businessHoursClose: businessHoursClose.trim() || undefined,
    workingDays: workingDays.trim() || undefined,
    googleMapsUrl: googleMapsUrl.trim() || undefined,
    products: products

      .filter((p) => p.name.trim())
      .map((p) => ({
        name: p.name.trim(),
        description: p.description.trim() || undefined,
        price: p.price.trim() ? Number(p.price) : undefined,
        category: p.category.trim() || undefined,
        imageUrl: p.imageUrl.trim() || undefined,
      })),
    socialLinks: socialLinks
      .filter((s) => s.platform.trim() && s.url.trim())
      .map((s) => ({ platform: s.platform.trim(), url: s.url.trim() })),
  });

  const onSave = async () => {
    setErr('');
    setSaving(true);
    try {
      const payload = buildPayload();
      if (businessId) {
        const b = await updateBusiness(token, businessId, payload);
        setBusinessId(b.id);
      } else {
        const b = await createBusiness(token, payload);
        setBusinessId(b.id);
        setWebsiteSlug(b.websiteSlug || '');
      }
    } catch (e) {
      setErr(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={topPad}>
        <Typography>Loading…</Typography>
      </Box>
    );
  }

  return (
    <Box sx={topPad}>
      <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 2 }}>
        Business profile
      </Typography>
      <Card sx={{ borderRadius: 3, maxWidth: 900 }}>
        <CardContent>
          <Stack spacing={2}>
            {err && (
              <Typography color="error" variant="body2" fontWeight={700}>
                {err}
              </Typography>
            )}
            <TextField label="Business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
            <TextField label="Sector" select value={sector} onChange={(e) => setSector(e.target.value)}>
              {SECTORS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Website slug (optional — auto from name if empty)"
              value={websiteSlug}
              onChange={(e) => setWebsiteSlug(e.target.value)}
              helperText="Used for your public page URL: /business/your-slug"
            />
            <TextField
              label="Description"
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              multiline
              minRows={3}
            />
            <TextField label="Target market" value={targetMarket} onChange={(e) => setTargetMarket(e.target.value)} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Monthly income (LKR)"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                fullWidth
              />
              <TextField
                label="Monthly production"
                value={monthlyProduction}
                onChange={(e) => setMonthlyProduction(e.target.value)}
                fullWidth
              />
            </Stack>
            <TextField
              label="Marketing goals"
              value={marketingGoals}
              onChange={(e) => setMarketingGoals(e.target.value)}
              multiline
              minRows={2}
            />

            <Typography variant="subtitle1" fontWeight={800} sx={{ mt: 1 }}>
              Business Operations & Location
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Opening Time (e.g. 09:00)"
                value={businessHoursOpen}
                onChange={(e) => setBusinessHoursOpen(e.target.value)}
                helperText="24-hour format (HH:MM)"
                fullWidth
              />
              <TextField
                label="Closing Time (e.g. 18:00)"
                value={businessHoursClose}
                onChange={(e) => setBusinessHoursClose(e.target.value)}
                helperText="24-hour format (HH:MM)"
                fullWidth
              />
            </Stack>
            <TextField
              label="Working Days (comma-separated)"
              value={workingDays}
              onChange={(e) => setWorkingDays(e.target.value)}
              helperText="E.g. Monday,Tuesday,Wednesday,Thursday,Friday"
              fullWidth
            />
            <TextField
              label="Google Maps URL"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              helperText="Link to your store's Google Maps location pin"
              fullWidth
            />


            <Typography variant="subtitle1" fontWeight={800} sx={{ mt: 1 }}>
              Products
            </Typography>
            {products.map((p, i) => (
              <Stack key={i} direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems="flex-start">
                <TextField
                  label="Name"
                  value={p.name}
                  onChange={(e) => {
                    const n = [...products];
                    n[i].name = e.target.value;
                    setProducts(n);
                  }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Price"
                  value={p.price}
                  onChange={(e) => {
                    const n = [...products];
                    n[i].price = e.target.value;
                    setProducts(n);
                  }}
                  sx={{ width: 120 }}
                />
                <TextField
                  label="Category"
                  value={p.category}
                  onChange={(e) => {
                    const n = [...products];
                    n[i].category = e.target.value;
                    setProducts(n);
                  }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Image URL"
                  value={p.imageUrl}
                  onChange={(e) => {
                    const n = [...products];
                    n[i].imageUrl = e.target.value;
                    setProducts(n);
                  }}
                  sx={{ flex: 2 }}
                />
                <IconButton
                  aria-label="remove product"
                  onClick={() => setProducts(products.filter((_, j) => j !== i))}
                  sx={{ mt: 1 }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Stack>
            ))}
            <Button startIcon={<AddIcon />} onClick={() => setProducts([...products, emptyProduct()])} sx={{ alignSelf: 'flex-start' }}>
              Add product
            </Button>

            <Typography variant="subtitle1" fontWeight={800}>
              Social links
            </Typography>
            {socialLinks.map((s, i) => (
              <Stack key={i} direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <TextField
                  label="Platform"
                  value={s.platform}
                  onChange={(e) => {
                    const n = [...socialLinks];
                    n[i].platform = e.target.value;
                    setSocialLinks(n);
                  }}
                  sx={{ minWidth: 160 }}
                />
                <TextField
                  label="URL"
                  value={s.url}
                  onChange={(e) => {
                    const n = [...socialLinks];
                    n[i].url = e.target.value;
                    setSocialLinks(n);
                  }}
                  fullWidth
                />
                <IconButton aria-label="remove" onClick={() => setSocialLinks(socialLinks.filter((_, j) => j !== i))}>
                  <DeleteOutlineIcon />
                </IconButton>
              </Stack>
            ))}
            <Button startIcon={<AddIcon />} onClick={() => setSocialLinks([...socialLinks, emptySocial()])} sx={{ alignSelf: 'flex-start' }}>
              Add social link
            </Button>

            <Button variant="contained" onClick={onSave} disabled={saving || !businessName.trim()} sx={{ mt: 2, alignSelf: 'flex-start' }}>
              {saving ? 'Saving…' : businessId ? 'Update business' : 'Create business'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
