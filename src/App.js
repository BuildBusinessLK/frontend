import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AIChatPage from './pages/AIChatPage';
import MarketingPage from './pages/MarketingPage';
import WebsiteMarketingPage from './pages/WebsiteMarketingPage';
import TemplateSelectionPage from './pages/TemplateSelectionPage';
import GeneratedWebsitePage from './pages/GeneratedWebsitePage';
import SocialPage from './pages/SocialPage';
import EmailPage from './pages/EmailPage';
import NetlifyCallback from './pages/NetlifyCallback';
import ShopSetupPage from './pages/ShopSetupPage';
import AdGeneratorPage from './pages/AdGeneratorPage';
import DashboardHomePage from './pages/DashboardHomePage';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage';
import Marketing2HubPage from './pages/Marketing2HubPage';
import SmeWebsiteStudioPage from './pages/SmeWebsiteStudioPage';

function LegacyMarketingRedirect() {
  const { pathname } = useLocation();
  const tail = pathname.replace(/^\/marketing/, '');
  return <Navigate to={`/dashboard/marketing${tail}`} replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/netlify-callback" element={<NetlifyCallback />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardHomePage />} />
                <Route path="ai-agent" element={<AIChatPage />} />
                <Route path="analytics" element={<AnalyticsDashboardPage />} />
                <Route path="marketing" element={<MarketingPage />} />
                <Route path="marketing/website" element={<WebsiteMarketingPage />} />
                <Route path="marketing/website/templates" element={<TemplateSelectionPage />} />
                <Route path="marketing/social" element={<SocialPage />} />
                <Route path="marketing/email" element={<EmailPage />} />
                <Route path="marketing/ad-generator/setup" element={<ShopSetupPage />} />
                <Route path="marketing/ad-generator" element={<AdGeneratorPage />} />
                <Route path="marketing-2" element={<Marketing2HubPage />} />
                <Route path="marketing-2/studio" element={<SmeWebsiteStudioPage />} />
                <Route path="generated-website" element={<GeneratedWebsitePage />} />
              </Route>

              <Route
                path="/ai-chat"
                element={<Navigate to="/dashboard/ai-agent" replace />}
              />
              <Route path="/ai-chat-havindu" element={<Navigate to="/dashboard/ai-agent" replace />} />
              <Route path="/marketing/*" element={<LegacyMarketingRedirect />} />

              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="subscriptions" element={<SubscriptionsPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="sign-in" element={<SignInPage />} />
                <Route path="sign-up" element={<SignUpPage />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
