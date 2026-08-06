import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          error: <AlertCircle className="w-4 h-4 text-rose-400" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          info: <Info className="w-4 h-4 text-sky-400" />
        };

        return (
          <div
            key={toast.id}
            className="p-3 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex items-center justify-between text-xs text-slate-200 animate-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex items-center gap-2.5">
              {icons[toast.type]}
              <span>{toast.message}</span>
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
