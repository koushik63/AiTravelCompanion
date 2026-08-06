import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeft, Star, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { useTravelStore } from '../store/useTravelStore';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatDate } from '../utils/dateHelper';
import { formatCurrency } from '../utils/currencyHelper';
import { ProgressBar } from '../components/ui/ProgressBar';

const DEST_MAP: Record<string, string> = {
  goa: 'photo-1512343879784-a960bf40e7f2', ladakh: 'photo-1506905925346-21bda4d32df4',
  ladhak: 'photo-1506905925346-21bda4d32df4', leh: 'photo-1506905925346-21bda4d32df4',
  kerala: 'photo-1602216056096-3b40cc0c9944', rajasthan: 'photo-1524492412937-b28074a5d7da',
  jaipur: 'photo-1524492412937-b28074a5d7da', mumbai: 'photo-1529253355930-ddbe423a2ac7',
  delhi: 'photo-1597074866923-dc0589150358', agra: 'photo-1564507592333-c60657eea523',
  kashmir: 'photo-1548013146-72479768bada', manali: 'photo-1626621341517-bbf3d9990a23',
  varanasi: 'photo-1561361058-c24cecae35ca', paris: 'photo-1502602898657-3e91760cbb34',
  london: 'photo-1513635269975-59663e0ac1ad', tokyo: 'photo-1540959733332-eab4deabeeaf',
  dubai: 'photo-1512453979798-5ea266f8880c', bali: 'photo-1537996194471-e657df975ab4',
  singapore: 'photo-1525625293386-3f8f99389edd', rome: 'photo-1552832230-c0197dd311b5',
  maldives: 'photo-1573843981267-be1999ff37cd', bangkok: 'photo-1508009603885-50cf7c579365',
  istanbul: 'photo-1524231757912-21f4fe3a7200', greece: 'photo-1555993539-1732b0258235',
};
const FALLBACKS = ['photo-1476514525535-07fb3b4ae5f1','photo-1500530855697-b586d89ba3ee','photo-1488085061387-422e29b40080','photo-1469474968028-56623f02e42e','photo-1519046904884-53103b34b206','photo-1503220317375-aaad61436b1b','photo-1551918120-9739cb430c6d','photo-1682685797406-97f364419b4a'];
function getDestImage(dest: string, id: string) {
  const low = (dest||'').toLowerCase();
  for (const [k, v] of Object.entries(DEST_MAP)) if (low.includes(k)) return `https://images.unsplash.com/${v}?auto=format&fit=crop&q=80&w=1200`;
  const idx = id.split('').reduce((a,c)=>a+c.charCodeAt(0),0) % FALLBACKS.length;
  return `https://images.unsplash.com/${FALLBACKS[idx]}?auto=format&fit=crop&q=80&w=1200`;
}

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
          src={getDestImage(trip.destination, trip.id)}
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
