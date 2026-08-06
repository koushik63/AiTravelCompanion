export interface FlightOption {
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
  estimatedFare: string;
  daysOperating: string;
}

export interface TrainOption {
  trainNumber: string;
  trainName: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  platform: string;
  coach: string;
  seat: string;
  status: string;
  delayMinutes: number;
  estimatedFare: string;
  daysOperating: string;
}

const ALL_FLIGHTS: FlightOption[] = [
  // Meghalaya / Guwahati / Shillong
  {
    flightNumber: '6E 214',
    airline: 'IndiGo Airlines',
    origin: 'Indira Gandhi Int Airport (DEL), New Delhi',
    destination: 'Guwahati Int Airport (GAU), Meghalaya Region',
    departureTime: '07:15 AM',
    arrivalTime: '09:40 AM',
    terminal: 'T2',
    gate: 'Gate B4',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹4,850',
    daysOperating: 'Daily'
  },
  {
    flightNumber: 'AI 729',
    airline: 'Air India',
    origin: 'Netaji Subhash Chandra Bose Airport (CCU), Kolkata',
    destination: 'Shillong Umroi Airport (SHL), Meghalaya',
    departureTime: '10:30 AM',
    arrivalTime: '12:15 PM',
    terminal: 'T1',
    gate: 'Gate 3A',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹3,920',
    daysOperating: 'Daily'
  },
  {
    flightNumber: '6E 6109',
    airline: 'IndiGo Airlines',
    origin: 'Netaji Subhash Chandra Bose Airport (CCU), Kolkata',
    destination: 'Guwahati Int Airport (GAU), Meghalaya Region',
    departureTime: '02:45 PM',
    arrivalTime: '04:05 PM',
    terminal: 'T2',
    gate: 'Gate A12',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹3,400',
    daysOperating: 'Daily'
  },
  {
    flightNumber: 'UK 891',
    airline: 'Vistara Airlines',
    origin: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    destination: 'Guwahati Int Airport (GAU), Meghalaya Region',
    departureTime: '08:20 AM',
    arrivalTime: '11:25 AM',
    terminal: 'T2',
    gate: 'Gate 45',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹5,600',
    daysOperating: 'Mon, Wed, Fri'
  },

  // Goa
  {
    flightNumber: '6E 504',
    airline: 'IndiGo Airlines',
    origin: 'Indira Gandhi Int Airport (DEL), New Delhi',
    destination: 'Goa Dabolim Airport (GOI), Goa',
    departureTime: '09:10 AM',
    arrivalTime: '11:45 AM',
    terminal: 'T2',
    gate: 'Gate 14',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹4,200',
    daysOperating: 'Daily'
  },
  {
    flightNumber: 'AI 883',
    airline: 'Air India',
    origin: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    destination: 'Goa Manohar Mopa Airport (GOX), Goa',
    departureTime: '11:00 AM',
    arrivalTime: '12:15 PM',
    terminal: 'T2',
    gate: 'Gate A8',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹2,900',
    daysOperating: 'Daily'
  },
  {
    flightNumber: 'QP 1102',
    airline: 'Akasa Air',
    origin: 'Kempegowda Int Airport (BLR), Bengaluru',
    destination: 'Goa Manohar Mopa Airport (GOX), Goa',
    departureTime: '06:45 AM',
    arrivalTime: '08:00 AM',
    terminal: 'T1',
    gate: 'Gate 12',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹2,450',
    daysOperating: 'Daily'
  },

  // Mumbai
  {
    flightNumber: '6E 218',
    airline: 'IndiGo Airlines',
    origin: 'Indira Gandhi Int Airport (DEL), New Delhi',
    destination: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    departureTime: '08:00 AM',
    arrivalTime: '10:15 AM',
    terminal: 'T2',
    gate: 'Gate B2',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹3,800',
    daysOperating: 'Daily'
  },
  {
    flightNumber: 'AI 101',
    airline: 'Air India',
    origin: 'Indira Gandhi Int Airport (DEL), New Delhi',
    destination: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    departureTime: '10:00 AM',
    arrivalTime: '12:15 PM',
    terminal: 'T3',
    gate: 'Gate 18',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹4,100',
    daysOperating: 'Daily'
  },
  {
    flightNumber: 'UK 815',
    airline: 'Vistara Airlines',
    origin: 'Kempegowda Int Airport (BLR), Bengaluru',
    destination: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    departureTime: '07:30 AM',
    arrivalTime: '09:15 AM',
    terminal: 'T2',
    gate: 'Gate 10',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹3,500',
    daysOperating: 'Daily'
  },

  // Delhi
  {
    flightNumber: 'AI 806',
    airline: 'Air India',
    origin: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    destination: 'Indira Gandhi Int Airport (DEL), New Delhi',
    departureTime: '06:00 PM',
    arrivalTime: '08:15 PM',
    terminal: 'T3',
    gate: 'Gate 22',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹4,300',
    daysOperating: 'Daily'
  },

  // Kerala
  {
    flightNumber: '6E 304',
    airline: 'IndiGo Airlines',
    origin: 'Indira Gandhi Int Airport (DEL), New Delhi',
    destination: 'Cochin Int Airport (COK), Kerala',
    departureTime: '05:45 AM',
    arrivalTime: '08:55 AM',
    terminal: 'T2',
    gate: 'Gate C8',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹5,400',
    daysOperating: 'Daily'
  },

  // Jaipur
  {
    flightNumber: '6E 712',
    airline: 'IndiGo Airlines',
    origin: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    destination: 'Jaipur Int Airport (JAI), Rajasthan',
    departureTime: '11:15 AM',
    arrivalTime: '01:05 PM',
    terminal: 'T2',
    gate: 'Gate 6',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹3,200',
    daysOperating: 'Daily'
  },

  // International
  {
    flightNumber: 'SQ 421',
    airline: 'Singapore Airlines',
    origin: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    destination: 'Changi Airport (SIN), Singapore',
    departureTime: '11:45 PM',
    arrivalTime: '07:35 AM (Next Day)',
    terminal: 'T2',
    gate: 'Gate 72',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹22,500',
    daysOperating: 'Daily'
  },
  {
    flightNumber: 'EK 500',
    airline: 'Emirates',
    origin: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    destination: 'Dubai Int Airport (DXB), UAE',
    departureTime: '04:30 AM',
    arrivalTime: '06:15 AM',
    terminal: 'T2',
    gate: 'Gate 64',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹18,900',
    daysOperating: 'Daily'
  },
  {
    flightNumber: 'JL 001',
    airline: 'Japan Airlines',
    origin: 'Indira Gandhi Int Airport (DEL), New Delhi',
    destination: 'Haneda Airport (HND), Tokyo',
    departureTime: '07:15 PM',
    arrivalTime: '06:30 AM (Next Day)',
    terminal: 'T3',
    gate: 'Gate 14',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹48,000',
    daysOperating: 'Daily'
  },
  {
    flightNumber: 'AF 226',
    airline: 'Air France',
    origin: 'Indira Gandhi Int Airport (DEL), New Delhi',
    destination: 'Charles de Gaulle Airport (CDG), Paris',
    departureTime: '01:30 AM',
    arrivalTime: '06:45 AM',
    terminal: 'T3',
    gate: 'Gate 9',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹52,000',
    daysOperating: 'Daily'
  },
  {
    flightNumber: 'GA 402',
    airline: 'Garuda Indonesia',
    origin: 'Soekarno-Hatta Int Airport (CGK), Jakarta',
    destination: 'Ngurah Rai Int Airport (DPS), Bali',
    departureTime: '08:15 AM',
    arrivalTime: '11:05 AM',
    terminal: 'T3',
    gate: 'Gate 11',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹8,500',
    daysOperating: 'Daily'
  }
];

