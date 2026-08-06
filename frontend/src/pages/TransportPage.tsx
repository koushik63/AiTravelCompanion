import React, { useState, useEffect } from 'react';
import { Compass, Search } from 'lucide-react';
import { TransportService } from '../services/api';
import { FlightCard } from '../components/live/FlightCard';
import { TrainCard } from '../components/live/TrainCard';
import { FlightStatus, TrainStatus } from '../types';

export const TransportPage: React.FC = () => {
  const [flightNum, setFlightNum] = useState('');
  const [trainNum, setTrainNum] = useState('');
  const [flight, setFlight] = useState<FlightStatus | null>(null);
  const [train, setTrain] = useState<TrainStatus | null>(null);
  const [isFlightLoading, setIsFlightLoading] = useState(false);
  const [isTrainLoading, setIsTrainLoading] = useState(false);

  const handleSearchFlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flightNum.trim()) return;
    setIsFlightLoading(true);
    TransportService.getFlightStatus(flightNum)
      .then(setFlight)
      .finally(() => setIsFlightLoading(false));
  };

  const handleSearchTrain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainNum.trim()) return;
    setIsTrainLoading(true);
    TransportService.getTrainStatus(trainNum)
      .then(setTrain)
      .finally(() => setIsTrainLoading(false));
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <Compass className="w-6 h-6 text-sky-400" /> Transport Hub (Air & Rail Tracker)
        </h1>
        <p className="text-xs text-slate-400">Track flight delays, terminal gates, Vande Bharat train status, and platform numbers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Flight Tracker Box */}
        <div className="space-y-4">
          <form onSubmit={handleSearchFlight} className="flex gap-2">
            <input
              type="text"
              value={flightNum}
              onChange={(e) => setFlightNum(e.target.value)}
              placeholder="Flight Number (e.g. 6E 504, JL 001)"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
            <button type="submit" className="glass-button text-xs py-2 px-4">Track Flight</button>
          </form>

          {isFlightLoading ? (
            <div className="glass-panel p-8 text-center text-xs text-slate-400">Fetching live flight status...</div>
          ) : flight ? (
            <FlightCard flight={flight} />
          ) : (
            <div className="glass-panel p-8 text-center space-y-2">
              <p className="text-xs font-semibold text-slate-300">Enter a Flight Number to track status</p>
              <p className="text-[11px] text-slate-500">e.g. 6E 504 (IndiGo), AI 101 (Air India), UK 815 (Vistara), EK 500 (Emirates)</p>
            </div>
          )}
        </div>

        {/* Train Tracker Box */}
        <div className="space-y-4">
          <form onSubmit={handleSearchTrain} className="flex gap-2">
            <input
              type="text"
              value={trainNum}
              onChange={(e) => setTrainNum(e.target.value)}
              placeholder="Train Number (e.g. 20901, 12951)"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
            <button type="submit" className="glass-button-secondary text-xs py-2 px-4">Track Train</button>
          </form>

          {isTrainLoading ? (
            <div className="glass-panel p-8 text-center text-xs text-slate-400">Fetching live train status...</div>
          ) : train ? (
            <TrainCard train={train} />
          ) : (
            <div className="glass-panel p-8 text-center space-y-2">
              <p className="text-xs font-semibold text-slate-300">Enter a Train Number to track status</p>
              <p className="text-[11px] text-slate-500">e.g. 20901 (Vande Bharat), 12951 (Rajdhani), 12002 (Shatabdi)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
