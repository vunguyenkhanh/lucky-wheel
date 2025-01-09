import api from './axios';

export const secretCodeApi = {
  getSecretCodes: (params) => api.get('/admin/secret-codes', { params }),
  generateCodes: (data) => api.post('/admin/secret-codes/generate', data),
  deactivateCode: (id) => api.put(`/admin/secret-codes/${id}/deactivate`),
  getAnalytics: (dateRange) => api.get('/admin/analytics', { params: dateRange }),
};
