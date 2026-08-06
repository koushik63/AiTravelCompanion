import React, { useState, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { MapsService } from '../services/api';
import { NearbyPlaceCard } from '../components/live/NearbyPlaceCard';
import { NearbyPlace } from '../types';
import { useTravelStore } from '../store/useTravelStore';

export const NearbyPage: React.FC = () => {
  const { trips, activeTrip } = useTravelStore();
  const initialLocation = activeTrip?.destination || (trips.length > 0 ? trips[0].destination : 'Mumbai');
  const [targetLocation, setTargetLocation] = useState<string>(initialLocation);
  const [category, setCategory] = useState<string>('restaurant');
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    MapsService.getNearby(15.2993, 74.124, category, targetLocation)
      .then((data) => setPlaces(data || []))
      .catch(() => setPlaces([]))
      .finally(() => setIsLoading(false));
  }, [category, targetLocation]);

  const categories = [
    { id: 'restaurant', label: 'Restaurants' },
    { id: 'hotel', label: 'Hotels' },
    { id: 'attraction', label: 'Attractions' },
    { id: 'hospital', label: 'Hospitals' },
    { id: 'atm', label: 'ATMs' },
    { id: 'petrol', label: 'Petrol Stations' },
    { id: 'pharmacy', label: 'Pharmacies' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-sky-400" /> Nearby Explorer
          </h1>
          <p className="text-xs text-slate-400">Discover top-rated places around your selected destination</p>
        </div>

        {/* Location Selector Input */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs">
          <Search className="w-4 h-4 text-sky-400 shrink-0" />
          <input
            type="text"
            value={targetLocation}
            onChange={(e) => setTargetLocation(e.target.value)}
            placeholder="Enter city (e.g. Mumbai, Bali, Goa)"
            className="bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-xs w-44"
          />
          {trips.length > 0 && (
            <select
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
              className="bg-slate-950 text-slate-300 text-[11px] rounded px-2 py-1 border border-slate-800 focus:outline-none"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.destination}>
                  {t.destination}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
              category === c.id
                ? 'bg-sky-500 text-white font-semibold shadow-lg shadow-sky-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-xs text-slate-400">Finding nearby {category}s in {targetLocation}...</div>
      ) : places.length === 0 ? (
        <div className="glass-panel p-8 text-center text-xs text-slate-400">No nearby {category}s found for {targetLocation}.</div>
      ) : (
        <div className="space-y-3">
          {places.map((place) => (
            <NearbyPlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
};
