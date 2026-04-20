import React from 'react';
import { Box, useTheme } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout({ children }) {
  const theme = useTheme();
  
  return (
    <Box sx={{ background: theme.palette.background.default, minHeight: '100vh' }}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </Box>
  );
}
