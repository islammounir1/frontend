import api from './api';

const authService = {
  /**
   * Connexion — POST /api/login
   * Stocke le token et l'utilisateur dans localStorage
   */
  async login(email, password) {
    const response = await api.post('/login', { email, password });
    const { token, utilisateur } = response.data;

    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(utilisateur));

    return { token, utilisateur };
  },

  /**
   * Déconnexion — POST /api/logout
   * Supprime le token côté serveur et localStorage
   */
  async logout() {
    try {
      await api.post('/logout');
    } catch {
      // Même si l'appel échoue, on nettoie le localStorage
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  /**
   * Récupère l'utilisateur courant depuis le localStorage
   */
  getUser() {
    const user = localStorage.getItem('auth_user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Récupère le token depuis le localStorage
   */
  getToken() {
    return localStorage.getItem('auth_token');
  },

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },
};

export default authService;
