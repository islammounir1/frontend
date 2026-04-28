import React, { useState, useEffect, useMemo } from 'react';
import reclamationService from '../services/reclamationService';
import dossierService from '../services/dossierService';
import { useAuth } from '../contexts/AuthContext';
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
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const STATUT_CONFIG = {
  EN_ATTENTE: { label: 'En attente', color: '#F57F17', bg: '#FFFDE7' },
  EN_COURS: { label: 'En cours', color: '#1565C0', bg: '#E3F2FD' },
  TRAITEE: { label: 'Traitée', color: '#2E7D32', bg: '#E8F5E9' },
  REJETEE: { label: 'Rejetée', color: '#C62828', bg: '#FFEBEE' },
};

const initialForm = {
  dossier_id: '', demandeur: '', typeDemande: '', dateDemande: new Date().toISOString().slice(0, 10),
  statut: 'EN_ATTENTE', motif: '', traite_par: '', reponse: '', dateTraitement: '',
};

export default function Reclamations() {
  const { user } = useAuth();
  const { showSuccess, showError } = useSnackbar();
  const [reclamations, setReclamations] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRec, setSelectedRec] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [formDialog, setFormDialog] = useState({ open: false, mode: 'create', rec: null });
  const [form, setForm] = useState(initialForm);
  const [formLoading, setFormLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [r, d] = await Promise.all([reclamationService.getAll(), dossierService.getAll()]);
      setReclamations(r.data);
      setDossiers(d.data);
    } catch { showError('Erreur lors du chargement'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await reclamationService.delete(deleteDialog.id);
      setReclamations(prev => prev.filter(r => r.id !== deleteDialog.id));
      showSuccess('Réclamation supprimée');
    } catch { showError('Erreur lors de la suppression'); }
    finally { setDeleteDialog({ open: false, id: null }); }
  };

  const openCreate = () => {
    setForm(initialForm);
    setFormDialog({ open: true, mode: 'create', rec: null });
  };

  const openEdit = (r) => {
    setForm({
      dossier_id: r.dossier_id || '', demandeur: r.demandeur || '',
      typeDemande: r.typeDemande || '', dateDemande: r.dateDemande || '',
      statut: r.statut || 'EN_ATTENTE', motif: r.motif || '',
      traite_par: r.traite_par || '', reponse: r.reponse || '',
      dateTraitement: r.dateTraitement || '',
    });
    setFormDialog({ open: true, mode: 'edit', rec: r });
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    try {
      if (formDialog.mode === 'create') {
        await reclamationService.create(form);
        showSuccess('Réclamation créée !');
      } else {
        await reclamationService.update(formDialog.rec.id, form);
        showSuccess('Réclamation modifiée !');
      }
      loadData();
      setFormDialog({ open: false, mode: 'create', rec: null });
    } catch (err) { showError(err?.userMessage || 'Erreur'); }
    finally { setFormLoading(false); }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await reclamationService.export();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reclamations_${new Date().toISOString().slice(0,10)}.xlsx`);
      document.body.appendChild(link); link.click(); link.remove();
      window.URL.revokeObjectURL(url);
      showSuccess('Export réussi !');
    } catch { showError('Erreur lors de l\'export'); }
    finally { setExporting(false); }
  };

  const filtered = useMemo(() => reclamations.filter(r => {
    const terms = [r.demandeur, r.typeDemande, r.statut, r.dossier?.numeroDossier];
    return terms.some(t => t?.toLowerCase().includes(searchTerm.toLowerCase()));
  }), [reclamations, searchTerm]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.4rem', md: '2rem' } }}>Réclamations</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>{filtered.length} réclamations</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Tooltip title="Exporter">
            <Button variant="outlined" startIcon={exporting ? <CircularProgress size={18} /> : <FileDownloadIcon />} onClick={handleExport} disabled={exporting}
              sx={{ borderColor: '#E65100', color: '#E65100', '&:hover': { borderColor: '#BF360C', bgcolor: 'rgba(230,81,0,0.04)' } }}>Exporter</Button>
          </Tooltip>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate} sx={{ background: 'linear-gradient(135deg, #1565C0, #42A5F5)' }}>Nouvelle</Button>
        </Box>
      </Box>

      <TextField placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
        sx={{ mb: 2, width: '100%', maxWidth: 500 }} size="small"
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment> }}
      />

      <Fade in timeout={500}>
        <TableContainer component={Paper} sx={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2, maxHeight: 520, overflow: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Dossier</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Demandeur</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Statut</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRow key={i}>{Array.from({ length: 6 }).map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}</TableRow>)
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 6 }}><ReportProblemIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} /><Typography sx={{ color: 'text.secondary' }}>Aucune réclamation</Typography></TableCell></TableRow>
              ) : (
                filtered.map(r => {
                  const sc = STATUT_CONFIG[r.statut] || { label: r.statut, color: '#666', bg: '#f5f5f5' };
                  return (
                    <TableRow key={r.id} hover>
                      <TableCell><Chip label={r.dossier?.numeroDossier || '—'} size="small" sx={{ bgcolor: '#E3F2FD', color: '#1565C0', fontWeight: 600, fontSize: '0.75rem' }} /></TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{r.demandeur || '—'}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{r.typeDemande || '—'}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{r.dateDemande || '—'}</TableCell>
                      <TableCell><Chip label={sc.label} size="small" sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 600 }} /></TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <IconButton size="small" onClick={() => setSelectedRec(r)} sx={{ color: '#1565C0' }}><VisibilityIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => openEdit(r)} sx={{ color: '#E65100' }}><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => setDeleteDialog({ open: true, id: r.id })} sx={{ color: '#C62828' }}><DeleteIcon fontSize="small" /></IconButton>
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
      <Dialog open={!!selectedRec} onClose={() => setSelectedRec(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        {selectedRec && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>Détails de la Réclamation</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                {[
                  ['Dossier', selectedRec.dossier?.numeroDossier],
                  ['Demandeur', selectedRec.demandeur],
                  ['Type', selectedRec.typeDemande],
                  ['Date demande', selectedRec.dateDemande],
                  ['Statut', selectedRec.statut],
                  ['Motif', selectedRec.motif],
                  ['Réponse', selectedRec.reponse],
                  ['Date traitement', selectedRec.dateTraitement],
                ].map(([label, val], i) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={i}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>{label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{val || '—'}</Typography>
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}><Button onClick={() => setSelectedRec(null)}>Fermer</Button></DialogActions>
          </>
        )}
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={formDialog.open} onClose={() => setFormDialog({ open: false, mode: 'create', rec: null })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>{formDialog.mode === 'create' ? 'Nouvelle Réclamation' : 'Modifier la Réclamation'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth select label="Dossier" value={form.dossier_id} onChange={e => setForm({ ...form, dossier_id: e.target.value })} required>
                {dossiers.map(d => <MenuItem key={d.id} value={d.id}>{d.numeroDossier}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Demandeur" value={form.demandeur} onChange={e => setForm({ ...form, demandeur: e.target.value })} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Type de demande" value={form.typeDemande} onChange={e => setForm({ ...form, typeDemande: e.target.value })} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Date" type={form.dateDemande ? "date" : "text"} onFocus={(e) => e.target.type = "date"} onBlur={(e) => { if (!form.dateDemande) e.target.type = "text"; }} value={form.dateDemande} onChange={e => setForm({ ...form, dateDemande: e.target.value })} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth select label="Statut" value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })} required>
                {Object.entries(STATUT_CONFIG).map(([key, cfg]) => <MenuItem key={key} value={key}>{cfg.label}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth multiline rows={2} label="Motif" value={form.motif} onChange={e => setForm({ ...form, motif: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth multiline rows={2} label="Réponse" value={form.reponse} onChange={e => setForm({ ...form, reponse: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setFormDialog({ open: false, mode: 'create', rec: null })} color="inherit">Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={formLoading}>
            {formLoading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : formDialog.mode === 'create' ? 'Créer' : 'Sauvegarder'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirmer la suppression</DialogTitle>
        <DialogContent><Typography>Supprimer cette réclamation ? Cette action est irréversible.</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })} color="inherit">Annuler</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
