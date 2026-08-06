import React from 'react';
import { Sun, CloudRain } from 'lucide-react';

export const ForecastCard: React.FC<{ forecast?: any[] }> = ({ forecast }) => {
  const days = forecast || [
    { day: 'Mon', tempMax: 30, tempMin: 24, condition: 'Sunny' },
    { day: 'Tue', tempMax: 31, tempMin: 25, condition: 'Clear' },
    { day: 'Wed', tempMax: 29, tempMin: 23, condition: 'Partly Cloudy' },
    { day: 'Thu', tempMax: 28, tempMin: 24, condition: 'Scattered Showers' }
  ];

  return (
    <div className="glass-panel p-5 space-y-3">
      <h4 className="font-bold text-slate-100 text-xs uppercase tracking-wider text-slate-400">
        4-Day Climate Forecast
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {days.map((d, i) => (
          <div key={i} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-center space-y-1">
            <span className="text-xs font-bold text-slate-300 block">{d.day}</span>
            <Sun className="w-5 h-5 text-amber-400 mx-auto my-1" />
            <span className="text-xs font-bold text-slate-100 block">{d.tempMax}° / {d.tempMin}°</span>
            <span className="text-[10px] text-slate-400">{d.condition}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
