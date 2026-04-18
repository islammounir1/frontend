import api from './api';

const transfertService = {
  getAll: () => api.get('/transferts'),
  getById: (id) => api.get(`/transferts/${id}`),
  create: (data) => api.post('/transferts', data),
  update: (id, data) => api.put(`/transferts/${id}`, data),
  delete: (id) => api.delete(`/transferts/${id}`),
  export: () =>
    api.get('/transferts/export', { responseType: 'blob' }),
};

export default transfertService;
