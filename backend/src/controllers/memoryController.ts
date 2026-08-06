import { Response } from 'express';
import { DatabaseService } from '../services/DatabaseService';
import { AuthRequest } from '../middleware/authMiddleware';

export class MemoryController {
  static async getMemories(req: AuthRequest, res: Response) {
    try {
      const tripId = (req.query.tripId as string) || 'trip_3';
      const trip = await DatabaseService.getTripById(tripId);
      return res.json(trip?.memories || []);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async addMemory(req: AuthRequest, res: Response) {
    try {
      const { tripId, imageUrl, caption, location } = req.body;
      if (!tripId || !imageUrl) {
        return res.status(400).json({ error: 'tripId and imageUrl are required' });
      }

      const memory = await DatabaseService.addMemory({
        tripId,
        imageUrl,
        caption: caption || 'Unforgettable travel moment',
        location: location || 'Destination'
      });
      return res.status(201).json(memory);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
