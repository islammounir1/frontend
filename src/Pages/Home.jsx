import React from 'react';
import { useNavigate } from 'react-router-dom';

// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Fade from '@mui/material/Fade';

// Icons
import ArchiveIcon from '@mui/icons-material/Archive';
import LoginIcon from '@mui/icons-material/Login';

// Logo
import ensaLogo from '../assets/ensa-logo.png';

import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import StorageIcon from '@mui/icons-material/Storage';
import SearchIcon from '@mui/icons-material/Search';
import FolderIcon from '@mui/icons-material/Folder';
import AssessmentIcon from '@mui/icons-material/Assessment';

const features = [
  {
    icon: <StorageIcon sx={{ fontSize: 40 }} />,
    title: 'Archivage Sécurisé',
    desc: 'Stockez et organisez vos dossiers d\'étudiants de manière centralisée et sécurisée.',
    color: '#1565C0',
  },
  {
    icon: <SearchIcon sx={{ fontSize: 40 }} />,
    title: 'Recherche Rapide',
    desc: 'Retrouvez n\'importe quel dossier en quelques secondes grâce à notre moteur de recherche avancé.',
    color: '#2E7D32',
  },
  {
    icon: <FolderIcon sx={{ fontSize: 40 }} />,
    title: 'Gestion des Mouvements',
    desc: 'Suivez chaque mouvement de dossier avec une traçabilité complète et des alertes.',
    color: '#E65100',
  },
  {
    icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
    title: 'Statistiques',
    desc: 'Visualisez vos données avec des tableaux de bord interactifs et des rapports détaillés.',
    color: '#6A1B9A',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: 'Contrôle d\'Accès',
    desc: 'Gérez les permissions par rôle : Admin, Responsable, Agent d\'accueil, Consultant.',
    color: '#C62828',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    title: 'Performance',
    desc: 'Interface réactive et moderne pour une productivité maximale au quotidien.',
    color: '#00838F',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFBFC' }}>
      {/* NavBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <Box component="img" src={ensaLogo} alt="ENSA Logo" sx={{ width: 42, height: 42, objectFit: 'contain', animation: 'logoShine 3s ease-in-out infinite' }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: '#1A2027', letterSpacing: '-0.02em' }}
            >
              ArchivePro
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate('/connexion')}
            startIcon={<LoginIcon />}
            sx={{
              background: 'linear-gradient(135deg, #1565C0, #42A5F5)',
              borderRadius: 2.5,
              px: 3,
              boxShadow: '0 4px 12px rgba(21, 101, 192, 0.25)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0D47A1, #1565C0)',
                boxShadow: '0 6px 16px rgba(21, 101, 192, 0.35)',
              },
            }}
          >
            Se connecter
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 14, md: 18 },
          pb: { xs: 8, md: 12 },
          background: 'linear-gradient(180deg, #E3F2FD 0%, #FAFBFC 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(21,101,192,0.06), transparent 70%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,143,0,0.06), transparent 70%)',
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', textAlign: 'center' }}>
          <Fade in timeout={800}>
            <Box>
              <Box
                component="img"
                src={ensaLogo}
                alt="ENSA Logo"
                sx={{
                  width: 100,
                  height: 100,
                  objectFit: 'contain',
                  borderRadius: 3,
                  bgcolor: '#fff',
                  p: 2,
                  mx: 'auto',
                  mb: 3,
                  display: 'block',
                  boxShadow: '0 8px 32px rgba(21, 101, 192, 0.25)',
                  animation: 'logoPulse 3s ease-in-out infinite',
                }}
              />

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: '#0D47A1',
                  lineHeight: 1.2,
                  mb: 2,
                  letterSpacing: '-0.03em',
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                Gestion d'Archives
                <br />
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #1565C0, #FF8F00)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  ENSA
                </Box>
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 600,
                  mx: 'auto',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  mb: 4,
                  fontSize: { xs: '1rem', md: '1.15rem' },
                }}
              >
                Plateforme complète de gestion des archives permettant de stocker,
                organiser et consulter les dossiers administratifs des étudiants
                de manière efficace et sécurisée.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/connexion')}
                  startIcon={<LoginIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #1565C0, #42A5F5)',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    borderRadius: 3,
                    boxShadow: '0 6px 24px rgba(21, 101, 192, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0D47A1, #1565C0)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 28px rgba(21, 101, 192, 0.4)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Accéder à la plateforme
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            mb: 1,
            color: 'text.primary',
          }}
        >
          Fonctionnalités
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            mb: 6,
            maxWidth: 500,
            mx: 'auto',
          }}
        >
          Tout ce dont vous avez besoin pour gérer vos archives efficacement
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Fade in timeout={600 + index * 100}>
                <Paper
                  sx={{
                    p: 3.5,
                    height: '100%',
                    borderRadius: 4,
                    border: '1px solid rgba(0,0,0,0.04)',
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
                      borderColor: feature.color + '30',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      bgcolor: feature.color + '12',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: feature.color,
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1.05rem' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {feature.desc}
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          py: 4,
          textAlign: 'center',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          bgcolor: '#fff',
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          © 2026 ArchivePro — École Nationale des Sciences Appliquées. Tous droits réservés.
        </Typography>
      </Box>
    </Box>
  );
}