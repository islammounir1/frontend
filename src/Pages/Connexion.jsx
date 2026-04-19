import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../contexts/SnackbarContext';

// MUI
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';

// Icons
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Logo
import ensaLogo from '../assets/ensa-logo.png';

export default function Connexion() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useSnackbar();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Format d\'email invalide';
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      showSuccess(`Bienvenue, ${user.prenom} ${user.nom} !`);
      navigate('/diagramme');
    } catch (err) {
      const msg =
        err?.userMessage || err?.response?.data?.message || 'Identifiants incorrects';
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 40%, #42A5F5 100%)',
        p: 2,
        position: 'relative',
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          filter: 'blur(1px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
          filter: 'blur(1px)',
        }}
      />

      {/* Back to home */}
      <IconButton
        component={RouterLink}
        to="/"
        sx={{
          position: 'absolute',
          top: 24,
          left: 24,
          color: 'rgba(255,255,255,0.8)',
          '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' },
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Fade in timeout={600}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5 },
            maxWidth: 440,
            width: '100%',
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Accent bar */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(90deg, #1565C0, #FFB74D)',
            }}
          />

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              component="img"
              src={ensaLogo}
              alt="ENSA Logo"
              sx={{
                width: 80,
                height: 80,
                objectFit: 'contain',
                borderRadius: 3,
                bgcolor: '#fff',
                p: 1.5,
                mx: 'auto',
                mb: 2,
                display: 'block',
                boxShadow: '0 4px 16px rgba(21, 101, 192, 0.3)',
                animation: 'logoPulse 3s ease-in-out infinite',
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Connexion
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Accédez à votre espace de gestion
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="email"
              label="Adresse email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name="password"
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #1565C0, #42A5F5)',
                boxShadow: '0 4px 16px rgba(21, 101, 192, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0D47A1, #1565C0)',
                  boxShadow: '0 6px 20px rgba(21, 101, 192, 0.4)',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          {/* Footer */}
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 3,
              color: 'text.disabled',
            }}
          >
            © 2026 ArchivePro — ENSA
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
}