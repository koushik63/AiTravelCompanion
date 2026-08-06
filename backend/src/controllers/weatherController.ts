import { Request, Response } from 'express';
import { WeatherService } from '../services/WeatherService';

export class WeatherController {
  static async getCurrentWeather(req: Request, res: Response) {
    try {
      const city = (req.query.city as string) || 'Tokyo';
      const weather = await WeatherService.getCurrentWeather(city);
      return res.json(weather);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getForecast(req: Request, res: Response) {
    try {
      const city = (req.query.city as string) || 'Tokyo';
      const forecast = await WeatherService.getForecast(city);
      return res.json(forecast);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
