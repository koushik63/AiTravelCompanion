import React from 'react';
import { Sun, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';
import { WeatherInfo } from '../../types';

export const WeatherCard: React.FC<{ weather: WeatherInfo }> = ({ weather }) => {
  return (
    <div className="glass-panel p-6 space-y-4 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
            Live Weather
          </span>
          <h3 className="text-xl font-bold text-slate-100 mt-1">{weather.city}</h3>
          <p className="text-xs text-slate-400">{weather.description}</p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
          <Sun className="w-7 h-7" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-extrabold text-slate-100">{weather.temp}°C</span>
        <span className="text-xs text-slate-400">Feels like {weather.feelsLike}°C</span>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Droplets className="w-3.5 h-3.5 text-sky-400" />
          <span>{weather.humidity}% Hum</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <Wind className="w-3.5 h-3.5 text-indigo-400" />
          <span>{weather.windSpeed} km/h</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>UV {weather.uvIndex || 7}</span>
        </div>
      </div>
    </div>
  );
};
