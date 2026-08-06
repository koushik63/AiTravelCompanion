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
  height = 'h-96'
}) => {
  const mapSearchUrl = `https://maps.google.com/maps?q=${encodeURIComponent(destination)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  const externalGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;

  return (
    <div className={`relative w-full ${height} bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between`}>
      {/* Top Overlay Controls */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-xs font-semibold text-slate-100 pointer-events-auto shadow-lg">
          <MapPin className="w-4 h-4 text-sky-400" />
          <span>{destination}</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-xs text-emerald-400 font-bold pointer-events-auto shadow-lg">
          <Navigation className="w-3.5 h-3.5" /> GPS Active
        </div>
      </div>

      {/* Real Interactive Map Canvas Embed */}
      <div className="relative w-full h-full">
        <iframe
          title={`Map of ${destination}`}
          width="100%"
          height="100%"
          src={mapSearchUrl}
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          className="w-full h-full border-0 filter contrast-[1.05] brightness-90 saturate-[1.1]"
        />
      </div>

      {/* Bottom Route Information Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-xs text-slate-300 shadow-xl">
        <span className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
          <Compass className="w-4 h-4 text-sky-400" />
          {activities.length ? `${activities.length} Waypoints Loaded` : 'Live Satellite & Street Route'}
        </span>

        <a
          href={externalGoogleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 font-semibold hover:underline flex items-center gap-1 text-xs"
        >
          Open in Google Maps ↗
        </a>
      </div>
    </div>
  );
};
