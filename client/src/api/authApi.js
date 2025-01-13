import api from './axios';

export const authApi = {
  login: (credentials) => api.post('/auth/customer/auth', credentials),
  register: (userData) => api.post('/customers/register', userData),
  logout: () => api.post('/auth/customer/logout'),
  adminLogin: (credentials) => api.post('/auth/admin/login', credentials),
  adminLogout: () => api.post('/auth/admin/logout'),
  checkSecretCode: (code) => api.get(`/auth/secret-codes/check/${code}`),
  customerRegister: async (data) => {
    try {
      const response = await api.post('/auth/customer/register', data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.');
    }
  },
  customerAuth: async (credentials) => {
    try {
      const response = await api.post('/auth/customer/auth', credentials);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.');
    }
  },
  customerLogout: async () => {
    try {
      await api.post('/auth/customer/logout');
    } catch (error) {
      console.error('Customer logout error:', error);
      throw error;
    }
  },
};

export const loginAdmin = async (username, password) => {
  try {
    const response = await api.post('/auth/admin/login', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác');
    }
    throw new Error('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.');
  }
};
