import React from 'react';
import { History } from 'lucide-react';
import { useTravelStore } from '../store/useTravelStore';
import { TripCard } from '../components/trips/TripCard';
import { EmptyState } from '../components/ui/EmptyState';

export const TripHistoryPage: React.FC = () => {
  const { trips, toggleFavoriteTrip, archiveTrip, duplicateTrip, deleteTrip } = useTravelStore();

  const completedTrips = trips.filter((t) => t.status === 'COMPLETED' || new Date(t.endDate) < new Date());

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <History className="w-6 h-6 text-emerald-400" /> Journey History
        </h1>
        <p className="text-xs text-slate-400">Completed travel memories and past itineraries</p>
      </div>

      {completedTrips.length === 0 ? (
        <EmptyState title="No Past Journeys Logged" description="You have not completed any trips yet." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {completedTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onFavorite={toggleFavoriteTrip}
              onArchive={archiveTrip}
              onDuplicate={duplicateTrip}
              onDelete={deleteTrip}
            />
          ))}
        </div>
      )}
    </div>
  );
};
