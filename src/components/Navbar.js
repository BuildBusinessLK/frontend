import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Container,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LanguageIcon from '@mui/icons-material/Language';
import { useThemeMode } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import { gradients, getThemeColors, shadows, alpha } from '../theme';

export default function Navbar() {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = translations[language].navbar;
  const colors = getThemeColors(mode);

  const navLinks = [
    { label: t.links.home, path: '/' },
    { label: 'AI Chat', path: '/ai-chat' },
    { label: 'Marketing', path: '/marketing' },
    { label: t.links.subscriptions, path: '/subscriptions' },
    { label: t.links.about, path: '/about' },
    { label: t.links.contact, path: '/contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: 'transparent',
        backdropFilter: 'blur(24px)',
        borderBottom: scrolled
          ? `1px solid ${colors.border.primary}`
          : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ py: 1, px: { xs: 0 } }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  background: gradients.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: shadows.colored.amber,
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 24, color: '#fff', fontWeight: 'bold' }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                  color: colors.text.primary,
                  letterSpacing: '-0.03em',
                  fontSize: '1.35rem',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                }}
              >
                buildbusiness
                <Box
                  component="span"
                  sx={{
                    background: gradients.primaryAlt,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 900,
                  }}
                >
                  lk
                </Box>
              </Typography>
            </Link>
          </Box>

          {/* Desktop Nav */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Button
                    key={link.path}
                    component={Link}
                    to={link.path}
                    sx={{
                      color: isActive
                        ? colors.text.primary
                        : mode === 'dark'
                          ? alpha.white[80]
                          : alpha.gray[75],
                      fontWeight: 500,
                      // fontWeight: isActive ? 600 : 500,
                      // fontSize: '1rem',
                      fontSize: { md: '16px', lg: '16px' },
                      px: 2.5,
                      py: 0.8,
                      borderRadius: 2,
                      background: isActive
                        ? `linear-gradient(135deg, ${alpha.orange[15]}, ${alpha.amber[15]})`
                        : 'transparent',
                      '&:hover': {
                        color: colors.text.primary,
                        background: `linear-gradient(135deg, ${alpha.orange[10]}, ${alpha.amber[10]})`,
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {link.label}
                  </Button>
                );
              })}

              {/* Theme Toggle */}
              <Tooltip title={mode === 'dark' ? t.tooltips.lightMode : t.tooltips.darkMode}>
                <IconButton
                  onClick={toggleTheme}
                  sx={{
                    ml: 1,
                    color: mode === 'dark' ? alpha.white[80] : alpha.gray[85],
                    '&:hover': {
                      background:
                        mode === 'dark' ? alpha.white[10] : alpha.black['05'],
                    },
                  }}
                >
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>

              {/* Language Toggle */}
              <Tooltip title={language === 'en' ? t.tooltips.sinhala : t.tooltips.english}>
                <IconButton
                  onClick={toggleLanguage}
                  sx={{
                    color: mode === 'dark' ? alpha.white[80] : alpha.gray[85],
                    '&:hover': {
                      background:
                        mode === 'dark' ? alpha.white[10] : alpha.black['05'],
                    },
                  }}
                >
                  <LanguageIcon />
                </IconButton>
              </Tooltip>

              <Button
                variant="contained"
                sx={{
                  ml: 1.5,
                  px: 3,
                  py: 1,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  background: gradients.primary,
                  color: '#FFFFFF',
                  boxShadow: shadows.colored.amber,
                  '&:hover': {
                    background: gradients.warm,
                    boxShadow: shadows.colored.amberHover,
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {t.actions.getStarted}
              </Button>
            </Box>
          )}

          {/* Mobile Hamburger */}
          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ color: colors.text.primary }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            background: colors.background.tertiary,
            width: 260,
            borderLeft: colors.border.primary,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={mode === 'dark' ? t.tooltips.lightMode : t.tooltips.darkMode}>
              <IconButton
                onClick={toggleTheme}
                sx={{ color: colors.text.primary }}
              >
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            <Tooltip title={language === 'en' ? t.tooltips.sinhala : t.tooltips.english}>
              <IconButton
                onClick={toggleLanguage}
                sx={{ color: colors.text.primary }}
              >
                <LanguageIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{ color: colors.text.primary }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ px: 2 }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <ListItem
                key={link.path}
                button
                component={Link}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  background: isActive
                    ? `linear-gradient(135deg, ${alpha.orange[15]}, ${alpha.amber[15]})`
                    : 'transparent',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${alpha.orange[10]}, ${alpha.amber[10]})`
                  },
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '1rem',
                    color: isActive
                      ? colors.text.primary
                      : mode === 'dark'
                        ? alpha.white[85]
                        : alpha.gray[85],
                  }}
                />
              </ListItem>
            );
          })}
          <ListItem sx={{ mt: 2 }}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                background: gradients.primary,
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.95rem',
                borderRadius: 50,
                py: 1.2,
                boxShadow: shadows.colored.amber,
                '&:hover': {
                  background: gradients.warm,
                  boxShadow: shadows.colored.amberHover,
                },
              }}
            >
              {t.actions.getStarted}
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </AppBar >
  );
}
