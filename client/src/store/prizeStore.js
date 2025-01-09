import { create } from 'zustand';
import { prizeService } from '../services';

export const usePrizeStore = create((set, get) => ({
  // State
  prizes: [],
  currentPrize: null,
  loading: false,
  error: null,

  // Actions
  fetchPrizes: async () => {
    set({ loading: true, error: null });
    try {
      const { prizes } = await prizeService.getPrizes();
      set({ prizes, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Lỗi tải giải thưởng', loading: false });
      throw error;
    }
  },

  createPrize: async (data) => {
    set({ loading: true, error: null });
    try {
      const { prize } = await prizeService.createPrize(data);
      set((state) => ({
        prizes: [...state.prizes, prize],
        loading: false,
      }));
      return prize;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Lỗi tạo giải thưởng', loading: false });
      throw error;
    }
  },

  updatePrize: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const { prize } = await prizeService.updatePrize(id, data);
      set((state) => ({
        prizes: state.prizes.map((p) => (p.id === id ? prize : p)),
        loading: false,
      }));
      return prize;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Lỗi cập nhật giải thưởng', loading: false });
      throw error;
    }
  },

  deletePrize: async (id) => {
    set({ loading: true, error: null });
    try {
      await prizeService.deletePrize(id);
      set((state) => ({
        prizes: state.prizes.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.response?.data?.error || 'Lỗi xóa giải thưởng', loading: false });
      throw error;
    }
  },

  uploadImage: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { url } = await prizeService.uploadImage(formData);
      set({ loading: false });
      return url;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Lỗi upload hình ảnh', loading: false });
      throw error;
    }
  },

  reset: () => {
    set({
      prizes: [],
      currentPrize: null,
      loading: false,
      error: null,
    });
  },
}));
