import React, { useState, useEffect } from 'react';
import { MapPin, Compass, Navigation, Clock, Sparkles, RefreshCw } from 'lucide-react';
import { useTravelStore } from '../store/useTravelStore';
import { WeatherService, AIService } from '../services/api';
import { InteractiveMap } from '../components/live/InteractiveMap';
import { WeatherCard } from '../components/live/WeatherCard';
import { EmergencyWidget } from '../components/live/EmergencyWidget';
import { ProgressBar } from '../components/ui/ProgressBar';
import { WeatherInfo } from '../types';
import { EmptyState } from '../components/ui/EmptyState';
import { getDetailedDestinationItinerary, DayItinerary } from '../utils/itineraryHelper';

export const CurrentTripPage: React.FC = () => {
  const { trips, activeTrip } = useTravelStore();
  const liveTrips = trips.filter((t) => !t.isArchived);

  const [selectedTripId, setSelectedTripId] = useState<string>(activeTrip?.id || (liveTrips[0]?.id || ''));
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [customItinerary, setCustomItinerary] = useState<DayItinerary[] | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);

  const currentTrip = liveTrips.find((t) => t.id === selectedTripId) || activeTrip || liveTrips[0];

  useEffect(() => {
    if (currentTrip?.destination) {
      WeatherService.getCurrent(currentTrip.destination).then(setWeather).catch(() => {});
      setCustomItinerary(null);
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
    currentDay = 1;
  }

  const remainingDays = Math.max(0, totalDays - currentDay);
  const progressPercent = Math.min(100, Math.max(14, Math.round((currentDay / totalDays) * 100)));
  const progressSublabel = `Day ${currentDay} of ${totalDays} • ${remainingDays} ${remainingDays === 1 ? 'Day' : 'Days'} Remaining`;

  const handleRegenerateAI = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await AIService.generateItinerary({
        destination: currentTrip.destination,
        travelStyle: currentTrip.travelType || 'Leisure',
        budget: currentTrip.budget || 50000,
        durationDays: totalDays,
        forceRegenerate: true
      });

      if (res && res.days && Array.isArray(res.days)) {
        const aiDays: DayItinerary[] = res.days.map((d: any) => ({
          day: `Day ${d.dayNumber}: ${d.summary || 'Custom AI Schedule'}`,
          morning: d.morning && d.morning[0] ? d.morning[0].title : `Explore morning highlights in ${currentTrip.destination}`,
          afternoon: d.afternoon && d.afternoon[0] ? d.afternoon[0].title : `Visit central attraction in ${currentTrip.destination}`,
          evening: d.evening && d.evening[0] ? d.evening[0].title : `Dine at famous local restaurant in ${currentTrip.destination}`,
          cost: `₹${Math.round((d.morning?.[0]?.cost || 800) + (d.afternoon?.[0]?.cost || 1200) + (d.evening?.[0]?.cost || 1500))}`
        }));
        setCustomItinerary(aiDays);
      }
    } catch (err) {
      console.error('Failed to regenerate AI itinerary', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const displayedItinerary = customItinerary || getDetailedDestinationItinerary(currentTrip.destination, totalDays, currentTrip.currency, currentTrip.budget);

  return (
    <div className="space-y-8 pb-16">
      {/* Live Trip Switcher */}
      {liveTrips.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto p-2 bg-slate-900/90 border border-sky-500/30 rounded-2xl">
          <span className="text-xs font-bold text-sky-400 px-3 flex items-center gap-1 shrink-0">
            <Compass className="w-4 h-4 text-amber-400" /> Active Live Trips ({liveTrips.length}):
          </span>
          {liveTrips.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTripId(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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

      {/* Map & Weather Row */}
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" /> Active Live Itinerary Schedule
            </h2>
            <p className="text-xs text-slate-400">Detailed day-by-day checkpoints for {currentTrip.destination}</p>
          </div>

          <button
            onClick={handleRegenerateAI}
            disabled={isGeneratingAI}
            className="glass-button text-xs py-2 px-4 flex items-center gap-1.5 shadow-lg shadow-sky-500/15 disabled:opacity-50 cursor-pointer"
          >
            {isGeneratingAI ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" /> Regenerating AI Schedule...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Regenerate AI Itinerary
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {displayedItinerary.map((d, idx) => (
            <div key={idx} className="p-4.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3.5 shadow-lg hover:border-sky-500/30 transition-all">
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
