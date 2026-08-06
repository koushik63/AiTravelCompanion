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
  // 0. Araku / Araku Valley
  araku: [
    {
      summary: 'Borra Caves & Katiki Waterfalls Exploration',
      morning: 'Explore 150 million-year-old Borra Limestone Caves & majestic stalactite formations.',
      afternoon: 'Trek through bamboo forests to scenic Katiki Waterfalls & natural pool.',
      evening: 'Campfire dinner trying famous authentic Araku Bamboo Chicken (Bongu Julu).',
      baseCostINR: 3200,
      highlight: 'Borra Caves & Katiki Waterfalls'
    },
    {
      summary: 'Araku Coffee Plantations, Tribal Museum & Dhimsa Dance',
      morning: 'Guided coffee bean picking walk at organic Araku Valley Coffee Estates & Chaparai Cascades.',
      afternoon: 'Tour Araku Tribal Museum showcasing indigenous heritage, crafts & lifestyle.',
      evening: 'Watch live Dhimsa Tribal Folk Dance performance & sunset view from Galikonda Viewpoint.',
      baseCostINR: 3500,
      highlight: 'Araku Coffee Estates & Tribal Museum'
    },
    {
      summary: 'Padmapuram Gardens & Ananthagiri Hills Trek',
      morning: 'Stroll Padmapuram Botanical Gardens & historic tree top hanging huts.',
      afternoon: 'Visit Ananthagiri Waterfalls & scenic coffee plantation trail walk.',
      evening: 'Sample freshly brewed organic Araku Filter Coffee & local forest honey before departure.',
      baseCostINR: 3000,
      highlight: 'Padmapuram Gardens & Ananthagiri Hills'
    }
  ],

  // 1. Vizag / Visakhapatnam
  vizag: [
    {
      summary: 'INS Kursura Submarine Museum, RK Beach & Tenneti Park',
      morning: 'Tour historic INS Kursura Submarine Museum & TU 142 Aircraft Museum on RK Beach.',
      afternoon: 'Explore Victory at Sea Memorial & enjoy fresh coconut water at Ramakrishna Beach.',
      evening: 'Sunset walk at Tenneti Park cliff overlook & seaside seafood dinner.',
      baseCostINR: 3200,
      highlight: 'INS Kursura Submarine Museum & RK Beach'
    },
    {
      summary: 'Kailasagiri Hilltop Ropeway & Rushikonda Blue Flag Beach',
      morning: 'Ride Kailasagiri Ropeway to hilltop park viewing giant Lord Shiva & Parvati statues.',
      afternoon: 'Water sports, speedboating & surf lessons at Rushikonda Blue Flag Beach.',
      evening: 'Seafood grill dinner at Rushikonda Beach Resort.',
      baseCostINR: 3800,
      highlight: 'Kailasagiri Ropeway & Rushikonda Beach'
    },
    {
      summary: 'Borra Caves & Araku Coffee Plantations Excursion',
      morning: 'Scenic Vizag to Araku Vistadome train ride through 58 tunnels.',
      afternoon: 'Explore 150 million-year-old Borra Limestone Caves & Katiki Waterfalls.',
      evening: 'Visit Araku Tribal Museum & taste organic Araku Valley Filter Coffee.',
      baseCostINR: 4500,
      highlight: 'Borra Caves & Araku Valley Coffee'
    }
  ],

  // 2. Tirupati
  tirupati: [
    {
      summary: 'Tirumala Venkateswara Swamy Temple & Srivari Padalu',
      morning: 'Darshan at sacred Lord Venkateswara Swamy Temple in Tirumala hills.',
      afternoon: 'Visit Srivari Padalu, Silathoranam natural rock arch & Chakra Tirtham.',
      evening: 'Traditional South Indian Prasadam thali & evening temple illuminations.',
      baseCostINR: 2800,
      highlight: 'Tirumala Temple & Silathoranam Arch'
    },
    {
      summary: 'Sri Kalahasti Temple & Chandragiri Fort Excursion',
      morning: 'Visit ancient Vayu Lingam Sri Kalahasteeswara Temple in Sri Kalahasti.',
      afternoon: 'Tour 11th-century Vijayanagara Raja Mahal & Rani Mahal at Chandragiri Fort.',
      evening: 'Sunset view from Kapila Theertham waterfall temple in Tirupati town.',
      baseCostINR: 3200,
      highlight: 'Sri Kalahasti & Chandragiri Fort'
    }
  ],

  // 3. Vijayawada / Amaravati
  vijayawada: [
    {
      summary: 'Kanakadurga Temple, Prakasam Barrage & Bhavani Island',
      morning: 'Visit sacred Kanakadurga Temple atop Indrakeeladri Hill overlooking Krishna River.',
      afternoon: 'Walk scenic Prakasam Barrage & boat ride to Bhavani Island resort.',
      evening: 'Water sports & riverside dinner at Bhavani Island.',
      baseCostINR: 3000,
      highlight: 'Kanakadurga Temple & Bhavani Island'
    },
    {
      summary: 'Undavalli Caves & Amaravati Stupa Heritage',
      morning: 'Explore 7th-century monolithic rock-cut Undavalli Caves & 5-story Anantasayana Vishnu statue.',
      afternoon: 'Excursion to ancient Buddhist Maha Stupa & Dhyana Buddha Statue in Amaravati.',
      evening: 'Traditional Andhra thali dinner featuring Gongura Pachadi.',
      baseCostINR: 3400,
      highlight: 'Undavalli Caves & Amaravati Stupa'
    }
  ],

  // 4. Coorg / Madikeri
  coorg: [
    {
      summary: 'Abbey Falls, Raja’s Seat & Madikeri Fort',
      morning: 'Walk through spice plantations to majestic Abbey Falls waterfalls.',
      afternoon: 'Explore Madikeri Fort palace, museum & Omkareshwara Temple.',
      evening: 'Sunset panorama view over misty Western Ghats valleys at Raja’s Seat.',
      baseCostINR: 3600,
      highlight: 'Abbey Falls & Raja’s Seat Sunset'
    },
    {
      summary: 'Bhadra / Dubare Elephant Camp & Namdroling Monastery',
      morning: 'Elephant bathing & feeding experience at Dubare Elephant Camp on Cauvery River.',
      afternoon: 'Visit Golden Temple Namdroling Tibetan Monastery in Bylakuppe.',
      evening: 'Campfire dinner tasting authentic Pandi Curry & Akki Roti in Coorg.',
      baseCostINR: 4200,
      highlight: 'Dubare Elephant Camp & Tibetan Golden Temple'
    }
  ],

  // 5. Wayanad
  wayanad: [
    {
      summary: 'Edakkal Caves Prehistoric Petroglyphs & Banasura Sagar Dam',
      morning: 'Trek to 7,000-year-old Neolithic Stone Age petroglyphs inside Edakkal Caves.',
      afternoon: 'Speedboating & ziplining at Banasura Sagar Dam (largest earth dam in India).',
      evening: 'Sunset walk at Pookode Lake & spice shopping.',
      baseCostINR: 3800,
      highlight: 'Edakkal Caves & Banasura Sagar Dam'
    },
    {
      summary: 'Chembra Peak Heart Lake & Meenmutty Waterfalls',
      morning: 'Trek to famous natural Heart-Shaped Lake at Chembra Peak.',
      afternoon: 'Guided walk through tea gardens to 300m 3-tiered Meenmutty Waterfalls.',
      evening: 'Resort bonfire & authentic Kerala Malabar Biryani dinner.',
      baseCostINR: 4200,
      highlight: 'Chembra Peak Heart Lake & Meenmutty Falls'
    }
  ],

  // 6. Ooty / Kodaikanal
  ooty: [
    {
      summary: 'Ooty Nilgiri Mountain Toy Train & Botanical Gardens',
      morning: 'Ride UNESCO Nilgiri Mountain Railway Steam Toy Train from Coonoor to Ooty.',
      afternoon: 'Stroll 55-acre Government Botanical Garden & Rose Garden.',
      evening: 'Boating at Ooty Lake & Homemade Chocolate tasting on Commercial Road.',
      baseCostINR: 3800,
      highlight: 'UNESCO Toy Train & Botanical Garden'
    },
    {
      summary: 'Doddabetta Peak (8,652 ft) & Pykara Lake Waterfalls',
      morning: 'Panoramic sunrise views over Nilgiri hills from Doddabetta Peak telescope house.',
      afternoon: 'Speedboating on Pykara Lake & walk Pykara Waterfalls pine forests.',
      evening: 'Cozy dinner at Earl’s Secret heritage restaurant in Ooty.',
      baseCostINR: 4000,
      highlight: 'Doddabetta Peak & Pykara Waterfalls'
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
  if (dest.includes('araku')) key = 'araku';
  else if (dest.includes('vizag') || dest.includes('visakhapatnam')) key = 'vizag';
  else if (dest.includes('tirupati')) key = 'tirupati';
  else if (dest.includes('vijayawada') || dest.includes('amaravati')) key = 'vijayawada';
  else if (dest.includes('coorg') || dest.includes('madikeri')) key = 'coorg';
  else if (dest.includes('wayanad')) key = 'wayanad';
  else if (dest.includes('ooty') || dest.includes('kodaikanal')) key = 'ooty';
  else if (dest.includes('pune')) key = 'pune';
  else if (dest.includes('assam')) key = 'assam';
  else if (dest.includes('kerala')) key = 'kerala';
  else if (dest.includes('hyderabad')) key = 'hyderabad';

  let templates = key ? DESTINATION_TEMPLATES[key] : null;

  const isNatureHill =
    dest.includes('valley') ||
    dest.includes('hill') ||
    dest.includes('beach') ||
    dest.includes('island') ||
    dest.includes('mountain') ||
    dest.includes('caves') ||
    dest.includes('waterfall') ||
    dest.includes('lake') ||
    dest.includes('resort') ||
    dest.includes('forest') ||
    dest.includes('sanctuary') ||
    dest.includes('araku') ||
    dest.includes('coorg') ||
    dest.includes('wayanad') ||
    dest.includes('chikmagalur') ||
    dest.includes('ooty') ||
    dest.includes('kodaikanal') ||
    dest.includes('munnar');

  const isInternational =
    dest.includes('usa') ||
    dest.includes('paris') ||
    dest.includes('london') ||
    dest.includes('tokyo') ||
    dest.includes('dubai') ||
    dest.includes('bali');

  let exchangeRateToCurrency = 1;
  const currUpper = (currency || 'INR').toUpperCase().trim();
  if (currUpper === 'USD') exchangeRateToCurrency = 0.012;
  else if (currUpper === 'EUR') exchangeRateToCurrency = 0.011;
  else if (currUpper === 'GBP') exchangeRateToCurrency = 0.0094;
  else if (currUpper === 'AED') exchangeRateToCurrency = 0.044;
  else if (currUpper === 'JPY') exchangeRateToCurrency = 1.82;

  if (!templates || templates.length === 0) {
    const baseDailyCostINR = isInternational ? 14000 : 3500;

    if (isNatureHill) {
      templates = [
        {
          summary: `Valley Lookout & Scenic Waterfall Trek in ${capitalizedName}`,
          morning: `Morning nature trail hike to scenic mountain waterfalls & lush valley lookouts in ${capitalizedName}.`,
          afternoon: `Visit organic coffee & spice plantations, local botanical gardens & eco-parks in ${capitalizedName}.`,
          evening: `Sunset viewpoint walk over ${capitalizedName} hills followed by authentic local bonfire dinner.`,
          baseCostINR: Math.round(baseDailyCostINR * 1.0),
          highlight: `Waterfall Trek & Coffee Plantations in ${capitalizedName}`
        },
        {
          summary: `Tribal Heritage, Local Crafts & Specialty Tasting in ${capitalizedName}`,
          morning: `Guided tour of local tribal heritage museum, ancient cave formations & village walks in ${capitalizedName}.`,
          afternoon: `Explore artisan handicraft bazaars & sample authentic local regional delicacies in ${capitalizedName}.`,
          evening: `Peaceful lakeside stroll & organic tea/coffee tasting session in ${capitalizedName}.`,
          baseCostINR: Math.round(baseDailyCostINR * 0.9),
          highlight: `Tribal Heritage & Local Delicacies in ${capitalizedName}`
        },
        {
          summary: `Panoramic High-Altitude Summit & Nature Reserve Excursion in ${capitalizedName}`,
          morning: `Early morning drive to highest summit peak in ${capitalizedName} for panoramic sunrise views.`,
          afternoon: `Wildlife nature sanctuary jeep safari & forest trail trekking.`,
          evening: `Farewell candlelit resort dinner & starry night relaxation in ${capitalizedName}.`,
          baseCostINR: Math.round(baseDailyCostINR * 1.1),
          highlight: `Summit Viewpoint & Nature Reserve in ${capitalizedName}`
        }
      ];
    } else {
      templates = [
        {
          summary: `${capitalizedName} Heritage Circuit & Landmark Exploration`,
          morning: `Morning guided walk through ${capitalizedName}'s historic architectural monuments & central heritage square.`,
          afternoon: `Visit ${capitalizedName}'s renowned local heritage gallery, artisan craft bazaars & cultural exhibits.`,
          evening: `Sunset viewpoint walk followed by authentic regional dinner specialties in ${capitalizedName}.`,
          baseCostINR: Math.round(baseDailyCostINR * 1.0),
          highlight: `Heritage Circuit & City Views in ${capitalizedName}`
        },
        {
          summary: `${capitalizedName} Nature Trails & Panoramic Excursion`,
          morning: `Scenic morning excursion to nearby hillside lookout, nature reserve & botanical paths surrounding ${capitalizedName}.`,
          afternoon: `Sample signature local regional delicacies & street food specialties at top-rated ${capitalizedName} bistros.`,
          evening: `Waterfront promenade stroll & evening cultural music session in ${capitalizedName}.`,
          baseCostINR: Math.round(baseDailyCostINR * 0.9),
          highlight: `Nature Trails & Gourmet Tasting in ${capitalizedName}`
        },
        {
          summary: `${capitalizedName} Cultural Crafts & Scenic Overlook`,
          morning: `Explore historic fort ruins, ancient temples & traditional craft workshops in ${capitalizedName}.`,
          afternoon: `Guided walk through ${capitalizedName}'s famous spice markets & artisan souvenir shops.`,
          evening: `Farewell candlelit rooftop dinner overlooking the golden lights of ${capitalizedName}.`,
          baseCostINR: Math.round(baseDailyCostINR * 1.1),
          highlight: `Cultural Crafts & Rooftop Dinner in ${capitalizedName}`
        }
      ];
    }
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

    const summaryTitle = i < templates.length ? template.summary : `${template.summary} (Part ${Math.floor(i / templates.length) + 1})`;

    days.push({
      day: `Day ${dayNumber}: ${summaryTitle}`,
      morning: template.morning,
      afternoon: template.afternoon,
      evening: template.evening,
      cost: formattedCostStr,
      highlight: template.highlight
    });
  }

  return days;
}
