import React from 'react';
import { Compass, CheckCircle2, AlertCircle } from 'lucide-react';
import { TrainStatus } from '../../types';

export const TrainCard: React.FC<{ train: TrainStatus }> = ({ train }) => {
  const isInvalid = (train as any).error || train.status === 'TRAIN NOT FOUND' || train.origin === 'N/A';

  if (isInvalid) {
    return (
      <div className="glass-panel p-6 space-y-3 border-rose-500/30 bg-rose-500/5">
        <div className="flex items-center gap-2 text-rose-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <h4 className="font-bold text-sm">Train #{train.trainNumber} Not Found</h4>
        </div>
        <p className="text-xs text-rose-300 leading-relaxed">
          {(train as any).error || `Train number "${train.trainNumber}" is not registered in live IRCTC systems. Please select an available train from the directory below.`}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 space-y-4 border-amber-500/30">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm">{train.trainName} ({train.trainNumber})</h4>
            <span className="text-xs text-slate-400">IRCTC / Vande Bharat Live Tracker</span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" /> {train.status || 'Running'}
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
    </div>
  );
};
