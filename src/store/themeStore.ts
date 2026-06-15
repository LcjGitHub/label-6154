import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ColorScheme = 'light' | 'dark';

interface ThemeState {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      colorScheme: 'light',

      setColorScheme: (scheme) => {
        set({ colorScheme: scheme });
      },

      toggleColorScheme: () => {
        set({ colorScheme: get().colorScheme === 'light' ? 'dark' : 'light' });
      },
    }),
    {
      name: 'fragrance-theme-storage',
    },
  ),
);
