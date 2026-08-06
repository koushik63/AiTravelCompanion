import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return <div className={`bg-slate-800/80 animate-pulse rounded-xl ${className}`} />;
};
