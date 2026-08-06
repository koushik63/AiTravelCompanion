import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-xs font-semibold text-slate-300 block">{label}</label>}
      <input
        className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors ${
          error ? 'border-rose-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-[11px] text-rose-400">{error}</p>}
    </div>
  );
};
