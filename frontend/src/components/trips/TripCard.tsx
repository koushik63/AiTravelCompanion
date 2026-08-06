import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Star, MoreVertical, ArrowRight } from 'lucide-react';
import { Trip } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { formatDate } from '../../utils/dateHelper';
import { formatCurrency } from '../../utils/currencyHelper';
import { Dropdown } from '../ui/Dropdown';
import { getTripImage } from '../../utils/imageHelper';

interface TripCardProps {
  trip: Trip;
  onFavorite?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSetActive?: (id: string) => void;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  onFavorite,
  onArchive,
  onDuplicate,
  onDelete,
  onSetActive
}) => {
  return (
    <div className="glass-panel-hover overflow-hidden flex flex-col justify-between group">
      <div>
        <div className="relative h-44 overflow-hidden">
          <img
            src={getTripImage(trip.destination, trip.id, trip.imageUrl, trip.title, trip.coverImage)}
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
                className={`p-2 rounded-xl backdrop-blur-md transition-colors cursor-pointer ${
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
                <button className="p-2 rounded-xl bg-slate-900/60 text-slate-400 hover:text-white backdrop-blur-md cursor-pointer">
                  <MoreVertical className="w-4 h-4" />
                </button>
              }
              items={[
                { label: '⚡ Set as Active Live Trip', onClick: () => onSetActive?.(trip.id) },
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
          className="w-full glass-button text-xs py-2.5 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
