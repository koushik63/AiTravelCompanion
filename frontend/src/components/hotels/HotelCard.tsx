import React from 'react';
import { Star, MapPin, ExternalLink, Navigation } from 'lucide-react';

export interface HotelData {
  id: string;
  name: string;
  destination: string;
  address: string;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  currency: string;
  category: string;
  imageUrl: string;
  amenities: string[];
  googleMapsUrl: string;
  bookingUrl: string;
  distanceFromCenterKm: number;
}

export const HotelCard: React.FC<{ hotel: HotelData }> = ({ hotel }) => {
  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'luxury':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'beachfront':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'boutique':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="glass-panel overflow-hidden group space-y-4 p-4 hover:border-sky-500/40 transition-all duration-300 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Image Container */}
        <div className="relative h-52 rounded-xl overflow-hidden bg-slate-950">
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

          {/* Category Pill */}
          <div className="absolute top-3 left-3">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border backdrop-blur-md ${getCategoryColor(hotel.category)}`}>
              {hotel.category}
            </span>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{hotel.rating}</span>
            <span className="text-[10px] text-slate-400 font-normal">({hotel.reviewsCount})</span>
          </div>

          {/* Price Tag Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
            <div className="bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
              <span className="text-emerald-400 font-extrabold text-sm">₹{hotel.pricePerNight.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400">/ night</span>
            </div>
            <span className="text-[10px] text-sky-300 font-medium flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
              <Navigation className="w-3 h-3 text-sky-400" /> {hotel.distanceFromCenterKm} km from center
            </span>
          </div>
        </div>

        {/* Info Content */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-100 text-base leading-snug group-hover:text-sky-300 transition-colors">
            {hotel.name}
          </h4>

          <p className="text-xs text-slate-400 flex items-start gap-1 leading-relaxed">
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{hotel.address}</span>
          </p>

          {/* Amenities Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {hotel.amenities.slice(0, 4).map((am, i) => (
              <span key={i} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                {am}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Links */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
        <a
          href={hotel.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-button-secondary text-xs py-2 px-3 flex-1 text-center flex items-center justify-center gap-1 cursor-pointer"
          title="Open location on Google Maps"
        >
          <MapPin className="w-3.5 h-3.5 text-sky-400" /> Google Maps
        </a>
        <a
          href={hotel.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-button text-xs py-2 px-3 flex-1 text-center flex items-center justify-center gap-1.5 shadow-lg shadow-sky-500/20 cursor-pointer font-extrabold bg-sky-500 hover:bg-sky-400 text-white"
          title="Book room on direct booking engine"
        >
          Book Hotel <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
