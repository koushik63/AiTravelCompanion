import React from 'react';
import { Download, FileText, FileCode, X } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export const ExportModal: React.FC<{ isOpen: boolean; onClose: () => void; tripId?: string }> = ({
  isOpen,
  onClose,
  tripId = 'trip_1'
}) => {
  const { addToast } = useUIStore();
  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    window.open(`http://localhost:5000/api/export/${tripId}/pdf`, '_blank');
    addToast({ type: 'success', message: 'Generating PDF Printable Document...' });
    onClose();
  };

  const handleDownloadJSON = () => {
    window.open(`http://localhost:5000/api/export/${tripId}/json`, '_blank');
    addToast({ type: 'success', message: 'Downloading JSON Data File...' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="glass-panel p-6 max-w-md w-full space-y-5 border-sky-500/40 relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-slate-100 text-base">Export Travel Companion Data</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Select your preferred export format for offline access, printing, or backup storage.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownloadPDF}
            className="p-4 bg-slate-950/90 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-center space-y-2 group transition-all"
          >
            <FileText className="w-8 h-8 text-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-slate-100 block">Printable PDF</span>
            <span className="text-[10px] text-slate-400 block">Complete Travel Brief</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="p-4 bg-slate-950/90 border border-slate-800 hover:border-sky-500/50 rounded-xl text-center space-y-2 group transition-all"
          >
            <FileCode className="w-8 h-8 text-sky-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-slate-100 block">Structured JSON</span>
            <span className="text-[10px] text-slate-400 block">Raw Data Backup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
