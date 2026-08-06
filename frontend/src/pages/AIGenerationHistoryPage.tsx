import React from 'react';
import { History, Sparkles, Calendar, Clock } from 'lucide-react';

export const AIGenerationHistoryPage: React.FC = () => {
  const mockHistory = [
    {
      id: 'gen_1',
      destination: 'Goa, India',
      duration: '4 Days',
      travelStyle: 'Leisure',
      version: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: 'gen_2',
      destination: 'Jaipur, Rajasthan',
      duration: '5 Days',
      travelStyle: 'Family',
      version: 2,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <History className="w-6 h-6 text-sky-400" /> AI Generation History
        </h1>
        <p className="text-xs text-slate-400">Previous Gemini AI travel plans and version revisions</p>
      </div>

      <div className="space-y-3">
        {mockHistory.map((item) => (
          <div key={item.id} className="glass-panel p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm">Itinerary for {item.destination}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <span>{item.duration}</span> • <span>{item.travelStyle}</span> • <span>Version {item.version}</span>
                </p>
              </div>
            </div>

            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
