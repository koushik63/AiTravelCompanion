import React, { useState, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { MapsService } from '../services/api';
import { NearbyPlaceCard } from '../components/live/NearbyPlaceCard';
import { NearbyPlace } from '../types';

export const NearbyPage: React.FC = () => {
  const [category, setCategory] = useState<string>('restaurant');
  const [places, setPlaces] = useState<NearbyPlace[]>([]);

  useEffect(() => {
    MapsService.getNearby(15.2993, 74.124, category).then(setPlaces).catch(() => {});
  }, [category]);

  const categories = [
    { id: 'restaurant', label: 'Restaurants' },
    { id: 'hotel', label: 'Hotels' },
    { id: 'hospital', label: 'Hospitals' },
    { id: 'atm', label: 'ATMs' },
    { id: 'petrol', label: 'Petrol Stations' },
    { id: 'pharmacy', label: 'Pharmacies' },
    { id: 'attraction', label: 'Attractions' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-sky-400" /> Nearby Explorer
        </h1>
        <p className="text-xs text-slate-400">Discover top-rated places around your current location</p>
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

      <div className="space-y-3">
        {places.map((place) => (
          <NearbyPlaceCard key={place.id} place={place} />
        ))}
      </div>
    </div>
  );
};
