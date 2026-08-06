import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto my-16 p-8 glass-panel text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/20">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-bold text-slate-100">403 - Access Denied</h2>
      <p className="text-xs text-slate-400">
        You do not have administrative permissions to view this section.
      </p>
      <div className="pt-4 border-t border-slate-800">
        <Link to="/dashboard" className="glass-button text-xs py-2.5 px-6 inline-flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
      </div>
    </div>
  );
};
