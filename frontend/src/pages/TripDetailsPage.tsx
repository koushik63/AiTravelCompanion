import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeft, Star, Edit, Trash2, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import { useTravelStore } from '../store/useTravelStore';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatDate } from '../utils/dateHelper';
import { formatCurrency } from '../utils/currencyHelper';
import { ProgressBar } from '../components/ui/ProgressBar';
import { getTripImage } from '../utils/imageHelper';
import { getDetailedDestinationItinerary, DayItinerary } from '../utils/itineraryHelper';
import { HotelSection } from '../components/hotels/HotelSection';
import { AIService } from '../services/api';

export const TripDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { trips, toggleFavoriteTrip, deleteTrip } = useTravelStore();

  const trip = trips.find((t) => t.id === id) || trips[0];
  const [customItinerary, setCustomItinerary] = useState<DayItinerary[] | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);

  if (!trip) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-200">Trip Not Found</h2>
        <Link to="/trips" className="glass-button text-xs py-2 px-4 inline-block">Return to Trips</Link>
      </div>
    );
  }

  // Calculate exact duration in days from start date to end date
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const tripDurationDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1);

  const detailedItinerary = customItinerary || getDetailedDestinationItinerary(trip.destination, tripDurationDays);
  const budgetProgress = (trip.spent / (trip.budget || 1)) * 100;

  const handleRegenerateWithAI = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await AIService.generateItinerary({
        destination: trip.destination,
        travelStyle: trip.travelType || 'Leisure',
        budget: trip.budget || 50000,
        durationDays: tripDurationDays,
        forceRegenerate: true
      });

      if (res && res.days && Array.isArray(res.days)) {
        const aiDays: DayItinerary[] = res.days.map((d: any) => ({
          day: `Day ${d.dayNumber}: ${d.summary || 'Custom AI Schedule'}`,
          morning: d.morning && d.morning[0] ? d.morning[0].title : `Explore morning highlights in ${trip.destination}`,
          afternoon: d.afternoon && d.afternoon[0] ? d.afternoon[0].title : `Visit central attraction in ${trip.destination}`,
          evening: d.evening && d.evening[0] ? d.evening[0].title : `Dine at famous local restaurant in ${trip.destination}`,
          cost: `₹${Math.round((d.morning?.[0]?.cost || 800) + (d.afternoon?.[0]?.cost || 1200) + (d.evening?.[0]?.cost || 1500))}`
        }));
        setCustomItinerary(aiDays);
      }
    } catch (err) {
      console.error('Failed to regenerate AI itinerary', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <Link to="/trips" className="text-xs text-sky-400 font-semibold hover:underline inline-flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to All Trips
      </Link>

      <div className="relative h-64 rounded-2xl overflow-hidden shadow-2xl">
        <img
          src={getTripImage(trip.destination, trip.id, trip.imageUrl, trip.title, trip.coverImage)}
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

          <div className="glass-panel p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Day-by-Day Itinerary Schedule
                </h3>
                <p className="text-[11px] text-slate-400">Detailed destination-specific itinerary for {trip.destination}</p>
              </div>

              <button
                onClick={handleRegenerateWithAI}
                disabled={isGeneratingAI}
                className="glass-button text-xs py-1.5 px-3.5 flex items-center gap-1.5 shadow-lg shadow-sky-500/15 disabled:opacity-50"
              >
                {isGeneratingAI ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" /> Generating AI Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Regenerate AI Itinerary
                  </>
                )}
              </button>
            </div>

            {/* Detailed Multi-day Plan */}
            <div className="space-y-6">
              {detailedItinerary.map((d, idx) => (
                <div key={idx} className="p-4.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
                    <span className="font-extrabold text-xs text-amber-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-sky-400" /> {d.day}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                      Est. {d.cost}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/60 space-y-1">
                      <span className="text-[10px] font-bold text-amber-300 block uppercase tracking-wider">☀️ Morning</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{d.morning}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/60 space-y-1">
                      <span className="text-[10px] font-bold text-sky-300 block uppercase tracking-wider">🌤️ Afternoon</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{d.afternoon}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/60 space-y-1">
                      <span className="text-[10px] font-bold text-indigo-300 block uppercase tracking-wider">🌙 Evening</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{d.evening}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

      {/* Google Maps Nearby Hotels & Accommodations Section */}
      <HotelSection destination={trip.destination} />
    </div>
  );
};
