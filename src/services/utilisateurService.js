import api from './api';

const utilisateurService = {
  getAll: () => api.get('/utilisateurs'),
  getById: (id) => api.get(`/utilisateurs/${id}`),
  create: (data) => api.post('/utilisateurs', data),
  update: (id, data) => api.put(`/utilisateurs/${id}`, data),
  delete: (id) => api.delete(`/utilisateurs/${id}`),
  export: () =>
    api.get('/utilisateurs/export', { responseType: 'blob' }),
};

export default utilisateurService;
