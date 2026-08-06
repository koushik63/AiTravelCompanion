import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
        title="Dark Mode"
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-lg transition-colors ${theme === 'light' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
        title="Light Mode"
      >
        <Sun className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-lg transition-colors ${theme === 'system' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
        title="System Preference"
      >
        <Laptop className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
