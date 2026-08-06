import React from 'react';
import { TripStatus } from '../../types';

export const StatusBadge: React.FC<{ status: TripStatus }> = ({ status }) => {
  const styles: Record<TripStatus, string> = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    UPCOMING: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    COMPLETED: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    CANCELLED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    ARCHIVED: 'bg-slate-800 text-slate-400 border-slate-700'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
};
