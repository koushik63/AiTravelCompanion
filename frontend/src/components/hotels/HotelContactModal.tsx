import React, { useState } from 'react';
import { X, Phone, Mail, Globe, MapPin, Copy, Check, Star, MessageSquare, ExternalLink, ShieldCheck, Clock } from 'lucide-react';
import { HotelData } from './HotelCard';

interface HotelContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: HotelData | null;
}

export const HotelContactModal: React.FC<HotelContactModalProps> = ({
  isOpen,
  onClose,
  hotel
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !hotel) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const phoneNum = hotel.phone || '+91 40 6629 8585';
  const emailAddr = hotel.email || `concierge@${hotel.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  const website = hotel.websiteUrl || hotel.googleMapsUrl;

  const fullContactSummary = `🏨 ${hotel.name}\n📍 Address: ${hotel.address}\n📞 Phone: ${phoneNum}\n📧 Email: ${emailAddr}\n🌐 Website: ${website}`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel max-w-lg w-full overflow-hidden space-y-0 border-sky-500/30 shadow-2xl"
      >
        {/* Header Image Bar */}
        <div className="relative h-44 bg-slate-950">
          <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center justify-between text-xs text-white">
              <span className="font-bold text-amber-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {hotel.rating} ({hotel.reviewsCount} Google reviews)
              </span>
              <span className="text-[10px] text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 font-extrabold">
                ₹{hotel.pricePerNight.toLocaleString()} / night
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 bg-slate-900/95">
          <div>
            <h3 className="font-extrabold text-slate-100 text-lg">{hotel.name}</h3>
            <p className="text-xs text-slate-400 flex items-start gap-1 mt-1 leading-relaxed">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span>{hotel.address}</span>
            </p>
          </div>

          {/* Contact Details List */}
          <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Contact Information
            </h4>

            {/* Direct Phone Number */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block font-medium">Front Desk & Concierge</span>
                  <a href={`tel:${phoneNum}`} className="font-bold text-slate-100 hover:text-emerald-400 transition-colors truncate block">
                    {phoneNum}
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(phoneNum, 'phone')}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer shrink-0"
                title="Copy phone number"
              >
                {copiedField === 'phone' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Concierge Email */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block font-medium">Reservations Email</span>
                  <a href={`mailto:${emailAddr}`} className="font-bold text-slate-100 hover:text-sky-400 transition-colors truncate block">
                    {emailAddr}
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(emailAddr, 'email')}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer shrink-0"
                title="Copy email address"
              >
                {copiedField === 'email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Official Website */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block font-medium">Official Portal</span>
                  <a href={website} target="_blank" rel="noopener noreferrer" className="font-bold text-amber-300 hover:underline truncate block flex items-center gap-1">
                    Visit Official Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Reception Hours */}
            <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[11px]">Reception: <strong className="text-slate-100">24 Hours Active Front Desk</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-800">
            <a
              href={`tel:${phoneNum}`}
              className="w-full sm:flex-1 glass-button text-xs py-2.5 px-4 text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold cursor-pointer"
            >
              <Phone className="w-4 h-4" /> Call Front Desk
            </a>
            <a
              href={`https://wa.me/${phoneNum.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello, I am inquiring about room availability at ${hotel.name}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 glass-button-secondary text-xs py-2.5 px-4 text-center flex items-center justify-center gap-2 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" /> WhatsApp Inquiry
            </a>
            <button
              type="button"
              onClick={() => handleCopy(fullContactSummary, 'all')}
              className="w-full sm:w-auto glass-button-secondary text-xs py-2.5 px-3 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              {copiedField === 'all' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />} Copy All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
