import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Plane, Train, Check } from 'lucide-react';
import { searchLocationSuggestions, LocationItem } from '../../utils/locationResolver';

interface LocationAutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string, selectedItem?: LocationItem) => void;
  placeholder: string;
  mode: 'FLIGHT' | 'TRAIN';
  iconColor?: string;
  error?: boolean;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  label,
  value,
  onChange,
  placeholder,
  mode,
  iconColor = 'text-sky-400',
  error = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim().length >= 1) {
      const items = searchLocationSuggestions(value, mode);
      setSuggestions(items);
    } else {
      setSuggestions([]);
    }
  }, [value, mode]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: LocationItem) => {
    onChange(item.city, item);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="space-y-1.5 relative">
      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
        {mode === 'FLIGHT' ? <Plane className={`w-4 h-4 ${iconColor}`} /> : <Train className={`w-4 h-4 ${iconColor}`} />}
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-xs font-bold transition-all focus:outline-none ${
            error
              ? 'border-rose-500/80 text-rose-300 focus:border-rose-500 shadow-lg shadow-rose-500/10'
              : 'border-slate-800 text-slate-100 focus:border-sky-500'
          }`}
        />

        {isOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto backdrop-blur-xl">
            {suggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full px-4 py-3 text-left hover:bg-slate-800/80 flex items-center justify-between border-b border-slate-800/60 last:border-0 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400">
                    {item.type === 'AIRPORT' ? <Plane className="w-4 h-4 text-sky-400" /> : <Train className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      <span>{item.city}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        {item.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[220px] sm:max-w-xs">{item.name}</p>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-slate-500">{item.countryOrState}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
