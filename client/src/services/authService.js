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
      if (error.response?.status === 401) {
        throw new Error(error.response.data?.error || 'Thông tin đăng nhập không chính xác');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.error || 'Vui lòng kiểm tra lại thông tin đăng nhập');
      }
      throw new Error('Hệ thống đang gặp sự cố. Vui lòng thử lại sau.');
    }
  },

  adminLogout: async () => {
    try {
      const token = localStorage.getItem('admin_token');

      // Gọi API logout nếu có token
      if (token) {
        await api.post('/auth/admin/logout', null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Luôn xóa token kể cả khi không có token
      localStorage.removeItem('admin_token');
    } catch (error) {
      console.error('Admin logout error:', error);
      // Vẫn xóa token ngay cả khi API call thất bại
      localStorage.removeItem('admin_token');
      throw error;
    }
  },

  checkSecretCode: async (code) => {
    const response = await api.get(`/auth/secret-codes/check/${code}`);
    return response.data;
  },
};
