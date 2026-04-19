import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import HomeIcon from '@mui/icons-material/Home';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

/**
 * NotFound — Page 404 professionnelle avec design MUI.
 * Affichée lorsque l'utilisateur accède à une URL inexistante.
 */
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 40%, #42A5F5 100%)',
        p: 2,
      }}
    >
      <Fade in timeout={600}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6 },
            maxWidth: 480,
            width: '100%',
            borderRadius: 4,
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          }}
        >
          <SentimentDissatisfiedIcon
            sx={{
              fontSize: 80,
              color: '#1565C0',
              mb: 2,
              opacity: 0.7,
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: '4rem',
              background: 'linear-gradient(135deg, #1565C0, #FF8F00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
              mb: 1,
            }}
          >
            404
          </Typography>

          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}
          >
            Page introuvable
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.6 }}
          >
            La page que vous cherchez n'existe pas ou a été déplacée.
            Vérifiez l'URL ou retournez à l'accueil.
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/diagramme')}
            sx={{
              background: 'linear-gradient(135deg, #1565C0, #42A5F5)',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              borderRadius: 3,
              boxShadow: '0 6px 24px rgba(21, 101, 192, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0D47A1, #1565C0)',
                boxShadow: '0 8px 28px rgba(21, 101, 192, 0.4)',
              },
            }}
          >
            Retour au Dashboard
          </Button>
        </Paper>
      </Fade>
    </Box>
  );
}
