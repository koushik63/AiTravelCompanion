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

export const CurrentTripPage: React.FC = () => {
  const { activeTrip } = useTravelStore();
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [flight, setFlight] = useState<FlightStatus | null>(null);
  const [train, setTrain] = useState<TrainStatus | null>(null);

  useEffect(() => {
    const destination = activeTrip?.destination || 'Goa, India';
    WeatherService.getCurrent(destination).then(setWeather).catch(() => {});
    TransportService.getFlightStatus('6E 504').then(setFlight).catch(() => {});
    TransportService.getTrainStatus('20901').then(setTrain).catch(() => {});
  }, [activeTrip]);

  const defaultTrip = activeTrip || {
    id: 'trip_1',
    title: 'Goa Beachside Vacation',
    destination: 'Goa, India',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 604800000).toISOString(),
    budget: 45000,
    spent: 12500,
    currency: 'INR'
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Active Trip Header */}
      <div className="glass-panel p-6 sm:p-8 space-y-4 border-sky-500/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
              Live Mode Active
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-2">{defaultTrip.title}</h1>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-sky-400" /> {defaultTrip.destination}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(defaultTrip.destination)}`, '_blank')}
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
          <InteractiveMap destination={defaultTrip.destination} />
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
