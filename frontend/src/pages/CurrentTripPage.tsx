import React, { useState, useEffect } from 'react';
import { MapPin, Compass, Navigation, Phone, CheckCircle2, Clock } from 'lucide-react';
import { useTravelStore } from '../store/useTravelStore';
import { WeatherService, TransportService } from '../services/api';
import { InteractiveMap } from '../components/live/InteractiveMap';
import { WeatherCard } from '../components/live/WeatherCard';
import { FlightCard } from '../components/live/FlightCard';
import { TrainCard } from '../components/live/TrainCard';
import { EmergencyWidget } from '../components/live/EmergencyWidget';
import { ProgressBar } from '../components/ui/ProgressBar';
import { WeatherInfo, FlightStatus, TrainStatus } from '../types';

import { EmptyState } from '../components/ui/EmptyState';
import { getDetailedDestinationItinerary } from '../utils/itineraryHelper';

export const CurrentTripPage: React.FC = () => {
  const { trips, activeTrip } = useTravelStore();
  const liveTrips = trips.filter((t) => !t.isArchived);

  const [selectedTripId, setSelectedTripId] = useState<string>(activeTrip?.id || (liveTrips[0]?.id || ''));
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [flight, setFlight] = useState<FlightStatus | null>(null);
  const [train, setTrain] = useState<TrainStatus | null>(null);
  const [searchFlightCode, setSearchFlightCode] = useState<string>('');
  const [searchTrainCode, setSearchTrainCode] = useState<string>('');

  const currentTrip = liveTrips.find((t) => t.id === selectedTripId) || activeTrip || liveTrips[0];

  useEffect(() => {
    if (currentTrip?.destination) {
      WeatherService.getCurrent(currentTrip.destination).then(setWeather).catch(() => {});
      TransportService.getFlightStatus(searchFlightCode, currentTrip.destination).then(setFlight).catch(() => {});
      TransportService.getTrainStatus(searchTrainCode, currentTrip.destination).then(setTrain).catch(() => {});
    }
  }, [currentTrip, searchFlightCode, searchTrainCode]);

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
              className="glass-button text-xs py-2.5 px-5 flex items-center gap-1.5"
            >
              <Navigation className="w-4 h-4" /> Open Navigation
            </button>
          </div>
        </div>

        <ProgressBar
          progress={55}
          label="Journey Timeline Progress"
          sublabel="Day 4 of 7 • 3 Days Remaining"
          color="emerald"
        />
      </div>

      {/* Map & Weather Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InteractiveMap destination={currentTrip.destination} />
        </div>
        <div>
          {weather ? (
            <WeatherCard weather={weather} />
          ) : (
            <div className="glass-panel p-8 text-center text-xs text-slate-400">Loading Live Climate...</div>
          )}
        </div>
      </div>

      {/* Transport Tracker Row */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Compass className="w-5 h-5 text-sky-400" /> Transport Tracker (Live Air & Rail)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {flight && <FlightCard flight={flight} />}
          {train && <TrainCard train={train} />}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getDetailedDestinationItinerary(currentTrip.destination).map((d, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="font-extrabold text-xs text-amber-400">{d.day}</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Est. {d.cost}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-slate-950/70 space-y-0.5">
                  <span className="text-[10px] font-bold text-amber-300 block uppercase">☀️ Morning</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{d.morning}</p>
                </div>
                <div className="p-2 rounded bg-slate-950/70 space-y-0.5">
                  <span className="text-[10px] font-bold text-sky-300 block uppercase">🌤️ Afternoon</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{d.afternoon}</p>
                </div>
                <div className="p-2 rounded bg-slate-950/70 space-y-0.5">
                  <span className="text-[10px] font-bold text-indigo-300 block uppercase">🌙 Evening</span>
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
