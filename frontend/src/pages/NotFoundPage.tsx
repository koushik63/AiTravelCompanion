import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto my-16 p-8 glass-panel text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 mx-auto flex items-center justify-center border border-sky-500/20">
        <Compass className="w-6 h-6 animate-spin" />
      </div>
      <h2 className="text-3xl font-extrabold text-slate-100">404</h2>
      <p className="text-sm font-semibold text-slate-200">Page Not Found</p>
      <p className="text-xs text-slate-400">
        The destination or page you are looking for does not exist or has been moved.
      </p>
      <div className="pt-4 border-t border-slate-800">
        <Link to="/" className="glass-button text-xs py-2.5 px-6 inline-flex items-center gap-1.5">
          <Home className="w-4 h-4" /> Return Home
        </Link>
      </div>
    </div>
  );
};
