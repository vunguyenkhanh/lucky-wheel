import api from '../config/api';

export const adminService = {
  // Secret Code Management
  generateSecretCodes: async (data) => {
    const response = await api.post('/admin/secret-codes', data);
    return response.data;
  },

  getSecretCodes: async (params) => {
    const response = await api.get('/admin/secret-codes', { params });
    return response.data;
  },

  deactivateSecretCode: async (id) => {
    const response = await api.put(`/admin/secret-codes/${id}/deactivate`);
    return response.data;
  },

  // Analytics & Reports
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  getSpinResults: async (params) => {
    const response = await api.get('/admin/spin-results', { params });
    return response.data;
  },

  getCustomerList: async (params) => {
    const response = await api.get('/admin/customers', { params });
    return response.data;
  },

  exportData: async (type, params) => {
    const response = await api.get(`/admin/export/${type}`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
