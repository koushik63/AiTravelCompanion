import React from 'react';
import { Clock, MapPin, DollarSign, CheckCircle2 } from 'lucide-react';
import { Activity } from '../../types';
import { formatCurrency } from '../../utils/currencyHelper';

export const ActivityCard: React.FC<{ activity: Activity; onToggle?: () => void }> = ({ activity, onToggle }) => {
  return (
    <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-2 hover:border-sky-500/40 transition-colors">
      <div className="flex items-center justify-between text-xs">
        <span className="text-sky-400 font-semibold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> {activity.time}
        </span>
        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
          {activity.category}
        </span>
      </div>

      <h4 className="font-bold text-slate-100 text-xs">{activity.title}</h4>

      {activity.description && <p className="text-[11px] text-slate-400 leading-relaxed">{activity.description}</p>}

      <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
        <span className="text-slate-400 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-500" /> {activity.location || 'Local Landmark'}
        </span>
        <span className="font-bold text-emerald-400">{formatCurrency(activity.cost, 'INR')}</span>
      </div>
    </div>
  );
};
