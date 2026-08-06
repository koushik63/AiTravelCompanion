import axios from 'axios';
import { Logger } from '../utils/logger';
import { GeminiService } from './GeminiService';

export interface FlightStatusResult {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  terminal: string;
  gate: string;
  status: string;
  delayMinutes: number;
  error?: string;
}

const REGISTERED_FLIGHTS: Record<string, FlightStatusResult> = {
  '6E214': {
    flightNumber: '6E 214',
    airline: 'IndiGo Airlines',
    origin: 'Indira Gandhi Int Airport (DEL), New Delhi',
    destination: 'Guwahati Int Airport (GAU), Meghalaya Region',
    departureTime: new Date(Date.now() + 3600000).toISOString(),
    arrivalTime: new Date(Date.now() + 11400000).toISOString(),
    terminal: 'T2',
    gate: 'Gate B4',
    status: 'ON TIME',
    delayMinutes: 0
  },
  'AI729': {
    flightNumber: 'AI 729',
    airline: 'Air India',
    origin: 'Netaji Subhash Chandra Bose Airport (CCU), Kolkata',
    destination: 'Shillong Umroi Airport (SHL), Meghalaya',
    departureTime: new Date(Date.now() + 7200000).toISOString(),
    arrivalTime: new Date(Date.now() + 13500000).toISOString(),
    terminal: 'T1',
    gate: 'Gate 3A',
    status: 'ON TIME',
    delayMinutes: 0
  },
  '6E6109': {
    flightNumber: '6E 6109',
    airline: 'IndiGo Airlines',
    origin: 'Netaji Subhash Chandra Bose Airport (CCU), Kolkata',
    destination: 'Guwahati Int Airport (GAU), Meghalaya Region',
    departureTime: new Date(Date.now() + 14400000).toISOString(),
    arrivalTime: new Date(Date.now() + 19200000).toISOString(),
    terminal: 'T2',
    gate: 'Gate A12',
    status: 'ON TIME',
    delayMinutes: 0
  },
  'UK891': {
    flightNumber: 'UK 891',
    airline: 'Vistara Airlines',
    origin: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    destination: 'Guwahati Int Airport (GAU), Meghalaya Region',
    departureTime: new Date(Date.now() + 18000000).toISOString(),
    arrivalTime: new Date(Date.now() + 29100000).toISOString(),
    terminal: 'T2',
    gate: 'Gate 45',
    status: 'ON TIME',
    delayMinutes: 0
  },
  '6E504': {
    flightNumber: '6E 504',
    airline: 'IndiGo Airlines',
    origin: 'Indira Gandhi Int Airport (DEL), New Delhi',
    destination: 'Goa Dabolim Airport (GOI), Goa',
    departureTime: new Date(Date.now() + 5400000).toISOString(),
    arrivalTime: new Date(Date.now() + 14700000).toISOString(),
    terminal: 'T2',
    gate: 'Gate 14',
    status: 'ON TIME',
    delayMinutes: 0
  },
  'AI883': {
    flightNumber: 'AI 883',
    airline: 'Air India',
    origin: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    destination: 'Goa Manohar Mopa Airport (GOX), Goa',
    departureTime: new Date(Date.now() + 9000000).toISOString(),
    arrivalTime: new Date(Date.now() + 13500000).toISOString(),
    terminal: 'T2',
    gate: 'Gate A8',
    status: 'ON TIME',
    delayMinutes: 0
  },
  '6E218': {
    flightNumber: '6E 218',
    airline: 'IndiGo Airlines',
    origin: 'Indira Gandhi Int Airport (DEL), New Delhi',
    destination: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    departureTime: new Date(Date.now() + 2700000).toISOString(),
    arrivalTime: new Date(Date.now() + 10800000).toISOString(),
    terminal: 'T2',
    gate: 'Gate B2',
    status: 'ON TIME',
    delayMinutes: 0
  },
  'AI101': {
    flightNumber: 'AI 101',
    airline: 'Air India',
    origin: 'Indira Gandhi Int Airport (DEL), New Delhi',
    destination: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    departureTime: new Date(Date.now() + 7200000).toISOString(),
    arrivalTime: new Date(Date.now() + 15300000).toISOString(),
    terminal: 'T3',
    gate: 'Gate 18',
    status: 'ON TIME',
    delayMinutes: 0
  },
  'UK815': {
    flightNumber: 'UK 815',
    airline: 'Vistara Airlines',
    origin: 'Kempegowda Int Airport (BLR), Bengaluru',
    destination: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    departureTime: new Date(Date.now() + 4500000).toISOString(),
    arrivalTime: new Date(Date.now() + 10800000).toISOString(),
    terminal: 'T2',
    gate: 'Gate 10',
    status: 'ON TIME',
    delayMinutes: 0
  },
  'SQ421': {
    flightNumber: 'SQ 421',
    airline: 'Singapore Airlines',
    origin: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    destination: 'Changi Airport (SIN), Singapore',
    departureTime: new Date(Date.now() + 21600000).toISOString(),
    arrivalTime: new Date(Date.now() + 49800000).toISOString(),
    terminal: 'T2',
    gate: 'Gate 72',
    status: 'ON TIME',
    delayMinutes: 0
  },
  'EK500': {
    flightNumber: 'EK 500',
    airline: 'Emirates',
    origin: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    destination: 'Dubai Int Airport (DXB), UAE',
    departureTime: new Date(Date.now() + 10800000).toISOString(),
    arrivalTime: new Date(Date.now() + 22500000).toISOString(),
    terminal: 'T2',
    gate: 'Gate 64',
    status: 'ON TIME',
    delayMinutes: 0
  },
  'JL001': {
    flightNumber: 'JL 001',
    airline: 'Japan Airlines',
    origin: 'Indira Gandhi Int Airport (DEL), New Delhi',
    destination: 'Haneda Airport (HND), Tokyo',
    departureTime: new Date(Date.now() + 18000000).toISOString(),
    arrivalTime: new Date(Date.now() + 54000000).toISOString(),
    terminal: 'T3',
    gate: 'Gate 14',
    status: 'ON TIME',
    delayMinutes: 0
  }
};

