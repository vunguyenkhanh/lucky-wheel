import api from '../config/api';

export const wheelService = {
  // Spin the wheel
  spin: async () => {
    const response = await api.post('/wheel/spin');
    return response.data;
  },

  // Get spin history
  getSpinHistory: async () => {
    const response = await api.get('/wheel/history');
    return response.data;
  },

  // Get current user's spins
  getUserSpins: async () => {
    const response = await api.get('/wheel/user-spins');
    return response.data;
  },

  // Check if user can spin
  checkSpinEligibility: async () => {
    const response = await api.get('/wheel/check-eligibility');
    return response.data;
  },
};
