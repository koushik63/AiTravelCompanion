import { create } from 'zustand';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface UIState {
  isModalOpen: boolean;
  isDrawerOpen: boolean;
  isSidebarOpen: boolean;
  toasts: Toast[];
  setModalOpen: (isOpen: boolean) => void;
  setDrawerOpen: (isOpen: boolean) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  isDrawerOpen: false,
  isSidebarOpen: false,
  toasts: [],

  setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  addToast: (toast) => {
    const id = Date.now().toString();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },

  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
}));
