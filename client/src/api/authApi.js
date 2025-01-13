import api from './axios';

export const authApi = {
  login: (credentials) => api.post('/auth/customer/auth', credentials),
  register: (userData) => api.post('/customers/register', userData),
  logout: () => api.post('/auth/customer/logout'),
  adminLogin: async (credentials) => {
    try {
      const response = await api.post('/auth/admin/login', credentials);
      if (response.data.token) {
        localStorage.setItem('admin_token', response.data.token);
      }
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error('Vui lòng nhập đầy đủ thông tin đăng nhập');
      }
      if (error.response?.status === 401) {
        if (error.response.data?.error) {
          throw new Error(error.response.data.error);
        }
        throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác');
      }
      throw new Error('Hệ thống đang gặp sự cố. Vui lòng thử lại sau.');
    }
  },
  adminLogout: async () => {
    try {
      const token = localStorage.getItem('admin_token');
      await api.post('/auth/admin/logout', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem('admin_token');
    } catch (error) {
      console.error('Admin logout error:', error);
      localStorage.removeItem('admin_token');
      throw error;
    }
  },
  checkSecretCode: (code) => api.get(`/auth/secret-codes/check/${code}`),
  customerRegister: async (data) => {
    try {
      console.log('Sending register request:', data); // Debug log
      const response = await api.post('/auth/customer/register', data);
      return response.data;
    } catch (error) {
      console.error('Register API error:', error);
      if (error.response?.status === 400) {
        throw new Error(error.response.data.error);
      }
      if (error.response?.data?.error) {
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
      if (error.response?.status === 400) {
        throw new Error('Vui lòng nhập đầy đủ số điện thoại và mã bí mật');
      }
      if (error.response?.status === 401) {
        if (error.response.data?.error) {
          throw new Error(error.response.data.error);
        }
        throw new Error('Số điện thoại hoặc mã bí mật không chính xác');
      }
      throw new Error('Hệ thống đang gặp sự cố. Vui lòng thử lại sau.');
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
