import React, { useState } from 'react';
import { Search, Sparkles, MapPin, Plus, ArrowRight, Compass, Filter } from 'lucide-react';
import { useTravelStore } from '../store/useTravelStore';
import { TripCard } from '../components/trips/TripCard';
import { TripModal } from '../components/trips/TripModal';
import { EmptyState } from '../components/ui/EmptyState';
import { getTripImage } from '../utils/imageHelper';

interface GlobalDestination {
  name: string;
  country: string;
  region: 'India' | 'Asia' | 'Europe' | 'Middle East' | 'Americas' | 'Islands';
  category: string;
  description: string;
  attractions: string[];
}

const FEATURED_DESTINATIONS: GlobalDestination[] = [
  // India
  { name: 'Kerala', country: 'India', region: 'India', category: 'Nature & Backwaters', description: 'God’s Own Country featuring tranquil Alleppey backwaters, tea gardens in Munnar, and Kovalam beaches.', attractions: ['Alleppey Houseboat Cruise', 'Munnar Tea Estates', 'Varkala Cliff Beach'] },
  { name: 'Goa', country: 'India', region: 'India', category: 'Beach & Nightlife', description: 'Sun-kissed coastal paradise renowned for golden beaches, Latin Quarter architecture, and seafood shacks.', attractions: ['Baga & Calangute Beach', 'Basilica of Bom Jesus', 'Fort Aguada Viewpoint'] },
  { name: 'Mumbai', country: 'India', region: 'India', category: 'Metropolis & Heritage', description: 'Financial capital of India famous for Gateway of India, Marine Drive, and vibrant Street Food culture.', attractions: ['Gateway of India', 'Marine Drive Promenade', 'Colaba Causeway Market'] },
  { name: 'Jaipur', country: 'India', region: 'India', category: 'Royal Heritage', description: 'The Pink City of Rajasthan famous for majestic Amber Fort, Hawa Mahal palace, and royal bazaars.', attractions: ['Amber Fort Palace', 'Hawa Mahal', 'City Palace Museum'] },
  { name: 'Hyderabad', country: 'India', region: 'India', category: 'Pearls & Biryani', description: 'City of Nizams famous for Charminar monument, Golconda Fort, and authentic Hyderabadi Dum Biryani.', attractions: ['Charminar & Laad Bazaar', 'Golconda Fort Sound Show', 'Ramoji Film City'] },
  { name: 'Delhi', country: 'India', region: 'India', category: 'Mughal Capital', description: 'National Capital Territory featuring UNESCO Red Fort, Qutub Minar, and Mughal bazaars.', attractions: ['Red Fort (Lal Qila)', 'Qutub Minar Complex', 'Humayun\'s Tomb'] },
  { name: 'Ladakh', country: 'India', region: 'India', category: 'High-Altitude Adventure', description: 'Breathtaking Himalayan landscape featuring Pangong Tso crystal lake, Khardung La pass, and monasteries.', attractions: ['Pangong Lake', 'Nubra Valley Dunes', 'Thiksey Monastery'] },
  { name: 'Kashmir', country: 'India', region: 'India', category: 'Paradise Valley', description: 'Paradise on Earth with Dal Lake Shikara rides, Gulmarg snow slopes, and Pahalgam pine forests.', attractions: ['Dal Lake Houseboats', 'Gulmarg Gondola Lift', 'Betaab Valley'] },
  { name: 'Agra', country: 'India', region: 'India', category: 'Wonders of World', description: 'Home to the iconic white marble Taj Mahal monument of eternal love and Agra Fort.', attractions: ['Taj Mahal Wonder', 'Agra Fort Citadel', 'Mehtab Bagh Gardens'] },
  { name: 'Varanasi', country: 'India', region: 'India', category: 'Spiritual Capital', description: 'Sacred Ganges riverfront ghats, morning boat rituals, and evening Ganga Aarti ceremonies.', attractions: ['Dashashwamedh Ghat Aarti', 'Kashi Vishwanath Temple', 'Sarnath UNESCO Site'] },
  { name: 'Udaipur', country: 'India', region: 'India', category: 'City of Lakes', description: 'Venice of the East with romantic Lake Pichola cruises and majestic City Palace complex.', attractions: ['City Palace Udaipur', 'Lake Pichola Boat Cruise', 'Jag Mandir Island'] },
  { name: 'Shimla', country: 'India', region: 'India', category: 'Pine Hill Station', description: 'Colonial hill station featuring Mall Road promenade, Jakhoo Temple, and Kalka Toy Train.', attractions: ['Mall Road Promenade', 'Jakhoo Hill Temple', 'Kalka-Shimla Toy Train'] },
  { name: 'Manali', country: 'India', region: 'India', category: 'Snow Peaks & Adventure', description: 'High-altitude Himalayan valley featuring Solang Valley sports and Rohtang snow pass.', attractions: ['Solang Valley Zip Line', 'Atal Tunnel Excursion', 'Hadimba Temple'] },
  { name: 'Darjeeling', country: 'India', region: 'India', category: 'Himalayan Tea Estates', description: 'Queen of the Hills famous for Tiger Hill sunrise over Kanchenjunga and organic tea estates.', attractions: ['Tiger Hill Sunrise', 'Darjeeling Himalayan Railway', 'Happy Valley Tea Estate'] },
  { name: 'Rishikesh', country: 'India', region: 'India', category: 'Yoga & Rafting', description: 'Yoga capital of the world located on the holy Ganges with white-water rafting and Laxman Jhula.', attractions: ['White Water Rafting', 'Parmarth Niketan Aarti', 'Laxman Jhula Bridge'] },

  // Asia & Islands
  { name: 'Bali', country: 'Indonesia', region: 'Islands', category: 'Tropical Island', description: 'Island of Gods renowned for Ubud rice terraces, cliffside sea temples, and vibrant beach lounges.', attractions: ['Tegallalang Rice Terraces', 'Uluwatu Temple Sunset', 'Seminyak Beach Lounge'] },
  { name: 'Tokyo', country: 'Japan', region: 'Asia', category: 'Futuristic Capital', description: 'Dynamic metropolis blending neon-lit Shibuya crossing with tranquil Meiji Shrine and Mount Fuji views.', attractions: ['Shibuya Crossing Scramble', 'Senso-ji Ancient Temple', 'Mount Fuji Day Excursion'] },
  { name: 'Kyoto', country: 'Japan', region: 'Asia', category: 'Ancient Shrines & Geisha', description: 'Cultural heart of Japan famous for Fushimi Inari golden torii gates and Arashiyama Bamboo Grove.', attractions: ['Fushimi Inari Shrine', 'Arashiyama Bamboo Grove', 'Kinkaku-ji Golden Pavilion'] },
  { name: 'Singapore', country: 'Singapore', region: 'Asia', category: 'Garden City', description: 'Modern island city featuring futuristic Gardens by the Bay, Marina Bay Sands, and Sentosa beaches.', attractions: ['Gardens by the Bay Supertrees', 'Marina Bay Sands Skypark', 'Jewel Changi Waterfall'] },
  { name: 'Bangkok', country: 'Thailand', region: 'Asia', category: 'Floating Markets & Temples', description: 'Vibrant capital featuring gilded Grand Palace, Wat Arun temple of dawn, and night bazaars.', attractions: ['Grand Palace Complex', 'Wat Arun Temple of Dawn', 'Chatuchak Weekend Market'] },
  { name: 'Phuket', country: 'Thailand', region: 'Islands', category: 'Emerald Islands & Beaches', description: 'Thailand’s premier beach island with Patong nightlife, Phi Phi island cruises, and Big Buddha.', attractions: ['Phi Phi Islands Speedboat', 'Patong Beach Walking Street', 'Big Buddha Viewpoint'] },
  { name: 'Maldives', country: 'Maldives', region: 'Islands', category: 'Overwater Luxury', description: 'Pristine coral atolls with crystal turquoise lagoons, luxury overwater villas, and marine diving.', attractions: ['Overwater Bungalow Stay', 'Coral Reef Snorkeling', 'Sunset Dolphin Cruise'] },
  { name: 'Seoul', country: 'South Korea', region: 'Asia', category: 'K-Culture & Palaces', description: 'Dynamic capital blending Gyeongbokgung royal palace with Hongdae nightlife and N Seoul Tower.', attractions: ['Gyeongbokgung Palace', 'N Seoul Tower Skydeck', 'Bukchon Hanok Village'] },
  { name: 'Kuala Lumpur', country: 'Malaysia', region: 'Asia', category: 'Twin Towers & Caves', description: 'Modern skyline dominated by Petronas Twin Towers and ancient Batu Caves Hindu shrine.', attractions: ['Petronas Twin Towers', 'Batu Caves Rainbow Steps', 'Bukit Bintang Market'] },
  { name: 'Ha Long Bay', country: 'Vietnam', region: 'Asia', category: 'Emerald Karsts', description: 'UNESCO seascape featuring thousands of towering limestone islands and overnight junk cruises.', attractions: ['Emerald Lagoon Cruise', 'Sung Sot Limestone Cave', 'Ti Top Island Lookout'] },

  // Middle East
  { name: 'Dubai', country: 'UAE', region: 'Middle East', category: 'Luxury & Skyline', description: 'Desert oasis boasting Burj Khalifa skyscraper, Palm Jumeirah islands, and mega shopping malls.', attractions: ['Burj Khalifa Observation Deck', 'Dubai Mall Fountain Show', 'Desert Safari Dunes'] },
  { name: 'Abu Dhabi', country: 'UAE', region: 'Middle East', category: 'Grand Mosques & Culture', description: 'Capital city featuring Sheikh Zayed Grand Mosque, Louvre Abu Dhabi, and Ferrari World.', attractions: ['Sheikh Zayed Grand Mosque', 'Louvre Abu Dhabi', 'Yas Marina Circuit'] },
  { name: 'Doha', country: 'Qatar', region: 'Middle East', category: 'Modern Arabian Coast', description: 'Futuristic Gulf city featuring Souq Waqif historic bazaar and Museum of Islamic Art.', attractions: ['Souq Waqif Heritage Bazaar', 'Museum of Islamic Art', 'The Pearl Qatar Island'] },
  { name: 'Istanbul', country: 'Turkey', region: 'Middle East', category: 'East Meets West', description: 'Historic transcontinental city straddling Bosphorus strait with Hagia Sophia and Grand Bazaar.', attractions: ['Hagia Sophia Mosque', 'Blue Mosque Stupaa', 'Bosphorus Sunset Cruise'] },
  { name: 'Cairo', country: 'Egypt', region: 'Middle East', category: 'Pyramid Wonders', description: 'Ancient capital boasting Giza Pyramids, Great Sphinx, and Grand Egyptian Museum treasures.', attractions: ['Giza Great Pyramids', 'Great Sphinx Monument', 'Nile River Dinner Cruise'] },

  // Europe
  { name: 'Paris', country: 'France', region: 'Europe', category: 'Romance & Culture', description: 'City of Light famed for Eiffel Tower, Louvre art museum, and Seine riverfront cafes.', attractions: ['Eiffel Tower Summit', 'Louvre Museum Glass Pyramid', 'Notre-Dame Cathedral'] },
  { name: 'London', country: 'United Kingdom', region: 'Europe', category: 'Royal Capital', description: 'Global metropolis featuring Big Ben, Tower Bridge, British Museum, and West End theaters.', attractions: ['Big Ben & Parliament', 'London Eye Glass Flight', 'Tower Bridge Skywalk'] },
  { name: 'Rome', country: 'Italy', region: 'Europe', category: 'Ancient Empire', description: 'Eternal City with ancient Colosseum amphitheater, Vatican City Sistine Chapel, and Trevi Fountain.', attractions: ['Colosseum Ancient Arena', 'Vatican Sistine Chapel', 'Trevi Fountain Sunset'] },
  { name: 'Venice', country: 'Italy', region: 'Europe', category: 'Floating Canals', description: 'Romantic canal city famous for gondola rides, St. Mark’s Basilica, and Doge’s Palace.', attractions: ['Grand Canal Gondola Ride', 'St. Mark\'s Basilica Square', 'Rialto Bridge Viewpoint'] },
  { name: 'Barcelona', country: 'Spain', region: 'Europe', category: 'Gothic & Gaudi Art', description: 'Catalan coastal capital famous for Sagrada Familia church, Park Guell, and La Rambla.', attractions: ['Sagrada Familia Basilica', 'Park Guell Mosaic Terrace', 'Gothic Quarter Promenade'] },
  { name: 'Amsterdam', country: 'Netherlands', region: 'Europe', category: 'Canals & Art', description: 'Famed canal network, Van Gogh Museum, Anne Frank House, and cycling boulevard culture.', attractions: ['Canal Ring Boat Cruise', 'Van Gogh Museum', 'Rijksmuseum Fine Art'] },
  { name: 'Switzerland', country: 'Switzerland', region: 'Europe', category: 'Alpine Peaks', description: 'Snowy Alpine wonderland with Jungfraujoch "Top of Europe", Lake Lucerne, and Zermatt Matterhorn.', attractions: ['Jungfraujoch Glacier Train', 'Lucerne Chapel Bridge', 'Matterhorn Zermatt Peak'] },
  { name: 'Santorini', country: 'Greece', region: 'Islands', category: 'Caldera Sunsets', description: 'Cycladic island famous for whitewashed cliffside villages, blue dome churches, and sunsets in Oia.', attractions: ['Oia Blue Dome Sunset', 'Red Beach Volcanic Sand', 'Fira Cliffside Promenade'] },
  { name: 'Prague', country: 'Czechia', region: 'Europe', category: 'City of 100 Spires', description: 'Fairytale capital with gothic Charles Bridge, Prague Castle, and Astronomical Clock.', attractions: ['Charles Bridge Statues', 'Prague Castle Complex', 'Old Town Astronomical Clock'] },

  // Americas & Oceania
  { name: 'New York', country: 'USA', region: 'Americas', category: 'The Big Apple', description: 'Iconic metropolis boasting Statue of Liberty, Central Park, Broadway, and Empire State Building.', attractions: ['Statue of Liberty Ferry', 'Central Park Walkway', 'Times Square Broadway'] },
  { name: 'California', country: 'USA', region: 'Americas', category: 'Pacific Coast & Parks', description: 'Golden state featuring San Francisco Golden Gate Bridge, Hollywood, and Yosemite National Park.', attractions: ['Golden Gate Bridge Walk', 'Hollywood Walk of Fame', 'Yosemite National Park'] },
  { name: 'Las Vegas', country: 'USA', region: 'Americas', category: 'Entertainment Capital', description: 'Neon resort strip with world-class casino shows, Bellagio Fountains, and Grand Canyon tours.', attractions: ['Las Vegas Strip Casinos', 'Bellagio Dancing Fountains', 'Grand Canyon Helicopter'] },
  { name: 'Sydney', country: 'Australia', region: 'Americas', category: 'Harbour & Opera', description: 'Australia’s premier harbour city featuring Sydney Opera House, Harbour Bridge, and Bondi Beach.', attractions: ['Sydney Opera House Sail', 'Sydney Harbour Bridge Climb', 'Bondi Beach Coastal Walk'] }
];

