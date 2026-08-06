import { create } from 'zustand';
import { Trip, PackingItem, Expense, Memory, NotificationItem } from '../types';
import { TripService, ExpenseService, MemoryService, AdminService } from '../services/api';

interface TravelState {
  trips: Trip[];
  activeTrip: Trip | null;
  notifications: NotificationItem[];
  isLoading: boolean;
  error: string | null;

  fetchTrips: () => Promise<void>;
  clearTrips: () => void;
  addTrip: (tripData: Partial<Trip>) => Promise<void>;
  updateTrip: (id: string, tripData: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  archiveTrip: (id: string) => Promise<void>;
  restoreTrip: (id: string) => Promise<void>;
  duplicateTrip: (id: string) => Promise<void>;
  toggleFavoriteTrip: (id: string) => Promise<void>;

  togglePackingItem: (tripId: string, itemId: string) => Promise<void>;
  addPackingItem: (tripId: string, itemName: string, category?: string) => Promise<void>;

  addExpense: (expenseData: { tripId: string; category: string; amount: number; description: string; currency?: string }) => Promise<void>;
  deleteExpense: (tripId: string, expenseId: string) => Promise<void>;

  addMemory: (memoryData: { tripId: string; imageUrl: string; caption?: string; location?: string }) => Promise<void>;

  setActiveTrip: (id: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
}

export const useTravelStore = create<TravelState>((set, get) => ({
  // Start with empty state — data loads after authentication
  trips: [],
  activeTrip: null,
  notifications: [],
  isLoading: false,
  error: null,

  fetchTrips: async () => {
    set({ isLoading: true });
    try {
      const trips = await TripService.getTrips();
      const active = trips.find((t) => t.status === 'ACTIVE') || trips[0] || null;
      set({ trips, activeTrip: active, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  // Clears all trip data on logout so next user starts fresh
  clearTrips: () => {
    set({ trips: [], activeTrip: null, notifications: [], error: null });
  },

  addTrip: async (tripData) => {
    try {
      const newTrip = await TripService.createTrip(tripData);
      set((state) => ({ trips: [newTrip, ...state.trips] }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateTrip: async (id, tripData) => {
    try {
      await TripService.getTripById(id);
      set((state) => ({
        trips: state.trips.map((t) => (t.id === id ? { ...t, ...tripData } : t))
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteTrip: async (id) => {
    try {
      await TripService.deleteTrip(id);
      set((state) => ({ trips: state.trips.filter((t) => t.id !== id) }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  archiveTrip: async (id) => {
    set((state) => ({
      trips: state.trips.map((t) => (t.id === id ? { ...t, isArchived: !t.isArchived, status: t.isArchived ? 'UPCOMING' : 'ARCHIVED' } : t))
    }));
  },

  restoreTrip: async (id) => {
    set((state) => ({
      trips: state.trips.map((t) => (t.id === id ? { ...t, isArchived: false, status: 'UPCOMING' } : t))
    }));
  },

  duplicateTrip: async (id) => {
    const target = get().trips.find((t) => t.id === id);
    if (!target) return;
    const duplicated: Trip = {
      ...target,
      id: `trip_${Date.now()}`,
      title: `${target.title} (Copy)`,
      status: 'UPCOMING'
    };
    set((state) => ({ trips: [duplicated, ...state.trips] }));
  },

  toggleFavoriteTrip: async (id) => {
    set((state) => ({
      trips: state.trips.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t))
    }));
  },

  togglePackingItem: async (tripId, itemId) => {
    await TripService.togglePackingItem(itemId);
  },

  addPackingItem: async (tripId, itemName, category) => {
    await TripService.addPackingItem({ tripId, itemName, category });
  },

  addExpense: async (expenseData) => {
    await ExpenseService.addExpense(expenseData);
  },

  deleteExpense: async (tripId, expenseId) => {
    await ExpenseService.deleteExpense(expenseId);
  },

  addMemory: async (memoryData) => {
    await MemoryService.addMemory(memoryData);
  },

  setActiveTrip: async (id) => {
    set((state) => {
      const updatedTrips = state.trips.map((t) =>
        t.id === id ? { ...t, status: 'ACTIVE' as const } : { ...t, status: t.status === 'ACTIVE' ? ('UPCOMING' as const) : t.status }
      );
      const newActive = updatedTrips.find((t) => t.id === id) || null;
      return { trips: updatedTrips, activeTrip: newActive };
    });
  },

  fetchNotifications: async () => {
    try {
      const notifications = await AdminService.getNotifications();
      set({ notifications });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  markNotificationAsRead: async (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    }));
  }
}));
