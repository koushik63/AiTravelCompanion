import React from 'react';
import { Calendar, Sun, Sunset, Moon } from 'lucide-react';
import { ActivityCard } from './ActivityCard';
import { formatCurrency } from '../../utils/currencyHelper';

interface DayCardProps {
  day: {
    dayNumber: number;
    date: string;
    summary: string;
    morning: any[];
    afternoon: any[];
    evening: any[];
    dailyEstimatedCost: number;
  };
}

export const DayCard: React.FC<DayCardProps> = ({ day }) => {
  return (
    <div className="glass-panel p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 font-extrabold text-sm flex items-center justify-center">
            D{day.dayNumber}
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">{day.summary}</h3>
            <span className="text-xs text-slate-400">{day.date}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Est. Daily Budget</span>
          <span className="font-bold text-emerald-400 text-sm">{formatCurrency(day.dailyEstimatedCost, 'INR')}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Morning */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sun className="w-4 h-4" /> Morning Schedule
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {day.morning.map((act, i) => (
              <ActivityCard key={i} activity={act} />
            ))}
          </div>
        </div>

        {/* Afternoon */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sun className="w-4 h-4" /> Afternoon Schedule
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {day.afternoon.map((act, i) => (
              <ActivityCard key={i} activity={act} />
            ))}
          </div>
        </div>

        {/* Evening */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Moon className="w-4 h-4" /> Evening Schedule
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {day.evening.map((act, i) => (
              <ActivityCard key={i} activity={act} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
