import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Fragrance } from '../types';

interface FavoritesState {
  favorites: Fragrance[];
  toggleFavorite: (fragrance: Fragrance) => void;
  isFavorite: (id: string) => boolean;
  removeFavorite: (id: string) => void;
}

/**
 * 收藏夹 Zustand store，localStorage 持久化
 */
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (fragrance) => {
        set((state) => {
          const exists = state.favorites.some((f) => f.id === fragrance.id);
          if (exists) {
            return {
              favorites: state.favorites.filter((f) => f.id !== fragrance.id),
            };
          } else {
            return {
              favorites: [...state.favorites, fragrance],
            };
          }
        });
      },

      isFavorite: (id) => {
        return get().favorites.some((f) => f.id === id);
      },

      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        }));
      },
    }),
    {
      name: 'fragrance-favorites-storage',
    }
  )
);
