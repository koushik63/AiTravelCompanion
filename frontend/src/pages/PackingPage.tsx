import React, { useState, useEffect } from 'react';
import { Luggage } from 'lucide-react';
import { TripService } from '../services/api';
import { useTravelStore } from '../store/useTravelStore';
import { PackingChecklist } from '../components/packing/PackingChecklist';
import { PackingItem } from '../types';

export const PackingPage: React.FC = () => {
  const { activeTrip } = useTravelStore();
  const [items, setItems] = useState<PackingItem[]>([
    { id: 'p1', tripId: 'trip_1', category: 'Essentials', itemName: 'Passport & Identity Cards', isPacked: true, quantity: 1 },
    { id: 'p2', tripId: 'trip_1', category: 'Clothing', itemName: 'Light Cotton Shirts & Shorts', isPacked: false, quantity: 4 },
    { id: 'p3', tripId: 'trip_1', category: 'Toiletries', itemName: 'SPF 50+ Sunscreen Lotion', isPacked: true, quantity: 1 },
    { id: 'p4', tripId: 'trip_1', category: 'Electronics', itemName: 'Universal Charging Adapter & Cable', isPacked: false, quantity: 2 }
  ]);

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
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <Luggage className="w-6 h-6 text-sky-400" /> Smart Packing Assistant
        </h1>
        <p className="text-xs text-slate-400">Destination-adaptive packing checklist customized for {activeTrip?.destination || 'your trip'}</p>
      </div>

      <PackingChecklist items={items} onToggle={handleToggle} onAddItem={handleAddItem} />
    </div>
  );
};
