import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import etudiantService from '../services/etudiantService';
import api from '../services/api';
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
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SchoolIcon from '@mui/icons-material/School';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import EditIcon from '@mui/icons-material/Edit';
import { normalizeFiliere } from '../utils/normalizeFiliere';

export default function Donnee() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess, showError } = useSnackbar();
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filiereFilter, setFiliereFilter] = useState(searchParams.get('filiere') || '');
  const [selectedEtudiant, setSelectedEtudiant] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const [editDialog, setEditDialog] = useState({ open: false, etudiant: null });
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

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

  const openEdit = (etudiant) => {
    setEditForm({
      cne: etudiant.cne || '', cin: etudiant.cin || '', nom: etudiant.nom || '', prenom: etudiant.prenom || '',
      dateNaissance: etudiant.dateNaissance || '', lieuNaissance: etudiant.lieuNaissance || '',
      nationalite: etudiant.nationalite || '', sexe: etudiant.sexe || '', adresse: etudiant.adresse || '',
      telephone: etudiant.telephone || '', email: etudiant.email || '', filiere: etudiant.filiere || '',
      anneeInscription: etudiant.anneeInscription || '', nomPere: etudiant.nomPere || '',
      nomMere: etudiant.nomMere || '', adresseParents: etudiant.adresseParents || '',
      etablissementOrigine: etudiant.etablissementOrigine || '', etablissementAccueil: etudiant.etablissementAccueil || '',
    });
    setEditDialog({ open: true, etudiant });
  };

  const handleEdit = async () => {
    setEditLoading(true);
    try {
      const res = await etudiantService.update(editDialog.etudiant.id, editForm);
      setEtudiants(prev => prev.map(e => e.id === editDialog.etudiant.id ? { ...e, ...res.data } : e));
      showSuccess('Étudiant modifié avec succès !');
      setEditDialog({ open: false, etudiant: null });
    } catch (err) { showError(err?.userMessage || 'Erreur lors de la modification'); }
    finally { setEditLoading(false); }
  };

  const clearFiliereFilter = () => {
    setFiliereFilter('');
    setSearchParams({});
  };

  // Liste unique des filières pour le dropdown
  const uniqueFilieres = useMemo(() => {
    const set = new Set();
    etudiants.forEach(e => {
      const n = normalizeFiliere(e.filiere);
      if (n) set.add(n);
    });
    return [...set].sort();
  }, [etudiants]);

  const filtered = etudiants.filter(e => {
    const matchSearch = [e.nom, e.prenom, e.cne, e.email, e.filiere].some(f => f?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchFiliere = filiereFilter ? normalizeFiliere(e.filiere) === filiereFilter : true;
    return matchSearch && matchFiliere;
  });

  // ─── Export Excel ───────────────────────────────────────────
  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await etudiantService.export();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `etudiants_${new Date().toISOString().slice(0,10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSuccess('Fichier Excel exporté avec succès !');
    } catch { showError('Erreur lors de l\'export Excel'); }
    finally { setExporting(false); }
  };

  // ─── Import Excel ───────────────────────────────────────────
  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post('/etudiants/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showSuccess('Fichier Excel importé avec succès !');
      loadData();
    } catch { showError('Erreur lors de l\'import Excel'); }
    finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.4rem', md: '2rem' } }}>Liste des Étudiants</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>{filtered.length}/{etudiants.length} étudiants</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {/* Import Excel */}
          <input type="file" ref={fileInputRef} accept=".xlsx,.xls,.csv" onChange={handleImport} style={{ display: 'none' }} id="import-excel-students" />
          <Tooltip title="Importer depuis Excel">
            <Button
              variant="outlined"
              startIcon={importing ? <CircularProgress size={18} /> : <FileUploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              sx={{ borderColor: '#2E7D32', color: '#2E7D32', '&:hover': { borderColor: '#1B5E20', bgcolor: 'rgba(46,125,50,0.04)' } }}
            >
              Importer
            </Button>
          </Tooltip>
          {/* Export Excel */}
          <Tooltip title="Exporter vers Excel">
            <Button
              variant="outlined"
              startIcon={exporting ? <CircularProgress size={18} /> : <FileDownloadIcon />}
              onClick={handleExport}
              disabled={exporting}
              sx={{ borderColor: '#E65100', color: '#E65100', '&:hover': { borderColor: '#BF360C', bgcolor: 'rgba(230,81,0,0.04)' } }}
            >
              Exporter
            </Button>
          </Tooltip>
          {/* Add */}
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/ajouter')} sx={{ background: 'linear-gradient(135deg, #1565C0, #42A5F5)' }}>
            Ajouter
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Rechercher par nom, prénom, CNE ou email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
          size="small"
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment> }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Filière</InputLabel>
          <Select
            value={filiereFilter}
            label="Filière"
            onChange={(e) => {
              setFiliereFilter(e.target.value);
              if (e.target.value) setSearchParams({ filiere: e.target.value });
              else setSearchParams({});
            }}
          >
            <MenuItem value=""><em>Toutes les filières</em></MenuItem>
            {uniqueFilieres.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      <Fade in timeout={500}>
        <TableContainer component={Paper} sx={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2, maxHeight: 520, overflow: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC', minWidth: 150 }}>Nom Complet</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC', minWidth: 120 }}>CNE</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC', minWidth: 100 }}>CIN</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC', minWidth: 100, display: { xs: 'none', md: 'table-cell' } }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC', minWidth: 130 }}>Filière</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC', minWidth: 70 }}>Année</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, bgcolor: '#F8FAFC', minWidth: 90, position: 'sticky', right: 0, zIndex: 3 }}>Actions</TableCell>
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
                    <TableCell sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{e.nom} {e.prenom}</TableCell>
                    <TableCell><Chip label={e.cne} size="small" sx={{ bgcolor: '#E3F2FD', color: '#1565C0', fontWeight: 600, fontSize: '0.75rem' }} /></TableCell>
                    <TableCell sx={{ fontSize: '0.85rem' }}>{e.cin}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem', display: { xs: 'none', md: 'table-cell' } }}>{e.email}</TableCell>
                    <TableCell><Chip label={e.filiere || 'N/A'} size="small" variant="outlined" sx={{ fontSize: '0.7rem', maxWidth: 130, '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' } }} /></TableCell>
                    <TableCell sx={{ fontSize: '0.85rem' }}>{e.anneeInscription}</TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap', position: 'sticky', right: 0, bgcolor: 'inherit', zIndex: 1 }}>
                      <IconButton size="small" onClick={() => setSelectedEtudiant(e)} sx={{ color: '#1565C0' }} title="Détails"><VisibilityIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => openEdit(e)} sx={{ color: '#E65100' }} title="Modifier"><EditIcon fontSize="small" /></IconButton>
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

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, etudiant: null })} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Modifier l'étudiant</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth label="CNE" value={editForm.cne||''} onChange={e => setEditForm({...editForm,cne:e.target.value})} /></Grid>
            <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth label="CIN" value={editForm.cin||''} onChange={e => setEditForm({...editForm,cin:e.target.value})} /></Grid>
            <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth label="Nom" value={editForm.nom||''} onChange={e => setEditForm({...editForm,nom:e.target.value})} /></Grid>
            <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth label="Prénom" value={editForm.prenom||''} onChange={e => setEditForm({...editForm,prenom:e.target.value})} /></Grid>
            <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth label="Email" value={editForm.email||''} onChange={e => setEditForm({...editForm,email:e.target.value})} /></Grid>
            <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth label="Téléphone" value={editForm.telephone||''} onChange={e => setEditForm({...editForm,telephone:e.target.value})} /></Grid>
            <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth label="Date naissance" type="date" value={editForm.dateNaissance||''} onChange={e => setEditForm({...editForm,dateNaissance:e.target.value})} InputLabelProps={{shrink:true}} /></Grid>
            <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth label="Lieu naissance" value={editForm.lieuNaissance||''} onChange={e => setEditForm({...editForm,lieuNaissance:e.target.value})} /></Grid>
            <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth label="Nationalité" value={editForm.nationalite||''} onChange={e => setEditForm({...editForm,nationalite:e.target.value})} /></Grid>
            <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth select label="Sexe" value={editForm.sexe||''} onChange={e => setEditForm({...editForm,sexe:e.target.value})}><MenuItem value="MASCULIN">Masculin</MenuItem><MenuItem value="FEMININ">Féminin</MenuItem></TextField></Grid>
            <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth label="Filière" value={editForm.filiere||''} onChange={e => setEditForm({...editForm,filiere:e.target.value})} /></Grid>
            <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth label="Année d'inscription" type="number" value={editForm.anneeInscription||''} onChange={e => setEditForm({...editForm,anneeInscription:e.target.value})} /></Grid>
            <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth label="Adresse" value={editForm.adresse||''} onChange={e => setEditForm({...editForm,adresse:e.target.value})} /></Grid>
            <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth label="Nom du père" value={editForm.nomPere||''} onChange={e => setEditForm({...editForm,nomPere:e.target.value})} /></Grid>
            <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth label="Nom de la mère" value={editForm.nomMere||''} onChange={e => setEditForm({...editForm,nomMere:e.target.value})} /></Grid>
            <Grid size={{xs:12,sm:6,md:4}}><TextField fullWidth label="Adresse parents" value={editForm.adresseParents||''} onChange={e => setEditForm({...editForm,adresseParents:e.target.value})} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditDialog({ open: false, etudiant: null })} color="inherit">Annuler</Button>
          <Button onClick={handleEdit} variant="contained" disabled={editLoading}>
            {editLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}