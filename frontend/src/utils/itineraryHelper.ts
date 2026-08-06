export interface DayItinerary {
  day: string;
  morning: string;
  afternoon: string;
  evening: string;
  cost: string;
  highlight?: string;
}

export function getDetailedDestinationItinerary(destinationName?: string): DayItinerary[] {
  const dest = (destinationName || '').toLowerCase().trim();

  if (dest.includes('meghalaya') || dest.includes('shillong') || dest.includes('cherrapunji')) {
    return [
      {
        day: 'Day 1: Shillong Arrival, Umiam Lake & Elephant Falls',
        morning: 'Arrive at Shillong (Scotland of the East), check into hotel, and visit Umiam Lake (Barapani) for watersports & pine mountain views.',
        afternoon: 'Explore Elephant Falls (three-tiered cascading waterfalls) & Shillong Peak for a panoramic 360° view of Shillong city valley.',
        evening: 'Stroll through Police Bazaar & Laitumkhrah Market for authentic Khasi bamboo handicrafts & steamed momos.',
        cost: '₹3,200',
        highlight: 'Umiam Lake & Elephant Falls'
      },
      {
        day: 'Day 2: Cherrapunji (Sohra) & Nohkalikai Waterfalls',
        morning: 'Scenic mountain drive to Cherrapunji; visit Nohkalikai Falls (highest plunge waterfall in India) & Seven Sisters Falls.',
        afternoon: 'Explore Mawsmai Cave & Arwah Cave limestone formations featuring prehistoric marine fossils and narrow rock tunnels.',
        evening: 'Cozy campfire dinner at Cherrapunji Cliffside Resort with local Meghalayan Jadoh & bamboo shoot stew.',
        cost: '₹4,500',
        highlight: 'Nohkalikai Falls & Mawsmai Cave'
      },
      {
        day: 'Day 3: Dawki Crystal River & Mawlynnong (Asia’s Cleanest Village)',
        morning: 'Excursion to Dawki Umngot River for boat ride on glass-clear emerald water where boats appear to float in air.',
        afternoon: 'Visit Mawlynnong Village (Asia’s Cleanest Village) and hike across the famous Single Living Root Bridge in Riwai.',
        evening: 'Return to Shillong, farewell dinner at Dylan’s Café with live acoustic music and roasted local coffee.',
        cost: '₹4,800',
        highlight: 'Dawki Glass River & Living Root Bridge'
      }
    ];
  }

  if (dest.includes('mumbai') || dest.includes('bombay')) {
    return [
      {
        day: 'Day 1: Colaba Heritage & Marine Drive Sunset',
        morning: 'Visit Gateway of India, Taj Mahal Palace Hotel heritage walk, and explore Colaba Causeway artisan market.',
        afternoon: 'Tour Chhatrapati Shivaji Maharaj Terminus (CSMT UNESCO site) and sample authentic Parsi Berry Pulao at Britannia & Co.',
        evening: 'Sunset promenade stroll along Marine Drive (Queen’s Necklace) followed by rooftop cocktails at Dome InterContinental.',
        cost: '₹3,800',
        highlight: 'Gateway of India & Marine Drive'
      },
      {
        day: 'Day 2: Elephanta Caves & Bandra Lifestyle Tour',
        morning: 'Speedboat cruise from Gateway of India to Elephanta Caves to explore 5th-century rock-cut Shiva cave temples.',
        afternoon: 'Drive across Bandra-Worli Sea Link to Bandra West; explore Mount Mary Church, Bandstand & Castella de Aguada.',
        evening: 'Dinner at Bastian Seafood & Grill in Bandra followed by craft beer tasting at Gateway Taproom.',
        cost: '₹4,600',
        highlight: 'Elephanta Caves & Bandra Sea Link'
      },
      {
        day: 'Day 3: Art District, Museums & Juhu Beach Feast',
        morning: 'Guided art gallery walk through Kala Ghoda Art District & Jehangir Art Gallery.',
        afternoon: 'Visit Prince of Wales Museum (CSMVS) & Mani Bhavan Gandhi Memorial in Gamdevi.',
        evening: 'Juhu Beach sunset walk, sampling Pav Bhaji & Bhelpuri street food at Juhu Beach stalls.',
        cost: '₹3,500',
        highlight: 'Kala Ghoda Art & Juhu Beach'
      }
    ];
  }

  if (dest.includes('goa')) {
    return [
      {
        day: 'Day 1: North Goa Beaches & Fort Aguada',
        morning: 'Check in to beachside resort in Baga/Calangute; morning relaxation & coconut water by the shore.',
        afternoon: 'Visit 17th-century Fort Aguada lighthouse viewpoint and Chapora Fort (famous Dil Chahta Hai cliff).',
        evening: 'Sunset beach lounge session at Thalassa Vagator followed by seafood dinner at Tito’s Lane.',
        cost: '₹4,200',
        highlight: 'Fort Aguada & Vagator Sunset'
      },
      {
        day: 'Day 2: Old Goa UNESCO Cathedrals & Panaji Latin Quarter',
        morning: 'Tour Basilica of Bom Jesus (storing mortal remains of St. Francis Xavier) & Se Cathedral in Old Goa.',
        afternoon: 'Explore Fontainhas Latin Quarter colorful Portuguese heritage streets & heritage art galleries.',
        evening: 'Sunset cruise along Mandovi River with traditional Goan folk dance & music performances.',
        cost: '₹3,600',
        highlight: 'Basilica of Bom Jesus & Fontainhas'
      },
      {
        day: 'Day 3: Dudhsagar Waterfall Safari & South Goa Beaches',
        morning: 'Early morning 4x4 Jeep Safari through Bhagwan Mahavir Wildlife Sanctuary to Dudhsagar Waterfalls.',
        afternoon: 'Organic lunch at Sahakari Spice Plantation followed by elephant interaction & spice garden tour.',
        evening: 'Relaxing sunset at Palolem Beach crescent bay & dinner at Cape Goa cliffside restaurant.',
        cost: '₹5,200',
        highlight: 'Dudhsagar Waterfall Safari'
      }
    ];
  }

  if (dest.includes('kerala') || dest.includes('munnar') || dest.includes('alleppey')) {
    return [
      {
        day: 'Day 1: Munnar Tea Plantations & Eravikulam National Park',
        morning: 'Arrive in Munnar; scenic drive through rolling green tea estates & visit Kannan Devan Tea Museum.',
        afternoon: 'Safari in Eravikulam National Park to spot endangered Nilgiri Tahr mountain goats and Anamudi Peak.',
        evening: 'Cozy evening at tea valley resort with hot spice tea & traditional Keralite Sadhya dinner.',
        cost: '₹3,500',
        highlight: 'Munnar Tea Estates & Anamudi'
      },
      {
        day: 'Day 2: Alleppey Backwaters Luxury Houseboat Cruise',
        morning: 'Drive down to Alleppey (Alappuzha); check into traditional wooden Kettuvallam Houseboat.',
        afternoon: 'Cruise through palm-fringed narrow canals, paddy fields, and peaceful backwater villages.',
        evening: 'Freshly prepared Karimeen Pollichathu (pearl spot fish in banana leaf) dinner on board under starlight.',
        cost: '₹6,500',
        highlight: 'Alleppey Backwater Houseboat'
      },
      {
        day: 'Day 3: Varkala Cliff Beach & Ayurvedic Wellness Spa',
        morning: 'Travel to Varkala; morning walk along red laterite cliff overlook facing the Arabian Sea.',
        afternoon: 'Rejuvenating 90-minute Abhyanga Ayurvedic herbal massage at beachfront wellness center.',
        evening: 'Sunset dinner at Darjeeling Café on Varkala Cliff featuring fresh seafood & acoustic guitar tunes.',
        cost: '₹4,200',
        highlight: 'Varkala Cliff & Ayurvedic Spa'
      }
    ];
  }

  if (dest.includes('jaipur') || dest.includes('rajasthan')) {
    return [
      {
        day: 'Day 1: Amber Fort & Water Palace Ascent',
        morning: 'Jeep ascent to majestic Amber Fort; explore Sheesh Mahal (Mirror Palace) & Maota Lake reflections.',
        afternoon: 'Photo stop at Jal Mahal (Water Palace) in Man Sagar Lake & visit Gaitore Cenotaphs.',
        evening: 'Traditional Rajasthani Thali dinner at 1135 AD inside Amber Fort with royal sitar music.',
        cost: '₹4,500',
        highlight: 'Amber Fort & Jal Mahal'
      },
      {
        day: 'Day 2: Hawa Mahal, City Palace & Johari Bazaar',
        morning: 'Early morning photos at iconic Hawa Mahal (Palace of Winds); tour City Palace Museum & Armoury.',
        afternoon: 'Explore Jantar Mantar UNESCO astronomical observatory & shop for Bandhani sarees in Johari Bazaar.',
        evening: 'Sunset view from Nahargarh Fort Padao Cafe overlooking entire pink city of Jaipur.',
        cost: '₹3,800',
        highlight: 'Hawa Mahal & City Palace'
      },
      {
        day: 'Day 3: Royal Stepwells & Chokhi Dhani Heritage Village',
        morning: 'Visit Panna Meena ka Kund geometric stepwell & Albert Hall Museum in Ram Niwas Garden.',
        afternoon: 'Lunch at Lassiwala on MI Road (famous kulhad lassi) & souvenir shopping at Bapu Bazaar.',
        evening: 'Excursion to Chokhi Dhani Ethnic Resort for Ghoomar dance, camel rides & grand Rajasthani feast.',
        cost: '₹4,200',
        highlight: 'Chokhi Dhani Cultural Feast'
      }
    ];
  }

  if (dest.includes('ladakh') || dest.includes('leh') || dest.includes('kashmir')) {
    return [
      {
        day: 'Day 1: Leh Acclimatization, Shanti Stupa & Leh Palace',
        morning: 'Arrive at Kushok Bakula Rimpochee Airport in Leh; rest for acclimatization with butter tea.',
        afternoon: 'Sunset visit to Shanti Stupa for panoramic views of Leh town & Stok Kangri mountain range.',
        evening: 'Explore historic Leh Main Bazaar & sample authentic Tibetan Thukpa at Chopsticks Noodle Bar.',
        cost: '₹3,200',
        highlight: 'Shanti Stupa & Leh Palace'
      },
      {
        day: 'Day 2: Khardung La Pass & Hunder Sand Dunes (Nubra)',
        morning: 'Drive over Khardung La Pass (17,582 ft - one of highest motorable roads in world) to Nubra Valley.',
        afternoon: 'Visit Diskit Monastery (106ft Buddha statue) & ride double-humped Bactrian camels at Hunder Sand Dunes.',
        evening: 'Overnight stay in luxury alpine eco-tents in Hunder under starlit clear Himalayan skies.',
        cost: '₹5,800',
        highlight: 'Khardung La & Bactrian Camels'
      },
      {
        day: 'Day 3: Pangong Tso Crystal High-Altitude Lake',
        morning: 'Drive to Pangong Tso Lake (14,270 ft) via Chang La Pass; marvel at turquoise shifting color waters.',
        afternoon: 'Photography session at 3 Idiots point along Pangong shoreline & hot Tibetan soup lunch.',
        evening: 'Return to Leh via Hemis Monastery; farewell dinner at Bon Appetit restaurant.',
        cost: '₹6,200',
        highlight: 'Pangong Tso Crystal Lake'
      }
    ];
  }

  if (dest.includes('bali')) {
    return [
      {
        day: 'Day 1: Seminyak Beach Sunset & Dining',
        morning: 'Arrive at Ngurah Rai Airport, DPS Bali; private transfer to Seminyak villa & beachside lunch.',
        afternoon: 'Relax at Seminyak Beach & shop at chic boutiques on Jalan Kayu Aya.',
        evening: 'Sunset drinks at La Plancha colorful beanbag beach & dinner at Motel Mexicola.',
        cost: '₹4,500',
        highlight: 'Seminyak Beach & Motel Mexicola'
      },
      {
        day: 'Day 2: Ubud Rice Terraces & Sacred Monkey Forest',
        morning: 'Visit Tegallalang Rice Terraces for famous Bali Jungle Swing & rice paddy walk.',
        afternoon: 'Explore Sacred Monkey Forest Sanctuary & Tirta Empul Holy Water Purification Temple in Tampaksiring.',
        evening: 'Crispy duck dinner at Bebek Tepi Sawah overlooking tranquil Ubud rice fields.',
        cost: '₹5,200',
        highlight: 'Tegallalang Swing & Tirta Empul'
      },
      {
        day: 'Day 3: Nusa Penida Island Speedboat Day Excursion',
        morning: 'Speedboat from Sanur harbor to Nusa Penida Island; visit world-famous Kelingking T-Rex Beach cliff.',
        afternoon: 'Explore Broken Beach, Angel’s Billabong natural infinity pool & swim at Crystal Bay.',
        evening: 'Return to mainland Bali; Uluwatu Cliff Temple Sunset Kecak Fire Dance & Jimbaran Seafood Dinner.',
        cost: '₹6,800',
        highlight: 'Nusa Penida Kelingking & Uluwatu'
      }
    ];
  }

  if (dest.includes('paris') || dest.includes('france')) {
    return [
      {
        day: 'Day 1: Eiffel Tower Ascent & Seine River Cruise',
        morning: 'Arrive in Paris; elevator ascent to Eiffel Tower 2nd Floor / Summit for iconic 360° city view.',
        afternoon: 'Stroll Champ de Mars lawns & enjoy fresh croissants & café au lait at a Latin Quarter bistro.',
        evening: 'Bateaux-Mouches Seine River Sunset Dinner Cruise passing illuminated Notre-Dame & Louvre.',
        cost: '₹8,500',
        highlight: 'Eiffel Tower & Seine Cruise'
      },
      {
        day: 'Day 2: Louvre Art Museum & Champs-Élysées Promenade',
        morning: 'Guided Louvre Museum tour to admire Mona Lisa, Venus de Milo & Winged Victory of Samothrace.',
        afternoon: 'Walk Tuileries Garden, Place de la Concorde & window shop along Champs-Élysées to Arc de Triomphe.',
        evening: 'Ascend Arc de Triomphe rooftop for twinkling city lights; French dinner at Le Relais de l’Entrecôte.',
        cost: '₹7,200',
        highlight: 'Louvre Museum & Arc de Triomphe'
      },
      {
        day: 'Day 3: Montmartre Artists Village & Palace of Versailles',
        morning: 'Morning train excursion to Palace of Versailles; explore Hall of Mirrors & Royal Gardens.',
        afternoon: 'Return to Paris; explore Montmartre Artists Quarter, Place du Tertre & Sacré-Cœur Basilica.',
        evening: 'Cabaret show at Moulin Rouge or champagne tasting in Saint-Germain-des-Prés.',
        cost: '₹9,800',
        highlight: 'Palace of Versailles & Montmartre'
      }
    ];
  }

  // Dynamic Generic Detailed Itinerary for any other city
  const city = destinationName ? destinationName : 'City Center';
  return [
    {
      day: `Day 1: ${city} Arrival & Heritage Exploration`,
      morning: `Arrival in ${city}; check into hotel, refresh, and enjoy morning breakfast at a historic city café.`,
      afternoon: `Guided tour of top historical landmarks, central museum, and famous waterfront promenade in ${city}.`,
      evening: `Sunset viewpoint photography session followed by authentic regional dinner at a top-rated local bistro.`,
      cost: '₹3,800',
      highlight: `${city} Landmark Tour`
    },
    {
      day: `Day 2: ${city} Culture, Markets & Food Tasting`,
      morning: `Morning walking tour through the oldest quarter of ${city}, visiting artisan workshops and local markets.`,
      afternoon: `Culinary street food tasting session featuring signature regional delicacies and sweet desserts.`,
      evening: `Relaxing sunset lounge session with live ambient music and artisanal drinks.`,
      cost: '₹4,500',
      highlight: `${city} Food & Culture`
    },
    {
      day: `Day 3: ${city} Nature Excursion & Souvenir Shopping`,
      morning: `Morning excursion to nearby scenic nature spots, botanical gardens, or cliffside viewpoints near ${city}.`,
      afternoon: `Leisurely lunch followed by shopping for authentic regional handicrafts and souvenirs.`,
      evening: `Farewell gourmet dinner celebration at a premier rooftop restaurant overlooking ${city}.`,
      cost: '₹5,200',
      highlight: `${city} Nature & Rooftop Dinner`
    }
  ];
}
