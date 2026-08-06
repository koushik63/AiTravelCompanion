import React from 'react';
import { MapPin, Calendar, Sparkles, Maximize2, Trash2 } from 'lucide-react';
import { Memory } from '../../types';

export const MemoryCard: React.FC<{
  memory: Memory;
  onClick?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}> = ({ memory, onClick, onDelete }) => {
  return (
    <div
      onClick={onClick}
      className="glass-panel overflow-hidden group space-y-3 p-4 hover:border-amber-500/50 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 relative"
    >
      <div className="relative h-48 rounded-xl overflow-hidden bg-slate-950">
        <img
          src={memory.imageUrl}
          alt={memory.caption || 'Memory Photo'}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 group-hover:opacity-90 transition-opacity" />

        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(e);
              }}
              className="bg-slate-950/80 border border-slate-700/80 text-rose-400 hover:text-white hover:bg-rose-500/80 p-1.5 rounded-lg transition-colors shadow-lg cursor-pointer"
              title="Delete Memory"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <div className="bg-slate-950/70 border border-slate-700/80 text-amber-400 p-1.5 rounded-lg">
            <Maximize2 className="w-4 h-4" />
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <span className="flex items-center gap-1 font-semibold">
            <MapPin className="w-3.5 h-3.5 text-sky-400" /> {memory.location || 'India'}
          </span>
          <span className="text-[10px] text-slate-300 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
            {new Date(memory.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <h4 className="font-bold text-slate-100 text-sm group-hover:text-amber-300 transition-colors">{memory.caption || 'Unforgettable Highlight'}</h4>
        {memory.aiCaption && (
          <p className="text-xs text-amber-300/90 font-medium leading-relaxed flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{memory.aiCaption}</span>
          </p>
        )}
      </div>
    </div>
  );
};
