import { create } from 'zustand';
import * as prizeApi from '../api/prizeApi';

export const useAdminStore = create((set) => ({
  prizes: [],
  loading: false,

  // Load prizes
  loadPrizes: async () => {
    try {
      set({ loading: true });
      const data = await prizeApi.getPrizes();
      set({ prizes: data });
    } catch (error) {
      console.error('Load prizes error:', error);
    } finally {
      set({ loading: false });
    }
  },

  // Create prize
  createPrize: async (data) => {
    try {
      const newPrize = await prizeApi.createPrize(data);
      set((state) => ({ prizes: [newPrize, ...state.prizes] }));
      return newPrize;
    } catch (error) {
      console.error('Create prize error:', error);
      throw error;
    }
  },

  // Update prize
  updatePrize: async (id, data) => {
    try {
      const updatedPrize = await prizeApi.updatePrize(id, data);
      set((state) => ({
        prizes: state.prizes.map((p) => (p.id === id ? updatedPrize : p)),
      }));
      return updatedPrize;
    } catch (error) {
      console.error('Update prize error:', error);
      throw error;
    }
  },

  // Delete prize
  deletePrize: async (id) => {
    try {
      await prizeApi.deletePrize(id);
      set((state) => ({
        prizes: state.prizes.filter((p) => p.id !== id),
      }));
    } catch (error) {
      console.error('Delete prize error:', error);
      throw error;
    }
  },
}));
