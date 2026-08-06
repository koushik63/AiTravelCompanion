// Shared TypeScript types across Frontend & Backend

export type Role = 'USER' | 'ADMIN';
export type TripStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED';
export type TransportType = 'FLIGHT' | 'TRAIN' | 'BUS' | 'CAR';
export type NotificationType = 'WEATHER' | 'BOARDING' | 'ACTIVITY' | 'BUDGET' | 'SYSTEM';
export type AuthProvider = 'email' | 'google';
export type TravelType = 'Solo' | 'Family' | 'Business' | 'Leisure' | 'Adventure';

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: Role;
  provider?: AuthProvider;
  createdAt: string;
}

export interface ProfileDTO {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  provider: AuthProvider;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferencesDTO {
  id: string;
  userId: string;
  preferredCurrency: string;
  travelStyle: string;
  theme: 'dark' | 'light' | 'system';
  emailNotifications: boolean;
}

export interface ActivityDTO {
  id: string;
  time: string;
  title: string;
  description?: string;
  location?: string;
  lat?: number;
  lng?: number;
  category: string;
  cost: number;
  isCompleted: boolean;
}

export interface ItineraryDayDTO {
  id: string;
  dayNumber: number;
  date: string;
  summary?: string;
  activities: ActivityDTO[];
}

export interface PackingItemDTO {
  id: string;
  tripId: string;
  category: string;
  itemName: string;
  isPacked: boolean;
  quantity: number;
}

export interface ExpenseDTO {
  id: string;
  tripId: string;
  category: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
}

export interface MemoryDTO {
  id: string;
  tripId: string;
  imageUrl: string;
  caption?: string;
  aiCaption?: string;
  location?: string;
  createdAt: string;
}

export interface TransportTicketDTO {
  id: string;
  tripId: string;
  type: TransportType;
  carrierNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  terminal?: string;
  gate?: string;
  platform?: string;
}

export interface TripDTO {
  id: string;
  userId: string;
  title: string;
  destination: string;
  country?: string;
  city?: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  currency: string;
  coverImage?: string;
  status: TripStatus;
  travelType?: TravelType;
  transportType?: TransportType;
  accommodation?: string;
  description?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
  archivedAt?: string;
  createdAt: string;
  updatedAt?: string;
  itineraryDays?: ItineraryDayDTO[];
  packingItems?: PackingItemDTO[];
  expenses?: ExpenseDTO[];
  transportTickets?: TransportTicketDTO[];
  memories?: MemoryDTO[];
}

// Stage 7 DTOs
export interface SharedTripDTO {
  token: string;
  tripId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  itineraryDays: ItineraryDayDTO[];
  isPublic: boolean;
}

export interface UserSettingsDTO {
  preferredCurrency: string;
  travelStyle: string;
  theme: 'dark' | 'light' | 'system';
  emailNotifications: boolean;
  isPublicProfile: boolean;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}