export const SearchPage: React.FC = () => {
  const { trips, toggleFavoriteTrip, archiveTrip, duplicateTrip, deleteTrip, addTrip, setActiveTrip } = useTravelStore();
  const [query, setQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [modalDestination, setModalDestination] = useState<string | null>(null);

  const cleanQuery = query.toLowerCase().trim();

  // Filter saved user trips
  const savedTripMatches = trips.filter(
    (t) =>
      t.title.toLowerCase().includes(cleanQuery) ||
      t.destination.toLowerCase().includes(cleanQuery) ||
      (t.country && t.country.toLowerCase().includes(cleanQuery))
  );

  // Filter global travel destination directory
  const globalDestMatches = FEATURED_DESTINATIONS.filter((d) => {
    const matchesRegion = selectedRegion === 'All' || d.region === selectedRegion;
    const matchesSearch =
      !cleanQuery ||
      d.name.toLowerCase().includes(cleanQuery) ||
      d.country.toLowerCase().includes(cleanQuery) ||
      d.category.toLowerCase().includes(cleanQuery) ||
      d.description.toLowerCase().includes(cleanQuery);

    return matchesRegion && matchesSearch;
  });

  const isQueryEmpty = !cleanQuery;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <Compass className="w-6 h-6 text-sky-400" /> Destination Explorer & Search
        </h1>
        <p className="text-xs text-slate-400">Discover 40+ curated global destinations or search your saved journeys</p>
      </div>

      {/* Search Input Bar & Region Filter Tabs */}
      <div className="space-y-3">
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-sky-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Kerala, Goa, Jaipur, Mumbai, Hyderabad, Bali, Paris, Tokyo, Dubai, Sydney..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 shadow-xl"
          />
        </div>

        {/* Region Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {['All', 'India', 'Asia', 'Europe', 'Middle East', 'Americas', 'Islands'].map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                selectedRegion === region
                  ? 'bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {region === 'All' ? '🌐 All World Destinations' : region}
            </button>
          ))}
        </div>
      </div>

      {/* Saved User Trips Section */}
      {!isQueryEmpty && savedTripMatches.length > 0 && (
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Your Saved Journeys ({savedTripMatches.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedTripMatches.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onFavorite={toggleFavoriteTrip}
                onArchive={archiveTrip}
                onDuplicate={duplicateTrip}
                onDelete={deleteTrip}
                onSetActive={setActiveTrip}
              />
            ))}
          </div>
        </div>
      )}

      {/* Global Travel Destinations Directory */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            {cleanQuery ? `Matching Destinations ("${query}")` : `${selectedRegion} Destinations Directory`}
            <span className="text-xs text-sky-400 lowercase font-normal">({globalDestMatches.length} available)</span>
          </h2>
        </div>

        {globalDestMatches.length === 0 && savedTripMatches.length === 0 ? (
          <EmptyState
            title="No Destinations Found"
            description={`No travel destinations found matching "${query}". Try searching for Kerala, Goa, Mumbai, Hyderabad, Bali, Paris, or Tokyo!`}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {globalDestMatches.map((dest) => (
              <div key={dest.name} className="glass-panel-hover overflow-hidden flex flex-col justify-between group border-slate-800/80 shadow-xl">
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={getTripImage(dest.name)}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-slate-900/90 backdrop-blur-md text-sky-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-sky-500/30">
                        {dest.country}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-amber-500/20 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/40 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        {dest.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <h3 className="text-xl font-extrabold text-white tracking-wide drop-shadow-md">{dest.name}</h3>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{dest.description}</p>

                    <div className="pt-2 border-t border-slate-800/60">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Top Attractions:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {dest.attractions.map((attr, idx) => (
                          <span key={idx} className="bg-slate-900 text-slate-300 text-[10px] px-2 py-0.5 rounded-md border border-slate-800">
                            📍 {attr}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => setModalDestination(dest.name)}
                    className="w-full glass-button text-xs py-2.5 flex items-center justify-center gap-2 group-hover:border-sky-500/50"
                  >
                    <span>Plan Trip to {dest.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plan Trip Modal for Selected Destination */}
      {modalDestination && (
        <TripModal
          isOpen={true}
          onClose={() => setModalDestination(null)}
          onSubmit={(tripData) => {
            addTrip(tripData);
            setModalDestination(null);
          }}
          defaultDestination={modalDestination}
        />
      )}
    </div>
  );
};
