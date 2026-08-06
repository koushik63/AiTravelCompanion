import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const AIStatusIndicator: React.FC<{ isLive?: boolean }> = ({ isLive = true }) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/20 text-xs font-semibold text-sky-400">
      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
      <span>Gemini AI Engine v1.5</span>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
    </div>
  );
};
