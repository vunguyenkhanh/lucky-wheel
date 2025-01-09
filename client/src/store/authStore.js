import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/authApi';

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
          const response = await authApi.login(credentials);
          set({ isAuthenticated: true, user: response.data.user, loading: false });
        } catch (error) {
          set({ error: error.response?.data?.error || 'Đăng nhập thất bại', loading: false });
          throw error;
        }
      },

      adminLogin: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await authApi.adminLogin(credentials);
          set({ isAdmin: true, loading: false });
        } catch (error) {
          set({ error: error.response?.data?.error || 'Đăng nhập thất bại', loading: false });
          throw error;
        }
      },

      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await authApi.register(userData);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ error: error.response?.data?.error || 'Đăng ký thất bại', loading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
          set({ isAuthenticated: false, user: null });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      adminLogout: async () => {
        try {
          await authApi.adminLogout();
          set({ isAdmin: false });
        } catch (error) {
          console.error('Admin logout error:', error);
        }
      },

      // Reset state
      reset: () => {
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
