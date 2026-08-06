import React from 'react';
import { Plane, Clock, CheckCircle2 } from 'lucide-react';
import { FlightStatus } from '../../types';

export const FlightCard: React.FC<{ flight: FlightStatus }> = ({ flight }) => {
  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm">{flight.airline} ({flight.flightNumber})</h4>
            <span className="text-xs text-slate-400">Live Status Tracker</span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" /> {flight.status}
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

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center text-xs">
        <div>
          <span className="text-slate-500 text-[10px] block font-bold uppercase">Terminal</span>
          <span className="font-bold text-slate-100">{flight.terminal || 'T3'}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block font-bold uppercase">Gate</span>
          <span className="font-bold text-sky-400">{flight.gate || '14B'}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block font-bold uppercase">Delay</span>
          <span className="font-bold text-emerald-400">{flight.delayMinutes} mins</span>
        </div>
      </div>
    </div>
  );
};
