import { Response } from 'express';
import { DatabaseService } from '../services/DatabaseService';
import { CalendarService } from '../services/CalendarService';
import { HistoryService } from '../services/HistoryService';
import { DashboardService } from '../services/DashboardService';
import { StatisticsService } from '../services/StatisticsService';
import { AuthRequest } from '../middleware/authMiddleware';

export class TripController {
  static async getTrips(req: AuthRequest, res: Response) {
    try {
      const trips = await DatabaseService.getTrips(req.user?.id || 'usr_demo_1');
      return res.json(trips);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getTripById(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const trip = await DatabaseService.getTripById(id);
      if (!trip) return res.status(404).json({ error: 'Trip not found' });
      return res.json(trip);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async createTrip(req: AuthRequest, res: Response) {
    try {
      const trip = await DatabaseService.createTrip({ ...req.body, userId: req.user?.id || 'usr_demo_1' });
      return res.status(201).json(trip);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async updateTrip(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const updated = await DatabaseService.updateTrip(id, req.body);
      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async deleteTrip(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      await DatabaseService.deleteTrip(id);
      return res.json({ message: 'Trip deleted successfully' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async archiveTrip(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const trip = await DatabaseService.archiveTrip(id);
      return res.json(trip);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async restoreTrip(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const trip = await DatabaseService.restoreTrip(id);
      return res.json(trip);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async duplicateTrip(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const trip = await DatabaseService.duplicateTrip(id);
      return res.status(201).json(trip);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async toggleFavorite(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const trip = await DatabaseService.toggleFavoriteTrip(id);
      return res.json(trip);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getUpcomingTrips(req: AuthRequest, res: Response) {
    try {
      const trips = await DatabaseService.getTrips(req.user?.id || 'usr_demo_1');
      const upcoming = trips.filter((t: any) => t.status === 'UPCOMING' && !t.isArchived);
      return res.json(upcoming);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getCurrentTrip(req: AuthRequest, res: Response) {
    try {
      const trips = await DatabaseService.getTrips(req.user?.id || 'usr_demo_1');
      const current = trips.find((t: any) => t.status === 'ACTIVE') || trips[0];
      return res.json(current);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getTripHistory(req: AuthRequest, res: Response) {
    try {
      const history = await HistoryService.getTripHistory(req.user?.id || 'usr_demo_1');
      return res.json(history);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getCalendarEvents(req: AuthRequest, res: Response) {
    try {
      const events = await CalendarService.getCalendarEvents(req.user?.id || 'usr_demo_1');
      return res.json(events);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getDashboardSummary(req: AuthRequest, res: Response) {
    try {
      const summary = await DashboardService.getDashboardSummary(req.user?.id || 'usr_demo_1');
      return res.json(summary);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getStatistics(req: AuthRequest, res: Response) {
    try {
      const stats = await StatisticsService.getStatistics(req.user?.id || 'usr_demo_1');
      return res.json(stats);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async searchTrips(req: AuthRequest, res: Response) {
    try {
      const query = (req.query.q as string) || '';
      const results = await DatabaseService.searchTrips(query, req.user?.id || 'usr_demo_1');
      return res.json(results);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async togglePackingItem(req: AuthRequest, res: Response) {
    try {
      const itemId = String(req.params.itemId);
      const updated = await DatabaseService.togglePackingItem(itemId);
      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async addPackingItem(req: AuthRequest, res: Response) {
    try {
      const item = await DatabaseService.addPackingItem(req.body);
      return res.status(201).json(item);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
