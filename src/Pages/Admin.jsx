import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import utilisateurService from '../services/utilisateurService';
import { useSnackbar } from '../contexts/SnackbarContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';

const initialForm = { username: '', nom: '', prenom: '', email: '', password: '', telephone: '', role: 'AGENT_ACCUEIL' };

export default function Admin() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const err = {};
    if (!form.username) err.username = 'Requis';
    if (!form.nom) err.nom = 'Requis';
    if (!form.prenom) err.prenom = 'Requis';
    if (!form.email) err.email = 'Requis';
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = 'Email invalide';
    if (!form.password) err.password = 'Requis';
    else if (form.password.length < 6) err.password = 'Minimum 6 caractères';
    if (!form.role) err.role = 'Requis';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await utilisateurService.create(form);
      showSuccess('Utilisateur créé avec succès !');
      setForm(initialForm);
      navigate('/adduti');
    } catch (err) {
      showError(err?.userMessage || 'Erreur lors de la création');
    } finally { setLoading(false); }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/adduti')} color="inherit">Retour</Button>
      </Box>

      <Fade in timeout={500}>
        <Paper sx={{ p: { xs: 3, md: 4 }, maxWidth: 700, mx: 'auto', border: '1px solid rgba(0,0,0,0.04)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2.5, background: 'linear-gradient(135deg, #E65100, #FF8F00)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AdminPanelSettingsIcon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Ajouter un Utilisateur</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Créer un nouveau compte utilisateur</Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              <Grid size={{xs:12}}><TextField fullWidth name="username" label="Nom d'utilisateur" value={form.username} onChange={handleChange} error={!!errors.username} helperText={errors.username} required InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{color:'text.secondary',fontSize:20}}/></InputAdornment> }} /></Grid>
              <Grid size={{xs:12,sm:6}}><TextField fullWidth name="nom" label="Nom" value={form.nom} onChange={handleChange} error={!!errors.nom} helperText={errors.nom} required /></Grid>
              <Grid size={{xs:12,sm:6}}><TextField fullWidth name="prenom" label="Prénom" value={form.prenom} onChange={handleChange} error={!!errors.prenom} helperText={errors.prenom} required /></Grid>
              <Grid size={{xs:12,sm:6}}><TextField fullWidth name="email" label="Email" type="email" value={form.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} required InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{color:'text.secondary',fontSize:20}}/></InputAdornment> }} /></Grid>
              <Grid size={{xs:12,sm:6}}><TextField fullWidth name="telephone" label="Téléphone" value={form.telephone} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{color:'text.secondary',fontSize:20}}/></InputAdornment> }} /></Grid>
              <Grid size={{xs:12,sm:6}}><TextField fullWidth name="password" label="Mot de passe" type={showPassword?'text':'password'} value={form.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} required InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon sx={{color:'text.secondary',fontSize:20}}/></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton onClick={()=>setShowPassword(!showPassword)} edge="end" size="small">{showPassword?<VisibilityOffIcon/>:<VisibilityIcon/>}</IconButton></InputAdornment> }} /></Grid>
              <Grid size={{xs:12,sm:6}}><TextField fullWidth select name="role" label="Rôle" value={form.role} onChange={handleChange} error={!!errors.role} helperText={errors.role} required><MenuItem value="ADMIN_SYSTEME">Administrateur Système</MenuItem><MenuItem value="RESPONSABLE_ARCHIVES">Responsable Archives</MenuItem><MenuItem value="AGENT_ACCUEIL">Agent d'accueil</MenuItem></TextField></Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
              <Button variant="outlined" onClick={() => navigate('/adduti')} color="inherit" disabled={loading}>Annuler</Button>
              <Button type="submit" variant="contained" disabled={loading} sx={{ background: 'linear-gradient(135deg, #E65100, #FF8F00)', minWidth: 160, '&:hover': { background: 'linear-gradient(135deg, #BF360C, #E65100)' } }}>
                {loading ? <CircularProgress size={22} sx={{color:'#fff'}} /> : 'Créer l\'utilisateur'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
}