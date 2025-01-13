import api from './axios';

export const authApi = {
  login: (credentials) => api.post('/auth/customer/auth', credentials),
  register: (userData) => api.post('/customers/register', userData),
  logout: () => api.post('/auth/customer/logout'),
  adminLogin: (credentials) => api.post('/auth/admin/login', credentials),
  adminLogout: () => api.post('/auth/admin/logout'),
  checkSecretCode: (code) => api.get(`/auth/secret-codes/check/${code}`),
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
