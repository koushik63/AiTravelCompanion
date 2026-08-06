import React from 'react';
import { Sparkles, MapPin, Compass, CheckCircle2 } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';

export const GenerationProgress: React.FC<{ progress: number; destination: string }> = ({ progress, destination }) => {
  const steps = [
    { label: 'Analyzing Destination Climate & Highlights', done: progress >= 25 },
    { label: 'Synthesizing Morning, Afternoon & Evening Plans', done: progress >= 50 },
    { label: 'Allocating Daily Costs & Restaurant Curations', done: progress >= 75 },
    { label: 'Finalizing Local Safety Tips & Packing Items', done: progress >= 95 }
  ];

  return (
    <div className="glass-panel p-8 max-w-xl mx-auto my-12 text-center space-y-6 animate-in fade-in duration-300">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 mx-auto flex items-center justify-center shadow-xl shadow-sky-500/30 animate-pulse">
        <Sparkles className="w-7 h-7 text-white" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-extrabold text-slate-100">Generating AI Itinerary for {destination}</h3>
        <p className="text-xs text-slate-400">Gemini AI is crafting your customized day-by-day journey</p>
      </div>

      <ProgressBar progress={progress} label="AI Processing Status" sublabel={`${progress}%`} color="sky" />

      <div className="space-y-2 text-left pt-2 border-t border-slate-800">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-3 text-xs">
            <CheckCircle2 className={`w-4 h-4 ${step.done ? 'text-emerald-400' : 'text-slate-700'}`} />
            <span className={step.done ? 'text-slate-200 font-semibold' : 'text-slate-500'}>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
