import React from 'react';
import { MapPin, Calendar, Sparkles } from 'lucide-react';
import { Memory } from '../../types';

export const MemoryCard: React.FC<{ memory: Memory }> = ({ memory }) => {
  return (
    <div className="glass-panel overflow-hidden group space-y-3 p-4 hover:border-sky-500/40 transition-all">
      <div className="relative h-48 rounded-xl overflow-hidden bg-slate-950">
        <img
          src={memory.imageUrl}
          alt={memory.caption || 'Memory Photo'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <span className="flex items-center gap-1 font-semibold">
            <MapPin className="w-3.5 h-3.5 text-sky-400" /> {memory.location || 'India'}
          </span>
          <span className="text-[10px] text-slate-300">
            {new Date(memory.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <h4 className="font-bold text-slate-100 text-sm">{memory.caption || 'Unforgettable Highlight'}</h4>
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
