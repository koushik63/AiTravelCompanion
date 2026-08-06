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
  // --- MEGHALAYA / GUWAHATI / SHILLONG ---
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
  {
    flightNumber: '6E 529',
    airline: 'IndiGo Airlines',
    origin: 'Rajiv Gandhi Int Airport (HYD), Hyderabad',
    destination: 'Guwahati Int Airport (GAU), Meghalaya Region',
    departureTime: '06:10 AM',
    arrivalTime: '08:50 AM',
    terminal: 'T1',
    gate: 'Gate 8',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹5,200',
    daysOperating: 'Daily'
  },
  {
    flightNumber: '6E 391',
    airline: 'IndiGo Airlines',
    origin: 'Kempegowda Int Airport (BLR), Bengaluru',
    destination: 'Guwahati Int Airport (GAU), Meghalaya Region',
    departureTime: '09:45 AM',
    arrivalTime: '12:40 PM',
    terminal: 'T1',
    gate: 'Gate 18',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹5,900',
    daysOperating: 'Daily'
  },

  // --- GOA ---
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
    estimatedFare: '₹5,400',
    daysOperating: 'Daily'
  },
  {
    flightNumber: 'AI 883',
    airline: 'Air India',
    origin: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    destination: 'Goa Manohar Mopa Airport (GOX), Goa',
    departureTime: '01:30 PM',
    arrivalTime: '02:45 PM',
    terminal: 'T2',
    gate: 'Gate A8',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹3,200',
    daysOperating: 'Daily'
  },
  {
    flightNumber: '6E 374',
    airline: 'IndiGo Airlines',
    origin: 'Rajiv Gandhi Int Airport (HYD), Hyderabad',
    destination: 'Goa Dabolim Airport (GOI), Goa',
    departureTime: '11:15 AM',
    arrivalTime: '12:35 PM',
    terminal: 'T1',
    gate: 'Gate 5',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹3,800',
    daysOperating: 'Daily'
  },
  {
    flightNumber: '6E 428',
    airline: 'IndiGo Airlines',
    origin: 'Kempegowda Int Airport (BLR), Bengaluru',
    destination: 'Goa Dabolim Airport (GOI), Goa',
    departureTime: '04:10 PM',
    arrivalTime: '05:20 PM',
    terminal: 'T1',
    gate: 'Gate 12',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹2,800',
    daysOperating: 'Daily'
  },
  {
    flightNumber: '6E 718',
    airline: 'IndiGo Airlines',
    origin: 'Chennai Int Airport (MAA), Chennai',
    destination: 'Goa Dabolim Airport (GOI), Goa',
    departureTime: '07:50 AM',
    arrivalTime: '09:20 AM',
    terminal: 'T1',
    gate: 'Gate 4',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹3,400',
    daysOperating: 'Daily'
  },
  {
    flightNumber: '6E 6231',
    airline: 'IndiGo Airlines',
    origin: 'Netaji Subhash Chandra Bose Airport (CCU), Kolkata',
    destination: 'Goa Dabolim Airport (GOI), Goa',
    departureTime: '05:15 PM',
    arrivalTime: '07:55 PM',
    terminal: 'T2',
    gate: 'Gate 22',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹5,800',
    daysOperating: 'Daily'
  },

  // --- HYDERABAD TO DELHI / MUMBAI / OTHERS ---
  {
    flightNumber: '6E 526',
    airline: 'IndiGo Airlines',
    origin: 'Rajiv Gandhi Int Airport (HYD), Hyderabad',
    destination: 'Indira Gandhi Int Airport (DEL), New Delhi',
    departureTime: '06:45 AM',
    arrivalTime: '09:05 AM',
    terminal: 'T2',
    gate: 'Gate 14',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹4,200',
    daysOperating: 'Daily'
  },
  {
    flightNumber: 'AI 840',
    airline: 'Air India',
    origin: 'Rajiv Gandhi Int Airport (HYD), Hyderabad',
    destination: 'Indira Gandhi Int Airport (DEL), New Delhi',
    departureTime: '04:15 PM',
    arrivalTime: '06:35 PM',
    terminal: 'T3',
    gate: 'Gate 21',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹4,900',
    daysOperating: 'Daily'
  },
  {
    flightNumber: '6E 612',
    airline: 'IndiGo Airlines',
    origin: 'Rajiv Gandhi Int Airport (HYD), Hyderabad',
    destination: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    departureTime: '08:00 AM',
    arrivalTime: '09:25 AM',
    terminal: 'T2',
    gate: 'Gate 6',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹3,500',
    daysOperating: 'Daily'
  },

  // --- DELHI ---
  {
    flightNumber: '6E 218',
    airline: 'IndiGo Airlines',
    origin: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    destination: 'Indira Gandhi Int Airport (DEL), New Delhi',
    departureTime: '07:00 AM',
    arrivalTime: '09:15 AM',
    terminal: 'T2',
    gate: 'Gate B2',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹4,200',
    daysOperating: 'Daily'
  },
  {
    flightNumber: '6E 2017',
    airline: 'IndiGo Airlines',
    origin: 'Kempegowda Int Airport (BLR), Bengaluru',
    destination: 'Indira Gandhi Int Airport (DEL), New Delhi',
    departureTime: '05:30 AM',
    arrivalTime: '08:15 AM',
    terminal: 'T2',
    gate: 'Gate 11',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹5,100',
    daysOperating: 'Daily'
  },
  {
    flightNumber: '6E 204',
    airline: 'IndiGo Airlines',
    origin: 'Chennai Int Airport (MAA), Chennai',
    destination: 'Indira Gandhi Int Airport (DEL), New Delhi',
    departureTime: '06:15 AM',
    arrivalTime: '09:00 AM',
    terminal: 'T2',
    gate: 'Gate 7',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹4,950',
    daysOperating: 'Daily'
  },
  {
    flightNumber: '6E 502',
    airline: 'IndiGo Airlines',
    origin: 'Netaji Subhash Chandra Bose Airport (CCU), Kolkata',
    destination: 'Indira Gandhi Int Airport (DEL), New Delhi',
    departureTime: '08:30 AM',
    arrivalTime: '10:55 AM',
    terminal: 'T2',
    gate: 'Gate 15',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹4,500',
    daysOperating: 'Daily'
  },

  // --- MUMBAI ---
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
    estimatedFare: '₹4,800',
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

  // --- KERALA / KOCHI ---
  {
    flightNumber: '6E 2405',
    airline: 'IndiGo Airlines',
    origin: 'Indira Gandhi Int Airport (DEL), New Delhi',
    destination: 'Cochin Int Airport (COK), Kerala',
    departureTime: '05:45 AM',
    arrivalTime: '09:00 AM',
    terminal: 'T2',
    gate: 'Gate 19',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹6,200',
    daysOperating: 'Daily'
  },
  {
    flightNumber: '6E 521',
    airline: 'IndiGo Airlines',
    origin: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    destination: 'Cochin Int Airport (COK), Kerala',
    departureTime: '11:20 AM',
    arrivalTime: '01:15 PM',
    terminal: 'T2',
    gate: 'Gate 3',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹4,100',
    daysOperating: 'Daily'
  },

  // --- JAIPUR ---
  {
    flightNumber: '6E 7214',
    airline: 'IndiGo Airlines',
    origin: 'Indira Gandhi Int Airport (DEL), New Delhi',
    destination: 'Jaipur Int Airport (JAI), Rajasthan',
    departureTime: '07:45 AM',
    arrivalTime: '08:45 AM',
    terminal: 'T2',
    gate: 'Gate 2',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹2,600',
    daysOperating: 'Daily'
  },
  {
    flightNumber: '6E 904',
    airline: 'IndiGo Airlines',
    origin: 'Rajiv Gandhi Int Airport (HYD), Hyderabad',
    destination: 'Jaipur Int Airport (JAI), Rajasthan',
    departureTime: '01:15 PM',
    arrivalTime: '03:30 PM',
    terminal: 'T1',
    gate: 'Gate 11',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹4,800',
    daysOperating: 'Daily'
  },

  // --- INTERNATIONAL (SINGAPORE / DUBAI / PARIS / TOKYO / BALI) ---
  {
    flightNumber: 'SQ 421',
    airline: 'Singapore Airlines',
    origin: 'Chhatrapati Shivaji Maharaj Int Airport (BOM), Mumbai',
    destination: 'Changi Airport (SIN), Singapore',
    departureTime: '11:45 PM',
    arrivalTime: '07:30 AM (Next Day)',
    terminal: 'T2',
    gate: 'Gate 72',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹18,000',
    daysOperating: 'Daily'
  },
  {
    flightNumber: 'AI 380',
    airline: 'Air India',
    origin: 'Indira Gandhi Int Airport (DEL), New Delhi',
    destination: 'Changi Airport (SIN), Singapore',
    departureTime: '11:00 PM',
    arrivalTime: '07:15 AM (Next Day)',
    terminal: 'T3',
    gate: 'Gate 16',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹16,500',
    daysOperating: 'Daily'
  },
  {
    flightNumber: '6E 1007',
    airline: 'IndiGo Airlines',
    origin: 'Rajiv Gandhi Int Airport (HYD), Hyderabad',
    destination: 'Changi Airport (SIN), Singapore',
    departureTime: '10:15 PM',
    arrivalTime: '05:40 AM (Next Day)',
    terminal: 'T1',
    gate: 'Gate 19',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹15,400',
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
    flightNumber: 'EK 513',
    airline: 'Emirates',
    origin: 'Indira Gandhi Int Airport (DEL), New Delhi',
    destination: 'Dubai Int Airport (DXB), UAE',
    departureTime: '04:15 AM',
    arrivalTime: '06:30 AM',
    terminal: 'T3',
    gate: 'Gate 28',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹19,200',
    daysOperating: 'Daily'
  },
  {
    flightNumber: 'EK 527',
    airline: 'Emirates',
    origin: 'Rajiv Gandhi Int Airport (HYD), Hyderabad',
    destination: 'Dubai Int Airport (DXB), UAE',
    departureTime: '10:30 AM',
    arrivalTime: '01:00 PM',
    terminal: 'T1',
    gate: 'Gate 14',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹17,800',
    daysOperating: 'Daily'
  },
  {
    flightNumber: 'AF 225',
    airline: 'Air France',
    origin: 'Indira Gandhi Int Airport (DEL), New Delhi',
    destination: 'Charles de Gaulle Airport (CDG), Paris',
    departureTime: '01:25 AM',
    arrivalTime: '06:45 AM',
    terminal: 'T3',
    gate: 'Gate 42',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹42,000',
    daysOperating: 'Daily'
  },
  {
    flightNumber: 'JL 001',
    airline: 'Japan Airlines',
    origin: 'Indira Gandhi Int Airport (DEL), New Delhi',
    destination: 'Haneda Airport (HND), Tokyo',
    departureTime: '07:15 PM',
    arrivalTime: '06:55 AM (Next Day)',
    terminal: 'T3',
    gate: 'Gate 14',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹54,000',
    daysOperating: 'Daily'
  },
  {
    flightNumber: '6E 1601',
    airline: 'IndiGo Airlines',
    origin: 'Indira Gandhi Int Airport (DEL), New Delhi',
    destination: 'Ngurah Rai Int Airport (DPS), Bali',
    departureTime: '11:55 PM',
    arrivalTime: '08:45 AM (Next Day)',
    terminal: 'T3',
    gate: 'Gate 33',
    status: 'ON TIME',
    delayMinutes: 0,
    estimatedFare: '₹24,000',
    daysOperating: 'Daily'
  }
];

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

  // Dynamic Fallback: If specific origin-destination has no pre-set item in array, generate realistic commercial flight
  if (filtered.length === 0 && dest && dest !== 'all') {
    const origDisplay = orig !== 'all' ? (orig.charAt(0).toUpperCase() + orig.slice(1)) : 'New Delhi';
    const destDisplay = dest.charAt(0).toUpperCase() + dest.slice(1);
    return [
      {
        flightNumber: `6E ${Math.floor(100 + Math.random() * 899)}`,
        airline: 'IndiGo Airlines',
        origin: `${origDisplay} Airport`,
        destination: `${destDisplay} Airport`,
        departureTime: '08:30 AM',
        arrivalTime: '10:45 AM',
        terminal: 'T2',
        gate: 'Gate 12',
        status: 'ON TIME',
        delayMinutes: 0,
        estimatedFare: '₹4,500',
        daysOperating: 'Daily'
      },
      {
        flightNumber: `AI ${Math.floor(400 + Math.random() * 499)}`,
        airline: 'Air India',
        origin: `${origDisplay} Airport`,
        destination: `${destDisplay} Airport`,
        departureTime: '04:15 PM',
        arrivalTime: '06:30 PM',
        terminal: 'T3',
        gate: 'Gate 18',
        status: 'ON TIME',
        delayMinutes: 0,
        estimatedFare: '₹5,200',
        daysOperating: 'Daily'
      }
    ];
  }

  return filtered;
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
    return [
      {
        trainNumber: `${Math.floor(12000 + Math.random() * 8000)}`,
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
