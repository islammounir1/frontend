import api from './api';

const dossierService = {
  getAll: () => api.get('/dossiers'),
  getById: (id) => api.get(`/dossiers/${id}`),
  create: (data) => api.post('/dossiers', data),
  update: (id, data) => api.put(`/dossiers/${id}`, data),
  delete: (id) => api.delete(`/dossiers/${id}`),
  export: () =>
    api.get('/dossiers/export', { responseType: 'blob' }),
};

export default dossierService;
