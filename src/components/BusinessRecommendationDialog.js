import React, { useState } from 'react';
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
} from '@mui/material';

export default function BusinessRecommendationDialog({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  error = null,
  businessSector = 'coconut',
}) {
  const [formData, setFormData] = useState({
    budget: 250000,
    monthly_yield: 3500,
    employees: 2,
    experience: 'intermediate',
  });

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'experience' ? value : parseInt(value) || 0,
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      sector: businessSector,
      ...formData,
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
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#121824' : '#ffffff'),
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        AI Business & Product Matcher
      </DialogTitle>
      <DialogContent dividers sx={{ pt: '24px !important' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Investment Budget (LKR)"
            type="number"
            value={formData.budget}
            onChange={handleChange('budget')}
            fullWidth
            inputProps={{ min: 0, step: 10000 }}
            disabled={isLoading}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Monthly Yield / Production"
            type="number"
            value={formData.monthly_yield}
            onChange={handleChange('monthly_yield')}
            fullWidth
            inputProps={{ min: 0, step: 100 }}
            disabled={isLoading}
            helperText="Expected monthly output in kg or units"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Number of Employees"
            type="number"
            value={formData.employees}
            onChange={handleChange('employees')}
            fullWidth
            inputProps={{ min: 1, step: 1 }}
            disabled={isLoading}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth disabled={isLoading}>
            <InputLabel shrink>Experience Level</InputLabel>
            <Select
              value={formData.experience}
              label="Experience Level"
              notched
              onChange={handleChange('experience')}
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ borderRadius: 2, fontWeight: 700 }}
        >
          {isLoading ? 'Analyzing…' : 'Find Best Product Match'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
