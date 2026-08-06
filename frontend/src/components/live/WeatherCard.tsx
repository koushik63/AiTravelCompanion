import React, { useState } from 'react';
import { Sun, CloudRain, Wind, Droplets, Clock, TrendingUp, Calendar, Compass, Sparkles } from 'lucide-react';
import { WeatherInfo } from '../../types';

export const WeatherCard: React.FC<{ weather: WeatherInfo }> = ({ weather }) => {
  const [activeTab, setActiveTab] = useState<'hourly' | 'daily'>('hourly');
  const [selectedHourIndex, setSelectedHourIndex] = useState<number | null>(null);

  const hourly = weather.hourlyForecast || [
    { time: '06:00 AM', temp: Math.max(18, weather.temp - 5), condition: 'Sunrise 🌅', pop: 5 },
    { time: '09:00 AM', temp: weather.temp - 2, condition: 'Sunny ☀️', pop: 10 },
    { time: '12:00 PM', temp: weather.temp + 3, condition: 'Warm 🌤️', pop: 15 },
    { time: '03:00 PM', temp: weather.temp + 2, condition: 'Breeze ⛅', pop: 20 },
    { time: '06:00 PM', temp: weather.temp - 1, condition: 'Sunset 🌇', pop: 10 },
    { time: '09:00 PM', temp: Math.max(20, weather.temp - 4), condition: 'Night 🌙', pop: 5 }
  ];

  const daily = weather.dailyForecast || [
    { day: 'Today', tempMax: weather.temp + 3, tempMin: weather.temp - 5, condition: 'Sunny ☀️', pop: 10 },
    { day: 'Tomorrow', tempMax: weather.temp + 2, tempMin: weather.temp - 4, condition: 'Partly Cloudy ⛅', pop: 20 },
    { day: 'Day 3', tempMax: weather.temp + 4, tempMin: weather.temp - 3, condition: 'Clear Sky 🌤️', pop: 5 },
    { day: 'Day 4', tempMax: weather.temp + 1, tempMin: weather.temp - 5, condition: 'Scattered Showers 🌦️', pop: 40 },
    { day: 'Day 5', tempMax: weather.temp + 2, tempMin: weather.temp - 4, condition: 'Breezy 💨', pop: 15 }
  ];

  return (
    <div className="glass-panel p-5 sm:p-6 space-y-4 relative overflow-hidden border-sky-500/30 h-full flex flex-col justify-between">
      <div className="space-y-4">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                Live Climate Radar
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Updated Live
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-100 mt-1 capitalize">{weather.city} Weather</h3>
            <p className="text-xs text-slate-400 capitalize">{weather.description}</p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="text-right">
              <span className="text-2xl font-black text-slate-100 block">{weather.temp}°C</span>
              <span className="text-[10px] text-slate-400 block">Feels {weather.feelsLike}°C</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Sun className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Humidity</span>
              <span className="font-bold text-slate-200">{weather.humidity}%</span>
            </div>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2">
            <Wind className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Wind Speed</span>
              <span className="font-bold text-slate-200">{weather.windSpeed} km/h</span>
            </div>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">UV Index</span>
              <span className="font-bold text-amber-300">Level {weather.uvIndex || 7} (High)</span>
            </div>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Rain Chance</span>
              <span className="font-bold text-cyan-300">{weather.rainProbability || 15}%</span>
            </div>
          </div>
        </div>

        {/* Weather Progression Indicator Header & Tabs */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Weather Progression
            </h4>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('hourly')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  activeTab === 'hourly' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3 h-3 inline mr-1" /> 24-Hour
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('daily')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  activeTab === 'daily' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calendar className="w-3 h-3 inline mr-1" /> 5-Day
              </button>
            </div>
          </div>

          {/* 24-Hour Timeline Progression Indicator - Clean 3 Columns Grid for Sidebar */}
          {activeTab === 'hourly' && (
            <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800/80 space-y-2">
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                Hourly forecast checkpoints:
              </p>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {hourly.map((h, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedHourIndex(idx)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer text-center space-y-1 ${
                      selectedHourIndex === idx
                        ? 'bg-sky-500/20 border-sky-400 shadow-md shadow-sky-500/20'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 font-bold block">{h.time}</span>
                    <span className="text-xs font-black text-slate-100 block">{h.temp}°C</span>
                    <span className="text-[10px] text-sky-300 font-medium block truncate">{h.condition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5-Day Trend Indicator */}
          {activeTab === 'daily' && (
            <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
              {daily.map((d, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 text-xs">
                  <span className="font-bold text-slate-200 text-[11px] w-20">{d.day}</span>
                  <span className="text-slate-400 text-[10px] flex-1 text-center font-medium truncate px-1">{d.condition}</span>
                  <span className="text-[10px] font-bold text-slate-100 w-16 text-right">{d.tempMin}° - {d.tempMax}°C</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Travel Advisory Callout */}
      <div className="mt-3 p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-start gap-2 text-xs text-sky-200">
        <Compass className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-sky-300 block text-[11px]">Smart Travel Timing Recommendation</span>
          <p className="text-[10px] text-slate-300 leading-relaxed mt-0.5">
            {weather.advisory || 'Optimal outdoor sightseeing: 07:00 AM - 10:30 AM & 04:30 PM - 07:30 PM.'}
          </p>
        </div>
      </div>
    </div>
  );
};
