import React from 'react';
import { PhoneCall, ShieldAlert, HeartPulse, Compass } from 'lucide-react';

export const EmergencyWidget: React.FC = () => {
  return (
    <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl space-y-4">
      <div className="flex items-center gap-2 text-rose-300">
        <ShieldAlert className="w-5 h-5 text-rose-400" />
        <h4 className="font-bold text-sm">Emergency Assistance Directory</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a
          href="tel:112"
          className="p-3 bg-slate-900/90 border border-rose-500/30 rounded-xl flex items-center justify-between text-xs hover:bg-rose-500/20 transition-colors group"
        >
          <div className="flex items-center gap-2 text-slate-200">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <div>
              <span className="font-bold block">Police</span>
              <span className="text-[10px] text-slate-400">Emergency 112</span>
            </div>
          </div>
          <PhoneCall className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
        </a>

        <a
          href="tel:108"
          className="p-3 bg-slate-900/90 border border-rose-500/30 rounded-xl flex items-center justify-between text-xs hover:bg-rose-500/20 transition-colors group"
        >
          <div className="flex items-center gap-2 text-slate-200">
            <HeartPulse className="w-4 h-4 text-rose-400" />
            <div>
              <span className="font-bold block">Ambulance</span>
              <span className="text-[10px] text-slate-400">Medical 108</span>
            </div>
          </div>
          <PhoneCall className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
        </a>

        <a
          href="tel:1363"
          className="p-3 bg-slate-900/90 border border-rose-500/30 rounded-xl flex items-center justify-between text-xs hover:bg-rose-500/20 transition-colors group"
        >
          <div className="flex items-center gap-2 text-slate-200">
            <Compass className="w-4 h-4 text-rose-400" />
            <div>
              <span className="font-bold block">Tourist Support</span>
              <span className="text-[10px] text-slate-400">Helpline 1363</span>
            </div>
          </div>
          <PhoneCall className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
        </a>
      </div>
    </div>
  );
};
