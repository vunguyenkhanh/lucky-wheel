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
      token: null,

      // Admin actions
      adminLogin: async (credentials, showToast) => {
        set({ loading: true, error: null });
        try {
          const { token, message, user } = await authService.adminLogin(credentials);
          localStorage.setItem('token', token);
          set({
            isAdmin: true,
            isAuthenticated: true,
            loading: false,
            token: token,
            user: user,
            error: null,
          });
          showToast(message, 'success');
          return { success: true };
        } catch (error) {
          set({
            error: error.message,
            loading: false,
            isAdmin: false,
            isAuthenticated: false,
            user: null,
          });
          showToast(error.message, 'error');
          throw error;
        }
      },

      adminLogout: async (showToast) => {
        try {
          await authService.adminLogout();
          set({
            isAuthenticated: false,
            isAdmin: false,
            user: null,
            error: null,
            token: null,
          });
          showToast('Đăng xuất thành công', 'success');
        } catch (error) {
          console.error('Admin logout error:', error);
          showToast('Đã có lỗi xảy ra khi đăng xuất', 'error');
          set({
            isAuthenticated: false,
            isAdmin: false,
            user: null,
            error: null,
            token: null,
          });
          throw error;
        }
      },

      // Actions
      login: async (credentials, showToast) => {
        set({ loading: true, error: null });
        try {
          const { user, token } = await authService.login(credentials);
          set({ isAuthenticated: true, user, loading: false });
          localStorage.setItem('token', token);
          showToast('Đăng nhập thành công', 'success');
        } catch (error) {
          const message = error.response?.data?.error || 'Đăng nhập thất bại';
          set({ error: message, loading: false });
          showToast(message, 'error');
          throw error;
        }
      },

      register: async (userData, showToast) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.register(userData);
          set({ loading: false });
          showToast('Đăng ký thành công', 'success');
          return data;
        } catch (error) {
          const message = error.response?.data?.error || 'Đăng ký thất bại';
          set({ error: message, loading: false });
          showToast(message, 'error');
          throw error;
        }
      },

      logout: async (showToast) => {
        try {
          await authService.logout();
          showToast('Đăng xuất thành công', 'success');
        } catch (error) {
          console.error('Logout error:', error);
          showToast('Đã có lỗi xảy ra khi đăng xuất', 'error');
        } finally {
          localStorage.removeItem('token');
          set({
            isAuthenticated: false,
            user: null,
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

      setLoading: (state) => set({ loading: state }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        token: state.token,
      }),
    },
  ),
);
