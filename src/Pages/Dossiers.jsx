import React, { useState, useEffect, useMemo } from 'react';
import dossierService from '../services/dossierService';
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
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FolderIcon from '@mui/icons-material/Folder';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const STATUT_CONFIG = {
  ARCHIVE: { label: 'Archivé', color: '#2E7D32', bg: '#E8F5E9' },
  EN_COURS: { label: 'En cours', color: '#1565C0', bg: '#E3F2FD' },
  TRANSFERE: { label: 'Transféré', color: '#E65100', bg: '#FFF3E0' },
  RETIRE: { label: 'Retiré', color: '#C62828', bg: '#FFEBEE' },
  EN_ATTENTE: { label: 'En attente', color: '#F57F17', bg: '#FFFDE7' },
};

const initialForm = {
  numeroDossier: '', etudiant_id: '', typeCas: '', statut: 'EN_COURS',
  dateArchivage: '', localisation: '', observations: '',
};

export default function Dossiers() {
  const { showSuccess, showError } = useSnackbar();
  const [dossiers, setDossiers] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const [formDialog, setFormDialog] = useState({ open: false, mode: 'create', dossier: null });
  const [form, setForm] = useState(initialForm);
  const [formLoading, setFormLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [d, e] = await Promise.all([dossierService.getAll(), etudiantService.getAll()]);
      setDossiers(d.data);
      setEtudiants(e.data);
    } catch { showError('Erreur lors du chargement des dossiers'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await dossierService.delete(deleteDialog.id);
      setDossiers(prev => prev.filter(d => d.id !== deleteDialog.id));
      showSuccess('Dossier supprimé avec succès');
    } catch { showError('Erreur lors de la suppression'); }
    finally { setDeleteDialog({ open: false, id: null, name: '' }); }
  };

  const openCreate = () => {
    setForm(initialForm);
    setFormDialog({ open: true, mode: 'create', dossier: null });
  };

  const openEdit = (dossier) => {
    setForm({
      numeroDossier: dossier.numeroDossier || '',
      etudiant_id: dossier.etudiant_id || '',
      typeCas: dossier.typeCas || '',
      statut: dossier.statut || 'EN_COURS',
      dateArchivage: dossier.dateArchivage || '',
      localisation: dossier.localisation || '',
      observations: dossier.observations || '',
    });
    setFormDialog({ open: true, mode: 'edit', dossier });
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    try {
      if (formDialog.mode === 'create') {
        const res = await dossierService.create(form);
        setDossiers(prev => [...prev, res.data]);
        showSuccess('Dossier créé avec succès !');
      } else {
        const res = await dossierService.update(formDialog.dossier.id, form);
        setDossiers(prev => prev.map(d => d.id === formDialog.dossier.id ? { ...d, ...res.data } : d));
        showSuccess('Dossier modifié avec succès !');
      }
      setFormDialog({ open: false, mode: 'create', dossier: null });
    } catch (err) {
      showError(err?.userMessage || 'Erreur lors de l\'opération');
    } finally { setFormLoading(false); }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await dossierService.export();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dossiers_${new Date().toISOString().slice(0,10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSuccess('Fichier exporté avec succès !');
    } catch { showError('Erreur lors de l\'export'); }
    finally { setExporting(false); }
  };

  const filtered = useMemo(() => dossiers.filter(d => {
    const etudiant = d.etudiant;
    const terms = [d.numeroDossier, d.typeCas, d.statut, d.localisation, etudiant?.nom, etudiant?.prenom, etudiant?.cne];
    return terms.some(t => t?.toLowerCase().includes(searchTerm.toLowerCase()));
  }), [dossiers, searchTerm]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.4rem', md: '2rem' } }}>Dossiers d'Archive</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>{filtered.length}/{dossiers.length} dossiers</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Tooltip title="Exporter vers Excel">
            <Button variant="outlined" startIcon={exporting ? <CircularProgress size={18} /> : <FileDownloadIcon />} onClick={handleExport} disabled={exporting}
              sx={{ borderColor: '#E65100', color: '#E65100', '&:hover': { borderColor: '#BF360C', bgcolor: 'rgba(230,81,0,0.04)' } }}>
              Exporter
            </Button>
          </Tooltip>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate} sx={{ background: 'linear-gradient(135deg, #1565C0, #42A5F5)' }}>
            Nouveau Dossier
          </Button>
        </Box>
      </Box>

      <TextField
        placeholder="Rechercher par numéro, étudiant, statut..."
        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
        sx={{ mb: 2, width: '100%', maxWidth: 500 }} size="small"
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment> }}
      />

      <Fade in timeout={500}>
        <TableContainer component={Paper} sx={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2, maxHeight: 520, overflow: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>N° Dossier</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Étudiant</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Type de cas</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC', display: { xs: 'none', md: 'table-cell' } }}>Localisation</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>{Array.from({ length: 6 }).map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}</TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6 }}>
                    <FolderIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography sx={{ color: 'text.secondary' }}>Aucun dossier trouvé</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(d => {
                  const sc = STATUT_CONFIG[d.statut] || { label: d.statut, color: '#666', bg: '#f5f5f5' };
                  return (
                    <TableRow key={d.id} hover sx={{ '&:hover': { bgcolor: 'rgba(21,101,192,0.02)' } }}>
                      <TableCell>
                        <Chip label={d.numeroDossier} size="small" sx={{ bgcolor: '#E3F2FD', color: '#1565C0', fontWeight: 600, fontSize: '0.75rem' }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{d.etudiant ? `${d.etudiant.nom} ${d.etudiant.prenom}` : '—'}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{d.typeCas || '—'}</TableCell>
                      <TableCell><Chip label={sc.label} size="small" sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 600 }} /></TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, fontSize: '0.85rem', color: 'text.secondary' }}>{d.localisation || '—'}</TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <IconButton size="small" onClick={() => setSelectedDossier(d)} sx={{ color: '#1565C0' }} title="Détails"><VisibilityIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => openEdit(d)} sx={{ color: '#E65100' }} title="Modifier"><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => setDeleteDialog({ open: true, id: d.id, name: d.numeroDossier })} sx={{ color: '#C62828' }} title="Supprimer"><DeleteIcon fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Fade>

      {/* Detail Dialog */}
      <Dialog open={!!selectedDossier} onClose={() => setSelectedDossier(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        {selectedDossier && (
          <>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Dossier {selectedDossier.numeroDossier}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                {[
                  ['N° Dossier', selectedDossier.numeroDossier],
                  ['Étudiant', selectedDossier.etudiant ? `${selectedDossier.etudiant.nom} ${selectedDossier.etudiant.prenom}` : '—'],
                  ['CNE', selectedDossier.etudiant?.cne],
                  ['Type de cas', selectedDossier.typeCas],
                  ['Statut', selectedDossier.statut],
                  ['Date d\'archivage', selectedDossier.dateArchivage],
                  ['Localisation', selectedDossier.localisation],
                  ['Observations', selectedDossier.observations],
                ].map(([label, val], i) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={i}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>{label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{val || '—'}</Typography>
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}><Button onClick={() => setSelectedDossier(null)}>Fermer</Button></DialogActions>
          </>
        )}
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={formDialog.open} onClose={() => setFormDialog({ open: false, mode: 'create', dossier: null })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {formDialog.mode === 'create' ? 'Nouveau Dossier d\'Archive' : 'Modifier le Dossier'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="N° Dossier" value={form.numeroDossier} onChange={e => setForm({ ...form, numeroDossier: e.target.value })} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth select label="Étudiant" value={form.etudiant_id} onChange={e => setForm({ ...form, etudiant_id: e.target.value })} required>
                {etudiants.map(e => <MenuItem key={e.id} value={e.id}>{e.nom} {e.prenom} ({e.cne})</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Type de cas" value={form.typeCas} onChange={e => setForm({ ...form, typeCas: e.target.value })} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth select label="Statut" value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })} required>
                {Object.entries(STATUT_CONFIG).map(([key, cfg]) => <MenuItem key={key} value={key}>{cfg.label}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Date d'archivage" type={form.dateArchivage ? "date" : "text"} onFocus={(e) => e.target.type = "date"} onBlur={(e) => { if (!form.dateArchivage) e.target.type = "text"; }} value={form.dateArchivage} onChange={e => setForm({ ...form, dateArchivage: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Localisation" value={form.localisation} onChange={e => setForm({ ...form, localisation: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth multiline rows={3} label="Observations" value={form.observations} onChange={e => setForm({ ...form, observations: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setFormDialog({ open: false, mode: 'create', dossier: null })} color="inherit">Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={formLoading}>
            {formLoading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : formDialog.mode === 'create' ? 'Créer' : 'Sauvegarder'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null, name: '' })} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirmer la suppression</DialogTitle>
        <DialogContent><Typography>Supprimer le dossier <strong>{deleteDialog.name}</strong> ? Cette action est irréversible.</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialog({ open: false, id: null, name: '' })} color="inherit">Annuler</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
