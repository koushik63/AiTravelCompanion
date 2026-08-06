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

// Destination keyword → Unsplash photo ID for destination-specific trip cover images
const DESTINATION_IMAGE_MAP: Record<string, string> = {
  goa: 'photo-1512343879784-a960bf40e7f2',
  ladakh: 'photo-1506905925346-21bda4d32df4',
  ladhak: 'photo-1506905925346-21bda4d32df4',
  leh: 'photo-1506905925346-21bda4d32df4',
  kerala: 'photo-1602216056096-3b40cc0c9944',
  rajasthan: 'photo-1524492412937-b28074a5d7da',
  jaipur: 'photo-1524492412937-b28074a5d7da',
  mumbai: 'photo-1529253355930-ddbe423a2ac7',
  delhi: 'photo-1597074866923-dc0589150358',
  agra: 'photo-1564507592333-c60657eea523',
  kashmir: 'photo-1548013146-72479768bada',
  manali: 'photo-1626621341517-bbf3d9990a23',
  shimla: 'photo-1626621341517-bbf3d9990a23',
  varanasi: 'photo-1561361058-c24cecae35ca',
  mysore: 'photo-1600697395543-b8d08c87c9d5',
  andaman: 'photo-1537956965359-7573183d1f57',
  paris: 'photo-1502602898657-3e91760cbb34',
  london: 'photo-1513635269975-59663e0ac1ad',
  tokyo: 'photo-1540959733332-eab4deabeeaf',
  dubai: 'photo-1512453979798-5ea266f8880c',
  bali: 'photo-1537996194471-e657df975ab4',
  singapore: 'photo-1525625293386-3f8f99389edd',
  'new york': 'photo-1522083165195-3424ed129620',
  rome: 'photo-1552832230-c0197dd311b5',
  barcelona: 'photo-1539037116277-4db20889f2d4',
  maldives: 'photo-1573843981267-be1999ff37cd',
  amsterdam: 'photo-1534351590666-13e3e96b5702',
  bangkok: 'photo-1508009603885-50cf7c579365',
  istanbul: 'photo-1524231757912-21f4fe3a7200',
  greece: 'photo-1555993539-1732b0258235',
  iceland: 'photo-1529963183134-61a90db47eaf',
  hawaii: 'photo-1542259009477-d625272157b7',
  beach: 'photo-1507525428034-b723cf961d3e',
  mountain: 'photo-1464822759023-fed622ff2c3b',
};

const FALLBACK_IMAGES = [
  'photo-1476514525535-07fb3b4ae5f1',
  'photo-1500530855697-b586d89ba3ee',
  'photo-1488085061387-422e29b40080',
  'photo-1469474968028-56623f02e42e',
  'photo-1519046904884-53103b34b206',
  'photo-1503220317375-aaad61436b1b',
  'photo-1551918120-9739cb430c6d',
  'photo-1682685797406-97f364419b4a',
];

function getDestinationImageUrl(destination: string, tripId: string): string {
  const lower = (destination || '').toLowerCase();
  for (const [keyword, photoId] of Object.entries(DESTINATION_IMAGE_MAP)) {
    if (lower.includes(keyword)) {
      return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=80&w=1200`;
    }
  }
  const idx = tripId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % FALLBACK_IMAGES.length;
  return `https://images.unsplash.com/${FALLBACK_IMAGES[idx]}?auto=format&fit=crop&q=80&w=1200`;
}


let prisma: PrismaClient | null = null;
try {
  if (process.env.DATABASE_URL) {
    prisma = new PrismaClient();
  }
} catch (e) {
  Logger.warn('Prisma initialization skipped, using in-memory store for Demo Mode', 'DatabaseService');
}

const store = {
  users: [] as any[],
  profiles: [] as any[],
  preferences: [] as any[],
  trips: [] as any[],
  savedPlaces: [] as any[],
  itineraries: [] as any[],
  packingItems: [] as any[],
  expenses: [] as any[],
  transport: [] as any[],
  memories: [] as any[],
  notifications: [] as any[],
  feedbacks: [] as any[],
  logs: [] as any[]
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
    return store.savedPlaces.filter((s) => s.userId === userId);
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
    // Strictly filter by userId — no cross-user data leakage
    return userId ? store.trips.filter((t) => t.userId === userId) : store.trips;
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
      userId: tripData.userId,
      title: tripData.title || `Trip to ${tripData.destination}`,
      destination: tripData.destination,
      country: tripData.country || 'India',
      city: tripData.city || tripData.destination.split(',')[0],
      startDate: new Date(tripData.startDate).toISOString(),
      endDate: new Date(tripData.endDate).toISOString(),
      budget: Number(tripData.budget) || 50000,
      spent: 0,
      currency: tripData.currency || 'INR',
      coverImage: tripData.coverImage || getDestinationImageUrl(tripData.destination, `trip_${Date.now()}`),
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
  static async getMemories(tripId?: string) {
    if (tripId && tripId.trim() !== '') {
      const filtered = store.memories.filter((m) => m.tripId === tripId);
      if (filtered.length > 0) return filtered;
    }
    return store.memories;
  }

  static async addMemory(memoryData: any) {
    const newMemory = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      tripId: memoryData.tripId || 'trip_3',
      imageUrl: memoryData.imageUrl,
      caption: memoryData.caption,
      aiCaption: memoryData.aiCaption || `✨ AI Memory Tag: Highlights of ${memoryData.caption || 'your journey'}`,
      location: memoryData.location || 'India',
      createdAt: new Date().toISOString()
    };
    store.memories.unshift(newMemory);

    const trip = store.trips.find((t) => t.id === memoryData.tripId);
    if (trip) {
      if (!trip.memories) trip.memories = [];
      trip.memories.unshift(newMemory);
    }
    return newMemory;
  }

  // Notifications
  static async getNotifications(userId: string) {
    return store.notifications.filter((n) => n.userId === userId);
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
