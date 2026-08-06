import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useTravelStore } from '../store/useTravelStore';
import { TripCard } from '../components/trips/TripCard';
import { EmptyState } from '../components/ui/EmptyState';

export const SearchPage: React.FC = () => {
  const { trips, toggleFavoriteTrip, archiveTrip, duplicateTrip, deleteTrip } = useTravelStore();
  const [query, setQuery] = useState('');

  const searchResults = trips.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.destination.toLowerCase().includes(query.toLowerCase()) ||
      (t.country && t.country.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <Search className="w-6 h-6 text-sky-400" /> Destination Search
        </h1>
        <p className="text-xs text-slate-400">Search trips by destination, country, or city</p>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Goa, Jaipur, Kerala, Japan..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />
      </div>

      {searchResults.length === 0 ? (
        <EmptyState title="No Matching Results" description={`No destinations found matching "${query}".`} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {searchResults.map((trip) => (
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
