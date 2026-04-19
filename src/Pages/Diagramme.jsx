import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
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

const CHART_COLORS = [
  '#1565C0', '#2E7D32', '#E65100', '#6A1B9A', '#C62828',
  '#00838F', '#FF8F00', '#4527A0', '#AD1457', '#1B5E20',
  '#283593', '#4E342E', '#37474F', '#F57F17', '#00695C',
];

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
        const [s, e, d] = await Promise.allSettled([statistiqueService.getStats(), etudiantService.getAll(), dossierService.getAll()]);
        if (s.status === 'fulfilled') setStats(s.value.data);
        if (e.status === 'fulfilled') setEtudiants(e.value.data);
        if (d.status === 'fulfilled') setDossiers(d.value.data);
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
      <Grid container spacing={2}>
        {/* Répartition par filière — Horizontal Bar Chart */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Fade in timeout={800}>
            <Paper elevation={0} sx={{ p: 2.5, border: '1px solid rgba(0,0,0,0.06)', borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>Répartition par filière</Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>Cliquez sur une barre pour filtrer</Typography>
              </Box>
              <Box sx={{ height: Math.max(300, filiereData.length * 32) }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filiereData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#5A6A7A' }} />
                    <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11, fill: '#37474F', fontWeight: 500 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', fontSize: 13 }}
                      formatter={(value) => [`${value} étudiants`, 'Nombre']}
                    />
                    <Bar
                      dataKey="value"
                      radius={[0, 6, 6, 0]}
                      maxBarSize={24}
                      cursor="pointer"
                      onClick={(data) => {
                        if (data?.name) navigate(`/diagramme/donnee?filiere=${encodeURIComponent(data.name)}`);
                      }}
                    >
                      {filiereData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Fade>
        </Grid>

        {/* Dossiers par statut — Pie Chart */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Fade in timeout={900}>
            <Paper elevation={0} sx={{ p: 2.5, border: '1px solid rgba(0,0,0,0.06)', borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, fontSize: '1rem' }}>Dossiers par statut</Typography>
              <Box sx={{ height: 320 }}>
                {barData[0]?.name === 'Aucune donnée' ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 1 }}>
                    <FolderIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                    <Typography sx={{ color: 'text.secondary' }}>Aucun dossier trouvé</Typography>
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={barData}
                        cx="50%"
                        cy="45%"
                        innerRadius={55}
                        outerRadius={95}
                        dataKey="value"
                        paddingAngle={3}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {barData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
}