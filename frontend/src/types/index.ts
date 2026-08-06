export type Role = 'USER' | 'ADMIN';
export type TripStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED';
export type TransportType = 'FLIGHT' | 'TRAIN' | 'BUS' | 'CAR';
export type NotificationType = 'WEATHER' | 'BOARDING' | 'ACTIVITY' | 'BUDGET' | 'SYSTEM';
export type AuthProvider = 'email' | 'google';
export type TravelType = 'Solo' | 'Family' | 'Business' | 'Leisure' | 'Adventure';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: Role;
  provider?: AuthProvider;
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

export interface Activity {
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

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  date: string;
  summary?: string;
  activities: Activity[];
}

export interface PackingItem {
  id: string;
  tripId: string;
  category: string;
  itemName: string;
  isPacked: boolean;
  quantity: number;
}

export interface Expense {
  id: string;
  tripId: string;
  category: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
}

export interface Memory {
  id: string;
  tripId: string;
  imageUrl: string;
  caption?: string;
  aiCaption?: string;
  location?: string;
  createdAt: string;
}

export interface TransportTicket {
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

export interface Trip {
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
  imageUrl?: string;
  status: TripStatus;
  travelType?: TravelType;
  transportType?: TransportType;
  accommodation?: string;
  description?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
  archivedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  itineraryDays?: ItineraryDay[];
  packingItems?: PackingItem[];
  expenses?: Expense[];
  transportTickets?: TransportTicket[];
  memories?: Memory[];
}

export interface CalendarEvent {
  id: string;
  tripId: string;
  title: string;
  startDate: string;
  endDate: string;
  destination: string;
  status: TripStatus;
}

export interface TravelStatistics {
  totalTrips: number;
  activeTrips: number;
  upcomingTrips: number;
  completedTrips: number;
  archivedTrips: number;
  totalSpent: number;
  totalBudget: number;
  countriesVisited: number;
  visitedDestinations: string[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface HourlyForecastItem {
  time: string;
  temp: number;
  condition: string;
  pop: number;
  icon?: string;
}

export interface WeatherInfo {
  city: string;
  temp: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  uvIndex?: number;
  rainProbability?: number;
  sunrise?: string;
  sunset?: string;
  icon?: string;
  advisory?: string;
  hourlyForecast?: HourlyForecastItem[];
  dailyForecast?: Array<{ day: string; tempMax: number; tempMin: number; condition: string; pop?: number }>;
}

export interface FlightStatus {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  terminal?: string;
  gate?: string;
  status: string;
  delayMinutes: number;
}

export interface TrainStatus {
  trainNumber: string;
  trainName: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  platform?: string;
  coach?: string;
  seat?: string;
  status: string;
  delayMinutes: number;
}

export interface NearbyPlace {
  id: string;
  name: string;
  category: 'restaurant' | 'hotel' | 'hospital' | 'atm' | 'petrol' | 'pharmacy' | 'attraction';
  address: string;
  rating: number;
  distanceKm: number;
  lat: number;
  lng: number;
  isSaved?: boolean;
}

export interface SavedPlace {
  id: string;
  userId: string;
  name: string;
  category: string;
  address: string;
  rating: number;
  lat: number;
  lng: number;
  createdAt: string;
}

export interface SharedTrip {
  token: string;
  tripId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  itineraryDays: ItineraryDay[];
  isPublic: boolean;
}

export interface AIPromptInput {
  destination: string;
  startDate: string;
  endDate: string;
  travelersCount: number;
  budget: number;
  currency: string;
  travelStyle: TravelType;
  interests?: string[];
  foodPreferences?: string;
  accommodationPreference?: string;
  transportationPreference?: string;
  accessibilityRequirements?: string;
  mustVisitPlaces?: string;
  placesToAvoid?: string;
  additionalNotes?: string;
}

export interface AIItineraryResponse {
  tripTitle: string;
  destination: string;
  summary: string;
  estimatedTotalCost: number;
  currency: string;
  days: Array<{
    dayNumber: number;
    date: string;
    summary: string;
    morning: Activity[];
    afternoon: Activity[];
    evening: Activity[];
    dailyEstimatedCost: number;
  }>;
  recommendedAttractions: Array<{ name: string; category: string; description: string; cost: number }>;
  recommendedRestaurants: Array<{ name: string; cuisine: string; priceRange: string; location: string }>;
  recommendedHotels: Array<{ name: string; style: string; pricePerNight: number }>;
  packingList: string[];
  localTips: string[];
  safetyTips: string[];
  weatherConsiderations: string;
  confidenceNotes: string;
}
