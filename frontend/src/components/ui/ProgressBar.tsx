import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  sublabel?: string;
  color?: 'sky' | 'emerald' | 'amber' | 'indigo';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  sublabel,
  color = 'sky'
}) => {
  const gradients = {
    sky: 'from-sky-500 to-blue-600',
    emerald: 'from-emerald-400 to-teal-600',
    amber: 'from-amber-400 to-orange-500',
    indigo: 'from-indigo-500 to-purple-600'
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="space-y-1.5 w-full">
      {(label || sublabel) && (
        <div className="flex justify-between text-xs font-semibold">
          {label && <span className="text-slate-300">{label}</span>}
          {sublabel && <span className="text-slate-400">{sublabel}</span>}
        </div>
      )}
      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${gradients[color]} transition-all duration-500 rounded-full`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};
