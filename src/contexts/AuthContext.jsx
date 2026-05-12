import React, { createContext, useContext, useState, useCallback } from 'react';
import authService from '../services/authService';
import utilisateurService from '../services/utilisateurService';

// ─── Context ───────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ──────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getUser());
  const [token, setToken] = useState(() => authService.getToken());

  const login = useCallback(async (email, password) => {
    const { token: newToken, utilisateur } = await authService.login(
      email,
      password
    );
    setToken(newToken);
    setUser(utilisateur);
    return utilisateur;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  /**
   * Rafraîchit les données utilisateur depuis le serveur
   * et met à jour le state + localStorage
   */
  const refreshUser = useCallback(async () => {
    try {
      const res = await utilisateurService.getProfile();
      const freshUser = res.data;
      setUser(freshUser);
      localStorage.setItem('auth_user', JSON.stringify(freshUser));
      return freshUser;
    } catch {
      // Si ça échoue, on ne fait rien
      return null;
    }
  }, []);

  const isAuthenticated = !!token;

  const value = {
    user,
    token,
    login,
    logout,
    refreshUser,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
