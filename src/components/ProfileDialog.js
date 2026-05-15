import React, { useEffect, useState } from 'react';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useThemeMode } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getThemeColors, gradients, shadows } from '../theme';
import { apiPatchProfile } from '../services/authApi';

export default function ProfileDialog({ open, onClose }) {
  const { mode } = useThemeMode();
  const colors = getThemeColors(mode);
  const { user, token, setUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [district, setDistrict] = useState('');
  const [aiNotes, setAiNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!open || !user) return;
    setFullName(user.fullName || '');
    setPhone(user.phone || '');
    setBusinessName(user.businessName || '');
    setIndustry(user.industry || '');
    setDistrict(user.district || '');
    setAiNotes(user.aiNotes || '');
    setErr('');
  }, [open, user]);

  const handleSave = async () => {
    setErr('');
    setSaving(true);
    try {
      const updated = await apiPatchProfile(token, {
        fullName: fullName.trim() || undefined,
        phone: phone.trim() || undefined,
        businessName: businessName.trim() || undefined,
        industry: industry.trim() || undefined,
        district: district.trim() || undefined,
        aiNotes: aiNotes.trim() || undefined,
      });
      setUser(updated);
      onClose();
    } catch (e) {
      setErr(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
        Profile
        <Typography variant="body2" sx={{ color: colors.text.secondary, fontWeight: 400, mt: 0.5 }}>
          Used to personalize the AI assistant — add more detail anytime.
        </Typography>
        {user?.role && (
          <Chip size="small" label={String(user.role).toUpperCase()} sx={{ mt: 1, fontWeight: 700 }} color={user.role === 'ADMIN' ? 'warning' : 'default'} />
        )}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField label="Email" value={user?.email || ''} fullWidth disabled />
          <TextField label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} fullWidth required />
          <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
          <TextField
            label="Business / farm name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            fullWidth
          />
          <TextField label="Primary industry" value={industry} onChange={(e) => setIndustry(e.target.value)} fullWidth placeholder="Coconut, Kithul…" />
          <TextField label="District" value={district} onChange={(e) => setDistrict(e.target.value)} fullWidth />
          <TextField
            label="Notes for AI (goals, products, constraints)"
            value={aiNotes}
            onChange={(e) => setAiNotes(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            placeholder="Short context the assistant should remember — e.g. bulk copra, retail jaggery, export trials…"
          />
          {err && (
            <Typography variant="body2" color="error" fontWeight={600}>
              {err}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ borderRadius: 999 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={saving || !fullName.trim()}
          onClick={handleSave}
          sx={{ borderRadius: 999, fontWeight: 800, background: gradients.primary, boxShadow: shadows.colored.amber }}
        >
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
