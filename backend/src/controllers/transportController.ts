import { Request, Response } from 'express';
import { FlightService } from '../services/FlightService';
import { TrainService } from '../services/TrainService';
import { DatabaseService } from '../services/DatabaseService';

export class TransportController {
  static async getFlightStatus(req: Request, res: Response) {
    try {
      const flightNumber = (req.query.flightNumber as string) || '';
      const destination = (req.query.destination as string) || '';
      const status = await FlightService.getFlightStatus(flightNumber, destination);
      return res.json(status);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async searchFlights(req: Request, res: Response) {
    try {
      const origin = (req.query.origin as string) || 'DEL';
      const destination = (req.query.destination as string) || 'BOM';
      const outboundDate = (req.query.outboundDate as string) || '';
      const flights = await FlightService.searchFlightsSerpApi(origin, destination, outboundDate);
      return res.json(flights);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getTrainStatus(req: Request, res: Response) {
    try {
      const trainNumber = (req.query.trainNumber as string) || '';
      const destination = (req.query.destination as string) || '';
      const status = await TrainService.getTrainStatus(trainNumber, destination);
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
