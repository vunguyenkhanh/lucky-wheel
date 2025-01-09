import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services';

export const useAuthStore = create(
  persist(
    (set) => ({
      // State
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      loading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const { user, token } = await authService.login(credentials);
          set({ isAuthenticated: true, user, loading: false });
          localStorage.setItem('token', token);
        } catch (error) {
          set({ error: error.response?.data?.error || 'Đăng nhập thất bại', loading: false });
          throw error;
        }
      },

      adminLogin: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const { token } = await authService.adminLogin(credentials);
          set({ isAdmin: true, loading: false });
          localStorage.setItem('token', token);
        } catch (error) {
          set({ error: error.response?.data?.error || 'Đăng nhập thất bại', loading: false });
          throw error;
        }
      },

      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.register(userData);
          set({ loading: false });
          return data;
        } catch (error) {
          set({ error: error.response?.data?.error || 'Đăng ký thất bại', loading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          // Gọi API logout để clear session/token ở server
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear local storage và state
          localStorage.removeItem('token');
          set({
            isAuthenticated: false,
            user: null,
            error: null,
          });
        }
      },

      adminLogout: async () => {
        try {
          await authService.adminLogout();
        } catch (error) {
          console.error('Admin logout error:', error);
        } finally {
          localStorage.removeItem('token');
          set({
            isAdmin: false,
            error: null,
          });
        }
      },

      reset: () => {
        localStorage.removeItem('token');
        set({
          isAuthenticated: false,
          isAdmin: false,
          user: null,
          loading: false,
          error: null,
        });
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);
