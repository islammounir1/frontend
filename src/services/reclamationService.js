import api from './api';

const reclamationService = {
  getAll: () => api.get('/reclamations'),
  getById: (id) => api.get(`/reclamations/${id}`),
  create: (data) => api.post('/reclamations', data),
  update: (id, data) => api.put(`/reclamations/${id}`, data),
  delete: (id) => api.delete(`/reclamations/${id}`),
  export: () =>
    api.get('/reclamations/export', { responseType: 'blob' }),
};

export default reclamationService;
