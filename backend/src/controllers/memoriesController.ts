import { Request, Response } from 'express';
import { DatabaseService } from '../services/DatabaseService';
import { AuthRequest } from '../middleware/authMiddleware';

export class MemoriesController {
  static async getMemories(req: Request, res: Response) {
    try {
      const tripId = (req.query.tripId as string) || 'trip_1';
      const memories = await DatabaseService.getTripById(tripId);
      return res.json((memories as any)?.memories || []);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async addMemory(req: AuthRequest, res: Response) {
    try {
      const memory = await DatabaseService.addMemory(req.body);
      return res.status(201).json(memory);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
