export interface BackendAirport {
  city: string;
  airportName: string;
  airportCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface BackendStation {
  city: string;
  stationName: string;
  stationCode: string;
  state: string;
}

export const BACKEND_AIRPORTS: BackendAirport[] = [
  { city: 'Hyderabad', airportName: 'Rajiv Gandhi International Airport', airportCode: 'HYD', country: 'India' },
  { city: 'Delhi', airportName: 'Indira Gandhi International Airport', airportCode: 'DEL', country: 'India' },
  { city: 'New Delhi', airportName: 'Indira Gandhi International Airport', airportCode: 'DEL', country: 'India' },
  { city: 'Mumbai', airportName: 'Chhatrapati Shivaji Maharaj International Airport', airportCode: 'BOM', country: 'India' },
  { city: 'Bengaluru', airportName: 'Kempegowda International Airport', airportCode: 'BLR', country: 'India' },
  { city: 'Bangalore', airportName: 'Kempegowda International Airport', airportCode: 'BLR', country: 'India' },
  { city: 'Chennai', airportName: 'Chennai International Airport', airportCode: 'MAA', country: 'India' },
  { city: 'Kolkata', airportName: 'Netaji Subhash Chandra Bose International Airport', airportCode: 'CCU', country: 'India' },
  { city: 'Pune', airportName: 'Pune International Airport', airportCode: 'PNQ', country: 'India' },
  { city: 'Ahmedabad', airportName: 'Sardar Vallabhbhai Patel International Airport', airportCode: 'AMD', country: 'India' },
  { city: 'Goa', airportName: 'Goa Dabolim Airport', airportCode: 'GOI', country: 'India' },
  { city: 'Jaipur', airportName: 'Jaipur International Airport', airportCode: 'JAI', country: 'India' },
  { city: 'Lucknow', airportName: 'Chaudhary Charan Singh International Airport', airportCode: 'LKO', country: 'India' },
  { city: 'Visakhapatnam', airportName: 'Visakhapatnam International Airport', airportCode: 'VTZ', country: 'India' },
  { city: 'Vizag', airportName: 'Visakhapatnam International Airport', airportCode: 'VTZ', country: 'India' },
  { city: 'Araku', airportName: 'Visakhapatnam International Airport', airportCode: 'VTZ', country: 'India' },
  { city: 'Dubai', airportName: 'Dubai International Airport', airportCode: 'DXB', country: 'UAE' },
  { city: 'Singapore', airportName: 'Changi Airport', airportCode: 'SIN', country: 'Singapore' },
  { city: 'Tokyo', airportName: 'Haneda Airport', airportCode: 'HND', country: 'Japan' },
  { city: 'Paris', airportName: 'Charles de Gaulle Airport', airportCode: 'CDG', country: 'France' }
];

export const BACKEND_STATIONS: BackendStation[] = [
  { city: 'Hyderabad', stationName: 'Secunderabad Junction', stationCode: 'SC', state: 'Telangana' },
  { city: 'Hyderabad', stationName: 'Hyderabad Deccan Nampally', stationCode: 'HYB', state: 'Telangana' },
  { city: 'Hyderabad', stationName: 'Kacheguda Junction', stationCode: 'KCG', state: 'Telangana' },
  { city: 'Delhi', stationName: 'New Delhi Railway Station', stationCode: 'NDLS', state: 'Delhi' },
  { city: 'Delhi', stationName: 'Hazrat Nizamuddin Railway Station', stationCode: 'NZM', state: 'Delhi' },
  { city: 'Mumbai', stationName: 'Mumbai CSMT', stationCode: 'CSMT', state: 'Maharashtra' },
  { city: 'Bengaluru', stationName: 'KSR Bengaluru', stationCode: 'SBC', state: 'Karnataka' },
  { city: 'Chennai', stationName: 'MGR Chennai Central', stationCode: 'MAS', state: 'Tamil Nadu' },
  { city: 'Kolkata', stationName: 'Howrah Junction', stationCode: 'HWH', state: 'West Bengal' },
  { city: 'Visakhapatnam', stationName: 'Visakhapatnam Junction', stationCode: 'VSKP', state: 'Andhra Pradesh' },
  { city: 'Vizag', stationName: 'Visakhapatnam Junction', stationCode: 'VSKP', state: 'Andhra Pradesh' },
  { city: 'Araku', stationName: 'Araku Railway Station', stationCode: 'ARK', state: 'Andhra Pradesh' },
  { city: 'Goa', stationName: 'Madgaon Junction', stationCode: 'MAO', state: 'Goa' },
  { city: 'Jaipur', stationName: 'Jaipur Junction', stationCode: 'JP', state: 'Rajasthan' }
];

export class LocationResolverService {
  static resolveAirport(query: string): BackendAirport {
    const q = (query || '').trim().toLowerCase();
    if (!q) {
      return { city: 'Delhi', airportName: 'Indira Gandhi International Airport', airportCode: 'DEL', country: 'India' };
    }

    const byCode = BACKEND_AIRPORTS.find((a) => a.airportCode.toLowerCase() === q);
    if (byCode) return byCode;

    const byCity = BACKEND_AIRPORTS.find((a) => a.city.toLowerCase() === q);
    if (byCity) return byCity;

    const partial = BACKEND_AIRPORTS.find((a) => a.city.toLowerCase().includes(q) || a.airportName.toLowerCase().includes(q));
    if (partial) return partial;

    const code = q.slice(0, 3).toUpperCase();
    const cap = query.charAt(0).toUpperCase() + query.slice(1);
    return { city: cap, airportName: `${cap} International Airport`, airportCode: code, country: 'International' };
  }

  static resolveStation(query: string): BackendStation {
    const q = (query || '').trim().toLowerCase();
    if (!q) {
      return { city: 'Delhi', stationName: 'New Delhi Railway Station', stationCode: 'NDLS', state: 'Delhi' };
    }

    const byCode = BACKEND_STATIONS.find((s) => s.stationCode.toLowerCase() === q);
    if (byCode) return byCode;

    const byCity = BACKEND_STATIONS.find((s) => s.city.toLowerCase() === q);
    if (byCity) return byCity;

    const partial = BACKEND_STATIONS.find((s) => s.city.toLowerCase().includes(q) || s.stationName.toLowerCase().includes(q));
    if (partial) return partial;

    const code = q.slice(0, 4).toUpperCase();
    const cap = query.charAt(0).toUpperCase() + query.slice(1);
    return { city: cap, stationName: `${cap} Central`, stationCode: code, state: 'India' };
  }
}
