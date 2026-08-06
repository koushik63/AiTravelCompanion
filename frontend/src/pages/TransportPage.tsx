import React, { useState } from 'react';
import { Compass, Search, Plane, Train, ArrowRight, CheckCircle2, Clock, MapPin, AlertCircle } from 'lucide-react';
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

  const [selectedDestination, setSelectedDestination] = useState<string>(
    activeTrip?.destination || (trips[0]?.destination || 'Meghalaya')
  );

  const [flightNum, setFlightNum] = useState('');
  const [trainNum, setTrainNum] = useState('');
  const [flight, setFlight] = useState<FlightStatus | null>(null);
  const [train, setTrain] = useState<TrainStatus | null>(null);
  const [isFlightLoading, setIsFlightLoading] = useState(false);
  const [isTrainLoading, setIsTrainLoading] = useState(false);
  const [flightError, setFlightError] = useState<string | null>(null);
  const [trainError, setTrainError] = useState<string | null>(null);

  const availableFlights = getAvailableFlightsForDestination(selectedDestination);
  const availableTrains = getAvailableTrainsForDestination(selectedDestination);

  const trackSpecificFlight = (code: string) => {
    setFlightNum(code);
    setFlightError(null);
    setIsFlightLoading(true);
    TransportService.getFlightStatus(code)
      .then((res) => {
        if ((res as any).error) {
          setFlight({ flightNumber: code, status: 'FLIGHT NOT FOUND', error: (res as any).error } as any);
        } else {
          setFlight(res);
        }
      })
      .catch((err) => {
        setFlight({ flightNumber: code, status: 'FLIGHT NOT FOUND', error: err.message } as any);
      })
      .finally(() => setIsFlightLoading(false));
  };

  const trackSpecificTrain = (num: string) => {
    setTrainNum(num);
    setTrainError(null);
    setIsTrainLoading(true);
    TransportService.getTrainStatus(num)
      .then((res) => {
        if ((res as any).error) {
          setTrain({ trainNumber: num, status: 'TRAIN NOT FOUND', error: (res as any).error } as any);
        } else {
          setTrain(res);
        }
      })
      .catch((err) => {
        setTrain({ trainNumber: num, status: 'TRAIN NOT FOUND', error: err.message } as any);
      })
      .finally(() => setIsTrainLoading(false));
  };

  const handleSearchFlight = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!flightNum.trim()) return;
    trackSpecificFlight(flightNum.trim());
  };

  const handleSearchTrain = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trainNum.trim()) return;
    trackSpecificTrain(trainNum.trim());
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Compass className="w-6 h-6 text-sky-400" /> Air & Rail Transport Hub
          </h1>
          <p className="text-xs text-slate-400">Search authentic flights & trains to your destination with live flight gate & platform tracking</p>
        </div>

        {/* Destination Filter Pill */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
          <MapPin className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold text-slate-300">Destination:</span>
          <select
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="bg-slate-950 text-xs font-bold text-sky-400 focus:outline-none cursor-pointer"
          >
            <option value="Meghalaya">Meghalaya / Shillong (GAU/SHL)</option>
            <option value="Goa">Goa (GOI/GOX)</option>
            <option value="Mumbai">Mumbai (BOM/MMCT)</option>
            <option value="Delhi">Delhi (DEL/NDLS)</option>
            <option value="Kerala">Kerala / Kochi (COK/TVC)</option>
            <option value="Jaipur">Jaipur (JAI/JP)</option>
            <option value="Singapore">Singapore (SIN)</option>
            <option value="Dubai">Dubai (DXB)</option>
            <option value="Paris">Paris (CDG)</option>
            <option value="Tokyo">Tokyo (HND/NRT)</option>
            <option value="Bali">Bali (DPS)</option>
          </select>
        </div>
      </div>

      {/* Available Direct Flights & Trains Section */}
      <div className="space-y-6">
        {/* Available Flights */}
        <div className="glass-panel p-6 space-y-4 border-sky-500/20">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Plane className="w-5 h-5 text-sky-400" /> Authentic Available Flights to {selectedDestination}
            </h2>
            <span className="text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-1 rounded-full">
              {availableFlights.length} Direct Routes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableFlights.map((f: FlightOption, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-3 hover:border-sky-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-100">{f.airline}</span>
                    <span className="text-[10px] font-bold bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-500/30">
                      {f.flightNumber}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {f.estimatedFare}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Route:</span>
                    <span className="font-semibold text-slate-200">{f.origin} ➔ {f.destination}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Schedule:</span>
                    <span className="font-semibold text-slate-200">{f.departureTime} - {f.arrivalTime} ({f.daysOperating})</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">{f.terminal} • {f.gate}</span>
                  <button
                    onClick={() => trackSpecificFlight(f.flightNumber)}
                    className="glass-button text-[11px] py-1 px-3 flex items-center gap-1"
                  >
                    Track Live Flight <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Trains */}
        <div className="glass-panel p-6 space-y-4 border-amber-500/20">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Train className="w-5 h-5 text-amber-400" /> Authentic Indian Railways & Vande Bharat to {selectedDestination}
            </h2>
            <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full">
              {availableTrains.length} Active Express Trains
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableTrains.map((t: TrainOption, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-3 hover:border-amber-500/40 transition-all">
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
                  <span className="text-[10px] text-slate-400">{t.platform} • {t.coach}</span>
                  <button
                    onClick={() => trackSpecificTrain(t.trainNumber)}
                    className="glass-button-secondary text-[11px] py-1 px-3 flex items-center gap-1"
                  >
                    Track Live Train <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flight & Train Live Tracker Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Flight Tracker Box */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Plane className="w-4 h-4 text-sky-400" /> Flight Live Status Tracker
          </h3>
          <form onSubmit={handleSearchFlight} className="flex gap-2">
            <input
              type="text"
              value={flightNum}
              onChange={(e) => setFlightNum(e.target.value)}
              placeholder="Flight Code (e.g. 6E 214, AI 729, UK 891)"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
            <button type="submit" className="glass-button text-xs py-2 px-4">Track Flight</button>
          </form>

          {flightError && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{flightError}</span>
            </div>
          )}

          {isFlightLoading ? (
            <div className="glass-panel p-8 text-center text-xs text-slate-400">Fetching live flight status...</div>
          ) : flight ? (
            <FlightCard flight={flight} />
          ) : (
            <div className="glass-panel p-8 text-center space-y-2">
              <p className="text-xs font-semibold text-slate-300">Enter a Flight Number or click "Track Live Flight" above</p>
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
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
            <button type="submit" className="glass-button-secondary text-xs py-2 px-4">Track Train</button>
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