const ALL_TRAINS: TrainOption[] = [
  // Meghalaya / Guwahati / Shillong
  {
    trainNumber: '15657',
    trainName: 'Brahmaputra Mail Express',
    origin: 'Old Delhi Junction (DLI)',
    destination: 'Guwahati Junction (GHY), Meghalaya Gateway',
    departureTime: '11:40 PM',
    arrivalTime: '04:30 AM (Day 3)',
    platform: 'PF 4',
    coach: 'B2 (3A)',
    seat: '24 (Lower)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹1,850',
    daysOperating: 'Daily'
  },
  {
    trainNumber: '12424',
    trainName: 'Dibrugarh Rajdhani Express',
    origin: 'New Delhi (NDLS)',
    destination: 'Guwahati Junction (GHY), Meghalaya Gateway',
    departureTime: '04:10 PM',
    arrivalTime: '07:05 PM (Next Day)',
    platform: 'PF 16',
    coach: 'A1 (2A)',
    seat: '12 (Upper)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹3,450',
    daysOperating: 'Daily'
  },
  {
    trainNumber: '12509',
    trainName: 'Guwahati Superfast Express',
    origin: 'SMVT Bengaluru (SMVB)',
    destination: 'Guwahati Junction (GHY), Meghalaya Gateway',
    departureTime: '11:30 AM',
    arrivalTime: '04:20 AM (Day 3)',
    platform: 'PF 2',
    coach: 'B4 (3A)',
    seat: '35 (Middle)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹2,100',
    daysOperating: 'Wed, Thu, Fri'
  },
  {
    trainNumber: '15959',
    trainName: 'Kamrup Express',
    origin: 'Howrah Junction (HWH), Kolkata',
    destination: 'Guwahati Junction (GHY), Meghalaya Gateway',
    departureTime: '06:30 PM',
    arrivalTime: '04:00 PM (Next Day)',
    platform: 'PF 9',
    coach: 'B1 (3A)',
    seat: '18 (Lower)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹1,250',
    daysOperating: 'Daily'
  },

  // Goa
  {
    trainNumber: '20901',
    trainName: 'Mumbai - Madgaon Vande Bharat Express',
    origin: 'Mumbai Central (MMCT)',
    destination: 'Madgaon Junction (MAO), Goa',
    departureTime: '05:25 AM',
    arrivalTime: '01:10 PM',
    platform: 'PF 1',
    coach: 'C4 (Executive Chair)',
    seat: '14 (Window)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹1,665',
    daysOperating: 'Mon, Wed, Fri, Sat'
  },
  {
    trainNumber: '12051',
    trainName: 'Dadar - Madgaon Jan Shatabdi Express',
    origin: 'Dadar Central (DR), Mumbai',
    destination: 'Madgaon Junction (MAO), Goa',
    departureTime: '05:25 AM',
    arrivalTime: '02:10 PM',
    platform: 'PF 5',
    coach: 'D2 (Second Sitting)',
    seat: '45 (Window)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹980',
    daysOperating: 'Daily'
  },
  {
    trainNumber: '10111',
    trainName: 'Konkan Kanya Express',
    origin: 'Mumbai CSMT (CSMT)',
    destination: 'Madgaon Junction (MAO), Goa',
    departureTime: '11:05 PM',
    arrivalTime: '10:45 AM (Next Day)',
    platform: 'PF 14',
    coach: 'B3 (3A)',
    seat: '29 (Side Lower)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹1,450',
    daysOperating: 'Daily'
  },

  // Mumbai
  {
    trainNumber: '12952',
    trainName: 'Mumbai Rajdhani Express',
    origin: 'New Delhi (NDLS)',
    destination: 'Mumbai Central (MMCT)',
    departureTime: '04:55 PM',
    arrivalTime: '08:35 AM (Next Day)',
    platform: 'PF 1',
    coach: 'A2 (2A)',
    seat: '18 (Lower)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹3,200',
    daysOperating: 'Daily'
  },
  {
    trainNumber: '20902',
    trainName: 'Gandhinagar - Mumbai Vande Bharat Express',
    origin: 'Gandhinagar Capital (GNC)',
    destination: 'Mumbai Central (MMCT)',
    departureTime: '02:05 PM',
    arrivalTime: '08:25 PM',
    platform: 'PF 2',
    coach: 'C1 (AC Chair Car)',
    seat: '32 (Window)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹1,420',
    daysOperating: 'Mon, Tue, Thu, Fri, Sat, Sun'
  },

  // Delhi / Bhopal / Kerala / Jaipur
  {
    trainNumber: '12951',
    trainName: 'Mumbai Rajdhani Express',
    origin: 'Mumbai Central (MMCT)',
    destination: 'New Delhi (NDLS)',
    departureTime: '05:00 PM',
    arrivalTime: '08:32 AM (Next Day)',
    platform: 'PF 1',
    coach: 'A1 (2A)',
    seat: '12 (Upper)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹3,200',
    daysOperating: 'Daily'
  },
  {
    trainNumber: '12002',
    trainName: 'Bhopal Shatabdi Express',
    origin: 'New Delhi (NDLS)',
    destination: 'Rani Kamlapati (RKMP), Bhopal',
    departureTime: '06:00 AM',
    arrivalTime: '02:00 PM',
    platform: 'PF 2',
    coach: 'C3 (Chair Car)',
    seat: '22 (Window)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹1,500',
    daysOperating: 'Daily'
  },
  {
    trainNumber: '12626',
    trainName: 'Kerala Superfast Express',
    origin: 'New Delhi (NDLS)',
    destination: 'Trivandrum Central (TVC), Kerala',
    departureTime: '08:10 PM',
    arrivalTime: '02:15 PM (Day 3)',
    platform: 'PF 3',
    coach: 'B2 (3A)',
    seat: '45 (Side Lower)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹2,650',
    daysOperating: 'Daily'
  },
  {
    trainNumber: '20947',
    trainName: 'Delhi - Jaipur Vande Bharat Express',
    origin: 'New Delhi (NDLS)',
    destination: 'Jaipur Junction (JP), Rajasthan',
    departureTime: '06:10 AM',
    arrivalTime: '10:45 AM',
    platform: 'PF 1',
    coach: 'C2 (Chair Car)',
    seat: '18 (Window)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹1,050',
    daysOperating: 'Daily'
  }
];

