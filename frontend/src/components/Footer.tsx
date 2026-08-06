import React from 'react';
import { Compass, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-sky-400" />
          <span className="font-semibold text-slate-200">WanderAI Travel Companion</span>
          <span>© 2026. Production Grade Hackathon MVP.</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1">
            <Globe className="w-4 h-4 text-sky-400" /> Global Coverage Active
          </span>
          <span>Open Source</span>
        </div>
      </div>
    </footer>
  );
};
