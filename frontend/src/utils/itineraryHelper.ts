export interface DayItinerary {
  day: string;
  morning: string;
  afternoon: string;
  evening: string;
  cost: string;
  highlight?: string;
}

const DESTINATION_TEMPLATES: Record<string, { summary: string; morning: string; afternoon: string; evening: string; cost: string; highlight: string }[]> = {
  hyderabad: [
    {
      summary: 'Charminar, Laad Bazaar Pearls & Chowmahalla Palace',
      morning: 'Visit iconic 16th-century Charminar monument; climb up for panoramic views of Old City.',
      afternoon: 'Shop for famous Hyderabadi lac bangles & freshwater pearls at Laad Bazaar, then tour royal Chowmahalla Palace.',
      evening: 'Authentic Hyderabadi Dum Biryani & Double ka Meetha dinner at Paradise or Shadab Restaurant.',
      cost: '₹2,800',
      highlight: 'Charminar & Royal Chowmahalla Palace'
    },
    {
      summary: 'Golconda Fort Sound & Light Show & Qutb Shahi Tombs',
      morning: 'Explore massive 13th-century Golconda Fort acoustic architecture & Fateh Rahben canon.',
      afternoon: 'Guided walk through majestic Qutb Shahi Tombs complex featuring Persian & Deccan arches.',
      evening: 'Sunset boat cruise at Hussain Sagar Lake to standing Buddha Statue & Lumbini Park laser show.',
      cost: '₹3,200',
      highlight: 'Golconda Fort & Hussain Sagar Cruise'
    },
    {
      summary: 'Ramoji Film City Full-Day Studio Experience',
      morning: 'Travel to Ramoji Film City (World’s Largest Film Studio Complex); enjoy Filmi Duniya dark ride.',
      afternoon: 'Watch live stunt performance shows, Bahubali movie set tour & Action Studio.',
      evening: 'Walk through Eureka Carnival, butterfly park & thematic dinner at Jimmy’s Drive-In.',
      cost: '₹4,500',
      highlight: 'Ramoji Film City & Bahubali Sets'
    },
    {
      summary: 'Taj Falaknuma Palace & Salar Jung Museum Treasures',
      morning: 'Guided art tour of Salar Jung Museum viewing Veiled Rebecca marble statue & Musical Clock.',
      afternoon: 'Royal High Tea experience at Taj Falaknuma Palace overlooking Hyderabad skyline.',
      evening: 'Stroll around KBR National Park, Jubilee Hills & dinner at Olive Bistro overlooking Durgam Cheruvu.',
      cost: '₹5,800',
      highlight: 'Taj Falaknuma High Tea & Salar Jung'
    },
    {
      summary: 'HITEC City, Durgam Cheruvu Cable Bridge & Shilparamam',
      morning: 'Explore Shilparamam Arts & Crafts Village for traditional Indian handlooms & pottery.',
      afternoon: 'Walk across iconic Durgam Cheruvu Cable Stayed Bridge & enjoy waterfront park kayaking.',
      evening: 'Rooftop cocktail session at Skypoint ITC Kohenur overlooking Cyberabad skyline.',
      cost: '₹3,600',
      highlight: 'Durgam Cheruvu Cable Bridge & Shilparamam'
    },
    {
      summary: 'Nehru Zoological Park & Sudha Cars Unique Museum',
      morning: 'Open safari drive through Nehru Zoological Park & Lion Safari enclosure.',
      afternoon: 'Visit eccentric Sudha Cars Museum showcasing handmade wacky drivable cars.',
      evening: 'Sunset prayers at white marble Birla Mandir perched on Naubat Pahad hill.',
      cost: '₹2,600',
      highlight: 'Birla Mandir & Sudha Cars Museum'
    },
    {
      summary: 'Charminar Night Food Street & Irani Chai Tour',
      morning: 'Relaxed breakfast of Idli & Dosa at Ram Ki Bandi late night / early morning food cart.',
      afternoon: 'Souvenir shopping at Mozamjahi Market for Karachi Bakery fruit biscuits & dry fruits.',
      evening: 'Irani Chai & Osmania Biscuits at Nimrah Cafe overlooking illuminated Charminar.',
      cost: '₹2,200',
      highlight: 'Nimrah Irani Chai & Charminar Night View'
    }
  ],
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
  mumbai: [
    {
      summary: 'Gateway of India, Colaba Causeway & Marine Drive',
      morning: 'Visit iconic Gateway of India and marvel at Taj Mahal Palace Hotel architecture.',
      afternoon: 'Street shopping at Colaba Causeway for vintage antiques & fashion apparel.',
      evening: 'Sunset stroll along Marine Drive (Queen’s Necklace) and dinner at Bademiya Kebabs.',
      cost: '₹3,400',
      highlight: 'Gateway of India & Marine Drive Sunset'
    },
    {
      summary: 'Elephanta Caves Island Boat Trip & Heritage Architecture',
      morning: 'Ferry ride across Mumbai Harbour to UNESCO Elephanta Caves rock-cut Shiva temples.',
      afternoon: 'Guided walk through Victoria Terminus (CSMT railway station) & Crawford Market.',
      evening: 'Cocktails at rooftop bar overlooking Arabian Sea in Nariman Point.',
      cost: '₹3,800',
      highlight: 'Elephanta Caves & CSMT Heritage'
    },
    {
      summary: 'Bandra-Worli Sea Link, Juhu Beach & Bollywood Star Houses',
      morning: 'Drive across Bandra-Worli Sea Link; visit Bandra Fort cliff lookout.',
      afternoon: 'Spot celebrity bungalows (Mannat & Jalsa) & shop at Linking Road Bandra.',
      evening: 'Sunset bhel puri & pav bhaji at Juhu Beach followed by Soho House lounge.',
      cost: '₹4,200',
      highlight: 'Bandra Sea Link & Juhu Beach'
    },
    {
      summary: 'Siddhivinayak Temple & High Street Phoenix Shopping',
      morning: 'Morning darshan at Shree Siddhivinayak Temple in Prabhadevi.',
      afternoon: 'Luxury shopping & dining at Palladium High Street Phoenix Mall Lower Parel.',
      evening: 'Dinner at Bastian or Olive Bar & Kitchen in Bandra.',
      cost: '₹4,500',
      highlight: 'Siddhivinayak Temple & Lower Parel'
    },
    {
      summary: 'Sanjay Gandhi National Park & Kanheri Caves Trek',
      morning: 'Morning tiger safari & cycling at Sanjay Gandhi National Park in Borivali.',
      afternoon: 'Hike up to 2,000-year-old Buddhist Kanheri Caves carved into basalt rock.',
      evening: 'Relaxing dinner at Carter Road Promenade oceanwalk in Bandra.',
      cost: '₹3,200',
      highlight: 'Kanheri Caves & National Park'
    }
  ],
  delhi: [
    {
      summary: 'Old Delhi Heritage, Red Fort & Chandni Chowk Food Walk',
      morning: 'Explore Mughal Red Fort (Lal Qila) & Jama Masjid mosque.',
      afternoon: 'Cycle rickshaw ride through Chandni Chowk & paranthas at Paranthe Wali Gali.',
      evening: 'Illuminated view of India Gate memorial & Rajpath boulevard walk.',
      cost: '₹2,900',
      highlight: 'Red Fort & Chandni Chowk Food Tour'
    },
    {
      summary: 'Qutub Minar, Humayun’s Tomb & Lotus Temple',
      morning: 'Visit 73-meter Qutub Minar UNESCO victory tower & Iron Pillar.',
      afternoon: 'Tour red sandstone Humayun’s Tomb (inspiration for Taj Mahal).',
      evening: 'Sunset meditation at Lotus Temple & dinner at Khan Market.',
      cost: '₹3,500',
      highlight: 'Qutub Minar & Humayun’s Tomb'
    },
    {
      summary: 'Akshardham Temple Exhibition & Dilli Haat Shopping',
      morning: 'Explore Swaminarayan Akshardham Temple complex & boat ride exhibition.',
      afternoon: 'Shop for handicrafts & authentic regional Indian thalis at Dilli Haat INA.',
      evening: 'Musical Fountain Show at Akshardham & evening walk at Hauz Khas Village.',
      cost: '₹3,800',
      highlight: 'Akshardham Musical Fountain & Dilli Haat'
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
    }
  ]
};

