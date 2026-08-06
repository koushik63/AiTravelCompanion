import React, { useState } from 'react';
import { Search, Sparkles, MapPin, Plus, ArrowRight } from 'lucide-react';
import { useTravelStore } from '../store/useTravelStore';
import { TripCard } from '../components/trips/TripCard';
import { TripModal } from '../components/trips/TripModal';
import { EmptyState } from '../components/ui/EmptyState';
import { getTripImage } from '../utils/imageHelper';

interface GlobalDestination {
  name: string;
  country: string;
  category: string;
  description: string;
  attractions: string[];
}

const FEATURED_DESTINATIONS: GlobalDestination[] = [
  { name: 'Kerala', country: 'India', category: 'Nature & Backwaters', description: 'God’s Own Country featuring tranquil Alleppey backwaters, tea gardens in Munnar, and Kovalam beaches.', attractions: ['Alleppey Houseboat Cruise', 'Munnar Tea Estates', 'Varkala Cliff Beach'] },
  { name: 'Goa', country: 'India', category: 'Beach & Nightlife', description: 'Sun-kissed coastal paradise renowned for golden beaches, Latin Quarter architecture, and seafood shacks.', attractions: ['Baga & Calangute Beach', 'Basilica of Bom Jesus', 'Fort Aguada Viewpoint'] },
  { name: 'Mumbai', country: 'India', category: 'Metropolis & Heritage', description: 'Financial capital of India famous for Gateway of India, Marine Drive, and vibrant Street Food culture.', attractions: ['Gateway of India', 'Marine Drive Promenade', 'Colaba Causeway Market'] },
  { name: 'Jaipur', country: 'India', category: 'Royal Heritage', description: 'The Pink City of Rajasthan famous for majestic Amber Fort, Hawa Mahal palace, and royal bazaars.', attractions: ['Amber Fort Palace', 'Hawa Mahal', 'City Palace Museum'] },
  { name: 'Ladakh', country: 'India', category: 'High-Altitude Adventure', description: 'Breathtaking Himalayan landscape featuring Pangong Tso crystal lake, Khardung La pass, and ancient monasteries.', attractions: ['Pangong Lake', 'Nubra Valley Dunes', 'Thiksey Monastery'] },
  { name: 'Kashmir', country: 'India', category: 'Paradise Valley', description: 'Paradise on Earth with Dal Lake Shikara rides, Gulmarg snow slopes, and Pahalgam pine forests.', attractions: ['Dal Lake Houseboats', 'Gulmarg Gondola Lift', 'Betaab Valley'] },
  { name: 'Agra', country: 'India', category: 'Wonders of World', description: 'Home to the iconic white marble Taj Mahal monument of eternal love and Agra Fort.', attractions: ['Taj Mahal Wonder', 'Agra Fort Citadel', 'Mehtab Bagh Gardens'] },
  { name: 'Varanasi', country: 'India', category: 'Spiritual Capital', description: 'Sacred Ganges riverfront ghats, morning boat rituals, and evening Ganga Aarti ceremonies.', attractions: ['Dashashwamedh Ghat Aarti', 'Kashi Vishwanath Temple', 'Sarnath UNESCO Site'] },
  { name: 'Bali', country: 'Indonesia', category: 'Tropical Island', description: 'Island of Gods renowned for Ubud rice terraces, cliffside sea temples, and vibrant beach lounges.', attractions: ['Tegallalang Rice Terraces', 'Uluwatu Temple Sunset', 'Seminyak Beach Lounge'] },
  { name: 'Paris', country: 'France', category: 'Romance & Culture', description: 'City of Light famed for Eiffel Tower, Louvre art museum, and Seine riverfront cafes.', attractions: ['Eiffel Tower Summit', 'Louvre Museum Glass Pyramid', 'Notre-Dame Cathedral'] },
  { name: 'Tokyo', country: 'Japan', category: 'Futuristic Capital', description: 'Dynamic metropolis blending neon-lit Shibuya crossing with tranquil Meiji Shrine and Mount Fuji views.', attractions: ['Shibuya Crossing Scramble', 'Senso-ji Ancient Temple', 'Mount Fuji Day Excursion'] },
  { name: 'Dubai', country: 'UAE', category: 'Luxury & Skyline', description: 'Desert oasis boasting Burj Khalifa skyscraper, Palm Jumeirah islands, and mega shopping malls.', attractions: ['Burj Khalifa Observation Deck', 'Dubai Mall Fountain Show', 'Desert Safari Dunes'] },
  { name: 'Maldives', country: 'Maldives', category: 'Overwater Luxury', description: 'Pristine coral atolls with crystal turquoise lagoons, luxury overwater villas, and marine diving.', attractions: ['Overwater Bungalow Stay', 'Coral Reef Snorkeling', 'Sunset Dolphin Cruise'] },
  { name: 'Singapore', country: 'Singapore', category: 'Garden City', description: 'Modern island city featuring futuristic Gardens by the Bay, Marina Bay Sands, and Sentosa beaches.', attractions: ['Gardens by the Bay Supertrees', 'Marina Bay Sands Skypark', 'Jewel Changi Waterfall'] }
];

