import { create } from 'zustand';
import { prizeApi } from '../api/prizeApi';

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
  fetchPrizes: async () => {
    try {
      get().setPrizeLoading(true);
      const response = await prizeApi.getPrizes();
      set({ prizes: response.data, error: null });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch prizes' });
    } finally {
      get().setPrizeLoading(false);
    }
  },

  // Create prize with loading state
  createPrize: async (data) => {
    try {
      get().setActionLoading(true);
      const response = await prizeApi.createPrize(data);
      set((state) => ({
        prizes: [...state.prizes, response.data],
        error: null,
      }));
    } catch (error) {
      throw error;
    } finally {
      get().setActionLoading(false);
    }
  },

  // Similar pattern for other actions...
}));
