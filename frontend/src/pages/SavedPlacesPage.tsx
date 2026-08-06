import React, { useState, useEffect } from 'react';
import { Bookmark, MapPin, Trash2 } from 'lucide-react';
import { SavedPlace } from '../types';
import { MapsService } from '../services/api';
import { EmptyState } from '../components/ui/EmptyState';

export const SavedPlacesPage: React.FC = () => {
  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    MapsService.getSavedPlaces()
      .then((data) => setPlaces(data || []))
      .catch(() => setPlaces([]))
      .finally(() => setIsLoading(false));
  }, []);

  const handleRemove = async (id: string) => {
    try {
      await MapsService.removeSavedPlace(id);
      setPlaces(places.filter((p) => p.id !== id));
    } catch {
      setPlaces(places.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-sky-400 fill-sky-400" /> Saved Places Directory
        </h1>
        <p className="text-xs text-slate-400">Your bookmarked landmarks, restaurants, and hotels</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading saved places...</div>
      ) : places.length === 0 ? (
        <EmptyState
          title="No Saved Places Yet"
          description="Explore nearby spots and click bookmark to save your favorite destinations!"
        />
      ) : (
        <div className="space-y-3">
          {places.map((place) => (
            <div key={place.id} className="glass-panel p-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-100 text-sm">{place.name}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> {place.address}
                </p>
              </div>

              <button
                onClick={() => handleRemove(place.id)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Remove Saved Place"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
