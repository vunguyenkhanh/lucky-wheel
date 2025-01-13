import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi chung
    if (error.response?.status === 401) {
      // Xử lý lỗi unauthorized
      console.log('Unauthorized, redirecting to login...');
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
