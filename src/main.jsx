import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
import App from './App.jsx';

// ─── Thème MUI professionnel ───────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565C0',
      light: '#42A5F5',
      dark: '#0D47A1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF8F00',
      light: '#FFB74D',
      dark: '#E65100',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F0F4F8',
      paper: '#ffffff',
    },
    text: {
      primary: '#1A2027',
      secondary: '#5A6A7A',
    },
    success: {
      main: '#2E7D32',
    },
    error: {
      main: '#C62828',
    },
    warning: {
      main: '#F57F17',
    },
    info: {
      main: '#0288D1',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.9rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(21, 101, 192, 0.3)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1565C0, #42A5F5)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0D47A1, #1565C0)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#F0F4F8',
          color: '#1A2027',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

// ─── Montage de l'application ──────────────────────────────────────
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);