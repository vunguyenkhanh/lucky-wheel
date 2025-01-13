import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/authApi';
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
          localStorage.setItem('admin_token', token);
          set({
            isAdmin: true,
            isAuthenticated: true,
            loading: false,
            token: token,
            user: { ...user, role: 'admin' },
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
            token: null,
          });
          showToast(error.message, 'error');
          throw error;
        }
      },

      // Customer actions
      customerLogin: async (credentials, showToast) => {
        set({ loading: true, error: null });
        try {
          const { message, user } = await authApi.customerAuth(credentials);
          set({
            isAuthenticated: true,
            isAdmin: false,
            user: { ...user, role: 'customer' },
            loading: false,
            error: null,
          });
          showToast(message, 'success');
          return { success: true };
        } catch (error) {
          set({
            error: error.message,
            loading: false,
            isAuthenticated: false,
            user: null,
          });
          showToast(error.message, 'error');
          throw error;
        }
      },

      customerRegister: async (data, showToast) => {
        set({ loading: true, error: null });
        try {
          const { message } = await authApi.customerRegister(data);
          set({ loading: false });
          showToast(message, 'success');
          return { success: true };
        } catch (error) {
          set({
            error: error.message,
            loading: false,
          });
          showToast(error.message, 'error');
          throw error;
        }
      },

      // Reset state
      reset: () => {
        localStorage.removeItem('admin_token');
        set({
          isAuthenticated: false,
          isAdmin: false,
          user: null,
          loading: false,
          error: null,
          token: null,
        });
      },

      // Logout actions
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
          set({
            isAuthenticated: false,
            isAdmin: false,
            user: null,
            error: null,
            token: null,
          });
          if (error.message !== 'Không tìm thấy token') {
            showToast('Đã có lỗi xảy ra khi đăng xuất', 'error');
          }
        }
      },

      customerLogout: async (showToast) => {
        try {
          await authService.customerLogout();
          set({
            isAuthenticated: false,
            isAdmin: false,
            user: null,
            error: null,
          });
          showToast('Đăng xuất thành công', 'success');
        } catch (error) {
          console.error('Customer logout error:', error);
          showToast('Đã có lỗi xảy ra khi đăng xuất', 'error');
          set({
            isAuthenticated: false,
            isAdmin: false,
            user: null,
            error: null,
          });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        token: state.token,
        user: state.user ? { ...state.user, role: state.user.role } : null,
      }),
    },
  ),
);
