import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import utilisateurService from '../services/utilisateurService';
import { useSnackbar } from '../contexts/SnackbarContext';

// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Fade from '@mui/material/Fade';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';

// MUI Icons
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BadgeIcon from '@mui/icons-material/Badge';
import SecurityIcon from '@mui/icons-material/Security';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShieldIcon from '@mui/icons-material/Shield';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

const ROLE_CONFIG = {
  SUPER_ADMIN: { label: 'Super Administrateur', color: '#C62828', bg: '#FFEBEE', gradient: 'linear-gradient(135deg, #C62828, #E53935)' },
  ADMIN_SYSTEME: { label: 'Administrateur Système', color: '#1565C0', bg: '#E3F2FD', gradient: 'linear-gradient(135deg, #1565C0, #1E88E5)' },
  RESPONSABLE_ARCHIVES: { label: 'Responsable Archives', color: '#E65100', bg: '#FFF3E0', gradient: 'linear-gradient(135deg, #E65100, #FF8F00)' },
  AGENT_ACCUEIL: { label: 'Agent d\'accueil', color: '#2E7D32', bg: '#E8F5E9', gradient: 'linear-gradient(135deg, #2E7D32, #43A047)' },
  CONSULTANT: { label: 'Consultant', color: '#6A1B9A', bg: '#F3E5F5', gradient: 'linear-gradient(135deg, #6A1B9A, #8E24AA)' },
  ETUDIANT: { label: 'Étudiant', color: '#00838F', bg: '#E0F7FA', gradient: 'linear-gradient(135deg, #00838F, #00ACC1)' },
};

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const { showSuccess, showError } = useSnackbar();

  // ─── Info form ────────────────────────────────────────────────
  const [infoForm, setInfoForm] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
  });
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoErrors, setInfoErrors] = useState({});

  // ─── Password form ────────────────────────────────────────────
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const roleConfig = ROLE_CONFIG[user?.role] || { label: user?.role, color: '#666', bg: '#f5f5f5', gradient: 'linear-gradient(135deg, #666, #888)' };

  // ─── Handlers ─────────────────────────────────────────────────
  const handleInfoChange = (e) => {
    setInfoForm({ ...infoForm, [e.target.name]: e.target.value });
    setInfoErrors({ ...infoErrors, [e.target.name]: '' });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    setPasswordErrors({ ...passwordErrors, [e.target.name]: '' });
  };

  const validateInfo = () => {
    const err = {};
    if (!infoForm.nom.trim()) err.nom = 'Le nom est requis';
    if (!infoForm.prenom.trim()) err.prenom = 'Le prénom est requis';
    if (!infoForm.email.trim()) err.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(infoForm.email)) err.email = 'Email invalide';
    setInfoErrors(err);
    return Object.keys(err).length === 0;
  };

  const validatePassword = () => {
    const err = {};
    if (!passwordForm.current_password) err.current_password = 'Mot de passe actuel requis';
    if (!passwordForm.new_password) err.new_password = 'Nouveau mot de passe requis';
    else if (passwordForm.new_password.length < 6) err.new_password = 'Minimum 6 caractères';
    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      err.new_password_confirmation = 'Les mots de passe ne correspondent pas';
    }
    setPasswordErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    if (!validateInfo()) return;
    setInfoLoading(true);
    try {
      await utilisateurService.updateProfile(infoForm);
      await refreshUser();
      showSuccess('Informations mises à jour avec succès !');
    } catch (err) {
      showError(err?.userMessage || 'Erreur lors de la mise à jour');
    } finally {
      setInfoLoading(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    setPasswordLoading(true);
    try {
      await utilisateurService.updateProfile(passwordForm);
      showSuccess('Mot de passe modifié avec succès !');
      setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' });
    } catch (err) {
      showError(err?.userMessage || 'Erreur lors du changement de mot de passe');
    } finally {
      setPasswordLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Jamais';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Fade in timeout={500}>
        <Box>
          {/* ─── Page Title ──────────────────────────────────── */}
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Mon Profil</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Gérez vos informations personnelles et votre sécurité
          </Typography>

          {/* ─── Profile Card ─────────────────────────────────── */}
          <Paper
            sx={{
              mb: 3,
              border: '1px solid rgba(0,0,0,0.06)',
              overflow: 'hidden',
            }}
          >
            {/* Top accent bar */}
            <Box sx={{ height: 6, background: roleConfig.gradient }} />

            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: { xs: 2.5, md: 3.5 },
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                {/* Avatar */}
                <Avatar
                  sx={{
                    width: 88,
                    height: 88,
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    background: roleConfig.gradient,
                    border: '3px solid #fff',
                    boxShadow: `0 4px 20px ${roleConfig.color}30`,
                    flexShrink: 0,
                  }}
                >
                  {user?.prenom?.[0]?.toUpperCase()}{user?.nom?.[0]?.toUpperCase()}
                </Avatar>

                {/* Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 0.5 }}>
                    {user?.prenom} {user?.nom}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'text.secondary', mb: 1.5 }}>
                    <AlternateEmailIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {user?.username}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Chip
                      label={roleConfig.label}
                      size="small"
                      sx={{
                        bgcolor: roleConfig.bg,
                        color: roleConfig.color,
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        height: 26,
                        border: `1px solid ${roleConfig.color}25`,
                      }}
                    />
                    {user?.is_origin && (
                      <Chip
                        icon={<StarIcon sx={{ fontSize: '14px !important' }} />}
                        label="Admin Original"
                        size="small"
                        sx={{
                          bgcolor: '#FFF8E1',
                          color: '#F57F17',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          height: 26,
                          border: '1px solid rgba(245,127,23,0.2)',
                          '& .MuiChip-icon': { color: '#F57F17' },
                        }}
                      />
                    )}
                  </Box>
                </Box>

                {/* Last login — right side */}
                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 0.5,
                    flexShrink: 0,
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 500 }}>
                    Dernière connexion
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.8rem' }}>
                      {formatDate(user?.derniereConnexion)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Mobile last login */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 0.5, mt: 2, color: 'text.secondary' }}>
                <AccessTimeIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption">
                  Dernière connexion : {formatDate(user?.derniereConnexion)}
                </Typography>
              </Box>

              {/* Quick stats */}
              <Divider sx={{ my: 2.5 }} />
              <Grid container spacing={2}>
                {[
                  { icon: <EmailIcon sx={{ fontSize: 18 }} />, label: 'Email', value: user?.email },
                  { icon: <PhoneIcon sx={{ fontSize: 18 }} />, label: 'Téléphone', value: user?.telephone || '—' },
                ].map((item, i) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={i}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: 'rgba(0,0,0,0.02)',
                        border: '1px solid rgba(0,0,0,0.04)',
                      }}
                    >
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: 1.5,
                          bgcolor: '#E3F2FD',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#1565C0',
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem', display: 'block', lineHeight: 1.2 }}>
                          {item.label}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>

          {/* ─── Info Form Card ────────────────────────────────── */}
          <Paper sx={{ mb: 3, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            {/* Top accent */}
            <Box sx={{ height: 4, background: 'linear-gradient(135deg, #1565C0, #42A5F5)' }} />

            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #1565C0, #42A5F5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(21,101,192,0.25)',
                  }}
                >
                  <EditIcon sx={{ color: '#fff', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
                    Informations Personnelles
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                    Modifier vos informations de base
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2.5 }} />

              <form onSubmit={handleSaveInfo}>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth name="nom" label="Nom" value={infoForm.nom}
                      onChange={handleInfoChange} error={!!infoErrors.nom} helperText={infoErrors.nom}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth name="prenom" label="Prénom" value={infoForm.prenom}
                      onChange={handleInfoChange} error={!!infoErrors.prenom} helperText={infoErrors.prenom}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth name="email" label="Email" type="email" value={infoForm.email}
                      onChange={handleInfoChange} error={!!infoErrors.email} helperText={infoErrors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth name="telephone" label="Téléphone" value={infoForm.telephone}
                      onChange={handleInfoChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    type="submit" variant="contained" disabled={infoLoading}
                    startIcon={infoLoading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <SaveIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #1565C0, #42A5F5)',
                      minWidth: 180,
                      '&:hover': { background: 'linear-gradient(135deg, #0D47A1, #1565C0)' },
                    }}
                  >
                    {infoLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                </Box>
              </form>
            </Box>
          </Paper>

          {/* ─── Password Card ────────────────────────────────── */}
          <Paper sx={{ border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            {/* Top accent */}
            <Box sx={{ height: 4, background: 'linear-gradient(135deg, #E65100, #FF8F00)' }} />

            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #E65100, #FF8F00)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(230,81,0,0.25)',
                  }}
                >
                  <VpnKeyIcon sx={{ color: '#fff', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
                    Sécurité
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                    Modifier votre mot de passe
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2.5 }} />

              <Alert
                severity="info"
                variant="outlined"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: 'rgba(2,136,209,0.04)',
                  '& .MuiAlert-icon': { fontSize: 20 },
                }}
              >
                Pour changer votre mot de passe, saisissez votre mot de passe actuel puis le nouveau.
              </Alert>

              <form onSubmit={handleSavePassword}>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth name="current_password" label="Mot de passe actuel"
                      type={showCurrentPwd ? 'text' : 'password'}
                      value={passwordForm.current_password} onChange={handlePasswordChange}
                      error={!!passwordErrors.current_password} helperText={passwordErrors.current_password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowCurrentPwd(!showCurrentPwd)} edge="end" size="small">
                              {showCurrentPwd ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth name="new_password" label="Nouveau mot de passe"
                      type={showNewPwd ? 'text' : 'password'}
                      value={passwordForm.new_password} onChange={handlePasswordChange}
                      error={!!passwordErrors.new_password} helperText={passwordErrors.new_password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowNewPwd(!showNewPwd)} edge="end" size="small">
                              {showNewPwd ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth name="new_password_confirmation" label="Confirmer le mot de passe"
                      type={showConfirmPwd ? 'text' : 'password'}
                      value={passwordForm.new_password_confirmation} onChange={handlePasswordChange}
                      error={!!passwordErrors.new_password_confirmation} helperText={passwordErrors.new_password_confirmation}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirmPwd(!showConfirmPwd)} edge="end" size="small">
                              {showConfirmPwd ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    type="submit" variant="contained" disabled={passwordLoading}
                    startIcon={passwordLoading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <VpnKeyIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #E65100, #FF8F00)',
                      minWidth: 220,
                      '&:hover': { background: 'linear-gradient(135deg, #BF360C, #E65100)' },
                    }}
                  >
                    {passwordLoading ? 'Modification...' : 'Changer le mot de passe'}
                  </Button>
                </Box>
              </form>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
}
