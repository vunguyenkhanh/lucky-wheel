import api from './axios';

export const getAdmins = async () => {
  try {
    const response = await api.get('/admin');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Lỗi khi lấy danh sách admin');
  }
};

export const createAdmin = async (data) => {
  try {
    const response = await api.post('/admin', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Lỗi khi tạo admin');
  }
};

export const updateAdmin = async (id, data) => {
  try {
    const response = await api.put(`/admin/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Lỗi khi cập nhật admin');
  }
};

export const deleteAdmin = async (id) => {
  try {
    const response = await api.delete(`/admin/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Lỗi khi xóa admin');
  }
};
