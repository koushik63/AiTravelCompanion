import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatisticCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'sky' | 'emerald' | 'amber' | 'indigo' | 'rose';
  actionButton?: React.ReactNode;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'sky',
  actionButton
}) => {
  const colors = {
    sky: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };

  return (
    <div className="glass-panel p-5 space-y-3 relative overflow-hidden transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400">{title}</span>
        <div className="flex items-center gap-2">
          {actionButton}
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${colors[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-100 tracking-tight">{value}</div>
        {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
};
