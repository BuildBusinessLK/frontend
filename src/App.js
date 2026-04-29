import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AIChatPage from './pages/AIChatPage';
import MarketingPage from './pages/MarketingPage';
import ShopSetupPage from './pages/ShopSetupPage';
import AdGeneratorPage from './pages/AdGeneratorPage';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CssBaseline />
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/subscriptions" element={<SubscriptionsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/ai-chat" element={<AIChatPage />} />
              <Route path="/marketing" element={<MarketingPage />} />
              <Route path="/marketing/ad-generator/setup" element={<ShopSetupPage />} />
              <Route path="/marketing/ad-generator" element={<AdGeneratorPage />} />
            </Routes>
          </MainLayout>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}
