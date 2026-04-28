import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import etudiantService from '../services/etudiantService';
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const initialForm = {
  cne:'', cin:'', nom:'', prenom:'', dateNaissance:'', lieuNaissance:'',
  nationalite:'', sexe:'', adresse:'', telephone:'', email:'',
  filiere:'', anneeInscription:'', nomPere:'', nomMere:'', adresseParents:'',
  etablissementOrigine:'', etablissementAccueil:'', photoUrl:''
};

export default function Ajouter() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const err = {};
    if (!form.cne) err.cne = 'Requis';
    if (!form.cin) err.cin = 'Requis';
    if (!form.nom) err.nom = 'Requis';
    if (!form.prenom) err.prenom = 'Requis';
    if (!form.dateNaissance) err.dateNaissance = 'Requis';
    if (!form.lieuNaissance) err.lieuNaissance = 'Requis';
    if (!form.nationalite) err.nationalite = 'Requis';
    if (!form.sexe) err.sexe = 'Requis';
    if (!form.adresse) err.adresse = 'Requis';
    if (!form.telephone) err.telephone = 'Requis';
    if (!form.email) err.email = 'Requis';
    if (!form.filiere) err.filiere = 'Requis';
    if (!form.anneeInscription) err.anneeInscription = 'Requis';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await etudiantService.create(form);
      showSuccess('Étudiant ajouté avec succès !');
      setForm(initialForm);
      navigate('/diagramme/donnee');
    } catch (err) {
      showError(err?.userMessage || 'Erreur lors de l\'ajout');
    } finally { setLoading(false); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/diagramme/donnee')} color="inherit">Retour</Button>
      </Box>

      <Fade in timeout={500}>
        <Paper sx={{ p: { xs: 3, md: 4 }, border: '1px solid rgba(0,0,0,0.04)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2.5, background: 'linear-gradient(135deg, #1565C0, #42A5F5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PersonAddIcon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Ajouter un Étudiant</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Remplissez les informations ci-dessous</Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 2, fontWeight: 600 }}>Informations personnelles</Typography>
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth name="cne" label="CNE" value={form.cne} onChange={handleChange} error={!!errors.cne} helperText={errors.cne} required /></Grid>
              <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth name="cin" label="CIN" value={form.cin} onChange={handleChange} error={!!errors.cin} helperText={errors.cin} required /></Grid>
              <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth name="nom" label="Nom" value={form.nom} onChange={handleChange} error={!!errors.nom} helperText={errors.nom} required /></Grid>
              <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth name="prenom" label="Prénom" value={form.prenom} onChange={handleChange} error={!!errors.prenom} helperText={errors.prenom} required /></Grid>
              <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth name="dateNaissance" label="Date de naissance" type={form.dateNaissance ? "date" : "text"} onFocus={(e) => e.target.type = "date"} onBlur={(e) => { if (!form.dateNaissance) e.target.type = "text"; }} value={form.dateNaissance} onChange={handleChange} error={!!errors.dateNaissance} helperText={errors.dateNaissance} required /></Grid>
              <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth name="lieuNaissance" label="Lieu de naissance" value={form.lieuNaissance} onChange={handleChange} error={!!errors.lieuNaissance} helperText={errors.lieuNaissance} required /></Grid>
              <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth name="nationalite" label="Nationalité" value={form.nationalite} onChange={handleChange} error={!!errors.nationalite} helperText={errors.nationalite} required /></Grid>
              <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth select name="sexe" label="Sexe" value={form.sexe} onChange={handleChange} error={!!errors.sexe} helperText={errors.sexe} required><MenuItem value="MASCULIN">Masculin</MenuItem><MenuItem value="FEMININ">Féminin</MenuItem></TextField></Grid>
              <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth name="telephone" label="Téléphone" value={form.telephone} onChange={handleChange} error={!!errors.telephone} helperText={errors.telephone} required /></Grid>
              <Grid size={{xs:12,sm:6}}><TextField fullWidth name="email" label="Email" type="email" value={form.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} required /></Grid>
              <Grid size={{xs:12,sm:6}}><TextField fullWidth name="adresse" label="Adresse" value={form.adresse} onChange={handleChange} error={!!errors.adresse} helperText={errors.adresse} required /></Grid>
            </Grid>

            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 2, fontWeight: 600 }}>Informations académiques</Typography>
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth name="filiere" label="Filière" value={form.filiere} onChange={handleChange} error={!!errors.filiere} helperText={errors.filiere} required /></Grid>
              <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth name="anneeInscription" label="Année d'inscription" type="number" value={form.anneeInscription} onChange={handleChange} error={!!errors.anneeInscription} helperText={errors.anneeInscription} required /></Grid>
              <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth name="etablissementOrigine" label="Établissement d'origine" value={form.etablissementOrigine} onChange={handleChange} /></Grid>
              <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth name="etablissementAccueil" label="Établissement d'accueil" value={form.etablissementAccueil} onChange={handleChange} /></Grid>
            </Grid>

            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 2, fontWeight: 600 }}>Informations familiales</Typography>
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth name="nomPere" label="Nom du père" value={form.nomPere} onChange={handleChange} /></Grid>
              <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth name="nomMere" label="Nom de la mère" value={form.nomMere} onChange={handleChange} /></Grid>
              <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth name="adresseParents" label="Adresse des parents" value={form.adresseParents} onChange={handleChange} /></Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => navigate('/diagramme/donnee')} color="inherit" disabled={loading}>Annuler</Button>
              <Button type="submit" variant="contained" disabled={loading} sx={{ background: 'linear-gradient(135deg, #1565C0, #42A5F5)', minWidth: 160 }}>
                {loading ? <CircularProgress size={22} sx={{color:'#fff'}} /> : 'Ajouter l\'étudiant'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
}