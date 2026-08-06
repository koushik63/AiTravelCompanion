import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Star, MoreVertical, Archive, Copy, Trash2, ArrowRight } from 'lucide-react';
import { Trip } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { formatDate } from '../../utils/dateHelper';
import { formatCurrency } from '../../utils/currencyHelper';
import { Dropdown } from '../ui/Dropdown';

// Destination keyword → Unsplash photo ID mapping for consistent, destination-specific images
const DESTINATION_IMAGE_MAP: Record<string, string> = {
  // Indian destinations
  goa: 'photo-1512343879784-a960bf40e7f2',
  ladakh: 'photo-1506905925346-21bda4d32df4',
  ladhak: 'photo-1506905925346-21bda4d32df4',
  leh: 'photo-1506905925346-21bda4d32df4',
  kerala: 'photo-1602216056096-3b40cc0c9944',
  rajasthan: 'photo-1524492412937-b28074a5d7da',
  jaipur: 'photo-1524492412937-b28074a5d7da',
  mumbai: 'photo-1529253355930-ddbe423a2ac7',
  delhi: 'photo-1597074866923-dc0589150358',
  agra: 'photo-1564507592333-c60657eea523',
  kashmir: 'photo-1548013146-72479768bada',
  manali: 'photo-1626621341517-bbf3d9990a23',
  shimla: 'photo-1626621341517-bbf3d9990a23',
  varanasi: 'photo-1561361058-c24cecae35ca',
  mysore: 'photo-1600697395543-b8d08c87c9d5',
  ooty: 'photo-1602216056096-3b40cc0c9944',
  andaman: 'photo-1537956965359-7573183d1f57',
  // International
  paris: 'photo-1502602898657-3e91760cbb34',
  london: 'photo-1513635269975-59663e0ac1ad',
  tokyo: 'photo-1540959733332-eab4deabeeaf',
  dubai: 'photo-1512453979798-5ea266f8880c',
  bali: 'photo-1537996194471-e657df975ab4',
  singapore: 'photo-1525625293386-3f8f99389edd',
  newyork: 'photo-1522083165195-3424ed129620',
  'new york': 'photo-1522083165195-3424ed129620',
  rome: 'photo-1552832230-c0197dd311b5',
  barcelona: 'photo-1539037116277-4db20889f2d4',
  maldives: 'photo-1573843981267-be1999ff37cd',
  switzerland: 'photo-1506905925346-21bda4d32df4',
  amsterdam: 'photo-1534351590666-13e3e96b5702',
  sydney: 'photo-1506905925346-21bda4d32df4',
  bangkok: 'photo-1508009603885-50cf7c579365',
  istanbul: 'photo-1524231757912-21f4fe3a7200',
  egypt: 'photo-1539650116574-8efeb43e2750',
  cairo: 'photo-1539650116574-8efeb43e2750',
  greece: 'photo-1555993539-1732b0258235',
  santorini: 'photo-1555993539-1732b0258235',
  iceland: 'photo-1529963183134-61a90db47eaf',
  canada: 'photo-1518732714860-b62714ce0c59',
  mexico: 'photo-1518638150340-f706e86654de',
  brazil: 'photo-1516306580123-e6e52b1b7b5f',
  rio: 'photo-1516306580123-e6e52b1b7b5f',
  hawaii: 'photo-1542259009477-d625272157b7',
  beach: 'photo-1507525428034-b723cf961d3e',
  mountain: 'photo-1464822759023-fed622ff2c3b',
  city: 'photo-1477959858617-67f85cf4f1df',
  forest: 'photo-1448375240586-882707db888b',
  desert: 'photo-1509316785289-025f5b846b35',
};

/**
 * Returns a destination-specific Unsplash image URL.
 * Checks destination keywords against our mapping; falls back to a
 * deterministic "seed" image derived from the trip ID so different
 * trips always look different even for unknown destinations.
 */
function getDestinationImage(destination: string, tripId: string): string {
  const lower = (destination || '').toLowerCase().trim();

  // Check for keyword matches
  for (const [keyword, photoId] of Object.entries(DESTINATION_IMAGE_MAP)) {
    if (lower.includes(keyword)) {
      return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=80&w=600`;
    }
  }

  // Deterministic fallback: use the trip ID to pick from a pool of travel images
  const fallbackPool = [
    'photo-1476514525535-07fb3b4ae5f1', // aerial ocean view
    'photo-1500530855697-b586d89ba3ee', // mountains at sunrise
    'photo-1488085061387-422e29b40080', // world map / travel
    'photo-1469474968028-56623f02e42e', // nature landscape
    'photo-1519046904884-53103b34b206', // beach aerial
    'photo-1503220317375-aaad61436b1b', // travel destination
    'photo-1551918120-9739cb430c6d', // luxury travel
    'photo-1682685797406-97f364419b4a', // scenic view
  ];
  // Use trip ID characters to pick consistently
  const idx = tripId
    ? tripId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % fallbackPool.length
    : 0;
  return `https://images.unsplash.com/${fallbackPool[idx]}?auto=format&fit=crop&q=80&w=600`;
}

interface TripCardProps {
  trip: Trip;
  onFavorite?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  onFavorite,
  onArchive,
  onDuplicate,
  onDelete
}) => {
  return (
    <div className="glass-panel-hover overflow-hidden flex flex-col justify-between group">
      <div>
        <div className="relative h-44 overflow-hidden">
          <img
            src={getDestinationImage(trip.destination, trip.id)}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          <div className="absolute top-3 left-3">
            <StatusBadge status={trip.status} />
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {onFavorite && (
              <button
                onClick={() => onFavorite(trip.id)}
                className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                  trip.isFavorite
                    ? 'bg-amber-500/80 text-white'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <Star className={`w-4 h-4 ${trip.isFavorite ? 'fill-white' : ''}`} />
              </button>
            )}

            <Dropdown
              trigger={
                <button className="p-2 rounded-xl bg-slate-900/60 text-slate-400 hover:text-white backdrop-blur-md">
                  <MoreVertical className="w-4 h-4" />
                </button>
              }
              items={[
                { label: 'Duplicate Trip', onClick: () => onDuplicate?.(trip.id) },
                { label: trip.isArchived ? 'Restore Trip' : 'Archive Trip', onClick: () => onArchive?.(trip.id) },
                { label: 'Delete Trip', onClick: () => onDelete?.(trip.id) }
              ]}
            />
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-base font-bold text-slate-100 truncate">{trip.title}</h3>
            <p className="text-xs text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              {trip.destination}
            </p>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </span>
            <span className="font-semibold text-slate-200">{trip.travelType || 'Leisure'}</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Budget Limit</span>
              <span className="font-bold text-slate-100">{formatCurrency(trip.budget, trip.currency)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold text-right">Spent So Far</span>
              <span className="font-bold text-emerald-400">{formatCurrency(trip.spent, trip.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <Link
          to={`/trips/${trip.id}`}
          className="w-full glass-button text-xs py-2.5 flex items-center justify-center gap-1.5"
        >
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
