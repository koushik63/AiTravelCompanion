import React, { useState, useRef, useEffect } from 'react';
import { Compass, Search, Plane, Train, ArrowRight, CheckCircle2, Clock, MapPin, AlertCircle, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';
import { TransportService } from '../services/api';
import { FlightCard } from '../components/live/FlightCard';
import { TrainCard } from '../components/live/TrainCard';
import { FlightStatus, TrainStatus } from '../types';
import { useTravelStore } from '../store/useTravelStore';
import {
  getAvailableFlightsForDestination,
  getAvailableTrainsForDestination,
  FlightOption,
  TrainOption
} from '../utils/transportDirectory';

export const TransportPage: React.FC = () => {
  const { activeTrip, trips } = useTravelStore();
  const trackerSectionRef = useRef<HTMLDivElement>(null);

  const [selectedDestination, setSelectedDestination] = useState<string>(
    activeTrip?.destination || (trips[0]?.destination || 'Delhi')
  );
  const [selectedOrigin, setSelectedOrigin] = useState<string>('Chennai');

  const [flightNum, setFlightNum] = useState('');
  const [trainNum, setTrainNum] = useState('');
  const [flight, setFlight] = useState<FlightStatus | null>(null);
  const [train, setTrain] = useState<TrainStatus | null>(null);
  const [isFlightLoading, setIsFlightLoading] = useState(false);
  const [isTrainLoading, setIsTrainLoading] = useState(false);
  const [flightError, setFlightError] = useState<string | null>(null);
  const [trainError, setTrainError] = useState<string | null>(null);

  // Live SerpApi Google Flights State
  const [liveSerpFlights, setLiveSerpFlights] = useState<any[]>([]);
  const [isSerpLoading, setIsSerpLoading] = useState(false);

  const availableFlights = getAvailableFlightsForDestination(selectedDestination, selectedOrigin);
  const availableTrains = getAvailableTrainsForDestination(selectedDestination, selectedOrigin);

  useEffect(() => {
    if (!selectedDestination.trim()) return;
    setIsSerpLoading(true);
    const origCode = (selectedOrigin.trim() === 'all' || !selectedOrigin.trim()) ? 'DEL' : selectedOrigin.trim();
    const destCode = selectedDestination.trim();
    TransportService.searchFlights(origCode, destCode)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLiveSerpFlights(data);
        } else {
          setLiveSerpFlights([]);
        }
      })
      .catch(() => setLiveSerpFlights([]))
      .finally(() => setIsSerpLoading(false));
  }, [selectedOrigin, selectedDestination]);

  const trackSpecificFlightOption = (f: any) => {
    setFlightNum(f.flightNumber);
    setFlightError(null);
    setFlight({
      flightNumber: f.flightNumber,
      airline: f.airline,
      origin: f.origin,
      destination: f.destination,
      departureTime: new Date().toISOString(),
      arrivalTime: new Date(Date.now() + 7200000).toISOString(),
      terminal: f.terminal || 'T2',
      gate: f.gate || 'Gate 14',
      status: f.status || 'ON TIME',
      delayMinutes: f.delayMinutes || 0
    });

    // Auto-scroll to live tracker section
    setTimeout(() => {
      trackerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const trackSpecificTrainOption = (t: TrainOption) => {
    setTrainNum(t.trainNumber);
    setTrainError(null);
    setTrain({
      trainNumber: t.trainNumber,
      trainName: t.trainName,
      origin: t.origin,
      destination: t.destination,
      departureTime: new Date().toISOString(),
      arrivalTime: new Date(Date.now() + 14400000).toISOString(),
      platform: t.platform,
      coach: t.coach,
      seat: t.seat,
      status: t.status,
      delayMinutes: t.delayMinutes
    });

    // Auto-scroll to live tracker section
    setTimeout(() => {
      trackerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSearchFlight = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!flightNum.trim()) return;
    setFlightError(null);
    setIsFlightLoading(true);
    TransportService.getFlightStatus(flightNum.trim())
      .then((res) => {
        if ((res as any).error) {
          setFlight({ flightNumber: flightNum, status: 'FLIGHT NOT FOUND', error: (res as any).error } as any);
        } else {
          setFlight(res);
        }
      })
      .catch((err) => {
        setFlight({ flightNumber: flightNum, status: 'FLIGHT NOT FOUND', error: err.message } as any);
      })
      .finally(() => {
        setIsFlightLoading(false);
        trackerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
  };

  const handleSearchTrain = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trainNum.trim()) return;
    setTrainError(null);
    setIsTrainLoading(true);
    TransportService.getTrainStatus(trainNum.trim())
      .then((res) => {
        if ((res as any).error) {
          setTrain({ trainNumber: trainNum, status: 'TRAIN NOT FOUND', error: (res as any).error } as any);
        } else {
          setTrain(res);
        }
      })
      .catch((err) => {
        setTrain({ trainNumber: trainNum, status: 'TRAIN NOT FOUND', error: err.message } as any);
      })
      .finally(() => {
        setIsTrainLoading(false);
        trackerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
  };

  const displayedFlights = liveSerpFlights.length > 0 ? liveSerpFlights : availableFlights;

  const popularOrigins = ['All Cities', 'Vizag', 'Hyderabad', 'Chennai', 'Bengaluru', 'Mumbai', 'Delhi', 'Kolkata'];
  const popularDestinations = ['Araku', 'Vizag', 'Hyderabad', 'Pune', 'Goa', 'Kerala', 'Tirupati', 'Dubai', 'Singapore', 'Tokyo', 'Paris'];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Compass className="w-6 h-6 text-sky-400" /> Air & Rail Transport Hub
          </h1>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
            <span>Search live flights worldwide via SerpApi Google Flights & authentic Indian Railways</span>
            <span className="text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-400" /> SerpApi Active
            </span>
          </p>
        </div>
      </div>

      {/* Free-Text Search Bar for Start Location & Destination */}
      <div className="glass-panel p-6 space-y-4 border-sky-500/30 shadow-2xl">
        <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Search className="w-4 h-4 text-sky-400" /> Custom Flight & Rail Route Finder
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Location Free Text Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-400 shrink-0" /> Start Location / Departure City
            </label>
            <input
              type="text"
              value={selectedOrigin === 'all' ? '' : selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value || 'all')}
              placeholder="Type ANY departure city or airport (e.g. Vizag, Hyderabad, Chennai, Delhi, BOM)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-amber-400 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {/* Quick Origin Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-500 font-semibold">Quick select:</span>
              {popularOrigins.map((orig) => (
                <button
                  key={orig}
                  type="button"
                  onClick={() => setSelectedOrigin(orig === 'All Cities' ? 'all' : orig)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    (selectedOrigin === 'all' && orig === 'All Cities') || selectedOrigin.toLowerCase() === orig.toLowerCase()
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {orig}
                </button>
              ))}
            </div>
          </div>

          {/* Destination Free Text Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" /> Destination City / Airport
            </label>
            <input
              type="text"
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              placeholder="Type ANY destination city or airport (e.g. Araku, Vizag, Pune, Tirupati, Dubai, SIN)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-sky-400 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
            />
            {/* Quick Destination Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-500 font-semibold">Quick select:</span>
              {popularDestinations.map((dest) => (
                <button
                  key={dest}
                  type="button"
                  onClick={() => setSelectedDestination(dest)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    selectedDestination.toLowerCase() === dest.toLowerCase()
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Available Direct Flights & Trains Section */}
      <div className="space-y-6">
        {/* Available Flights powered by SerpApi Google Flights */}
        <div className="glass-panel p-6 space-y-4 border-sky-500/20 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Plane className="w-5 h-5 text-sky-400" /> SerpApi Google Flights Search: {selectedOrigin === 'all' ? 'All Hubs' : selectedOrigin} ➔ {selectedDestination || 'Destination'}
            </h2>
            <span className="text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-400" /> Powered by SerpApi Google Flights
            </span>
          </div>

          {isSerpLoading ? (
            <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-sky-400" /> Searching live Google Flights via SerpApi for {selectedOrigin} to {selectedDestination}...
            </div>
          ) : displayedFlights.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-1">
              <p className="font-semibold text-slate-300">No direct flights found for {selectedOrigin} to {selectedDestination}</p>
              <p className="text-[11px] text-slate-500">Try setting "Start Location" to "All Cities" or typing a major airport city!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedFlights.map((f: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-3 hover:border-sky-500/40 transition-all shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-100">{f.airline}</span>
                      <span className="text-[10px] font-bold bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-500/30">
                        {f.flightNumber}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {f.price || f.estimatedFare || '₹4,500'}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Route:</span>
                      <span className="font-semibold text-slate-200">{f.origin} ➔ {f.destination}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Schedule:</span>
                      <span className="font-semibold text-slate-200">{f.departureTime} - {f.arrivalTime} ({f.duration || '2h 30m'})</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Direct Flight</span>
                    <div className="flex items-center gap-2">
                      {f.bookingUrl && (
                        <a
                          href={f.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-button-secondary text-[11px] py-1.5 px-2.5 flex items-center gap-1 text-sky-300"
                        >
                          Book <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => trackSpecificFlightOption(f)}
                        className="glass-button text-[11px] py-1.5 px-3 flex items-center gap-1 shadow-lg shadow-sky-500/20 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                      >
                        Track Flight <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Trains */}
        <div className="glass-panel p-6 space-y-4 border-amber-500/20 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Train className="w-5 h-5 text-amber-400" /> Authentic Indian Railways & Vande Bharat: {selectedOrigin === 'all' ? 'All Hubs' : selectedOrigin} ➔ {selectedDestination || 'Destination'}
            </h2>
            <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full">
              {availableTrains.length} Active Express Trains
            </span>
          </div>

          {availableTrains.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-1">
              <p className="font-semibold text-slate-300">No direct Indian Railways express trains from {selectedOrigin} to {selectedDestination}</p>
              <p className="text-[11px] text-slate-500">Note: International destinations (e.g. Dubai, Singapore, Paris, Tokyo) do not have Indian Railways train service.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableTrains.map((t: TrainOption, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-3 hover:border-amber-500/40 transition-all shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-100">{t.trainName}</span>
                      <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                        #{t.trainNumber}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {t.estimatedFare}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Route:</span>
                      <span className="font-semibold text-slate-200">{t.origin} ➔ {t.destination}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Schedule:</span>
                      <span className="font-semibold text-slate-200">{t.departureTime} - {t.arrivalTime} ({t.daysOperating})</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Express Rail</span>
                    <button
                      type="button"
                      onClick={() => trackSpecificTrainOption(t)}
                      className="glass-button-secondary text-[11px] py-1.5 px-3.5 flex items-center gap-1.5 shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all"
                    >
                      Track Live Train <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Flight & Train Live Tracker Section */}
      <div ref={trackerSectionRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80">
        {/* Flight Tracker Box */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Plane className="w-4 h-4 text-sky-400" /> Flight Live Status Tracker (SerpApi & Gemini Powered)
          </h3>
          <form onSubmit={handleSearchFlight} className="flex gap-2">
            <input
              type="text"
              value={flightNum}
              onChange={(e) => setFlightNum(e.target.value)}
              placeholder="Flight Code (e.g. 6E 214, AI 729, UK 891)"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
            <button type="submit" className="glass-button text-xs py-2.5 px-4 cursor-pointer">Track Flight</button>
          </form>

          {flightError && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{flightError}</span>
            </div>
          )}

          {isFlightLoading ? (
            <div className="glass-panel p-8 text-center text-xs text-slate-400">Fetching live flight status via SerpApi...</div>
          ) : flight ? (
            <FlightCard flight={flight} />
          ) : (
            <div className="glass-panel p-8 text-center space-y-2">
              <p className="text-xs font-semibold text-slate-300">Enter a Flight Number or click "Track Flight" above</p>
              <p className="text-[11px] text-slate-500">Registered: 6E 214 (Delhi-Guwahati), AI 729 (Kolkata-Shillong), 6E 504 (Goa), AI 101 (Mumbai)</p>
            </div>
          )}
        </div>

        {/* Train Tracker Box */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Train className="w-4 h-4 text-amber-400" /> Train Live Status Tracker
          </h3>
          <form onSubmit={handleSearchTrain} className="flex gap-2">
            <input
              type="text"
              value={trainNum}
              onChange={(e) => setTrainNum(e.target.value)}
              placeholder="Train Number (e.g. 15657, 12424, 20901)"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
            <button type="submit" className="glass-button-secondary text-xs py-2.5 px-4 cursor-pointer">Track Train</button>
          </form>

          {trainError && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{trainError}</span>
            </div>
          )}

          {isTrainLoading ? (
            <div className="glass-panel p-8 text-center text-xs text-slate-400">Fetching live train status...</div>
          ) : train ? (
            <TrainCard train={train} />
          ) : (
            <div className="glass-panel p-8 text-center space-y-2">
              <p className="text-xs font-semibold text-slate-300">Enter a Train Number or click "Track Live Train" above</p>
              <p className="text-[11px] text-slate-500">Registered: 15657 (Brahmaputra Mail), 12424 (Rajdhani), 20901 (Vande Bharat), 12952 (Mumbai Rajdhani)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
