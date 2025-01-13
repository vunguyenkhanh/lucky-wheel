import api from './axios';

export const secretCodeApi = {
  // Lấy danh sách mã bí mật
  getSecretCodes: async () => {
    try {
      const response = await api.get('/admin/secret-codes');
      return response.data;
    } catch (error) {
      throw new Error('Có lỗi xảy ra khi lấy danh sách mã bí mật');
    }
  },

  // Tạo mã bí mật mới
  createSecretCode: async (data) => {
    try {
      const response = await api.post('/admin/secret-codes', data);
      return response.data;
    } catch (error) {
      throw new Error('Có lỗi xảy ra khi tạo mã bí mật');
    }
  },

  // Cập nhật mã bí mật
  updateSecretCode: async (id, data) => {
    try {
      const response = await api.put(`/admin/secret-codes/${id}`, data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data.error);
      }
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy mã bí mật');
      }
      throw new Error('Có lỗi xảy ra khi cập nhật mã bí mật');
    }
  },

  // Xóa mã bí mật
  deleteSecretCode: async (id) => {
    try {
      const response = await api.delete(`/admin/secret-codes/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error('Không thể xóa mã đã được sử dụng');
      }
      throw new Error('Có lỗi xảy ra khi xóa mã bí mật');
    }
  },
};
