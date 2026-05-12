import api from './api';

const etudiantService = {
  getAll: () => api.get('/etudiants'),
  getById: (id) => api.get(`/etudiants/${id}`),
  create: (data) => api.post('/etudiants', data),
  update: (id, data) => api.put(`/etudiants/${id}`, data),
  delete: (id) => api.delete(`/etudiants/${id}`),
  deleteAll: (code) => api.delete('/etudiants/delete-all', { data: { code } }),
  export: (filiere) =>
    api.get('/etudiants/export', {
      responseType: 'blob',
      params: filiere ? { filiere } : {},
    }),
};

export default etudiantService;
