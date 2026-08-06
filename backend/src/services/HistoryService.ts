import { DatabaseService } from './DatabaseService';

export class HistoryService {
  static async getTripHistory(userId: string) {
    const trips = await DatabaseService.getTrips(userId);
    return trips.filter((t) => t.status === 'COMPLETED' || new Date(t.endDate) < new Date());
  }
}
