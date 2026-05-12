import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Fade from '@mui/material/Fade';
import FolderIcon from '@mui/icons-material/Folder';

const CHART_COLORS = [
  '#1565C0', '#2E7D32', '#E65100', '#6A1B9A', '#C62828',
  '#00838F', '#FF8F00', '#4527A0', '#AD1457', '#1B5E20',
  '#283593', '#4E342E', '#37474F', '#F57F17', '#00695C',
];

export default function DiagrammeCharts({ filiereData, barData }) {
  const navigate = useNavigate();

  return (
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
              <ResponsiveContainer width="100%" height="100%" debounce={50}>
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
                    isAnimationActive={false}
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
                <ResponsiveContainer width="100%" height="100%" debounce={50}>
                  <PieChart>
                    <Pie
                      data={barData}
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={95}
                      dataKey="value"
                      paddingAngle={3}
                      isAnimationActive={false}
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
  );
}
