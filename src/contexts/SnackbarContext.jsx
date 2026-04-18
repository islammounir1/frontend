import React, { createContext, useContext, useState, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { setGlobalErrorHandler } from '../services/api';

// ─── Context ───────────────────────────────────────────────────────
const SnackbarContext = createContext(null);

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

// ─── Provider ──────────────────────────────────────────────────────
export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success' | 'error' | 'warning' | 'info'
  });

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const showSuccess = useCallback(
    (message) => showSnackbar(message, 'success'),
    [showSnackbar]
  );

  const showError = useCallback(
    (message) => showSnackbar(message, 'error'),
    [showSnackbar]
  );

  const showWarning = useCallback(
    (message) => showSnackbar(message, 'warning'),
    [showSnackbar]
  );

  const showInfo = useCallback(
    (message) => showSnackbar(message, 'info'),
    [showSnackbar]
  );

  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Enregistre le handler global pour les intercepteurs Axios
  React.useEffect(() => {
    setGlobalErrorHandler((message, status) => {
      // On ne montre pas le snackbar pour les 401 (redirect automatique)
      if (status !== 401) {
        showError(message);
      }
    });
  }, [showError]);

  const value = { showSnackbar, showSuccess, showError, showWarning, showInfo };

  return (
    <SnackbarContext.Provider value={value}>
      {children}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
          elevation={6}
          sx={{
            width: '100%',
            fontWeight: 500,
            fontSize: '0.9rem',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────
export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}
