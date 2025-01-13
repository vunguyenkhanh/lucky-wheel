import api from './axios';

export const adminService = {
  // Get all admins
  getAdmins: () => api.get('/admin/admins'),

  // Create new admin
  createAdmin: (data) => api.post('/admin/admins', data),

  // Update admin
  updateAdmin: (id, data) => api.put(`/admin/admins/${id}`, data),

  // Delete admin
  deleteAdmin: (id) => api.delete(`/admin/admins/${id}`),
};
