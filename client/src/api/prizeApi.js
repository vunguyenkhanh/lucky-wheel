import api from './axios';

export const prizeApi = {
  getPrizes: () => api.get('/admin/prizes'),
  createPrize: (data) => api.post('/admin/prizes', data),
  updatePrize: (id, data) => api.put(`/admin/prizes/${id}`, data),
  deletePrize: (id) => api.delete(`/admin/prizes/${id}`),
};
