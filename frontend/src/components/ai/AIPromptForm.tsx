import React, { useState } from 'react';
import { Sparkles, MapPin, Calendar, DollarSign, Compass, Users } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { AIPromptInput } from '../../types';

interface AIPromptFormProps {
  onSubmit: (input: AIPromptInput) => void;
  isLoading?: boolean;
}

export const AIPromptForm: React.FC<AIPromptFormProps> = ({ onSubmit, isLoading }) => {
  const [destination, setDestination] = useState('Goa, India');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 345600000).toISOString().split('T')[0]);
  const [travelersCount, setTravelersCount] = useState(2);
  const [budget, setBudget] = useState(40000);
  const [currency, setCurrency] = useState('INR');
  const [travelStyle, setTravelStyle] = useState<any>('Leisure');
  const [foodPreferences, setFoodPreferences] = useState('Vegetarian & Seafood');
  const [mustVisitPlaces, setMustVisitPlaces] = useState('Baga Beach, Fort Aguada');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      destination,
      startDate,
      endDate,
      travelersCount: Number(travelersCount),
      budget: Number(budget),
      currency,
      travelStyle,
      foodPreferences,
      mustVisitPlaces
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> AI Travel Generator
          </h2>
          <p className="text-xs text-slate-400">Configure parameters for Gemini AI itinerary synthesis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Destination (City/State/Country)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          placeholder="e.g. Jaipur, Rajasthan or Tokyo, Japan"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Travelers" type="number" min={1} value={travelersCount} onChange={(e) => setTravelersCount(Number(e.target.value))} required />
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Travel Style</label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            >
              <option value="Leisure">Leisure</option>
              <option value="Solo">Solo</option>
              <option value="Family">Family</option>
              <option value="Business">Business</option>
              <option value="Adventure">Adventure</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Total Budget" type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} required />
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>

        <Input label="Food & Dining Preferences" value={foodPreferences} onChange={(e) => setFoodPreferences(e.target.value)} placeholder="e.g. Vegetarian, Seafood, Local Cafes" />
        <Input label="Must-Visit Landmarks" value={mustVisitPlaces} onChange={(e) => setMustVisitPlaces(e.target.value)} placeholder="e.g. Forts, Palaces, Beaches" />
      </div>

      <div className="pt-2 border-t border-slate-800 flex justify-end">
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto py-3 px-8 text-xs flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> {isLoading ? 'Synthesizing...' : 'Generate AI Itinerary'}
        </Button>
      </div>
    </form>
  );
};
