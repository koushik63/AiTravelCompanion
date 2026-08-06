import React from 'react';
import { DayCard } from './DayCard';
import { AIItineraryResponse } from '../../types';

export const ItineraryTimeline: React.FC<{ itinerary: AIItineraryResponse }> = ({ itinerary }) => {
  return (
    <div className="space-y-6">
      {itinerary.days.map((day: any) => (
        <DayCard key={day.dayNumber} day={day} />
      ))}
    </div>
  );
};
