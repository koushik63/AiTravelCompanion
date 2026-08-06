import React, { useState, useEffect } from 'react';
import { Compass, Search } from 'lucide-react';
import { TransportService } from '../services/api';
import { FlightCard } from '../components/live/FlightCard';
import { TrainCard } from '../components/live/TrainCard';
import { FlightStatus, TrainStatus } from '../types';

export const TransportPage: React.FC = () => {
  const [flightNum, setFlightNum] = useState('6E 504');
  const [trainNum, setTrainNum] = useState('20901');
  const [flight, setFlight] = useState<FlightStatus | null>(null);
  const [train, setTrain] = useState<TrainStatus | null>(null);

  useEffect(() => {
    TransportService.getFlightStatus(flightNum).then(setFlight).catch(() => {});
    TransportService.getTrainStatus(trainNum).then(setTrain).catch(() => {});
  }, []);

  const handleSearchFlight = (e: React.FormEvent) => {
    e.preventDefault();
    TransportService.getFlightStatus(flightNum).then(setFlight);
  };

  const handleSearchTrain = (e: React.FormEvent) => {
    e.preventDefault();
    TransportService.getTrainStatus(trainNum).then(setTrain);
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

          {flight && <FlightCard flight={flight} />}
        </div>

        {/* Train Tracker Box */}
        <div className="space-y-4">
          <form onSubmit={handleSearchTrain} className="flex gap-2">
            <input
              type="text"
              value={trainNum}
              onChange={(e) => setTrainNum(e.target.value)}
              placeholder="Train Number (e.g. 20901 Vande Bharat)"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
            <button type="submit" className="glass-button-secondary text-xs py-2 px-4">Track Train</button>
          </form>

          {train && <TrainCard train={train} />}
        </div>
      </div>
    </div>
  );
};
