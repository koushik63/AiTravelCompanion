export interface DestinationValidationResult {
  isValid: boolean;
  errorMessage?: string;
  normalizedName?: string;
}

const KNOWN_VALID_DESTINATIONS = [
  'goa', 'mumbai', 'delhi', 'new delhi', 'jaipur', 'kerala', 'udaipur', 'shimla', 'manali',
  'kashmir', 'srinagar', 'ladakh', 'leh', 'agra', 'varanasi', 'kolkata', 'bengaluru', 'bangalore',
  'chennai', 'hyderabad', 'pune', 'rishikesh', 'ahmedabad', 'chandigarh', 'amritsar', 'mysore',
  'pondicherry', 'ooty', 'kodaikanal', 'darjeeling', 'gangtok', 'shillong', 'coorg', 'munnar',
  'alleppey', 'varkala', 'wayanad', 'chikmagalur', 'gokarna', 'hampi', 'pushkar', 'jaisalmer',
  'jodhpur', 'nainital', 'mussoorie', 'dharamshala', 'kasol', 'spiti', 'aizawl', 'imphal',
  'bali', 'paris', 'tokyo', 'london', 'dubai', 'singapore', 'maldives', 'thailand', 'bangkok',
  'phuket', 'pattaya', 'rome', 'venice', 'florence', 'milan', 'barcelona', 'madrid', 'amsterdam',
  'switzerland', 'zurich', 'interlaken', 'lucerne', 'new york', 'los angeles', 'san francisco',
  'las vegas', 'miami', 'hawaii', 'orlando', 'washington', 'chicago', 'sydney', 'melbourne',
  'auckland', 'toronto', 'vancouver', 'cairo', 'istanbul', 'athens', 'prague', 'vienna', 'budapest',
  'kyoto', 'osaka', 'seoul', 'vietnam', 'hanoi', 'ho chi minh', 'jakarta', 'nepal', 'kathmandu',
  'bhutan', 'sri lanka', 'colombo', 'male', 'fiji', 'greece', 'santorini', 'italy', 'france',
  'germany', 'berlin', 'munich', 'spain', 'japan', 'uk', 'usa', 'united states', 'canada',
  'australia', 'indonesia', 'malaysia', 'kuala lumpur', 'turkey', 'egypt', 'brazil', 'rio de janeiro',
  'beijing', 'shanghai', 'hong kong', 'taiwan', 'taipei', 'manila', 'philippines', 'canggu',
  'ubud', 'seminyak', 'nusa dua', 'nusa penida', 'krabi', 'koh samui', 'chiang mai', 'boracay',
  'maldives', 'seychelles', 'mauritius', 'dubrovnik', 'croatia', 'lisbon', 'portugal', 'porto',
  'reykjavik', 'iceland', 'oslo', 'norway', 'stockholm', 'sweden', 'copenhagen', 'denmark',
  'helsinki', 'finland', 'dublin', 'ireland', 'edinburgh', 'scotland', 'brussels', 'belgium',
  'vatican', 'san marino', 'monaco', 'zurich', 'geneva', 'innsbruck', 'austria', 'salzburg',
  'verona', 'naples', 'amalfi', 'positano', 'capri', 'sicily', 'ibiza', 'majorca', 'valencia',
  'seville', 'granada', 'mykonos', 'crete', 'rhodes', 'cyprus', 'malta', 'vladivostok', 'moscow',
  'st petersburg', 'russia', 'alaska', 'seattle', 'boston', 'philadelphia', 'dallas', 'houston',
  'austin', 'denver', 'phoenix', 'san diego', 'san jose', 'portland', 'honolulu', 'anchorage',
  'cancun', 'mexico', 'mexico city', 'tulum', 'cabo', 'havana', 'cuba', 'punta cana', 'san juan',
  'costa rica', 'panama', 'bogota', 'colombia', 'medellin', 'lima', 'peru', 'cusco', 'machu picchu',
  'buenos aires', 'argentina', 'santiago', 'chile', 'sao paulo', 'cape town', 'south africa',
  'johannesburg', 'nairobi', 'kenya', 'serengeti', 'tanzania', 'zanzibar', 'morocco', 'marrakech',
  'casablanca', 'cairo', 'luxor', 'israel', 'tel aviv', 'jerusalem', 'jordan', 'petra', 'amman',
  'doha', 'qatar', 'abu dhabi', 'muscat', 'oman', 'riyadh', 'saudi arabia', 'jeddah', 'beirut',
  'tashkent', 'uzbekistan', 'almaty', 'kazakhstan', 'baku', 'azerbaijan', 'tbilisi', 'georgia',
  'yerevan', 'armenia', 'goa', 'kerala', 'ladakh', 'kashmir'
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
        errorMessage: `The place "${raw}" does not exist. Please enter a recognized city or country (e.g. Goa, Paris, Tokyo, Mumbai).`
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

  // Vowel ratio check for arbitrary names
  const vowelCount = (clean.match(/[aeiouy]/gi) || []).length;
  const vowelRatio = vowelCount / clean.length;

  if (vowelRatio < 0.20 || vowelCount === 0) {
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
