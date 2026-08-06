import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { EmergencyWidget } from '../components/live/EmergencyWidget';

export const EmergencyPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-rose-400" /> Emergency Services & Support
        </h1>
        <p className="text-xs text-slate-400">Quick-dial emergency helplines, police stations, and medical support in India</p>
      </div>

      <EmergencyWidget />
    </div>
  );
};
