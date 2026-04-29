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
import WebsiteMarketingPage from './pages/WebsiteMarketingPage';
import TemplateSelectionPage from './pages/TemplateSelectionPage';
import GeneratedWebsitePage from './pages/GeneratedWebsitePage';
import WebsitePage from './pages/WebsitePage';
import SocialPage from './pages/SocialPage';
import EmailPage from './pages/EmailPage';
import NetlifyCallback from './pages/NetlifyCallback';
import ShopSetupPage from './pages/ShopSetupPage';
import AdGeneratorPage from './pages/AdGeneratorPage';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Netlify OAuth Callback - Not in MainLayout */}
            <Route path="/netlify-callback" element={<NetlifyCallback />} />

            {/* Main Routes */}
            <Route
              path="/*"
              element={
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/subscriptions" element={<SubscriptionsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/ai-chat" element={<AIChatPage />} />
                    <Route path="/marketing" element={<MarketingPage />} />
                    {/* <Route path="/marketing/website" element={<WebsitePage />} /> */}
                    <Route path="/marketing/social" element={<SocialPage />} />
                    <Route path="/marketing/email" element={<EmailPage />} />
                    <Route path="/ai-chat-havindu" element={<AIChatPage />} />
                    <Route path="/marketing/website" element={<WebsiteMarketingPage />} />
                    <Route path="/marketing/website/templates" element={<TemplateSelectionPage />} />
                    <Route path="/generated-website" element={<GeneratedWebsitePage />} />

                    <Route path="/marketing/ad-generator/setup" element={<ShopSetupPage />} />
                    <Route path="/marketing/ad-generator" element={<AdGeneratorPage />} />
                  </Routes>
                </MainLayout>
              }
            />
          </Routes>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );

}
