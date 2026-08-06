import axios from 'axios';
import { Logger } from '../utils/logger';

export class MapsService {
  static async searchPlaces(query: string, location?: string) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (apiKey) {
      try {
        const res = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, {
          params: { query, location, key: apiKey }
        });
        return res.data.results;
      } catch (err) {
        Logger.error('Google Maps API Error, using fallback', err, 'MapsService');
      }
    }
    // Demo fallback places
    return [
      { id: 'place_1', name: `${query} Landmark`, address: 'Main Express Road', rating: 4.8, distanceKm: 1.2, lat: 15.2993, lng: 74.124 },
      { id: 'place_2', name: `${query} Hub`, address: 'Beachside Promenade', rating: 4.6, distanceKm: 2.5, lat: 15.301, lng: 74.128 }
    ];
  }

  static async getNearby(lat: number, lng: number, type: string) {
    return [
      { id: 'near_1', name: `Popular ${type} Spot`, category: type, address: 'Near Central Station', rating: 4.7, distanceKm: 0.8, lat: lat + 0.002, lng: lng + 0.003 },
      { id: 'near_2', name: `Top-Rated ${type} Center`, category: type, address: 'Downtown Boulevard', rating: 4.9, distanceKm: 1.5, lat: lat - 0.003, lng: lng - 0.002 }
    ];
  }

  static async getDirections(origin: string, destination: string) {
    return {
      origin,
      destination,
      distanceText: '14.2 km',
      durationText: '28 mins',
      steps: [
        { instruction: 'Head North toward Main Boulevard', distance: '2.0 km' },
        { instruction: 'Turn Right onto Express Highway', distance: '10.5 km' },
        { instruction: 'Arrive at destination', distance: '1.7 km' }
      ]
    };
  }
}
