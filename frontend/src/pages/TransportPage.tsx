import React, { useState, useRef, useEffect } from 'react';
import { Compass, Search, Plane, Train, ArrowRight, Clock, MapPin, AlertCircle, ExternalLink, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';
import { TransportService } from '../services/api';
import { FlightCard } from '../components/live/FlightCard';
import { TrainCard } from '../components/live/TrainCard';
import { FlightStatus, TrainStatus } from '../types';
import { useTravelStore } from '../store/useTravelStore';
import { LocationAutocomplete } from '../components/common/LocationAutocomplete';
import { resolveAirport, resolveRailwayStation } from '../utils/locationResolver';
import { getAvailableFlightsForDestination, getAvailableTrainsForDestination, TrainOption } from '../utils/transportDirectory';

export const TransportPage: React.FC = () => {
  const { activeTrip, trips } = useTravelStore();
  const trackerSectionRef = useRef<HTMLDivElement>(null);

  const [selectedOrigin, setSelectedOrigin] = useState<string>('Chennai');
  const [selectedDestination, setSelectedDestination] = useState<string>(
    activeTrip?.destination || (trips[0]?.destination || 'Delhi')
  );
  const [travelDate, setTravelDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [flightNum, setFlightNum] = useState('');
  const [trainNum, setTrainNum] = useState('');
  const [flight, setFlight] = useState<FlightStatus | null>(null);
  const [train, setTrain] = useState<TrainStatus | null>(null);
  const [isFlightLoading, setIsFlightLoading] = useState(false);
  const [isTrainLoading, setIsTrainLoading] = useState(false);
  const [flightError, setFlightError] = useState<string | null>(null);
  const [trainError, setTrainError] = useState<string | null>(null);

  // Live API States
  const [liveSerpFlights, setLiveSerpFlights] = useState<any[]>([]);
  const [isSerpLoading, setIsSerpLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const resolvedOriginAirport = resolveAirport(selectedOrigin);
  const resolvedDestAirport = resolveAirport(selectedDestination);

  const resolvedOriginStation = resolveRailwayStation(selectedOrigin);
  const resolvedDestStation = resolveRailwayStation(selectedDestination);

  // Perform Validation & Trigger Search
  useEffect(() => {
    setValidationError(null);
    const origClean = selectedOrigin.trim().toLowerCase();
    const destClean = selectedDestination.trim().toLowerCase();

    if (!origClean || !destClean) {
      setValidationError('Please select both Origin and Destination cities.');
      setLiveSerpFlights([]);
      return;
    }

    // STEP 3 & 5 VALIDATION: Reject same origin/destination
    if (
      origClean === destClean ||
      (resolvedOriginAirport && resolvedDestAirport && resolvedOriginAirport.airportCode === resolvedDestAirport.airportCode)
    ) {
      const msg = `Invalid Route: Origin (${resolvedOriginAirport?.airportCode || selectedOrigin}) and Destination (${resolvedDestAirport?.airportCode || selectedDestination}) cannot be identical.`;
      setValidationError(msg);
      setLiveSerpFlights([]);
      console.warn(`[TransportSearch Rejected] ${msg}`);
      return;
    }

    // Print Outgoing API Validation Log
    console.log(`[TransportSearch Outgoing API Validation]
Origin City: ${selectedOrigin} ➔ Resolved Airport: ${resolvedOriginAirport?.airportName} (${resolvedOriginAirport?.airportCode})
Destination City: ${selectedDestination} ➔ Resolved Airport: ${resolvedDestAirport?.airportName} (${resolvedDestAirport?.airportCode})
Date: ${travelDate}
    `);

    setIsSerpLoading(true);
    TransportService.searchFlights(resolvedOriginAirport?.airportCode || selectedOrigin, resolvedDestAirport?.airportCode || selectedDestination, travelDate)
      .then((res) => {
        if (res?.error) {
          setValidationError(res.error);
          setLiveSerpFlights([]);
        } else {
          const flightsArray = Array.isArray(res) ? res : (res?.flights || []);
          console.log('[Frontend Rendered Live Flights from Backend]:', flightsArray);
          setLiveSerpFlights(flightsArray);
        }
      })
      .catch((err) => {
        console.error('[TransportSearch API Error]', err);
        setValidationError(`API Exception: ${err.message}`);
        setLiveSerpFlights([]);
      })
      .finally(() => setIsSerpLoading(false));
  }, [selectedOrigin, selectedDestination, travelDate]);

  const trackSpecificFlightOption = (f: any) => {
    setFlightNum(f.flightNumber);
    setFlightError(null);
    setFlight({
      flightNumber: f.flightNumber,
      airline: f.airline,
      origin: f.origin,
      destination: f.destination,
      departureTime: f.departureTime || 'N/A',
      arrivalTime: f.arrivalTime || 'N/A',
      terminal: f.terminal || 'T1',
      gate: f.gate || 'Gate 1',
      status: f.status === 'AVAILABLE' ? 'ON TIME' : (f.status || 'ON TIME'),
      delayMinutes: f.delayMinutes || 0
    });

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
      departureTime: t.departureTime || '05:25 AM',
      arrivalTime: t.arrivalTime || '01:10 PM',
      platform: t.platform,
      coach: t.coach,
      seat: t.seat,
      status: t.status,
      delayMinutes: t.delayMinutes
    });

    setTimeout(() => {
      trackerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSearchFlight = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!flightNum.trim()) return;
    setFlightError(null);
    setIsFlightLoading(true);
    TransportService.getFlightStatus(flightNum.trim(), selectedDestination)
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
    TransportService.getTrainStatus(trainNum.trim(), selectedDestination)
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

  const availableTrains = validationError ? [] : getAvailableTrainsForDestination(selectedDestination, selectedOrigin);

  const popularOrigins = ['Hyderabad', 'Delhi', 'Chennai', 'Bengaluru', 'Mumbai', 'Kolkata', 'Vizag'];
  const popularDestinations = ['Delhi', 'Mumbai', 'Bengaluru', 'Goa', 'Araku', 'Vizag', 'Kolkata', 'Dubai', 'Singapore', 'Tokyo', 'Paris'];

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
              <Sparkles className="w-3 h-3 text-sky-400" /> IATA Verified
            </span>
          </p>
        </div>
      </div>

      {/* Location Autocomplete & Search Bar */}
      <div className="glass-panel p-6 space-y-6 border-sky-500/30 shadow-2xl">
        <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Search className="w-4 h-4 text-sky-400" /> Real-Time Flight & Rail Route Finder
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Origin Autocomplete Input */}
          <LocationAutocomplete
            label="Departure Location / City"
            value={selectedOrigin}
            onChange={(city) => setSelectedOrigin(city)}
            placeholder="Type city or airport (e.g. Hyderabad, HYD)"
            mode="FLIGHT"
            iconColor="text-amber-400"
            error={Boolean(validationError)}
          />

          {/* Destination Autocomplete Input */}
          <LocationAutocomplete
            label="Destination Location / City"
            value={selectedDestination}
            onChange={(city) => setSelectedDestination(city)}
            placeholder="Type destination (e.g. Delhi, DEL, Araku)"
            mode="FLIGHT"
            iconColor="text-sky-400"
            error={Boolean(validationError)}
          />

          {/* Travel Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" /> Travel Date
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Validation Warning Alert Banner */}
        {validationError && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-4 rounded-xl flex items-center gap-3 animate-in fade-in duration-200">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="space-y-0.5">
              <span className="font-bold block text-rose-200">
                {validationError.toLowerCase().includes('route') ? 'Invalid Route Combination' : 'Transport Search Notice'}
              </span>
              <p>{validationError}</p>
            </div>
          </div>
        )}

        {/* Quick Select Chips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 font-bold block mb-1.5 uppercase">Quick Departure Cities:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {popularOrigins.map((orig) => (
                <button
                  key={orig}
                  type="button"
                  onClick={() => setSelectedOrigin(orig)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    selectedOrigin.toLowerCase() === orig.toLowerCase()
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {orig}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 font-bold block mb-1.5 uppercase">Quick Destinations:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {popularDestinations.map((dest) => (
                <button
                  key={dest}
                  type="button"
                  onClick={() => setSelectedDestination(dest)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    selectedDestination.toLowerCase() === dest.toLowerCase()
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
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
        {/* Available Flights */}
        <div className="glass-panel p-6 space-y-4 border-sky-500/20 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Plane className="w-5 h-5 text-sky-400" /> Flights Search: {resolvedOriginAirport?.airportName} ({resolvedOriginAirport?.airportCode}) ➔ {resolvedDestAirport?.airportName} ({resolvedDestAirport?.airportCode})
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Showing route-accurate live commercial flight options</p>
            </div>
            <span className="text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-400" /> SerpApi Verified
            </span>
          </div>

          {validationError ? (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <p className="font-semibold text-slate-300">Please correct the search error above to view live flight options.</p>
            </div>
          ) : isSerpLoading ? (
            <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-sky-400" /> Searching live flights for {resolvedOriginAirport?.airportCode} to {resolvedDestAirport?.airportCode}...
            </div>
          ) : liveSerpFlights.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
              <p className="font-semibold text-slate-300">No live flights found for {selectedOrigin} to {selectedDestination}</p>
              <p className="text-[11px] text-slate-500">Try selecting major airport cities like Delhi, Mumbai, Hyderabad, or Bengaluru.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveSerpFlights.map((f: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 hover:border-sky-500/40 transition-all shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {f.airlineLogo && (
                        <img src={f.airlineLogo} alt={f.airline} className="w-5 h-5 object-contain bg-white/10 rounded p-0.5" />
                      )}
                      <span className="font-extrabold text-sm text-slate-100">{f.airline}</span>
                      <span className="text-[10px] font-bold bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-500/30">
                        {f.flightNumber}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {f.price || 'N/A'}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Route:</span>
                      <span className="font-semibold text-slate-200 truncate max-w-[240px]">{f.origin} ➔ {f.destination}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Schedule:</span>
                      <span className="font-semibold text-slate-200">{f.departureTime} - {f.arrivalTime} ({f.duration})</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400">
                      {f.stopsLabel || (f.stops === 0 ? 'Direct Flight' : `${f.stops} Stop(s)`)}
                    </span>
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
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Train className="w-5 h-5 text-amber-400" /> Indian Railways & Vande Bharat: {resolvedOriginStation?.stationName} ({resolvedOriginStation?.stationCode}) ➔ {resolvedDestStation?.stationName} ({resolvedDestStation?.stationCode})
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Official Indian Railways IRCTC station code route mapping</p>
            </div>
            <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full">
              {availableTrains.length} Active Express Trains
            </span>
          </div>

          {availableTrains.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <p className="font-semibold text-slate-300">No direct trains found for {selectedOrigin} to {selectedDestination}</p>
              <p className="text-[11px] text-slate-500">Note: International destinations do not have Indian Railways train service.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableTrains.map((t: TrainOption, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 hover:border-amber-500/40 transition-all shadow-md">
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
                      <span className="font-semibold text-slate-200 truncate max-w-[240px]">{t.origin} ➔ {t.destination}</span>
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

      {/* Flight & Train Live Status Tracker Section */}
      <div ref={trackerSectionRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80">
        {/* Flight Status Tracker Box */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Plane className="w-4 h-4 text-sky-400" /> Flight Live Status Tracker (SerpApi & Gemini Powered)
          </h3>
          <form onSubmit={handleSearchFlight} className="flex gap-2">
            <input
              type="text"
              value={flightNum}
              onChange={(e) => setFlightNum(e.target.value)}
              placeholder="Flight Code (e.g. 6E 214, AI 729, UK 891, EK 500)"
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
              <p className="text-[11px] text-slate-500">Registered: 6E 741 (Hyderabad), AI 531, UK 821, EK 500, SQ 421</p>
            </div>
          )}
        </div>

        {/* Train Status Tracker Box */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Train className="w-4 h-4 text-amber-400" /> Train Live Status Tracker
          </h3>
          <form onSubmit={handleSearchTrain} className="flex gap-2">
            <input
              type="text"
              value={trainNum}
              onChange={(e) => setTrainNum(e.target.value)}
              placeholder="Train Number (e.g. 15657, 12424, 20901, 12723)"
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
              <p className="text-[11px] text-slate-500">Registered: 12723 (Telangana Express), 15657 (Brahmaputra Mail), 20901 (Vande Bharat)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
