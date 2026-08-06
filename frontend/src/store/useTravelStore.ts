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

  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
}

export const useTravelStore = create<TravelState>((set, get) => ({
  trips: [
    {
      id: 'trip_1',
      userId: 'usr_demo_1',
      title: 'Goa Beachside Vacation',
      destination: 'Goa, India',
      country: 'India',
      city: 'Goa',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 604800000).toISOString(),
      budget: 45000,
      spent: 12500,
      currency: 'INR',
      coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000',
      status: 'ACTIVE',
      travelType: 'Leisure',
      transportType: 'FLIGHT',
      accommodation: 'Taj Exotica Resort',
      description: 'Relaxing 7-day coastal trip in South Goa.',
      isFavorite: true,
      isArchived: false
    },
    {
      id: 'trip_2',
      userId: 'usr_demo_1',
      title: 'Jaipur Cultural Tour',
      destination: 'Jaipur, Rajasthan, India',
      country: 'India',
      city: 'Jaipur',
      startDate: new Date(Date.now() + 1296000000).toISOString(),
      endDate: new Date(Date.now() + 1728000000).toISOString(),
      budget: 65000,
      spent: 0,
      currency: 'INR',
      coverImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=1000',
      status: 'UPCOMING',
      travelType: 'Family',
      transportType: 'TRAIN',
      accommodation: 'Heritage Haveli Hotel',
      description: 'Exploring Pink City forts and royal cuisine.',
      isFavorite: false,
      isArchived: false
    }
  ],
  activeTrip: null,
  notifications: [
    {
      id: 'notif_1',
      userId: 'usr_demo_1',
      title: 'Weather Update for Goa',
      message: 'Sunny skies expected (29°C) for your South Goa beach trip tomorrow.',
      type: 'WEATHER',
      isRead: false,
      createdAt: new Date().toISOString()
    }
  ],
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
      const updated = await TripService.getTripById(id);
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
