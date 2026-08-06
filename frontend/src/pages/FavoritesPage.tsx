import React from 'react';
import { Star } from 'lucide-react';
import { useTravelStore } from '../store/useTravelStore';
import { TripCard } from '../components/trips/TripCard';
import { EmptyState } from '../components/ui/EmptyState';

export const FavoritesPage: React.FC = () => {
  const { trips, toggleFavoriteTrip, archiveTrip, duplicateTrip, deleteTrip } = useTravelStore();

  const favoriteTrips = trips.filter((t) => t.isFavorite);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <Star className="w-6 h-6 text-amber-400 fill-amber-400" /> Favorite Trips
        </h1>
        <p className="text-xs text-slate-400">Bookmarked journeys and top destinations</p>
      </div>

      {favoriteTrips.length === 0 ? (
        <EmptyState title="No Favorite Trips Starred" description="Star trips in your dashboard to access them here quickly." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favoriteTrips.map((trip) => (
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
