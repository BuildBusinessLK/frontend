import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Button, Grid, Stack, Chip, useTheme, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import VerifiedIcon from '@mui/icons-material/Verified';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import bgImage from '../assets/bg-image.png';
import { useThemeMode } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import { gradients, alpha, brand, getThemeColors, shadows, getThemeShadows } from '../theme';


export default function Hero() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const { language } = useLanguage();
  const t = translations[language].hero;
  const colors = getThemeColors(mode);

  const [scrollY, setScrollY] = useState(0);
  const [bgFixed, setBgFixed] = useState(true);
  const [userScrolled, setUserScrolled] = useState(false);
  const autoScrollFrameRef = useRef(null);
  const autoScrollTimeoutRef = useRef(null);
  const autoScrollingRef = useRef(false);
  const hasAutoScrolledRef = useRef(false);

  const stats = [
    { value: t.stats.industries, label: t.stats.industriesLabel },
    { value: t.stats.aiPowered, label: t.stats.aiPoweredLabel },
    { value: t.stats.support, label: t.stats.supportLabel },
  ];

  useEffect(() => {
    
  }, []);

  // Reset scroll position on mount and prevent browser scroll restoration.
  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      setScrollY(0);
      setBgFixed(true);
    });

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  // Auto-scroll after a short delay with a slow, gradual animation.
  useEffect(() => {
    if (userScrolled || hasAutoScrolledRef.current) {
      return undefined;
    }

    autoScrollTimeoutRef.current = window.setTimeout(() => {
      if (!userScrolled && !hasAutoScrolledRef.current) {
        autoScrollingRef.current = true;
        hasAutoScrolledRef.current = true;

        const startPosition = window.scrollY;
        const targetPosition = window.innerHeight;
        const distance = targetPosition - startPosition;
        const duration = 2200;
        let startTime = null;

        const easeInOutCubic = (t) => {
          return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        const animation = (currentTime) => {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);
          const ease = easeInOutCubic(progress);

          window.scrollTo(0, startPosition + distance * ease);

          if (progress < 1) {
            autoScrollFrameRef.current = requestAnimationFrame(animation);
          } else {
            autoScrollingRef.current = false;
            window.scrollTo(0, targetPosition);
          }
        };

        autoScrollFrameRef.current = requestAnimationFrame(animation);
      }
    }, 200);

    return () => {
      if (autoScrollTimeoutRef.current) {
        window.clearTimeout(autoScrollTimeoutRef.current);
      }
      if (autoScrollFrameRef.current) {
        cancelAnimationFrame(autoScrollFrameRef.current);
      }
      autoScrollingRef.current = false;
    };
  }, [userScrolled]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Detect manual user scroll and cancel auto-scroll if needed.
      if (!autoScrollingRef.current && !hasAutoScrolledRef.current && Math.abs(currentScrollY - lastScrollY) > 1) {
        setUserScrolled(true);
      }

      // When scroll reaches viewport height, unlock background for normal scrolling
      if (currentScrollY >= window.innerHeight) {
        setBgFixed(false);
      } else {
        setBgFixed(true);

        // If user tries to scroll down when text layer is visible, help them scroll up
        if (!autoScrollingRef.current && currentScrollY > lastScrollY && currentScrollY < window.innerHeight * 0.8) {
          // User is scrolling down, but text layer not fully visible yet
          // Gently encourage scrolling to full view
          setTimeout(() => {
            if (window.scrollY < window.innerHeight * 0.9) {
              window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
              });
            }
          }, 100);
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate text layer position - text scrolls from 100vh to 0 as we scroll through Hero
  // When fixed: position relative to viewport, when absolute: position in document
  const textLayerTop = bgFixed ? Math.max(window.innerHeight - scrollY, 0) : 0;

  // Show scroll up button initially, before text layer comes up (hide after 20% scroll progress)
  const showScrollUpButton = scrollY < window.innerHeight * 0.2;

  // Handler to smoothly scroll up the text layer
  const handleScrollUp = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: '200vh', // Need space for scroll animation
        overflow: 'visible',
      }}
    >
      {/* Background Layer - 100vh x 100vw - Just the clean image */}
      <Box
        sx={{
          position: bgFixed ? 'fixed' : 'absolute',
          top: bgFixed ? 0 : '100vh',
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        
        {/* Decorative elements - top left */}
        <Box
          sx={{
            position: 'absolute',
            top: 80,
            left: 40,
            width: 300,
            height: 300,
            opacity: 0.15,
            pointerEvents: 'none',
          }}
        >
          {/* Floating circles */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Box
              sx={{
                width: 140,
                height: 140,
                borderRadius: '50%',
                background: gradients.primary,
                position: 'absolute',
                top: 0,
                left: 0,
                filter: 'blur(40px)',
              }}
            />
          </motion.div>
          <motion.div
            animate={{
              y: [0, 20, 0],
              x: [0, 15, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: gradients.warm,
                position: 'absolute',
                top: 120,
                left: 100,
                filter: 'blur(35px)',
              }}
            />
          </motion.div>
          {/* Geometric shapes */}
          <Box
            sx={{
              position: 'absolute',
              top: 60,
              left: 180,
              width: 80,
              height: 80,
              border: '3px solid',
              borderColor: mode === 'dark' ? alpha.amber[30] : alpha.orange[30],
              borderRadius: '16px',
              transform: 'rotate(25deg)',
            }}
          />
        </Box>

        {/* Creative Floating Scroll Up Button - on background layer */}
        {showScrollUpButton && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 40,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            {/* Pulse effect background */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                width: 90,
                height: 90,
                borderRadius: '50%',
                background: gradients.primary,
                filter: 'blur(10px)',
                zIndex: -1,
              }}
            />
            
            {/* Floating button */}
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <IconButton
                onClick={handleScrollUp}
                sx={{
                  width: 64,
                  height: 64,
                  background: gradients.primary,
                  backdropFilter: 'blur(12px)',
                  boxShadow: shadows.colored.amberOrange,
                  '&:hover': {
                    background: gradients.warm,
                    transform: 'scale(1.1)',
                    boxShadow: shadows.colored.amberOrangeHover,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <KeyboardArrowUpIcon
                  sx={{
                    fontSize: '2.5rem',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                  }}
                />
              </IconButton>
            </motion.div>
            
            {/* Text label with glow */}
            <motion.div
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Typography
                sx={{
                  color: colors.text.primary,
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textShadow: mode === 'dark' 
                    ? shadows.dark.text.glow
                    : shadows.dark.text.subtle,
                }}
              >
                Explore
              </Typography>
            </motion.div>
          </Box>
        )}
      </Box>

      {/* Text Layer - 100vh with dark overlay and centered text */}
      <Box
        sx={{
          position: bgFixed ? 'fixed' : 'absolute',
          top: bgFixed ? `${textLayerTop}px` : '100vh',
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Dark overlays */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              mode === 'dark'
                ? 'linear-gradient(0deg, rgba(6,10,13,0.86) 0%, rgba(6,10,13,0.68) 85%, rgba(6,10,13,0.35) 100%)'
                : 'rgba(360,360,360,0.63)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              mode === 'dark'
                ? `radial-gradient(ellipse 80% 80% at 20% 50%, ${alpha.green['08']} 0%, transparent 60%)`
                : '',
            pointerEvents: 'none',
          }}
        />
        {/* Dot grid */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              mode === 'dark'
                ? `radial-gradient(${alpha.white['04']} 1px, transparent 1px)`
                : `radial-gradient(${alpha.black['06']} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />
        {/* Bottom fade */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 180,
            background:
              mode === 'dark'
                ? 'linear-gradient(to bottom, transparent, #060A0D)'
                : '',
            pointerEvents: 'none',
          }}
        />
        <Container
          maxWidth="xl"
          sx={{
            position: 'relative',
            zIndex: 1,
            pt: 14,
            pb: 10,
          }}
        >
          <Grid container spacing={6} justifyContent="center" sx={{ width: '100%' }}>
            {/* Center content */}
            <Grid size={{ xs: 12, md: 10, lg: 8 }}>
              <Stack spacing={3.5} alignItems="center" textAlign="center">
                <Box>
                  <Chip
                    icon={<VerifiedIcon sx={{ fontSize: '15px !important', color: mode === 'dark' ? `${brand.green.primary} !important` : '#FFFFFF !important' }} />}
                    label={t.badge}
                    sx={{
                      background: mode === 'dark' ? alpha.green[10] : brand.green.light,
                      border: mode === 'dark' ? `1px solid ${alpha.green[30]}` : `1px solid ${alpha.green[20]}`,
                      color: mode === 'dark' ? brand.green.light : '#FFFFFF',
                      fontWeight: 600,
                      fontSize: language === 'si' ? '0.7rem' : '0.75rem',
                      height: 32,
                    }}
                  />
                </Box>

                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.6rem', sm: '3.2rem', md: '3.6rem', lg: '4rem' },
                    lineHeight: 1.1,
                    color: theme.palette.text.primary,
                  }}
                >
                  {t.title.grow}{' '}
                  <Box
                    component="span"
                    sx={{
                      background: mode === 'dark' ? gradients.greenLight : gradients.green,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {t.title.traditional}
                  </Box>
                  <br />
                  {t.title.withAI}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: mode === 'dark' ? theme.palette.text.secondary : theme.palette.text.primary,
                    fontWeight: 400,
                    fontSize: { xs: '1rem', md: '1.08rem' },
                    lineHeight: 1.75,
                    maxWidth: 460,
                  }}
                >
                  {t.description}
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      background: gradients.green,
                      boxShadow: shadows.colored.green,
                      py: 1.7,
                      px: 3.5,
                      fontSize: '1rem',
                      color: '#fff',
                      fontWeight: 700,
                      '&:hover': {
                        background: gradients.greenAlt,
                        boxShadow: shadows.colored.greenHover,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {t.startButton}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PlayCircleOutlineIcon />}
                    sx={{
                      borderColor: mode === 'dark' ? alpha.white[20] : alpha.black[20],
                      color: theme.palette.text.secondary,
                      py: 1.7,
                      px: 3.5,
                      fontSize: '1rem',
                      backdropFilter: 'blur(10px)',
                      background: mode === 'dark' ? alpha.white['04'] : alpha.black['02'],
                      '&:hover': {
                        borderColor: alpha.green[50],
                        background: alpha.green['08'],
                        color: brand.green.light,
                      },
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {t.demoButton}
                  </Button>
                </Stack>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, pt: 0.5, justifyContent: 'center' }}>
                  {stats.map((s) => (
                    <Box key={s.label}>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: mode === 'dark' ? brand.green.light : brand.green.dark, lineHeight: 1 }}>
                        {s.value}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: mode === 'dark' ? colors.text.muted : alpha.black[80],
                          fontSize: language === 'si' ? '0.7rem' : '0.75rem',
                        }}
                      >
                        {s.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
