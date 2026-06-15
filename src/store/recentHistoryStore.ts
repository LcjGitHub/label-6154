import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Fragrance } from '../types';

export interface RecentHistoryItem {
  fragrance: Fragrance;
  viewedAt: string;
}

interface RecentHistoryState {
  history: RecentHistoryItem[];
  addToHistory: (fragrance: Fragrance) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

const MAX_HISTORY_ITEMS = 5;

export const useRecentHistoryStore = create<RecentHistoryState>()(
  persist(
    (set) => ({
      history: [],

      addToHistory: (fragrance) => {
        set((state) => {
          const filtered = state.history.filter((item) => item.fragrance.id !== fragrance.id);
          const newItem: RecentHistoryItem = {
            fragrance,
            viewedAt: new Date().toISOString(),
          };
          const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
          return { history: updated };
        });
      },

      removeFromHistory: (id) => {
        set((state) => ({
          history: state.history.filter((item) => item.fragrance.id !== id),
        }));
      },

      clearHistory: () => {
        set({ history: [] });
      },
    }),
    {
      name: 'fragrance-recent-history-storage',
    },
  ),
);
