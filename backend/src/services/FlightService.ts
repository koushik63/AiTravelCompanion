import axios from 'axios';
import { Logger } from '../utils/logger';

export class FlightService {
  static async getFlightStatus(flightNumber: string) {
    const apiKey = process.env.AVIATIONSTACK_API_KEY;
    if (apiKey) {
      try {
        const res = await axios.get(`http://api.aviationstack.com/v1/flights`, {
          params: { access_key: apiKey, flight_iata: flightNumber }
        });
        if (res.data.data && res.data.data[0]) {
          const f = res.data.data[0];
          return {
            flightNumber: f.flight.iata || flightNumber,
            airline: f.airline.name || 'Airline',
            origin: f.departure.airport || 'Departure Airport',
            destination: f.arrival.airport || 'Arrival Airport',
            departureTime: f.departure.scheduled || new Date().toISOString(),
            arrivalTime: f.arrival.scheduled || new Date(Date.now() + 7200000).toISOString(),
            terminal: f.departure.terminal || 'T2',
            gate: f.departure.gate || 'B14',
            status: f.flight_status || 'On Time',
            delayMinutes: f.departure.delay || 0
          };
        }
      } catch (err) {
        Logger.error('AviationStack API Error, using fallback', err, 'FlightService');
      }
    }
    // Demo flight status fallback
    return {
      flightNumber: flightNumber || '6E 504',
      airline: 'IndiGo Airlines',
      origin: 'Indira Gandhi Int Airport (DEL), New Delhi',
      destination: 'Dabolim Airport (GOI), Goa',
      departureTime: new Date(Date.now() + 3600000).toISOString(),
      arrivalTime: new Date(Date.now() + 12600000).toISOString(),
      terminal: 'T3',
      gate: '14B',
      status: 'On Time',
      delayMinutes: 0
    };
  }
}
