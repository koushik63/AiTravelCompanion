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

const ALL_FLIGHTS: FlightOption[] = [];

const ALL_TRAINS: TrainOption[] = [
  // --- MEGHALAYA / GUWAHATI ---
  {
    trainNumber: '15657',
    trainName: 'Brahmaputra Mail Express',
    origin: 'Old Delhi Junction (DLI), New Delhi',
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
    origin: 'New Delhi (NDLS), New Delhi',
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
    origin: 'SMVT Bengaluru (SMVB), Bengaluru',
    destination: 'Guwahati Junction (GHY), Meghalaya Gateway',
    departureTime: '11:40 PM',
    arrivalTime: '05:30 AM (Day 3)',
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
    platform: 'PF 8',
    coach: 'S4 (SL)',
    seat: '42 (Side Upper)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹680',
    daysOperating: 'Daily'
  },

  // --- GOA ---
  {
    trainNumber: '20901',
    trainName: 'Mumbai - Madgaon Vande Bharat Express',
    origin: 'Mumbai Central (MMCT), Mumbai',
    destination: 'Madgaon Junction (MAO), Goa',
    departureTime: '05:25 AM',
    arrivalTime: '03:10 PM',
    platform: 'PF 1',
    coach: 'C4 (Executive)',
    seat: '14 (Window)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹1,980',
    daysOperating: 'Ex Mon'
  },
  {
    trainNumber: '12051',
    trainName: 'Dadar - Madgaon Jan Shatabdi Express',
    origin: 'Dadar Central (DR), Mumbai',
    destination: 'Madgaon Junction (MAO), Goa',
    departureTime: '05:25 AM',
    arrivalTime: '02:00 PM',
    platform: 'PF 5',
    coach: 'D2 (2S)',
    seat: '45 (Window)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹335',
    daysOperating: 'Daily'
  },
  {
    trainNumber: '17039',
    trainName: 'Vasco Express',
    origin: 'Kacheguda (KCG), Hyderabad',
    destination: 'Vasco Da Gama (VSG), Goa',
    departureTime: '09:45 AM',
    arrivalTime: '06:00 AM (Next Day)',
    platform: 'PF 3',
    coach: 'S2 (SL)',
    seat: '18 (Lower)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹540',
    daysOperating: 'Tue, Thu, Sat'
  },
  {
    trainNumber: '17309',
    trainName: 'YPR VSG Express',
    origin: 'Yashvantpur Junction (YPR), Bengaluru',
    destination: 'Vasco Da Gama (VSG), Goa',
    departureTime: '03:00 PM',
    arrivalTime: '05:00 AM (Next Day)',
    platform: 'PF 4',
    coach: 'B1 (3A)',
    seat: '32 (Middle)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹850',
    daysOperating: 'Daily'
  },
  {
    trainNumber: '18047',
    trainName: 'Amaravati Express',
    origin: 'Howrah Junction (HWH), Kolkata',
    destination: 'Vasco Da Gama (VSG), Goa',
    departureTime: '11:30 PM',
    arrivalTime: '03:30 PM (Day 3)',
    platform: 'PF 12',
    coach: 'B3 (3A)',
    seat: '12 (Lower)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹1,950',
    daysOperating: 'Mon, Tue, Thu, Sat'
  },

  // --- HYDERABAD TO DELHI / MUMBAI ---
  {
    trainNumber: '12723',
    trainName: 'Telangana Superfast Express',
    origin: 'Hyderabad Decan (HYB), Hyderabad',
    destination: 'New Delhi (NDLS), New Delhi',
    departureTime: '06:00 AM',
    arrivalTime: '07:40 AM (Next Day)',
    platform: 'PF 5',
    coach: 'B2 (3A)',
    seat: '28 (Lower)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹1,950',
    daysOperating: 'Daily'
  },
  {
    trainNumber: '22691',
    trainName: 'Hazrat Nizamuddin Rajdhani Express',
    origin: 'Secunderabad Junction (SC), Hyderabad',
    destination: 'H Nizamuddin (NZM), New Delhi',
    departureTime: '12:45 PM',
    arrivalTime: '05:55 AM (Next Day)',
    platform: 'PF 10',
    coach: 'A2 (2A)',
    seat: '14 (Lower)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹3,200',
    daysOperating: 'Daily'
  },
  {
    trainNumber: '12702',
    trainName: 'Hussain Sagar Superfast Express',
    origin: 'Hyderabad Decan (HYB), Hyderabad',
    destination: 'Mumbai CSMT (CSMT), Mumbai',
    departureTime: '02:50 PM',
    arrivalTime: '04:55 AM (Next Day)',
    platform: 'PF 4',
    coach: 'B1 (3A)',
    seat: '19 (Upper)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹1,250',
    daysOperating: 'Daily'
  },

  // --- DELHI ---
  {
    trainNumber: '12951',
    trainName: 'Mumbai Rajdhani Express',
    origin: 'Mumbai Central (MMCT), Mumbai',
    destination: 'New Delhi (NDLS), New Delhi',
    departureTime: '05:00 PM',
    arrivalTime: '08:32 AM (Next Day)',
    platform: 'PF 1',
    coach: 'A1 (2A)',
    seat: '12 (Upper)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹3,400',
    daysOperating: 'Daily'
  },
  {
    trainNumber: '12301',
    trainName: 'Howrah Rajdhani Express',
    origin: 'Howrah Junction (HWH), Kolkata',
    destination: 'New Delhi (NDLS), New Delhi',
    departureTime: '04:50 PM',
    arrivalTime: '10:05 AM (Next Day)',
    platform: 'PF 9',
    coach: 'A1 (2A)',
    seat: '18 (Lower)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹3,450',
    daysOperating: 'Daily'
  },
  {
    trainNumber: '12621',
    trainName: 'Tamil Nadu Superfast Express',
    origin: 'MGR Chennai Central (MAS), Chennai',
    destination: 'New Delhi (NDLS), New Delhi',
    departureTime: '10:00 PM',
    arrivalTime: '06:30 AM (Day 3)',
    platform: 'PF 3',
    coach: 'B3 (3A)',
    seat: '45 (Side Lower)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹2,200',
    daysOperating: 'Daily'
  },

  // --- MUMBAI ---
  {
    trainNumber: '12952',
    trainName: 'Mumbai Rajdhani Express',
    origin: 'New Delhi (NDLS), New Delhi',
    destination: 'Mumbai Central (MMCT), Mumbai',
    departureTime: '04:55 PM',
    arrivalTime: '08:35 AM (Next Day)',
    platform: 'PF 1',
    coach: 'A2 (2A)',
    seat: '18 (Lower)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹3,400',
    daysOperating: 'Daily'
  },

  // --- KERALA ---
  {
    trainNumber: '12626',
    trainName: 'Kerala Superfast Express',
    origin: 'New Delhi (NDLS), New Delhi',
    destination: 'Trivandrum Central (TVC), Kerala',
    departureTime: '08:10 PM',
    arrivalTime: '02:15 PM (Day 3)',
    platform: 'PF 3',
    coach: 'B2 (3A)',
    seat: '45 (Side Lower)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹2,800',
    daysOperating: 'Daily'
  },
  {
    trainNumber: '12618',
    trainName: 'Mangala Lakshadweep Express',
    origin: 'Kalyan Junction (KYN), Mumbai',
    destination: 'Ernakulam Junction (ERS), Kerala',
    departureTime: '01:25 PM',
    arrivalTime: '01:05 PM (Next Day)',
    platform: 'PF 5',
    coach: 'B4 (3A)',
    seat: '11 (Lower)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹1,850',
    daysOperating: 'Daily'
  },

  // --- JAIPUR ---
  {
    trainNumber: '20947',
    trainName: 'Delhi - Jaipur Vande Bharat Express',
    origin: 'New Delhi (NDLS), New Delhi',
    destination: 'Jaipur Junction (JP), Rajasthan',
    departureTime: '03:15 PM',
    arrivalTime: '07:15 PM',
    platform: 'PF 1',
    coach: 'C2 (CC)',
    seat: '18 (Window)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹1,450',
    daysOperating: 'Ex Wed'
  },
  {
    trainNumber: '12720',
    trainName: 'Hyderabad - Jaipur Express',
    origin: 'Hyderabad Decan (HYB), Hyderabad',
    destination: 'Jaipur Junction (JP), Rajasthan',
    departureTime: '08:35 PM',
    arrivalTime: '05:25 AM (Day 3)',
    platform: 'PF 6',
    coach: 'B3 (3A)',
    seat: '22 (Middle)',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹1,950',
    daysOperating: 'Mon, Wed'
  }
];

