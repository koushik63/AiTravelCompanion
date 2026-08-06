import { DatabaseService } from './DatabaseService';
import { StatisticsService } from './StatisticsService';

export class DashboardService {
  static async getDashboardSummary(userId: string) {
    const user = await DatabaseService.findUserById(userId);
    const trips = await DatabaseService.getTrips(userId);
    const stats = await StatisticsService.getStatistics(userId);

    const activeTrip = trips.find((t: any) => t.status === 'ACTIVE') || trips[0];
    const upcomingTrips = trips.filter((t: any) => t.status === 'UPCOMING');

    return {
      welcomeMessage: `Welcome back, ${user?.name || 'Traveler'}! Ready for your next journey?`,
      user: {
        id: user?.id || userId,
        email: user?.email || '',
        name: user?.name || 'Traveler',
        avatar: user?.avatar,
        role: user?.role || 'USER'
      },
      stats,
      activeTrip,
      upcomingTrips,
      recentActivity: [
        { id: 'act_1', type: 'TRIP_CREATED', title: 'Planned new journey to Goa, India', timestamp: new Date().toISOString() },
        { id: 'act_2', type: 'EXPENSE_ADDED', title: 'Added ₹4,500 for Beachside Resort', timestamp: new Date(Date.now() - 3600000).toISOString() }
      ]
    };
  }
}
