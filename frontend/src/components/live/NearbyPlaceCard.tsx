import React, { useState } from 'react';
import { MapPin, Star, Bookmark, Navigation } from 'lucide-react';
import { NearbyPlace } from '../../types';

interface NearbyPlaceCardProps {
  place: NearbyPlace;
  onSave?: (place: NearbyPlace) => void;
}

export const NearbyPlaceCard: React.FC<NearbyPlaceCardProps> = ({ place, onSave }) => {
  const [isSaved, setIsSaved] = useState(place.isSaved || false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(place);
  };

  const handleNavigate = () => {
    const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${place.name}, ${place.address}`)}`;
    window.open(navUrl, '_blank');
  };

  return (
    <div className="glass-panel p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-slate-100 text-xs sm:text-sm">{place.name}</h4>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-md border border-sky-500/20 shrink-0">
            {place.category}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" /> {place.address} • {place.distanceKm} km away
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mr-2">
          <Star className="w-3.5 h-3.5 fill-amber-400" /> {place.rating}
        </div>

        <button
          onClick={handleNavigate}
          className="glass-button text-xs py-2 px-3 flex items-center gap-1.5 shadow-md shadow-sky-500/10"
          title="Open Turn-by-Turn Navigation"
        >
          <Navigation className="w-3.5 h-3.5 text-sky-400" /> Navigate
        </button>

        <button
          onClick={handleSave}
          className={`p-2 rounded-xl border transition-colors ${
            isSaved
              ? 'bg-sky-500 text-white border-sky-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Save Place"
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
        </button>
      </div>
    </div>
  );
};