export function getAvailableFlightsForDestination(destinationName?: string, originName?: string): FlightOption[] {
  const dest = (destinationName || '').toLowerCase().trim();
  const orig = (originName || '').toLowerCase().trim();

  let filtered = ALL_FLIGHTS;

  if (dest && dest !== 'all') {
    filtered = filtered.filter(f =>
      f.destination.toLowerCase().includes(dest) ||
      (dest.includes('meghalaya') && (f.destination.toLowerCase().includes('guwahati') || f.destination.toLowerCase().includes('shillong')))
    );
  }

  if (orig && orig !== 'all') {
    filtered = filtered.filter(f =>
      f.origin.toLowerCase().includes(orig)
    );
  }

  return filtered;
}

export function getAvailableTrainsForDestination(destinationName?: string, originName?: string): TrainOption[] {
  const dest = (destinationName || '').toLowerCase().trim();
  const orig = (originName || '').toLowerCase().trim();

  let filtered = ALL_TRAINS;

  if (dest && dest !== 'all') {
    filtered = filtered.filter(t =>
      t.destination.toLowerCase().includes(dest) ||
      (dest.includes('meghalaya') && t.destination.toLowerCase().includes('guwahati'))
    );
  }

  if (orig && orig !== 'all') {
    filtered = filtered.filter(t =>
      t.origin.toLowerCase().includes(orig)
    );
  }

  return filtered;
}

export function findFlightByCode(flightNumber: string): FlightOption | null {
  const code = (flightNumber || '').replace(/\s+/g, '').toUpperCase();
  if (!code) return null;
  return ALL_FLIGHTS.find(f => f.flightNumber.replace(/\s+/g, '').toUpperCase() === code) || null;
}

export function findTrainByNumber(trainNumber: string): TrainOption | null {
  const num = (trainNumber || '').replace(/\s+/g, '');
  if (!num) return null;
  return ALL_TRAINS.find(t => t.trainNumber.replace(/\s+/g, '') === num) || null;
}
