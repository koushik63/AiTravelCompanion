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
    }
  ],

  // 2. Pune
  pune: [
    {
      summary: 'Shaniwar Wada Fort, Lal Mahal & Dagdusheth Ganpati Temple',
      morning: 'Explore historic 1730 AD Shaniwar Wada Peshwa Palace ramparts & Lal Mahal.',
      afternoon: 'Visit revered Shreemant Dagdusheth Halwai Ganpati Temple & Tulshibaug market.',
      evening: 'Authentic Puneri Misal Pav & Mastani Mango drink tasting at Sujata Mastani.',
      baseCostINR: 3200,
      highlight: 'Shaniwar Wada Fort & Dagdusheth Temple'
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
  else if (dest.includes('pune')) key = 'pune';
  else if (dest.includes('assam')) key = 'assam';
  else if (dest.includes('kerala')) key = 'kerala';
  else if (dest.includes('hyderabad') || dest.includes('secunderabad')) key = 'hyderabad';
  else if (dest.includes('goa')) key = 'goa';

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
