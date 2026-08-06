import React from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Items Found',
  description = 'There are currently no items to display.',
  action
}) => {
  return (
    <div className="glass-panel p-8 text-center space-y-3 my-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-800 text-sky-400 mx-auto flex items-center justify-center">
        <FolderOpen className="w-6 h-6" />
      </div>
      <h4 className="font-bold text-slate-200 text-base">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm mx-auto">{description}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
