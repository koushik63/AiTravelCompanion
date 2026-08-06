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
  // 0. Vizag / Visakhapatnam
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
      summary: 'Borra Caves & Araku Valley Coffee Plantations Excursion',
      morning: 'Scenic Vizag to Araku Vistadome train ride through 58 tunnels.',
      afternoon: 'Explore 150 million-year-old Borra Limestone Caves & Katiki Waterfalls.',
      evening: 'Visit Araku Tribal Museum & taste organic Araku Valley Filter Coffee.',
      baseCostINR: 4500,
      highlight: 'Borra Caves & Araku Valley Coffee'
    },
    {
      summary: 'Simhachalam Temple & Yarada Beach Sunset Cliff',
      morning: 'Visit sacred 11th-century Simhachalam Lord Narasimha Temple atop hill.',
      afternoon: 'Excursion to secluded Yarada Beach & Dolphin’s Nose Lighthouse lookout.',
      evening: 'Farewell seafood thali dinner at Sea Pearl Restaurant.',
      baseCostINR: 3500,
      highlight: 'Simhachalam Temple & Yarada Beach'
    }
  ],

  // 1. Pune
  pune: [
    {
      summary: 'Shaniwar Wada Fort, Lal Mahal & Dagdusheth Ganpati Temple',
      morning: 'Explore historic 1730 AD Shaniwar Wada Peshwa Palace ramparts & Lal Mahal.',
      afternoon: 'Visit revered Shreemant Dagdusheth Halwai Ganpati Temple & Tulshibaug market.',
      evening: 'Authentic Puneri Misal Pav & Mastani Mango drink tasting at Sujata Mastani.',
      baseCostINR: 3200,
      highlight: 'Shaniwar Wada Fort & Dagdusheth Temple'
    },
    {
      summary: 'Aga Khan Palace, Osho Teerth Park & Koregaon Park Cafes',
      morning: 'Tour historic Aga Khan Palace (Mahatma Gandhi Memorial & ashes memorial).',
      afternoon: 'Stroll serene Osho Teerth Zen Park botanical trails.',
      evening: 'Boutique cafe dining & live music walk in Koregaon Park.',
      baseCostINR: 3500,
      highlight: 'Aga Khan Palace & Koregaon Park'
    }
  ],

  // 2. Assam
  assam: [
    {
      summary: 'Guwahati Kamakhya Temple & Brahmaputra Sunset Cruise',
      morning: 'Visit sacred 51 Shakti Peeth Kamakhya Temple atop Nilachal Hill in Guwahati.',
      afternoon: 'Guided walk through Assam State Museum & Umananda Peacock Island Temple.',
      evening: 'Sunset Alfresco Cruise on Brahmaputra River with traditional Assamese dinner.',
      baseCostINR: 3500,
      highlight: 'Kamakhya Temple & Brahmaputra Sunset Cruise'
    }
  ],

  // 3. Kerala
  kerala: [
    {
      summary: 'Fort Kochi Heritage Walk, St. Francis Church & Chinese Nets',
      morning: 'Explore historic Fort Kochi, Mattancherry Dutch Palace & Jewish Synagogue.',
      afternoon: 'View iconic Chinese Fishing Nets & fresh seafood lunch by the Arabian Sea.',
      evening: 'Traditional Kathakali Cultural Dance Performance with elaborate face makeup.',
      baseCostINR: 3800,
      highlight: 'Fort Kochi & Kathakali Performance'
    }
  ],

  // 4. Hyderabad
  hyderabad: [
    {
      summary: 'Charminar, Laad Bazaar Pearls & Chowmahalla Palace',
      morning: 'Visit iconic 16th-century Charminar monument; climb up for Old City views.',
      afternoon: 'Shop for Hyderabadi lac bangles at Laad Bazaar, then tour Chowmahalla Palace.',
      evening: 'Authentic Hyderabadi Dum Biryani dinner at Paradise or Shadab Restaurant.',
      baseCostINR: 2800,
      highlight: 'Charminar & Royal Chowmahalla Palace'
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
  if (dest.includes('vizag') || dest.includes('visakhapatnam')) key = 'vizag';
  else if (dest.includes('pune')) key = 'pune';
  else if (dest.includes('assam')) key = 'assam';
  else if (dest.includes('kerala')) key = 'kerala';
  else if (dest.includes('hyderabad') || dest.includes('secunderabad')) key = 'hyderabad';
  else if (dest.includes('goa')) key = 'goa';
  else if (dest.includes('mumbai') || dest.includes('bombay')) key = 'mumbai';
  else if (dest.includes('delhi')) key = 'delhi';
  else if (dest.includes('jaipur')) key = 'jaipur';
  else if (dest.includes('dubai')) key = 'dubai';
  else if (dest.includes('paris')) key = 'paris';
  else if (dest.includes('tokyo')) key = 'tokyo';

  let templates = key ? DESTINATION_TEMPLATES[key] : null;

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
