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
  // 1. Assam
  assam: [
    {
      summary: 'Guwahati Kamakhya Temple & Brahmaputra River Sunset Cruise',
      morning: 'Visit sacred 51 Shakti Peeth Kamakhya Temple atop Nilachal Hill in Guwahati.',
      afternoon: 'Guided walk through Assam State Museum & Umananda Peacock Island Temple in Brahmaputra River.',
      evening: 'Sunset Alfresco Cruise on Brahmaputra River with traditional Assamese dinner.',
      baseCostINR: 3500,
      highlight: 'Kamakhya Temple & Brahmaputra Sunset Cruise'
    },
    {
      summary: 'Kaziranga National Park Elephant & Jeep Rhinoceros Safari',
      morning: 'Early 5:30 AM Elephant Safari in Kaziranga Central Range viewing endangered One-Horned Rhinoceros.',
      afternoon: 'Jeep Safari through Western Range & visit Kaziranga National Orchid Park.',
      evening: 'Traditional Assamese Thali dinner featuring Masor Tenga & local bamboo shoot dishes.',
      baseCostINR: 4800,
      highlight: 'Kaziranga One-Horned Rhino Safari'
    },
    {
      summary: 'Majuli Island River Heritage & Satra Monasteries',
      morning: 'Ferry ride from Jorhat to Majuli Island (World’s Largest River Island).',
      afternoon: 'Guided walk through Kamalabari & Auniati Satra Vaishnavite monasteries.',
      evening: 'Traditional Mising tribal village walk & evening riverbank sunset view.',
      baseCostINR: 3800,
      highlight: 'Majuli Island & Satra Monasteries'
    }
  ],

  // 2. Kerala
  kerala: [
    {
      summary: 'Fort Kochi Heritage Walk, St. Francis Church & Chinese Nets',
      morning: 'Explore historic Fort Kochi, Mattancherry Dutch Palace & Jewish Synagogue.',
      afternoon: 'View iconic Chinese Fishing Nets & fresh seafood lunch by the Arabian Sea.',
      evening: 'Traditional Kathakali Cultural Dance Performance with elaborate face makeup.',
      baseCostINR: 3800,
      highlight: 'Fort Kochi & Kathakali Performance'
    },
    {
      summary: 'Munnar Rolling Tea Estates & Cheeyappara Waterfalls',
      morning: 'Drive through misty Western Ghats stopping at Cheeyappara & Valara Waterfalls.',
      afternoon: 'Guided walk through Tata Tea Plantations & visit Munnar Tea Museum.',
      evening: 'Campfire dinner overlooking lush Tea Valley in Munnar hill station.',
      baseCostINR: 4200,
      highlight: 'Munnar Tea Estates & Waterfalls'
    },
    {
      summary: 'Alleppey Deluxe Backwaters Houseboat Cruise',
      morning: 'Board private Deluxe Kerala Houseboat in Alleppey (Alappuzha) backwaters.',
      afternoon: 'Cruise past quiet palm-fringed lagoons with fresh Karimeen Pollichathu fish lunch.',
      evening: 'Sunset over Vembanad Lake & overnight peaceful houseboat stay.',
      baseCostINR: 6500,
      highlight: 'Alleppey Backwater Houseboat Cruise'
    }
  ],

  // 3. Cairo & Egypt
  cairo: [
    {
      summary: 'Giza Plateau Pyramids, Great Sphinx & Camel Safari',
      morning: 'Explore Great Pyramids of Giza (Khufu, Khafre, Menkaure) & Camel Safari.',
      afternoon: 'Photograph iconic Great Sphinx Monument & Valley Temple of Khafre.',
      evening: 'Sunset Nile River Felucca Boat Cruise with Egyptian Koshary Dinner.',
      baseCostINR: 12500,
      highlight: 'Giza Pyramids & Great Sphinx'
    },
    {
      summary: 'Grand Egyptian Museum & King Tutankhamun Treasures',
      morning: 'Visit Grand Egyptian Museum (GEM) & King Tutankhamun Golden Treasures.',
      afternoon: 'Tour Tahrir Square Historic Museum of Egyptian Antiquities.',
      evening: 'Authentic Grill Dinner in Downtown Cairo.',
      baseCostINR: 14000,
      highlight: 'Grand Egyptian Museum & King Tut'
    },
    {
      summary: 'Khan el-Khalili 14th-Century Souk & El Fishawy Cafe',
      morning: 'Guided walk through 14th-century Khan el-Khalili Medieval Spice Bazaar.',
      afternoon: 'Traditional Mint Tea session at historic El Fishawy Cafe.',
      evening: 'Sound & Light Show at Giza Pyramids.',
      baseCostINR: 11000,
      highlight: 'Khan el-Khalili Bazaar & Sound Show'
    }
  ],

  // 4. Darjeeling
  darjeeling: [
    {
      summary: 'Tiger Hill 4:00 AM Sunrise & Mount Kanchenjunga View',
      morning: '4:00 AM excursion to Tiger Hill for sunrise over Mount Kanchenjunga.',
      afternoon: 'Visit Batasia Loop heritage railway monument & Ghoom Monastery.',
      evening: 'Stroll Chowrasta Mall Road & tea tasting at Nathmulls.',
      baseCostINR: 3500,
      highlight: 'Tiger Hill Sunrise over Kanchenjunga'
    },
    {
      summary: 'UNESCO Toy Train Ride & Happy Valley Tea Estate',
      morning: 'Ride UNESCO Darjeeling Himalayan Railway Steam Toy Train.',
      afternoon: 'Guided tea leaf picking walk at Happy Valley Tea Estate.',
      evening: 'Cozy dinner at Kunga Restaurant trying hot Momos & Thukpa.',
      baseCostINR: 4200,
      highlight: 'UNESCO Toy Train & Tea Estate'
    }
  ],

  // 5. Rishikesh
  rishikesh: [
    {
      summary: 'Laxman Jhula & Ram Jhula Suspension Bridges Walk',
      morning: 'Walk historic Laxman Jhula & Ram Jhula suspension bridges across Ganges.',
      afternoon: 'Explore Trayambakeshwar Temple (13-Story Temple).',
      evening: 'Attend Parmarth Niketan Evening Ganga Aarti Ceremony with Vedic Chanting.',
      baseCostINR: 2500,
      highlight: 'Laxman Jhula & Ganga Aarti'
    },
    {
      summary: 'White Water Ganges River Rafting & Cliff Jump',
      morning: '16km White Water Ganges River Rafting from Shivpuri to Rishikesh.',
      afternoon: 'Cliff Jumping & Body Surfing in crystal glacier Ganges waters.',
      evening: 'Riverside organic cafe dinner at Little Buddha Cafe.',
      baseCostINR: 3200,
      highlight: 'Shivpuri Ganges White Water Rafting'
    }
  ],

  // 6. Ladakh / Leh
  ladakh: [
    {
      summary: 'Acclimatization, Leh Market & Shanti Stupa Sunset',
      morning: 'Rest & acclimatization to high altitude (11,500 ft) in Leh town.',
      afternoon: 'Walk through Leh Main Bazaar & Leh Palace ruins.',
      evening: 'Panoramic sunset view over Indus Valley from white Shanti Stupa.',
      baseCostINR: 4500,
      highlight: 'Shanti Stupa Sunset & Leh Palace'
    },
    {
      summary: 'Khardung La Pass (17,582 ft) to Nubra Valley Drive',
      morning: 'Scenic mountain drive across Khardung La Pass (highest motorable road).',
      afternoon: 'Visit Diskit Monastery & 106ft Giant Maitreya Buddha Statue.',
      evening: 'Double-Humped Bactrian Camel Ride on Hunder Sand Dunes.',
      baseCostINR: 6800,
      highlight: 'Khardung La Pass & Hunder Camel Safari'
    }
  ],

  // 7. Kashmir / Srinagar
  kashmir: [
    {
      summary: 'Dal Lake Shikara Ride & Luxury Houseboat Check-in',
      morning: 'Arrive Srinagar, check-in to hand-carved Wooden Luxury Houseboat.',
      afternoon: '2-Hour Shikara Ride on Dal Lake through Meena Bazaar & Floating Gardens.',
      evening: 'Sunset over Zabarwan Mountains & Kashmiri Kahwa Tea.',
      baseCostINR: 4800,
      highlight: 'Dal Lake Houseboat & Shikara Ride'
    },
    {
      summary: 'Gulmarg Gondola Ride to Phase 2 Snow Peak',
      morning: 'Day excursion to Gulmarg: Ride Asia’s highest Gondola to Phase 2 (Kongdoori).',
      afternoon: 'Snow sledge ride & skiing on Apharwat Peak slopes.',
      evening: 'Return to Srinagar for Wazwan 7-Course Royal Dinner.',
      baseCostINR: 6200,
      highlight: 'Gulmarg Gondola Phase 2 Snow Peak'
    }
  ],

  // 8. California
  california: [
    {
      summary: 'San Francisco Golden Gate Bridge, Pier 39 & Fisherman’s Wharf',
      morning: 'Walk & photo session across iconic Golden Gate Bridge; explore Crissy Field.',
      afternoon: 'Fisherman’s Wharf sourdough clam chowder lunch & watch famous sea lions at Pier 39.',
      evening: 'Historic Cable Car ride to Ghirardelli Square for hot fudge sundaes.',
      baseCostINR: 18500,
      highlight: 'Golden Gate Bridge & Pier 39'
    }
  ],

  // 9. Hyderabad
  hyderabad: [
    {
      summary: 'Charminar, Laad Bazaar Pearls & Chowmahalla Palace',
      morning: 'Visit iconic 16th-century Charminar monument; climb up for Old City views.',
      afternoon: 'Shop for Hyderabadi lac bangles at Laad Bazaar, then tour Chowmahalla Palace.',
      evening: 'Authentic Hyderabadi Dum Biryani dinner at Paradise or Shadab Restaurant.',
      baseCostINR: 2800,
      highlight: 'Charminar & Royal Chowmahalla Palace'
    }
  ],

  // 10. USA
  usa: [
    {
      summary: 'Statue of Liberty, Wall Street & Empire State Building',
      morning: 'Liberty Island ferry ride to Statue of Liberty monument & Ellis Island Museum.',
      afternoon: 'Walk through Financial District charging bull, Wall Street & 9/11 Memorial Pools.',
      evening: 'Sunset views from Empire State Building 86th Floor Observatory & Times Square.',
      baseCostINR: 18500,
      highlight: 'Statue of Liberty & Empire State Observatory'
    }
  ],

  // 11. Dubai
  dubai: [
    {
      summary: 'Burj Khalifa 148th Floor, Dubai Mall & Fountain Show',
      morning: 'Priority elevator entry to Burj Khalifa 148th Floor Sky Observation Deck.',
      afternoon: 'Explore Dubai Mall, Dubai Aquarium & Underwater Zoo.',
      evening: 'Spectacular Dubai Fountain music & light show set against Burj Khalifa.',
      baseCostINR: 14500,
      highlight: 'Burj Khalifa Sky Deck & Dubai Fountain'
    }
  ],

  // 12. Paris
  paris: [
    {
      summary: 'Eiffel Tower Summit, Seine River Cruise & Louvre Museum',
      morning: 'Priority access to Eiffel Tower summit for 360° views over Paris skyline.',
      afternoon: 'Guided masterpiece tour of the Louvre Museum viewing Mona Lisa.',
      evening: 'Sunset glass-canopy Bateaux Parisians cruise along Seine River with dinner.',
      baseCostINR: 16500,
      highlight: 'Eiffel Tower Summit & Seine Dinner Cruise'
    }
  ],

  // 13. Tokyo
  tokyo: [
    {
      summary: 'Shibuya Crossing, Harajuku Fashion & Meiji Jingu Shrine',
      morning: 'Walk through peaceful Meiji Shrine forest gardens & Torii gate entrance.',
      afternoon: 'Takeshita Street Harajuku pop culture shopping & Shibuya Scramble Crossing.',
      evening: 'Authentic Tokyo Ramen Alley dinner in Shinjuku & Kabukicho night walk.',
      baseCostINR: 13500,
      highlight: 'Shibuya Crossing & Meiji Shrine'
    }
  ],

  // 14. Goa
  goa: [
    {
      summary: 'North Goa Beaches & Fort Aguada',
      morning: 'Check in to beachside resort in Baga/Calangute; morning coastal relaxation.',
      afternoon: 'Visit 17th-century Fort Aguada lighthouse viewpoint and Chapora Fort.',
      evening: 'Sunset beach lounge session at Thalassa Vagator followed by seafood dinner.',
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
  if (dest.includes('assam')) key = 'assam';
  else if (dest.includes('kerala')) key = 'kerala';
  else if (dest.includes('cairo') || dest.includes('egypt')) key = 'cairo';
  else if (dest.includes('darjeeling')) key = 'darjeeling';
  else if (dest.includes('rishikesh')) key = 'rishikesh';
  else if (dest.includes('ladakh') || dest.includes('leh')) key = 'ladakh';
  else if (dest.includes('kashmir') || dest.includes('srinagar')) key = 'kashmir';
  else if (dest.includes('california') || dest.includes('san francisco') || dest.includes('los angeles')) key = 'california';
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
    dest.includes('switzerland') ||
    dest.includes('cairo') ||
    dest.includes('egypt');

  let exchangeRateToCurrency = 1;
  const currUpper = (currency || 'INR').toUpperCase().trim();
  if (currUpper === 'USD') exchangeRateToCurrency = 0.012;
  else if (currUpper === 'EUR') exchangeRateToCurrency = 0.011;
  else if (currUpper === 'GBP') exchangeRateToCurrency = 0.0094;
  else if (currUpper === 'AED') exchangeRateToCurrency = 0.044;
  else if (currUpper === 'JPY') exchangeRateToCurrency = 1.82;

  if (!templates || templates.length === 0) {
    const baseDailyCostINR = isInternational ? 14000 : 3800;
    templates = [
      {
        summary: `Historic City Heritage District & Local Monument Tour in ${capitalizedName}`,
        morning: `Morning guided walk through central historical quarter & iconic landmarks in ${capitalizedName}.`,
        afternoon: `Visit top-rated national cultural museum & local craft markets in ${capitalizedName}.`,
        evening: `Sunset terrace dining overlooking ${capitalizedName} skyline & authentic regional specialties.`,
        baseCostINR: Math.round(baseDailyCostINR * 1.0),
        highlight: `Heritage District & City Skyline in ${capitalizedName}`
      },
      {
        summary: `Scenic Nature Excursion & Cultural Craft Bazaars in ${capitalizedName}`,
        morning: `Scenic morning excursion to nearby mountain lookout or nature park surrounding ${capitalizedName}.`,
        afternoon: `Explore artisan handicraft bazaars & sample authentic street food delicacies in ${capitalizedName}.`,
        evening: `Waterfront promenade walk & traditional performing arts show in ${capitalizedName}.`,
        baseCostINR: Math.round(baseDailyCostINR * 0.9),
        highlight: `Nature Excursion & Cultural Bazaars in ${capitalizedName}`
      },
      {
        summary: `Artisan Markets & Culinary Tasting Walk in ${capitalizedName}`,
        morning: `Visit historic cathedral, fort or central cultural gallery in ${capitalizedName}.`,
        afternoon: `Guided food tasting walk trying top regional delicacies at popular local bistros.`,
        evening: `Sunset lounge session & candlelit dinner in ${capitalizedName}.`,
        baseCostINR: Math.round(baseDailyCostINR * 1.1),
        highlight: `Artisan Markets & Gourmet Tasting in ${capitalizedName}`
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
