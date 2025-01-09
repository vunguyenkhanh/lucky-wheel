import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useStore = create(
  devtools(
    persist(
      (set) => ({
        // State và actions như cũ
      }),
      {
        name: 'app-storage',
      },
    ),
  ),
);
