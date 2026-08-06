import React, { useState } from 'react';
import { Share2, Copy, Check, QrCode, X } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export const ShareModal: React.FC<{ isOpen: boolean; onClose: () => void; tripId?: string }> = ({
  isOpen,
  onClose,
  tripId = 'trip_1'
}) => {
  const [copied, setCopied] = useState(false);
  const { addToast } = useUIStore();
  const shareUrl = `${window.location.origin}/share/demo-token-${tripId}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    addToast({ type: 'success', message: 'Public share link copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="glass-panel p-6 max-w-md w-full space-y-5 border-sky-500/40 relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-slate-100 text-base">Share Itinerary & Memories</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Anyone with this read-only link can view your trip itinerary, day-by-day activities, and public photo album.
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 block">Public Share URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
            />
            <button onClick={handleCopy} className="glass-button text-xs py-2 px-4 flex items-center gap-1">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl text-center space-y-2">
          <QrCode className="w-16 h-16 text-sky-400 mx-auto" />
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Scan to open on mobile phone</span>
        </div>
      </div>
    </div>
  );
};
