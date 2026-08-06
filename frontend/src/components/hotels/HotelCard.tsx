import React, { useState } from 'react';
import { Star, MapPin, Navigation, Phone, ChevronLeft, ChevronRight, Images } from 'lucide-react';

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
  images?: string[];
  amenities: string[];
  googleMapsUrl: string;
  bookingUrl: string;
  phone?: string;
  email?: string;
  websiteUrl?: string;
  distanceFromCenterKm: number;
}

export const HotelCard: React.FC<{
  hotel: HotelData;
  onGetContact?: (hotel: HotelData) => void;
}> = ({ hotel, onGetContact }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);

  const photoList = hotel.images && hotel.images.length > 0 ? hotel.images : [hotel.imageUrl];

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % photoList.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + photoList.length) % photoList.length);
  };

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
        {/* Interactive Image Carousel Container */}
        <div className="relative h-56 rounded-xl overflow-hidden bg-slate-950 group/carousel">
          <img
            src={photoList[currentImgIndex]}
            alt={`${hotel.name} Photo ${currentImgIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

          {/* Category Pill */}
          <div className="absolute top-3 left-3 z-10">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border backdrop-blur-md ${getCategoryColor(hotel.category)}`}>
              {hotel.category}
            </span>
          </div>

          {/* Photos Counter & Rating */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            <span className="bg-slate-950/80 backdrop-blur-md border border-slate-800 px-2 py-0.5 rounded-md text-[10px] font-bold text-sky-300 flex items-center gap-1">
              <Images className="w-3 h-3 text-sky-400" /> {currentImgIndex + 1}/{photoList.length}
            </span>
            <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1 text-xs font-bold text-amber-400">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{hotel.rating}</span>
            </div>
          </div>

          {/* Left / Right Arrow Carousel Buttons */}
          {photoList.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-950/70 text-white hover:bg-slate-950 border border-slate-700/80 opacity-0 group-hover/carousel:opacity-100 transition-opacity cursor-pointer z-10"
                title="Previous photo"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-950/70 text-white hover:bg-slate-950 border border-slate-700/80 opacity-0 group-hover/carousel:opacity-100 transition-opacity cursor-pointer z-10"
                title="Next photo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dots Pagination Indicator */}
              <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-1 z-10">
                {photoList.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImgIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      currentImgIndex === idx ? 'w-4 bg-sky-400' : 'w-1.5 bg-white/50 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Price Tag Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white z-10">
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
        <button
          type="button"
          onClick={() => onGetContact?.(hotel)}
          className="glass-button text-xs py-2 px-3 flex-1 text-center flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white"
          title="Retrieve phone number & contact info"
        >
          <Phone className="w-3.5 h-3.5" /> Get Contact Info
        </button>
      </div>
    </div>
  );
};
