import React, { useState } from 'react';
import { MapPin, Star, Bookmark } from 'lucide-react';
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

  return (
    <div className="glass-panel p-4 flex items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-slate-100 text-xs">{place.name}</h4>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-md border border-sky-500/20">
            {place.category}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-500" /> {place.address} • {place.distanceKm} km away
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400" /> {place.rating}
        </div>
        <button
          onClick={handleSave}
          className={`p-2 rounded-xl border transition-colors ${
            isSaved
              ? 'bg-sky-500 text-white border-sky-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
        </button>
      </div>
    </div>
  );
};
