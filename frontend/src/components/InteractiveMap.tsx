import React, { useState } from 'react';
import { MapPin, Navigation, Star, Utensils, Hotel, Camera } from 'lucide-react';

interface MapProps {
  destination?: string;
  activities?: any[];
}

export const InteractiveMap: React.FC<MapProps> = ({ destination = 'Goa, India' }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'food' | 'sightseeing' | 'hotels'>('all');
  const [activePin, setActivePin] = useState<any | null>(null);

  const mockPins = [
    { id: '1', name: 'Basilica of Bom Jesus', category: 'sightseeing', lat: '15.5009', lng: '73.9116', rating: 4.9, address: 'Old Goa, India' },
    { id: '2', name: 'Thalassa Beachside Lounge', category: 'food', lat: '15.5985', lng: '73.7380', rating: 4.9, address: 'Vagator Beach, Goa' },
    { id: '3', name: 'Taj Fort Aguada Resort', category: 'hotels', lat: '15.4920', lng: '73.7737', rating: 4.8, address: 'Sinquerim Beach, Goa' },
    { id: '4', name: 'Fontainhas Latin Quarter', category: 'sightseeing', lat: '15.4989', lng: '73.8278', rating: 4.8, address: 'Panaji, Goa' }
  ];

  const filtered = mockPins.filter(p => selectedFilter === 'all' || p.category === selectedFilter);

  return (
    <div className="glass-panel overflow-hidden relative">
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-sky-400" />
          <h3 className="font-semibold text-slate-100 text-sm">Interactive Map - {destination}</h3>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl text-xs">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${selectedFilter === 'all' ? 'bg-sky-500 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
          >
            All Pins
          </button>
          <button
            onClick={() => setSelectedFilter('sightseeing')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${selectedFilter === 'sightseeing' ? 'bg-sky-500 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Sights
          </button>
          <button
            onClick={() => setSelectedFilter('food')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${selectedFilter === 'food' ? 'bg-sky-500 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Dining
          </button>
          <button
            onClick={() => setSelectedFilter('hotels')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${selectedFilter === 'hotels' ? 'bg-sky-500 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Hotels
          </button>
        </div>
      </div>

      <div className="relative h-80 bg-slate-950/90 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />

        <div className="relative w-full h-full max-w-2xl flex items-center justify-around">
          {filtered.map((pin, idx) => (
            <div
              key={pin.id}
              onClick={() => setActivePin(pin)}
              className={`relative cursor-pointer group transform transition-transform hover:scale-110 ${idx % 2 === 0 ? '-translate-y-6' : 'translate-y-4'}`}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 shadow-xl shadow-sky-500/20">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-sky-400">
                  {pin.category === 'food' ? <Utensils className="w-4 h-4" /> : pin.category === 'hotels' ? <Hotel className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                </div>
              </div>
              <div className="absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-slate-200 border border-slate-700/80 text-[10px] px-2 py-0.5 rounded-md font-medium shadow-md">
                {pin.name.split(' ')[0]}
              </div>
            </div>
          ))}
        </div>

        {activePin && (
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-sky-500/40 p-3.5 rounded-xl shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wide">{activePin.category}</span>
              <h4 className="font-bold text-slate-100 text-sm">{activePin.name}</h4>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{activePin.address}</span>
                <span className="text-amber-400 flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" /> {activePin.rating}</span>
              </p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activePin.name + ' ' + destination)}`}
              target="_blank"
              rel="noreferrer"
              className="glass-button text-xs py-1.5 px-3 flex items-center gap-1 shrink-0"
            >
              <Navigation className="w-3.5 h-3.5" /> Navigate
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
