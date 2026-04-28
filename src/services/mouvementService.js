import api from './api';

const mouvementService = {
  getAll: () => api.get('/mouvements'),
  getById: (id) => api.get(`/mouvements/${id}`),
  create: (data) => api.post('/mouvements', data),
  update: (id, data) => api.put(`/mouvements/${id}`, data),
  delete: (id) => api.delete(`/mouvements/${id}`),
  export: () =>
    api.get('/mouvements/export', { responseType: 'blob' }),
};

export default mouvementService;
