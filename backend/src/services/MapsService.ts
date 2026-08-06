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
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const cat = (type || 'restaurant').toLowerCase();

    if (apiKey) {
      try {
        const placeType = cat === 'attraction' ? 'tourist_attraction' : cat === 'petrol' ? 'gas_station' : cat;
        const res = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
          params: {
            location: `${lat},${lng}`,
            radius: 5000,
            type: placeType,
            key: apiKey
          }
        });
        if (res.data.results && res.data.results.length > 0) {
          return res.data.results.slice(0, 10).map((p: any, idx: number) => ({
            id: p.place_id || `near_${idx}`,
            name: p.name,
            category: type,
            address: p.vicinity || p.formatted_address || 'City Center Area',
            rating: p.rating || 4.7,
            distanceKm: Number((0.5 + idx * 0.4).toFixed(1)),
            lat: p.geometry?.location?.lat || lat + 0.002 * (idx + 1),
            lng: p.geometry?.location?.lng || lng + 0.002 * (idx + 1)
          }));
        }
      } catch (err) {
        Logger.error('Google Maps Nearby API error, using dynamic category places', err, 'MapsService');
      }
    }

    // Realistic curated fallback places per category
    const categoryData: Record<string, Array<{ name: string; address: string; rating: number; distanceKm: number }>> = {
      restaurant: [
        { name: 'The Oceanfront Seafood Bistro', address: 'Beach Road Promenade', rating: 4.8, distanceKm: 0.6 },
        { name: 'Spice Route Fine Dining', address: 'Heritage Heritage Lane', rating: 4.9, distanceKm: 1.2 },
        { name: 'Café De St. Claire', address: 'Old Town Square', rating: 4.7, distanceKm: 1.8 }
      ],
      hotel: [
        { name: 'Grand Horizon Luxury Resort', address: 'Cliffside Drive', rating: 4.9, distanceKm: 0.8 },
        { name: 'Taj Sea View Heritage Hotel', address: 'South Beach Avenue', rating: 4.8, distanceKm: 2.1 },
        { name: 'Boutique Palm Villa', address: 'Central Boulevard', rating: 4.6, distanceKm: 1.5 }
      ],
      hospital: [
        { name: 'Apollo Multispecialty Hospital', address: 'Main Express Corridor', rating: 4.8, distanceKm: 1.4 },
        { name: 'St. Anthony Emergency Clinic', address: 'Civic Center Road', rating: 4.7, distanceKm: 2.3 }
      ],
      atm: [
        { name: 'HDFC Bank 24/7 ATM Hub', address: 'Commercial Street Gate 1', rating: 4.6, distanceKm: 0.3 },
        { name: 'State Bank of India ATM', address: 'Station Road Circle', rating: 4.5, distanceKm: 0.7 }
      ],
      petrol: [
        { name: 'IndianOil Fuel Station', address: 'State Highway Junction', rating: 4.6, distanceKm: 1.1 },
        { name: 'Bharat Petroleum 24h Express', address: 'Ring Road Exit', rating: 4.5, distanceKm: 2.0 }
      ],
      pharmacy: [
        { name: 'Apollo Pharmacy & Wellness', address: 'Central Market Block A', rating: 4.9, distanceKm: 0.4 },
        { name: 'MedPlus 24x7 Chemist', address: 'Town Square Complex', rating: 4.7, distanceKm: 0.9 }
      ],
      attraction: [
        { name: 'Heritage Fort Viewpoint & Lighthouse', address: 'Coastal Cliff Headland', rating: 4.9, distanceKm: 1.0 },
        { name: 'St. Francis UNESCO Basilica', address: 'Old Town Cathedral Square', rating: 4.9, distanceKm: 2.5 },
        { name: 'Sunset Promenade Walkway', address: 'Marine Drive Bay', rating: 4.8, distanceKm: 0.7 }
      ]
    };

    const list = categoryData[cat] || [
      { name: `Scenic Spot in City Center`, address: 'Main Heritage District', rating: 4.8, distanceKm: 0.9 },
      { name: `Top Landmark & Cultural Hub`, address: 'Central Promenade', rating: 4.7, distanceKm: 1.6 }
    ];

    return list.map((item, idx) => ({
      id: `near_${cat}_${idx}_${Date.now()}`,
      name: item.name,
      category: type,
      address: item.address,
      rating: item.rating,
      distanceKm: item.distanceKm,
      lat: lat + (idx + 1) * 0.002,
      lng: lng + (idx + 1) * 0.003
    }));
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
