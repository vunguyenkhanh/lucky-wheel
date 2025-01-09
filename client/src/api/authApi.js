import api from './axios';

export const authApi = {
  login: (credentials) => api.post('/auth/customer/auth', credentials),
  register: (userData) => api.post('/customers/register', userData),
  logout: () => api.post('/auth/customer/logout'),
  adminLogin: (credentials) => api.post('/auth/admin/login', credentials),
  adminLogout: () => api.post('/auth/admin/logout'),
  checkSecretCode: (code) => api.get(`/auth/secret-codes/check/${code}`),
};
