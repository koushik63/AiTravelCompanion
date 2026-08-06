import { formatCurrency } from './currencyHelper';

export interface DayItinerary {
  day: string;
  morning: string;
  afternoon: string;
  evening: string;
  cost: string;
  highlight?: string;
}

interface TemplateItem {
  summary: string;
  morning: string;
  afternoon: string;
  evening: string;
  baseCostINR: number;
  highlight: string;
}

const DESTINATION_TEMPLATES: Record<string, TemplateItem[]> = {
  california: [
    {
      summary: 'San Francisco Golden Gate Bridge, Pier 39 & Fisherman’s Wharf',
      morning: 'Walk & photo session across iconic Golden Gate Bridge; explore Crissy Field waterfront views.',
      afternoon: 'Fisherman’s Wharf sourdough clam chowder lunch & watch famous sea lions barking at Pier 39.',
      evening: 'Historic San Francisco Cable Car ride to Ghirardelli Square for hot fudge sundaes.',
      baseCostINR: 18500,
      highlight: 'Golden Gate Bridge & Pier 39'
    },
    {
      summary: 'Alcatraz Island Cellhouse Tour & Chinatown Heritage',
      morning: 'Ferry ride across San Francisco Bay & award-winning audio tour of historic Alcatraz Island prison.',
      afternoon: 'Authentic dim sum tasting tour through historic San Francisco Chinatown & Grant Avenue gates.',
      evening: 'Sunset views over San Francisco Bay from Coit Tower followed by North Beach Italian dinner.',
      baseCostINR: 17200,
      highlight: 'Alcatraz Island & Chinatown Tour'
    },
    {
      summary: 'Yosemite National Park Granite Cliffs & Waterfall Hike',
      morning: 'Guided excursion to Yosemite Valley viewing legendary El Capitan granite monolith & Tunnel View lookout.',
      afternoon: 'Scenic trail hike to Vernal Fall & Nevada Fall amidst towering giant sequoias.',
      evening: 'Stargazing session & lodge dinner looking up at Half Dome in Yosemite Valley.',
      baseCostINR: 21000,
      highlight: 'Yosemite National Park & El Capitan'
    },
    {
      summary: 'Los Angeles Hollywood Walk of Fame & Santa Monica Pier',
      morning: 'Stroll Hollywood Walk of Fame, TCL Chinese Theatre handprints & Beverly Hills Rodeo Drive.',
      afternoon: 'Santa Monica Pier Pacific Park roller coaster rides & historic Venice Beach boardwalk strolling.',
      evening: 'Sunset panoramic view over Los Angeles basin from Griffith Observatory.',
      baseCostINR: 19400,
      highlight: 'Hollywood Walk of Fame & Santa Monica Pier'
    },
    {
      summary: 'Highway 1 Coastal Scenic Drive & Big Sur Cliffs',
      morning: 'Drive along Highway 1 Pacific Coast Highway stopping at Bixby Creek Bridge for coastal photos.',
      afternoon: 'Explore Pfeiffer Beach purple sand cove & McWay Falls ocean waterfall viewpoint.',
      evening: 'Clifftop dinner at Nepenthe Restaurant overlooking Big Sur Pacific Ocean waves.',
      baseCostINR: 22500,
      highlight: 'Highway 1 Big Sur Coastal Drive'
    }
  ],
  hyderabad: [
    {
      summary: 'Charminar, Laad Bazaar Pearls & Chowmahalla Palace',
      morning: 'Visit iconic 16th-century Charminar monument; climb up for panoramic views of Old City.',
      afternoon: 'Shop for famous Hyderabadi lac bangles & freshwater pearls at Laad Bazaar, then tour royal Chowmahalla Palace.',
      evening: 'Authentic Hyderabadi Dum Biryani & Double ka Meetha dinner at Paradise or Shadab Restaurant.',
      baseCostINR: 2800,
      highlight: 'Charminar & Royal Chowmahalla Palace'
    },
    {
      summary: 'Golconda Fort Sound & Light Show & Qutb Shahi Tombs',
      morning: 'Explore massive 13th-century Golconda Fort acoustic architecture & Fateh Rahben canon.',
      afternoon: 'Guided walk through majestic Qutb Shahi Tombs complex featuring Persian & Deccan arches.',
      evening: 'Sunset boat cruise at Hussain Sagar Lake to standing Buddha Statue & Lumbini Park laser show.',
      baseCostINR: 3200,
      highlight: 'Golconda Fort & Hussain Sagar Cruise'
    },
    {
      summary: 'Ramoji Film City Full-Day Studio Experience',
      morning: 'Travel to Ramoji Film City (World’s Largest Film Studio Complex); enjoy Filmi Duniya dark ride.',
      afternoon: 'Watch live stunt performance shows, Bahubali movie set tour & Action Studio.',
      evening: 'Walk through Eureka Carnival, butterfly park & thematic dinner at Jimmy’s Drive-In.',
      baseCostINR: 4500,
      highlight: 'Ramoji Film City & Bahubali Sets'
    }
  ],
  usa: [
    {
      summary: 'Statue of Liberty, Wall Street & Empire State Building',
      morning: 'Liberty Island ferry ride to Statue of Liberty monument & Ellis Island Museum.',
      afternoon: 'Walk through Financial District charging bull, Wall Street & 9/11 Memorial Pools.',
      evening: 'Sunset views from Empire State Building 86th Floor Observatory & Times Square neon lights walk.',
      baseCostINR: 18500,
      highlight: 'Statue of Liberty & Empire State Observatory'
    },
    {
      summary: 'Washington D.C. National Mall & Smithsonian Museums',
      morning: 'Guided tour of US Capitol Building, Lincoln Memorial & Washington Monument.',
      afternoon: 'Tour Smithsonian National Air & Space Museum & National Museum of American History.',
      evening: 'Sunset view across Tidal Basin & fresh seafood dinner at Georgetown waterfront.',
      baseCostINR: 16800,
      highlight: 'National Mall & Smithsonian Museums'
    },
    {
      summary: 'Las Vegas Strip Resorts, Bellagio Fountains & High Roller Wheel',
      morning: 'Walk the iconic Las Vegas Boulevard (The Strip) & tour Venetian Gondola rides.',
      afternoon: 'High Roller observation wheel flight overlooking Mojave Desert & Vegas valley.',
      evening: 'Bellagio Fountains choreographed water show & dinner at Caesars Palace.',
      baseCostINR: 19500,
      highlight: 'Las Vegas Strip & Bellagio Fountains'
    }
  ],
  dubai: [
    {
      summary: 'Burj Khalifa 148th Floor, Dubai Mall & Dubai Fountain Show',
      morning: 'Priority elevator entry to Burj Khalifa 148th Floor At The Top Sky Observation Deck for 360° views of Dubai skyline.',
      afternoon: 'Explore world’s largest Dubai Mall, Dubai Aquarium & Underwater Zoo, and Human Waterfalls.',
      evening: 'Spectacular Dubai Fountain music & light show set against Burj Khalifa, followed by dinner at Souk Al Bahar.',
      baseCostINR: 14500,
      highlight: 'Burj Khalifa Sky Deck & Dubai Fountain'
    },
    {
      summary: 'Museum of the Future, Dubai Frame & Red Dune Desert Safari',
      morning: 'Tour iconic Museum of the Future showcasing futuristic AI exhibits & Dubai Frame glass skywalk.',
      afternoon: '4x4 Land Cruiser dune bashing across Lahbab Red Dunes with sandboarding & quad biking.',
      evening: 'Al Khayma Bedouin Desert Camp experience featuring camel rides, henna art, belly dance & Arabian BBQ dinner.',
      baseCostINR: 16200,
      highlight: 'Museum of Future & Red Dune Desert Safari'
    }
  ],
  paris: [
    {
      summary: 'Eiffel Tower Summit, Seine River Cruise & Louvre Museum',
      morning: 'Early priority access to Eiffel Tower summit for 360° views over Champ de Mars & Paris skyline.',
      afternoon: 'Guided masterpiece tour of the Louvre Museum viewing Mona Lisa, Venus de Milo & Winged Victory.',
      evening: 'Sunset glass-canopy Bateaux Parisians cruise along Seine River with French wine & dinner.',
      baseCostINR: 16500,
      highlight: 'Eiffel Tower Summit & Seine Dinner Cruise'
    }
  ],
  tokyo: [
    {
      summary: 'Shibuya Crossing, Harajuku Street Fashion & Meiji Jingu Shrine',
      morning: 'Walk through peaceful Meiji Shrine forest gardens & historic Torii gate entrance.',
      afternoon: 'Takeshita Street Harajuku pop culture shopping, crepe tasting & Shibuya Scramble Crossing at Shibuya Sky.',
      evening: 'Authentic Tokyo Ramen Alley dinner in Shinjuku & Kabukicho neon nightlife walk.',
      baseCostINR: 13500,
      highlight: 'Shibuya Crossing & Meiji Shrine'
    }
  ],
  goa: [
    {
      summary: 'North Goa Beaches & Fort Aguada',
      morning: 'Check in to beachside resort in Baga/Calangute; morning relaxation & fresh coconut water by the shore.',
      afternoon: 'Visit 17th-century Fort Aguada lighthouse viewpoint and Chapora Fort.',
      evening: 'Sunset beach lounge session at Thalassa Vagator followed by seafood dinner at Tito’s Lane.',
      baseCostINR: 4200,
      highlight: 'Fort Aguada & Vagator Sunset'
    }
  ]
};

