export interface ResolvedAirport {
  city: string;
  airportName: string;
  airportCode: string; // IATA code e.g. HYD, DEL, BOM
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface ResolvedStation {
  city: string;
  stationName: string;
  stationCode: string; // IRCTC code e.g. SC, HYB, NDLS, NZM
  state: string;
}

export interface LocationItem {
  id: string;
  city: string;
  name: string;
  code: string;
  type: 'AIRPORT' | 'STATION';
  subtitle: string;
  countryOrState: string;
}

export const AIRPORT_DATABASE: ResolvedAirport[] = [
  { city: 'Hyderabad', airportName: 'Rajiv Gandhi International Airport', airportCode: 'HYD', country: 'India', latitude: 17.2403, longitude: 78.4294 },
  { city: 'Delhi', airportName: 'Indira Gandhi International Airport', airportCode: 'DEL', country: 'India', latitude: 28.5562, longitude: 77.1000 },
  { city: 'New Delhi', airportName: 'Indira Gandhi International Airport', airportCode: 'DEL', country: 'India', latitude: 28.5562, longitude: 77.1000 },
  { city: 'Mumbai', airportName: 'Chhatrapati Shivaji Maharaj International Airport', airportCode: 'BOM', country: 'India', latitude: 19.0896, longitude: 72.8656 },
  { city: 'Bengaluru', airportName: 'Kempegowda International Airport', airportCode: 'BLR', country: 'India', latitude: 13.1986, longitude: 77.7066 },
  { city: 'Bangalore', airportName: 'Kempegowda International Airport', airportCode: 'BLR', country: 'India', latitude: 13.1986, longitude: 77.7066 },
  { city: 'Chennai', airportName: 'Chennai International Airport', airportCode: 'MAA', country: 'India', latitude: 12.9941, longitude: 80.1709 },
  { city: 'Kolkata', airportName: 'Netaji Subhash Chandra Bose International Airport', airportCode: 'CCU', country: 'India', latitude: 22.6547, longitude: 88.4467 },
  { city: 'Pune', airportName: 'Pune International Airport', airportCode: 'PNQ', country: 'India', latitude: 18.5822, longitude: 73.9197 },
  { city: 'Ahmedabad', airportName: 'Sardar Vallabhbhai Patel International Airport', airportCode: 'AMD', country: 'India', latitude: 23.0772, longitude: 72.6347 },
  { city: 'Goa', airportName: 'Goa Dabolim Airport', airportCode: 'GOI', country: 'India', latitude: 15.3808, longitude: 73.8314 },
  { city: 'Mopa Goa', airportName: 'Manohar International Airport', airportCode: 'GOX', country: 'India', latitude: 15.7686, longitude: 73.8647 },
  { city: 'Jaipur', airportName: 'Jaipur International Airport', airportCode: 'JAI', country: 'India', latitude: 26.8242, longitude: 75.8122 },
  { city: 'Lucknow', airportName: 'Chaudhary Charan Singh International Airport', airportCode: 'LKO', country: 'India', latitude: 26.7606, longitude: 80.8893 },
  { city: 'Visakhapatnam', airportName: 'Visakhapatnam International Airport', airportCode: 'VTZ', country: 'India', latitude: 17.7211, longitude: 83.2245 },
  { city: 'Vizag', airportName: 'Visakhapatnam International Airport', airportCode: 'VTZ', country: 'India', latitude: 17.7211, longitude: 83.2245 },
  { city: 'Araku', airportName: 'Visakhapatnam International Airport (Nearest to Araku)', airportCode: 'VTZ', country: 'India', latitude: 17.7211, longitude: 83.2245 },
  { city: 'Tirupati', airportName: 'Tirupati Airport', airportCode: 'TIR', country: 'India', latitude: 13.6325, longitude: 79.5433 },
  { city: 'Kochi', airportName: 'Cochin International Airport', airportCode: 'COK', country: 'India', latitude: 10.1520, longitude: 76.4019 },
  { city: 'Kerala', airportName: 'Cochin International Airport', airportCode: 'COK', country: 'India', latitude: 10.1520, longitude: 76.4019 },
  { city: 'Guwahati', airportName: 'Lokpriya Gopinath Bordoloi International Airport', airportCode: 'GAU', country: 'India', latitude: 26.1061, longitude: 91.5859 },
  { city: 'Shillong', airportName: 'Shillong Umroi Airport', airportCode: 'SHL', country: 'India', latitude: 25.7036, longitude: 91.9786 },
  { city: 'Dubai', airportName: 'Dubai International Airport', airportCode: 'DXB', country: 'United Arab Emirates', latitude: 25.2532, longitude: 55.3657 },
  { city: 'Singapore', airportName: 'Changi Airport', airportCode: 'SIN', country: 'Singapore', latitude: 1.3644, longitude: 103.9915 },
  { city: 'Tokyo', airportName: 'Haneda Airport', airportCode: 'HND', country: 'Japan', latitude: 35.5494, longitude: 139.7798 },
  { city: 'Paris', airportName: 'Charles de Gaulle Airport', airportCode: 'CDG', country: 'France', latitude: 49.0097, longitude: 2.5479 },
  { city: 'London', airportName: 'Heathrow Airport', airportCode: 'LHR', country: 'United Kingdom', latitude: 51.4700, longitude: -0.4543 },
  { city: 'New York', airportName: 'John F. Kennedy International Airport', airportCode: 'JFK', country: 'United States', latitude: 40.6413, longitude: -73.7781 }
];

export const RAILWAY_STATION_DATABASE: ResolvedStation[] = [
  { city: 'Hyderabad', stationName: 'Secunderabad Junction', stationCode: 'SC', state: 'Telangana' },
  { city: 'Hyderabad', stationName: 'Hyderabad Deccan Nampally', stationCode: 'HYB', state: 'Telangana' },
  { city: 'Hyderabad', stationName: 'Kacheguda Junction', stationCode: 'KCG', state: 'Telangana' },
  { city: 'Secunderabad', stationName: 'Secunderabad Junction', stationCode: 'SC', state: 'Telangana' },
  { city: 'Delhi', stationName: 'New Delhi Railway Station', stationCode: 'NDLS', state: 'Delhi' },
  { city: 'Delhi', stationName: 'Hazrat Nizamuddin Railway Station', stationCode: 'NZM', state: 'Delhi' },
  { city: 'Delhi', stationName: 'Old Delhi Junction', stationCode: 'DLI', state: 'Delhi' },
  { city: 'Delhi', stationName: 'Delhi Sarai Rohilla', stationCode: 'DEE', state: 'Delhi' },
  { city: 'Mumbai', stationName: 'Mumbai Chhatrapati Shivaji Maharaj Terminus', stationCode: 'CSMT', state: 'Maharashtra' },
  { city: 'Mumbai', stationName: 'Mumbai Central', stationCode: 'MMCT', state: 'Maharashtra' },
  { city: 'Mumbai', stationName: 'Dadar Central', stationCode: 'DR', state: 'Maharashtra' },
  { city: 'Mumbai', stationName: 'Kalyan Junction', stationCode: 'KYN', state: 'Maharashtra' },
  { city: 'Bengaluru', stationName: 'KSR Bengaluru City Junction', stationCode: 'SBC', state: 'Karnataka' },
  { city: 'Bengaluru', stationName: 'Yesvantpur Junction', stationCode: 'YPR', state: 'Karnataka' },
  { city: 'Bengaluru', stationName: 'SMVT Bengaluru', stationCode: 'SMVB', state: 'Karnataka' },
  { city: 'Chennai', stationName: 'MGR Chennai Central', stationCode: 'MAS', state: 'Tamil Nadu' },
  { city: 'Chennai', stationName: 'Chennai Egmore', stationCode: 'MS', state: 'Tamil Nadu' },
  { city: 'Kolkata', stationName: 'Howrah Junction', stationCode: 'HWH', state: 'West Bengal' },
  { city: 'Kolkata', stationName: 'Sealdah Railway Station', stationCode: 'SDAH', state: 'West Bengal' },
  { city: 'Visakhapatnam', stationName: 'Visakhapatnam Junction', stationCode: 'VSKP', state: 'Andhra Pradesh' },
  { city: 'Vizag', stationName: 'Visakhapatnam Junction', stationCode: 'VSKP', state: 'Andhra Pradesh' },
  { city: 'Araku', stationName: 'Araku Railway Station', stationCode: 'ARK', state: 'Andhra Pradesh' },
  { city: 'Goa', stationName: 'Madgaon Junction', stationCode: 'MAO', state: 'Goa' },
  { city: 'Goa', stationName: 'Vasco Da Gama', stationCode: 'VSG', state: 'Goa' },
  { city: 'Jaipur', stationName: 'Jaipur Junction', stationCode: 'JP', state: 'Rajasthan' },
  { city: 'Pune', stationName: 'Pune Junction', stationCode: 'PUNE', state: 'Maharashtra' },
  { city: 'Guwahati', stationName: 'Guwahati Junction', stationCode: 'GHY', state: 'Assam' }
];

export function resolveAirport(query: string): ResolvedAirport | null {
  const clean = (query || '').trim().toLowerCase();
  if (!clean) return null;

  // 1. Direct IATA Code Match
  const byCode = AIRPORT_DATABASE.find((a) => a.airportCode.toLowerCase() === clean);
  if (byCode) return byCode;

  // 2. City Match
  const byCity = AIRPORT_DATABASE.find((a) => a.city.toLowerCase() === clean);
  if (byCity) return byCity;

  // 3. Partial City or Airport Name Match
  const partial = AIRPORT_DATABASE.find(
    (a) => a.city.toLowerCase().includes(clean) || a.airportName.toLowerCase().includes(clean)
  );
  if (partial) return partial;

  // Fallback structure if unlisted city is entered
  const cap = query.charAt(0).toUpperCase() + query.slice(1);
  return {
    city: cap,
    airportName: `${cap} International Airport`,
    airportCode: clean.slice(0, 3).toUpperCase(),
    country: 'International'
  };
}

export function resolveRailwayStation(query: string): ResolvedStation | null {
  const clean = (query || '').trim().toLowerCase();
  if (!clean) return null;

  const byCode = RAILWAY_STATION_DATABASE.find((s) => s.stationCode.toLowerCase() === clean);
  if (byCode) return byCode;

  const byCity = RAILWAY_STATION_DATABASE.find((s) => s.city.toLowerCase() === clean);
  if (byCity) return byCity;

  const partial = RAILWAY_STATION_DATABASE.find(
    (s) => s.city.toLowerCase().includes(clean) || s.stationName.toLowerCase().includes(clean)
  );
  if (partial) return partial;

  const cap = query.charAt(0).toUpperCase() + query.slice(1);
  return {
    city: cap,
    stationName: `${cap} Central`,
    stationCode: clean.slice(0, 4).toUpperCase(),
    state: 'India'
  };
}

export function searchLocationSuggestions(query: string, mode: 'FLIGHT' | 'TRAIN'): LocationItem[] {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];

  if (mode === 'FLIGHT') {
    return AIRPORT_DATABASE.filter(
      (a) =>
        a.city.toLowerCase().includes(q) ||
        a.airportCode.toLowerCase().includes(q) ||
        a.airportName.toLowerCase().includes(q)
    ).map((a, idx) => ({
      id: `ap_${a.airportCode}_${idx}`,
      city: a.city,
      name: a.airportName,
      code: a.airportCode,
      type: 'AIRPORT',
      subtitle: `${a.airportName} (${a.airportCode})`,
      countryOrState: a.country
    }));
  }

  return RAILWAY_STATION_DATABASE.filter(
    (s) =>
      s.city.toLowerCase().includes(q) ||
      s.stationCode.toLowerCase().includes(q) ||
      s.stationName.toLowerCase().includes(q)
  ).map((s, idx) => ({
    id: `st_${s.stationCode}_${idx}`,
    city: s.city,
    name: s.stationName,
    code: s.stationCode,
    type: 'STATION',
    subtitle: `${s.stationName} (${s.stationCode})`,
    countryOrState: s.state
  }));
}
