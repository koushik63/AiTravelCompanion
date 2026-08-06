import React, { useState, useEffect } from 'react';
import { MapPin, Compass, Navigation, Clock } from 'lucide-react';
import { useTravelStore } from '../store/useTravelStore';
import { WeatherService } from '../services/api';
import { InteractiveMap } from '../components/live/InteractiveMap';
import { WeatherCard } from '../components/live/WeatherCard';
import { EmergencyWidget } from '../components/live/EmergencyWidget';
import { ProgressBar } from '../components/ui/ProgressBar';
import { WeatherInfo } from '../types';

import { EmptyState } from '../components/ui/EmptyState';
import { getDetailedDestinationItinerary } from '../utils/itineraryHelper';

export const CurrentTripPage: React.FC = () => {
  const { trips, activeTrip } = useTravelStore();
  const liveTrips = trips.filter((t) => !t.isArchived);

  const [selectedTripId, setSelectedTripId] = useState<string>(activeTrip?.id || (liveTrips[0]?.id || ''));
  const [weather, setWeather] = useState<WeatherInfo | null>(null);

  const currentTrip = liveTrips.find((t) => t.id === selectedTripId) || activeTrip || liveTrips[0];

  useEffect(() => {
    if (currentTrip?.destination) {
      WeatherService.getCurrent(currentTrip.destination).then(setWeather).catch(() => {});
    }
  }, [currentTrip]);

  if (!currentTrip) {
    return (
      <div className="space-y-6 pb-16">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Compass className="w-6 h-6 text-sky-400" /> Live Mode Navigation
          </h1>
          <p className="text-xs text-slate-400">Real-time GPS tracking, active itinerary checkpoints, and live weather updates</p>
        </div>

        <EmptyState
          title="No Active Trip Running"
          description="You currently have no trip set as active. Plan a new trip or select an active trip from your Trips page to enable Live Mode navigation!"
        />
      </div>
    );
  }

  // Dynamic Real-Time Journey Progress Calculation based on actual trip dates
  const now = new Date();
  const startDate = currentTrip.startDate ? new Date(currentTrip.startDate) : now;
  const endDate = currentTrip.endDate ? new Date(currentTrip.endDate) : new Date(now.getTime() + 7 * 86400000);

  const totalDays = Math.max(1, Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

  const diffFromStartMs = now.getTime() - startDate.getTime();
  let currentDay = 1;
  if (diffFromStartMs > 0) {
    currentDay = Math.min(totalDays, Math.floor(diffFromStartMs / (1000 * 60 * 60 * 24)) + 1);
  } else {
    currentDay = 1; // Trip started today or is starting
  }

  const remainingDays = Math.max(0, totalDays - currentDay);
  const progressPercent = Math.min(100, Math.max(14, Math.round((currentDay / totalDays) * 100)));
  const progressSublabel = `Day ${currentDay} of ${totalDays} • ${remainingDays} ${remainingDays === 1 ? 'Day' : 'Days'} Remaining`;

  return (
    <div className="space-y-8 pb-16">
      {/* Live Trip Switcher (when user has > 1 live trip) */}
      {liveTrips.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto p-2 bg-slate-900/90 border border-sky-500/30 rounded-2xl">
          <span className="text-xs font-bold text-sky-400 px-3 flex items-center gap-1 shrink-0">
            <Compass className="w-4 h-4 text-amber-400" /> Active Live Trips ({liveTrips.length}):
          </span>
          {liveTrips.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTripId(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                currentTrip.id === t.id
                  ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-500/25'
                  : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {t.title} ({t.destination})
            </button>
          ))}
        </div>
      )}

      {/* Active Trip Header */}
      <div className="glass-panel p-6 sm:p-8 space-y-4 border-sky-500/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
              Live Mode Active
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-2">{currentTrip.title}</h1>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-sky-400" /> {currentTrip.destination}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentTrip.destination)}`, '_blank')}
              className="glass-button text-xs py-2.5 px-5 flex items-center gap-1.5 cursor-pointer"
            >
              <Navigation className="w-4 h-4" /> Open Navigation
            </button>
          </div>
        </div>

        <ProgressBar
          progress={progressPercent}
          label="Journey Timeline Progress"
          sublabel={progressSublabel}
          color="emerald"
        />
      </div>

      {/* Map & Weather Row - Perfectly Aligned & Spacious */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 h-full">
          <InteractiveMap destination={currentTrip.destination} height="h-full min-h-[480px]" />
        </div>
        <div className="lg:col-span-1 h-full">
          {weather ? (
            <WeatherCard weather={weather} />
          ) : (
            <div className="glass-panel p-8 text-center text-xs text-slate-400 h-full flex items-center justify-center">Loading Live Climate...</div>
          )}
        </div>
      </div>

      {/* Live Itinerary Schedule */}
      <div className="glass-panel p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" /> Active Live Itinerary Schedule
            </h2>
            <p className="text-xs text-slate-400">Detailed day-by-day checkpoints for {currentTrip.destination}</p>
          </div>
          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
            Verified Live Plan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {getDetailedDestinationItinerary(currentTrip.destination, totalDays, currentTrip.currency, currentTrip.budget).map((d, idx) => (
            <div key={idx} className="p-4.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3.5 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <span className="font-extrabold text-xs text-amber-400">{d.day}</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Est. {d.cost}
                </span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/60 space-y-1">
                  <span className="text-[10px] font-bold text-amber-300 block uppercase tracking-wider">☀️ Morning</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{d.morning}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/60 space-y-1">
                  <span className="text-[10px] font-bold text-sky-300 block uppercase tracking-wider">🌤️ Afternoon</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{d.afternoon}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/60 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-300 block uppercase tracking-wider">🌙 Evening</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{d.evening}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Directory */}
      <EmergencyWidget />
    </div>
  );
};
