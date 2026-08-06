import { Response } from 'express';
import { ProfileService } from '../services/ProfileService';
import { AuthRequest } from '../middleware/authMiddleware';

export class ProfileController {
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const profile = await ProfileService.getProfile(req.user?.id || 'usr_demo_1');
      return res.json(profile);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const { name, avatar } = req.body;
      const updated = await ProfileService.updateProfile(req.user?.id || 'usr_demo_1', { name, avatar });
      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getPreferences(req: AuthRequest, res: Response) {
    try {
      const preferences = await ProfileService.getPreferences(req.user?.id || 'usr_demo_1');
      return res.json(preferences);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async updatePreferences(req: AuthRequest, res: Response) {
    try {
      const updated = await ProfileService.updatePreferences(req.user?.id || 'usr_demo_1', req.body);
      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
