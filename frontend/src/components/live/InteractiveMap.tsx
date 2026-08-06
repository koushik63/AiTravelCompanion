import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';

interface InteractiveMapProps {
  destination?: string;
  activities?: any[];
  height?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  destination = 'Goa, India',
  activities = [],
  height = 'h-80'
}) => {
  return (
    <div className={`relative w-full ${height} bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between p-4`}>
      {/* Dynamic Grid Vector Canvas Graphic */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-xs font-semibold text-slate-100">
          <MapPin className="w-4 h-4 text-sky-400" />
          <span>{destination}</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-xs text-sky-400 font-bold">
          <Navigation className="w-3.5 h-3.5" /> GPS Active
        </div>
      </div>

      {/* Vector Interactive Map Simulation */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-sky-500/20 border-2 border-sky-400 flex items-center justify-center animate-ping absolute inset-0" />
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/50 relative z-10">
            <Compass className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '10s' }} />
          </div>
        </div>

        <div className="text-center space-y-1">
          <h4 className="font-bold text-slate-100 text-sm">Interactive Map Engine Active</h4>
          <p className="text-xs text-slate-400">
            Displaying {activities.length || 3} activity checkpoints & live route navigation
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between z-10 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
        <span>Route: 14.2 km • 28 mins drive</span>
        <span className="text-sky-400 font-semibold cursor-pointer hover:underline">Open in Google Maps ↗</span>
      </div>
    </div>
  );
};
