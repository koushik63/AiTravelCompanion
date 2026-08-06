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

  static async getNearby(lat: number, lng: number, type: string, destination?: string) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const cat = (type || 'restaurant').toLowerCase();
    const dest = (destination || '').toLowerCase();

    if (apiKey) {
      try {
        const placeType = cat === 'attraction' ? 'tourist_attraction' : cat === 'petrol' ? 'gas_station' : cat;
        const queryStr = dest ? `${cat} in ${dest}` : undefined;
        const res = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
          params: {
            location: `${lat},${lng}`,
            radius: 5000,
            type: placeType,
            keyword: queryStr,
            key: apiKey
          }
        });
        if (res.data.results && res.data.results.length > 0) {
          return res.data.results.slice(0, 10).map((p: any, idx: number) => ({
            id: p.place_id || `near_${idx}`,
            name: p.name,
            category: type,
            address: p.vicinity || p.formatted_address || `${dest || 'City Center'} Area`,
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

    // City-Specific Knowledge Base for Fallback Places
    if (dest.includes('mumbai')) {
      const mumbaiPlaces: Record<string, Array<{ name: string; address: string; rating: number; distanceKm: number }>> = {
        restaurant: [
          { name: 'Leopold Café & Bar', address: 'Colaba Causeway, South Mumbai', rating: 4.7, distanceKm: 0.5 },
          { name: 'Britannia & Co. Parsi Restaurant', address: 'Ballard Estate, Fort, Mumbai', rating: 4.8, distanceKm: 1.2 },
          { name: 'Bastian Seafood & Grill', address: 'Bandra West, Mumbai', rating: 4.9, distanceKm: 2.8 }
        ],
        hotel: [
          { name: 'The Taj Mahal Palace & Tower', address: 'Apollo Bunder, Colaba, Mumbai', rating: 4.9, distanceKm: 0.3 },
          { name: 'The Oberoi Mumbai', address: 'Nariman Point, Marine Drive, Mumbai', rating: 4.9, distanceKm: 1.5 },
          { name: 'Soho House Mumbai', address: 'Juhu Tara Road, Mumbai', rating: 4.8, distanceKm: 4.2 }
        ],
        attraction: [
          { name: 'Gateway of India', address: 'Apollo Bunder, Waterfront, Mumbai', rating: 4.9, distanceKm: 0.2 },
          { name: 'Marine Drive Queen’s Necklace Promenade', address: 'Marine Drive Bay, South Mumbai', rating: 4.9, distanceKm: 1.1 },
          { name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', address: 'Fort, Mumbai', rating: 4.8, distanceKm: 1.8 }
        ]
      };
      const list = mumbaiPlaces[cat] || mumbaiPlaces.restaurant;
      return list.map((item, idx) => ({ id: `near_mum_${idx}_${Date.now()}`, name: item.name, category: type, address: item.address, rating: item.rating, distanceKm: item.distanceKm, lat: 18.922 + idx * 0.005, lng: 72.833 + idx * 0.005 }));
    }

    if (dest.includes('bali')) {
      const baliPlaces: Record<string, Array<{ name: string; address: string; rating: number; distanceKm: number }>> = {
        restaurant: [
          { name: 'Warung Babi Guling Ibu Oka', address: 'Jalan Suweta, Ubud, Bali', rating: 4.8, distanceKm: 0.7 },
          { name: 'Motel Mexicola Beachside Lounge', address: 'Jalan Kayu Jati, Seminyak, Bali', rating: 4.9, distanceKm: 1.4 },
          { name: 'Bebek Tepi Sawah Duck Bistro', address: 'Jalan Goa Gajah, Ubud, Bali', rating: 4.7, distanceKm: 2.1 }
        ],
        hotel: [
          { name: 'Pramana Watu Kurung Villa', address: 'Kedewatan, Ubud, Bali', rating: 4.9, distanceKm: 1.0 },
          { name: 'The Anvaya Beach Resort', address: 'Kartika Plaza, Kuta, Bali', rating: 4.8, distanceKm: 2.5 }
        ],
        attraction: [
          { name: 'Tegallalang Scenic Rice Terraces', address: 'Jalan Tegallalang, Gianyar, Bali', rating: 4.9, distanceKm: 0.8 },
          { name: 'Uluwatu Cliff Temple & Sunset Amphitheater', address: 'Pecatu, South Kuta, Bali', rating: 4.9, distanceKm: 3.2 }
        ]
      };
      const list = baliPlaces[cat] || baliPlaces.restaurant;
      return list.map((item, idx) => ({ id: `near_bali_${idx}_${Date.now()}`, name: item.name, category: type, address: item.address, rating: item.rating, distanceKm: item.distanceKm, lat: -8.409 + idx * 0.005, lng: 115.188 + idx * 0.005 }));
    }

    // Dynamic Generic Fallback for Any Other City
    const cityLabel = destination ? destination : 'City Center';
    const genericPlaces: Record<string, Array<{ name: string; address: string; rating: number; distanceKm: number }>> = {
      restaurant: [
        { name: `The Heritage Kitchen in ${cityLabel}`, address: `Central Avenue, ${cityLabel}`, rating: 4.8, distanceKm: 0.6 },
        { name: `Skyline Rooftop Lounge & Bistro`, address: `Downtown Boulevard, ${cityLabel}`, rating: 4.9, distanceKm: 1.2 }
      ],
      hotel: [
        { name: `Grand Palace Hotel ${cityLabel}`, address: `Commercial Promenade, ${cityLabel}`, rating: 4.9, distanceKm: 0.8 },
        { name: `Boutique Palm Suites`, address: `Main Heritage Quarter, ${cityLabel}`, rating: 4.7, distanceKm: 1.5 }
      ],
      attraction: [
        { name: `Famous Viewpoint & Heritage Fort`, address: `Cliffside Headland, ${cityLabel}`, rating: 4.9, distanceKm: 1.0 },
        { name: `National Cultural Plaza & Museum`, address: `Civic Square, ${cityLabel}`, rating: 4.8, distanceKm: 1.7 }
      ]
    };

    const list = genericPlaces[cat] || genericPlaces.restaurant;
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
