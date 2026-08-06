import { Request, Response } from 'express';
import { ExportService } from '../services/ExportService';

export class ExportController {
  static async exportJSON(req: Request, res: Response) {
    try {
      const tripId = String(req.params.tripId || 'trip_1');
      const json = await ExportService.exportTripJSON(tripId);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="trip_${tripId}.json"`);
      return res.send(json);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async exportPDF(req: Request, res: Response) {
    try {
      const tripId = String(req.params.tripId || 'trip_1');
      const html = await ExportService.exportTripPDF(tripId);
      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
