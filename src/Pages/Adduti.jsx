import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import utilisateurService from '../services/utilisateurService';
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
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Fade from '@mui/material/Fade';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import InventoryIcon from '@mui/icons-material/Inventory';

const ROLE_CONFIG = {
  SUPER_ADMIN: { label: 'Super Admin', color: '#C62828', bg: '#FFEBEE' },
  ADMIN_SYSTEME: { label: 'Admin Système', color: '#1565C0', bg: '#E3F2FD' },
  RESPONSABLE_ARCHIVES: { label: 'Resp. Archives', color: '#E65100', bg: '#FFF3E0' },
  AGENT_ACCUEIL: { label: 'Agent Accueil', color: '#2E7D32', bg: '#E8F5E9' },
  CONSULTANT: { label: 'Consultant', color: '#6A1B9A', bg: '#F3E5F5' },
  ETUDIANT: { label: 'Étudiant', color: '#00838F', bg: '#E0F7FA' },
};

export default function Adduti() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const [editDialog, setEditDialog] = useState({ open: false, user: null });
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setLoading(true);
    try { const res = await utilisateurService.getAll(); setUsers(res.data); }
    catch { showError('Erreur lors du chargement des utilisateurs'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await utilisateurService.delete(deleteDialog.id);
      setUsers(prev => prev.filter(u => u.id !== deleteDialog.id));
      showSuccess('Utilisateur supprimé avec succès');
    } catch { showError('Erreur lors de la suppression'); }
    finally { setDeleteDialog({ open: false, id: null, name: '' }); }
  };

  const openEdit = (user) => {
    setEditForm({ nom: user.nom, prenom: user.prenom, email: user.email, telephone: user.telephone || '', role: user.role });
    setEditDialog({ open: true, user });
  };

  const handleEdit = async () => {
    setEditLoading(true);
    try {
      const res = await utilisateurService.update(editDialog.user.id, editForm);
      setUsers(prev => prev.map(u => u.id === editDialog.user.id ? { ...u, ...res.data } : u));
      showSuccess('Utilisateur modifié avec succès');
      setEditDialog({ open: false, user: null });
    } catch { showError('Erreur lors de la modification'); }
    finally { setEditLoading(false); }
  };

  const roleStats = {
    total: users.length,
    admins: users.filter(u => ['SUPER_ADMIN','ADMIN_SYSTEME'].includes(u.role)).length,
    agents: users.filter(u => u.role === 'AGENT_ACCUEIL').length,
    responsables: users.filter(u => u.role === 'RESPONSABLE_ARCHIVES').length,
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Gestion des Utilisateurs</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>{users.length} utilisateurs enregistrés</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/diagramme/admin')} sx={{ background: 'linear-gradient(135deg, #E65100, #FF8F00)', '&:hover': { background: 'linear-gradient(135deg, #BF360C, #E65100)' } }}>
          Ajouter utilisateur
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total', value: roleStats.total, icon: <PeopleIcon />, color: '#1565C0' },
          { label: 'Administrateurs', value: roleStats.admins, icon: <AdminPanelSettingsIcon />, color: '#C62828' },
          { label: 'Agents d\'accueil', value: roleStats.agents, icon: <SupportAgentIcon />, color: '#2E7D32' },
          { label: 'Resp. Archives', value: roleStats.responsables, icon: <InventoryIcon />, color: '#E65100' },
        ].map((s, i) => (
          <Grid size={{xs:6,md:3}} key={i}>
            <Paper sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid rgba(0,0,0,0.04)' }}>
              <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: s.color + '14', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{s.label}</Typography>
                {loading ? <Skeleton width={30} /> : <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1 }}>{s.value}</Typography>}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Table */}
      <Fade in timeout={500}>
        <TableContainer component={Paper} sx={{ border: '1px solid rgba(0,0,0,0.04)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Prénom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({length:4}).map((_,i) => <TableRow key={i}>{Array.from({length:5}).map((_,j) => <TableCell key={j}><Skeleton /></TableCell>)}</TableRow>)
              ) : users.length === 0 ? (
                <TableRow><TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}><Typography sx={{ color: 'text.secondary' }}>Aucun utilisateur</Typography></TableCell></TableRow>
              ) : (
                users.map(u => {
                  const rc = ROLE_CONFIG[u.role] || { label: u.role, color: '#666', bg: '#f5f5f5' };
                  return (
                    <TableRow key={u.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{u.nom}</TableCell>
                      <TableCell>{u.prenom}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{u.email}</TableCell>
                      <TableCell><Chip label={rc.label} size="small" sx={{ bgcolor: rc.bg, color: rc.color, fontWeight: 600 }} /></TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => openEdit(u)} sx={{ color: '#1565C0' }} title="Modifier"><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => setDeleteDialog({ open: true, id: u.id, name: `${u.nom} ${u.prenom}` })} sx={{ color: '#C62828' }} title="Supprimer"><DeleteIcon fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Fade>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, user: null })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Modifier l'utilisateur</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{xs:12,sm:6}}><TextField fullWidth label="Nom" value={editForm.nom||''} onChange={e => setEditForm({...editForm,nom:e.target.value})} /></Grid>
            <Grid size={{xs:12,sm:6}}><TextField fullWidth label="Prénom" value={editForm.prenom||''} onChange={e => setEditForm({...editForm,prenom:e.target.value})} /></Grid>
            <Grid size={{xs:12}}><TextField fullWidth label="Email" value={editForm.email||''} onChange={e => setEditForm({...editForm,email:e.target.value})} /></Grid>
            <Grid size={{xs:12,sm:6}}><TextField fullWidth label="Téléphone" value={editForm.telephone||''} onChange={e => setEditForm({...editForm,telephone:e.target.value})} /></Grid>
            <Grid size={{xs:12,sm:6}}><TextField fullWidth select label="Rôle" value={editForm.role||''} onChange={e => setEditForm({...editForm,role:e.target.value})}><MenuItem value="ADMIN_SYSTEME">Admin Système</MenuItem><MenuItem value="RESPONSABLE_ARCHIVES">Resp. Archives</MenuItem><MenuItem value="AGENT_ACCUEIL">Agent Accueil</MenuItem></TextField></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditDialog({ open: false, user: null })} color="inherit">Annuler</Button>
          <Button onClick={handleEdit} variant="contained" disabled={editLoading}>{editLoading ? 'Sauvegarde...' : 'Sauvegarder'}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null, name: '' })} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirmer la suppression</DialogTitle>
        <DialogContent><Typography>Supprimer <strong>{deleteDialog.name}</strong> ? Cette action est irréversible.</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialog({ open: false, id: null, name: '' })} color="inherit">Annuler</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
