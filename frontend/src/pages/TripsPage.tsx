import React, { useState } from 'react';
import { Plus, Compass } from 'lucide-react';
import { useTravelStore } from '../store/useTravelStore';
import { TripCard } from '../components/trips/TripCard';
import { TripFilterBar } from '../components/trips/TripFilterBar';
import { TripModal } from '../components/trips/TripModal';
import { EmptyState } from '../components/ui/EmptyState';

export const TripsPage: React.FC = () => {
  const { trips, addTrip, toggleFavoriteTrip, archiveTrip, duplicateTrip, deleteTrip } = useTravelStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTrips = trips
    .filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.destination.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'startDate') return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      if (sortBy === 'budget') return b.budget - a.budget;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Compass className="w-6 h-6 text-sky-400" /> Trip Management
          </h1>
          <p className="text-xs text-slate-400">View, search, filter, and organize your trips</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="glass-button text-xs py-2.5 px-5 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Trip
        </button>
      </div>

      <TripFilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {filteredTrips.length === 0 ? (
        <EmptyState
          title="No Trips Found"
          description="No trips match your current search or filter criteria."
          action={
            <button onClick={() => setIsModalOpen(true)} className="glass-button text-xs py-2 px-4">
              Create Your First Trip
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
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

      <TripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addTrip}
      />
    </div>
  );
};
