import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = true }) => {
  return (
    <div
      className={`bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl ${
        hoverEffect ? 'transition-all duration-300 hover:border-sky-500/40 hover:shadow-sky-500/10' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
