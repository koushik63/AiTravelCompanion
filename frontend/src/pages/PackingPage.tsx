import React, { useState, useEffect } from 'react';
import { Luggage, Sparkles, Bot, RefreshCw } from 'lucide-react';
import { AIService } from '../services/api';
import { useTravelStore } from '../store/useTravelStore';
import { PackingChecklist } from '../components/packing/PackingChecklist';
import { PackingItem } from '../types';

export const PackingPage: React.FC = () => {
  const { trips, activeTrip } = useTravelStore();
  const initialDestination = activeTrip?.destination || (trips[0]?.destination || 'Goa');

  const [targetDestination, setTargetDestination] = useState<string>(initialDestination);
  const [travelStyle, setTravelStyle] = useState<string>('Leisure');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [items, setItems] = useState<PackingItem[]>([
    { id: 'p1', tripId: 'trip_1', category: 'Essentials', itemName: 'Passport & Identity Cards', isPacked: true, quantity: 1 },
    { id: 'p2', tripId: 'trip_1', category: 'Clothing', itemName: 'Light Cotton Shirts & Shorts', isPacked: false, quantity: 4 },
    { id: 'p3', tripId: 'trip_1', category: 'Toiletries', itemName: 'SPF 50+ Sunscreen Lotion', isPacked: true, quantity: 1 },
    { id: 'p4', tripId: 'trip_1', category: 'Electronics', itemName: 'Universal Charging Adapter & Cable', isPacked: false, quantity: 2 }
  ]);

  const handleGenerateAIPacking = async () => {
    setIsGenerating(true);
    try {
      const res = await AIService.generatePackingList({
        destination: targetDestination,
        travelStyle
      });
      if (res && res.items && Array.isArray(res.items)) {
        const generatedItems: PackingItem[] = res.items.map((it: any, idx: number) => ({
          id: `ai_p_${Date.now()}_${idx}`,
          tripId: activeTrip?.id || 'trip_1',
          category: it.category || 'Essentials',
          itemName: it.itemName || it.name || 'Travel Item',
          isPacked: false,
          quantity: 1
        }));
        setItems(generatedItems);
      }
    } catch (err) {
      console.error('Failed to generate AI packing list', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPacked: !item.isPacked } : item))
    );
  };

  const handleAddItem = (itemName: string, category: string) => {
    const newItem: PackingItem = {
      id: `p_${Date.now()}`,
      tripId: activeTrip?.id || 'trip_1',
      category,
      itemName,
      isPacked: false,
      quantity: 1
    };
    setItems((prev) => [newItem, ...prev]);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Luggage className="w-6 h-6 text-sky-400" /> Smart Packing Assistant
          </h1>
          <p className="text-xs text-slate-400">Destination-adaptive packing checklist customized for {targetDestination}</p>
        </div>

        {/* AI Packing Bot Controls */}
        <div className="flex flex-wrap items-center gap-2.5 bg-slate-900 border border-sky-500/30 p-2.5 rounded-2xl">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Bot className="w-4 h-4 text-amber-400" />
            <input
              type="text"
              value={targetDestination}
              onChange={(e) => setTargetDestination(e.target.value)}
              placeholder="Destination..."
              className="bg-slate-950 text-slate-100 placeholder-slate-500 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none w-32"
            />
          </div>

          <select
            value={travelStyle}
            onChange={(e) => setTravelStyle(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
          >
            <option value="Leisure">Beach & Leisure</option>
            <option value="Cold Weather">Cold Mountain</option>
            <option value="Adventure">Adventure Trek</option>
            <option value="Business">Business Formal</option>
          </select>

          <button
            onClick={handleGenerateAIPacking}
            disabled={isGenerating}
            className="glass-button text-xs py-1.5 px-4 flex items-center gap-1.5 shadow-lg shadow-sky-500/20 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" /> AI Bot Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Generate AI List
              </>
            )}
          </button>
        </div>
      </div>

      <PackingChecklist items={items} onToggle={handleToggle} onAddItem={handleAddItem} />
    </div>
  );
};
