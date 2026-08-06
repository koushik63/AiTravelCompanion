import { Request, Response } from 'express';
import { DatabaseService } from '../services/DatabaseService';

export class AdminController {
  static async getStats(req: Request, res: Response) {
    try {
      const stats = await DatabaseService.getAdminStats();
      return res.json(stats);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async submitFeedback(req: Request, res: Response) {
    try {
      const { rating, comment, userId } = req.body;
      const fb = await DatabaseService.addFeedback(userId || 'usr_demo_1', Number(rating) || 5, comment || 'Great app!');
      return res.status(201).json(fb);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getNotifications(req: Request, res: Response) {
    try {
      const notifications = await DatabaseService.getNotifications('usr_demo_1');
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
