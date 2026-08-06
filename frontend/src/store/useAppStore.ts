import { create } from 'zustand';

interface AppState {
  isOnline: boolean;
  appVersion: string;
  setOnlineStatus: (status: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isOnline: navigator.onLine,
  appVersion: '1.0.0',
  setOnlineStatus: (status: boolean) => set({ isOnline: status })
}));

window.addEventListener('online', () => useAppStore.getState().setOnlineStatus(true));
window.addEventListener('offline', () => useAppStore.getState().setOnlineStatus(false));
