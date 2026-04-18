import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
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

const COLORS = ['#1565C0', '#42A5F5', '#FF8F00', '#2E7D32', '#C62828', '#6A1B9A'];

function StatCard({ icon, title, value, color, loading }) {
  return (
    <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5, border: '1px solid rgba(0,0,0,0.04)', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' } }}>
      <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: color + '14', display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.3 }}>{title}</Typography>
        {loading ? <Skeleton width={60} height={36} /> : <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>{value}</Typography>}
      </Box>
    </Paper>
  );
}

export default function Diagramme() {
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

  const filiereData = useMemo(() => {
    const m = {};
    etudiants.forEach(e => { const f = e.filiere || 'N/A'; m[f] = (m[f]||0)+1; });
    return Object.entries(m).map(([name,value]) => ({name,value}));
  }, [etudiants]);

  const statutData = useMemo(() => {
    const m = {};
    dossiers.forEach(d => { const s = d.statut || 'N/A'; m[s] = (m[s]||0)+1; });
    return Object.entries(m).map(([name,value]) => ({name,value}));
  }, [dossiers]);

  const pieData = filiereData.length > 0 ? filiereData : [{name:'Aucune donnée',value:1}];
  const barData = statutData.length > 0 ? statutData : [{name:'Aucune donnée',value:0}];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Tableau de Bord</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>Vue d'ensemble de vos archives et statistiques</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{xs:12,sm:6,md:3}}><Fade in timeout={400}><Box><StatCard icon={<PeopleIcon sx={{fontSize:28}}/>} title="Utilisateurs" value={stats.total_utilisateurs} color="#1565C0" loading={loading}/></Box></Fade></Grid>
        <Grid size={{xs:12,sm:6,md:3}}><Fade in timeout={500}><Box><StatCard icon={<SchoolIcon sx={{fontSize:28}}/>} title="Étudiants" value={stats.total_etudiants} color="#2E7D32" loading={loading}/></Box></Fade></Grid>
        <Grid size={{xs:12,sm:6,md:3}}><Fade in timeout={600}><Box><StatCard icon={<FolderIcon sx={{fontSize:28}}/>} title="Dossiers" value={dossiers.length} color="#E65100" loading={loading}/></Box></Fade></Grid>
        <Grid size={{xs:12,sm:6,md:3}}><Fade in timeout={700}><Box><StatCard icon={<TrendingUpIcon sx={{fontSize:28}}/>} title="Filières" value={filiereData.length} color="#6A1B9A" loading={loading}/></Box></Fade></Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{xs:12,md:6}}>
          <Fade in timeout={800}>
            <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.04)' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Répartition par filière</Typography>
              <Box sx={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} dataKey="value" paddingAngle={3} label={({percent})=>`${(percent*100).toFixed(0)}%`}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Fade>
        </Grid>
        <Grid size={{xs:12,md:6}}>
          <Fade in timeout={900}>
            <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.04)' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Dossiers par statut</Typography>
              <Box sx={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#5A6A7A' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#5A6A7A' }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="value" fill="#1565C0" radius={[6,6,0,0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
}