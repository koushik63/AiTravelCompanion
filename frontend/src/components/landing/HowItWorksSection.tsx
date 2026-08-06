import React from 'react';
import { Sparkles, Navigation, CheckCircle, Smartphone } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Enter Preferences',
      desc: 'Specify your destination (e.g. Goa, Jaipur, Kerala), duration, budget, and interests.',
      icon: Sparkles
    },
    {
      num: '02',
      title: 'AI Generates Plan',
      desc: 'Gemini AI constructs a day-by-day structured itinerary, packing list, and budget limits.',
      icon: Navigation
    },
    {
      num: '03',
      title: 'Travel Live Mode',
      desc: 'Follow live timeline checkpoints, check weather advice, and track Vande Bharat / Flight status.',
      icon: Smartphone
    },
    {
      num: '04',
      title: 'Save & Cherish Memories',
      desc: 'Upload photos with AI captions, view expense pie charts, and export trip journals.',
      icon: CheckCircle
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-sky-400 uppercase tracking-wider bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
          How It Works
        </span>
        <h2 className="text-3xl font-bold text-slate-100">Simple 4-Step Journey Execution</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s, idx) => (
          <div key={idx} className="glass-panel p-6 space-y-4 relative">
            <span className="text-3xl font-extrabold text-sky-500/30 block">{s.num}</span>
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center">
              <s.icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">{s.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
