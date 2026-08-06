import { Response } from 'express';
import { DatabaseService } from '../services/DatabaseService';
import { AuthRequest } from '../middleware/authMiddleware';

export class MemoryController {
  static async getMemories(req: AuthRequest, res: Response) {
    try {
      const tripId = (req.query.tripId as string) || '';
      const memories = await DatabaseService.getMemories(tripId);
      return res.json(memories || []);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async addMemory(req: AuthRequest, res: Response) {
    try {
      const { tripId, imageUrl, caption, location } = req.body;
      if (!imageUrl) {
        return res.status(400).json({ error: 'imageUrl is required' });
      }

      const memory = await DatabaseService.addMemory({
        tripId: tripId || 'trip_3',
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
