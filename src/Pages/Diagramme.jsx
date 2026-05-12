import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';

const DiagrammeCharts = lazy(() => import('./DiagrammeCharts'));
import statistiqueService from '../services/statistiqueService';
import etudiantService from '../services/etudiantService';
import dossierService from '../services/dossierService';
import { useSnackbar } from '../contexts/SnackbarContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Fade from '@mui/material/Fade';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import FolderIcon from '@mui/icons-material/Folder';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';



import { normalizeFiliere } from '../utils/normalizeFiliere';

function StatCard({ icon, title, value, color, loading }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        border: '1px solid rgba(0,0,0,0.06)',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' },
      }}
    >
      <Box sx={{ width: 52, height: 52, borderRadius: 2.5, bgcolor: color + '14', display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.3, fontSize: '0.8rem' }}>{title}</Typography>
        {loading ? <Skeleton width={50} height={32} /> : <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1, fontSize: { xs: '1.6rem', md: '2rem' } }}>{value}</Typography>}
      </Box>
    </Paper>
  );
}

export default function Diagramme() {
  const navigate = useNavigate();
  const { showError } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_utilisateurs: 0, total_etudiants: 0 });
  const [etudiants, setEtudiants] = useState([]);
  const [dossiers, setDossiers] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const CACHE_KEY = 'dashboard_data_cache';
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { stats: cStats, etudiants: cEtud, dossiers: cDossiers, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 5 * 60 * 1000) { // 5 minutes cache
            setStats(cStats);
            setEtudiants(cEtud);
            setDossiers(cDossiers);
            setLoading(false);
            return;
          }
        }

        const [s, e, d] = await Promise.allSettled([statistiqueService.getStats(), etudiantService.getAll(), dossierService.getAll()]);
        
        let newStats = stats;
        let newEtudiants = etudiants;
        let newDossiers = dossiers;

        if (s.status === 'fulfilled') { newStats = s.value.data; setStats(newStats); }
        if (e.status === 'fulfilled') { newEtudiants = e.value.data; setEtudiants(newEtudiants); }
        if (d.status === 'fulfilled') { newDossiers = d.value.data; setDossiers(newDossiers); }

        sessionStorage.setItem(CACHE_KEY, JSON.stringify({
          stats: newStats,
          etudiants: newEtudiants,
          dossiers: newDossiers,
          timestamp: Date.now()
        }));
      } catch { showError('Erreur lors du chargement'); }
      finally { setLoading(false); }
    })();
  }, []);

  // ── Filières normalisées et groupées ─────────────────────────
  const filiereData = useMemo(() => {
    const m = {};
    etudiants.forEach(e => {
      const f = normalizeFiliere(e.filiere);
      m[f] = (m[f] || 0) + 1;
    });
    return Object.entries(m)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [etudiants]);

  // ── Top 10 filières pour le pie chart ────────────────────────
  const pieData = useMemo(() => {
    if (filiereData.length === 0) return [{ name: 'Aucune donnée', value: 1 }];
    const top = filiereData.slice(0, 10);
    const rest = filiereData.slice(10).reduce((s, d) => s + d.value, 0);
    if (rest > 0) top.push({ name: 'Autres', value: rest });
    return top;
  }, [filiereData]);

  // ── Dossiers par statut ──────────────────────────────────────
  const statutData = useMemo(() => {
    const m = {};
    dossiers.forEach(d => {
      const s = d.statut || 'N/A';
      m[s] = (m[s] || 0) + 1;
    });
    return Object.entries(m).map(([name, value]) => ({ name: name.replace('_', ' '), value }));
  }, [dossiers]);

  const barData = statutData.length > 0 ? statutData : [{ name: 'Aucune donnée', value: 0 }];

  // ── Nombre de filières uniques ───────────────────────────────
  const uniqueFilieres = filiereData.length;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' } }}>Tableau de Bord</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>Vue d'ensemble de vos archives et statistiques</Typography>
      </Box>

      {/* ── Stat Cards ────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}><Fade in timeout={400}><Box><StatCard icon={<PeopleIcon sx={{ fontSize: 26 }} />} title="Utilisateurs" value={stats.total_utilisateurs} color="#1565C0" loading={loading} /></Box></Fade></Grid>
        <Grid size={{ xs: 6, md: 3 }}><Fade in timeout={500}><Box><StatCard icon={<SchoolIcon sx={{ fontSize: 26 }} />} title="Étudiants" value={stats.total_etudiants} color="#2E7D32" loading={loading} /></Box></Fade></Grid>
        <Grid size={{ xs: 6, md: 3 }}><Fade in timeout={600}><Box><StatCard icon={<FolderIcon sx={{ fontSize: 26 }} />} title="Dossiers" value={dossiers.length} color="#E65100" loading={loading} /></Box></Fade></Grid>
        <Grid size={{ xs: 6, md: 3 }}><Fade in timeout={700}><Box><StatCard icon={<TrendingUpIcon sx={{ fontSize: 26 }} />} title="Filières" value={uniqueFilieres} color="#6A1B9A" loading={loading} /></Box></Fade></Grid>
      </Grid>

      {/* ── Charts ────────────────────────────────────────────── */}
      <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 3 }} />}>
        <DiagrammeCharts filiereData={filiereData} barData={barData} />
      </Suspense>
    </Box>
  );
}