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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>ML Business Recommendation</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Stack spacing={2}>
          <TextField
            label="Investment Budget (LKR)"
            type="number"
            value={formData.budget}
            onChange={handleChange('budget')}
            fullWidth
            inputProps={{ min: 0, step: 10000 }}
            disabled={isLoading}
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
          />
          <TextField
            label="Number of Employees"
            type="number"
            value={formData.employees}
            onChange={handleChange('employees')}
            fullWidth
            inputProps={{ min: 1, step: 1 }}
            disabled={isLoading}
          />
          <FormControl fullWidth disabled={isLoading}>
            <InputLabel>Experience Level</InputLabel>
            <Select
              value={formData.experience}
              label="Experience Level"
              onChange={handleChange('experience')}
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          sx={{ background: 'linear-gradient(135deg,#22C55E,#16A34A)' }}
        >
          {isLoading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
          {isLoading ? 'Getting Recommendation...' : 'Get Recommendation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
