import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Fragrance } from '../types';

const MAX_COMPARISON = 3;

interface ComparisonState {
  comparisonList: Fragrance[];
  addToComparison: (fragrance: Fragrance) => boolean;
  removeFromComparison: (id: string) => void;
  isInComparison: (id: string) => boolean;
  clearComparison: () => void;
  canAddMore: () => boolean;
}

/**
 * 对比列表 Zustand store，localStorage 持久化，最多同时对比 3 款
 */
export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      comparisonList: [],

      addToComparison: (fragrance) => {
        const currentList = get().comparisonList;
        if (currentList.some((f) => f.id === fragrance.id)) {
          return false;
        }
        if (currentList.length >= MAX_COMPARISON) {
          return false;
        }
        set({ comparisonList: [...currentList, fragrance] });
        return true;
      },

      removeFromComparison: (id) => {
        set((state) => ({
          comparisonList: state.comparisonList.filter((f) => f.id !== id),
        }));
      },

      isInComparison: (id) => {
        return get().comparisonList.some((f) => f.id === id);
      },

      clearComparison: () => {
        set({ comparisonList: [] });
      },

      canAddMore: () => {
        return get().comparisonList.length < MAX_COMPARISON;
      },
    }),
    {
      name: 'fragrance-comparison-storage',
    },
  ),
);
