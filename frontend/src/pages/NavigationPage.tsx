import React from 'react';
import { Navigation } from 'lucide-react';
import { InteractiveMap } from '../components/live/InteractiveMap';
import { useTravelStore } from '../store/useTravelStore';

export const NavigationPage: React.FC = () => {
  const { activeTrip } = useTravelStore();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <Navigation className="w-6 h-6 text-sky-400" /> Live Navigation Visualizer
        </h1>
        <p className="text-xs text-slate-400">Turn-by-turn route step directions and live map visualizer</p>
      </div>

      <InteractiveMap destination={activeTrip?.destination || 'Destination'} height="h-96" />
    </div>
  );
};
