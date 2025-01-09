import { create } from 'zustand';
import { wheelApi } from '../api/wheelApi';

export const useWheelStore = create((set) => ({
  // State
  prizes: [],
  spinResult: null,
  spinning: false,
  loading: false,
  error: null,

  // Actions
  fetchPrizes: async () => {
    set({ loading: true });
    try {
      const response = await wheelApi.getPrizes();
      set({ prizes: response.data.prizes, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Lỗi lấy danh sách giải thưởng',
        loading: false,
      });
    }
  },

  spin: async () => {
    set({ spinning: true, error: null });
    try {
      const response = await wheelApi.spin();
      set({ spinResult: response.data.prize, spinning: false });
      return response.data.prize;
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Lỗi quay thưởng',
        spinning: false,
      });
      throw error;
    }
  },

  resetSpin: () => {
    set({ spinResult: null, error: null });
  },

  // Reset state
  reset: () => {
    set({
      prizes: [],
      spinResult: null,
      spinning: false,
      loading: false,
      error: null,
    });
  },
}));
