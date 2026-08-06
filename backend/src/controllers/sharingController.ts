import { Request, Response } from 'express';
import { SharingService } from '../services/SharingService';

export class SharingController {
  static async createShareLink(req: Request, res: Response) {
    try {
      const { tripId } = req.body;
      const share = await SharingService.createShareLink(tripId || 'trip_1');
      return res.json(share);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getSharedTrip(req: Request, res: Response) {
    try {
      const token = String(req.params.token);
      const shared = await SharingService.getSharedTrip(token);
      return res.json(shared);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
