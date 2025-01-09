import api from '../config/api';

export const authService = {
  // Customer auth
  login: async (data) => {
    const response = await api.post('/auth/customer/login', data);
    return response.data;
  },

  register: async (data) => {
    const response = await api.post('/auth/customer/register', data);
    return response.data;
  },

  // Admin auth
  adminLogin: async (data) => {
    const response = await api.post('/auth/admin/login', data);
    return response.data;
  },

  checkSecretCode: async (code) => {
    const response = await api.get(`/auth/secret-codes/check/${code}`);
    return response.data;
  },
};
