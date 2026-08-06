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
  // 0. Chennai
  chennai: [
    {
      summary: 'Marina Beach Promenade, Kapaleeshwarar Temple & San Thome Basilica',
      morning: 'Visit 7th-century Dravidian Kapaleeshwarar Temple in historic Mylapore.',
      afternoon: 'Tour neo-Gothic San Thome Basilica Cathedral built over St. Thomas tomb.',
      evening: 'Sunset walk along 13km Marina Beach promenade & sample Murugan Idli Shop dinner.',
      baseCostINR: 3200,
      highlight: 'Marina Beach & Kapaleeshwarar Temple'
    },
    {
      summary: 'Fort St. George, Government Museum & Egmore Art Gallery',
      morning: 'Tour 1644 AD Fort St. George (first English fortress in India) & St. Mary’s Church.',
      afternoon: 'Explore Bronze Gallery at Government Museum Egmore viewing Chola bronzes.',
      evening: 'Shop for Kanchipuram Silk Sarees at T. Nagar & enjoy filter coffee at Saravana Bhavan.',
      baseCostINR: 3500,
      highlight: 'Fort St. George & Government Museum'
    },
    {
      summary: 'UNESCO Shore Temple & Mahabalipuram Monuments Excursion',
      morning: 'Day trip to Mahabalipuram: Explore 8th-century UNESCO Shore Temple by the ocean.',
      afternoon: 'Photograph Arjuna’s Penance rock relief & balance at Krishna’s Butterball.',
      evening: 'Fresh seafood dinner at Mahabalipuram Beach Resort before returning to Chennai.',
      baseCostINR: 4200,
      highlight: 'UNESCO Shore Temple & Mahabalipuram'
    },
    {
      summary: 'DakshinaChitra Living Heritage Museum & Besant Nagar Beach',
      morning: 'Guided walk through DakshinaChitra Heritage Village showcasing South Indian homes.',
      afternoon: 'Visit Cholamandal Artists’ Village & Marundeeswarar Temple.',
      evening: 'Sunset walk at Edward Elliot’s Beach (Besant Nagar Beach) & seafood dinner.',
      baseCostINR: 3800,
      highlight: 'DakshinaChitra & Besant Nagar Beach'
    }
  ],

  // 1. Bengaluru / Bangalore
  bengaluru: [
    {
      summary: 'Bangalore Palace, Tipu Sultan Palace & Lalbagh Glass House',
      morning: 'Tour Tudor-style Bangalore Royal Palace & Tipu Sultan’s Wooden Summer Palace.',
      afternoon: 'Stroll 240-acre Lalbagh Botanical Gardens & historic 1889 Glass House.',
      evening: 'Traditional South Indian Filter Coffee & Masala Dosa at MTR (Mavalli Tiffin Room).',
      baseCostINR: 3500,
      highlight: 'Bangalore Palace & Lalbagh Glass House'
    },
    {
      summary: 'Cubbon Park, Visvesvaraya Museum & Vidhana Soudha',
      morning: 'Walk green canopy paths of Cubbon Park & photograph Vidhana Soudha Neo-Dravidian Citadel.',
      afternoon: 'Interactive science exhibits at Visvesvaraya Industrial & Technological Museum.',
      evening: 'Shop along Commercial Street & MG Road, followed by craft beer at Indiranagar microbrewery.',
      baseCostINR: 3800,
      highlight: 'Cubbon Park & Vidhana Soudha'
    },
    {
      summary: 'ISKCON Temple, Bull Temple & Basavanagudi Heritage Walk',
      morning: 'Visit magnificent hilltop ISKCON Temple Bangalore & Sri Big Bull Temple.',
      afternoon: 'Explore Gandhi Bazaar spice shops & heritage South Indian lunch at Vidyarthi Bhavan.',
      evening: 'Sunset view from Sankey Tank lake promenade.',
      baseCostINR: 3200,
      highlight: 'ISKCON Temple & Vidyarthi Bhavan'
    }
  ],

  // 2. Kolkata
  kolkata: [
    {
      summary: 'Victoria Memorial, St. Paul’s Cathedral & Howrah Bridge Sunset',
      morning: 'Explore white marble Victoria Memorial Hall & surrounding lush gardens.',
      afternoon: 'Visit Indo-Gothic St. Paul’s Cathedral & Kolkata Academy of Fine Arts.',
      evening: 'Sunset boat cruise on Hooghly River under iconic Howrah Bridge (Rabindra Setu).',
      baseCostINR: 3200,
      highlight: 'Victoria Memorial & Howrah Bridge'
    },
    {
      summary: 'Dakshineswar Kali Temple & Belur Math World Headquarters',
      morning: 'Visit sacred Dakshineswar Kali Temple on Hooghly River banks.',
      afternoon: 'Ferry across river to Belur Math (Ramakrishna Mission World Headquarters).',
      evening: 'Authentic Bengali Fish Curry & Rasgulla dinner at 6 Ballygunge Place.',
      baseCostINR: 3500,
      highlight: 'Dakshineswar Temple & Belur Math'
    },
    {
      summary: 'Indian Museum, Park Street & Kumartuli Idol Village',
      morning: 'Tour Indian Museum (Asia’s oldest museum) & Asiatic Society.',
      afternoon: 'Walk Kumartuli clay idol-makers alleyways & historic College Street book stalls.',
      evening: 'Heritage Kolkata Tram Ride & legendary Kathi Rolls at Nizam’s in New Market.',
      baseCostINR: 3000,
      highlight: 'Indian Museum & Kumartuli Village'
    }
  ],

  // 3. Ahmedabad
  ahmedabad: [
    {
      summary: 'Sabarmati Ashram, Riverfront Walk & Atal Bridge',
      morning: 'Visit Sabarmati Ashram (Mahatma Gandhi’s Hriday Kunj residence & museum).',
      afternoon: 'Walk Sabarmati Riverfront Promenade & photograph flower-shaped Atal Pedestrian Bridge.',
      evening: 'Authentic Gujarati Thali dinner at Agashiye rooftop restaurant.',
      baseCostINR: 3200,
      highlight: 'Sabarmati Ashram & Atal Bridge'
    },
    {
      summary: 'Adalaj Stepwell, Hutheesing Jain Temple & UNESCO Heritage Walk',
      morning: 'Explore 5-story 1498 AD Adalaj Stepwell (Rudraabai Stepwell) intricate carvings.',
      afternoon: 'Tour white marble Hutheesing Jain Temple & 15th-century UNESCO Jama Masjid.',
      evening: 'Night food tasting walk at famous Manek Chowk food street.',
      baseCostINR: 3500,
      highlight: 'Adalaj Stepwell & Manek Chowk'
    }
  ],

  // 4. Chandigarh & Amritsar
  amritsar: [
    {
      summary: 'Golden Temple (Harmandir Sahib) & Wagah Border Parade',
      morning: 'Visit revered Golden Temple (Harmandir Sahib) & Amrit Sarovar holy tank.',
      afternoon: 'Walk Jallianwala Bagh memorial park & 1947 Partition Museum.',
      evening: 'Witness India-Pakistan Wagah Border Beating Retreat ceremony & Amritsari Kulcha with Lassi.',
      baseCostINR: 3400,
      highlight: 'Golden Temple & Wagah Border'
    }
  ],

  // 5. Varanasi
  varanasi: [
    {
      summary: 'Ganges Boat Sunrise Cruise, Kashi Vishwanath & Evening Aarti',
      morning: 'Sunrise boat cruise along sacred Ganges River Ghats viewing morning rituals.',
      afternoon: 'Visit Kashi Vishwanath Temple Corridor & Annapurna Temple.',
      evening: 'Grand Evening Ganga Aarti Ceremony at Dashashwamedh Ghat.',
      baseCostINR: 2800,
      highlight: 'Ganges Sunrise Cruise & Ganga Aarti'
    },
    {
      summary: 'Sarnath UNESCO Buddha Park & Banaras Silk Bazaars',
      morning: 'Excursion to Sarnath where Lord Buddha gave his first sermon & Dhamek Stupa.',
      afternoon: 'Tour Sarnath Archeological Museum & Lion Capital of Ashoka.',
      evening: 'Shop for authentic Banarasi Silk Sarees & taste famous Banarasi Paan.',
      baseCostINR: 3200,
      highlight: 'Sarnath Buddha Park & Banarasi Silk'
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
  if (dest.includes('chennai') || dest.includes('madras')) key = 'chennai';
  else if (dest.includes('bengaluru') || dest.includes('bangalore')) key = 'bengaluru';
  else if (dest.includes('kolkata') || dest.includes('calcutta')) key = 'kolkata';
  else if (dest.includes('ahmedabad')) key = 'ahmedabad';
  else if (dest.includes('amritsar')) key = 'amritsar';
  else if (dest.includes('varanasi') || dest.includes('kashi') || dest.includes('banaras')) key = 'varanasi';
  else if (dest.includes('araku')) key = 'araku';
  else if (dest.includes('vizag') || dest.includes('visakhapatnam')) key = 'vizag';
  else if (dest.includes('tirupati')) key = 'tirupati';
  else if (dest.includes('vijayawada')) key = 'vijayawada';
  else if (dest.includes('coorg')) key = 'coorg';
  else if (dest.includes('wayanad')) key = 'wayanad';
  else if (dest.includes('ooty')) key = 'ooty';
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