export const SearchPage: React.FC = () => {
  const { trips, toggleFavoriteTrip, archiveTrip, duplicateTrip, deleteTrip, addTrip, setActiveTrip } = useTravelStore();
  const [query, setQuery] = useState('');
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
  const globalDestMatches = FEATURED_DESTINATIONS.filter(
    (d) =>
      d.name.toLowerCase().includes(cleanQuery) ||
      d.country.toLowerCase().includes(cleanQuery) ||
      d.category.toLowerCase().includes(cleanQuery) ||
      d.description.toLowerCase().includes(cleanQuery)
  );

  const isQueryEmpty = !cleanQuery;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <Search className="w-6 h-6 text-sky-400" /> Destination Search
        </h1>
        <p className="text-xs text-slate-400">Search your trips or discover popular travel destinations worldwide</p>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-lg">
        <Search className="w-4 h-4 text-sky-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Kerala, Goa, Jaipur, Mumbai, Bali, Paris..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 shadow-xl"
        />
      </div>

      {/* Saved User Trips Section */}
      {!isQueryEmpty && savedTripMatches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Saved Journeys ({savedTripMatches.length})
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

      {/* Global Travel Destinations Results */}
      <div className="space-y-4 pt-2">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-sky-400" /> Explore Destinations {cleanQuery ? `Matching "${query}"` : 'Worldwide'}
        </h2>

        {globalDestMatches.length === 0 && savedTripMatches.length === 0 ? (
          <EmptyState
            title="No Matching Results"
            description={`No travel destinations or saved trips found matching "${query}". Try searching for Kerala, Goa, Mumbai, Bali, or Paris!`}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {globalDestMatches.map((dest) => (
              <div key={dest.name} className="glass-panel-hover overflow-hidden flex flex-col justify-between group border-slate-800/80">
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={getTripImage(dest.name)}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2.5 py-1 rounded-full backdrop-blur-md">
                        {dest.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-extrabold text-slate-100">{dest.name}</h3>
                      <p className="text-xs text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-sky-400" /> {dest.country}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{dest.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {dest.attractions.map((att) => (
                        <span key={att} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                          {att}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => {
                      setModalDestination(dest.name);
                    }}
                    className="w-full glass-button text-xs py-2.5 flex items-center justify-center gap-2 shadow-lg shadow-sky-500/15"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Plan AI Trip to {dest.name} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trip Creation Modal Pre-filled with Searched Destination */}
      <TripModal
        isOpen={Boolean(modalDestination)}
        onClose={() => setModalDestination(null)}
        initialData={modalDestination ? ({ destination: modalDestination, title: `Journey to ${modalDestination}` } as any) : null}
        onSubmit={async (tripData) => {
          await addTrip(tripData);
          setModalDestination(null);
        }}
      />
    </div>
  );
};
