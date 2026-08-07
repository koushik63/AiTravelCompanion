import { Request, Response } from 'express';
import { GeminiService } from '../services/GeminiService';
import { DatabaseService } from '../services/DatabaseService';
import { AuthRequest } from '../middleware/authMiddleware';

export class AIController {
  static async generateItinerary(req: AuthRequest, res: Response) {
    try {
      console.log(`[AIController.generateItinerary] Received request for destination: "${req.body?.destination}"`);
      const result = await GeminiService.generateItinerary(req.body);
      return res.json(result);
    } catch (err: any) {
      console.error('[AIController.generateItinerary Error]:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  static async regenerateItinerary(req: AuthRequest, res: Response) {
    try {
      console.log(`[AIController.regenerateItinerary] Force regenerate for destination: "${req.body?.destination}"`);
      const result = await GeminiService.generateItinerary({ ...req.body, forceRegenerate: true });
      return res.json(result);
    } catch (err: any) {
      console.error('[AIController.regenerateItinerary Error]:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  static async saveItinerary(req: AuthRequest, res: Response) {
    try {
      const { itinerary, destination, budget, startDate, endDate } = req.body;
      const trip = await DatabaseService.createTrip({
        userId: req.user?.id || 'usr_demo_1',
        title: itinerary.tripTitle || `AI Journey to ${destination}`,
        destination,
        budget: Number(budget) || 50000,
        startDate: startDate || new Date().toISOString(),
        endDate: endDate || new Date(Date.now() + 604800000).toISOString(),
        status: 'UPCOMING'
      });

      return res.status(201).json({ message: 'Itinerary saved to trip', trip });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async generatePackingList(req: AuthRequest, res: Response) {
    try {
      const result = await GeminiService.generatePackingList(req.body);
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async suggestPlaces(req: AuthRequest, res: Response) {
    try {
      const { destination, category } = req.body;
      const places = await GeminiService.suggestPlaces(destination || 'India', category || 'Sightseeing');
      return res.json(places);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async adjustWeather(req: AuthRequest, res: Response) {
    try {
      const { destination, currentWeather, activities } = req.body;
      const adjusted = await GeminiService.adjustWeather(destination, currentWeather, activities || []);
      return res.json(adjusted);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getBudgetTips(req: AuthRequest, res: Response) {
    try {
      const { destination, totalBudget, currency } = req.body;
      const tips = await GeminiService.getBudgetTips(destination || 'India', Number(totalBudget) || 50000, currency || 'INR');
      return res.json(tips);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async assistantChat(req: AuthRequest, res: Response) {
    try {
      const { message, tripContext, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      const response = await GeminiService.assistantChat(message, tripContext, history);
      return res.json(response);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
