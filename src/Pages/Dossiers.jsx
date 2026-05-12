import React, { useState, useEffect, useMemo } from 'react';
import dossierService from '../services/dossierService';
import etudiantService from '../services/etudiantService';
import { useSnackbar } from '../contexts/SnackbarContext';
import { normalizeFiliere, FILIERES_OFFICIELLES } from '../utils/normalizeFiliere';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
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
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FolderIcon from '@mui/icons-material/Folder';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const STATUT_CONFIG = {
  ARCHIVE: { label: 'Archivé', color: '#2E7D32', bg: '#E8F5E9' },
  EN_COURS: { label: 'En cours', color: '#1565C0', bg: '#E3F2FD' },
  COMPLET: { label: 'Complet', color: '#2E7D32', bg: '#E8F5E9' },
  INCOMPLET: { label: 'Incomplet', color: '#F57F17', bg: '#FFFDE7' },
  TRANSFERE: { label: 'Transféré', color: '#E65100', bg: '#FFF3E0' },
  RETIRE: { label: 'Retiré', color: '#C62828', bg: '#FFEBEE' },
  DETRUIT: { label: 'Détruit', color: '#616161', bg: '#F5F5F5' },
};

const TYPE_CAS_OPTIONS = [
  'ADMISSION',
  'AUTRE_VILLE',
  'ABANDON_CYCLE',
  'TRANSFERT_SORTANT',
  'TRANSFERT_ENTRANT',
  'LAUREAT',
  'ABANDON_PREPA',
  'DEMI_PENSION',
  'PENSION_COMPLETE',
];

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
  const [filiereFilter, setFiliereFilter] = useState('');
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const [formDialog, setFormDialog] = useState({ open: false, mode: 'create', dossier: null });
  const [form, setForm] = useState(initialForm);
  const [formLoading, setFormLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ─── Generate dialog state ──────────────────────────────────
  const [generateDialog, setGenerateDialog] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    typeCas: 'ADMISSION',
    statut: 'EN_COURS',
    localisation: '',
  });
  const [generating, setGenerating] = useState(false);

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

  // Nombre d'étudiants qui n'ont pas encore de dossier
  const etudiantsSansDossier = useMemo(() => {
    const idsAvecDossier = new Set(dossiers.map(d => d.etudiant_id));
    return etudiants.filter(e => !idsAvecDossier.has(e.id));
  }, [etudiants, dossiers]);

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

  // Auto-fill numeroDossier = CNE when selecting a student (create mode only)
  const handleStudentChange = (etudiantId) => {
    const selected = etudiants.find(e => e.id === Number(etudiantId));
    setForm(prev => ({
      ...prev,
      etudiant_id: etudiantId,
      // Only auto-fill in create mode
      ...(formDialog.mode === 'create' && selected ? { numeroDossier: selected.cne } : {}),
    }));
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

  // ─── Generate dossiers from étudiants ───────────────────────
  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await dossierService.generateFromEtudiants(generateForm);
      const { message, created, errors } = res.data;
      if (created > 0) {
        showSuccess(message);
        loadData(); // Reload dossiers list
      } else {
        showError(message);
      }
      setGenerateDialog(false);
    } catch (err) {
      showError(err?.userMessage || 'Erreur lors de la génération des dossiers');
    } finally { setGenerating(false); }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await dossierService.export(filiereFilter || null);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      const suffix = filiereFilter ? `_${filiereFilter}` : '';
      link.setAttribute('download', `dossiers${suffix}_${new Date().toISOString().slice(0,10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSuccess(`Fichier exporté avec succès${filiereFilter ? ` (filière: ${filiereFilter})` : ''} !`);
    } catch { showError('Erreur lors de l\'export'); }
    finally { setExporting(false); }
  };

  const filtered = useMemo(() => dossiers.filter(d => {
    const etudiant = d.etudiant;
    const terms = [d.numeroDossier, d.typeCas, d.statut, d.localisation, etudiant?.nom, etudiant?.prenom, etudiant?.cne];
    const matchSearch = terms.some(t => t?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchFiliere = filiereFilter ? normalizeFiliere(etudiant?.filiere) === filiereFilter : true;
    return matchSearch && matchFiliere;
  }), [dossiers, searchTerm, filiereFilter]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [searchTerm, filiereFilter]);

  const displayedDossiers = useMemo(() => {
    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

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
          <Tooltip title={`Générer les dossiers pour ${etudiantsSansDossier.length} étudiant(s) sans dossier`}>
            <span>
              <Button
                variant="outlined"
                startIcon={<GroupAddIcon />}
                onClick={() => setGenerateDialog(true)}
                disabled={etudiantsSansDossier.length === 0}
                sx={{ borderColor: '#2E7D32', color: '#2E7D32', '&:hover': { borderColor: '#1B5E20', bgcolor: 'rgba(46,125,50,0.04)' } }}
              >
                Générer ({etudiantsSansDossier.length})
              </Button>
            </span>
          </Tooltip>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate} sx={{ background: 'linear-gradient(135deg, #1565C0, #42A5F5)' }}>
            Nouveau Dossier
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Rechercher par numéro, étudiant, statut..."
          value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }} size="small"
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment> }}
        />
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Filière</InputLabel>
          <Select
            value={filiereFilter}
            label="Filière"
            onChange={(e) => setFiliereFilter(e.target.value)}
          >
            <MenuItem value=""><em>Toutes les filières</em></MenuItem>
            {FILIERES_OFFICIELLES.map(f => <MenuItem key={f.code} value={f.code}>{f.code} — {f.label}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      <Fade in timeout={500}>
        <TableContainer component={Paper} sx={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2, maxHeight: 520, overflow: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>N° Dossier</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Étudiant</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>CNE</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Filière</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Type de cas</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: '#F8FAFC', display: { xs: 'none', md: 'table-cell' } }}>Localisation</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, bgcolor: '#F8FAFC' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>{Array.from({ length: 8 }).map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}</TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: 'center', py: 6 }}>
                    <FolderIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography sx={{ color: 'text.secondary' }}>Aucun dossier trouvé</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayedDossiers.map(d => {
                  const sc = STATUT_CONFIG[d.statut] || { label: d.statut, color: '#666', bg: '#f5f5f5' };
                  return (
                    <TableRow key={d.id} hover sx={{ '&:hover': { bgcolor: 'rgba(21,101,192,0.02)' } }}>
                      <TableCell>
                        <Chip label={d.numeroDossier} size="small" sx={{ bgcolor: '#E3F2FD', color: '#1565C0', fontWeight: 600, fontSize: '0.75rem' }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{d.etudiant ? `${d.etudiant.nom} ${d.etudiant.prenom}` : '—'}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>{d.etudiant?.cne || '—'}</TableCell>
                      <TableCell><Chip label={normalizeFiliere(d.etudiant?.filiere)} size="small" variant="outlined" sx={{ fontSize: '0.7rem', fontWeight: 600 }} /></TableCell>
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
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Lignes par page :"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          />
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
              <TextField fullWidth select label="Étudiant" value={form.etudiant_id} onChange={e => handleStudentChange(e.target.value)} required>
                {etudiants.map(e => <MenuItem key={e.id} value={e.id}>{e.nom} {e.prenom} ({e.cne})</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="N° Dossier (CNE)"
                value={form.numeroDossier}
                onChange={e => setForm({ ...form, numeroDossier: e.target.value })}
                required
                helperText={formDialog.mode === 'create' ? 'Rempli automatiquement avec le CNE' : ''}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth select label="Type de cas" value={form.typeCas} onChange={e => setForm({ ...form, typeCas: e.target.value })} required>
                {TYPE_CAS_OPTIONS.map(t => <MenuItem key={t} value={t}>{t.replace(/_/g, ' ')}</MenuItem>)}
              </TextField>
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

      {/* Generate Dialog */}
      <Dialog open={generateDialog} onClose={() => setGenerateDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <GroupAddIcon sx={{ color: '#2E7D32' }} /> Générer les dossiers depuis les étudiants
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2.5, mt: 0.5 }}>
            <strong>{etudiantsSansDossier.length} étudiant(s)</strong> n'ont pas encore de dossier.
            Un dossier sera créé pour chacun avec <strong>N° Dossier = CNE</strong>.
          </Alert>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label="Type de cas"
                value={generateForm.typeCas}
                onChange={e => setGenerateForm({ ...generateForm, typeCas: e.target.value })}
                required
              >
                {TYPE_CAS_OPTIONS.map(t => <MenuItem key={t} value={t}>{t.replace(/_/g, ' ')}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label="Statut"
                value={generateForm.statut}
                onChange={e => setGenerateForm({ ...generateForm, statut: e.target.value })}
                required
              >
                {Object.entries(STATUT_CONFIG).map(([key, cfg]) => <MenuItem key={key} value={key}>{cfg.label}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Localisation (optionnel)"
                value={generateForm.localisation}
                onChange={e => setGenerateForm({ ...generateForm, localisation: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setGenerateDialog(false)} color="inherit" disabled={generating}>Annuler</Button>
          <Button
            onClick={handleGenerate}
            variant="contained"
            disabled={generating || etudiantsSansDossier.length === 0}
            startIcon={generating ? <CircularProgress size={18} color="inherit" /> : <GroupAddIcon />}
            sx={{ background: 'linear-gradient(135deg, #2E7D32, #66BB6A)' }}
          >
            {generating ? 'Génération...' : `Générer ${etudiantsSansDossier.length} dossier(s)`}
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
