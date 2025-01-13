import { create } from 'zustand';
import { prizeApi } from '../api/prizeApi';
import { adminService } from '../services/adminService';

export const useAdminStore = create((set, get) => ({
  // State
  prizes: [],
  secretCodes: [],
  analytics: null,
  loading: {
    prizes: false,
    secretCodes: false,
    analytics: false,
    action: false,
  },
  error: null,
  admins: [],

  // Actions
  setPrizeLoading: (loading) =>
    set((state) => ({
      loading: { ...state.loading, prizes: loading },
    })),

  setSecretCodeLoading: (loading) =>
    set((state) => ({
      loading: { ...state.loading, secretCodes: loading },
    })),

  setAnalyticsLoading: (loading) =>
    set((state) => ({
      loading: { ...state.loading, analytics: loading },
    })),

  setActionLoading: (loading) =>
    set((state) => ({
      loading: { ...state.loading, action: loading },
    })),

  // Fetch prizes with loading state
  fetchPrizes: async (showToast) => {
    try {
      get().setPrizeLoading(true);
      const response = await prizeApi.getPrizes();
      set({ prizes: response.data, error: null });
      showToast?.('Tải danh sách giải thưởng thành công', 'success');
    } catch (error) {
      const message = error.response?.data?.error || 'Lỗi tải giải thưởng';
      set({ error: message });
      showToast?.(message, 'error');
    } finally {
      get().setPrizeLoading(false);
    }
  },

  // Create prize with loading state
  createPrize: async (data, showToast) => {
    try {
      get().setActionLoading(true);
      const response = await prizeApi.createPrize(data);
      set((state) => ({
        prizes: [...state.prizes, response.data],
        error: null,
      }));
      showToast?.('Tạo giải thưởng thành công', 'success');
    } catch (error) {
      const message = error.response?.data?.error || 'Lỗi tạo giải thưởng';
      set({ error: message });
      showToast?.(message, 'error');
      throw error;
    } finally {
      get().setActionLoading(false);
    }
  },

  // Admin management
  fetchAdmins: async (showToast) => {
    set({ loading: true });
    try {
      const response = await adminService.getAdmins();
      set({ admins: response.data, loading: false });
    } catch (error) {
      const message = error.response?.data?.error || 'Lỗi tải danh sách admin';
      set({ error: message, loading: false });
      showToast?.(message, 'error');
      throw error;
    }
  },

  createAdmin: async (data, showToast) => {
    set({ loading: true });
    try {
      const response = await adminService.createAdmin(data);
      set((state) => ({
        admins: [...state.admins, response.data],
        loading: false,
      }));
      showToast?.('Tạo admin thành công', 'success');
    } catch (error) {
      const message = error.response?.data?.error || 'Lỗi tạo admin';
      set({ error: message, loading: false });
      showToast?.(message, 'error');
      throw error;
    }
  },

  updateAdmin: async (id, data, showToast) => {
    set({ loading: true });
    try {
      const response = await adminService.updateAdmin(id, data);
      set((state) => ({
        admins: state.admins.map((admin) => (admin.id === id ? response.data : admin)),
        loading: false,
      }));
      showToast?.('Cập nhật admin thành công', 'success');
    } catch (error) {
      const message = error.response?.data?.error || 'Lỗi cập nhật admin';
      set({ error: message, loading: false });
      showToast?.(message, 'error');
      throw error;
    }
  },

  deleteAdmin: async (id, showToast) => {
    set({ loading: true });
    try {
      await adminService.deleteAdmin(id);
      set((state) => ({
        admins: state.admins.filter((admin) => admin.id !== id),
        loading: false,
      }));
      showToast?.('Xóa admin thành công', 'success');
    } catch (error) {
      const message = error.response?.data?.error || 'Lỗi xóa admin';
      set({ error: message, loading: false });
      showToast?.(message, 'error');
      throw error;
    }
  },

  updatePrize: async (id, data, showToast) => {
    try {
      get().setActionLoading(true);
      const response = await prizeApi.updatePrize(id, data);
      set((state) => ({
        prizes: state.prizes.map((prize) => (prize.id === id ? response.data : prize)),
        error: null,
      }));
      showToast?.('Cập nhật giải thưởng thành công', 'success');
    } catch (error) {
      const message = error.response?.data?.error || 'Lỗi cập nhật giải thưởng';
      set({ error: message });
      showToast?.(message, 'error');
      throw error;
    } finally {
      get().setActionLoading(false);
    }
  },

  deletePrize: async (id, showToast) => {
    try {
      get().setActionLoading(true);
      await prizeApi.deletePrize(id);
      set((state) => ({
        prizes: state.prizes.filter((prize) => prize.id !== id),
        error: null,
      }));
      showToast?.('Xóa giải thưởng thành công', 'success');
    } catch (error) {
      const message = error.response?.data?.error || 'Lỗi xóa giải thưởng';
      set({ error: message });
      showToast?.(message, 'error');
      throw error;
    } finally {
      get().setActionLoading(false);
    }
  },
}));
