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
  'australia', 'indonesia', 'malaysia', 'kuala lumpur', 'turkey', 'egypt', 'brazil', 'rio de janeiro'
];

const GIBBERISH_PATTERNS = [
  /asdf/i, /sdfg/i, /dfgh/i, /fghj/i, /ghjk/i, /hjkl/i,
  /qwert/i, /werty/i, /ertyu/i, /rtyui/i, /tyuio/i, /yuiop/i,
  /zxcv/i, /xcvb/i, /cvbn/i, /vbnm/i,
  /wdyu/i, /ydva/i, /wyda/i, /qaz/i, /wsx/i, /edc/i,
  /(.)\1{3,}/, // 4+ repeating characters like aaaa, zzzz
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

  // Known valid destination check
  if (KNOWN_VALID_DESTINATIONS.some(kd => clean.includes(kd) || kd.includes(clean))) {
    return {
      isValid: true,
      normalizedName: raw
    };
  }

  // Check for gibberish key mashes
  for (const pattern of GIBBERISH_PATTERNS) {
    if (pattern.test(clean) && clean.length > 3) {
      return {
        isValid: false,
        errorMessage: `The place "${raw}" does not exist. Please enter a recognized city or country (e.g. Goa, Paris, Tokyo, Mumbai).`
      };
    }
  }

  // Vowel ratio check for longer words
  const vowelCount = (clean.match(/[aeiouy]/gi) || []).length;
  if (clean.length >= 6 && vowelCount === 0) {
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