export class FlightService {
  static async getFlightStatus(flightNumber: string, destinationParam?: string): Promise<FlightStatusResult> {
    const code = (flightNumber || '').trim().replace(/\s+/g, '').toUpperCase();
    const destCity = (destinationParam || '').trim().toLowerCase();

    // 1. IF AN EXPLICIT FLIGHT CODE WAS SEARCHED:
    if (code) {
      // Try Gemini AI Real-time lookup
      const aiResult = await GeminiService.getRealTimeFlightStatus(flightNumber, destinationParam);
      if (aiResult) return aiResult;

      if (REGISTERED_FLIGHTS[code]) {
        return REGISTERED_FLIGHTS[code];
      }
      return {
        flightNumber: flightNumber.toUpperCase(),
        airline: 'Commercial Airline',
        origin: 'N/A',
        destination: 'N/A',
        departureTime: new Date().toISOString(),
        arrivalTime: new Date().toISOString(),
        terminal: 'N/A',
        gate: 'N/A',
        status: 'FLIGHT NOT FOUND',
        delayMinutes: 0,
        error: `Flight code "${flightNumber}" is not registered in live flight tracking databases. Please select an available flight from the directory.`
      };
    }

    // 2. ONLY IF NO FLIGHT CODE WAS SEARCHED: USE DESTINATION FALLBACK
    if (destCity) {
      if (destCity.includes('meghalaya') || destCity.includes('shillong') || destCity.includes('guwahati')) {
        return REGISTERED_FLIGHTS['6E214'];
      }
      if (destCity.includes('goa')) {
        return REGISTERED_FLIGHTS['6E504'];
      }
      if (destCity.includes('mumbai')) {
        return REGISTERED_FLIGHTS['6E218'];
      }
      if (destCity.includes('singapore')) {
        return REGISTERED_FLIGHTS['SQ421'];
      }
      if (destCity.includes('dubai')) {
        return REGISTERED_FLIGHTS['EK500'];
      }
    }

    return REGISTERED_FLIGHTS['6E214'];
  }
}
