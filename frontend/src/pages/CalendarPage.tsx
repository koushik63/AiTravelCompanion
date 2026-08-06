import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravelStore } from '../store/useTravelStore';
import { CalendarComponent } from '../components/calendar/CalendarComponent';
import { TripModal } from '../components/trips/TripModal';
import { Trip } from '../types';

export const CalendarPage: React.FC = () => {
  const { trips, addTrip } = useTravelStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleTripClick = (trip: Trip) => {
    navigate(`/trips/${trip.id}`);
  };

  return (
    <div className="space-y-6 pb-12">
      <CalendarComponent
        trips={trips}
        onSelectDate={() => setIsModalOpen(true)}
        onTripClick={handleTripClick}
      />

      <TripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addTrip}
      />
    </div>
  );
};
