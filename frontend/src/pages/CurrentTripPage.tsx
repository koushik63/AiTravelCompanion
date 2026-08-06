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

export const CurrentTripPage: React.FC = () => {
  const { trips, activeTrip } = useTravelStore();
  const liveTrips = trips.filter((t) => !t.isArchived);

  const [selectedTripId, setSelectedTripId] = useState<string>(activeTrip?.id || (liveTrips[0]?.id || ''));
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [flight, setFlight] = useState<FlightStatus | null>(null);
  const [train, setTrain] = useState<TrainStatus | null>(null);

  const currentTrip = liveTrips.find((t) => t.id === selectedTripId) || activeTrip || liveTrips[0];

  useEffect(() => {
    if (currentTrip?.destination) {
      WeatherService.getCurrent(currentTrip.destination).then(setWeather).catch(() => {});
      TransportService.getFlightStatus('6E 504').then(setFlight).catch(() => {});
      TransportService.getTrainStatus('20901').then(setTrain).catch(() => {});
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

      {/* Emergency Directory */}
      <EmergencyWidget />
    </div>
  );
};
