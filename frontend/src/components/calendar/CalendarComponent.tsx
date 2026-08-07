import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Camera, Sparkles } from 'lucide-react';
import { Trip, Memory } from '../../types';
import { MemoryService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface CalendarComponentProps {
  trips: Trip[];
  onSelectDate?: (date: Date) => void;
  onTripClick?: (trip: Trip) => void;
}

export const CalendarComponent: React.FC<CalendarComponentProps> = ({
  trips,
  onSelectDate,
  onTripClick
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [memories, setMemories] = useState<Memory[]>([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const memoryUserKey = user?.id || user?.email || 'demo_user';
  const storageKey = `ai_travel_user_memories_${memoryUserKey}`;

  useEffect(() => {
    const loadMemories = () => {
      const localStr = localStorage.getItem(storageKey);
      const localMems: Memory[] = localStr ? JSON.parse(localStr) : [];

      MemoryService.getMemories('')
        .then((serverMems) => {
          const combinedMap = new Map<string, Memory>();
          (serverMems || []).forEach((m: Memory) => combinedMap.set(m.id, m));
          // Only merge local fallback memories if offline-created (mem_local_)
          localMems.filter((m) => m.id.startsWith('mem_local_')).forEach((m: Memory) => combinedMap.set(m.id, m));
          setMemories(Array.from(combinedMap.values()));
        })
        .catch(() => {
          setMemories(localMems);
        });
    };

    loadMemories();

    window.addEventListener('memories-updated', loadMemories);
    window.addEventListener('storage', loadMemories);
    return () => {
      window.removeEventListener('memories-updated', loadMemories);
      window.removeEventListener('storage', loadMemories);
    };
  }, [storageKey]);

  const handlePrev = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNext = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="glass-panel p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
              {monthNames[month]} {year}
            </h3>
            <span className="text-xs text-slate-400 flex items-center gap-2">
              Interactive Trip Timeline & Photo Memories
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                <Camera className="w-3 h-3" /> Memories Synced
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${viewMode === 'month' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${viewMode === 'week' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${viewMode === 'day' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Day
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={handlePrev} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={handleNext} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'month' && (
        <div className="grid grid-cols-7 gap-2 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-xs font-bold text-slate-400 py-2 uppercase tracking-wider">
              {d}
            </div>
          ))}

          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-28 bg-slate-950/40 border border-slate-800/40 rounded-xl opacity-30" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const matchingTrips = trips.filter(
              (t) => t.startDate.startsWith(dateStr) || t.endDate.startsWith(dateStr)
            );
            const matchingMemories = memories.filter((m) => {
              if (!m.createdAt) return false;
              const memDate = new Date(m.createdAt).toISOString().split('T')[0];
              return memDate === dateStr;
            });

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() => onSelectDate?.(new Date(year, month, dayNum))}
                className="h-28 bg-slate-950/80 border border-slate-800/80 rounded-xl p-2 flex flex-col justify-between hover:border-sky-500/40 cursor-pointer transition-colors group overflow-hidden"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 group-hover:text-sky-400">{dayNum}</span>
                  <Plus className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="space-y-1 overflow-y-auto max-h-20 custom-scrollbar">
                  {matchingTrips.map((t) => (
                    <div
                      key={t.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTripClick?.(t);
                      }}
                      className="px-2 py-0.5 rounded-md bg-sky-500/20 border border-sky-500/40 text-[10px] font-semibold text-sky-300 truncate"
                      title={t.title}
                    >
                      {t.title}
                    </div>
                  ))}

                  {matchingMemories.map((m) => (
                    <div
                      key={m.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/memories');
                      }}
                      className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-[10px] font-semibold text-amber-300 truncate flex items-center gap-1 hover:bg-amber-500/30 transition-colors"
                      title={`📸 Memory: ${m.caption}`}
                    >
                      <Camera className="w-2.5 h-2.5 shrink-0 text-amber-400" />
                      <span className="truncate">{m.caption}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode !== 'month' && (
        <div className="p-8 text-center glass-panel space-y-2">
          <p className="text-sm font-semibold text-slate-200">Focused {viewMode.toUpperCase()} Timeline</p>
          <p className="text-xs text-slate-400">Displaying scheduled trip checkpoints and photo memory entries for current {viewMode}.</p>
        </div>
      )}
    </div>
  );
};
