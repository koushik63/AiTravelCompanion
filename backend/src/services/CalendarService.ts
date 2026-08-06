import { DatabaseService } from './DatabaseService';

export class CalendarService {
  static async getCalendarEvents(userId: string) {
    const trips = await DatabaseService.getTrips(userId);
    return trips.map((t) => ({
      id: `cal_${t.id}`,
      tripId: t.id,
      title: t.title,
      startDate: t.startDate,
      endDate: t.endDate,
      destination: t.destination,
      status: t.status
    }));
  }
}
