export interface DayItinerary {
  day: string;
  morning: string;
  afternoon: string;
  evening: string;
  cost: string;
  highlight?: string;
}

const DESTINATION_TEMPLATES: Record<string, { summary: string; morning: string; afternoon: string; evening: string; cost: string; highlight: string }[]> = {
  goa: [
    {
      summary: 'North Goa Beaches & Fort Aguada',
      morning: 'Check in to beachside resort in Baga/Calangute; morning relaxation & fresh coconut water by the shore.',
      afternoon: 'Visit 17th-century Fort Aguada lighthouse viewpoint and Chapora Fort (famous Dil Chahta Hai cliff).',
      evening: 'Sunset beach lounge session at Thalassa Vagator followed by seafood dinner at Tito’s Lane.',
      cost: '₹4,200',
      highlight: 'Fort Aguada & Vagator Sunset'
    },
    {
      summary: 'Old Goa UNESCO Cathedrals & Panaji Latin Quarter',
      morning: 'Tour Basilica of Bom Jesus (storing mortal remains of St. Francis Xavier) & Se Cathedral in Old Goa.',
      afternoon: 'Explore Fontainhas Latin Quarter colorful Portuguese heritage streets & heritage art galleries.',
      evening: 'Sunset cruise along Mandovi River with traditional Goan folk dance & music performances.',
      cost: '₹3,600',
      highlight: 'Basilica of Bom Jesus & Fontainhas'
    },
    {
      summary: 'Dudhsagar Waterfall Safari & South Goa Beaches',
      morning: 'Early morning 4x4 Jeep Safari through Bhagwan Mahavir Wildlife Sanctuary to Dudhsagar Waterfalls.',
      afternoon: 'Organic lunch at Sahakari Spice Plantation followed by elephant interaction & spice garden tour.',
      evening: 'Relaxing sunset at Palolem Beach crescent bay & dinner at Cape Goa cliffside restaurant.',
      cost: '₹5,200',
      highlight: 'Dudhsagar Waterfall Safari'
    },
    {
      summary: 'Anjuna Flea Market & Water Sports Adventure',
      morning: 'Parasailing, jet skiing & banana boat ride at Calangute Beach.',
      afternoon: 'Explore bohemian flea market at Anjuna Beach for handicrafts & silver jewelry.',
      evening: 'Beach bonfire, acoustic tunes & candlelit dinner at Curlies Beach Shack.',
      cost: '₹4,800',
      highlight: 'Anjuna Flea Market & Parasailing'
    },
    {
      summary: 'Island Hopping & Grand Island Snorkeling',
      morning: 'Speedboat excursion to Grand Island for scuba diving & underwater coral reef snorkeling.',
      afternoon: 'Fresh catch seafood BBQ on secluded private beach with coconut drinks.',
      evening: 'Reis Magos Fort sunset view overlooking Mandovi River estuary.',
      cost: '₹5,900',
      highlight: 'Grand Island Snorkeling'
    },
    {
      summary: 'Silent Noise Party & Agonda Tranquility',
      morning: 'Yoga session and relaxation at pristine Agonda Beach in South Goa.',
      afternoon: 'Kayaking in Sal River backwaters through mangrove forests.',
      evening: 'Unique Silent Headphone Party at Palolem Beach under star-filled skies.',
      cost: '₹4,100',
      highlight: 'Sal River Kayaking & Agonda'
    },
    {
      summary: 'Chorao Island Bird Sanctuary & Farewell Dinner',
      morning: 'Ferry ride to Dr. Salim Ali Bird Sanctuary on Chorao Island for birdwatching boat tour.',
      afternoon: 'Visit Divar Island heritage village for authentic Portuguese-Goan lunch.',
      evening: 'Farewell fine dining at Cavala Resort with live retro jazz band.',
      cost: '₹4,600',
      highlight: 'Salim Ali Bird Sanctuary'
    }
  ],
  meghalaya: [
    {
      summary: 'Shillong Arrival, Umiam Lake & Elephant Falls',
      morning: 'Arrive at Shillong, check into hotel, and visit Umiam Lake (Barapani) for watersports.',
      afternoon: 'Explore Elephant Falls & Shillong Peak for a 360° view of Shillong city valley.',
      evening: 'Stroll Police Bazaar for Khasi bamboo handicrafts & authentic momos.',
      cost: '₹3,200',
      highlight: 'Umiam Lake & Elephant Falls'
    },
    {
      summary: 'Cherrapunji & Nohkalikai Waterfalls',
      morning: 'Scenic mountain drive to Cherrapunji; visit Nohkalikai Falls & Seven Sisters Falls.',
      afternoon: 'Explore Mawsmai Cave & Arwah Cave limestone formations and fossils.',
      evening: 'Cozy campfire dinner at Cherrapunji Cliffside Resort with local Khasi Jadoh.',
      cost: '₹4,500',
      highlight: 'Nohkalikai Falls & Mawsmai Cave'
    },
    {
      summary: 'Dawki Crystal River & Mawlynnong Village',
      morning: 'Excursion to Dawki Umngot River for boat ride on glass-clear emerald water.',
      afternoon: 'Visit Mawlynnong Village (Asia’s Cleanest Village) and hike Single Living Root Bridge.',
      evening: 'Return to Shillong, evening coffee at Dylan’s Café with acoustic music.',
      cost: '₹4,800',
      highlight: 'Dawki Glass River & Root Bridge'
    },
    {
      summary: 'Double Decker Living Root Bridge Trek (Nongriat)',
      morning: 'Descend 3,000 steps through lush jungle trek from Tyrna village to Nongriat.',
      afternoon: 'Swim in natural turquoise river pools surrounding 250-year-old Double Decker Root Bridge.',
      evening: 'Homestay dinner in Nongriat village listening to forest streams.',
      cost: '₹3,900',
      highlight: 'Double Decker Root Bridge Trek'
    },
    {
      summary: 'Wei Sawdong Falls & Garden of Caves',
      morning: 'Hike to three-tiered emerald pools of Wei Sawdong Waterfalls.',
      afternoon: 'Explore Garden of Caves (Ka Bri Ki Synrang) natural waterfalls & mist caves.',
      evening: 'Sunset hot cocoa viewing over Sohra mountain plateau.',
      cost: '₹3,400',
      highlight: 'Wei Sawdong Emerald Pools'
    },
    {
      summary: 'Laitlum Canyons & Smith Village',
      morning: 'Excursion to Laitlum Canyons for breathtaking deep gorge mountain viewpoints.',
      afternoon: 'Hike down Rasong village trail along steep cliff staircase.',
      evening: 'Dinner at Heritage Club Shillong enjoying local pine roasted trout.',
      cost: '₹4,200',
      highlight: 'Laitlum Deep Canyons'
    },
    {
      summary: 'Jowai Krang Suri Waterfalls & Farewell',
      morning: 'Travel to West Jaintia Hills to plunge into Krang Suri turquoise waterfall pool.',
      afternoon: 'Visit Nartiang Monoliths (ancient stone memorials of Jaintia kings).',
      evening: 'Return to Shillong for farewell souvenirs & local pine honey shopping.',
      cost: '₹4,700',
      highlight: 'Krang Suri Turquoise Falls'
    }
  ]
};

export function getDetailedDestinationItinerary(destinationName?: string, durationDays: number = 3): DayItinerary[] {
  const dest = (destinationName || '').toLowerCase().trim();
  const daysNeeded = Math.max(1, durationDays || 3);

  let key = 'goa';
  if (dest.includes('meghalaya') || dest.includes('shillong') || dest.includes('cherrapunji')) {
    key = 'meghalaya';
  } else if (dest.includes('goa')) {
    key = 'goa';
  }

  const templates = DESTINATION_TEMPLATES[key] || DESTINATION_TEMPLATES['goa'];

  const days: DayItinerary[] = [];

  for (let i = 0; i < daysNeeded; i++) {
    const templateIndex = i % templates.length;
    const template = templates[templateIndex];
    const dayNumber = i + 1;

    days.push({
      day: `Day ${dayNumber}: ${template.summary}`,
      morning: template.morning,
      afternoon: template.afternoon,
      evening: template.evening,
      cost: template.cost,
      highlight: template.highlight
    });
  }

  return days;
}
