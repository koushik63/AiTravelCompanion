import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem('aitravel_theme') as ThemeMode;
  if (saved && ['dark', 'light', 'system'].includes(saved)) {
    return saved;
  }
  return 'dark';
};

const applyThemeToDOM = (theme: ThemeMode) => {
  const root = document.documentElement;
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme: ThemeMode) => {
    localStorage.setItem('aitravel_theme', theme);
    applyThemeToDOM(theme);
    set({ theme });
  }
}));

// Apply on startup
applyThemeToDOM(getInitialTheme());
