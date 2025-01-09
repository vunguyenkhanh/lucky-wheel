import api from '../config/api';

export const customerService = {
  // Profile management
  getProfile: async () => {
    const response = await api.get('/customers/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/customers/profile', data);
    return response.data;
  },

  // Prize history
  getPrizeHistory: async () => {
    const response = await api.get('/customers/prizes');
    return response.data;
  },

  // Check secret code
  checkSecretCode: async (code) => {
    const response = await api.get(`/customers/check-code/${code}`);
    return response.data;
  },
};