export function getDetailedDestinationItinerary(destinationName?: string, durationDays: number = 3): DayItinerary[] {
  const dest = (destinationName || '').toLowerCase().trim();
  const rawName = destinationName ? destinationName.split(',')[0].trim() : 'City';
  const daysNeeded = Math.max(1, durationDays || 3);

  let key = '';
  if (dest.includes('hyderabad')) key = 'hyderabad';
  else if (dest.includes('goa')) key = 'goa';
  else if (dest.includes('mumbai') || dest.includes('bombay')) key = 'mumbai';
  else if (dest.includes('delhi')) key = 'delhi';
  else if (dest.includes('meghalaya') || dest.includes('shillong') || dest.includes('cherrapunji')) key = 'meghalaya';

  let templates = key ? DESTINATION_TEMPLATES[key] : null;

  // Smart Dynamic City Itinerary Generator for ANY location (Jaipur, Bangalore, Paris, Tokyo, etc.)
  if (!templates || templates.length === 0) {
    templates = [
      {
        summary: `Explore Historic Old Town & Central Landmarks of ${rawName}`,
        morning: `Check into hotel in ${rawName}; morning walking tour of central heritage square & historic monuments.`,
        afternoon: `Visit premier city art museum, cultural heritage centers & scenic city garden.`,
        evening: `Sunset viewpoint overlooking ${rawName} city skyline followed by authentic regional dinner.`,
        cost: '₹3,500',
        highlight: `Old Town & Skyline View of ${rawName}`
      },
      {
        summary: `Cultural Exploration, Local Bazaars & Iconic Cuisine in ${rawName}`,
        morning: `Guided morning tour of ${rawName}’s iconic architectural landmarks and sacred temples/cathedrals.`,
        afternoon: `Shop for artisanal handicrafts, spices & souvenirs at famous local street bazaar.`,
        evening: `Food tasting walk trying top signature culinary delicacies of ${rawName}.`,
        cost: '₹3,200',
        highlight: `${rawName} Bazaar & Food Walk`
      },
      {
        summary: `Scenic Nature Excursion & Sunset Waterfront in ${rawName}`,
        morning: `Morning trip to nearby hillside lookout, lake, or natural landscape surrounding ${rawName}.`,
        afternoon: `Relaxing boat ride or nature trail hike with organic farm-to-table lunch.`,
        evening: `Atmospheric sunset lounge dinner with live traditional musical performance.`,
        cost: '₹4,100',
        highlight: `Nature Excursion & Sunset in ${rawName}`
      },
      {
        summary: `Arts, Botanical Gardens & Modern Entertainment in ${rawName}`,
        morning: `Stroll through ${rawName}’s lush botanical gardens and royal palace gardens.`,
        afternoon: `Visit contemporary art galleries, science centers & shopping promenade.`,
        evening: `Evening theater / cultural show and rooftop cocktail dinner.`,
        cost: '₹3,800',
        highlight: `Botanical Gardens & Culture in ${rawName}`
      },
      {
        summary: `Hidden Gems & Local Heritage Workshop in ${rawName}`,
        morning: `Discover off-the-beaten-path hidden alleys, ancient wells & artisan craft workshops.`,
        afternoon: `Interactive cooking masterclass or pottery studio session in ${rawName}.`,
        evening: `Candlelit dinner at historic heritage mansion with traditional hospitality.`,
        cost: '₹4,400',
        highlight: `Heritage Workshops & Hidden Gems`
      }
    ];
  }

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
