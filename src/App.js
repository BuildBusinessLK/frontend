import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AIChatPage from './pages/AIChatPage';
import MarketingPage from './pages/MarketingPage';
import WebsiteMarketingPage from './pages/WebsiteMarketingPage';
import SocialPage from './pages/SocialPage';
import EmailPage from './pages/EmailPage';
import DashboardHomePage from './pages/DashboardHomePage';
import BusinessProfilePage from './pages/BusinessProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import HostedSmeBusinessPage from './pages/HostedSmeBusinessPage';

function LegacyMarketingRedirect() {
  const { pathname } = useLocation();
  const tail = pathname.replace(/^\/marketing/, '');
  return <Navigate to={`/dashboard/marketing${tail}`} replace />;
}

function LegacyAiAgentRedirect() {
  return <Navigate to="/dashboard/ai-assistant" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/business/:slug" element={<HostedSmeBusinessPage />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardHomePage />} />
                <Route path="ai-assistant" element={<AIChatPage />} />
                <Route path="business-profile" element={<BusinessProfilePage />} />
                <Route path="marketing" element={<MarketingPage />} />
                <Route path="marketing/website" element={<WebsiteMarketingPage />} />
                <Route path="marketing/social" element={<SocialPage />} />
                <Route path="marketing/email" element={<EmailPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route
                  path="admin"
                  element={
                    <AdminRoute>
                      <AdminDashboardPage />
                    </AdminRoute>
                  }
                />
                <Route path="ai-agent" element={<LegacyAiAgentRedirect />} />
                <Route path="marketing-2/*" element={<Navigate to="/dashboard/marketing/website" replace />} />
              </Route>

              <Route path="/ai-chat" element={<LegacyAiAgentRedirect />} />
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
