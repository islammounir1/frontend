import axios from 'axios';

// ─── Instance Axios centralisée ────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// ─── Intercepteur de REQUÊTE ───────────────────────────────────────
// Injecte automatiquement le token Bearer si disponible
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Intercepteur de RÉPONSE ───────────────────────────────────────
// Gestion globale des erreurs HTTP
// Les composants peuvent brancher un callback via `api._onError`
let _onError = null;

export const setGlobalErrorHandler = (handler) => {
  _onError = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    let message = 'Une erreur est survenue';

    switch (status) {
      case 401:
        message = data?.message || 'Session expirée — veuillez vous reconnecter';
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        // Redirect seulement si on n'est pas déjà sur la page de connexion
        if (!window.location.pathname.includes('/connexion')) {
          window.location.href = '/connexion';
        }
        break;

      case 403:
        message = data?.message || 'Accès refusé — droits insuffisants';
        break;

      case 404:
        message = data?.message || 'Ressource introuvable';
        break;

      case 422:
        // Erreurs de validation Laravel
        if (data?.errors) {
          const firstErrors = Object.values(data.errors).map((e) => e[0]);
          message = firstErrors.join(' • ');
        } else {
          message = data?.message || 'Données invalides';
        }
        break;

      case 500:
        message = 'Erreur serveur — veuillez réessayer plus tard';
        break;

      default:
        if (!error.response) {
          message = 'Impossible de contacter le serveur — vérifiez votre connexion';
        }
        break;
    }

    // Déclenche la notification globale si un handler est enregistré
    if (_onError) {
      _onError(message, status);
    }

    return Promise.reject({ ...error, userMessage: message });
  }
);

export default api;
