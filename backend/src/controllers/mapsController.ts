import { Request, Response } from 'express';
import { MapsService } from '../services/MapsService';
import { DatabaseService } from '../services/DatabaseService';
import { AuthRequest } from '../middleware/authMiddleware';

export class MapsController {
  static async searchPlaces(req: Request, res: Response) {
    try {
      const query = (req.query.query as string) || 'Sightseeing';
      const location = req.query.location as string;
      const results = await MapsService.searchPlaces(query, location);
      return res.json(results);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getNearby(req: Request, res: Response) {
    try {
      const lat = Number(req.query.lat) || 15.2993;
      const lng = Number(req.query.lng) || 74.124;
      const type = (req.query.type as string) || 'restaurant';
      const destination = (req.query.destination as string) || (req.query.location as string) || '';
      const results = await MapsService.getNearby(lat, lng, type, destination);
      return res.json(results);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getDirections(req: Request, res: Response) {
    try {
      const origin = (req.query.origin as string) || 'Airport';
      const destination = (req.query.destination as string) || 'Hotel';
      const directions = await MapsService.getDirections(origin, destination);
      return res.json(directions);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getSavedPlaces(req: AuthRequest, res: Response) {
    try {
      const places = await DatabaseService.getSavedPlaces(req.user?.id || 'usr_demo_1');
      return res.json(places);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async savePlace(req: AuthRequest, res: Response) {
    try {
      const place = await DatabaseService.savePlace(req.user?.id || 'usr_demo_1', req.body);
      return res.status(201).json(place);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async removeSavedPlace(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      await DatabaseService.removeSavedPlace(id);
      return res.json({ message: 'Place removed' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
