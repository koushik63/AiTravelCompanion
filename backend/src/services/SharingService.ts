import { DatabaseService } from './DatabaseService';

export class SharingService {
  private static sharedTokens = new Map<string, any>();

  static async createShareLink(tripId: string) {
    const trip = await DatabaseService.getTripById(tripId);
    if (!trip) throw new Error('Trip not found');

    const token = `share_${tripId}_${Date.now()}`;
    const sharedData = {
      token,
      tripId,
      title: trip.title,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      itineraryDays: trip.itineraryDays || [],
      isPublic: true
    };

    this.sharedTokens.set(token, sharedData);
    return sharedData;
  }

  static async getSharedTrip(token: string) {
    const data = this.sharedTokens.get(token);
    if (data) return data;

    // Fallback demo shared trip
    return {
      token,
      tripId: 'trip_1',
      title: 'Shared AI Expedition to Goa',
      destination: 'Goa, India',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 604800000).toISOString(),
      itineraryDays: [
        {
          id: 'd1',
          dayNumber: 1,
          date: new Date().toISOString().split('T')[0],
          summary: 'Arrival & Beach Sunset',
          activities: [
            { id: 'a1', time: '09:00 AM', title: 'Check-in at Beachfront Villa', category: 'Accommodation', cost: 0, isCompleted: true },
            { id: 'a2', time: '05:30 PM', title: 'Baga Beach Sunset Walk & Drinks', category: 'Leisure', cost: 1200, isCompleted: true }
          ]
        }
      ],
      isPublic: true
    };
  }
}
