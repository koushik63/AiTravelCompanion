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
    },
    {
      summary: 'Taj Falaknuma Palace & Salar Jung Museum Treasures',
      morning: 'Guided art tour of Salar Jung Museum viewing Veiled Rebecca marble statue & Musical Clock.',
      afternoon: 'Royal High Tea experience at Taj Falaknuma Palace overlooking Hyderabad skyline.',
      evening: 'Stroll around KBR National Park, Jubilee Hills & dinner at Olive Bistro overlooking Durgam Cheruvu.',
      baseCostINR: 5800,
      highlight: 'Taj Falaknuma High Tea & Salar Jung'
    },
    {
      summary: 'HITEC City, Durgam Cheruvu Cable Bridge & Shilparamam',
      morning: 'Explore Shilparamam Arts & Crafts Village for traditional Indian handlooms & pottery.',
      afternoon: 'Walk across iconic Durgam Cheruvu Cable Stayed Bridge & enjoy waterfront park kayaking.',
      evening: 'Rooftop cocktail session at Skypoint ITC Kohenur overlooking Cyberabad skyline.',
      baseCostINR: 3600,
      highlight: 'Durgam Cheruvu Cable Bridge & Shilparamam'
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
    },
    {
      summary: 'Palace of Versailles Royal Gardens & Montmartre Art District',
      morning: 'Morning train excursion to Palace of Versailles; tour Hall of Mirrors & Royal Apartments.',
      afternoon: 'Stroll Montmartre cobblestone streets, Place du Tertre artists square & Sacré-Cœur Basilica.',
      evening: 'Authentic French bistro dinner in Le Marais district savoring duck confit & crème brûlée.',
      baseCostINR: 14800,
      highlight: 'Palace of Versailles & Montmartre'
    },
    {
      summary: 'Musée d’Orsay Impressionists, Champs-Élysées & Arc de Triomphe',
      morning: 'View Monet, Van Gogh & Renoir masterworks inside historic Musée d’Orsay station.',
      afternoon: 'Walk down Champs-Élysées luxury avenue to Arc de Triomphe rooftop panoramic terrace.',
      evening: 'Opera Garnier neighborhood gourmet food tasting tour featuring macarons & French cheeses.',
      baseCostINR: 15200,
      highlight: 'Arc de Triomphe & Musée d’Orsay'
    }
  ],
  goa: [
    {
      summary: 'North Goa Beaches & Fort Aguada',
      morning: 'Check in to beachside resort in Baga/Calangute; morning relaxation & fresh coconut water by the shore.',
      afternoon: 'Visit 17th-century Fort Aguada lighthouse viewpoint and Chapora Fort (famous Dil Chahta Hai cliff).',
      evening: 'Sunset beach lounge session at Thalassa Vagator followed by seafood dinner at Tito’s Lane.',
      baseCostINR: 4200,
      highlight: 'Fort Aguada & Vagator Sunset'
    },
    {
      summary: 'Old Goa UNESCO Cathedrals & Panaji Latin Quarter',
      morning: 'Tour Basilica of Bom Jesus (storing mortal remains of St. Francis Xavier) & Se Cathedral in Old Goa.',
      afternoon: 'Explore Fontainhas Latin Quarter colorful Portuguese heritage streets & heritage art galleries.',
      evening: 'Sunset cruise along Mandovi River with traditional Goan folk dance & music performances.',
      baseCostINR: 3600,
      highlight: 'Basilica of Bom Jesus & Fontainhas'
    },
    {
      summary: 'Dudhsagar Waterfall Safari & South Goa Beaches',
      morning: 'Early morning 4x4 Jeep Safari through Bhagwan Mahavir Wildlife Sanctuary to Dudhsagar Waterfalls.',
      afternoon: 'Organic lunch at Sahakari Spice Plantation followed by elephant interaction & spice garden tour.',
      evening: 'Relaxing sunset at Palolem Beach crescent bay & dinner at Cape Goa cliffside restaurant.',
      baseCostINR: 5200,
      highlight: 'Dudhsagar Waterfall Safari'
    }
  ],
  mumbai: [
    {
      summary: 'Gateway of India, Colaba Causeway & Marine Drive',
      morning: 'Visit iconic Gateway of India and marvel at Taj Mahal Palace Hotel architecture.',
      afternoon: 'Street shopping at Colaba Causeway for vintage antiques & fashion apparel.',
      evening: 'Sunset stroll along Marine Drive (Queen’s Necklace) and dinner at Bademiya Kebabs.',
      baseCostINR: 3400,
      highlight: 'Gateway of India & Marine Drive Sunset'
    },
    {
      summary: 'Elephanta Caves Island Boat Trip & Heritage Architecture',
      morning: 'Ferry ride across Mumbai Harbour to UNESCO Elephanta Caves rock-cut Shiva temples.',
      afternoon: 'Guided walk through Victoria Terminus (CSMT railway station) & Crawford Market.',
      evening: 'Cocktails at rooftop bar overlooking Arabian Sea in Nariman Point.',
      baseCostINR: 3800,
      highlight: 'Elephanta Caves & CSMT Heritage'
    }
  ],
  delhi: [
    {
      summary: 'Old Delhi Heritage, Red Fort & Chandni Chowk Food Walk',
      morning: 'Explore Mughal Red Fort (Lal Qila) & Jama Masjid mosque.',
      afternoon: 'Cycle rickshaw ride through Chandni Chowk & paranthas at Paranthe Wali Gali.',
      evening: 'Illuminated view of India Gate memorial & Rajpath boulevard walk.',
      baseCostINR: 2900,
      highlight: 'Red Fort & Chandni Chowk Food Tour'
    },
    {
      summary: 'Qutub Minar, Humayun’s Tomb & Lotus Temple',
      morning: 'Visit 73-meter Qutub Minar UNESCO victory tower & Iron Pillar.',
      afternoon: 'Tour red sandstone Humayun’s Tomb (inspiration for Taj Mahal).',
      evening: 'Sunset meditation at Lotus Temple & dinner at Khan Market.',
      baseCostINR: 3500,
      highlight: 'Qutub Minar & Humayun’s Tomb'
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
  const daysNeeded = Math.max(1, durationDays || 3);

  let key = '';
  if (dest.includes('hyderabad')) key = 'hyderabad';
  else if (dest.includes('paris')) key = 'paris';
  else if (dest.includes('goa')) key = 'goa';
  else if (dest.includes('mumbai') || dest.includes('bombay')) key = 'mumbai';
  else if (dest.includes('delhi')) key = 'delhi';

  let templates = key ? DESTINATION_TEMPLATES[key] : null;

  const isInternational =
    dest.includes('paris') ||
    dest.includes('london') ||
    dest.includes('tokyo') ||
    dest.includes('new york') ||
    dest.includes('rome') ||
    dest.includes('dubai') ||
    dest.includes('singapore') ||
    dest.includes('bali') ||
    dest.includes('switzerland') ||
    dest.includes('amsterdam');

  let exchangeRateToCurrency = 1;
  const currUpper = (currency || 'INR').toUpperCase().trim();
  if (currUpper === 'USD') exchangeRateToCurrency = 0.012;
  else if (currUpper === 'EUR') exchangeRateToCurrency = 0.011;
  else if (currUpper === 'GBP') exchangeRateToCurrency = 0.0094;
  else if (currUpper === 'AED') exchangeRateToCurrency = 0.044;
  else if (currUpper === 'JPY') exchangeRateToCurrency = 1.82;
  else if (currUpper === 'CAD') exchangeRateToCurrency = 0.016;
  else if (currUpper === 'AUD') exchangeRateToCurrency = 0.018;

  if (!templates || templates.length === 0) {
    const baseDailyCostINR = isInternational ? 15000 : 3500;
    templates = [
      {
        summary: `Explore Historic Old Town & Central Landmarks of ${rawName}`,
        morning: `Check into hotel in ${rawName}; morning walking tour of central heritage square & historic monuments.`,
        afternoon: `Visit premier city art museum, cultural heritage centers & scenic city garden.`,
        evening: `Sunset viewpoint overlooking ${rawName} city skyline followed by authentic regional dinner.`,
        baseCostINR: Math.round(baseDailyCostINR * 1.0),
        highlight: `Old Town & Skyline View of ${rawName}`
      },
      {
        summary: `Cultural Exploration, Local Bazaars & Iconic Cuisine in ${rawName}`,
        morning: `Guided morning tour of ${rawName}’s iconic architectural landmarks and sacred temples/cathedrals.`,
        afternoon: `Shop for artisanal handicrafts, spices & souvenirs at famous local street bazaar.`,
        evening: `Food tasting walk trying top signature culinary delicacies of ${rawName}.`,
        baseCostINR: Math.round(baseDailyCostINR * 0.9),
        highlight: `${rawName} Bazaar & Food Walk`
      },
      {
        summary: `Scenic Nature Excursion & Sunset Waterfront in ${rawName}`,
        morning: `Morning trip to nearby hillside lookout, lake, or natural landscape surrounding ${rawName}.`,
        afternoon: `Relaxing boat ride or nature trail hike with organic farm-to-table lunch.`,
        evening: `Atmospheric sunset lounge dinner with live traditional musical performance.`,
        baseCostINR: Math.round(baseDailyCostINR * 1.15),
        highlight: `Nature Excursion & Sunset in ${rawName}`
      },
      {
        summary: `Arts, Botanical Gardens & Modern Entertainment in ${rawName}`,
        morning: `Stroll through ${rawName}’s lush botanical gardens and royal palace gardens.`,
        afternoon: `Visit contemporary art galleries, science centers & shopping promenade.`,
        evening: `Evening theater / cultural show and rooftop cocktail dinner.`,
        baseCostINR: Math.round(baseDailyCostINR * 1.05),
        highlight: `Botanical Gardens & Culture in ${rawName}`
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
