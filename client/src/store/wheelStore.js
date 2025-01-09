import { create } from 'zustand';
import { wheelService } from '../services';

export const useWheelStore = create((set) => ({
  // State
  spinning: false,
  result: null,
  history: [],
  loading: false,
  error: null,

  // Actions
  spin: async () => {
    set({ spinning: true, error: null });
    try {
      const result = await wheelService.spin();
      set({ result, spinning: false });
      return result;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Lỗi quay thưởng', spinning: false });
      throw error;
    }
  },

  fetchHistory: async () => {
    set({ loading: true, error: null });
    try {
      const { history } = await wheelService.getSpinHistory();
      set({ history, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Lỗi tải lịch sử', loading: false });
      throw error;
    }
  },

  checkEligibility: async () => {
    set({ loading: true, error: null });
    try {
      const { canSpin } = await wheelService.checkSpinEligibility();
      set({ loading: false });
      return canSpin;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Lỗi kiểm tra điều kiện', loading: false });
      throw error;
    }
  },

  reset: () => {
    set({
      spinning: false,
      result: null,
      history: [],
      loading: false,
      error: null,
    });
  },
}));
