import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Slider,
  Typography,
  Box,
  Tooltip,
  IconButton,
  Chip,
  InputAdornment,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

const BUDGET_PRESETS = [
  { label: '100K', value: 100000 },
  { label: '250K', value: 250000 },
  { label: '500K', value: 500000 },
  { label: '1M', value: 1000000 },
  { label: '2M', value: 2000000 },
];

export default function BusinessRecommendationDialog({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  error = null,
  businessSector = 'coconut',
}) {
  const [sector, setSector] = useState(businessSector);
  const [formData, setFormData] = useState({
    budget: 250000,
    monthly_yield: 1200,
    employees: 2,
    experience: 'intermediate',
  });

  useEffect(() => {
    if (businessSector) {
      setSector(businessSector.toLowerCase());
    }
  }, [businessSector]);

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'experience' ? value : parseInt(value) || 0,
    }));
  };

  const handleSliderChange = (field) => (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  const handleBudgetPreset = (val) => {
    setFormData((prev) => ({ ...prev, budget: val }));
  };

  const handleSubmit = () => {
    onSubmit({
      sector: sector || 'coconut',
      budget_lkr: formData.budget,
      monthly_yield_kg: formData.monthly_yield,
      employees: formData.employees,
      experience_years: formData.experience,
      // Legacy keys for backward compatibility
      budget: formData.budget,
      monthly_yield: formData.monthly_yield,
      experience: formData.experience,
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3.5,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#111827' : '#ffffff'),
          backgroundImage: 'none',
          boxShadow: '0 24px 48px rgba(0,0,0,0.25)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1.5, pt: 2.5, px: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <AutoAwesomeRoundedIcon sx={{ color: '#22C55E', fontSize: 22 }} />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Find the Right Product for My Business
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Tell us about your budget, raw material, and team — our AI will rank the best products for your business.
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3, py: 2.5 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Sector Selection */}
          <FormControl fullWidth disabled={isLoading}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.75 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Agricultural Sector
              </Typography>
              <Tooltip title="Select the value chain you want to operate in" arrow>
                <IconButton size="small" sx={{ p: 0.2 }}>
                  <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Stack>
            <Select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="coconut">🌴 Coconut (VCO, Flour, Milk, Chips, Desiccated)</MenuItem>
              <MenuItem value="kithul">🍯 Kithul (Treacle, Jaggery, Flour)</MenuItem>
              <MenuItem value="palmyrah">☀️ Palmyrah / Thal (Jaggery, Sugar, Treacle)</MenuItem>
            </Select>
          </FormControl>

          {/* Investment Budget */}
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Starting Investment Budget (LKR)
              </Typography>
              <Tooltip title="Total capital available for machinery, packaging, and initial raw material" arrow>
                <IconButton size="small" sx={{ p: 0.2 }}>
                  <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Stack>

            <TextField
              type="number"
              value={formData.budget}
              onChange={handleFieldChange('budget')}
              fullWidth
              disabled={isLoading}
              InputProps={{
                startAdornment: <InputAdornment position="start">LKR</InputAdornment>,
              }}
              sx={{ mb: 1 }}
            />

            <Slider
              value={formData.budget}
              min={50000}
              max={3000000}
              step={25000}
              onChange={handleSliderChange('budget')}
              disabled={isLoading}
              sx={{ color: '#22C55E', mb: 1 }}
            />

            {/* Quick Preset Chips */}
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {BUDGET_PRESETS.map((p) => (
                <Chip
                  key={p.label}
                  label={p.label}
                  size="small"
                  clickable
                  onClick={() => handleBudgetPreset(p.value)}
                  color={formData.budget === p.value ? 'success' : 'default'}
                  variant={formData.budget === p.value ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 600 }}
                />
              ))}
            </Stack>
          </Box>

          {/* Monthly Raw Material / Yield */}
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Monthly Raw Material Access (kg / Liters)
              </Typography>
              <Tooltip title="Approximate amount of coconuts, kithul sap, or palmyrah sap you can procure per month" arrow>
                <IconButton size="small" sx={{ p: 0.2 }}>
                  <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Stack>

            <TextField
              type="number"
              value={formData.monthly_yield}
              onChange={handleFieldChange('monthly_yield')}
              fullWidth
              disabled={isLoading}
              helperText="e.g. 1,000 kg coconuts or 400 L sap"
              sx={{ mb: 1 }}
            />

            <Slider
              value={formData.monthly_yield}
              min={100}
              max={10000}
              step={100}
              onChange={handleSliderChange('monthly_yield')}
              disabled={isLoading}
              sx={{ color: '#10B981' }}
            />
          </Box>

          {/* Employees & Experience Grid */}
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Employees
                </Typography>
                <Tooltip title="Initial team size including owner/operators" arrow>
                  <IconButton size="small" sx={{ p: 0.2 }}>
                    <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Stack>
              <TextField
                type="number"
                value={formData.employees}
                onChange={handleFieldChange('employees')}
                fullWidth
                inputProps={{ min: 1, max: 20 }}
                disabled={isLoading}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Experience Level
                </Typography>
                <Tooltip title="Your previous background in processing or agro-business" arrow>
                  <IconButton size="small" sx={{ p: 0.2 }}>
                    <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Stack>
              <FormControl fullWidth disabled={isLoading}>
                <Select
                  value={formData.experience}
                  onChange={handleFieldChange('experience')}
                >
                  <MenuItem value="beginner">Beginner (0 - 1 yr)</MenuItem>
                  <MenuItem value="intermediate">Intermediate (1 - 3 yrs)</MenuItem>
                  <MenuItem value="advanced">Advanced (3+ yrs)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={isLoading} sx={{ color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeRoundedIcon />}
          sx={{
            borderRadius: 2,
            fontWeight: 700,
            px: 2.5,
            background: 'linear-gradient(135deg,#22C55E,#16A34A)',
            boxShadow: '0 4px 14px rgba(34,197,94,0.35)',
          }}
        >
          {isLoading ? 'Analyzing Your Profile…' : 'Get My Product Match'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
