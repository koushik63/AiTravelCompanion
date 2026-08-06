import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Sparkles } from 'lucide-react';
import { Memory } from '../../types';

interface MemoryLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: Memory[];
  currentIndex: number;
  onNavigate: (newIndex: number) => void;
}

export const MemoryLightboxModal: React.FC<MemoryLightboxModalProps> = ({
  isOpen,
  onClose,
  memories,
  currentIndex,
  onNavigate
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + memories.length) % memories.length);
      }
      if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % memories.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, memories.length, onClose, onNavigate]);

  if (!isOpen || memories.length === 0) return null;

  const currentMemory = memories[currentIndex] || memories[0];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-fade-in"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shadow-xl"
        title="Close Lightbox (Esc)"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Buttons */}
      {memories.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((currentIndex - 1 + memories.length) % memories.length);
            }}
            className="absolute left-4 md:left-8 z-50 p-3 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shadow-xl"
            title="Previous Memory (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((currentIndex + 1) % memories.length);
            }}
            className="absolute right-4 md:right-8 z-50 p-3 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shadow-xl"
            title="Next Memory (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Image Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-4xl w-full max-h-[90vh] flex flex-col glass-panel overflow-hidden border-amber-500/30 shadow-2xl space-y-0"
      >
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden max-h-[70vh]">
          <img
            src={currentMemory.imageUrl}
            alt={currentMemory.caption || 'Enlarged Memory'}
            className="max-w-full max-h-[70vh] object-contain select-none"
          />
        </div>

        {/* Caption & Metadata Bar */}
        <div className="p-6 bg-slate-900/95 border-t border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-slate-100 text-lg">{currentMemory.caption || 'Unforgettable Highlight'}</h3>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1 font-semibold text-sky-400">
                <MapPin className="w-4 h-4" /> {currentMemory.location || 'India'}
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {new Date(currentMemory.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {currentMemory.aiCaption && (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs px-3 py-2 rounded-xl">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{currentMemory.aiCaption}</span>
            </div>
          )}

          {memories.length > 1 && (
            <div className="text-right text-[11px] font-semibold text-slate-400">
              Photo {currentIndex + 1} of {memories.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
