export const SEED_USERS = [
  {
    id: 'usr_demo_1',
    email: 'alex.traveler@example.com',
    passwordHash: '$2a$10$w8T0M9fO91jXj3j5m8ZpuefJ6.x0iZf9L0/L3m8ZpuefJ6.x0iZf9',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    role: 'USER',
    createdAt: new Date('2026-01-15T10:00:00Z').toISOString(),
  },
  {
    id: 'usr_admin_1',
    email: 'admin@aitravelcompanion.com',
    passwordHash: '$2a$10$w8T0M9fO91jXj3j5m8ZpuefJ6.x0iZf9L0/L3m8ZpuefJ6.x0iZf9',
    name: 'Sarah Connor (Admin)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    role: 'ADMIN',
    createdAt: new Date('2026-01-01T08:00:00Z').toISOString(),
  }
];

export const SEED_TRIPS = [
  {
    id: 'trip_1',
    userId: 'usr_demo_1',
    title: 'Goa Coastal & Heritage Retreat',
    destination: 'Goa, India',
    startDate: new Date('2026-08-10T00:00:00Z').toISOString(),
    endDate: new Date('2026-08-17T00:00:00Z').toISOString(),
    budget: 85000,
    spent: 32500,
    currency: 'INR',
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1200',
    status: 'ACTIVE',
    createdAt: new Date('2026-07-01T12:00:00Z').toISOString(),
  },
  {
    id: 'trip_2',
    userId: 'usr_demo_1',
    title: 'Rajasthan Royal Palaces & Desert Safari',
    destination: 'Jaipur & Udaipur, India',
    startDate: new Date('2026-09-20T00:00:00Z').toISOString(),
    endDate: new Date('2026-09-27T00:00:00Z').toISOString(),
    budget: 120000,
    spent: 15000,
    currency: 'INR',
    coverImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=1200',
    status: 'UPCOMING',
    createdAt: new Date('2026-07-15T09:00:00Z').toISOString(),
  },
  {
    id: 'trip_3',
    userId: 'usr_demo_1',
    title: 'Kerala Backwaters & Houseboat Journey',
    destination: 'Kochi & Alleppey, India',
    startDate: new Date('2026-05-01T00:00:00Z').toISOString(),
    endDate: new Date('2026-05-08T00:00:00Z').toISOString(),
    budget: 65000,
    spent: 62000,
    currency: 'INR',
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1200',
    status: 'COMPLETED',
    createdAt: new Date('2026-04-10T14:00:00Z').toISOString(),
  }
];

export const SEED_ITINERARIES = [
  {
    id: 'day_1',
    tripId: 'trip_1',
    dayNumber: 1,
    date: new Date('2026-08-10T00:00:00Z').toISOString(),
    summary: 'Arrival in North Goa, Fontainhas Latin Quarter & Baga Beach Sunset',
    activities: [
      {
        id: 'act_1',
        time: '09:00 AM',
        title: 'Check-in at Taj Fort Aguada Resort',
        description: 'Welcome Kokum drink, luggage drop & coastal villa check-in',
        location: 'Sinquerim Beach, North Goa',
        lat: 15.4920,
        lng: 73.7737,
        category: 'Accommodation',
        cost: 12000,
        isCompleted: true,
      },
      {
        id: 'act_2',
        time: '01:00 PM',
        title: 'Fontainhas Heritage Latin Quarter Walk',
        description: 'Explore colourful Portuguese heritage homes, art galleries & cafes',
        location: 'Panaji, Goa',
        lat: 15.4989,
        lng: 73.8278,
        category: 'Sightseeing',
        cost: 500,
        isCompleted: true,
      },
      {
        id: 'act_3',
        time: '06:30 PM',
        title: 'Sunset Seafood Dining at Thalassa / Britto’s',
        description: 'Authentic Goan Fish Curry, Butter Garlic Prawns & live acoustic music',
        location: 'Vagator Beach, Goa',
        lat: 15.5985,
        lng: 73.7380,
        category: 'Food & Drink',
        cost: 2500,
        isCompleted: true,
      }
    ]
  },
  {
    id: 'day_2',
    tripId: 'trip_1',
    dayNumber: 2,
    date: new Date('2026-08-11T00:00:00Z').toISOString(),
    summary: 'Historical UNESCO Churches of Old Goa & Mandovi River Sunset Cruise',
    activities: [
      {
        id: 'act_4',
        time: '09:30 AM',
        title: 'Basilica of Bom Jesus & Se Cathedral',
        description: 'Visit 16th century UNESCO world heritage Portuguese monuments',
        location: 'Old Goa',
        lat: 15.5009,
        lng: 73.9116,
        category: 'Culture',
        cost: 200,
        isCompleted: true,
      },
      {
        id: 'act_5',
        time: '02:00 PM',
        title: 'Sahakari Spice Plantation Tour & Traditional Lunch',
        description: 'Guided herbal garden walk, elephant bathing view & organic banana leaf thali',
        location: 'Ponda, Goa',
        lat: 15.4026,
        lng: 74.0152,
        category: 'Nature & Food',
        cost: 1500,
        isCompleted: false,
      },
      {
        id: 'act_6',
        time: '06:30 PM',
        title: 'Mandovi River Sunset Luxury Cruise',
        description: 'Traditional Dekhnni & Fugdi dance performances along scenic waters',
        location: 'Panaji Jetty, Goa',
        lat: 15.4989,
        lng: 73.8278,
        category: 'Entertainment',
        cost: 1000,
        isCompleted: false,
      }
    ]
  }
];

