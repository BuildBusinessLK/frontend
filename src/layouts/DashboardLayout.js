import React, { useState, useEffect } from 'react';
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import LanguageIcon from '@mui/icons-material/Language';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import WebAssetRoundedIcon from '@mui/icons-material/WebAssetRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { useThemeMode } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';
import { alpha, brand, getThemeColors, gradients, shadows } from '../theme';
import ProfileDialog from '../components/ProfileDialog';

const DRAWER_W = 280;

function NavTile({ icon, primary, secondary, selected, dense, to, onClick }) {
  return (
    <ListItemButton
      component={RouterLink}
      to={to}
      onClick={onClick}
      selected={selected}
      sx={{
        borderRadius: 2,
        mb: 0.25,
        py: dense ? 0.75 : 1.1,
        pl: 2,
        pr: 1.5,
        '&.Mui-selected': {
          background: `linear-gradient(135deg, ${alpha.orange[15]}, ${alpha.amber[15]})`,
          border: `1px solid ${alpha.green[25]}`,
          '&:hover': {
            background: `linear-gradient(135deg, ${alpha.orange[18]}, ${alpha.amber[18]})`,
          },
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{icon}</ListItemIcon>
      <ListItemText
        primary={primary}
        secondary={secondary}
        primaryTypographyProps={{ fontWeight: selected ? 700 : 600, fontSize: '0.925rem', letterSpacing: '-0.01em' }}
        secondaryTypographyProps={{ variant: 'caption', sx: { opacity: 0.65 } }}
      />
    </ListItemButton>
  );
}

export default function DashboardLayout() {
  const muiTheme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const { language, toggleLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const compact = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [marketingOpen, setMarketingOpen] = useState(() =>
    location.pathname.startsWith(ROUTES.marketing.root),
  );
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith(ROUTES.marketing.root)) {
      setMarketingOpen(true);
    }
  }, [location.pathname]);

  const colors = getThemeColors(mode);
  const path = location.pathname;

  const sidebarBg =
    mode === 'dark'
      ? 'linear-gradient(180deg, rgba(12,17,21,0.98) 0%, rgba(6,10,13,1) 100%)'
      : 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,251,249,1) 100%)';

  const shellBg =
    mode === 'dark'
      ? 'radial-gradient(ellipse 80% 50% at 100% -10%, rgba(34,197,94,0.12), transparent 55%), linear-gradient(180deg, #050A0D 0%, #070F12 55%, #060A0D 100%)'
      : 'linear-gradient(180deg, #F4FAF6 0%, #EEF5F0 100%)';

  const handleNav = () => compact && setMobileOpen(false);

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 1.5, pt: { xs: 1.5, md: 2.5 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 2 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '14px',
            background: gradients.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: shadows.colored.amber,
          }}
        >
          <AutoAwesomeRoundedIcon sx={{ color: '#fff', fontSize: 24 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, fontSize: '1.05rem' }}>
            buildbusiness<span style={{ background: gradients.primaryAlt, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>lk</span>
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.tertiary || colors.text.secondary, opacity: 0.75 }}>
            Workspace
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: colors.border.secondary, mx: 1, mb: 1 }} />

      <List sx={{ px: 0.5, py: 0, flex: 1 }}>
        <NavTile
          icon={<DashboardRoundedIcon />}
          primary="Dashboard"
          secondary="Overview & quick actions"
          selected={path === ROUTES.dashboard}
          dense
          to={ROUTES.dashboard}
          onClick={handleNav}
        />
        <NavTile
          icon={<SmartToyRoundedIcon />}
          primary="AI assistant"
          secondary="RAG + business context"
          selected={path === ROUTES.dashboardAi}
          dense
          to={ROUTES.dashboardAi}
          onClick={handleNav}
        />
        <NavTile
          icon={<MenuBookRoundedIcon />}
          primary="Continuous guidance"
          secondary="Business files & memory"
          selected={path === ROUTES.continuousGuidance}
          dense
          to={ROUTES.continuousGuidance}
          onClick={handleNav}
        />
        <NavTile
          icon={<PersonRoundedIcon />}
          primary="Business profile"
          secondary="Products & social"
          selected={path === ROUTES.businessProfile}
          dense
          to={ROUTES.businessProfile}
          onClick={handleNav}
        />

        {/* Marketing group */}
        <ListItemButton
          onClick={() => setMarketingOpen((o) => !o)}
          sx={{
            borderRadius: 2,
            mb: 0.25,
            py: 1.1,
            pl: 2,
            bgcolor:
              path.startsWith(ROUTES.marketing.root) && path !== ROUTES.marketing.root
                ? mode === 'dark'
                  ? 'rgba(34,197,94,0.06)'
                  : 'rgba(34,197,94,0.06)'
                : 'transparent',
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <CampaignRoundedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Marketing"
            secondary="Website · social · email"
            primaryTypographyProps={{ fontWeight: 650, fontSize: '0.925rem' }}
            secondaryTypographyProps={{ variant: 'caption', sx: { opacity: 0.65 } }}
          />
          {marketingOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={marketingOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 1, pr: 0.5 }}>
            <NavTile
              icon={<HubRoundedIcon sx={{ fontSize: 22 }} />}
              primary="Overview"
              dense
              selected={path === ROUTES.marketing.root}
              to={ROUTES.marketing.root}
              onClick={handleNav}
            />
            <NavTile
              icon={<WebAssetRoundedIcon sx={{ fontSize: 22 }} />}
              primary="Website"
              dense
              selected={path === ROUTES.marketing.website}
              to={ROUTES.marketing.website}
              onClick={handleNav}
            />
            <NavTile
              icon={<ShareRoundedIcon sx={{ fontSize: 22 }} />}
              primary="Social media"
              dense
              selected={path === ROUTES.marketing.social}
              to={ROUTES.marketing.social}
              onClick={handleNav}
            />
            <NavTile
              icon={<EmailRoundedIcon sx={{ fontSize: 22 }} />}
              primary="Email"
              dense
              selected={path === ROUTES.marketing.email}
              to={ROUTES.marketing.email}
              onClick={handleNav}
            />
          </List>
        </Collapse>

        <NavTile
          icon={<SettingsRoundedIcon />}
          primary="Settings"
          secondary="Account & preferences"
          selected={path === ROUTES.settings}
          dense
          to={ROUTES.settings}
          onClick={handleNav}
        />
        {user?.role === 'ADMIN' && (
          <NavTile
            icon={<AdminPanelSettingsRoundedIcon />}
            primary="Admin"
            secondary="Platform stats"
            selected={path === ROUTES.admin}
            dense
            to={ROUTES.admin}
            onClick={handleNav}
          />
        )}
      </List>

      <Divider sx={{ borderColor: colors.border.secondary, mx: 1, mb: 1 }} />

      <Box sx={{ px: 1.5, py: 1.25, borderRadius: 3, bgcolor: mode === 'dark' ? alpha.white['04'] : alpha.black['03'], border: `1px solid ${colors.border.secondary}` }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="caption" sx={{ opacity: 0.55, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
              Signed in
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mt: 0.25 }} noWrap title={user?.email}>
              {user?.fullName || user?.name || 'Entrepreneur'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
              {user?.email}
            </Typography>
          </Box>
          <Tooltip title="Profile & AI context">
            <IconButton size="small" onClick={() => setProfileOpen(true)} sx={{ color: colors.text.secondary, mt: -0.25 }}>
              <AccountCircleRoundedIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Typography
          component="button"
          type="button"
          onClick={() => {
            signOut();
            navigate('/');
            handleNav();
          }}
          sx={{
            mt: 1,
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            p: 0,
            bgcolor: 'transparent',
            color: brand.orange.primary,
            fontWeight: 600,
            fontSize: '0.875rem',
            fontFamily: 'inherit',
          }}
        >
          <LogoutRoundedIcon sx={{ fontSize: 18 }} />
          Sign out
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: 'flex', minHeight: '100vh', background: shellBg }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: { md: 'none' },
          background: colors.overlay.medium,
          backdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${colors.border.secondary}`,
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ color: colors.text.primary }}>
            <MenuIcon />
          </IconButton>
          <Typography sx={{ flex: 1, fontWeight: 800 }}>Workspace</Typography>
          <Tooltip title="Profile & AI context">
            <IconButton onClick={() => setProfileOpen(true)} sx={{ color: colors.text.primary }}>
              <AccountCircleRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton onClick={toggleTheme} sx={{ color: colors.text.primary }}>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
          <Tooltip title={language === 'en' ? 'සිංහල' : 'English'}>
            <IconButton onClick={toggleLanguage} sx={{ color: colors.text.primary }}>
              <LanguageIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_W }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_W,
              background: sidebarBg,
              borderRight: `1px solid ${colors.border.secondary}`,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_W,
              top: 0,
              height: '100%',
              borderRight: `1px solid ${colors.border.secondary}`,
              background: sidebarBg,
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_W}px)` },
          mt: { xs: 8, md: 0 },
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        {/* Desktop toolbar for theme/language (sidebar is narrow; keep parity with marketing pages) */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'flex-end',
            gap: 0.5,
            px: 3,
            pt: 2.5,
            pb: 0,
          }}
        >
          <Tooltip title="Profile & AI context">
            <IconButton size="small" onClick={() => setProfileOpen(true)} sx={{ color: colors.text.secondary }}>
              <AccountCircleRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton size="small" onClick={toggleTheme} sx={{ color: colors.text.secondary }}>
              {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title={language === 'en' ? 'සිංහල' : 'English'}>
            <IconButton size="small" onClick={toggleLanguage} sx={{ color: colors.text.secondary }}>
              <LanguageIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography
            component={RouterLink}
            to="/"
            sx={{
              ml: 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.25,
              fontSize: '0.8rem',
              fontWeight: 600,
              color: colors.text.secondary,
              textDecoration: 'none',
              '&:hover': { color: colors.text.primary },
            }}
          >
            Marketing site <ChevronRightRoundedIcon sx={{ fontSize: 16 }} />
          </Typography>
        </Box>

        <Box sx={{ px: { xs: 2, sm: 2.5, md: 3 }, pb: { xs: 4, md: 5 }, pt: { xs: 1, md: 0 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
