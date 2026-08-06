import React, { useState } from 'react';
import { Wind, Droplets, Sun, TrendingUp, Clock, Compass } from 'lucide-react';
import { WeatherInfo } from '../types';

interface WeatherProps {
  weather: WeatherInfo | null;
  isLoading?: boolean;
}

export const WeatherCard: React.FC<WeatherProps> = ({ weather, isLoading }) => {
  const [showProgression, setShowProgression] = useState<boolean>(true);

  if (isLoading) {
    return (
      <div className="glass-panel p-5 animate-pulse space-y-3">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-4 w-28 bg-slate-800 rounded"></div>
            <div className="h-8 w-16 bg-slate-800 rounded"></div>
          </div>
          <div className="w-12 h-12 bg-slate-800 rounded-full"></div>
        </div>
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

  const hourly = w.hourlyForecast || [
    { time: '06:00 AM', temp: Math.max(18, w.temp - 5), condition: 'Sunrise 🌅', pop: 5 },
    { time: '09:00 AM', temp: w.temp - 2, condition: 'Sunny ☀️', pop: 10 },
    { time: '12:00 PM', temp: w.temp + 3, condition: 'Warm 🌤️', pop: 15 },
    { time: '03:00 PM', temp: w.temp + 2, condition: 'Breeze ⛅', pop: 20 },
    { time: '06:00 PM', temp: w.temp - 1, condition: 'Sunset 🌇', pop: 10 },
    { time: '09:00 PM', temp: Math.max(20, w.temp - 4), condition: 'Night 🌙', pop: 5 }
  ];

  return (
    <div className="glass-panel p-5 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 space-y-4">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-amber-400" /> Live Weather Radar
          </span>
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

      {/* Basic Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Droplets className="w-4 h-4 text-sky-400" />
          <span>Humidity: {w.humidity}%</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Wind className="w-4 h-4 text-emerald-400" />
          <span>Wind: {w.windSpeed} m/s</span>
        </div>
      </div>

      {/* Weather Progression Indicator */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Weather Progression Indicator
          </span>
          <button
            type="button"
            onClick={() => setShowProgression(!showProgression)}
            className="text-[10px] text-sky-400 hover:underline cursor-pointer"
          >
            {showProgression ? 'Hide' : 'Show Timeline'}
          </button>
        </div>

        {showProgression && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1">
            {hourly.map((h, idx) => (
              <div key={idx} className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80 text-center space-y-1">
                <span className="text-[9px] text-slate-400 block font-medium">{h.time}</span>
                <span className="text-xs font-black text-slate-100 block">{h.temp}°C</span>
                <span className="text-[9px] text-sky-300 block truncate">{h.condition}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