export function getAvailableFlightsForDestination(): FlightOption[] {
  // Pure API mode: Never return hardcoded or fallback flight arrays
  return [];
}

export function getAvailableTrainsForDestination(destinationName?: string, originName?: string): TrainOption[] {
  const dest = (destinationName || '').toLowerCase().trim();
  const orig = (originName || '').toLowerCase().trim();

  // International destinations do not have Indian Railways trains
  const isInternational = ['singapore', 'dubai', 'paris', 'tokyo', 'bali'].some(i => dest.includes(i));
  if (isInternational) return [];

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

  // Dynamic Fallback: If specific domestic origin-destination has no pre-set item in array, generate realistic Indian Railways train
  if (filtered.length === 0 && dest && dest !== 'all') {
    const origDisplay = orig !== 'all' ? (orig.charAt(0).toUpperCase() + orig.slice(1)) : 'New Delhi';
    const destDisplay = dest.charAt(0).toUpperCase() + dest.slice(1);
    const hash = Math.abs((orig + dest).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    const trainNum = 12000 + (hash % 5000);

    return [
      {
        trainNumber: `${trainNum}`,
        trainName: `${origDisplay} - ${destDisplay} Superfast Express`,
        origin: `${origDisplay} Junction`,
        destination: `${destDisplay} Central`,
        departureTime: '06:15 AM',
        arrivalTime: '08:30 PM',
        platform: 'PF 1',
        coach: 'B2 (3A)',
        seat: '24 (Lower)',
        status: 'ON TIME',
        delayMinutes: 0,
        estimatedFare: '₹1,650',
        daysOperating: 'Daily'
      }
    ];
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
