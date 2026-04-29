import React from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AIChatPage from './pages/AIChatPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MarketingPage from './pages/MarketingPage';
import WebsitePage from './pages/WebsitePage';
import SocialPage from './pages/SocialPage';
import EmailPage from './pages/EmailPage';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CssBaseline />
        
          <BrowserRouter>
            <MainLayout>

              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/subscriptions" element={<SubscriptionsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/ai-chat" element={<AIChatPage />} />
                <Route path="/marketing" element={<MarketingPage />} />
                <Route path="/website" element={<WebsitePage />} />
                <Route path="/social" element={<SocialPage />} />
                <Route path="/email" element={<EmailPage />} />
              </Routes>

            </MainLayout>
          </BrowserRouter>
        
      </LanguageProvider>
    </ThemeProvider>
  );

}
