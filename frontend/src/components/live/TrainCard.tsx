import React from 'react';
import { Compass, CheckCircle2 } from 'lucide-react';
import { TrainStatus } from '../../types';

export const TrainCard: React.FC<{ train: TrainStatus }> = ({ train }) => {
  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm">{train.trainName} ({train.trainNumber})</h4>
            <span className="text-xs text-slate-400">IRCTC / Vande Bharat Status</span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" /> Running
        </span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block">From</span>
          <span className="font-bold text-slate-200">{train.origin}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block text-right">To</span>
          <span className="font-bold text-slate-200">{train.destination}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center text-xs">
        <div>
          <span className="text-slate-500 text-[10px] block font-bold uppercase">Platform</span>
          <span className="font-bold text-amber-400">{train.platform || 'PF 3'}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block font-bold uppercase">Coach</span>
          <span className="font-bold text-slate-100">{train.coach || 'C4'}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block font-bold uppercase">Seat</span>
          <span className="font-bold text-sky-400">{train.seat || '72'}</span>
        </div>
      </div>
    </div>
  );
};
