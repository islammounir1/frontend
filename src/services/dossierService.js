import api from './api';

const dossierService = {
  getAll: () => api.get('/dossiers'),
  getById: (id) => api.get(`/dossiers/${id}`),
  create: (data) => api.post('/dossiers', data),
  update: (id, data) => api.put(`/dossiers/${id}`, data),
  delete: (id) => api.delete(`/dossiers/${id}`),
  export: (filiere) =>
    api.get('/dossiers/export', {
      responseType: 'blob',
      params: filiere ? { filiere } : {},
    }),
  generateFromEtudiants: (data) =>
    api.post('/dossiers/generate-from-etudiants', data),
};

export default dossierService;
