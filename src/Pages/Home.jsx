import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Fade from '@mui/material/Fade';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import DescriptionIcon from '@mui/icons-material/Description';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ensaLogo from '../assets/ensa_logo.png';
import campusHero from '../assets/campus-hero.png';

const stats = [
  { icon: <Inventory2Icon />, value: '5000+', label: 'Dossiers Archivés' },
  { icon: <GroupsIcon />, value: '50+', label: 'Utilisateurs Actifs' },
  { icon: <DescriptionIcon />, value: '10000+', label: 'Documents Gérés' },
  { icon: <SchoolIcon />, value: '99.9%', label: 'Disponibilité' },
];

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const numericTarget = parseInt(target.replace(/\D/g, ''));
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = numericTarget / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericTarget) { setCount(numericTarget); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [numericTarget]);
  return <>{count.toLocaleString()}{suffix}</>;
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFBFC' }}>
      {/* ─── NavBar ──────────────────────────────────────────── */}
      <AppBar
        position="fixed" elevation={0}
        sx={{
          backgroundColor: '#0D47A1',
          backgroundImage:
            'repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 20px, rgba(255,255,255,0.015) 20px 40px)',
          borderBottom: '4px solid #F6A800',
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 5 }, minHeight: { xs: 85, md: 110 }, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1, minWidth: 0 }}>
            <Box
              sx={{
                width: { xs: 240, sm: 300, md: 360 },
                height: { xs: 80, sm: 110, md: 140 },
                borderRadius: 5,
                backgroundColor: '#ffffff',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                overflow: 'hidden', 
                flexShrink: 0,
                p: { xs: 1.2, sm: 1.5, md: 2 },
                border: '4px solid #F6A800',
                boxShadow: '0 12px 36px rgba(246, 168, 0, 0.25)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.08)',
                  boxShadow: '0 16px 48px rgba(246, 168, 0, 0.4)',
                  border: '4px solid #FFB74D',
                },
              }}
            >
              <Box component="img" src={ensaLogo} alt="ENSA"
                sx={{ 
                  width: '90%', 
                  height: '90%', 
                  margin: 'auto',
                  objectFit: 'contain',
                  transition: 'transform 0.3s ease-out'
                }} />
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 0 }}>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: { sm: '0.95rem', md: '1.1rem' }, lineHeight: 1.05, letterSpacing: '-0.01em' }}>
                ENSA Béni Mellal
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.68)', fontSize: { sm: '0.7rem', md: '0.8rem' }, lineHeight: 1.2 }}>
                École Nationale des Sciences Appliquées
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 }, flexShrink: 0 }}>
            <Button
              onClick={() => navigate('/connexion')}
              sx={{ color: '#fff', fontWeight: 500, fontSize: { xs: '0.82rem', md: '0.98rem' }, textTransform: 'none', px: 1.2, '&:hover': { color: '#FFECB3', bgcolor: 'rgba(255,255,255,0.06)' } }}
            >
              Connexion
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ─── Hero Section ────────────────────────────────────── */}
      <Box sx={{
        position: 'relative', minHeight: { xs: '85vh', md: '92vh' },
        display: 'flex', alignItems: 'center',
        overflow: 'hidden',
      }}>
        {/* Background image */}
        <Box sx={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url(${campusHero})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          '&::after': {
            content: '""', position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(13,71,161,0.88) 0%, rgba(21,101,192,0.75) 40%, rgba(230,81,0,0.65) 100%)',
          },
        }} />

        {/* Animated dots */}
        <Box sx={{
          position: 'absolute', inset: 0, zIndex: 1, opacity: 0.15,
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Fade in timeout={1000}>
            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, md: 7 }}>
                <Box sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 1,
                  bgcolor: 'rgba(255,255,255,0.12)', borderRadius: 5, px: 2, py: 0.5, mb: 3,
                  border: '1px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                }}>
                  <SchoolIcon sx={{ color: '#FFB74D', fontSize: 18 }} />
                  <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, letterSpacing: 0.5 }}>
                    ÉCOLE NATIONALE DES SCIENCES APPLIQUÉES
                  </Typography>
                </Box>

                <Typography variant="h2" sx={{
                  fontWeight: 800, color: '#fff', lineHeight: 1.1, mb: 2.5,
                  fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                  letterSpacing: '-0.03em',
                  textShadow: '0 2px 20px rgba(0,0,0,0.15)',
                }}>
                  Gérez vos archives{' '}
                  <Box component="span" sx={{
                    background: 'linear-gradient(135deg, #FFB74D, #FF8F00)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                    en toute simplicité
                  </Box>
                </Typography>

                <Typography sx={{
                  color: 'rgba(255,255,255,0.85)', fontSize: { xs: '1rem', md: '1.15rem' },
                  lineHeight: 1.7, maxWidth: 520, mb: 4,
                }}>
                  Plateforme complète de gestion des archives permettant de stocker,
                  organiser et consulter les dossiers administratifs des étudiants
                  de manière efficace et sécurisée.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button variant="contained" size="large" onClick={() => navigate('/connexion')}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      bgcolor: '#fff', color: '#0D47A1', fontWeight: 700, px: 4, py: 1.5,
                      borderRadius: 3, fontSize: '1rem',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                      '&:hover': { bgcolor: '#E3F2FD', transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(0,0,0,0.25)' },
                      transition: 'all 0.25s ease',
                    }}>
                    Accéder à la plateforme
                  </Button>
                  <Button variant="outlined" size="large"
                    onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.4)', color: '#fff', px: 3.5, py: 1.5,
                      borderRadius: 3, fontSize: '1rem',
                      '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
                    }}>
                    Découvrir les archives
                  </Button>
                </Box>
              </Grid>

              {/* Stats cards on right */}
              <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Grid container spacing={2}>
                  {stats.map((s, i) => (
                    <Grid size={6} key={i}>
                      <Fade in timeout={1200 + i * 200}>
                        <Paper sx={{
                          p: 2.5, textAlign: 'center',
                          bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)',
                          border: '1px solid rgba(255,255,255,0.15)', borderRadius: 3,
                          transition: 'all 0.3s ease',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.18)', transform: 'translateY(-4px)' },
                        }}>
                          <Box sx={{ color: '#FFB74D', mb: 1 }}>{s.icon}</Box>
                          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1, mb: 0.3 }}>
                            <AnimatedCounter target={s.value} suffix={s.value.includes('+') ? '+' : s.value.includes('%') ? '%' : ''} />
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: '0.7rem' }}>
                            {s.label}
                          </Typography>
                        </Paper>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Fade>
        </Container>

        {/* Scroll indicator */}
        <Box sx={{
          position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', zIndex: 2,
          animation: 'bounce 2s ease infinite',
          '@keyframes bounce': {
            '0%,100%': { transform: 'translateX(-50%) translateY(0)' },
            '50%': { transform: 'translateX(-50%) translateY(-10px)' },
          },
        }}>
          <Box sx={{ width: 28, height: 44, borderRadius: 14, border: '2px solid rgba(255,255,255,0.4)', display: 'flex', justifyContent: 'center', pt: 1 }}>
            <Box sx={{ width: 4, height: 10, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.6)' }} />
          </Box>
        </Box>
      </Box>

      {/* ─── CTA Section ─────────────────────────────────────── */}
      <Box id="cta" sx={{
        py: { xs: 6, md: 8 },
        background: 'linear-gradient(135deg, #0D47A1, #1565C0)',
        position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 2, fontSize: { xs: '1.6rem', md: '2rem' } }}>
            Prêt à moderniser vos archives ?
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, maxWidth: 450, mx: 'auto' }}>
            Rejoignez la plateforme et simplifiez la gestion documentaire de votre établissement.
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate('/connexion')}
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: '#fff', color: '#0D47A1', fontWeight: 700, px: 5, py: 1.5,
              borderRadius: 3, fontSize: '1.05rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              '&:hover': { bgcolor: '#E3F2FD', transform: 'translateY(-2px)' },
              transition: 'all 0.25s ease',
            }}>
            Commencer maintenant
          </Button>
        </Container>
      </Box>

      {/* ─── Footer ──────────────────────────────────────────── */}
      <Box sx={{ py: 4, bgcolor: '#08224A', borderTop: '3px solid #F6A800' }}>
        <Container>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                component="img"
                src={ensaLogo}
                alt="ENSA"
                width={60}
                height={26}
                sx={{ width: 60, height: 26, objectFit: 'contain', opacity: 0.8 }}
              />
              <Box>
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>
                  École Nationale des Sciences Appliquées
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
                  Campus Universitaire, Mghila, BP : 591, Béni Mellal 23000
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                ml: { md: 'auto' },
              }}
            >
              <Box
                component="a"
                href="mailto:ensabm.contact@usms.ma"
                aria-label="Email"
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  bgcolor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.16)', transform: 'translateY(-2px)' },
                }}
              >
                <EmailIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box
                component="a"
                href="https://www.facebook.com/share/181heLHjjf/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  bgcolor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.16)', transform: 'translateY(-2px)' },
                }}
              >
                <FacebookIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box
                component="a"
                href="https://www.instagram.com/ensa.beni.mellal?igsh=MTRnd28yNGFnM2s0NA=="
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  bgcolor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.16)', transform: 'translateY(-2px)' },
                }}
              >
                <InstagramIcon sx={{ fontSize: 20 }} />
              </Box>
            </Box>
          </Box>

          <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>
              Développé par <Box component="span" sx={{ color: '#F6A800', fontWeight: 700 }}>Ouahid Samrani</Box>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}