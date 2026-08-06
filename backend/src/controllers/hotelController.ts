import { Request, Response } from 'express';
import { HotelService } from '../services/HotelService';

export class HotelController {
  static async searchHotels(req: Request, res: Response) {
    try {
      const destination = (req.query.destination as string) || 'Goa';
      const category = (req.query.category as string) || 'All';
      const hotels = await HotelService.searchHotels(destination, category);
      return res.json(hotels);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
