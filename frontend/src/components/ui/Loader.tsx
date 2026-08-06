import React from 'react';
import { Compass } from 'lucide-react';

export const Loader: React.FC<{ label?: string }> = ({ label = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center animate-spin">
        <Compass className="w-6 h-6 text-white" />
      </div>
      <span className="text-xs font-semibold text-slate-400">{label}</span>
    </div>
  );
};
