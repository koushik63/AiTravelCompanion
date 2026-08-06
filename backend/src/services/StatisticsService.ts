import { DatabaseService } from './DatabaseService';

export class StatisticsService {
  static async getStatistics(userId: string) {
    const trips = await DatabaseService.getTrips(userId);
    const activeTrips = trips.filter((t: any) => t.status === 'ACTIVE').length;
    const upcomingTrips = trips.filter((t: any) => t.status === 'UPCOMING').length;
    const completedTrips = trips.filter((t: any) => t.status === 'COMPLETED').length;
    const archivedTrips = trips.filter((t: any) => t.isArchived).length;
    const totalSpent = trips.reduce((acc: number, t: any) => acc + (t.spent || 0), 0);
    const totalBudget = trips.reduce((acc: number, t: any) => acc + (t.budget || 0), 0);
    const destinations = Array.from(new Set(trips.map((t: any) => t.destination)));

    return {
      totalTrips: trips.length,
      activeTrips,
      upcomingTrips,
      completedTrips,
      archivedTrips,
      totalSpent,
      totalBudget,
      countriesVisited: destinations.length,
      visitedDestinations: destinations
    };
  }
}
