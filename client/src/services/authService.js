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

  logout: async () => {
    try {
      await api.post('/auth/customer/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Admin auth
  adminLogin: async (credentials) => {
    try {
      const response = await api.post('/auth/admin/login', credentials);
      return response.data;
    } catch (error) {
      if (error.response?.status === 429) {
        throw new Error('Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau.');
      }
      console.error('Admin login error:', error);
      throw error;
    }
  },

  adminLogout: async () => {
    try {
      await api.post('/auth/admin/logout');
    } catch (error) {
      console.error('Admin logout error:', error);
    }
  },

  checkSecretCode: async (code) => {
    const response = await api.get(`/auth/secret-codes/check/${code}`);
    return response.data;
  },
};
