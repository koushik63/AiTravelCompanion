import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { useTravelStore } from '../store/useTravelStore';
import { AIChatWindow } from '../components/assistant/AIChatWindow';

export const AIAssistantPage: React.FC = () => {
  const { activeTrip } = useTravelStore();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <Bot className="w-6 h-6 text-amber-400" /> Smart AI Travel Assistant
        </h1>
        <p className="text-xs text-slate-400">Conversational AI assistant pre-loaded with your active trip context</p>
      </div>

      <AIChatWindow tripContext={activeTrip} />
    </div>
  );
};
