import axios from 'axios';
import { Trip, PackingItem, Expense, Memory, NotificationItem, WeatherInfo, ProfileDTO, UserPreferencesDTO, AIPromptInput, AIItineraryResponse, SharedTrip } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aitravel_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthService = {
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token) localStorage.setItem('aitravel_token', res.data.token);
    return res.data;
  },
  register: async (name: string, email: string, password: string) => {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data.token) localStorage.setItem('aitravel_token', res.data.token);
    return res.data;
  },
  googleLogin: async (email?: string, name?: string) => {
    const res = await api.post('/auth/google', { email, name });
    if (res.data.token) localStorage.setItem('aitravel_token', res.data.token);
    return res.data;
  },
  forgotPassword: async (email: string) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },
  resetPassword: async (token: string, newPassword: string) => {
    const res = await api.post('/auth/reset-password', { token, newPassword });
    return res.data;
  },
  verifyEmail: async (token: string) => {
    const res = await api.post('/auth/verify-email', { token });
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('aitravel_token');
  }
};

export const ProfileService = {
  getProfile: async (): Promise<ProfileDTO> => {
    const res = await api.get('/profile');
    return res.data;
  },
  updateProfile: async (data: { name?: string; avatar?: string }): Promise<ProfileDTO> => {
    const res = await api.put('/profile', data);
    return res.data;
  },
  getPreferences: async (): Promise<UserPreferencesDTO> => {
    const res = await api.get('/profile/preferences');
    return res.data;
  },
  updatePreferences: async (data: Partial<UserPreferencesDTO>): Promise<UserPreferencesDTO> => {
    const res = await api.put('/profile/preferences', data);
    return res.data;
  }
};

export const TripService = {
  getTrips: async (): Promise<Trip[]> => {
    const res = await api.get('/trips');
    return res.data;
  },
  getTripById: async (id: string): Promise<Trip> => {
    const res = await api.get(`/trips/${id}`);
    return res.data;
  },
  createTrip: async (tripData: any): Promise<Trip> => {
    const res = await api.post('/trips', tripData);
    return res.data;
  },
  deleteTrip: async (id: string) => {
    const res = await api.delete(`/trips/${id}`);
    return res.data;
  },
  togglePackingItem: async (itemId: string): Promise<PackingItem> => {
    const res = await api.put(`/trips/packing/item/${itemId}/toggle`);
    return res.data;
  },
  addPackingItem: async (itemData: { tripId: string; itemName: string; category?: string }): Promise<PackingItem> => {
    const res = await api.post('/trips/packing/item', itemData);
    return res.data;
  }
};

export const AIService = {
  generateItinerary: async (data: AIPromptInput | any): Promise<AIItineraryResponse> => {
    const res = await api.post('/ai/generate-itinerary', data);
    return res.data;
  },
  regenerateItinerary: async (data: AIPromptInput | any): Promise<AIItineraryResponse> => {
    const res = await api.post('/ai/regenerate', data);
    return res.data;
  },
  saveItinerary: async (itinerary: any, input: AIPromptInput | any) => {
    const res = await api.post('/ai/save-itinerary', { itinerary, ...input });
    return res.data;
  },
  generatePackingList: async (data: { destination: string; travelStyle: string; durationDays?: number }) => {
    const res = await api.post('/ai/generate-packing-list', data);
    return res.data;
  },
  suggestPlaces: async (destination: string, category: 'restaurants' | 'attractions' | 'hotels' | string) => {
    const res = await api.post('/ai/suggest-places', { destination, category });
    return res.data;
  },
  adjustWeather: async (destination: string, currentWeather: string, activities: any[]) => {
    const res = await api.post('/ai/adjust-weather', { destination, currentWeather, activities });
    return res.data;
  },
  getBudgetTips: async (destination: string, totalBudget: number, daysCount?: number, currency?: string) => {
    const res = await api.post('/ai/budget-tips', { destination, totalBudget, daysCount, currency });
    return res.data;
  },
  assistantChat: async (message: string, tripContext?: any, history?: string) => {
    const res = await api.post('/ai/assistant/chat', { message, tripContext, history });
    return res.data;
  }
};

export const MapsService = {
  searchPlaces: async (query: string, location?: string) => {
    const res = await api.get('/maps/search-places', { params: { query, location } });
    return res.data;
  },
  getNearby: async (lat: number, lng: number, type: string) => {
    const res = await api.get('/maps/nearby', { params: { lat, lng, type } });
    return res.data;
  },
  getDirections: async (origin: string, destination: string) => {
    const res = await api.get('/maps/directions', { params: { origin, destination } });
    return res.data;
  },
  getSavedPlaces: async () => {
    const res = await api.get('/maps/saved-places');
    return res.data;
  },
  savePlace: async (placeData: any) => {
    const res = await api.post('/maps/saved-places', placeData);
    return res.data;
  },
  removeSavedPlace: async (id: string) => {
    const res = await api.delete(`/maps/saved-places/${id}`);
    return res.data;
  }
};

export const WeatherService = {
  getCurrent: async (city: string): Promise<WeatherInfo> => {
    const res = await api.get('/weather/current', { params: { city } });
    return res.data;
  },
  getForecast: async (city: string) => {
    const res = await api.get('/weather/forecast', { params: { city } });
    return res.data;
  }
};

export const TransportService = {
  getFlightStatus: async (flightNumber: string) => {
    const res = await api.get('/transport/flight-status', { params: { flightNumber } });
    return res.data;
  },
  getTrainStatus: async (trainNumber: string) => {
    const res = await api.get('/transport/train-status', { params: { trainNumber } });
    return res.data;
  },
  getTickets: async () => {
    const res = await api.get('/transport/tickets');
    return res.data;
  }
};

export const ExpenseService = {
  getExpenses: async (tripId: string): Promise<Expense[]> => {
    const res = await api.get('/expenses', { params: { tripId } });
    return res.data;
  },
  addExpense: async (expenseData: { tripId: string; category: string; amount: number; description: string; currency?: string }) => {
    const res = await api.post('/expenses', expenseData);
    return res.data;
  },
  deleteExpense: async (id: string) => {
    const res = await api.delete(`/expenses/${id}`);
    return res.data;
  }
};

export const MemoryService = {
  getMemories: async (tripId: string): Promise<Memory[]> => {
    const res = await api.get('/memories', { params: { tripId } });
    return res.data;
  },
  addMemory: async (data: { tripId: string; imageUrl: string; caption?: string; location?: string }) => {
    const res = await api.post('/memories', data);
    return res.data;
  }
};

export const SharingService = {
  createShareLink: async (tripId: string) => {
    const res = await api.post('/share/create', { tripId });
    return res.data;
  },
  getSharedTrip: async (token: string): Promise<SharedTrip> => {
    const res = await api.get(`/share/${token}`);
    return res.data;
  }
};

export const AdminService = {
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },
  submitFeedback: async (rating: number, comment: string) => {
    const res = await api.post('/admin/feedback', { rating, comment });
    return res.data;
  },
  getNotifications: async (): Promise<NotificationItem[]> => {
    const res = await api.get('/admin/notifications');
    return res.data;
  },
  markRead: async (id: string) => {
    const res = await api.put(`/admin/notifications/${id}/read`);
    return res.data;
  }
};

export default api;
