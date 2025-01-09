import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear local auth state
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('isAdmin');
    }
    return Promise.reject(error);
  },
);

export default api;
