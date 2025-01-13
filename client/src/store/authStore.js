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
      token: null,

      // Admin actions
      adminLogin: async (credentials, showToast) => {
        set({ loading: true, error: null });
        try {
          const { token, message, user } = await authApi.adminLogin(credentials);

          // Reset customer state trước khi set admin state
          set({
            isAuthenticated: false,
            isAdmin: false,
            user: null,
          });

          // Set admin state
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

          // Reset admin state trước khi set customer state
          set({
            isAdmin: false,
            token: null,
          });

          // Set customer state
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

      // Reset state
      reset: () => {
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
          await authApi.adminLogout();
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
        }
      },

      customerLogout: async (showToast) => {
        try {
          await authApi.customerLogout();
          set({
            isAuthenticated: false,
            isAdmin: false,
            user: null,
            error: null,
          });
          showToast('Đăng xuất thành công', 'success');
        } catch (error) {
          console.error('Customer logout error:', error);
          set({
            isAuthenticated: false,
            isAdmin: false,
            user: null,
            error: null,
          });
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
