import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, MapPin, Plus, TrendingUp, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTravelStore } from '../store/useTravelStore';
import { StatisticCard } from '../components/ui/StatisticCard';
import { TripCard } from '../components/trips/TripCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { TripModal } from '../components/trips/TripModal';
import { formatCurrency } from '../utils/currencyHelper';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { trips, activeTrip, addTrip, toggleFavoriteTrip, archiveTrip, duplicateTrip, deleteTrip } = useTravelStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const upcomingTrips = trips.filter((t) => t.status === 'UPCOMING' && !t.isArchived);
  const completedTrips = trips.filter((t) => t.status === 'COMPLETED').length;
  const totalBudget = trips.reduce((acc, t) => acc + (t.budget || 0), 0);
  const totalSpent = trips.reduce((acc, t) => acc + (t.spent || 0), 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Travel Companion Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Welcome back, {user?.name || 'Traveler'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            Manage your upcoming itineraries, active trip updates, packing status, and travel expenses in India and abroad.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="glass-button text-xs py-3 px-6 flex items-center gap-2 shadow-xl shadow-sky-500/20 z-10 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Trip
        </button>
      </div>

      {/* Travel Statistics Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticCard title="Total Trips" value={trips.length} subtitle="Active & Planned" icon={Compass} color="sky" />
        <StatisticCard title="Upcoming Trips" value={upcomingTrips.length} subtitle="Next journeys" icon={Calendar} color="amber" />
        <StatisticCard title="Completed Journeys" value={completedTrips} subtitle="Memories logged" icon={CheckCircle2} color="emerald" />
        <StatisticCard title="Total Budget Spent" value={formatCurrency(totalSpent, 'INR')} subtitle={`Of ${formatCurrency(totalBudget, 'INR')}`} icon={TrendingUp} color="indigo" />
      </div>

      {/* Active Trip Banner */}
      {activeTrip && (
        <div className="glass-panel p-6 border-sky-500/40 space-y-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Current Active Journey
              </span>
              <h2 className="text-xl font-bold text-slate-100 mt-1">{activeTrip.title}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400" /> {activeTrip.destination}
              </p>
            </div>
            <Link to="/current" className="glass-button text-xs py-2.5 px-5 flex items-center gap-1.5">
              Open Live Mode <Compass className="w-4 h-4" />
            </Link>
          </div>

          <ProgressBar
            progress={65}
            label="Trip Progress"
            sublabel="Day 4 of 7 • 3 Days Remaining"
            color="emerald"
          />
        </div>
      )}

      {/* Upcoming Trips Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" /> Upcoming Journeys
          </h2>
          <Link to="/trips" className="text-xs text-sky-400 font-semibold hover:underline">
            View All ({trips.length})
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingTrips.slice(0, 3).map((trip) => (
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
      </div>

      <TripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addTrip}
      />
    </div>
  );
};