export const SEED_PACKING_ITEMS = [
  { id: 'pack_1', tripId: 'trip_1', category: 'Clothing', itemName: 'Lightweight linen clothes & swimwear', isPacked: true, quantity: 4 },
  { id: 'pack_2', tripId: 'trip_1', category: 'Essentials', itemName: 'Sunscreen SPF 50+ & UV Sunglasses', isPacked: true, quantity: 1 },
  { id: 'pack_3', tripId: 'trip_1', category: 'Documents', itemName: 'Aadhaar / Passport & Hotel Voucher', isPacked: true, quantity: 1 },
  { id: 'pack_4', tripId: 'trip_1', category: 'Electronics', itemName: 'Type C / D Indian Plug Charger & Powerbank', isPacked: false, quantity: 1 },
  { id: 'pack_5', tripId: 'trip_1', category: 'Medicine', itemName: 'Mosquito Repellent Cream (Odomos) & ORS', isPacked: false, quantity: 1 },
];

export const SEED_EXPENSES = [
  { id: 'exp_1', tripId: 'trip_1', category: 'Flight', amount: 14500, currency: 'INR', description: 'IndiGo Roundtrip Delhi -> Goa (GOI)', date: new Date('2026-08-01').toISOString() },
  { id: 'exp_2', tripId: 'trip_1', category: 'Hotel', amount: 12000, currency: 'INR', description: 'Taj Fort Aguada Stay (Per Night)', date: new Date('2026-08-10').toISOString() },
  { id: 'exp_3', tripId: 'trip_1', category: 'Food', amount: 2500, currency: 'INR', description: 'Beachside Seafood Dinner in Vagator', date: new Date('2026-08-10').toISOString() },
  { id: 'exp_4', tripId: 'trip_1', category: 'Transport', amount: 2000, currency: 'INR', description: 'Self-drive Car / Scooter Rental in Goa', date: new Date('2026-08-10').toISOString() },
  { id: 'exp_5', tripId: 'trip_1', category: 'Activities', amount: 1500, currency: 'INR', description: 'Spice Plantation Guided Tour & Buffet', date: new Date('2026-08-11').toISOString() },
];

export const SEED_TRANSPORT = [
  {
    id: 'tkt_1',
    tripId: 'trip_1',
    type: 'FLIGHT',
    carrierNumber: '6E 204 / IndiGo Airlines',
    origin: 'DEL (Indira Gandhi Intl, New Delhi)',
    destination: 'GOI (Dabolim Airport, Goa)',
    departureTime: new Date('2026-08-09T06:15:00Z').toISOString(),
    arrivalTime: new Date('2026-08-09T08:45:00Z').toISOString(),
    status: 'On Time',
    terminal: 'Terminal 3',
    gate: 'Gate 22B',
    platform: undefined
  },
  {
    id: 'tkt_2',
    tripId: 'trip_1',
    type: 'TRAIN',
    carrierNumber: '22436 / Vande Bharat Express',
    origin: 'New Delhi (NDLS)',
    destination: 'Jaipur Junction (JP)',
    departureTime: new Date('2026-09-20T06:00:00Z').toISOString(),
    arrivalTime: new Date('2026-09-20T10:35:00Z').toISOString(),
    status: 'Confirmed',
    terminal: undefined,
    gate: undefined,
    platform: 'Platform 1'
  }
];

export const SEED_MEMORIES = [
  {
    id: 'mem_1',
    tripId: 'trip_3',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800',
    caption: 'Serene sunrise houseboat cruise through Alleppey Backwaters!',
    aiCaption: '✨ AI Memory Tag: Pristine tropical palm reflections and heritage luxury houseboat experience in Kerala.',
    location: 'Alleppey, Kerala, India',
    createdAt: new Date('2026-05-04T06:30:00Z').toISOString(),
  },
  {
    id: 'mem_2',
    tripId: 'trip_3',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800',
    caption: 'Golden hour view of Taj Mahal by the Yamuna River.',
    aiCaption: '🏛️ AI Memory Tag: World Heritage marble architectural masterpiece at sunset.',
    location: 'Agra, Uttar Pradesh, India',
    createdAt: new Date('2026-05-06T17:45:00Z').toISOString(),
  }
];

export const SEED_NOTIFICATIONS = [
  {
    id: 'notif_1',
    userId: 'usr_demo_1',
    title: '☀️ Live Weather Alert: Goa, India',
    message: 'Pleasant coastal breeze in Goa today (29°C / 84°F). Perfect weather for beach walks & heritage tours!',
    type: 'WEATHER',
    isRead: false,
    createdAt: new Date('2026-08-11T07:00:00Z').toISOString(),
  },
  {
    id: 'notif_2',
    userId: 'usr_demo_1',
    title: '🚆 Boarding Reminder: Vande Bharat Express',
    message: 'Your Vande Bharat Express to Jaipur departs in 1 month from Platform 1, New Delhi station.',
    type: 'BOARDING',
    isRead: false,
    createdAt: new Date('2026-08-11T08:30:00Z').toISOString(),
  },
  {
    id: 'notif_3',
    userId: 'usr_demo_1',
    title: '💰 AI Budget Insight',
    message: 'You have spent ₹32,500 out of your ₹85,000 budget (38.2%). You are currently ₹4,500 under daily limit!',
    type: 'BUDGET',
    isRead: true,
    createdAt: new Date('2026-08-10T21:00:00Z').toISOString(),
  }
];
