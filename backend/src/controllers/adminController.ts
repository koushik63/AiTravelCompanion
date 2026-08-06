import { Request, Response } from 'express';
import { DatabaseService } from '../services/DatabaseService';
import { AuthRequest } from '../middleware/authMiddleware';

export class AdminController {
  static async getStats(req: Request, res: Response) {
    try {
      const stats = await DatabaseService.getAdminStats();
      return res.json(stats);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async submitFeedback(req: AuthRequest, res: Response) {
    try {
      const { rating, comment } = req.body;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Not authenticated' });
      const fb = await DatabaseService.addFeedback(userId, Number(rating) || 5, comment || '');
      return res.status(201).json(fb);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getNotifications(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Not authenticated' });
      const notifications = await DatabaseService.getNotifications(userId);
      return res.json(notifications);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async markNotificationRead(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const notif = await DatabaseService.markNotificationRead(id);
      return res.json(notif);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
