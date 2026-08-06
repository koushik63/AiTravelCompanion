import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something Went Wrong',
  message = 'An unexpected error occurred while loading data.',
  onRetry
}) => {
  return (
    <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-center space-y-3 my-4">
      <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h4 className="font-bold text-rose-300 text-sm">{title}</h4>
      <p className="text-xs text-rose-200/80 max-w-sm mx-auto">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="glass-button-secondary text-xs py-2 px-4 inline-flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Try Again
        </button>
      )}
    </div>
  );
};
