import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeft, Star, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { useTravelStore } from '../store/useTravelStore';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatDate } from '../utils/dateHelper';
import { formatCurrency } from '../utils/currencyHelper';
import { ProgressBar } from '../components/ui/ProgressBar';

export const TripDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { trips, toggleFavoriteTrip, deleteTrip } = useTravelStore();

  const trip = trips.find((t) => t.id === id) || trips[0];

  if (!trip) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-200">Trip Not Found</h2>
        <Link to="/trips" className="glass-button text-xs py-2 px-4 inline-block">Return to Trips</Link>
      </div>
    );
  }

  const budgetProgress = (trip.spent / (trip.budget || 1)) * 100;

  return (
    <div className="space-y-6 pb-12">
      <Link to="/trips" className="text-xs text-sky-400 font-semibold hover:underline inline-flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to All Trips
      </Link>

      <div className="relative h-64 rounded-2xl overflow-hidden shadow-2xl">
        <img
          src={trip.coverImage || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1200'}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute top-4 left-4">
          <StatusBadge status={trip.status} />
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => toggleFavoriteTrip(trip.id)}
            className={`p-2.5 rounded-xl backdrop-blur-md transition-colors ${
              trip.isFavorite ? 'bg-amber-500 text-white' : 'bg-slate-900/60 text-slate-300'
            }`}
          >
            <Star className={`w-4 h-4 ${trip.isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{trip.title}</h1>
          <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-sky-400" /> {trip.destination} • {trip.country || 'India'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3">
              Journey Specifications
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block uppercase text-[10px]">Start Date</span>
                <span className="font-bold text-slate-200">{formatDate(trip.startDate)}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block uppercase text-[10px]">End Date</span>
                <span className="font-bold text-slate-200">{formatDate(trip.endDate)}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block uppercase text-[10px]">Travel Style</span>
                <span className="font-bold text-slate-200">{trip.travelType || 'Leisure'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block uppercase text-[10px]">Transport</span>
                <span className="font-bold text-slate-200">{trip.transportType || 'Flight'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block uppercase text-[10px]">Accommodation</span>
                <span className="font-bold text-slate-200">{trip.accommodation || 'Resort Stay'}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3">
              Itinerary Overview
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {trip.description || `Comprehensive day-by-day travel plan generated for ${trip.destination}.`}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3">
              Budget Analytics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Budget</span>
                <span className="font-bold text-slate-100">{formatCurrency(trip.budget, trip.currency)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Spent</span>
                <span className="font-bold text-emerald-400">{formatCurrency(trip.spent, trip.currency)}</span>
              </div>
              <ProgressBar
                progress={budgetProgress}
                label="Spent Ratio"
                sublabel={`${Math.round(budgetProgress)}%`}
                color="sky"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
