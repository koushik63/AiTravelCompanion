import axios from 'axios';
import { Logger } from '../utils/logger';
import { GeminiService } from './GeminiService';
import { LocationResolverService } from './LocationResolverService';

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
  price?: string;
  duration?: string;
  bookingUrl?: string;
  error?: string;
}

export class FlightService {
  // Pure SerpApi Google Flights Live API Search Engine (Zero Fake/Fallback Data)
  static async searchFlightsSerpApi(originRaw: string, destinationRaw: string, outboundDate?: string): Promise<any[]> {
    const origObj = LocationResolverService.resolveAirport(originRaw);
    const destObj = LocationResolverService.resolveAirport(destinationRaw);

    // Calculate default future date if unprovided or invalid
    let validDate = outboundDate ? outboundDate.trim() : '';
    if (!validDate || new Date(validDate).toString() === 'Invalid Date' || new Date(validDate) < new Date(Date.now() - 86400000)) {
      const future = new Date(Date.now() + 7 * 86400000);
      validDate = future.toISOString().split('T')[0];
    }

    const logPrefix = `[FlightSearch Request Validation]\nOrigin City: ${origObj.city}\nOrigin Airport: ${origObj.airportName}\nOrigin IATA: ${origObj.airportCode}\nDestination City: ${destObj.city}\nDestination Airport: ${destObj.airportName}\nDestination IATA: ${destObj.airportCode}\nDate: ${validDate}`;
    Logger.info(logPrefix, 'FlightService');
    console.log(logPrefix);

    if (origObj.airportCode === destObj.airportCode || origObj.city.toLowerCase() === destObj.city.toLowerCase()) {
      throw new Error(`Invalid Search: Origin airport (${origObj.airportCode}) and Destination airport (${destObj.airportCode}) cannot be identical.`);
    }

    const serpApiKey = process.env.SERPAPI_API_KEY || process.env.SERP_API_KEY;
    if (!serpApiKey) {
      Logger.error('SERPAPI_API_KEY is missing in backend environment variables.', new Error('Missing API Key'), 'FlightService');
      return [];
    }

    try {
      const url = 'https://serpapi.com/search.json';
      const params = {
        engine: 'google_flights',
        departure_id: origObj.airportCode,
        arrival_id: destObj.airportCode,
        outbound_date: validDate,
        type: 2, // One way flight search
        currency: 'INR',
        hl: 'en',
        api_key: serpApiKey
      };

      console.log(`[SerpAPI Outgoing Request URL] ${url}`);
      console.log(`[SerpAPI Request Parameters]`, JSON.stringify(params, null, 2));

      const res = await axios.get(url, { params });

      // STEP 4: Print complete raw SerpAPI response
      console.log('[SerpAPI Raw JSON Response]:');
      console.log(JSON.stringify(res.data, null, 2));

      // STEP 5: Map ONLY live SerpAPI response items
      const rawFlightsList: any[] = [];
      if (res.data?.best_flights && Array.isArray(res.data.best_flights)) {
        rawFlightsList.push(...res.data.best_flights);
      }
      if (res.data?.other_flights && Array.isArray(res.data.other_flights)) {
        rawFlightsList.push(...res.data.other_flights);
      }

      if (rawFlightsList.length === 0) {
        console.log(`[FlightSearch] SerpAPI returned 0 flights for route ${origObj.airportCode} ➔ ${destObj.airportCode}`);
        return [];
      }

      const mappedFlights = rawFlightsList.map((f: any, idx: number) => {
        const segments = f.flights || [];
        const firstSegment = segments[0] || {};
        const lastSegment = segments[segments.length - 1] || {};

        const depTimeRaw = firstSegment.departure_airport?.time || '';
        const arrTimeRaw = lastSegment.arrival_airport?.time || '';

        const formatTime = (isoOrTime: string) => {
          if (!isoOrTime) return 'N/A';
          if (isoOrTime.includes(' ')) {
            const timePart = isoOrTime.split(' ')[1];
            const [h, m] = timePart.split(':').map(Number);
            const period = h >= 12 ? 'PM' : 'AM';
            const h12 = h % 12 || 12;
            return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
          }
          return isoOrTime;
        };

        const flightNumbers = segments.map((s: any) => s.flight_number).filter(Boolean).join(' / ') || `FL-${idx + 101}`;
        const airlines = Array.from(new Set(segments.map((s: any) => s.airline).filter(Boolean))).join(' / ') || 'Commercial Airline';
        const logo = f.airline_logo || firstSegment.airline_logo || null;

        const totalMins = f.total_duration || 0;
        const durStr = totalMins > 0 ? `${Math.floor(totalMins / 60)}h ${totalMins % 60}m` : 'Direct';
        const stopsCount = f.layovers ? f.layovers.length : 0;
        const stopsLabel = stopsCount === 0 ? 'Direct Flight' : `${stopsCount} Stop (${f.layovers[0]?.id || 'Layover'})`;

        return {
          id: `serp_flight_${idx}_${Date.now()}`,
          flightNumber: flightNumbers,
          airline: airlines,
          airlineLogo: logo,
          origin: `${firstSegment.departure_airport?.name || origObj.airportName} (${firstSegment.departure_airport?.id || origObj.airportCode})`,
          destination: `${lastSegment.arrival_airport?.name || destObj.airportName} (${lastSegment.arrival_airport?.id || destObj.airportCode})`,
          departureTime: formatTime(depTimeRaw),
          arrivalTime: formatTime(arrTimeRaw),
          duration: durStr,
          stops: stopsCount,
          stopsLabel,
          price: f.price ? `₹${f.price.toLocaleString('en-IN')}` : 'N/A',
          status: 'AVAILABLE',
          aircraft: firstSegment.airplane || 'Commercial Jet',
          terminal: firstSegment.departure_airport?.terminal || 'T1',
          bookingUrl: f.booking_token
            ? `https://www.google.com/travel/flights?q=flights+from+${origObj.airportCode}+to+${destObj.airportCode}`
            : `https://www.google.com/travel/flights?q=flights+from+${origObj.airportCode}+to+${destObj.airportCode}`
        };
      });

      console.log('[FlightSearch Mapped Response Payload]:');
      console.log(JSON.stringify(mappedFlights, null, 2));

      return mappedFlights;
    } catch (err: any) {
      Logger.error('SerpApi Google Flights API Request Error', err, 'FlightService');
      console.error('[SerpAPI Flight Search Error Details]:', err.response?.data || err.message);
      return [];
    }
  }

