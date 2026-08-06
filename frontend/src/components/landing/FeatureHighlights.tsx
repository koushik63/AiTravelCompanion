import React from 'react';
import { Calendar, MapPin, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

export const FeatureHighlights: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 space-y-12 py-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-slate-100">End-to-End Travel Companion</h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Intelligent tools designed for every single phase of your travel lifecycle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel-hover p-6 space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">1. Before Travelling</h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              Structured JSON AI Itineraries
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              Climate-Adaptive Packing Lists
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              Budget Allocation & Expense Limits
            </li>
          </ul>
        </div>

        <div className="glass-panel-hover p-6 space-y-4 relative overflow-hidden border-sky-500/40">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">2. During Travelling</h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              Live Activity Timeline & Checklists
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              Live Weather-Adjusted Route Options
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              Nearby Food & Sightseeing Maps
            </li>
          </ul>
        </div>

        <div className="glass-panel-hover p-6 space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">3. After Travelling</h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              Photo Scrapbooks with AI Memory Tags
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              Financial Expense Analytics
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              Travel History & Visited Map
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