export function getDetailedDestinationItinerary(
  destinationName?: string,
  durationDays: number = 3,
  currency: string = 'INR',
  totalBudget?: number
): DayItinerary[] {
  const dest = (destinationName || '').toLowerCase().trim();
  const rawName = destinationName ? destinationName.split(',')[0].trim() : 'City';
  const capitalizedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const daysNeeded = Math.max(1, durationDays || 3);

  let key = '';
  if (dest.includes('california') || dest.includes('san francisco') || dest.includes('los angeles')) key = 'california';
  else if (dest.includes('hyderabad') || dest.includes('secunderabad')) key = 'hyderabad';
  else if (dest.includes('new york') || dest.includes('nyc')) key = 'newyork';
  else if (dest.includes('dubai') || dest.includes('uae')) key = 'dubai';
  else if (dest.includes('paris') || dest.includes('france')) key = 'paris';
  else if (dest.includes('tokyo') || dest.includes('japan')) key = 'tokyo';
  else if (dest.includes('london') || dest.includes('uk') || dest.includes('england')) key = 'london';
  else if (dest.includes('jaipur') || dest.includes('rajasthan')) key = 'jaipur';
  else if (dest.includes('goa')) key = 'goa';
  else if (dest.includes('mumbai') || dest.includes('bombay')) key = 'mumbai';
  else if (dest.includes('delhi')) key = 'delhi';
  else if (dest.includes('usa') || dest.includes('united states') || dest.includes('america') || /\busa?\b/i.test(dest)) key = 'usa';

  let templates = key ? DESTINATION_TEMPLATES[key] : null;

  const isInternational =
    dest.includes('usa') ||
    dest.includes('united states') ||
    dest.includes('america') ||
    dest.includes('california') ||
    dest.includes('new york') ||
    dest.includes('paris') ||
    dest.includes('london') ||
    dest.includes('tokyo') ||
    dest.includes('dubai') ||
    dest.includes('singapore') ||
    dest.includes('bali') ||
    dest.includes('switzerland');

  let exchangeRateToCurrency = 1;
  const currUpper = (currency || 'INR').toUpperCase().trim();
  if (currUpper === 'USD') exchangeRateToCurrency = 0.012;
  else if (currUpper === 'EUR') exchangeRateToCurrency = 0.011;
  else if (currUpper === 'GBP') exchangeRateToCurrency = 0.0094;
  else if (currUpper === 'AED') exchangeRateToCurrency = 0.044;
  else if (currUpper === 'JPY') exchangeRateToCurrency = 1.82;

  if (!templates || templates.length === 0) {
    const baseDailyCostINR = isInternational ? 16000 : 3500;
    templates = [
      {
        summary: `Downtown Landmark Exploration, Central Plazas & Sky Deck in ${capitalizedName}`,
        morning: `Morning walking tour of ${capitalizedName}'s central heritage plazas & architectural monuments.`,
        afternoon: `Visit premier city art museum, cultural heritage centers & scenic promenade in ${capitalizedName}.`,
        evening: `Sunset observation sky deck view overlooking ${capitalizedName} skyline followed by authentic regional dinner.`,
        baseCostINR: Math.round(baseDailyCostINR * 1.0),
        highlight: `City Center & Skyline Observation Deck in ${capitalizedName}`
      },
      {
        summary: `Culinary Street Food Tour, Historic Bazaars & Cultural Heritage in ${capitalizedName}`,
        morning: `Guided morning tour of ${capitalizedName}’s iconic architectural landmarks and historic cultural monuments.`,
        afternoon: `Shop for artisanal handicrafts, local fashion & traditional souvenirs at famous street markets in ${capitalizedName}.`,
        evening: `Gourmet food tasting walk trying top signature culinary delicacies of ${capitalizedName}.`,
        baseCostINR: Math.round(baseDailyCostINR * 0.9),
        highlight: `${capitalizedName} Bazaars & Gourmet Food Walk`
      },
      {
        summary: `Scenic Nature Excursion, Waterfront Boat Cruise & Sunset Lounge in ${capitalizedName}`,
        morning: `Morning trip to nearby hillside lookout, lake, or scenic natural landscape surrounding ${capitalizedName}.`,
        afternoon: `Relaxing boat cruise or nature trail hike with organic farm-to-table lunch in ${capitalizedName}.`,
        evening: `Atmospheric sunset lounge dinner with live music performance in ${capitalizedName}.`,
        baseCostINR: Math.round(baseDailyCostINR * 1.15),
        highlight: `Nature Excursion & Sunset Cruise in ${capitalizedName}`
      }
    ];
  }

  const days: DayItinerary[] = [];

  for (let i = 0; i < daysNeeded; i++) {
    const templateIndex = i % templates.length;
    const template = templates[templateIndex];
    const dayNumber = i + 1;

    let dayCostNumber = template.baseCostINR;
    if (totalBudget && totalBudget > 0) {
      const targetDailyBudget = Math.round(totalBudget / daysNeeded);
      dayCostNumber = Math.round(targetDailyBudget * (0.85 + (i % 3) * 0.15));
    }

    const convertedCost = Math.round(dayCostNumber * exchangeRateToCurrency);
    const formattedCostStr = formatCurrency(convertedCost, currency);

    days.push({
      day: `Day ${dayNumber}: ${template.summary}`,
      morning: template.morning,
      afternoon: template.afternoon,
      evening: template.evening,
      cost: formattedCostStr,
      highlight: template.highlight
    });
  }

  return days;
}