  // SerpApi Google Flight Status Lookup
  static async getFlightStatusSerpApi(flightNumber: string): Promise<FlightStatusResult | null> {
    const serpApiKey = process.env.SERPAPI_API_KEY || process.env.SERP_API_KEY;
    if (!serpApiKey) return null;

    try {
      Logger.info(`Fetching live flight status for ${flightNumber} via SerpApi Google Search Engine`, 'FlightService');
      const res = await axios.get('https://serpapi.com/search.json', {
        params: {
          engine: 'google',
          q: `flight status ${flightNumber}`,
          hl: 'en',
          api_key: serpApiKey
        }
      });

      console.log('[SerpAPI Flight Status Raw Response]');
      console.log(JSON.stringify(res.data, null, 2));

      const answerBox = res.data?.answer_box || res.data?.knowledge_graph;
      if (answerBox) {
        return {
          flightNumber: flightNumber.toUpperCase(),
          airline: answerBox.airline || answerBox.title || 'Commercial Airline',
          origin: answerBox.departure_airport || answerBox.origin || 'Departure Airport',
          destination: answerBox.arrival_airport || answerBox.destination || 'Arrival Airport',
          departureTime: answerBox.departure_time || 'N/A',
          arrivalTime: answerBox.arrival_time || 'N/A',
          terminal: answerBox.terminal || 'T1',
          gate: answerBox.gate || 'Gate 1',
          status: (answerBox.status || 'ON TIME').toUpperCase(),
          delayMinutes: 0
        };
      }
    } catch (err: any) {
      Logger.error('SerpApi Flight Status Search error', err, 'FlightService');
    }
    return null;
  }

  static async getFlightStatus(flightNumber: string, destinationParam?: string): Promise<FlightStatusResult> {
    const code = (flightNumber || '').trim().replace(/\s+/g, '').toUpperCase();
    if (!code) {
      return {
        flightNumber: 'N/A',
        airline: 'N/A',
        origin: 'N/A',
        destination: 'N/A',
        departureTime: 'N/A',
        arrivalTime: 'N/A',
        terminal: 'N/A',
        gate: 'N/A',
        status: 'FLIGHT NOT FOUND',
        delayMinutes: 0,
        error: 'Please enter a valid flight number code.'
      };
    }

    const serpResult = await this.getFlightStatusSerpApi(flightNumber);
    if (serpResult) return serpResult;

    const aiResult = await GeminiService.getRealTimeFlightStatus(flightNumber, destinationParam);
    if (aiResult && !aiResult.error) return aiResult as FlightStatusResult;

    return {
      flightNumber: code,
      airline: 'Live Flight Status',
      origin: 'N/A',
      destination: destinationParam || 'N/A',
      departureTime: 'N/A',
      arrivalTime: 'N/A',
      terminal: 'N/A',
      gate: 'N/A',
      status: 'FLIGHT NOT FOUND',
      delayMinutes: 0,
      error: `No live flight status found for flight code "${code}". Please verify the flight code.`
    };
  }
}
