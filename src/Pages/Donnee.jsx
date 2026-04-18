import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import etudiantService from '../services/etudiantService';
import { useSnackbar } from '../contexts/SnackbarContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Fade from '@mui/material/Fade';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SchoolIcon from '@mui/icons-material/School';

export default function Donnee() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEtudiant, setSelectedEtudiant] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await etudiantService.getAll();
      setEtudiants(res.data);
    } catch { showError('Erreur lors du chargement des étudiants'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await etudiantService.delete(deleteDialog.id);
      setEtudiants(prev => prev.filter(e => e.id !== deleteDialog.id));
      showSuccess('Étudiant supprimé avec succès');
    } catch { showError('Erreur lors de la suppression'); }
    finally { setDeleteDialog({ open: false, id: null, name: '' }); }
  };

  const filtered = etudiants.filter(e =>
    [e.nom, e.prenom, e.cne, e.email].some(f => f?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Liste des Étudiants</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>{etudiants.length} étudiants enregistrés</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/ajouter')} sx={{ background: 'linear-gradient(135deg, #1565C0, #42A5F5)' }}>
          Ajouter un étudiant
        </Button>
      </Box>

      <TextField fullWidth placeholder="Rechercher par nom, prénom, CNE ou email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} sx={{ mb: 3 }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment> }}
      />

      <Fade in timeout={500}>
        <TableContainer component={Paper} sx={{ border: '1px solid rgba(0,0,0,0.04)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom Complet</TableCell>
                <TableCell>CNE</TableCell>
                <TableCell>CIN</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Filière</TableCell>
                <TableCell>Année</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}>
                    <SchoolIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography sx={{ color: 'text.secondary' }}>Aucun étudiant trouvé</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(e => (
                  <TableRow key={e.id} hover sx={{ '&:hover': { bgcolor: 'rgba(21,101,192,0.02)' } }}>
                    <TableCell sx={{ fontWeight: 500 }}>{e.nom} {e.prenom}</TableCell>
                    <TableCell><Chip label={e.cne} size="small" sx={{ bgcolor: '#E3F2FD', color: '#1565C0', fontWeight: 600 }} /></TableCell>
                    <TableCell>{e.cin}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{e.email}</TableCell>
                    <TableCell><Chip label={e.filiere || 'N/A'} size="small" variant="outlined" /></TableCell>
                    <TableCell>{e.anneeInscription}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => setSelectedEtudiant(e)} sx={{ color: '#1565C0' }} title="Détails"><VisibilityIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => setDeleteDialog({ open: true, id: e.id, name: `${e.nom} ${e.prenom}` })} sx={{ color: '#C62828' }} title="Supprimer"><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Fade>

      {/* Detail Dialog */}
      <Dialog open={!!selectedEtudiant} onClose={() => setSelectedEtudiant(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        {selectedEtudiant && (
          <>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Détails de {selectedEtudiant.nom} {selectedEtudiant.prenom}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                {[
                  ['CNE', selectedEtudiant.cne], ['CIN', selectedEtudiant.cin],
                  ['Email', selectedEtudiant.email], ['Téléphone', selectedEtudiant.telephone],
                  ['Date de naissance', selectedEtudiant.dateNaissance], ['Lieu de naissance', selectedEtudiant.lieuNaissance],
                  ['Nationalité', selectedEtudiant.nationalite], ['Sexe', selectedEtudiant.sexe],
                  ['Filière', selectedEtudiant.filiere], ['Année d\'inscription', selectedEtudiant.anneeInscription],
                  ['Adresse', selectedEtudiant.adresse], ['Nom du père', selectedEtudiant.nomPere],
                  ['Nom de la mère', selectedEtudiant.nomMere], ['Adresse parents', selectedEtudiant.adresseParents],
                ].map(([label, val], i) => (
                  <Grid size={{xs:12,sm:6}} key={i}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>{label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{val || '—'}</Typography>
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setSelectedEtudiant(null)}>Fermer</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null, name: '' })} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Voulez-vous vraiment supprimer <strong>{deleteDialog.name}</strong> ? Cette action est irréversible.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialog({ open: false, id: null, name: '' })} color="inherit">Annuler</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}