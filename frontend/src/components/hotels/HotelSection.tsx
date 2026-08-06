import React, { useState, useEffect } from 'react';
import { Building2, Search, Filter, MapPin, Sparkles } from 'lucide-react';
import { HotelService } from '../../services/api';
import { HotelCard, HotelData } from './HotelCard';

interface HotelSectionProps {
  destination: string;
}

export const HotelSection: React.FC<HotelSectionProps> = ({ destination }) => {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(destination || '');
  const [activeLocation, setActiveLocation] = useState<string>(destination || 'Goa');

  const categories = ['All', 'Luxury', 'Beachfront', 'Boutique', 'Budget'];

  useEffect(() => {
    fetchHotels(destination, selectedCategory);
  }, [destination, selectedCategory]);

  const fetchHotels = async (dest: string, cat: string) => {
    setLoading(true);
    setActiveLocation(dest);
    try {
      const data = await HotelService.searchHotels(dest, cat);
      setHotels(data || []);
    } catch (err) {
      console.error('Failed to fetch hotels', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchHotels(searchQuery.trim(), selectedCategory);
    }
  };

  return (
    <div className="glass-panel p-6 space-y-6 border-sky-500/20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-extrabold text-slate-100 text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" /> Google Maps Nearby Hotels & Stays
          </h3>
          <p className="text-xs text-slate-400">
            Verified Google place details, accommodation images, nightly prices, and direct booking links for{' '}
            <span className="text-sky-300 font-semibold">{activeLocation}</span>
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location or city..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>
          <button type="submit" className="glass-button text-xs py-2 px-4 cursor-pointer">
            Search
          </button>
        </form>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5 text-sky-400" /> Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 border ${
              selectedCategory === cat
                ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Hotel Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 bg-slate-950/60 rounded-2xl border border-slate-800/60" />
          ))}
        </div>
      ) : hotels.length === 0 ? (
        <div className="p-8 text-center glass-panel space-y-2">
          <p className="text-sm font-semibold text-slate-300">No hotels found for {searchQuery}</p>
          <p className="text-xs text-slate-400">Try adjusting your search query or selecting 'All' category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
};
