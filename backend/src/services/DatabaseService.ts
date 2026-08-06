import { PrismaClient } from '@prisma/client';
import { Logger } from '../utils/logger';
import {
  SEED_USERS,
  SEED_TRIPS,
  SEED_ITINERARIES,
  SEED_PACKING_ITEMS,
  SEED_EXPENSES,
  SEED_TRANSPORT,
  SEED_MEMORIES,
  SEED_NOTIFICATIONS
} from '../utils/mockData';

let prisma: PrismaClient | null = null;
try {
  if (process.env.DATABASE_URL) {
    prisma = new PrismaClient();
  }
} catch (e) {
  Logger.warn('Prisma initialization skipped, using in-memory store for Demo Mode', 'DatabaseService');
}

const store = {
  users: [...SEED_USERS],
  profiles: SEED_USERS.map((u) => ({
    id: `prof_${u.id}`,
    userId: u.id,
    name: u.name,
    email: u.email,
    avatar: u.avatar,
    provider: 'email',
    createdAt: u.createdAt,
    updatedAt: u.createdAt
  })),
  preferences: SEED_USERS.map((u) => ({
    id: `pref_${u.id}`,
    userId: u.id,
    preferredCurrency: 'INR',
    travelStyle: 'Balanced',
    theme: 'dark',
    emailNotifications: true
  })),
  trips: SEED_TRIPS.map((t) => ({
    ...t,
    country: t.destination.includes('Japan') ? 'Japan' : 'India',
    city: t.destination.split(',')[0],
    travelType: 'Leisure',
    transportType: 'Flight',
    accommodation: 'Boutique Hotel',
    description: `Automated journey to ${t.destination}`,
    isFavorite: false,
    isArchived: false,
    archivedAt: null
  })),
  savedPlaces: [
    { id: 'save_1', userId: 'usr_demo_1', name: 'Baga Beach Promenade', category: 'attraction', address: 'Calangute - Baga Rd, Goa', rating: 4.8, lat: 15.5553, lng: 73.7517, createdAt: new Date().toISOString() },
    { id: 'save_2', userId: 'usr_demo_1', name: 'Fishermans Wharf Bistro', category: 'restaurant', address: 'Cavelossim, South Goa', rating: 4.9, lat: 15.1764, lng: 73.9458, createdAt: new Date().toISOString() }
  ],
  itineraries: [...SEED_ITINERARIES],
  packingItems: [...SEED_PACKING_ITEMS],
  expenses: [...SEED_EXPENSES],
  transport: [...SEED_TRANSPORT],
  memories: [...SEED_MEMORIES],
  notifications: [...SEED_NOTIFICATIONS],
  feedbacks: [
    { id: 'fb_1', userId: 'usr_demo_1', rating: 5, comment: 'The AI Itinerary & packing suggestions saved us hours of planning!', createdAt: new Date().toISOString() }
  ],
  logs: [
    { id: 'log_1', level: 'INFO', message: 'System started successfully in Demo Mode', source: 'Backend Server', timestamp: new Date().toISOString() }
  ]
};

