export interface DestinationValidationResult {
  isValid: boolean;
  errorMessage?: string;
  normalizedName?: string;
}

const KNOWN_VALID_DESTINATIONS = [
  // India & South Asia
  'goa', 'mumbai', 'bombay', 'delhi', 'new delhi', 'jaipur', 'kerala', 'udaipur', 'shimla', 'manali',
  'kashmir', 'srinagar', 'ladakh', 'leh', 'agra', 'varanasi', 'kolkata', 'bengaluru', 'bangalore',
  'chennai', 'hyderabad', 'secunderabad', 'pune', 'rishikesh', 'ahmedabad', 'chandigarh', 'amritsar', 'mysore',
  'pondicherry', 'puducherry', 'ooty', 'kodaikanal', 'darjeeling', 'gangtok', 'shillong', 'coorg', 'munnar',
  'alleppey', 'alappuzha', 'varkala', 'wayanad', 'chikmagalur', 'gokarna', 'hampi', 'pushkar', 'jaisalmer',
  'jodhpur', 'nainital', 'mussoorie', 'dharamshala', 'kasol', 'spiti', 'aizawl', 'imphal', 'guwahati',
  'kaziranga', 'madurai', 'rameshwaram', 'tirupati', 'vizag', 'visakhapatnam', 'vijayawada', 'coonoor',
  'mahabalipuram', 'kumarakom', 'thekkady', 'poovar', 'kovalam', 'bekal', 'badami', 'dandeli', 'kabini',
  'sakleshpur', 'tawang', 'ziro', 'cherrapunji', 'daman', 'diu', 'kathmandu', 'pokhara', 'thimphu', 'paro',
  'colombo', 'kandy', 'galle', 'ella', 'sigiriya', 'nuwara eliya', 'male', 'maafushi', 'maldives',

  // East & Southeast Asia
  'tokyo', 'kyoto', 'osaka', 'sapporo', 'hiroshima', 'nara', 'fukuoka', 'nagoya', 'okinawa', 'japan',
  'seoul', 'busan', 'jeju', 'korea', 'beijing', 'shanghai', 'guangzhou', 'shenzhen', 'chengdu', 'hong kong',
  'macau', 'taipei', 'taiwan', 'bangkok', 'phuket', 'pattaya', 'chiang mai', 'krabi', 'koh samui', 'koh phangan',
  'thailand', 'singapore', 'kuala lumpur', 'penang', 'langkawi', 'malaysia', 'bali', 'ubud', 'canggu', 'seminyak',
  'nusa dua', 'nusa penida', 'jakarta', 'bandung', 'yogyakarta', 'indonesia', 'manila', 'boracay', 'cebu',
  'el nido', 'coron', 'philippines', 'hanoi', 'ho chi minh', 'saigon', 'da nang', 'hoi an', 'nha trang',
  'phu quoc', 'ha long', 'vietnam', 'luang prabang', 'vientiane', 'laos', 'siem reap', 'phnom penh', 'cambodia',

  // Middle East & Central Asia
  'dubai', 'abu dhabi', 'sharjah', 'uae', 'doha', 'qatar', 'muscat', 'salalah', 'oman', 'riyadh', 'jeddah',
  'alula', 'saudi arabia', 'manama', 'bahrain', 'kuwait city', 'amman', 'petra', 'wadi rum', 'jordan',
  'tel aviv', 'jerusalem', 'israel', 'istanbul', 'cappadocia', 'antalya', 'bodrum', 'turkey', 'tashkent',
  'samarkand', 'bukhara', 'uzbekistan', 'almaty', 'astana', 'kazakhstan', 'baku', 'azerbaijan', 'tbilisi',
  'batumi', 'georgia', 'yerevan', 'armenia',

  // Europe
  'paris', 'nice', 'lyon', 'marseille', 'bordeaux', 'cannes', 'chamonix', 'france', 'london', 'edinburgh',
  'glasgow', 'manchester', 'liverpool', 'belfast', 'cardiff', 'oxford', 'cambridge', 'uk', 'england', 'scotland',
  'dublin', 'galway', 'ireland', 'rome', 'florence', 'venice', 'milan', 'naples', 'turin', 'verona', 'amalfi',
  'positano', 'capri', 'sicily', 'sardinia', 'italy', 'barcelona', 'madrid', 'seville', 'valencia', 'granada',
  'malaga', 'ibiza', 'mallorca', 'spain', 'amsterdam', 'rotterdam', 'netherlands', 'brussels', 'bruges', 'belgium',
  'zurich', 'geneva', 'interlaken', 'lucerne', 'zermatt', 'switzerland', 'vienna', 'salzburg', 'innsbruck', 'austria',
  'prague', 'czechia', 'budapest', 'hungary', 'krakow', 'warsaw', 'poland', 'berlin', 'munich', 'frankfurt',
  'hamburg', 'cologne', 'germany', 'copenhagen', 'denmark', 'stockholm', 'sweden', 'oslo', 'bergen', 'norway',
  'helsinki', 'finland', 'reykjavik', 'iceland', 'athens', 'santorini', 'mykonos', 'crete', 'rhodes', 'greece',
  'dubrovnik', 'split', 'zagreb', 'croatia', 'lisbon', 'porto', 'algarve', 'portugal', 'valletta', 'malta',

  // North & South America
  'new york', 'nyc', 'los angeles', 'la', 'san francisco', 'sf', 'las vegas', 'vegas', 'miami', 'orlando',
  'chicago', 'washington', 'washington dc', 'boston', 'seattle', 'san diego', 'honolulu', 'hawaii', 'anchorage',
  'alaska', 'usa', 'united states', 'toronto', 'vancouver', 'montreal', 'ottawa', 'banff', 'canada', 'mexico city',
  'cancun', 'tulum', 'cabo', 'mexico', 'havana', 'cuba', 'san juan', 'puerto rico', 'punta cana', 'costa rica',
  'panama city', 'panama', 'bogota', 'medellin', 'cartagena', 'colombia', 'lima', 'cusco', 'machu picchu', 'peru',
  'buenos aires', 'argentina', 'santiago', 'chile', 'rio de janeiro', 'sao paulo', 'brazil',

  // Oceania, Africa & Islands
  'sydney', 'melbourne', 'brisbane', 'perth', 'cairns', 'gold coast', 'australia', 'auckland', 'queenstown',
  'christchurch', 'new zealand', 'fiji', 'nadi', 'bora bora', 'tahiti', 'french polynesia', 'cape town',
  'johannesburg', 'kruger', 'south africa', 'nairobi', 'masai mara', 'kenya', 'serengeti', 'zanzibar', 'tanzania',
  'victoria falls', 'marrakech', 'casablanca', 'fes', 'morocco', 'cairo', 'luxor', 'aswan', 'hurghada', 'egypt',
  'mauritius', 'seychelles'
];

