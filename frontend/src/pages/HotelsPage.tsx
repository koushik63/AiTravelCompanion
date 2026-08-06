import React from 'react';
import { useTravelStore } from '../store/useTravelStore';
import { HotelSection } from '../components/hotels/HotelSection';

export const HotelsPage: React.FC = () => {
  const { activeTrip } = useTravelStore();
  const destination = activeTrip?.destination || 'Goa';

  return (
    <div className="space-y-6 pb-12">
      <HotelSection destination={destination} />
    </div>
  );
};