export class DatabaseService {
  // Users & Profiles
  static async findUserByEmail(email: string) {
    if (prisma) {
      try {
        return await prisma.user.findUnique({ where: { email } });
      } catch (err) {}
    }
    return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static async findUserById(id: string) {
    if (prisma) {
      try {
        return await prisma.user.findUnique({ where: { id } });
      } catch (err) {}
    }
    return store.users.find((u) => u.id === id) || null;
  }

  static async createUser(userData: any) {
    const newUser = {
      id: `usr_${Date.now()}`,
      email: userData.email,
      passwordHash: userData.passwordHash || '',
      name: userData.name,
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      role: userData.role || 'USER',
      provider: userData.provider || 'email',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (prisma) {
      try {
        const u = await prisma.user.create({ data: newUser as any });
        await prisma.profile.create({
          data: { userId: u.id, name: u.name, email: u.email, avatar: u.avatar, provider: u.provider }
        });
        await prisma.userPreferences.create({
          data: { userId: u.id, preferredCurrency: 'INR', travelStyle: 'Balanced', theme: 'dark', emailNotifications: true }
        });
        return u;
      } catch (err) {}
    }

    store.users.push(newUser);
    store.profiles.push({
      id: `prof_${newUser.id}`,
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      provider: newUser.provider,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    });
    store.preferences.push({
      id: `pref_${newUser.id}`,
      userId: newUser.id,
      preferredCurrency: 'INR',
      travelStyle: 'Balanced',
      theme: 'dark',
      emailNotifications: true
    });

    return newUser;
  }

  static async getProfileByUserId(userId: string) {
    if (prisma) {
      try {
        return await prisma.profile.findUnique({ where: { userId } });
      } catch (err) {}
    }
    return store.profiles.find((p) => p.userId === userId) || store.profiles[0];
  }

  static async updateProfile(userId: string, data: { name?: string; avatar?: string }) {
    if (prisma) {
      try {
        return await prisma.profile.update({ where: { userId }, data });
      } catch (err) {}
    }
    const prof = store.profiles.find((p) => p.userId === userId);
    if (prof) {
      if (data.name) prof.name = data.name;
      if (data.avatar) prof.avatar = data.avatar;
      prof.updatedAt = new Date().toISOString();
      return prof;
    }
    return null;
  }

  static async getPreferencesByUserId(userId: string) {
    if (prisma) {
      try {
        return await prisma.userPreferences.findUnique({ where: { userId } });
      } catch (err) {}
    }
    return store.preferences.find((p) => p.userId === userId) || store.preferences[0];
  }

  static async updatePreferences(userId: string, data: any) {
    if (prisma) {
      try {
        return await prisma.userPreferences.update({ where: { userId }, data });
      } catch (err) {}
    }
    const pref = store.preferences.find((p) => p.userId === userId);
    if (pref) {
      Object.assign(pref, data);
      return pref;
    }
    return null;
  }

  // Saved Places
  static async getSavedPlaces(userId: string) {
    if (prisma) {
      try {
        return await prisma.savedPlace.findMany({ where: { userId } });
      } catch (err) {}
    }
    return store.savedPlaces.filter((s) => s.userId === userId || userId === 'usr_demo_1');
  }

  static async savePlace(userId: string, placeData: any) {
    const newPlace = {
      id: `save_${Date.now()}`,
      userId,
      name: placeData.name,
      category: placeData.category || 'attraction',
      address: placeData.address || 'India',
      rating: Number(placeData.rating) || 4.5,
      lat: Number(placeData.lat) || 15.2993,
      lng: Number(placeData.lng) || 74.124,
      createdAt: new Date().toISOString()
    };

    if (prisma) {
      try {
        return await prisma.savedPlace.create({ data: newPlace });
      } catch (err) {}
    }

    store.savedPlaces.push(newPlace);
    return newPlace;
  }

  static async removeSavedPlace(id: string) {
    if (prisma) {
      try {
        await prisma.savedPlace.delete({ where: { id } });
      } catch (err) {}
    }
    const idx = store.savedPlaces.findIndex((s) => s.id === id);
    if (idx !== -1) store.savedPlaces.splice(idx, 1);
    return true;
  }

  // Trips CRUD & Ecosystem
  static async getTrips(userId?: string) {
    if (prisma) {
      try {
        return await prisma.trip.findMany({
          where: userId ? { userId } : {},
          include: { itineraryDays: { include: { activities: true } }, packingItems: true, expenses: true }
        });
      } catch (err) {}
    }
    return userId ? store.trips.filter((t) => t.userId === userId || userId === 'usr_demo_1') : store.trips;
  }

  static async getTripById(id: string) {
    if (prisma) {
      try {
        return await prisma.trip.findUnique({
          where: { id },
          include: { itineraryDays: { include: { activities: true } }, packingItems: true, expenses: true, transportTickets: true, memories: true }
        });
      } catch (err) {}
    }
    const trip = store.trips.find((t) => t.id === id);
    if (!trip) return null;
    const itineraries = store.itineraries.filter((i) => i.tripId === id);
    const packingItems = store.packingItems.filter((p) => p.tripId === id);
    const expenses = store.expenses.filter((e) => e.tripId === id);
    const transportTickets = store.transport.filter((tr) => tr.tripId === id);
    const memories = store.memories.filter((m) => m.tripId === id);

    return {
      ...trip,
      itineraryDays: itineraries,
      packingItems,
      expenses,
      transportTickets,
      memories
    };
  }

  static async createTrip(tripData: any) {
    const newTrip = {
      id: `trip_${Date.now()}`,
      userId: tripData.userId || 'usr_demo_1',
      title: tripData.title || `Trip to ${tripData.destination}`,
      destination: tripData.destination,
      country: tripData.country || 'India',
      city: tripData.city || tripData.destination.split(',')[0],
      startDate: new Date(tripData.startDate).toISOString(),
      endDate: new Date(tripData.endDate).toISOString(),
      budget: Number(tripData.budget) || 50000,
      spent: 0,
      currency: tripData.currency || 'INR',
      coverImage: tripData.coverImage || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1200',
      status: tripData.status || 'UPCOMING',
      travelType: tripData.travelType || 'Leisure',
      transportType: tripData.transportType || 'Flight',
      accommodation: tripData.accommodation || 'Boutique Hotel',
      description: tripData.description || 'Exciting travel experience',
      isFavorite: false,
      isArchived: false,
      archivedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (prisma) {
      try {
        return await prisma.trip.create({ data: newTrip as any });
      } catch (err) {}
    }
    store.trips.push(newTrip as any);
    return newTrip;
  }

  static async updateTrip(id: string, data: any) {
    if (prisma) {
      try {
        return await prisma.trip.update({ where: { id }, data });
      } catch (err) {}
    }
    const trip = store.trips.find((t) => t.id === id);
    if (trip) {
      Object.assign(trip, data, { updatedAt: new Date().toISOString() });
      return trip;
    }
    return null;
  }

  static async archiveTrip(id: string) {
    return await this.updateTrip(id, { isArchived: true, status: 'ARCHIVED', archivedAt: new Date().toISOString() });
  }

  static async restoreTrip(id: string) {
    return await this.updateTrip(id, { isArchived: false, status: 'UPCOMING', archivedAt: null });
  }

  static async toggleFavoriteTrip(id: string) {
    const trip = store.trips.find((t) => t.id === id);
    if (trip) {
      trip.isFavorite = !trip.isFavorite;
      return trip;
    }
    return null;
  }

  static async duplicateTrip(id: string) {
    const original = await this.getTripById(id);
    if (!original) return null;
    return await this.createTrip({
      ...original,
      title: `${original.title} (Copy)`,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 864000000).toISOString()
    });
  }

  static async deleteTrip(id: string) {
    if (prisma) {
      try {
        await prisma.trip.delete({ where: { id } });
      } catch (err) {}
    }
    const idx = store.trips.findIndex((t) => t.id === id);
    if (idx !== -1) store.trips.splice(idx, 1);
    return true;
  }

  static async searchTrips(query: string, userId?: string) {
    const trips = await this.getTrips(userId);
    const q = query.toLowerCase();
    return trips.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        (t.country && t.country.toLowerCase().includes(q)) ||
        (t.city && t.city.toLowerCase().includes(q))
    );
  }

  // Packing Items
  static async togglePackingItem(itemId: string) {
    const item = store.packingItems.find((p) => p.id === itemId);
    if (item) {
      item.isPacked = !item.isPacked;
      return item;
    }
    return null;
  }

  static async addPackingItem(itemData: any) {
    const newItem = {
      id: `pack_${Date.now()}`,
      tripId: itemData.tripId,
      category: itemData.category || 'General',
      itemName: itemData.itemName,
      isPacked: false,
      quantity: itemData.quantity || 1
    };
    store.packingItems.push(newItem);
    return newItem;
  }

  // Expenses
  static async addExpense(expenseData: any) {
    const newExpense = {
      id: `exp_${Date.now()}`,
      tripId: expenseData.tripId,
      category: expenseData.category,
      amount: Number(expenseData.amount),
      currency: expenseData.currency || 'INR',
      description: expenseData.description,
      date: new Date().toISOString()
    };
    store.expenses.push(newExpense);
    const trip = store.trips.find((t) => t.id === expenseData.tripId);
    if (trip) trip.spent += newExpense.amount;
    return newExpense;
  }

  static async deleteExpense(id: string) {
    const idx = store.expenses.findIndex((e) => e.id === id);
    if (idx !== -1) {
      const exp = store.expenses[idx];
      const trip = store.trips.find((t) => t.id === exp.tripId);
      if (trip) trip.spent = Math.max(0, trip.spent - exp.amount);
      store.expenses.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Memories
  static async addMemory(memoryData: any) {
    const newMemory = {
      id: `mem_${Date.now()}`,
      tripId: memoryData.tripId,
      imageUrl: memoryData.imageUrl,
      caption: memoryData.caption,
      aiCaption: memoryData.aiCaption || `✨ AI Memory Tag: Highlights of ${memoryData.caption || 'your journey'}`,
      location: memoryData.location || 'India',
      createdAt: new Date().toISOString()
    };
    store.memories.push(newMemory);
    return newMemory;
  }

  // Notifications
  static async getNotifications(userId: string) {
    return store.notifications.filter((n) => n.userId === userId || userId === 'usr_demo_1');
  }

  static async markNotificationRead(id: string) {
    const notif = store.notifications.find((n) => n.id === id);
    if (notif) notif.isRead = true;
    return notif;
  }

  // Admin Stats
  static async getAdminStats() {
    return {
      totalUsers: store.users.length,
      totalTrips: store.trips.length,
      activeTrips: store.trips.filter((t) => t.status === 'ACTIVE').length,
      completedTrips: store.trips.filter((t) => t.status === 'COMPLETED').length,
      users: store.users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt })),
      trips: store.trips,
      feedbacks: store.feedbacks,
      systemLogs: store.logs
    };
  }

  static async addFeedback(userId: string, rating: number, comment: string) {
    const fb = { id: `fb_${Date.now()}`, userId, rating, comment, createdAt: new Date().toISOString() };
    store.feedbacks.push(fb);
    return fb;
  }
}
