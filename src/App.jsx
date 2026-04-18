import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// MUI Components
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// MUI Icons
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FolderIcon from '@mui/icons-material/Folder';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import ArchiveIcon from '@mui/icons-material/Archive';

// Pages
import Home from './Pages/Home';
import Connexion from './Pages/Connexion';
import Diagramme from './Pages/Diagramme';
import Ajouter from './Pages/Ajouter';
import Admin from './Pages/Admin';
import Adduti from './Pages/Adduti';
import Donnee from './Pages/Donnee';

const DRAWER_WIDTH = 260;

// ─── Menu Items ────────────────────────────────────────────────────
const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/diagramme' },
  { text: 'Étudiants', icon: <SchoolIcon />, path: '/diagramme/donnee' },
  { text: 'Ajouter Étudiant', icon: <PersonAddIcon />, path: '/ajouter' },
  { text: 'Utilisateurs', icon: <PeopleIcon />, path: '/adduti' },
  { text: 'Ajouter Utilisateur', icon: <AdminPanelSettingsIcon />, path: '/diagramme/admin' },
];

// ─── Sidebar Drawer ────────────────────────────────────────────────
function SidebarContent({ onItemClick }) {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo / Brand */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          background: 'linear-gradient(135deg, #0D47A1, #1565C0)',
        }}
      >
        <ArchiveIcon sx={{ color: '#FFB74D', fontSize: 32 }} />
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.1rem',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            ArchivePro
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}
          >
            Gestion d'Archives ENSA
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* User info */}
      {user && (
        <Box sx={{ px: 2, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: '#1565C0',
                width: 38,
                height: 38,
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              {user.prenom?.[0]}
              {user.nom?.[0]}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, lineHeight: 1.3 }}
                noWrap
              >
                {user.prenom} {user.nom}
              </Typography>
              <Chip
                label={user.role?.replace('_', ' ')}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  bgcolor: '#E3F2FD',
                  color: '#1565C0',
                  mt: 0.3,
                }}
              />
            </Box>
          </Box>
        </Box>
      )}

      <Divider />

      {/* Navigation */}
      <List sx={{ px: 1.5, py: 1, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={onItemClick}
                sx={{
                  borderRadius: 2.5,
                  py: 1.2,
                  px: 2,
                  transition: 'all 0.2s ease',
                  bgcolor: isActive ? 'rgba(21, 101, 192, 0.08)' : 'transparent',
                  color: isActive ? '#1565C0' : 'text.secondary',
                  '&:hover': {
                    bgcolor: isActive
                      ? 'rgba(21, 101, 192, 0.12)'
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? '#1565C0' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
                {isActive && (
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      borderRadius: 4,
                      bgcolor: '#1565C0',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2 }}>
        <Typography
          variant="caption"
          sx={{ color: 'text.disabled', display: 'block', textAlign: 'center' }}
        >
          © 2026 ArchivePro
        </Typography>
      </Box>
    </Box>
  );
}

// ─── Dashboard Layout ──────────────────────────────────────────────
function DashboardLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setLogoutOpen(false);
    navigate('/connexion');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          <SidebarContent onItemClick={() => setMobileOpen(false)} />
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              border: 'none',
            },
          }}
        >
          <SidebarContent onItemClick={() => {}} />
        </Drawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        {/* AppBar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
            {isMobile && (
              <IconButton
                edge="start"
                onClick={() => setMobileOpen(true)}
                sx={{ mr: 2, color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.primary',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}
              >
                Gestion d'Archives
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                École Nationale des Sciences Appliquées
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {user && (
                <Chip
                  avatar={
                    <Avatar sx={{ bgcolor: '#1565C0', width: 28, height: 28 }}>
                      {user.prenom?.[0]}
                    </Avatar>
                  }
                  label={`${user.prenom} ${user.nom}`}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: 'divider',
                    display: { xs: 'none', sm: 'flex' },
                  }}
                />
              )}
              <IconButton
                onClick={() => setLogoutOpen(true)}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: '#C62828', bgcolor: 'rgba(198,40,40,0.08)' },
                }}
                title="Déconnexion"
              >
                <LogoutIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 } }}>{children}</Box>
      </Box>

      {/* Logout Dialog */}
      <Dialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3, px: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirmer la déconnexion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir vous déconnecter ? Vous serez redirigé vers
            la page de connexion.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setLogoutOpen(false)} color="inherit">
            Annuler
          </Button>
          <Button onClick={handleLogout} variant="contained" color="error">
            Déconnexion
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ─── Public Layout (Home + Login) ──────────────────────────────────
function PublicLayout({ children }) {
  return <Box sx={{ minHeight: '100vh' }}>{children}</Box>;
}

// ─── Router ────────────────────────────────────────────────────────
function AppRoutes() {
  const location = useLocation();
  const publicPaths = ['/', '/connexion'];
  const isPublic = publicPaths.includes(location.pathname);

  if (isPublic) {
    return (
      <PublicLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connexion" element={<Connexion />} />
        </Routes>
      </PublicLayout>
    );
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route
          path="/diagramme"
          element={
            <ProtectedRoute>
              <Diagramme />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diagramme/donnee"
          element={
            <ProtectedRoute>
              <Donnee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ajouter"
          element={
            <ProtectedRoute>
              <Ajouter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diagramme/admin"
          element={
            <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN_SYSTEME']}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adduti"
          element={
            <ProtectedRoute
              roles={['SUPER_ADMIN', 'ADMIN_SYSTEME', 'RESPONSABLE_ARCHIVES']}
            >
              <Adduti />
            </ProtectedRoute>
          }
        />
      </Routes>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}