import api from './api';

const statistiqueService = {
  getStats: () => api.get('/statistiques'),
};

export default statistiqueService;
