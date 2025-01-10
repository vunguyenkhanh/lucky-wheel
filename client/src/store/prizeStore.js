import { create } from 'zustand';
import { prizeService } from '../services/prizeService';

export const usePrizeStore = create((set) => ({
  prizes: [],
  loading: false,
  error: null,

  // Fetch prizes
  fetchPrizes: async () => {
    set({ loading: true });
    try {
      const data = await prizeService.getPrizes();
      set({ prizes: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Fetch prizes error:', error);
    }
  },

  // Add prize
  addPrize: async (prizeData) => {
    set({ loading: true });
    try {
      const newPrize = await prizeService.createPrize(prizeData);
      set((state) => ({
        prizes: [...state.prizes, newPrize],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update prize
  updatePrize: async (id, prizeData) => {
    set({ loading: true });
    try {
      const updatedPrize = await prizeService.updatePrize(id, prizeData);
      set((state) => ({
        prizes: state.prizes.map((p) => (p.id === id ? updatedPrize : p)),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Delete prize
  deletePrize: async (id) => {
    set({ loading: true });
    try {
      await prizeService.deletePrize(id);
      set((state) => ({
        prizes: state.prizes.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));
