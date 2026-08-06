import React from 'react';
import { PieChart, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/currencyHelper';

interface CategoryBreakdown {
  category: string;
  spent: number;
  percentage: number;
}

export const AnalyticsCard: React.FC<{ breakdown: CategoryBreakdown[]; currency?: string }> = ({
  breakdown,
  currency = 'INR'
}) => {
  const categoryColors: { [key: string]: string } = {
    Accommodation: 'bg-indigo-500',
    Food: 'bg-amber-500',
    Shopping: 'bg-emerald-500',
    Transport: 'bg-sky-500',
    Entertainment: 'bg-purple-500',
    Medical: 'bg-rose-500',
    Activities: 'bg-teal-500',
    Miscellaneous: 'bg-slate-500'
  };

  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <PieChart className="w-4 h-4 text-sky-400" /> Spending Category Distribution
        </h3>
        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Analytics Active
        </span>
      </div>

      <div className="space-y-3">
        {breakdown.map((item, idx) => (
          <div key={idx} className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="font-semibold">{item.category}</span>
              <span className="font-bold text-slate-100">
                {formatCurrency(item.spent, currency)} ({item.percentage}%)
              </span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80">
              <div
                className={`h-full ${categoryColors[item.category] || 'bg-sky-500'} transition-all duration-500`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
