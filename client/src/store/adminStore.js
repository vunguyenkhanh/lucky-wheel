import { create } from 'zustand';
import { prizeApi } from '../api/prizeApi';
import { secretCodeApi } from '../api/secretCodeApi';

export const useAdminStore = create((set, get) => ({
  // State
  prizes: [],
  secretCodes: [],
  analytics: null,
  loading: false,
  error: null,

  // Prize Actions
  fetchPrizes: async () => {
    set({ loading: true });
    try {
      const response = await prizeApi.getPrizes();
      set({ prizes: response.data.prizes, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Lỗi lấy danh sách giải thưởng',
        loading: false,
      });
    }
  },

  createPrize: async (prizeData) => {
    set({ loading: true });
    try {
      const response = await prizeApi.createPrize(prizeData);
      set((state) => ({
        prizes: [...state.prizes, response.data.prize],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.response?.data?.error || 'Lỗi tạo giải thưởng', loading: false });
      throw error;
    }
  },

  updatePrize: async (id, prizeData) => {
    set({ loading: true });
    try {
      const response = await prizeApi.updatePrize(id, prizeData);
      set((state) => ({
        prizes: state.prizes.map((prize) => (prize.id === id ? response.data.prize : prize)),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.response?.data?.error || 'Lỗi cập nhật giải thưởng', loading: false });
      throw error;
    }
  },

  deletePrize: async (id) => {
    set({ loading: true });
    try {
      await prizeApi.deletePrize(id);
      set((state) => ({
        prizes: state.prizes.filter((prize) => prize.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.response?.data?.error || 'Lỗi xóa giải thưởng', loading: false });
      throw error;
    }
  },

  // Secret Code Actions
  fetchSecretCodes: async (params) => {
    set({ loading: true });
    try {
      const response = await secretCodeApi.getSecretCodes(params);
      set({ secretCodes: response.data.secretCodes, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Lỗi lấy danh sách mã', loading: false });
    }
  },

  generateSecretCodes: async (data) => {
    set({ loading: true });
    try {
      const response = await secretCodeApi.generateCodes(data);
      set((state) => ({
        secretCodes: [...response.data.secretCodes, ...state.secretCodes],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.response?.data?.error || 'Lỗi tạo mã', loading: false });
      throw error;
    }
  },

  deactivateSecretCode: async (id) => {
    set({ loading: true });
    try {
      await secretCodeApi.deactivateCode(id);
      set((state) => ({
        secretCodes: state.secretCodes.map((code) =>
          code.id === id ? { ...code, status: 'Hết hạn' } : code,
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.response?.data?.error || 'Lỗi vô hiệu hóa mã', loading: false });
      throw error;
    }
  },

  // Analytics Actions
  fetchAnalytics: async (dateRange) => {
    set({ loading: true });
    try {
      const response = await secretCodeApi.getAnalytics(dateRange);
      set({ analytics: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Lỗi lấy thống kê', loading: false });
    }
  },

  // Reset state
  reset: () => {
    set({
      prizes: [],
      secretCodes: [],
      analytics: null,
      loading: false,
      error: null,
    });
  },
}));
