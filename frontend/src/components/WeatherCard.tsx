import React from 'react';
import { Wind, Droplets } from 'lucide-react';
import { WeatherInfo } from '../types';

interface WeatherProps {
  weather: WeatherInfo | null;
  isLoading?: boolean;
}

export const WeatherCard: React.FC<WeatherProps> = ({ weather, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass-panel p-5 animate-pulse flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-slate-800 rounded"></div>
          <div className="h-8 w-16 bg-slate-800 rounded"></div>
        </div>
        <div className="w-12 h-12 bg-slate-800 rounded-full"></div>
      </div>
    );
  }

  const w = weather || {
    city: 'Goa',
    temp: 29,
    feelsLike: 31,
    condition: 'Sunny',
    description: 'Pleasant coastal tropical sky',
    humidity: 68,
    windSpeed: 4.2
  };

  return (
    <div className="glass-panel p-5 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Live Weather</span>
          <h3 className="text-lg font-bold text-slate-100">{w.city}, India</h3>
          <p className="text-xs text-slate-400 capitalize">{w.description}</p>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-3xl font-extrabold text-slate-100">
            {w.temp}°C
          </div>
          <span className="text-[11px] text-slate-400">Feels like {w.feelsLike}°C</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Droplets className="w-4 h-4 text-sky-400" />
          <span>Humidity: {w.humidity}%</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Wind className="w-4 h-4 text-emerald-400" />
          <span>Wind: {w.windSpeed} m/s</span>
        </div>
      </div>
    </div>
  );
};
