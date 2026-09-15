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

// Public pages
import HomePage from './pages/HomePage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import HostedSmeBusinessPage from './pages/HostedSmeBusinessPage';

// Dashboard pages
import DashboardHomePage from './pages/DashboardHomePage';
import AIChatPage from './pages/AIChatPage';
import ContinuousGuidancePage from './pages/ContinuousGuidancePage';
import BusinessProfilePage from './pages/BusinessProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Marketing pages
import MarketingPage from './pages/MarketingPage';
import WebsiteMarketingPage from './pages/WebsiteMarketingPage';
import SocialPage from './pages/SocialPage';
import EmailPage from './pages/EmailPage';

// Legacy redirect helpers
function LegacyAiRedirect() {
  return <Navigate to="/dashboard/ai-assistant" replace />;
}

function LegacyMarketingRedirect() {
  const { pathname } = useLocation();
  const tail = pathname.replace(/^\/marketing/, '');
  return <Navigate to={`/dashboard/marketing${tail}`} replace />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CssBaseline />
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Public SME hosted business page */}
              <Route path="/business/:slug" element={<HostedSmeBusinessPage />} />

              {/* Legacy redirects */}
              <Route path="/ai-chat" element={<LegacyAiRedirect />} />
              <Route path="/marketing/*" element={<LegacyMarketingRedirect />} />

              {/* Protected dashboard */}
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
                <Route path="ai-agent" element={<LegacyAiRedirect />} />
                <Route path="continuous-guidance" element={<ContinuousGuidancePage />} />
                <Route path="business-profile" element={<BusinessProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route
                  path="admin"
                  element={
                    <AdminRoute>
                      <AdminDashboardPage />
                    </AdminRoute>
                  }
                />

                {/* Marketing module */}
                <Route path="marketing" element={<MarketingPage />} />
                <Route path="marketing/website" element={<WebsiteMarketingPage />} />
                <Route path="marketing/social" element={<SocialPage />} />
                <Route path="marketing/email" element={<EmailPage />} />
              </Route>

              {/* Public marketing site */}
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
