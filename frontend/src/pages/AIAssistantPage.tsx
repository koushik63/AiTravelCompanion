import React, { useState } from 'react';
import { Bot, Sparkles, MapPin } from 'lucide-react';
import { useTravelStore } from '../store/useTravelStore';
import { AIChatWindow } from '../components/assistant/AIChatWindow';

export const AIAssistantPage: React.FC = () => {
  const { trips, activeTrip } = useTravelStore();
  const [selectedTripId, setSelectedTripId] = useState<string>(activeTrip?.id || (trips[0]?.id || 'all'));

  const selectedTrip = trips.find((t) => t.id === selectedTripId) || activeTrip || trips[0];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Bot className="w-6 h-6 text-amber-400" /> Smart AI Travel Assistant
          </h1>
          <p className="text-xs text-slate-400">Conversational AI assistant pre-loaded with your active trip context</p>
        </div>

        {/* Trip Context Selector Dropdown */}
        <div className="flex items-center gap-2 bg-slate-900 border border-amber-500/30 rounded-xl px-3 py-2 text-xs">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-400 font-semibold text-[11px]">Chat Context:</span>
          <select
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="bg-slate-950 text-slate-200 text-xs font-bold rounded px-2.5 py-1 border border-slate-800 focus:outline-none cursor-pointer"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.destination})
              </option>
            ))}
            <option value="general">🌐 General Travel Advisor</option>
          </select>
        </div>
      </div>

      <AIChatWindow tripContext={selectedTripId === 'general' ? { destination: 'Worldwide Travel' } : selectedTrip} />
    </div>
  );
};
