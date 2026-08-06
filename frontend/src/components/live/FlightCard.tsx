import React from 'react';
import { Plane, CheckCircle2, AlertCircle } from 'lucide-react';
import { FlightStatus } from '../../types';

export const FlightCard: React.FC<{ flight: FlightStatus }> = ({ flight }) => {
  const isInvalid = (flight as any).error || flight.status === 'FLIGHT NOT FOUND' || flight.origin === 'N/A';

  if (isInvalid) {
    return (
      <div className="glass-panel p-6 space-y-3 border-rose-500/30 bg-rose-500/5">
        <div className="flex items-center gap-2 text-rose-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <h4 className="font-bold text-sm">Flight "{flight.flightNumber}" Not Found</h4>
        </div>
        <p className="text-xs text-rose-300 leading-relaxed">
          {(flight as any).error || `Flight code "${flight.flightNumber}" is not registered in live airline tracking databases. Please select an available flight from the directory below.`}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 space-y-4 border-sky-500/30">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm">{flight.airline} ({flight.flightNumber})</h4>
            <span className="text-xs text-slate-400">SerpApi & Gemini Live Tracker</span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" /> {flight.status || 'On Time'}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Origin</span>
          <span className="font-bold text-slate-200">{flight.origin}</span>
        </div>
        <div className="text-center px-4">
          <span className="text-[10px] text-slate-400 block font-semibold">Non-stop</span>
          <Plane className="w-4 h-4 text-sky-400 mx-auto my-0.5 rotate-90" />
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Destination</span>
          <span className="font-bold text-slate-200">{flight.destination}</span>
        </div>
      </div>
    </div>
  );
};
