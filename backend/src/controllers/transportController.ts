import { Request, Response } from 'express';
import { FlightService } from '../services/FlightService';
import { TrainService } from '../services/TrainService';
import { DatabaseService } from '../services/DatabaseService';

export class TransportController {
  static async getFlightStatus(req: Request, res: Response) {
    try {
      const flightNumber = (req.query.flightNumber as string) || 'JL 001';
      const status = await FlightService.getFlightStatus(flightNumber);
      return res.json(status);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getTrainStatus(req: Request, res: Response) {
    try {
      const trainNumber = (req.query.trainNumber as string) || '12951';
      const status = await TrainService.getTrainStatus(trainNumber);
      return res.json(status);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getTickets(req: Request, res: Response) {
    try {
      const trip = await DatabaseService.getTripById('trip_1');
      return res.json(trip?.transportTickets || []);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