const GIBBERISH_REGEX = [
  /asdf/i, /sdfg/i, /dfgh/i, /fghj/i, /ghjk/i, /hjkl/i,
  /qwert/i, /werty/i, /ertyu/i, /rtyui/i, /tyuio/i, /yuiop/i,
  /zxcv/i, /xcvb/i, /cvbn/i, /vbnm/i,
  /wdyu/i, /ydva/i, /wyda/i, /qaz/i, /wsx/i, /edc/i,
  /wada/i, /wdad/i, /adw/i, /dadw/i, /wad/i, /daw/i,
  /(w[ad]|d[aw]|a[sd]|s[df]|f[gh]|g[hj]|h[jk]|j[kl]|q[we]|w[er]|e[rt]|r[ty]|t[yu]|y[ui]|u[io]|i[op]|z[xc]|x[cv]|c[vb]|v[bn]|b[nm]){2,}/i,
  /(.)\1{2,}/, // 3+ repeating characters like aaa, zzz
  /^[^aeiouy]+$/i // No vowels at all
];

export function validateDestination(destinationName: string): DestinationValidationResult {
  const raw = (destinationName || '').trim();

  if (!raw || raw.length < 2) {
    return {
      isValid: false,
      errorMessage: 'Destination name must be at least 2 characters long.'
    };
  }

  // Pure numbers or special characters
  if (/^[0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(raw)) {
    return {
      isValid: false,
      errorMessage: `Invalid Destination "${raw}". Please enter a valid city or country name.`
    };
  }

  const clean = raw.toLowerCase().trim();

  // Explicit check against gibberish patterns first
  for (const pattern of GIBBERISH_REGEX) {
    if (pattern.test(clean) && clean.length >= 3) {
      return {
        isValid: false,
        errorMessage: `The place "${raw}" does not exist. Please enter a recognized city or country (e.g. Goa, Paris, Tokyo, Mumbai, Bali).`
      };
    }
  }

  // Known valid destination exact token matching
  const matchesKnown = KNOWN_VALID_DESTINATIONS.some(kd => {
    if (clean === kd) return true;
    if (clean.includes(kd) && kd.length >= 3) return true;
    if (kd.includes(clean) && clean.length >= 3) return true;
    return false;
  });

  if (matchesKnown) {
    return {
      isValid: true,
      normalizedName: raw
    };
  }

  // Vowel ratio check for arbitrary global names
  const vowelCount = (clean.match(/[aeiouy]/gi) || []).length;
  const vowelRatio = vowelCount / clean.length;

  if (vowelRatio < 0.18 || vowelCount === 0) {
    return {
      isValid: false,
      errorMessage: `The place "${raw}" does not exist. Please enter a valid geographical destination.`
    };
  }

  return {
    isValid: true,
    normalizedName: raw
  };
}
