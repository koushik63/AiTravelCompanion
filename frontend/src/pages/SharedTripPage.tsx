import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Compass, MapPin, Calendar, Globe } from 'lucide-react';
import { SharingService } from '../services/api';
import { SharedTrip } from '../types';

export const SharedTripPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [trip, setTrip] = useState<SharedTrip | null>(null);

  useEffect(() => {
    if (token) {
      SharingService.getSharedTrip(token).then(setTrip).catch(() => {});
    }
  }, [token]);

  const defaultTrip = trip || {
    token: 'demo',
    tripId: 'trip_1',
    title: 'Shared AI Expedition to Goa',
    destination: 'Goa, India',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 604800000).toISOString(),
    itineraryDays: [
      {
        id: 'd1',
        dayNumber: 1,
        date: new Date().toISOString().split('T')[0],
        summary: 'Arrival & Beachside Sunset Walk',
        activities: [
          { id: 'a1', time: '09:00 AM', title: 'Check-in at Beachfront Resort', category: 'Accommodation', cost: 0, isCompleted: true },
          { id: 'a2', time: '05:30 PM', title: 'Baga Beach Sunset Drinks', category: 'Leisure', cost: 1200, isCompleted: true }
        ]
      }
    ],
    isPublic: true
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 max-w-4xl mx-auto space-y-6">
      <div className="glass-panel p-8 space-y-4 border-sky-500/40 relative overflow-hidden">
        <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
          <Globe className="w-4 h-4" /> Public Shared Itinerary
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">{defaultTrip.title}</h1>
        <p className="text-xs text-slate-300 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-sky-400" /> {defaultTrip.destination}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Compass className="w-5 h-5 text-sky-400" /> Day-by-Day Schedule Highlights
        </h2>

        {defaultTrip.itineraryDays.map((day) => (
          <div key={day.id} className="glass-panel p-6 space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <span className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold text-xs flex items-center justify-center">
                D{day.dayNumber}
              </span>
              <div>
                <h3 className="font-bold text-sm text-slate-100">{day.summary}</h3>
                <span className="text-[11px] text-slate-400">{day.date}</span>
              </div>
            </div>

            <div className="space-y-2">
              {day.activities.map((act) => (
                <div key={act.id} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{act.time} — {act.title}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">{act.category}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
