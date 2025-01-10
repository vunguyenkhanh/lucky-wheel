import api from '../config/api';

export const prizeService = {
  // Get all prizes
  getPrizes: async () => {
    const response = await api.get('/admin/prizes');
    return response.data;
  },

  // Create new prize
  createPrize: async (data) => {
    const response = await api.post('/admin/prizes', data);
    return response.data;
  },

  // Update prize
  updatePrize: async (id, data) => {
    const response = await api.put(`/admin/prizes/${id}`, data);
    return response.data;
  },

  // Delete prize
  deletePrize: async (id) => {
    const response = await api.delete(`/admin/prizes/${id}`);
    return response.data;
  },
};
