import React from 'react';
import { Clock } from 'lucide-react';
import { useTravelStore } from '../store/useTravelStore';
import { TripCard } from '../components/trips/TripCard';
import { EmptyState } from '../components/ui/EmptyState';

export const UpcomingTripsPage: React.FC = () => {
  const { trips, toggleFavoriteTrip, archiveTrip, duplicateTrip, deleteTrip, setActiveTrip } = useTravelStore();

  const upcomingTrips = trips.filter((t) => t.status === 'UPCOMING' && !t.isArchived);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <Clock className="w-6 h-6 text-amber-400" /> Upcoming Journeys
        </h1>
        <p className="text-xs text-slate-400">Scheduled trips ready for execution</p>
      </div>

      {upcomingTrips.length === 0 ? (
        <EmptyState title="No Upcoming Trips" description="You have no upcoming trips scheduled." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onFavorite={toggleFavoriteTrip}
              onArchive={archiveTrip}
              onDuplicate={duplicateTrip}
              onDelete={deleteTrip}
              onSetActive={setActiveTrip}
            />
          ))}
        </div>
      )}
    </div>
  );
};
